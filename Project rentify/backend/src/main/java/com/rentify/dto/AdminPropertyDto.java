package com.rentify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminPropertyDto {
    private Long id;
    private String title;
    private String description;
    private String location;
    private BigDecimal price;
    private String contact;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer area;
    private String propertyType;
    private String status;
    private Timestamp createdAt;
    
    // Owner information (simplified to avoid circular reference)
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private String ownerUsername;
}