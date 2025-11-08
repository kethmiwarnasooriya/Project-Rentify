package com.rentify.controller;



// ... (imports as listed in the previous response) ...
import com.rentify.dto.CreatePropertyDto;
import com.rentify.dto.PropertyDto;
import com.rentify.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Logging
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort; // Added for sort direction
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal; // Added

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@Slf4j
public class PropertyController {

    private final PropertyService propertyService;

    @PostMapping
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<PropertyDto> createProperty(@Valid @RequestBody CreatePropertyDto createPropertyDto) {
        log.info("Request received to create property titled: {}", createPropertyDto.getTitle());
        PropertyDto createdProperty = propertyService.createProperty(createPropertyDto);
        log.info("Property created successfully with ID: {}", createdProperty.getId());
        return new ResponseEntity<>(createdProperty, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<PropertyDto>> getAllProperties(
            // Filter parameters - optional
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) Integer minBedrooms,
            @RequestParam(required = false) Integer maxBedrooms,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            // Pagination and Sorting parameters
            @PageableDefault(size = 9, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Request received to get all properties - Page: {}, Size: {}, Sort: {}",
                pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort());
        log.debug("Filters - Location: {}, PropertyType: {}, MinBeds: {}, MaxBeds: {}, MinPrice: {}, MaxPrice: {}", 
                location, propertyType, minBedrooms, maxBedrooms, minPrice, maxPrice);

        Page<PropertyDto> properties = propertyService.getAllProperties(location, propertyType, minBedrooms, maxBedrooms, minPrice, maxPrice, pageable);
        log.info("Returning {} properties on page {}", properties.getNumberOfElements(), pageable.getPageNumber());
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/my-properties")
    @PreAuthorize("hasRole('OWNER')") // Only owners can access this
    public ResponseEntity<Page<PropertyDto>> getOwnerProperties(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        log.info("Request received for current owner's properties - Page: {}, Size: {}", pageable.getPageNumber(), pageable.getPageSize());
        Page<PropertyDto> properties = propertyService.getOwnerProperties(pageable);
        log.info("Returning {} properties for the owner on page {}", properties.getNumberOfElements(), pageable.getPageNumber());
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDto> getPropertyById(@PathVariable Long id) {
        log.info("Request received to get property by ID: {}", id);
        PropertyDto property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')") // Only the owner (verified in service) can update
    public ResponseEntity<PropertyDto> updateProperty(@PathVariable Long id, @Valid @RequestBody CreatePropertyDto updatePropertyDto) {
        // Note: Using CreatePropertyDto for update might not be ideal if some fields shouldn't be updatable.
        // Consider creating a separate UpdatePropertyDto.
        log.info("Request received to update property ID: {}", id);
        PropertyDto updatedProperty = propertyService.updateProperty(id, updatePropertyDto);
        log.info("Property updated successfully for ID: {}", id);
        return ResponseEntity.ok(updatedProperty);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OWNER')") // Only the owner (verified in service) can delete
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        log.info("Request received to delete property ID: {}", id);
        propertyService.deleteProperty(id);
        log.info("Property deleted successfully for ID: {}", id);
        return ResponseEntity.noContent().build(); // Standard response for successful DELETE
    }
}