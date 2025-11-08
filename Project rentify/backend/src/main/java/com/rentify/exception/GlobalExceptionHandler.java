package com.rentify.exception;



import com.rentify.dto.ErrorResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j // Add logging
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    // Helper to get request path
    private String getPath(WebRequest request) {
        try {
            if (request instanceof ServletWebRequest servletWebRequest) {
                return servletWebRequest.getRequest().getRequestURI();
            }
        } catch (Exception e) {
            log.warn("Could not retrieve request URI from WebRequest.", e);
        }
        // Fallback or if not an HTTP request
        return request.getDescription(false).replace("uri=", "");
    }

    // Handle specific custom exceptions

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDto> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        log.warn("Resource not found: {} on path {}", ex.getMessage(), getPath(request));
        ErrorResponseDto errorDetails = new ErrorResponseDto(
                new Date(),
                HttpStatus.NOT_FOUND.value(),
                HttpStatus.NOT_FOUND.getReasonPhrase(),
                ex.getMessage(),
                getPath(request)
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponseDto> handleBadRequestException(BadRequestException ex, WebRequest request) {
        log.warn("Bad request: {} on path {}", ex.getMessage(), getPath(request));
        ErrorResponseDto errorDetails = new ErrorResponseDto(
                new Date(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                ex.getMessage(),
                getPath(request)
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ErrorResponseDto> handleFileStorageException(FileStorageException ex, WebRequest request) {
        log.error("File storage error: {} on path {}", ex.getMessage(), getPath(request), ex); // Log full stack trace
        ErrorResponseDto errorDetails = new ErrorResponseDto(
                new Date(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "Could not process file operation. " + ex.getMessage(), // User-friendly part + detail
                getPath(request)
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Handle security exceptions

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDto> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        log.warn("Access Denied: User attempted action without sufficient permissions on path {}. Message: {}", getPath(request), ex.getMessage());
        ErrorResponseDto errorDetails = new ErrorResponseDto(
                new Date(),
                HttpStatus.FORBIDDEN.value(),
                HttpStatus.FORBIDDEN.getReasonPhrase(),
                "Access Denied: You do not have permission to perform this action.", // Standard message
                getPath(request)
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.FORBIDDEN);
    }

    // Handle validation errors from @Valid

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        fieldError -> fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage() : "Invalid value",
                        (existingValue, newValue) -> existingValue // Avoid duplicate key issues
                ));

        log.warn("Validation failed for request on path {}: {}", getPath(request), errors);

        ErrorResponseDto errorDetails = new ErrorResponseDto(
                new Date(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Validation Failed",
                getPath(request),
                errors
        );

        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }


    // Handle any other uncaught exceptions

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGlobalException(Exception ex, WebRequest request) {
        log.error("An unexpected error occurred on path {}: {}", getPath(request), ex.getMessage(), ex); // Log full stack trace

        ErrorResponseDto errorDetails = new ErrorResponseDto(
                new Date(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "An internal server error occurred. Please try again later or contact support.", // User-friendly generic message
                getPath(request)
        );
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}