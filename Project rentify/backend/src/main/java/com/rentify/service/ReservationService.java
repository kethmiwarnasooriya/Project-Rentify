package com.rentify.service;

import com.rentify.dto.ReservationDto;
import com.rentify.entity.Property;
import com.rentify.entity.Reservation;
import com.rentify.entity.User;
import com.rentify.exception.ResourceNotFoundException;
import com.rentify.repository.PropertyRepository;
import com.rentify.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final PropertyRepository propertyRepository;
    private final UserService userService;

    /**
     * Create a new reservation
     */
    public Reservation createReservation(ReservationDto dto) {
        User tenant = userService.getCurrentUser();
        log.info("Creating reservation for property {} by tenant {}", dto.getPropertyId(), tenant.getUsername());

        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + dto.getPropertyId()));

        // Prevent owner from reserving their own property
        if (property.getOwner().getId().equals(tenant.getId())) {
            throw new IllegalArgumentException("You cannot reserve your own property");
        }

        Reservation reservation = new Reservation();
        reservation.setProperty(property);
        reservation.setTenant(tenant);
        reservation.setStartDate(dto.getStartDate());
        reservation.setEndDate(dto.getEndDate());
        reservation.setMessage(dto.getMessage());
        reservation.setStatus("pending");

        Reservation saved = reservationRepository.save(reservation);
        log.info("Reservation created successfully with ID: {}", saved.getId());
        return saved;
    }

    /**
     * Get all reservations for current tenant
     */
    @Transactional(readOnly = true)
    public List<Reservation> getTenantReservations() {
        User tenant = userService.getCurrentUser();
        log.info("Fetching reservations for tenant: {}", tenant.getUsername());
        return reservationRepository.findByTenantIdOrderByCreatedAtDesc(tenant.getId());
    }

    /**
     * Get all reservations for current owner's properties
     */
    @Transactional(readOnly = true)
    public List<Reservation> getOwnerReservations() {
        User owner = userService.getCurrentUser();
        log.info("Fetching reservations for owner: {}", owner.getUsername());
        return reservationRepository.findByPropertyOwnerIdOrderByCreatedAtDesc(owner.getId());
    }

    /**
     * Get pending reservations for current owner
     */
    @Transactional(readOnly = true)
    public List<Reservation> getOwnerPendingReservations() {
        User owner = userService.getCurrentUser();
        log.info("Fetching pending reservations for owner: {}", owner.getUsername());
        return reservationRepository.findPendingReservationsByOwnerId(owner.getId());
    }

    /**
     * Approve a reservation (owner only)
     */
    public Reservation approveReservation(Long reservationId, String response) {
        User owner = userService.getCurrentUser();
        log.info("Owner {} approving reservation {}", owner.getUsername(), reservationId);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        // Verify owner owns the property
        if (!reservation.getProperty().getOwner().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("You can only approve reservations for your own properties");
        }

        reservation.setStatus("approved");
        reservation.setOwnerResponse(response);
        
        Reservation updated = reservationRepository.save(reservation);
        log.info("Reservation {} approved successfully", reservationId);
        return updated;
    }

    /**
     * Reject a reservation (owner only)
     */
    public Reservation rejectReservation(Long reservationId, String response) {
        User owner = userService.getCurrentUser();
        log.info("Owner {} rejecting reservation {}", owner.getUsername(), reservationId);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        // Verify owner owns the property
        if (!reservation.getProperty().getOwner().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("You can only reject reservations for your own properties");
        }

        reservation.setStatus("rejected");
        reservation.setOwnerResponse(response);
        
        Reservation updated = reservationRepository.save(reservation);
        log.info("Reservation {} rejected successfully", reservationId);
        return updated;
    }

    /**
     * Confirm a reservation (tenant confirms after owner approval)
     */
    public Reservation confirmReservation(Long reservationId, String response) {
        User tenant = userService.getCurrentUser();
        log.info("Tenant {} confirming reservation {}", tenant.getUsername(), reservationId);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        // Verify tenant owns the reservation
        if (!reservation.getTenant().getId().equals(tenant.getId())) {
            throw new IllegalArgumentException("You can only confirm your own reservations");
        }

        // Can only confirm approved reservations
        if (!reservation.getStatus().equals("approved")) {
            throw new IllegalArgumentException("You can only confirm approved reservations");
        }

        reservation.setStatus("confirmed");
        reservation.setTenantResponse(response);
        
        // Update property status to unavailable
        Property property = reservation.getProperty();
        property.setStatus("unavailable");
        propertyRepository.save(property);
        
        Reservation updated = reservationRepository.save(reservation);
        log.info("Reservation {} confirmed successfully. Property {} marked as unavailable", 
                reservationId, property.getId());
        return updated;
    }

    /**
     * Cancel a reservation (tenant or owner)
     */
    public Reservation cancelReservation(Long reservationId, String reason) {
        User currentUser = userService.getCurrentUser();
        log.info("User {} cancelling reservation {}", currentUser.getUsername(), reservationId);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        // Verify user is either tenant or property owner
        boolean isTenant = reservation.getTenant().getId().equals(currentUser.getId());
        boolean isOwner = reservation.getProperty().getOwner().getId().equals(currentUser.getId());
        
        if (!isTenant && !isOwner) {
            throw new IllegalArgumentException("You can only cancel your own reservations");
        }

        // Can only cancel pending, approved, or confirmed reservations
        if (reservation.getStatus().equals("rejected") || reservation.getStatus().equals("cancelled")) {
            throw new IllegalArgumentException("This reservation is already " + reservation.getStatus());
        }

        String oldStatus = reservation.getStatus();
        reservation.setStatus("cancelled");
        
        // Store cancellation reason
        if (isTenant) {
            reservation.setTenantResponse(reason != null ? reason : "Cancelled by tenant");
        } else {
            reservation.setOwnerResponse(reason != null ? reason : "Cancelled by owner");
        }
        
        // If reservation was confirmed, make property available again
        if (oldStatus.equals("confirmed")) {
            Property property = reservation.getProperty();
            property.setStatus("active");
            propertyRepository.save(property);
            log.info("Property {} marked as available again", property.getId());
        }
        
        Reservation updated = reservationRepository.save(reservation);
        log.info("Reservation {} cancelled successfully by {}", reservationId, 
                isTenant ? "tenant" : "owner");
        return updated;
    }

    /**
     * Delete a reservation (only cancelled or rejected)
     */
    public void deleteReservation(Long reservationId) {
        User currentUser = userService.getCurrentUser();
        log.info("User {} deleting reservation {}", currentUser.getUsername(), reservationId);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));

        // Verify user is either tenant or property owner
        boolean isTenant = reservation.getTenant().getId().equals(currentUser.getId());
        boolean isOwner = reservation.getProperty().getOwner().getId().equals(currentUser.getId());
        
        if (!isTenant && !isOwner) {
            throw new IllegalArgumentException("You can only delete your own reservations");
        }

        // Can only delete cancelled or rejected reservations
        if (!reservation.getStatus().equals("cancelled") && !reservation.getStatus().equals("rejected")) {
            throw new IllegalArgumentException("You can only delete cancelled or rejected reservations");
        }

        reservationRepository.delete(reservation);
        log.info("Reservation {} deleted successfully by {}", reservationId, 
                isTenant ? "tenant" : "owner");
    }
}
