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
@RequestMapping("/api/v1")
@Validated
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @PostMapping("/rides")
    public ResponseEntity<RideResponse> requestRide(@Valid @RequestBody CreateRideRequest request, Principal principal) {
        RideResponse response = rideService.createRide(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/rides")
    public ResponseEntity<List<RideResponse>> getUserRides(Principal principal) {
        return ResponseEntity.ok(rideService.getUserRides(principal.getName()));
    }

    @PostMapping("/rides/{rideId}/complete")
    public ResponseEntity<RideResponse> completeRide(@PathVariable String rideId, Principal principal) {
        return ResponseEntity.ok(rideService.completeRide(rideId, principal.getName()));
    }
}
