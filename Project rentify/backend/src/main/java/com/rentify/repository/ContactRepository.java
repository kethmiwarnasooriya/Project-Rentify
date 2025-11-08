package com.rentify.repository;

import com.rentify.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    // Find contacts by status
    Page<Contact> findByStatus(String status, Pageable pageable);
    
    // Find contacts by status (list)
    List<Contact> findByStatusOrderByCreatedAtDesc(String status);
    
    // Find all contacts ordered by created date
    Page<Contact> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // Find contacts by email
    List<Contact> findByEmailOrderByCreatedAtDesc(String email);
    
    // Count contacts by status
    long countByStatus(String status);
    
    // Find recent contacts
    @Query("SELECT c FROM Contact c ORDER BY c.createdAt DESC")
    Page<Contact> findRecentContacts(Pageable pageable);
}