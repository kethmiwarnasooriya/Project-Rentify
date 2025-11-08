package com.rentify.controller;



// ... (imports as listed in the previous response) ...
import com.rentify.dto.UpdateUserDto;
import com.rentify.dto.UserDto;
import com.rentify.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Logging
import org.springframework.http.HttpStatus; // Added
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    // Endpoint to get the currently authenticated user's details
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        log.debug("Request received for current user details '/api/users/me'");
        UserDto userDto = userService.getCurrentUserDto();
        // The service layer throws exceptions if user not found, SecurityConfig ensures user is authenticated
        return ResponseEntity.ok(userDto);
    }

    // Endpoint to update the currently authenticated user's profile
    @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUser(@Valid @RequestBody UpdateUserDto updateUserDto) {
        log.info("Request received to update current user profile '/api/users/me'");
        UserDto updatedUser = userService.updateUserProfile(updateUserDto);
        log.info("User profile updated successfully for user '{}'", updatedUser.getUsername());
        return ResponseEntity.ok(updatedUser);
    }

    // Endpoint to delete the currently authenticated user's account
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser() {
        log.info("Request received to delete current user account '/api/users/me'");
        try {
            userService.deleteCurrentUserAccount();
            log.info("User account deleted successfully");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting user account: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to delete user account: " + e.getMessage());
        }
    }

    // Endpoint to get user's contact messages with replies
    @GetMapping("/me/messages")
    public ResponseEntity<?> getUserMessages() {
        log.info("Request received to get current user's messages");
        try {
            java.util.List<com.rentify.entity.Contact> messages = userService.getUserMessages();
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            log.error("Error fetching user messages: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Failed to fetch messages"));
        }
    }



    // Add endpoints for updating user profile if needed
    /*
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()") // Ensure user is logged in
    public ResponseEntity<UserDto> updateProfile(@Valid @RequestBody UpdateUserDto updateUserDto) {
        log.info("Request received to update profile for current user");
        UserDto updatedUser = userService.updateUserProfile(updateUserDto);
        log.info("Profile updated successfully for user {}", updatedUser.getUsername());
        return ResponseEntity.ok(updatedUser);
    }
    */

    // Emergency endpoint to create admin user - REMOVE IN PRODUCTION
    @PostMapping("/create-emergency-admin")
    public ResponseEntity<String> createEmergencyAdmin() {
        log.warn("Emergency admin creation endpoint called");
        try {
            String result = userService.createEmergencyAdmin();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error creating emergency admin: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating admin: " + e.getMessage());
        }
    }

    // Emergency endpoint to fix admin roles - REMOVE IN PRODUCTION
    @PostMapping("/fix-admin-roles")
    public ResponseEntity<String> fixAdminRoles() {
        log.warn("Fix admin roles endpoint called");
        try {
            String result = userService.fixAdminRoles();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fixing admin roles: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fixing admin roles: " + e.getMessage());
        }
    }
}