package org.samarth.rideshare.dto;

import jakarta.validation.constraints.Pattern;

public class UpdateProfileRequest {

    @Pattern(regexp = "MOTO|AUTORIKSHAW|CAR", message = "Vehicle type must be MOTO, AUTORIKSHAW or CAR")
    private String vehicleType;

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }
}
