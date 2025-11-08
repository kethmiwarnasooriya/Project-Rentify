package com.rentify.service;

import com.rentify.dto.AdminPropertyDto;
import com.rentify.dto.UserDto;
import com.rentify.entity.Contact;
import com.rentify.entity.Property;
import com.rentify.entity.Role;
import com.rentify.entity.User;
import com.rentify.exception.ResourceNotFoundException;
import com.rentify.repository.ContactRepository;
import com.rentify.repository.PropertyRepository;
import com.rentify.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final ContactRepository contactRepository;

    public Page<UserDto> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(this::convertToUserDto);
    }

    public List<UserDto> getUsersByRole(String roleName) {
        List<User> users = userRepository.findByRoles_Name(roleName);
        return users.stream()
                .map(this::convertToUserDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertToUserDto(user);
    }

    public Page<AdminPropertyDto> getAllProperties(Pageable pageable) {
        log.info("Fetching all properties from database with pageable: {}", pageable);
        Page<Property> properties = propertyRepository.findAll(pageable);
        log.info("Retrieved {} properties from database", properties.getTotalElements());
        return properties.map(this::convertToAdminPropertyDto);
    }

    public List<Property> getPropertiesByOwner(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + ownerId));
        return propertyRepository.findByOwnerId(ownerId);
    }

    public Page<Contact> getAllMessages(Pageable pageable) {
        log.info("Fetching all messages from database with pageable: {}", pageable);
        Page<Contact> messages = contactRepository.findAllByOrderByCreatedAtDesc(pageable);
        log.info("Retrieved {} messages from database", messages.getTotalElements());
        return messages;
    }

    public List<Contact> getMessagesByStatus(String status) {
        log.info("Fetching messages with status: {}", status);
        List<Contact> messages = contactRepository.findByStatusOrderByCreatedAtDesc(status);
        log.info("Retrieved {} messages with status {}", messages.size(), status);
        return messages;
    }

    public Contact updateMessageStatus(Long messageId, String status) {
        Contact contact = contactRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + messageId));
        contact.setStatus(status);
        return contactRepository.save(contact);
    }

    public Contact replyToMessage(Long messageId, String replyText) {
        log.info("Admin replying to message ID: {}", messageId);
        Contact contact = contactRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + messageId));
        
        contact.setReply(replyText);
        contact.setRepliedAt(new java.sql.Timestamp(System.currentTimeMillis()));
        contact.setStatus("replied");
        
        Contact savedContact = contactRepository.save(contact);
        log.info("Reply saved successfully for message ID: {}", messageId);
        return savedContact;
    }

    public AdminStats getAdminStats() {
        long totalUsers = userRepository.count();
        long totalOwners = userRepository.countByRoles_Name("ROLE_OWNER");
        long totalTenants = userRepository.countByRoles_Name("ROLE_TENANT");
        long totalProperties = propertyRepository.count();
        long totalMessages = contactRepository.count();
        long unreadMessages = contactRepository.countByStatus("new");

        return new AdminStats(totalUsers, totalOwners, totalTenants, totalProperties, totalMessages, unreadMessages);
    }

    private UserDto convertToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setCreatedAt(user.getCreatedAt());
        
        // Convert roles to string list
        List<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        dto.setRoles(roleNames);
        
        return dto;
    }

    private AdminPropertyDto convertToAdminPropertyDto(Property property) {
        AdminPropertyDto dto = new AdminPropertyDto();
        dto.setId(property.getId());
        dto.setTitle(property.getTitle());
        dto.setDescription(property.getDescription());
        dto.setLocation(property.getLocation());
        dto.setPrice(property.getPrice());
        dto.setContact(property.getContact());
        dto.setBedrooms(property.getBedrooms());
        dto.setBathrooms(property.getBathrooms());
        dto.setArea(property.getArea());
        dto.setPropertyType(property.getPropertyType());
        dto.setStatus(property.getStatus());
        dto.setCreatedAt(property.getCreatedAt());
        
        // Set owner information without circular reference
        if (property.getOwner() != null) {
            dto.setOwnerId(property.getOwner().getId());
            dto.setOwnerName(property.getOwner().getFullName());
            dto.setOwnerEmail(property.getOwner().getEmail());
            dto.setOwnerUsername(property.getOwner().getUsername());
        }
        
        return dto;
    }

    @Data
    @AllArgsConstructor
    public static class AdminStats {
        private long totalUsers;
        private long totalOwners;
        private long totalTenants;
        private long totalProperties;
        private long totalMessages;
        private long unreadMessages;
    }
}