package com.rentify.dto;



import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Date;
import java.util.Map;

@Data
@AllArgsConstructor
public class ErrorResponseDto {
    private Date timestamp;
    private int status;
    private String error; // e.g., "Not Found", "Bad Request"
    private String message; // Developer/User-friendly message
    private String path; // The request path
    private Map<String, String> validationErrors; // Specific field errors for validation issues

    // Constructor for general errors (without validation map)
    public ErrorResponseDto(Date timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.validationErrors = null; // Ensure it's null if not provided
    }
}