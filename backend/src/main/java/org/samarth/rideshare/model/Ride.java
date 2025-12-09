package org.samarth.rideshare.model;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "rides")
public class Ride {

    @Id
    private String id;
    private String userId;
    private String driverId;
    private String pickupLocation;
    private String dropLocation;
    private Double distanceKm;  // Distance in kilometers
    private Double fare;         // Total fare (base + distance cost)
    private Double driverRevenue; // 75% of fare
    private Double companyRevenue; // 25% of fare
    private String status; // REQUESTED / ACCEPTED / COMPLETED

    @CreatedDate
    private Instant createdAt;
    private Instant acceptedAt;
    private Instant completedAt;

    public Ride() {
    }

    public Ride(String id, String userId, String driverId, String pickupLocation, String dropLocation,
            Double distanceKm, Double fare, Double driverRevenue, Double companyRevenue, String status,
            Instant createdAt, Instant acceptedAt, Instant completedAt) {
        this.id = id;
        this.userId = userId;
        this.driverId = driverId;
        this.pickupLocation = pickupLocation;
        this.dropLocation = dropLocation;
        this.distanceKm = distanceKm;
        this.fare = fare;
        this.driverRevenue = driverRevenue;
        this.companyRevenue = companyRevenue;
        this.status = status;
        this.createdAt = createdAt;
        this.acceptedAt = acceptedAt;
        this.completedAt = completedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDriverId() {
        return driverId;
    }

    public void setDriverId(String driverId) {
        this.driverId = driverId;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDropLocation() {
        return dropLocation;
    }

    public void setDropLocation(String dropLocation) {
        this.dropLocation = dropLocation;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public Double getFare() {
        return fare;
    }

    public void setFare(Double fare) {
        this.fare = fare;
    }

    public Double getDriverRevenue() {
        return driverRevenue;
    }

    public void setDriverRevenue(Double driverRevenue) {
        this.driverRevenue = driverRevenue;
    }

    public Double getCompanyRevenue() {
        return companyRevenue;
    }

    public void setCompanyRevenue(Double companyRevenue) {
        this.companyRevenue = companyRevenue;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getAcceptedAt() {
        return acceptedAt;
    }

    public void setAcceptedAt(Instant acceptedAt) {
        this.acceptedAt = acceptedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}
