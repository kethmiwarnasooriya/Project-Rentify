package com.rentify.service;



import com.rentify.dto.UpdateUserDto;
import com.rentify.dto.UserDto;
import com.rentify.entity.Contact;
import com.rentify.entity.Property;
import com.rentify.entity.Reservation;
import com.rentify.entity.Role; // Import Role
import com.rentify.entity.User;
import com.rentify.exception.BadRequestException;
import com.rentify.exception.ResourceNotFoundException;
import com.rentify.repository.PropertyRepository;
import com.rentify.repository.ReservationRepository;
import com.rentify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Logging
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // For read-only transactions

import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final FileStorageService fileStorageService;
    private final com.rentify.repository.ContactRepository contactRepository;
    private final ReservationRepository reservationRepository;
    private final com.rentify.repository.RoleRepository roleRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    /**
     * Retrieves the currently authenticated User entity from the database.
     * Relies on Spring Security's SecurityContextHolder.
     *
     * @return The authenticated User entity.
     * @throws ResourceNotFoundException if the authenticated user cannot be found in the database (should not happen in normal flow).
     * @throws IllegalStateException if there is no authenticated user.
     */
    @Transactional(readOnly = true) // Good practice for read operations
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            log.warn("Attempted to get current user, but no user is authenticated.");
            // Depending on use case, could return null or throw specific exception
            throw new IllegalStateException("No authenticated user found in security context.");
        }

        String username;
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            username = (String) principal; // Should not happen with UserDetailsServiceImpl but handle defensively
        } else {
            log.error("Unexpected principal type found in SecurityContext: {}", principal.getClass().getName());
            throw new IllegalStateException("Could not determine username from principal.");
        }

        log.debug("Retrieving user details from repository for username: {}", username);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.error("Authenticated user '{}' not found in the database!", username);
                    // This indicates a potential inconsistency between security context and DB state
                    return new ResourceNotFoundException("Authenticated user not found in database: " + username);
                });
    }

    /**
     * Retrieves the DTO representation of the currently authenticated user.
     *
     * @return UserDto containing details of the logged-in user.
     * @throws IllegalStateException if no user is authenticated.
     */
    @Transactional(readOnly = true)
    public UserDto getCurrentUserDto() {
        User user = getCurrentUser(); // This will throw if not authenticated
        return mapToUserDto(user);
    }

    /**
     * Updates the profile information of the currently authenticated user.
     *
     * @param updateUserDto DTO containing the updated user information
     * @return UserDto with the updated user information
     * @throws IllegalStateException if no user is authenticated
     * @throws BadRequestException if email is already in use by another user
     */
    @Transactional
    public UserDto updateUserProfile(UpdateUserDto updateUserDto) {
        User currentUser = getCurrentUser();
        log.info("Updating profile for user '{}'", currentUser.getUsername());

        // Update changeable fields
        if (updateUserDto.getFullName() != null) {
            currentUser.setFullName(updateUserDto.getFullName().trim());
        }
        
        if (updateUserDto.getPhone() != null) {
            currentUser.setPhone(updateUserDto.getPhone().trim());
        }
        
        // Handle email change carefully - might require re-verification
        if (updateUserDto.getEmail() != null) {
            String newEmail = updateUserDto.getEmail().trim();
            if (!currentUser.getEmail().equals(newEmail)) {
                String oldEmail = currentUser.getEmail();
                if (userRepository.existsByEmail(newEmail)) {
                    log.warn("User '{}' attempted to change email to '{}' which is already in use", 
                            currentUser.getUsername(), newEmail);
                    throw new BadRequestException("Email is already in use by another account.");
                }
                currentUser.setEmail(newEmail);
                log.info("Email updated for user '{}' from '{}' to '{}'", 
                        currentUser.getUsername(), oldEmail, newEmail);
            } else {
                log.debug("Email unchanged for user '{}'", currentUser.getUsername());
            }
        }

        User updatedUser = userRepository.save(currentUser);
        log.info("Profile updated successfully for user '{}'", updatedUser.getUsername());
        return mapToUserDto(updatedUser);
    }

    // Helper method to convert User entity to UserDto
    private UserDto mapToUserDto(User user) {
        if (user == null) {
            return null;
        }
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                roleNames,
                user.getCreatedAt()
        );
    }

    /**
     * Deletes the currently authenticated user's account and all associated data.
     * This includes deleting all properties owned by the user and their associated files.
     */
    @Transactional
    public void deleteCurrentUserAccount() {
        User currentUser = getCurrentUser();
        log.info("Starting account deletion process for user '{}'", currentUser.getUsername());
        
        // First, get all properties owned by this user
        List<Property> userProperties = propertyRepository.findByOwnerId(currentUser.getId());
        log.debug("Found {} properties owned by user '{}'", userProperties.size(), currentUser.getUsername());
        
        // Delete all properties and their associated files
        for (Property property : userProperties) {
            log.debug("Deleting property '{}' (ID: {}) and its files", property.getTitle(), property.getId());
            
            // Delete associated image files
            if (property.getImageFilenames() != null && !property.getImageFilenames().isEmpty()) {
                for (String filename : property.getImageFilenames()) {
                    try {
                        fileStorageService.deleteFile(filename);
                        log.debug("Deleted file: {}", filename);
                    } catch (Exception e) {
                        log.error("Error deleting file {} during account deletion: {}", filename, e.getMessage());
                        // Continue with deletion even if file deletion fails
                    }
                }
            }
            
            // Delete the property entity
            propertyRepository.delete(property);
            log.debug("Deleted property '{}' (ID: {})", property.getTitle(), property.getId());
        }
        
        // Delete all reservations where this user is the tenant
        List<Reservation> userReservations = reservationRepository.findByTenantIdOrderByCreatedAtDesc(currentUser.getId());
        log.debug("Found {} reservations where user '{}' is the tenant", userReservations.size(), currentUser.getUsername());
        
        for (Reservation reservation : userReservations) {
            reservationRepository.delete(reservation);
            log.debug("Deleted reservation ID: {}", reservation.getId());
        }
        
        // Delete all contact messages associated with this user
        List<Contact> userContacts = contactRepository.findByUserOrEmailOrderByCreatedAtDesc(currentUser, currentUser.getEmail());
        log.debug("Found {} contact messages associated with user '{}'", userContacts.size(), currentUser.getUsername());
        
        for (Contact contact : userContacts) {
            contactRepository.delete(contact);
            log.debug("Deleted contact message ID: {}", contact.getId());
        }
        
        // Clear user roles to avoid foreign key constraint issues
        currentUser.getRoles().clear();
        userRepository.save(currentUser);
        log.debug("Cleared roles for user '{}'", currentUser.getUsername());
        
        // Delete the user account
        log.debug("Deleting user account for '{}'", currentUser.getUsername());
        userRepository.delete(currentUser);
        
        log.info("Account deletion completed successfully for user '{}'. Deleted {} properties, {} reservations, and {} contact messages.", 
                currentUser.getUsername(), userProperties.size(), userReservations.size(), userContacts.size());
    }

    /**
     * Retrieves all contact messages for the currently authenticated user.
     * Returns messages where the user is linked or messages sent from their email.
     *
     * @return List of Contact messages
     */
    @Transactional(readOnly = true)
    public List<com.rentify.entity.Contact> getUserMessages() {
        User currentUser = getCurrentUser();
        log.info("Fetching messages for user '{}'", currentUser.getUsername());
        
        // Get messages linked to this user or sent from their email
        List<com.rentify.entity.Contact> messages = contactRepository.findByUserOrEmailOrderByCreatedAtDesc(
                currentUser, currentUser.getEmail());
        
        log.info("Found {} messages for user '{}'", messages.size(), currentUser.getUsername());
        return messages;
    }



    // Add methods for updating user profile here if needed
    /*
    @Transactional
    public UserDto updateUserProfile(UpdateUserDto dto) {
        User currentUser = getCurrentUser();
        log.info("Updating profile for user '{}'", currentUser.getUsername());

        // Update changeable fields
        currentUser.setFullName(dto.getFullName());
        currentUser.setPhone(dto.getPhone());
        // Handle email change carefully - might require re-verification
        if (!currentUser.getEmail().equals(dto.getEmail())) {
             if (userRepository.existsByEmail(dto.getEmail())) {
                  throw new BadRequestException("Email is already in use by another account.");
             }
             currentUser.setEmail(dto.getEmail());
             // Consider setting an 'emailVerified' flag to false here
        }

        User updatedUser = userRepository.save(currentUser);
        log.info("Profile updated successfully for user '{}'", updatedUser.getUsername());
        return mapToUserDto(updatedUser);
    }
    */

    /**
     * Emergency method to create admin user - REMOVE IN PRODUCTION
     */
    @Transactional
    public String createEmergencyAdmin() {
        log.warn("Creating emergency admin user");
        
        try {
            // Check if admin role exists
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));
            
            // Create new admin user with different username
            String adminUsername = "newadmin";
            String adminPassword = "newadmin123";
            
            // Delete existing admin if exists
            userRepository.findByUsername(adminUsername).ifPresent(user -> {
                log.info("Deleting existing admin user: {}", adminUsername);
                userRepository.delete(user);
            });
            
            User adminUser = new User();
            adminUser.setUsername(adminUsername);
            adminUser.setPassword(passwordEncoder.encode(adminPassword));
            adminUser.setEmail("newadmin@rentify.com");
            adminUser.setFullName("New System Administrator");
            
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            adminUser.setRoles(roles);
            
            userRepository.save(adminUser);
            
            String message = String.format("Emergency admin user created successfully!\nUsername: %s\nPassword: %s", 
                    adminUsername, adminPassword);
            log.warn("Emergency admin created: {} / {}", adminUsername, adminPassword);
            
            return message;
            
        } catch (Exception e) {
            log.error("Failed to create emergency admin: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create emergency admin: " + e.getMessage());
        }
    }

    /**
     * Fix admin roles for existing admin users
     */
    @Transactional
    public String fixAdminRoles() {
        log.warn("Fixing admin roles for existing users");
        
        try {
            // Get admin role
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));
            
            // Find admin users and fix their roles
            List<User> adminUsers = userRepository.findByUsername("admin")
                    .map(List::of)
                    .orElse(List.of());
            
            // Also check for superadmin
            userRepository.findByUsername("superadmin").ifPresent(adminUsers::add);
            
            int fixedCount = 0;
            for (User user : adminUsers) {
                if (!user.getRoles().contains(adminRole)) {
                    user.getRoles().add(adminRole);
                    userRepository.save(user);
                    fixedCount++;
                    log.info("Added ROLE_ADMIN to user: {}", user.getUsername());
                }
            }
            
            String message = String.format("Fixed roles for %d admin users", fixedCount);
            log.info(message);
            return message;
            
        } catch (Exception e) {
            log.error("Failed to fix admin roles: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fix admin roles: " + e.getMessage());
        }
    }
}