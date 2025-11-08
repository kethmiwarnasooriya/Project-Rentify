package com.rentify.service;


import com.rentify.dto.CreatePropertyDto;
import com.rentify.dto.PropertyDto;
import com.rentify.entity.Property;
import com.rentify.entity.User;
import com.rentify.exception.ResourceNotFoundException;
import com.rentify.repository.PropertyRepository;
import com.rentify.specification.PropertySpecification; // Ensure this import is correct
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification; // Import Specification
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList; // Added for list of specifications
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    @Transactional
    public PropertyDto createProperty(CreatePropertyDto dto) {
        User currentUser = userService.getCurrentUser();

        boolean isOwner = currentUser.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_OWNER"));
        if (!isOwner) {
            log.warn("User '{}' attempted to create property without ROLE_OWNER.", currentUser.getUsername());
            throw new AccessDeniedException("Only property owners can list properties.");
        }

        log.debug("Mapping CreatePropertyDto to Property entity for user '{}'", currentUser.getUsername());
        Property property = new Property();
        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setLocation(dto.getLocation());
        property.setPrice(dto.getPrice());
        property.setContact(dto.getContact());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setArea(dto.getArea());
        property.setPropertyType(dto.getPropertyType());
        if (!CollectionUtils.isEmpty(dto.getImageFilenames())) {
            property.setImageFilenames(dto.getImageFilenames());
        }
        property.setOwner(currentUser);
        property.setStatus("active");

        Property savedProperty = propertyRepository.save(property);
        log.info("Property '{}' (ID: {}) created successfully by owner '{}'.", savedProperty.getTitle(), savedProperty.getId(), currentUser.getUsername());
        return mapToPropertyDto(savedProperty);
    }

    @Transactional(readOnly = true)
    public Page<PropertyDto> getAllProperties(String location, String propertyType, Integer minBedrooms, Integer maxBedrooms, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        log.debug("Building specification for property search...");

        // Start with a list to hold individual specifications
        List<Specification<Property>> specs = new ArrayList<>();

        // Always add the base filter (e.g., active status)
        specs.add(PropertySpecification.hasStatus("active"));

        // Add filters conditionally
        if (location != null && !location.isBlank()) {
            specs.add(PropertySpecification.locationContains(location));
            log.debug("Added location filter: {}", location);
        }
        if (propertyType != null && !propertyType.isBlank()) {
            specs.add(PropertySpecification.hasPropertyType(propertyType));
            log.debug("Added propertyType filter: {}", propertyType);
        }
        if (minBedrooms != null && minBedrooms >= 0) {
            specs.add(PropertySpecification.bedroomsGreaterThanOrEqual(minBedrooms));
            log.debug("Added minBedrooms filter: {}", minBedrooms);
        }
        if (maxBedrooms != null && maxBedrooms >= 0) {
            if (minBedrooms == null || maxBedrooms >= minBedrooms) {
                specs.add(PropertySpecification.bedroomsLessThanOrEqual(maxBedrooms));
                log.debug("Added maxBedrooms filter: {}", maxBedrooms);
            } else {
                log.warn("maxBedrooms filter ignored because it's less than minBedrooms.");
            }
        }
        if (minPrice != null && minPrice.compareTo(BigDecimal.ZERO) > 0) {
            specs.add(PropertySpecification.priceGreaterThanOrEqual(minPrice));
            log.debug("Added minPrice filter: {}", minPrice);
        }
        if (maxPrice != null && maxPrice.compareTo(BigDecimal.ZERO) > 0) {
            specs.add(PropertySpecification.priceLessThanOrEqual(maxPrice));
            log.debug("Added maxPrice filter: {}", maxPrice);
        }

        // Combine all specifications with AND
        Specification<Property> finalSpec = Specification.allOf(specs);

        log.info("Fetching properties with applied filters and pagination: {}", pageable);
        // Execute query using the combined specification
        return propertyRepository.findAll(finalSpec, pageable).map(this::mapToPropertyDto);
    }

    @Transactional(readOnly = true)
    public Page<PropertyDto> getOwnerProperties(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        boolean isOwner = currentUser.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_OWNER"));
        if (!isOwner) {
            log.error("Non-owner user '{}' attempted to access owner-specific properties.", currentUser.getUsername());
            throw new AccessDeniedException("Access denied.");
        }
        log.info("Fetching properties for owner '{}' with pagination: {}", currentUser.getUsername(), pageable);
        return propertyRepository.findByOwnerId(currentUser.getId(), pageable).map(this::mapToPropertyDto);
    }

    @Transactional(readOnly = true)
    public PropertyDto getPropertyById(Long id) {
        log.debug("Fetching property by ID: {}", id);
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Property not found with ID: {}", id);
                    return new ResourceNotFoundException("Property not found with id: " + id);
                });
        return mapToPropertyDto(property);
    }

    @Transactional
    public PropertyDto updateProperty(Long id, CreatePropertyDto dto) {
        User currentUser = userService.getCurrentUser();
        log.info("Attempting to update property ID: {} by user '{}'", id, currentUser.getUsername());
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        // Authorization Check
        if (!property.getOwner().getId().equals(currentUser.getId())) {
            log.warn("Access denied: User '{}' attempted to update property ID {} owned by user ID {}",
                    currentUser.getUsername(), id, property.getOwner().getId());
            throw new AccessDeniedException("You do not have permission to update this property.");
        }

        log.debug("Updating property details for ID: {}", id);
        property.setTitle(dto.getTitle());
        property.setDescription(dto.getDescription());
        property.setLocation(dto.getLocation());
        property.setPrice(dto.getPrice());
        property.setContact(dto.getContact());
        property.setBedrooms(dto.getBedrooms());
        property.setBathrooms(dto.getBathrooms());
        property.setArea(dto.getArea());
        property.setPropertyType(dto.getPropertyType());

        if (dto.getImageFilenames() != null) {
            property.getImageFilenames().clear();
            property.getImageFilenames().addAll(dto.getImageFilenames());
            log.debug("Updated image filenames for property ID {}: {}", id, dto.getImageFilenames());
        }

        Property updatedProperty = propertyRepository.save(property);
        log.info("Property ID {} updated successfully.", id);
        return mapToPropertyDto(updatedProperty);
    }

    @Transactional
    public void deleteProperty(Long id) {
        User currentUser = userService.getCurrentUser();
        log.info("Attempting to delete property ID: {} by user '{}'", id, currentUser.getUsername());
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        // Authorization Check
        if (!property.getOwner().getId().equals(currentUser.getId())) {
            log.warn("Access denied: User '{}' attempted to delete property ID {} owned by user ID {}",
                    currentUser.getUsername(), id, property.getOwner().getId());
            throw new AccessDeniedException("You do not have permission to delete this property.");
        }

        List<String> filenamesToDelete = List.copyOf(property.getImageFilenames());

        log.debug("Deleting property entity ID: {}", id);
        propertyRepository.delete(property);

        log.debug("Deleting associated image files for property ID {}: {}", id, filenamesToDelete);
        filenamesToDelete.forEach(filename -> {
            try {
                fileStorageService.deleteFile(filename);
            } catch (Exception e) {
                log.error("Error deleting file {} during property deletion of ID {}: {}", filename, id, e.getMessage());
            }
        });
        log.info("Property ID {} and associated files deleted successfully.", id);
    }

    // Helper method to map Entity to DTO
    private PropertyDto mapToPropertyDto(Property property) {
        Long ownerId = (property.getOwner() != null) ? property.getOwner().getId() : null;
        String ownerUsername = (property.getOwner() != null) ? property.getOwner().getUsername() : null;
        String createdAtFormatted = (property.getCreatedAt() != null)
                ? property.getCreatedAt().toLocalDateTime().format(DateTimeFormatter.ISO_DATE_TIME)
                : null;

        // Create owner info object for chat functionality
        PropertyDto.OwnerInfo ownerInfo = null;
        if (property.getOwner() != null) {
            ownerInfo = new PropertyDto.OwnerInfo(
                    property.getOwner().getId(),
                    property.getOwner().getUsername(),
                    property.getOwner().getEmail()
            );
        }

        PropertyDto dto = new PropertyDto(
                property.getId(),
                property.getTitle(),
                property.getDescription(),
                property.getLocation(),
                property.getPrice(),
                property.getContact(),
                property.getBedrooms(),
                property.getBathrooms(),
                property.getArea(),
                property.getPropertyType(),
                property.getStatus(),
                property.getImageFilenames() != null ? property.getImageFilenames() : List.of(), // Ensure non-null list
                createdAtFormatted,
                ownerId,
                ownerUsername,
                ownerInfo // Add owner object
        );
        
        return dto;
    }
}