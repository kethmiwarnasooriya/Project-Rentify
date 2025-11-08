package com.rentify.repository;



import com.rentify.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    // Find a role by its name (e.g., "ROLE_OWNER")
    Optional<Role> findByName(String name);

    // Check if a role exists by name
    boolean existsByName(String name);
}