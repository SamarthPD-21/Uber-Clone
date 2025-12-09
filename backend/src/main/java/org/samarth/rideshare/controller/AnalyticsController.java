package org.samarth.rideshare.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.samarth.rideshare.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    /**
     * Get total earnings for a specific driver GET
     * /api/analytics/driver/{driver}/earnings
     */
    @GetMapping("/driver/{driver}/earnings")
    public ResponseEntity<Double> getDriverEarnings(@PathVariable String driver) {
        Double earnings = analyticsService.getTotalEarnings(driver);
        return ResponseEntity.ok(earnings);
    }

    /**
     * Get comprehensive driver statistics (earnings, ride count, average fare)
     * GET /api/analytics/driver/{driver}/stats
     */
    @GetMapping("/driver/{driver}/stats")
    public ResponseEntity<Map<String, Object>> getDriverStats(@PathVariable String driver) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEarnings", analyticsService.getTotalEarnings(driver));
        stats.put("completedRides", analyticsService.getTotalCompletedRides(driver));
        stats.put("averageFare", analyticsService.getAverageFare(driver));
        stats.put("driverUsername", driver);

        return ResponseEntity.ok(stats);
    }

    /**
     * Get current authenticated driver's earnings GET
     * /api/analytics/my-earnings
     */
    @GetMapping("/my-earnings")
    public ResponseEntity<Double> getMyEarnings(Principal principal) {
        Double earnings = analyticsService.getTotalEarnings(principal.getName());
        return ResponseEntity.ok(earnings);
    }

    /**
     * Get current authenticated driver's complete statistics GET
     * /api/analytics/my-stats
     */
    @GetMapping("/my-stats")
    public ResponseEntity<Map<String, Object>> getMyStats(Principal principal) {
        String username = principal.getName();
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEarnings", analyticsService.getTotalEarnings(username));
        stats.put("completedRides", analyticsService.getTotalCompletedRides(username));
        stats.put("averageFare", analyticsService.getAverageFare(username));
        stats.put("driverUsername", username);

        return ResponseEntity.ok(stats);
    }

    /**
     * Get total company revenue (admin endpoint) GET
     * /api/analytics/company/revenue
     */
    @GetMapping("/company/revenue")
    public ResponseEntity<Double> getCompanyRevenue() {
        Double revenue = analyticsService.getTotalCompanyRevenue();
        return ResponseEntity.ok(revenue);
    }

    /**
     * Get comprehensive company statistics (admin endpoint) GET
     * /api/analytics/company/stats
     */
    @GetMapping("/company/stats")
    public ResponseEntity<Map<String, Object>> getCompanyStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", analyticsService.getTotalRevenue());
        stats.put("companyRevenue", analyticsService.getTotalCompanyRevenue());
        stats.put("driverEarnings", analyticsService.getTotalDriverEarnings());
        stats.put("companyPercentage", 25.0);
        stats.put("driverPercentage", 75.0);

        return ResponseEntity.ok(stats);
    }
}
