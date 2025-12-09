package org.samarth.rideshare.util;

/**
 * Pricing configuration for the ride-sharing system
 *
 * Pricing Model: - Base Price: ₹50 - Per KM Rate: ₹10/km - Total Fare = Base
 * Price + (Distance × Per KM Rate)
 *
 * Revenue Split: - Driver: 75% - Company: 25%
 */
public class PricingConfig {

    public static final double BASE_PRICE = 50.0;  // ₹50 base fare
    public static final double PRICE_PER_KM = 10.0; // ₹10 per kilometer
    public static final double DRIVER_REVENUE_PERCENTAGE = 0.75; // 75% to driver
    public static final double COMPANY_REVENUE_PERCENTAGE = 0.25; // 25% to company

    /**
     * Calculate total fare based on distance Formula: BASE_PRICE + (distanceKm
     * × PRICE_PER_KM)
     *
     * @param distanceKm Distance in kilometers
     * @return Total fare amount
     */
    public static double calculateFare(double distanceKm) {
        if (distanceKm < 0) {
            throw new IllegalArgumentException("Distance cannot be negative");
        }
        return BASE_PRICE + (distanceKm * PRICE_PER_KM);
    }

    /**
     * Calculate driver's revenue (75% of total fare)
     *
     * @param totalFare Total fare amount
     * @return Driver's share
     */
    public static double calculateDriverRevenue(double totalFare) {
        return totalFare * DRIVER_REVENUE_PERCENTAGE;
    }

    /**
     * Calculate company's revenue (25% of total fare)
     *
     * @param totalFare Total fare amount
     * @return Company's share
     */
    public static double calculateCompanyRevenue(double totalFare) {
        return totalFare * COMPANY_REVENUE_PERCENTAGE;
    }

    /**
     * Calculate all pricing details at once
     *
     * @param distanceKm Distance in kilometers
     * @return PricingDetails object with all calculated values
     */
    public static PricingDetails calculatePricing(double distanceKm) {
        double fare = calculateFare(distanceKm);
        double driverRevenue = calculateDriverRevenue(fare);
        double companyRevenue = calculateCompanyRevenue(fare);

        return new PricingDetails(distanceKm, fare, driverRevenue, companyRevenue);
    }

    /**
     * Inner class to hold all pricing details
     */
    public static class PricingDetails {

        private final double distanceKm;
        private final double totalFare;
        private final double driverRevenue;
        private final double companyRevenue;

        public PricingDetails(double distanceKm, double totalFare, double driverRevenue, double companyRevenue) {
            this.distanceKm = distanceKm;
            this.totalFare = totalFare;
            this.driverRevenue = driverRevenue;
            this.companyRevenue = companyRevenue;
        }

        public double getDistanceKm() {
            return distanceKm;
        }

        public double getTotalFare() {
            return totalFare;
        }

        public double getDriverRevenue() {
            return driverRevenue;
        }

        public double getCompanyRevenue() {
            return companyRevenue;
        }
    }
}
