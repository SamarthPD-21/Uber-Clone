package org.samarth.rideshare.controller;

import java.security.Principal;
import java.util.List;

import org.samarth.rideshare.dto.RideResponse;
import org.samarth.rideshare.service.RideService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/driver")
public class DriverRideController {

    private final RideService rideService;

    public DriverRideController(RideService rideService) {
        this.rideService = rideService;
    }

    @GetMapping("/rides/requests")
    public ResponseEntity<List<RideResponse>> getPendingRides(Principal principal) {
        return ResponseEntity.ok(rideService.getPendingRides(principal.getName()));
    }

    @PostMapping("/rides/{rideId}/accept")
    public ResponseEntity<RideResponse> acceptRide(@PathVariable String rideId, Principal principal) {
        return ResponseEntity.ok(rideService.acceptRide(rideId, principal.getName()));
    }
}
