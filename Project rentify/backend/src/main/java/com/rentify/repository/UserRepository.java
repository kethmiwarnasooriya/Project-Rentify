package com.rentify.repository;



import com.rentify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Find a user by their unique username
    Optional<User> findByUsername(String username);

    // Find a user by their unique email address
    Optional<User> findByEmail(String email);

    // Check if a username already exists
    Boolean existsByUsername(String username);

    // Check if an email address already exists
    Boolean existsByEmail(String email);

    // Find users by role name
    List<User> findByRoles_Name(String roleName);

    // Count users by role name
    long countByRoles_Name(String roleName);
}