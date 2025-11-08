package com.rentify.controller;

import com.rentify.dto.AdminPropertyDto;
import com.rentify.dto.UserDto;
import com.rentify.entity.Contact;
import com.rentify.entity.Property;
import com.rentify.entity.User;
import com.rentify.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminController {

    private final AdminService adminService;

    // Get all users with pagination
    @GetMapping("/users")
    public ResponseEntity<Page<UserDto>> getAllUsers(Pageable pageable) {
        Page<UserDto> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    // Get users by role
    @GetMapping("/users/role/{roleName}")
    public ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable String roleName) {
        List<UserDto> users = adminService.getUsersByRole(roleName);
        return ResponseEntity.ok(users);
    }

    // Get all owners
    @GetMapping("/owners")
    public ResponseEntity<List<UserDto>> getAllOwners() {
        List<UserDto> owners = adminService.getUsersByRole("ROLE_OWNER");
        return ResponseEntity.ok(owners);
    }

    // Get all tenants
    @GetMapping("/tenants")
    public ResponseEntity<List<UserDto>> getAllTenants() {
        List<UserDto> tenants = adminService.getUsersByRole("ROLE_TENANT");
        return ResponseEntity.ok(tenants);
    }

    // Get all properties
    @GetMapping("/properties")
    public ResponseEntity<Page<AdminPropertyDto>> getAllProperties(Pageable pageable) {
        log.info("Admin requesting all properties with pageable: {}", pageable);
        Page<AdminPropertyDto> properties = adminService.getAllProperties(pageable);
        log.info("Found {} properties", properties.getTotalElements());
        return ResponseEntity.ok(properties);
    }

    // Get all contact messages
    @GetMapping("/messages")
    public ResponseEntity<Page<Contact>> getAllMessages(Pageable pageable, HttpServletRequest request) {
        log.info("=== ADMIN MESSAGES API CALLED ===");
        log.info("Admin requesting all messages with pageable: {}", pageable);
        log.info("Request URL: {}", request.getRequestURL());
        log.info("Request method: {}", request.getMethod());
        log.info("Session ID: {}", request.getSession().getId());
        
        try {
            Page<Contact> messages = adminService.getAllMessages(pageable);
            log.info("Found {} messages", messages.getTotalElements());
            log.info("Messages content: {}", messages.getContent());
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            log.error("Error fetching messages: ", e);
            throw e;
        }
    }

    // Get messages by status
    @GetMapping("/messages/status/{status}")
    public ResponseEntity<List<Contact>> getMessagesByStatus(@PathVariable String status) {
        log.info("Admin requesting messages with status: {}", status);
        List<Contact> messages = adminService.getMessagesByStatus(status);
        log.info("Found {} messages with status {}", messages.size(), status);
        return ResponseEntity.ok(messages);
    }

    // Update message status
    @PutMapping("/messages/{id}/status")
    public ResponseEntity<Contact> updateMessageStatus(@PathVariable Long id, @RequestParam String status) {
        Contact updatedMessage = adminService.updateMessageStatus(id, status);
        return ResponseEntity.ok(updatedMessage);
    }

    // Reply to message
    @PostMapping("/messages/{id}/reply")
    public ResponseEntity<Contact> replyToMessage(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        log.info("Admin replying to message ID: {}", id);
        String replyText = payload.get("reply");
        
        if (replyText == null || replyText.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Contact repliedMessage = adminService.replyToMessage(id, replyText);
        log.info("Reply sent successfully for message ID: {}", id);
        return ResponseEntity.ok(repliedMessage);
    }

    // Get user details by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // Get properties by owner ID
    @GetMapping("/users/{id}/properties")
    public ResponseEntity<List<Property>> getPropertiesByOwner(@PathVariable Long id) {
        List<Property> properties = adminService.getPropertiesByOwner(id);
        return ResponseEntity.ok(properties);
    }

    // Admin dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<AdminService.AdminStats> getAdminStats() {
        AdminService.AdminStats stats = adminService.getAdminStats();
        return ResponseEntity.ok(stats);
    }
}