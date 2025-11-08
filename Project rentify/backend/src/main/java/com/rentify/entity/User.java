package com.rentify.entity;



import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "users") // Use plural or explicit name to avoid conflict with SQL keyword 'user'
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @com.fasterxml.jackson.annotation.JsonIgnore // Never expose password in JSON
    @Column(nullable = false, length = 60) // BCrypt hashes are typically 60 chars
    private String password;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(length = 20)
    private String phone;

    @CreationTimestamp // Automatically set on creation
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    // Relationships

    // EAGER fetch roles as they are needed frequently for authorization
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
    @JoinTable(
            name = "user_roles", // Name of the join table
            joinColumns = @JoinColumn(name = "user_id"), // Foreign key for User in join table
            inverseJoinColumns = @JoinColumn(name = "role_id") // Foreign key for Role in join table
    )
    private Set<Role> roles = new HashSet<>();

    // Properties owned by this user. LAZY fetch is appropriate here.
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference // Manages the forward reference for JSON serialization
    private Set<Property> properties = new HashSet<>();

    // --- UserDetails Implementation ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Map Role entities to Spring Security GrantedAuthority objects
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }

    // For simplicity, account status flags are hardcoded to true.
    // Implement logic here if account locking, expiration, etc., is needed.
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Could be linked to an email verification status field if implemented
        return true;
    }

    // Convenience method to add a role
    public void addRole(Role role) {
        if (this.roles == null) {
            this.roles = new HashSet<>();
        }
        this.roles.add(role);
    }
}