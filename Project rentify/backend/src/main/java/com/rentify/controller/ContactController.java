package com.rentify.controller;

import com.rentify.dto.ContactDto;
import com.rentify.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@Slf4j
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitContactForm(@Valid @RequestBody ContactDto contactDto) {
        log.info("Contact form submission received from: {}", contactDto.getEmail());
        
        try {
            Long contactId = contactService.saveContactMessage(contactDto);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Thank you for contacting us! We'll get back to you soon.",
                "contactId", contactId
            );
            
            log.info("Contact form processed successfully with ID: {}", contactId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Error processing contact form from {}: {}", contactDto.getEmail(), e.getMessage());
            
            Map<String, Object> response = Map.of(
                "success", false,
                "message", "Sorry, there was an error processing your message. Please try again later."
            );
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}