package org.samarth.rideshare.service;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.group;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.newAggregation;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    private final MongoTemplate mongoTemplate;
    private final UserService userService;

    public AnalyticsService(MongoTemplate mongoTemplate, UserService userService) {
        this.mongoTemplate = mongoTemplate;
        this.userService = userService;
    }

    /**
     * Calculate total earnings for a driver using MongoDB aggregation
     *
     * @param driverUsername the username of the driver
     * @return total earnings from completed rides
     */
    public Double getTotalEarnings(String driverUsername) {
        // Get driver's ID
        String driverId = userService.getByUsername(driverUsername).getId();

        // Create aggregation pipeline:
        // 1. Match rides where driverId matches and status is COMPLETED
        MatchOperation matchDriver = match(
                Criteria.where("driverId").is(driverId)
                        .and("status").is("COMPLETED")
        );

        // 2. Group all matched documents and sum the fare field
        GroupOperation groupByDriver = group()
                .sum("fare").as("totalEarnings");

        // Build and execute aggregation
        Aggregation aggregation = newAggregation(matchDriver, groupByDriver);

        Document result = mongoTemplate.aggregate(
                aggregation,
                "rides",
                Document.class
        ).getUniqueMappedResult();

        // Return total or 0.0 if no results
        if (result != null && result.get("totalEarnings") != null) {
            return result.getDouble("totalEarnings");
        }
        return 0.0;
    }

    /**
     * Get total number of completed rides for a driver
     *
     * @param driverUsername the username of the driver
     * @return count of completed rides
     */
    public Long getTotalCompletedRides(String driverUsername) {
        String driverId = userService.getByUsername(driverUsername).getId();

        MatchOperation matchDriver = match(
                Criteria.where("driverId").is(driverId)
                        .and("status").is("COMPLETED")
        );

        GroupOperation countRides = group()
                .count().as("rideCount");

        Aggregation aggregation = newAggregation(matchDriver, countRides);

        Document result = mongoTemplate.aggregate(
                aggregation,
                "rides",
                Document.class
        ).getUniqueMappedResult();

        if (result != null && result.get("rideCount") != null) {
            return result.getLong("rideCount");
        }
        return 0L;
    }

    /**
     * Get average fare for a driver
     *
     * @param driverUsername the username of the driver
     * @return average fare per ride
     */
    public Double getAverageFare(String driverUsername) {
        String driverId = userService.getByUsername(driverUsername).getId();

        MatchOperation matchDriver = match(
                Criteria.where("driverId").is(driverId)
                        .and("status").is("COMPLETED")
        );

        GroupOperation avgFare = group()
                .avg("fare").as("averageFare");

        Aggregation aggregation = newAggregation(matchDriver, avgFare);

        Document result = mongoTemplate.aggregate(
                aggregation,
                "rides",
                Document.class
        ).getUniqueMappedResult();

        if (result != null && result.get("averageFare") != null) {
            return result.getDouble("averageFare");
        }
        return 0.0;
    }

    /**
     * Get total company revenue from all completed rides
     *
     * @return total company earnings
     */
    public Double getTotalCompanyRevenue() {
        MatchOperation matchCompleted = match(
                Criteria.where("status").is("COMPLETED")
        );

        GroupOperation sumCompanyRevenue = group()
                .sum("companyRevenue").as("totalCompanyRevenue");

        Aggregation aggregation = newAggregation(matchCompleted, sumCompanyRevenue);

        Document result = mongoTemplate.aggregate(
                aggregation,
                "rides",
                Document.class
        ).getUniqueMappedResult();

        if (result != null && result.get("totalCompanyRevenue") != null) {
            return result.getDouble("totalCompanyRevenue");
        }
        return 0.0;
    }

    /**
     * Get total revenue generated across all completed rides
     *
     * @return total revenue (all fares combined)
     */
    public Double getTotalRevenue() {
        MatchOperation matchCompleted = match(
                Criteria.where("status").is("COMPLETED")
        );

        GroupOperation sumFares = group()
                .sum("fare").as("totalRevenue");

        Aggregation aggregation = newAggregation(matchCompleted, sumFares);

        Document result = mongoTemplate.aggregate(
                aggregation,
                "rides",
                Document.class
        ).getUniqueMappedResult();

        if (result != null && result.get("totalRevenue") != null) {
            return result.getDouble("totalRevenue");
        }
        return 0.0;
    }

    /**
     * Get total driver earnings (sum of all driverRevenue from completed rides)
     *
     * @return total amount paid to all drivers
     */
    public Double getTotalDriverEarnings() {
        MatchOperation matchCompleted = match(
                Criteria.where("status").is("COMPLETED")
        );

        GroupOperation sumDriverRevenue = group()
                .sum("driverRevenue").as("totalDriverEarnings");

        Aggregation aggregation = newAggregation(matchCompleted, sumDriverRevenue);

        Document result = mongoTemplate.aggregate(
                aggregation,
                "rides",
                Document.class
        ).getUniqueMappedResult();

        if (result != null && result.get("totalDriverEarnings") != null) {
            return result.getDouble("totalDriverEarnings");
        }
        return 0.0;
    }
}
