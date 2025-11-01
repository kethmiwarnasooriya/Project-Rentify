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
        userService.deleteCurrentUserAccount();
        log.info("User account deleted successfully");
        return ResponseEntity.noContent().build();
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
}