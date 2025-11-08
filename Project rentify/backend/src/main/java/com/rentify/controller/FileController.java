package com.rentify.controller;



// ... (imports as listed in the previous response) ...
import com.rentify.dto.FileUploadResponse;
import com.rentify.service.FileStorageService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Logging
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException; // Added

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<FileUploadResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            log.warn("Upload request received with empty file.");
            return ResponseEntity.badRequest().build(); // Consider returning an error message DTO
        }
        log.info("Received file upload request: {}", file.getOriginalFilename());
        String filename = fileStorageService.storeFile(file);
        log.info("File stored successfully as: {}", filename);

        // Build the URL that the frontend can use to retrieve the file via the GET endpoint below
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/files/") // Match the mapping of the downloadFile method
                .path(filename)
                .toUriString();

        return ResponseEntity.ok(new FileUploadResponse(filename, fileDownloadUri));
    }

    // This endpoint serves the uploaded files
    @GetMapping("/{filename:.+}") // :.+ is important to match filenames with extensions
    public ResponseEntity<org.springframework.core.io.Resource> downloadFile(@PathVariable String filename, HttpServletRequest request) {
        log.debug("Request received to serve file: {}", filename);
        org.springframework.core.io.Resource resource = fileStorageService.loadFileAsResource(filename);

        // Determine content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            log.debug("Determined contentType for {}: {}", filename, contentType);
        } catch (IOException ex) {
            // Log this but don't fail the request
            log.warn("Could not determine file type for: {}", filename);
        }

        // Default content type if unknown
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                // "inline" tries to display in browser (good for images/PDFs)
                // "attachment" forces download prompt
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}