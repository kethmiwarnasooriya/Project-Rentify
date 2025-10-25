package com.rentify.sample3.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "${app.frontend.url}", allowCredentials = "true")
public class FileController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<?> uploadFile(@RequestPart("file") MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String filename = System.currentTimeMillis() + "_" + originalFilename;
            Path target = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/uploads/" + filename;
            return ResponseEntity.ok(imageUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        }
    }
}
