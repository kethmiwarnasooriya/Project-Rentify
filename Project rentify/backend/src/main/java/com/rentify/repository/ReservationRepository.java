package com.rentify.repository;

import com.rentify.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    // Find reservations by tenant
    List<Reservation> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
    
    // Find reservations by property
    List<Reservation> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
    
    // Find reservations by property owner
    @Query("SELECT r FROM Reservation r WHERE r.property.owner.id = :ownerId ORDER BY r.createdAt DESC")
    List<Reservation> findByPropertyOwnerIdOrderByCreatedAtDesc(@Param("ownerId") Long ownerId);
    
    // Find reservations by status
    List<Reservation> findByStatusOrderByCreatedAtDesc(String status);
    
    // Find pending reservations for owner
    @Query("SELECT r FROM Reservation r WHERE r.property.owner.id = :ownerId AND r.status = 'pending' ORDER BY r.createdAt DESC")
    List<Reservation> findPendingReservationsByOwnerId(@Param("ownerId") Long ownerId);
    
    // Count reservations by status for tenant
    long countByTenantIdAndStatus(Long tenantId, String status);
    
    // Count reservations by status for owner
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.property.owner.id = :ownerId AND r.status = :status")
    long countByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") String status);
}
