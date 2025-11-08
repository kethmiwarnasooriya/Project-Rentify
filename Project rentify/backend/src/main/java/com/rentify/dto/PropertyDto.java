package com.rentify.dto;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyDto {
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
    private List<String> imageFilenames;
    private String createdAt; // ISO Format String
    private Long ownerId;
    private String ownerUsername;
    
    // Owner object for chat functionality
    private OwnerInfo owner;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OwnerInfo {
        private Long id;
        private String username;
        private String email;
    }
}