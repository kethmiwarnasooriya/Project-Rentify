package com.rentify.controller;

import com.rentify.dto.ReservationDto;
import com.rentify.entity.Reservation;
import com.rentify.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@Slf4j
public class ReservationController {

    private final ReservationService reservationService;

    // Create a new reservation (tenant)
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createReservation(@Valid @RequestBody ReservationDto dto) {
        log.info("Creating reservation for property: {}", dto.getPropertyId());
        try {
            Reservation reservation = reservationService.createReservation(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid reservation request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error creating reservation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create reservation"));
        }
    }

    // Get tenant's reservations
    @GetMapping("/my-reservations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Reservation>> getMyReservations() {
        log.info("Fetching reservations for current tenant");
        List<Reservation> reservations = reservationService.getTenantReservations();
        return ResponseEntity.ok(reservations);
    }

    // Get owner's incoming reservations
    @GetMapping("/incoming")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Reservation>> getIncomingReservations() {
        log.info("Fetching incoming reservations for current owner");
        List<Reservation> reservations = reservationService.getOwnerReservations();
        return ResponseEntity.ok(reservations);
    }

    // Get owner's pending reservations
    @GetMapping("/pending")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Reservation>> getPendingReservations() {
        log.info("Fetching pending reservations for current owner");
        List<Reservation> reservations = reservationService.getOwnerPendingReservations();
        return ResponseEntity.ok(reservations);
    }

    // Approve reservation (owner)
    @PutMapping("/{id}/approve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> approveReservation(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload) {
        log.info("Approving reservation: {}", id);
        try {
            String response = payload != null ? payload.get("response") : null;
            Reservation reservation = reservationService.approveReservation(id, response);
            return ResponseEntity.ok(reservation);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid approve request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error approving reservation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to approve reservation"));
        }
    }

    // Reject reservation (owner)
    @PutMapping("/{id}/reject")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> rejectReservation(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload) {
        log.info("Rejecting reservation: {}", id);
        try {
            String response = payload != null ? payload.get("response") : null;
            Reservation reservation = reservationService.rejectReservation(id, response);
            return ResponseEntity.ok(reservation);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid reject request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error rejecting reservation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to reject reservation"));
        }
    }

    // Confirm reservation (tenant confirms after owner approval)
    @PutMapping("/{id}/confirm")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> confirmReservation(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload) {
        log.info("Confirming reservation: {}", id);
        try {
            String response = payload != null ? payload.get("response") : null;
            Reservation reservation = reservationService.confirmReservation(id, response);
            return ResponseEntity.ok(reservation);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid confirm request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error confirming reservation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to confirm reservation"));
        }
    }

    // Cancel reservation (tenant or owner)
    @PutMapping("/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cancelReservation(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload) {
        log.info("Cancelling reservation: {}", id);
        try {
            String reason = payload != null ? payload.get("reason") : null;
            Reservation reservation = reservationService.cancelReservation(id, reason);
            return ResponseEntity.ok(reservation);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid cancel request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error cancelling reservation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to cancel reservation"));
        }
    }

    // Delete reservation (only cancelled or rejected reservations)
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        log.info("Deleting reservation: {}", id);
        try {
            reservationService.deleteReservation(id);
            return ResponseEntity.ok(Map.of("message", "Reservation deleted successfully"));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid delete request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error deleting reservation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete reservation"));
        }
    }
}
