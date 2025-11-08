package com.rentify.dto;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponse {
    private String filename; // The unique filename stored on the server
    private String url;      // The full URL to access the uploaded file
}