package com.rentify.service;

import com.rentify.dto.ConversationDTO;
import com.rentify.dto.MessageDTO;
import com.rentify.entity.Message;
import com.rentify.entity.Property;
import com.rentify.entity.User;
import com.rentify.exception.ResourceNotFoundException;
import com.rentify.repository.MessageRepository;
import com.rentify.repository.PropertyRepository;
import com.rentify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;

    /**
     * Send a message
     */
    public Message sendMessage(MessageDTO dto) {
        User sender = userService.getCurrentUser();
        log.info("User {} sending message to user {}", sender.getUsername(), dto.getReceiverId());

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found with id: " + dto.getReceiverId()));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(dto.getContent());
        message.setRead(false);

        // Add property context if provided
        if (dto.getPropertyId() != null) {
            Property property = propertyRepository.findById(dto.getPropertyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + dto.getPropertyId()));
            message.setProperty(property);
        }

        Message saved = messageRepository.save(message);
        log.info("Message sent successfully with ID: {}", saved.getId());
        return saved;
    }

    /**
     * Get conversation between current user and another user
     */
    @Transactional(readOnly = true)
    public List<Message> getConversation(Long otherUserId) {
        User currentUser = userService.getCurrentUser();
        log.info("Fetching conversation between {} and user {}", currentUser.getUsername(), otherUserId);
        
        return messageRepository.findMessagesBetweenUsers(currentUser.getId(), otherUserId);
    }

    /**
     * Get all conversations for current user
     */
    @Transactional(readOnly = true)
    public List<ConversationDTO> getConversations() {
        User currentUser = userService.getCurrentUser();
        log.info("Fetching all conversations for user {}", currentUser.getUsername());

        List<Message> lastMessages = messageRepository.findLastMessagesForUser(currentUser.getId());
        List<ConversationDTO> conversations = new ArrayList<>();

        for (Message message : lastMessages) {
            // Determine the other user in the conversation
            User otherUser = message.getSender().getId().equals(currentUser.getId()) 
                    ? message.getReceiver() 
                    : message.getSender();

            // Count unread messages from this user
            long unreadCount = messageRepository.findMessagesBetweenUsers(currentUser.getId(), otherUser.getId())
                    .stream()
                    .filter(m -> m.getReceiver().getId().equals(currentUser.getId()) && !m.isRead())
                    .count();

            ConversationDTO dto = new ConversationDTO();
            dto.setUserId(otherUser.getId());
            dto.setUsername(otherUser.getUsername());
            dto.setEmail(otherUser.getEmail());
            dto.setLastMessage(message.getContent());
            dto.setLastMessageTime(message.getCreatedAt());
            dto.setUnreadCount(unreadCount);
            
            if (message.getProperty() != null) {
                dto.setPropertyId(message.getProperty().getId());
                dto.setPropertyTitle(message.getProperty().getTitle());
            }
            
            dto.setOnline(false); // For future implementation

            conversations.add(dto);
        }

        return conversations;
    }

    /**
     * Mark messages as read
     */
    public void markAsRead(Long senderId) {
        User currentUser = userService.getCurrentUser();
        log.info("Marking messages from user {} as read for user {}", senderId, currentUser.getUsername());
        
        List<Message> messages = messageRepository.findMessagesBetweenUsers(currentUser.getId(), senderId);
        messages.stream()
                .filter(m -> m.getReceiver().getId().equals(currentUser.getId()) && !m.isRead())
                .forEach(m -> m.setRead(true));
        
        messageRepository.saveAll(messages);
    }

    /**
     * Get unread message count
     */
    @Transactional(readOnly = true)
    public long getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        return messageRepository.countUnreadMessages(currentUser.getId());
    }
}
