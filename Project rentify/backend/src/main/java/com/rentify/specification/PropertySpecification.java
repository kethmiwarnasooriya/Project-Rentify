package com.rentify.specification;



import com.rentify.entity.Property;
import jakarta.persistence.criteria.Predicate; // Correct import
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils; // For checking blank strings

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {

    /**
     * Creates a specification to filter properties by status.
     * @param status The desired status (e.g., "active").
     * @return Specification for filtering by status.
     */
    public static Specification<Property> hasStatus(String status) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(status)) {
                return criteriaBuilder.conjunction(); // No filter if status is blank
            }
            return criteriaBuilder.equal(root.get("status"), status);
        };
    }

    /**
     * Creates a specification to filter properties where the location contains the given string (case-insensitive).
     * @param location The string to search for within the location.
     * @return Specification for filtering by location substring.
     */
    public static Specification<Property> locationContains(String location) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(location)) {
                return criteriaBuilder.conjunction(); // No filter if location is blank
            }
            // Use lower() for case-insensitive search
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("location")), "%" + location.toLowerCase() + "%");
        };
    }

    /**
     * Creates a specification to filter properties with bedrooms greater than or equal to the specified number.
     * @param bedrooms Minimum number of bedrooms.
     * @return Specification for filtering by minimum bedrooms.
     */
    public static Specification<Property> bedroomsGreaterThanOrEqual(int bedrooms) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("bedrooms"), bedrooms);
    }

    /**
     * Creates a specification to filter properties with bedrooms less than or equal to the specified number.
     * @param bedrooms Maximum number of bedrooms.
     * @return Specification for filtering by maximum bedrooms.
     */
    public static Specification<Property> bedroomsLessThanOrEqual(int bedrooms) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("bedrooms"), bedrooms);
    }


    /**
     * Creates a specification to filter properties with a price greater than or equal to the specified amount.
     * @param price Minimum price.
     * @return Specification for filtering by minimum price.
     */
    public static Specification<Property> priceGreaterThanOrEqual(BigDecimal price) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("price"), price);
    }

    /**
     * Creates a specification to filter properties with a price less than or equal to the specified amount.
     * @param price Maximum price.
     * @return Specification for filtering by maximum price.
     */
    public static Specification<Property> priceLessThanOrEqual(BigDecimal price) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.lessThanOrEqualTo(root.get("price"), price);
    }

    /**
     * Creates a specification to filter properties by property type (exact match, case-insensitive).
     * @param propertyType The exact property type (e.g., "apartment", "house").
     * @return Specification for filtering by property type.
     */
    public static Specification<Property> hasType(String propertyType) {
        return (root, query, criteriaBuilder) -> {
            if (!StringUtils.hasText(propertyType)) {
                return criteriaBuilder.conjunction();
            }
            // Use lower() for case-insensitive comparison
            return criteriaBuilder.equal(criteriaBuilder.lower(root.get("propertyType")), propertyType.toLowerCase());
        };
    }

    /**
     * Creates a specification to filter properties by property type (exact match, case-insensitive).
     * Alias for hasType method.
     * @param propertyType The exact property type (e.g., "apartment", "house").
     * @return Specification for filtering by property type.
     */
    public static Specification<Property> hasPropertyType(String propertyType) {
        return hasType(propertyType);
    }

    /**
     * Creates a specification to filter properties within an area range.
     * @param minArea Minimum area (inclusive). Can be null.
     * @param maxArea Maximum area (inclusive). Can be null.
     * @return Specification for filtering by area range.
     */
    public static Specification<Property> areaBetween(Integer minArea, Integer maxArea) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (minArea != null && minArea >= 0) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("area"), minArea));
            }
            if (maxArea != null && maxArea >= 0) {
                // Ensure min <= max if both provided
                if (minArea == null || maxArea >= minArea) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("area"), maxArea));
                }
            }
            // Combine predicates with AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

}