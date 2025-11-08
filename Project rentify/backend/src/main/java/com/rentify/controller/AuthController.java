package com.rentify.controller;

import com.rentify.dto.LoginDto;
import com.rentify.dto.RegisterDto;
import com.rentify.dto.UserDto;
import com.rentify.exception.ResourceNotFoundException; // Import if needed for catch block
import com.rentify.service.AuthService;
import com.rentify.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterDto registerDto) {
        log.info("Attempting to register user: {}", registerDto.getUsername());
        try {
            authService.registerUser(registerDto);
            log.info("User registered successfully: {}", registerDto.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
        } catch (RuntimeException e) {
            log.error("Registration failed for user {}: {}", registerDto.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDto loginDto, HttpServletRequest request, HttpServletResponse response) {
        log.info("Attempting login for user: {}", loginDto.getUsername());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword())
            );

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response); // Save context to establish session

            log.info("User logged in successfully: {}", loginDto.getUsername());
            UserDto userDto = userService.getCurrentUserDto(); // Get DTO of the logged-in user
            return ResponseEntity.ok(userDto);

        } catch (BadCredentialsException e) {
            log.warn("Login failed for user {}: Invalid credentials", loginDto.getUsername());
            // Return specific error message for invalid credentials
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            log.error("An unexpected error occurred during login for user {}: {}", loginDto.getUsername(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An internal error occurred during login.");
        }
    }

    // Logout endpoint is handled by Spring Security configuration

    @GetMapping("/status")
    public ResponseEntity<UserDto> getUserStatus() {
        try {
            // Attempt to get the current user DTO
            UserDto currentUserDto = userService.getCurrentUserDto();
            // If successful (user is logged in), return the DTO
            log.debug("Auth status check: User '{}' is logged in.", currentUserDto.getUsername());
            return ResponseEntity.ok(currentUserDto);
        } catch (IllegalStateException | ResourceNotFoundException e) {
            // Catch exceptions thrown by getCurrentUser() when not authenticated or user not found in DB
            log.debug("Auth status check: No user is currently authenticated or found. {}", e.getMessage());
            // Return 200 OK with a null body to indicate "not logged in" clearly to frontend
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            // Catch any other unexpected errors during status check
            log.error("Unexpected error during auth status check: {}", e.getMessage(), e);
            // Return 500 Internal Server Error for unexpected issues
            // Avoid sending sensitive details in the response body for 500 errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody RegisterDto registerDto) {
        log.info("Attempting to register admin user: {}", registerDto.getUsername());
        try {
            authService.registerAdminUser(registerDto);
            log.info("Admin user registered successfully: {}", registerDto.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body("Admin user registered successfully!");
        } catch (RuntimeException e) {
            log.error("Admin registration failed for user {}: {}", registerDto.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}