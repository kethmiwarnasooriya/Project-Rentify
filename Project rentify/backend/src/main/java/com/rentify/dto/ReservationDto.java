package com.rentify.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class ReservationDto {
    
    @NotNull(message = "Property ID is required")
    private Long propertyId;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private String message;
}
