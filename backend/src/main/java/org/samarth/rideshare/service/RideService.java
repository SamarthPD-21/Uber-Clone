package org.samarth.rideshare.service;

import java.util.List;
import java.util.stream.Collectors;

import org.samarth.rideshare.dto.CreateRideRequest;
import org.samarth.rideshare.dto.RideResponse;
import org.samarth.rideshare.exception.BadRequestException;
import org.samarth.rideshare.exception.NotFoundException;
import org.samarth.rideshare.model.Ride;
import org.samarth.rideshare.model.User;
import org.samarth.rideshare.repository.RideRepository;
import org.samarth.rideshare.util.RideStatus;
import org.springframework.stereotype.Service;

@Service
public class RideService {

    private final RideRepository rideRepository;
    private final UserService userService;

    public RideService(RideRepository rideRepository, UserService userService) {
        this.rideRepository = rideRepository;
        this.userService = userService;
    }

    public RideResponse createRide(String username, CreateRideRequest request) {
        User passenger = userService.getByUsername(username);
        if (!"ROLE_USER".equals(passenger.getRole())) {
            throw new BadRequestException("Only passengers can request rides");
        }

        Ride ride = new Ride();
        ride.setUserId(passenger.getId());
        ride.setPickupLocation(request.getPickupLocation());
        ride.setDropLocation(request.getDropLocation());
        ride.setStatus(RideStatus.REQUESTED);

        return toResponse(rideRepository.save(ride));
    }

    public List<RideResponse> getUserRides(String username) {
        User passenger = userService.getByUsername(username);
        return rideRepository.findByUserId(passenger.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<RideResponse> getPendingRides() {
        return rideRepository.findByStatus(RideStatus.REQUESTED)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public RideResponse acceptRide(String rideId, String driverUsername) {
        User driver = userService.getByUsername(driverUsername);
        if (!"ROLE_DRIVER".equals(driver.getRole())) {
            throw new BadRequestException("Only drivers can accept rides");
        }

        Ride ride = getRide(rideId);
        if (!RideStatus.REQUESTED.equals(ride.getStatus())) {
            throw new BadRequestException("Ride is not available for acceptance");
        }

        ride.setDriverId(driver.getId());
        ride.setStatus(RideStatus.ACCEPTED);
        return toResponse(rideRepository.save(ride));
    }

    public RideResponse completeRide(String rideId, String username) {
        User user = userService.getByUsername(username);
        Ride ride = getRide(rideId);

        if (!RideStatus.ACCEPTED.equals(ride.getStatus())) {
            throw new BadRequestException("Ride is not in ACCEPTED state");
        }

        boolean isPassenger = ride.getUserId().equals(user.getId());
        boolean isDriver = ride.getDriverId() != null && ride.getDriverId().equals(user.getId());

        if (!isPassenger && !isDriver) {
            throw new BadRequestException("You are not authorized to complete this ride");
        }

        ride.setStatus(RideStatus.COMPLETED);
        return toResponse(rideRepository.save(ride));
    }

    private Ride getRide(String rideId) {
        return rideRepository.findById(rideId)
                .orElseThrow(() -> new NotFoundException("Ride not found"));
    }

    private RideResponse toResponse(Ride ride) {
        RideResponse response = new RideResponse();
        response.setId(ride.getId());
        response.setUserId(ride.getUserId());
        response.setDriverId(ride.getDriverId());
        response.setPickupLocation(ride.getPickupLocation());
        response.setDropLocation(ride.getDropLocation());
        response.setStatus(ride.getStatus());
        response.setCreatedAt(ride.getCreatedAt());

        // Add usernames for better display
        try {
            User passenger = userService.getById(ride.getUserId());
            response.setPassengerUsername(passenger.getUsername());
        } catch (Exception e) {
            // Ignore if user not found
        }

        if (ride.getDriverId() != null) {
            try {
                User driver = userService.getById(ride.getDriverId());
                response.setDriverUsername(driver.getUsername());
            } catch (Exception e) {
                // Ignore if driver not found
            }
        }

        return response;
    }
}
