package com.rentify.controller;

import com.rentify.dto.MessageDTO;
import com.rentify.entity.Message;
import com.rentify.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> sendMessage(@Valid @RequestBody MessageDTO dto) {
        try {
            Message message = messageService.sendMessage(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/conversation/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Message>> getConversation(@PathVariable Long userId) {
        List<Message> messages = messageService.getConversation(userId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/conversations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getConversations() {
        return ResponseEntity.ok(messageService.getConversations());
    }

    @PutMapping("/read/{senderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAsRead(@PathVariable Long senderId) {
        messageService.markAsRead(senderId);
        return ResponseEntity.ok(Map.of("message", "Messages marked as read"));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(messageService.getUnreadCount());
    }
}
