package com.rentify.service;



import com.rentify.dto.RegisterDto;
import com.rentify.entity.Role;
import com.rentify.entity.User;
import com.rentify.exception.BadRequestException;
import com.rentify.repository.RoleRepository;
import com.rentify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional // Ensures the operation is atomic
    public User registerUser(RegisterDto registerDto) {
        // Check for existing username
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            log.warn("Registration attempt failed: Username '{}' already exists.", registerDto.getUsername());
            throw new BadRequestException("Username is already taken!");
        }

        // Check for existing email
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            log.warn("Registration attempt failed: Email '{}' already exists.", registerDto.getEmail());
            throw new BadRequestException("Email is already in use!");
        }

        // Create new user's account
        User user = new User();
        user.setFullName(registerDto.getFullName());
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPhone(registerDto.getPhone());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword())); // Encode password

        // Assign roles
        Set<Role> roles = new HashSet<>();
        String roleName;
        // Default to TENANT if role is invalid or not OWNER
        if ("owner".equalsIgnoreCase(registerDto.getRole())) {
            roleName = "ROLE_OWNER";
        } else {
            roleName = "ROLE_TENANT"; // Default role
        }

        log.debug("Assigning role '{}' to new user '{}'", roleName, registerDto.getUsername());
        Role userRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> {
                    log.error("Role '{}' not found in database during registration for user '{}'", roleName, registerDto.getUsername());
                    // This indicates a setup issue (data.sql might not have run or roles are missing)
                    return new RuntimeException("Error: Default role configuration is missing.");
                });
        roles.add(userRole);
        user.setRoles(roles);

        // Save the user
        User savedUser = userRepository.save(user);
        log.info("User '{}' registered successfully with ID {} and role {}", savedUser.getUsername(), savedUser.getId(), roleName);
        return savedUser;
    }

    @Transactional
    public User registerAdminUser(RegisterDto registerDto) {
        // Check for existing username
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            log.warn("Admin registration attempt failed: Username '{}' already exists.", registerDto.getUsername());
            throw new BadRequestException("Username is already taken!");
        }

        // Check for existing email
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            log.warn("Admin registration attempt failed: Email '{}' already exists.", registerDto.getEmail());
            throw new BadRequestException("Email is already in use!");
        }

        // Create new admin user's account
        User user = new User();
        user.setFullName(registerDto.getFullName());
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPhone(registerDto.getPhone());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword())); // Encode password

        // Assign admin role
        Set<Role> roles = new HashSet<>();
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> {
                    log.error("ROLE_ADMIN not found in database during admin registration for user '{}'", registerDto.getUsername());
                    return new RuntimeException("Error: Admin role configuration is missing.");
                });
        roles.add(adminRole);
        user.setRoles(roles);

        // Save the admin user
        User savedUser = userRepository.save(user);
        log.info("Admin user '{}' registered successfully with ID {}", savedUser.getUsername(), savedUser.getId());
        return savedUser;
    }
}