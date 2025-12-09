package org.samarth.rideshare.controller;

import java.security.Principal;
import java.util.List;

import org.samarth.rideshare.dto.CreateRideRequest;
import org.samarth.rideshare.dto.RideResponse;
import org.samarth.rideshare.service.RideService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/rides")
@Validated
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    /**
     * Create a new ride request (Passenger only) POST /api/rides
     */
    @PostMapping
    public ResponseEntity<RideResponse> createRide(@Valid @RequestBody CreateRideRequest request, Principal principal) {
        RideResponse response = rideService.createRide(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all rides for the authenticated user GET /api/rides
     */
    @GetMapping
    public ResponseEntity<List<RideResponse>> getUserRides(Principal principal) {
        return ResponseEntity.ok(rideService.getUserRides(principal.getName()));
    }

    /**
     * Get pending/requested rides (available for drivers to accept) GET
     * /api/rides/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<List<RideResponse>> getPendingRides() {
        return ResponseEntity.ok(rideService.getPendingRides());
    }

    /**
     * Accept a ride (Driver only) POST /api/rides/accept/{id}
     */
    @PostMapping("/accept/{id}")
    public ResponseEntity<RideResponse> acceptRide(@PathVariable String id, Principal principal) {
        return ResponseEntity.ok(rideService.acceptRide(id, principal.getName()));
    }

    /**
     * Complete a ride POST /api/rides/complete/{id}
     */
    @PostMapping("/complete/{id}")
    public ResponseEntity<RideResponse> completeRide(@PathVariable String id, Principal principal) {
        return ResponseEntity.ok(rideService.completeRide(id, principal.getName()));
    }

    /**
     * Get driver's own rides (accepted and completed) GET
     * /api/rides/driver/my-rides
     */
    @GetMapping("/driver/my-rides")
    public ResponseEntity<List<RideResponse>> getDriverRides(Principal principal) {
        return ResponseEntity.ok(rideService.getDriverRides(principal.getName()));
    }
}
