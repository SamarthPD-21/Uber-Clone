package org.samarth.rideshare.repository;

import java.util.Optional;

import org.samarth.rideshare.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}
