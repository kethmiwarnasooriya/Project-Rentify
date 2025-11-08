package com.rentify.dto;



import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterDto {
    @NotBlank(message = "Full name cannot be blank")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    private String username;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Please provide a valid email address")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone number cannot be blank")
    @Size(min=10, max=20, message = "Phone number must be between 10 and 20 characters")
    // Consider a stricter pattern if needed: e.g., @Pattern(regexp = "^\\+?[0-9\\s\\-()]{10,}$")
    private String phone;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters long")
    // Optional: Add complexity requirement pattern
    // @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", message = "Password must contain uppercase, lowercase, and number")
    private String password;

    @NotBlank(message = "Role must be specified ('owner' or 'tenant')")
    @Pattern(regexp = "^(owner|tenant)$", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Role must be either 'owner' or 'tenant'")
    private String role; // Expecting "owner" or "tenant"
}