package com.rentify.repository;

import com.rentify.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // Get all messages between two users
    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender.id = :user1Id AND m.receiver.id = :user2Id) OR " +
           "(m.sender.id = :user2Id AND m.receiver.id = :user1Id) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findMessagesBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    // Get all conversations for a user (distinct users they've chatted with)
    @Query("SELECT DISTINCT CASE " +
           "WHEN m.sender.id = :userId THEN m.receiver " +
           "ELSE m.sender END " +
           "FROM Message m " +
           "WHERE m.sender.id = :userId OR m.receiver.id = :userId")
    List<Object> findConversationPartners(@Param("userId") Long userId);
    
    // Get last message with each conversation partner
    @Query("SELECT m FROM Message m WHERE m.id IN (" +
           "SELECT MAX(m2.id) FROM Message m2 " +
           "WHERE (m2.sender.id = :userId OR m2.receiver.id = :userId) " +
           "GROUP BY CASE " +
           "WHEN m2.sender.id = :userId THEN m2.receiver.id " +
           "ELSE m2.sender.id END) " +
           "ORDER BY m.createdAt DESC")
    List<Message> findLastMessagesForUser(@Param("userId") Long userId);
    
    // Count unread messages for a user
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :userId AND m.read = false")
    long countUnreadMessages(@Param("userId") Long userId);
    
    // Mark messages as read
    @Query("UPDATE Message m SET m.read = true WHERE m.receiver.id = :receiverId AND m.sender.id = :senderId AND m.read = false")
    void markMessagesAsRead(@Param("receiverId") Long receiverId, @Param("senderId") Long senderId);
}
