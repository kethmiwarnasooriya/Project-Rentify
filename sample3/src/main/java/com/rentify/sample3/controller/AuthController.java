package com.rentify.sample3.controller;

import com.rentify.sample3.dto.LoginRequest;
import com.rentify.sample3.dto.SignupRequest;
import com.rentify.sample3.model.User;
import com.rentify.sample3.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.frontend.url}", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        User user = new User();
        user.setName(req.getName());
        user.setUsername(req.getUsername());
        user.setContactNumber(req.getContactNumber());
        user.setEmail(req.getEmail());
        user.setPassword(req.getPassword());
        user.setRole(req.getRole());
        authService.register(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletRequest request) {
        try {
            User user = authService.login(req.getUsername(), req.getPassword());
            HttpSession session = request.getSession(true);
            session.setAttribute("user", user);
            return ResponseEntity.ok(user);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) session.invalidate();
        return ResponseEntity.ok("User logged out successfully");
    }

    @GetMapping("/session")
    public ResponseEntity<?> getSessionUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null)
            return ResponseEntity.status(401).body("Not logged in");
        return ResponseEntity.ok(session.getAttribute("user"));
    }
}
