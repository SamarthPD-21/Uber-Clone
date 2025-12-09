package org.samarth.rideshare.util;

public final class VehicleType {

    public static final String MOTO = "MOTO";
    public static final String AUTORIKSHAW = "AUTORIKSHAW";
    public static final String CAR = "CAR";

    // Base prices
    public static final double MOTO_BASE_PRICE = 20.0;
    public static final double AUTORIKSHAW_BASE_PRICE = 35.0;
    public static final double CAR_BASE_PRICE = 50.0;

    // Capacity
    public static final int MOTO_CAPACITY = 1;
    public static final int AUTORIKSHAW_CAPACITY = 3;
    public static final int CAR_CAPACITY = 4;

    private VehicleType() {
    }

    public static double getBasePrice(String vehicleType) {
        return switch (vehicleType) {
            case MOTO ->
                MOTO_BASE_PRICE;
            case AUTORIKSHAW ->
                AUTORIKSHAW_BASE_PRICE;
            case CAR ->
                CAR_BASE_PRICE;
            default ->
                0.0;
        };
    }

    public static int getCapacity(String vehicleType) {
        return switch (vehicleType) {
            case MOTO ->
                MOTO_CAPACITY;
            case AUTORIKSHAW ->
                AUTORIKSHAW_CAPACITY;
            case CAR ->
                CAR_CAPACITY;
            default ->
                0;
        };
    }

    public static boolean isValid(String vehicleType) {
        return MOTO.equals(vehicleType)
                || AUTORIKSHAW.equals(vehicleType)
                || CAR.equals(vehicleType);
    }
}
