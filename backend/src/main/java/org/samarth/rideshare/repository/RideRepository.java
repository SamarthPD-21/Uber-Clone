package org.samarth.rideshare.repository;

import java.util.List;

import org.samarth.rideshare.model.Ride;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RideRepository extends MongoRepository<Ride, String> {
    List<Ride> findByStatus(String status);

    List<Ride> findByUserId(String userId);
}
