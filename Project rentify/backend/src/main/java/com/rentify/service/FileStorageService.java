package com.rentify.service;



import com.rentify.exception.FileStorageException;
import com.rentify.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct; // Correct import for PostConstruct
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils; // For deleting directories if needed
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Stream; // For listing files if needed

@Service
@Slf4j
public class FileStorageService {

    private final Path fileStorageLocation;

    // Inject the upload directory path from application.properties
    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        // Resolve the absolute path and normalize it (removes redundant parts like ".")
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        log.info("File storage location initialized at: {}", this.fileStorageLocation);

        try {
            // Create the directory if it doesn't exist
            Files.createDirectories(this.fileStorageLocation);
            log.info("Upload directory ensured at: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            log.error("Could not create the upload directory: {}", this.fileStorageLocation, ex);
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Sanitize and get original filename
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        log.debug("Processing file for storage: {}", originalFilename);

        try {
            // Basic validation
            if (file.isEmpty()) {
                throw new FileStorageException("Failed to store empty file " + originalFilename);
            }
            if (originalFilename.contains("..")) {
                // Security check: Prevent directory traversal attacks
                throw new FileStorageException("Cannot store file with relative path outside current directory " + originalFilename);
            }

            // Extract file extension
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename.substring(dotIndex);
            }

            // Generate a unique filename to prevent collisions and potential security issues
            String storedFilename = UUID.randomUUID().toString() + fileExtension;

            // Resolve the final path within the upload directory
            Path targetLocation = this.fileStorageLocation.resolve(storedFilename);

            // Copy the file to the target location, replacing existing file with the same name (if any)
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
                log.info("Successfully stored file {} as {}", originalFilename, storedFilename);
            }

            return storedFilename; // Return the generated filename

        } catch (IOException ex) {
            log.error("Could not store file {}. Error: {}", originalFilename, ex.getMessage(), ex);
            throw new FileStorageException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String filename) {
        try {
            // Resolve the filename against the storage location
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            // Check if the resource exists and is readable
            if (resource.exists() && resource.isReadable()) {
                log.debug("Resource found and readable: {}", filename);
                return resource;
            } else {
                log.warn("Resource not found or not readable: {}", filename);
                throw new ResourceNotFoundException("File not found " + filename);
            }
        } catch (MalformedURLException ex) {
            log.error("Malformed URL exception for file {}: {}", filename, ex.getMessage(), ex);
            throw new ResourceNotFoundException("File not found " + filename, ex);
        }
    }

    public void deleteFile(String filename) {
        if (!StringUtils.hasText(filename)) {
            log.warn("Attempted to delete file with empty or null filename.");
            return; // Avoid errors with blank filenames
        }
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                log.info("Successfully deleted file: {}", filename);
            } else {
                log.warn("Attempted to delete file, but it did not exist: {}", filename);
            }
        } catch (IOException ex) {
            // Log this error but don't necessarily throw an exception that stops other processes (like DB deletion)
            log.error("Could not delete file: {}. Error: {}", filename, ex.getMessage(), ex);
            // Optionally re-throw as FileStorageException if deletion is critical
            // throw new FileStorageException("Could not delete file " + filename + ". Please try again!", ex);
        }
    }

    // Optional: Method to delete all files (e.g., for cleanup) - USE WITH CAUTION
    public void deleteAll() {
        log.warn("Attempting to delete all files in upload directory: {}", fileStorageLocation);
        FileSystemUtils.deleteRecursively(fileStorageLocation.toFile());
        // Recreate the directory after deleting
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("Recreated upload directory after deletion: {}", this.fileStorageLocation);
        } catch (Exception ex) {
            log.error("Could not recreate the upload directory after deletion: {}", this.fileStorageLocation, ex);
            throw new FileStorageException("Could not recreate the upload directory.", ex);
        }
    }

    // Optional: Method to load all filenames (e.g., for admin panel)
    public Stream<Path> loadAll() {
        try {
            return Files.walk(this.fileStorageLocation, 1) // Walk only one level deep
                    .filter(path -> !path.equals(this.fileStorageLocation)) // Exclude the root directory itself
                    .map(this.fileStorageLocation::relativize); // Get relative paths
        } catch (IOException e) {
            log.error("Failed to read stored files", e);
            throw new FileStorageException("Failed to read stored files", e);
        }
    }
}