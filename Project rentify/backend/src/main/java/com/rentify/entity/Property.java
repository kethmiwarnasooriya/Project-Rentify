package com.rentify.entity;



import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "property")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(nullable = false, precision = 10, scale = 2) // Suitable for monetary values
    private BigDecimal price;

    @Column(length = 20)
    private String contact; // Contact phone/email for the listing

    private Integer bedrooms;

    private Integer bathrooms;

    @Column(name = "area_sqft") // Be explicit about unit if possible
    private Integer area;

    @Column(name = "property_type", length = 50)
    private String propertyType; // e.g., "Apartment", "House", "Villa"

    @Column(length = 20, nullable = false)
    private String status = "active"; // Default status

    // Store list of filenames for images associated with this property
    @ElementCollection(fetch = FetchType.EAGER) // EAGER fetch might be okay if list is usually small and needed
    @CollectionTable(name = "property_images", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "filename", nullable = false)
    @OrderColumn // Maintains the order of images if needed
    private List<String> imageFilenames = new ArrayList<>();

    @CreationTimestamp // Automatically set on creation
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY) // LAZY is generally preferred for performance
    @JoinColumn(name = "owner_id", nullable = false) // Foreign key column
    @JsonBackReference // Prevents circular reference during JSON serialization
    private User owner;

    // Convenience method to add an image filename
    public void addImageFilename(String filename) {
        if (this.imageFilenames == null) {
            this.imageFilenames = new ArrayList<>();
        }
        this.imageFilenames.add(filename);
    }

    // Convenience method to remove an image filename
    public void removeImageFilename(String filename) {
        if (this.imageFilenames != null) {
            this.imageFilenames.remove(filename);
        }
    }
}