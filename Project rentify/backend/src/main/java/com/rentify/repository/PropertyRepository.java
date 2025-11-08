package com.rentify.repository;



import com.rentify.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

// JpaSpecificationExecutor enables dynamic query building using Specifications
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    // Example of a derived query method: Find properties owned by a specific user with pagination
    Page<Property> findByOwnerId(Long ownerId, Pageable pageable);

    // Example: Find properties by owner without pagination (use carefully, could return large lists)
    List<Property> findByOwnerId(Long ownerId);

    // Example: Find properties by location containing a string, ignoring case, with pagination
    Page<Property> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    // You can add more specific query methods here if needed frequently
    // e.g., Page<Property> findByBedroomsAndPriceLessThanEqual(int bedrooms, BigDecimal maxPrice, Pageable pageable);
}