package com.rentify.config;

import com.rentify.entity.Contact;
import com.rentify.entity.Property;
import com.rentify.entity.Role;
import com.rentify.entity.User;
import com.rentify.repository.ContactRepository;
import com.rentify.repository.PropertyRepository;
import com.rentify.repository.RoleRepository;
import com.rentify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeAdminUser();
        initializeSampleContacts();
        initializeSampleProperties();
    }

    private void initializeRoles() {
        // Create ROLE_TENANT if it doesn't exist
        if (!roleRepository.existsByName("ROLE_TENANT")) {
            Role tenantRole = new Role("ROLE_TENANT");
            roleRepository.save(tenantRole);
            log.info("Created ROLE_TENANT");
        } else {
            log.info("ROLE_TENANT already exists");
        }

        // Create ROLE_OWNER if it doesn't exist
        if (!roleRepository.existsByName("ROLE_OWNER")) {
            Role ownerRole = new Role("ROLE_OWNER");
            roleRepository.save(ownerRole);
            log.info("Created ROLE_OWNER");
        } else {
            log.info("ROLE_OWNER already exists");
        }

        // Create ROLE_ADMIN if it doesn't exist
        if (!roleRepository.existsByName("ROLE_ADMIN")) {
            Role adminRole = new Role("ROLE_ADMIN");
            roleRepository.save(adminRole);
            log.info("Created ROLE_ADMIN");
        } else {
            log.info("ROLE_ADMIN already exists");
        }
    }

    @Transactional
    private void initializeAdminUser() {
        // Create default admin user if it doesn't exist
        if (!userRepository.existsByUsername("admin")) {
            // Get the admin role first
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));
            
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123")); // Change this password!
            adminUser.setEmail("admin@rentify.com");
            adminUser.setFullName("System Administrator");
            
            // Create a new HashSet and add the existing role
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            adminUser.setRoles(roles);
            
            userRepository.save(adminUser);
            log.info("Created default admin user: admin / admin123");
            log.warn("SECURITY WARNING: Please change the default admin password!");
        } else {
            log.info("Admin user already exists");
            // Fix existing admin user if it doesn't have roles
            User existingAdmin = userRepository.findByUsername("admin").orElse(null);
            if (existingAdmin != null && existingAdmin.getRoles().isEmpty()) {
                Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                        .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);
                existingAdmin.setRoles(roles);
                userRepository.save(existingAdmin);
                log.info("Fixed roles for existing admin user");
            }
        }
        
        // Create a second admin user with different credentials
        if (!userRepository.existsByUsername("superadmin")) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));
            
            User superAdminUser = new User();
            superAdminUser.setUsername("superadmin");
            superAdminUser.setPassword(passwordEncoder.encode("super123"));
            superAdminUser.setEmail("superadmin@rentify.com");
            superAdminUser.setFullName("Super Administrator");
            
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            superAdminUser.setRoles(roles);
            
            userRepository.save(superAdminUser);
            log.info("Created super admin user: superadmin / super123");
        } else {
            log.info("Super admin user already exists");
        }
    }

    @Transactional
    private void initializeSampleContacts() {
        // Create sample contact messages if none exist
        long contactCount = contactRepository.count();
        log.info("Current contact count in database: {}", contactCount);
        
        if (contactCount == 0) {
            // Sample contact 1
            Contact contact1 = new Contact();
            contact1.setName("John Doe");
            contact1.setEmail("john.doe@example.com");
            contact1.setSubject("Question about property listing");
            contact1.setMessage("Hi, I'm interested in the 2-bedroom apartment you have listed. Could you provide more details about the amenities and availability?");
            contact1.setStatus("new");
            contactRepository.save(contact1);

            // Sample contact 2
            Contact contact2 = new Contact();
            contact2.setName("Sarah Johnson");
            contact2.setEmail("sarah.johnson@example.com");
            contact2.setSubject("Rental inquiry");
            contact2.setMessage("Hello, I'm looking for a rental property in downtown area. Do you have any available units? My budget is around $1500/month.");
            contact2.setStatus("read");
            contactRepository.save(contact2);

            // Sample contact 3
            Contact contact3 = new Contact();
            contact3.setName("Mike Wilson");
            contact3.setEmail("mike.wilson@example.com");
            contact3.setSubject("Property management services");
            contact3.setMessage("I own several rental properties and I'm looking for a property management company. What services do you offer and what are your rates?");
            contact3.setStatus("replied");
            contactRepository.save(contact3);

            // Sample contact 4
            Contact contact4 = new Contact();
            contact4.setName("Emily Chen");
            contact4.setEmail("emily.chen@example.com");
            contact4.setSubject("Maintenance request");
            contact4.setMessage("The heating system in my apartment (Unit 4B) is not working properly. Could someone please come and take a look at it?");
            contact4.setStatus("new");
            contactRepository.save(contact4);

            log.info("Created sample contact messages for testing");
        } else {
            log.info("Contact messages already exist in database. Count: {}", contactCount);
            // Let's verify we can retrieve them
            List<Contact> existingContacts = contactRepository.findAll();
            log.info("Retrieved {} contacts from database for verification", existingContacts.size());
            for (Contact contact : existingContacts) {
                log.info("Contact: {} - {} - {}", contact.getId(), contact.getName(), contact.getSubject());
            }
        }
    }

    @Transactional
    private void initializeSampleProperties() {
        // Create sample properties if none exist
        long propertyCount = propertyRepository.count();
        log.info("Current property count in database: {}", propertyCount);
        
        if (propertyCount == 0) {
            // Get an owner user (create one if needed)
            User ownerUser = userRepository.findByUsername("admin").orElse(null);
            if (ownerUser == null) {
                // Create a sample owner if admin doesn't exist
                Role ownerRole = roleRepository.findByName("ROLE_OWNER")
                        .orElseThrow(() -> new RuntimeException("ROLE_OWNER not found"));
                
                ownerUser = new User();
                ownerUser.setUsername("sampleowner");
                ownerUser.setPassword(passwordEncoder.encode("password123"));
                ownerUser.setEmail("owner@example.com");
                ownerUser.setFullName("Sample Owner");
                
                Set<Role> roles = new HashSet<>();
                roles.add(ownerRole);
                ownerUser.setRoles(roles);
                ownerUser = userRepository.save(ownerUser);
            }

            // Sample property 1
            Property property1 = new Property();
            property1.setTitle("Modern 2BR Apartment Downtown");
            property1.setDescription("Beautiful modern apartment in the heart of downtown with city views");
            property1.setLocation("Downtown, City Center");
            property1.setPropertyType("Apartment");
            property1.setBedrooms(2);
            property1.setBathrooms(2);
            property1.setPrice(java.math.BigDecimal.valueOf(1500.00));
            property1.setOwner(ownerUser);
            propertyRepository.save(property1);

            // Sample property 2
            Property property2 = new Property();
            property2.setTitle("Cozy Studio Near University");
            property2.setDescription("Perfect for students, close to campus with all amenities");
            property2.setLocation("University District");
            property2.setPropertyType("Studio");
            property2.setBedrooms(1);
            property2.setBathrooms(1);
            property2.setPrice(java.math.BigDecimal.valueOf(800.00));
            property2.setOwner(ownerUser);
            propertyRepository.save(property2);

            // Sample property 3
            Property property3 = new Property();
            property3.setTitle("Spacious 3BR Family House");
            property3.setDescription("Large family home with garden, perfect for families");
            property3.setLocation("Suburban Area");
            property3.setPropertyType("House");
            property3.setBedrooms(3);
            property3.setBathrooms(2);
            property3.setPrice(java.math.BigDecimal.valueOf(2200.00));
            property3.setOwner(ownerUser);
            propertyRepository.save(property3);

            log.info("Created sample properties for testing");
        } else {
            log.info("Properties already exist in database. Count: {}", propertyCount);
            // Let's verify we can retrieve them
            List<Property> existingProperties = propertyRepository.findAll();
            log.info("Retrieved {} properties from database for verification", existingProperties.size());
            for (Property property : existingProperties) {
                log.info("Property: {} - {} - {} - ${}", 
                    property.getId(), property.getTitle(), property.getLocation(), property.getPrice());
            }
        }
    }
}