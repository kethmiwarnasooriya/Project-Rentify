package com.rentify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private Long userId;
    private String username;
    private String email;
    private String lastMessage;
    private Timestamp lastMessageTime;
    private long unreadCount;
    private Long propertyId;
    private String propertyTitle;
    private boolean isOnline; // For future use
}
