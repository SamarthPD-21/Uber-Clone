package org.samarth.rideshare.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.samarth.rideshare.dto.CreateRideRequest;
import org.samarth.rideshare.dto.RideResponse;
import org.samarth.rideshare.exception.BadRequestException;
import org.samarth.rideshare.exception.NotFoundException;
import org.samarth.rideshare.model.Ride;
import org.samarth.rideshare.model.User;
import org.samarth.rideshare.repository.RideRepository;
import org.samarth.rideshare.util.PricingConfig;
import org.samarth.rideshare.util.RideStatus;
import org.samarth.rideshare.util.VehicleType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        // Validate vehicle type
        if (!VehicleType.isValid(request.getVehicleType())) {
            throw new BadRequestException("Invalid vehicle type");
        }

        // Get base price for vehicle type
        double basePrice = VehicleType.getBasePrice(request.getVehicleType());

        // Calculate pricing based on distance and vehicle type
        PricingConfig.PricingDetails pricing = PricingConfig.calculatePricing(request.getDistanceKm());
        double totalFare = basePrice + pricing.getTotalFare();
        double driverRevenue = totalFare * 0.75;
        double companyRevenue = totalFare * 0.25;

        Ride ride = new Ride();
        ride.setUserId(passenger.getId());
        ride.setPickupLocation(request.getPickupLocation());
        ride.setDropLocation(request.getDropLocation());
        ride.setVehicleType(request.getVehicleType());
        ride.setBasePrice(basePrice);
        ride.setDistanceKm(pricing.getDistanceKm());
        ride.setFare(totalFare);
        ride.setDriverRevenue(driverRevenue);
        ride.setCompanyRevenue(companyRevenue);
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

    public List<RideResponse> getPendingRides(String driverUsername) {
        User driver = userService.getByUsername(driverUsername);
        if (!"ROLE_DRIVER".equals(driver.getRole())) {
            throw new BadRequestException("Only drivers can access pending rides");
        }

        // Filter by driver's vehicle type if set
        String vehicleType = driver.getVehicleType();
        if (vehicleType != null && !vehicleType.isEmpty()) {
            return rideRepository.findByStatusAndVehicleType(RideStatus.REQUESTED, vehicleType)
                    .stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        }

        // If no vehicle type set, return all pending rides
        return rideRepository.findByStatus(RideStatus.REQUESTED)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<RideResponse> getDriverRides(String driverUsername) {
        User driver = userService.getByUsername(driverUsername);
        if (!"ROLE_DRIVER".equals(driver.getRole())) {
            throw new BadRequestException("Only drivers can access this endpoint");
        }
        return rideRepository.findByDriverId(driver.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RideResponse acceptRide(String rideId, String driverUsername) {
        User driver = userService.getByUsername(driverUsername);
        if (!"ROLE_DRIVER".equals(driver.getRole())) {
            throw new BadRequestException("Only drivers can accept rides");
        }

        // Check if driver already has an active (accepted) ride
        List<Ride> activeRides = rideRepository.findByDriverIdAndStatus(driver.getId(), RideStatus.ACCEPTED);
        if (!activeRides.isEmpty()) {
            throw new BadRequestException("You already have an active ride. Please complete it before accepting a new one.");
        }

        Ride ride = getRide(rideId);
        if (!RideStatus.REQUESTED.equals(ride.getStatus())) {
            throw new BadRequestException("Ride is not available for acceptance");
        }

        // Check if driver's vehicle type matches the ride's vehicle type
        String driverVehicleType = driver.getVehicleType();
        if (driverVehicleType != null && !driverVehicleType.isEmpty()
                && !driverVehicleType.equals(ride.getVehicleType())) {
            throw new BadRequestException("This ride requires a " + ride.getVehicleType() + " but you have a " + driverVehicleType);
        }

        ride.setDriverId(driver.getId());
        ride.setStatus(RideStatus.ACCEPTED);
        ride.setAcceptedAt(Instant.now());
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
        ride.setCompletedAt(Instant.now());
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
        response.setVehicleType(ride.getVehicleType());
        response.setBasePrice(ride.getBasePrice());
        response.setDistanceKm(ride.getDistanceKm());
        response.setFare(ride.getFare());
        response.setDriverRevenue(ride.getDriverRevenue());
        response.setCompanyRevenue(ride.getCompanyRevenue());
        response.setStatus(ride.getStatus());
        response.setCreatedAt(ride.getCreatedAt());
        response.setAcceptedAt(ride.getAcceptedAt());
        response.setCompletedAt(ride.getCompletedAt());

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
