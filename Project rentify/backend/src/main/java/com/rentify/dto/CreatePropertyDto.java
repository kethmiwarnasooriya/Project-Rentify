package com.rentify.dto;



import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data // Lombok annotation for boilerplate code (getters, setters, toString, etc.)
public class CreatePropertyDto {

    @NotBlank(message = "Title cannot be blank")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;

    @NotBlank(message = "Description cannot be blank")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    @NotBlank(message = "Location cannot be blank")
    @Size(max = 255, message = "Location cannot exceed 255 characters")
    private String location;

    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be positive")
    @Digits(integer=10, fraction=2, message = "Price format is invalid (e.g., 12345.67)")
    private BigDecimal price;

    @NotBlank(message = "Contact information cannot be blank")
    @Size(min=10, max = 20, message = "Contact must be between 10 and 20 characters")
    // Consider adding a @Pattern for phone number format if needed
    private String contact;

    @Min(value = 0, message = "Bedrooms cannot be negative")
    private Integer bedrooms; // Allow null if not applicable (e.g., land)

    @Min(value = 0, message = "Bathrooms cannot be negative")
    private Integer bathrooms; // Allow null

    @Min(value = 0, message = "Area cannot be negative")
    private Integer area; // Allow null

    @NotBlank(message = "Property type cannot be blank")
    @Size(max = 50, message = "Property type cannot exceed 50 characters")
    private String propertyType; // Consider using an Enum for better validation

    @NotEmpty(message = "At least one image filename is required")
    @Size(max = 10, message = "Cannot upload more than 10 image filenames") // Match frontend limit
    private List<String> imageFilenames; // List of filenames obtained from file upload endpoint
}