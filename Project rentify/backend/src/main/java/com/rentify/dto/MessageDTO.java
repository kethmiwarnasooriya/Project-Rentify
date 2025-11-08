package com.rentify.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

@Data
public class MessageDTO {
    
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;
    
    private Long propertyId; // Optional - for context
    
    @NotBlank(message = "Message content is required")
    private String content;
}
