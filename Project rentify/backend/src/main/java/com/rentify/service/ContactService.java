package com.rentify.service;

import com.rentify.dto.ContactDto;
import com.rentify.entity.Contact;
import com.rentify.entity.User;
import com.rentify.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserService userService;

    /**
     * Saves a contact message from the contact form
     * 
     * @param contactDto The contact form data
     * @return The saved contact entity ID
     */
    @Transactional
    public Long saveContactMessage(ContactDto contactDto) {
        log.info("Saving contact message from: {}", contactDto.getEmail());
        
        Contact contact = new Contact();
        contact.setName(contactDto.getName().trim());
        contact.setEmail(contactDto.getEmail().trim().toLowerCase());
        contact.setSubject(contactDto.getSubject().trim());
        contact.setMessage(contactDto.getMessage().trim());
        contact.setStatus("new");
        
        // If user is authenticated, link the contact to the user
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                !authentication.getPrincipal().equals("anonymousUser")) {
                User currentUser = userService.getCurrentUser();
                contact.setUser(currentUser);
                log.debug("Contact message linked to user: {}", currentUser.getUsername());
            }
        } catch (Exception e) {
            log.debug("Contact message from anonymous user or user lookup failed: {}", e.getMessage());
            // Continue without linking to user - this is fine for anonymous contacts
        }
        
        Contact savedContact = contactRepository.save(contact);
        log.info("Contact message saved successfully with ID: {} from: {}", 
                savedContact.getId(), savedContact.getEmail());
        
        return savedContact.getId();
    }
}