package org.samarth.rideshare.controller;

import java.security.Principal;

import org.samarth.rideshare.dto.UpdateProfileRequest;
import org.samarth.rideshare.model.User;
import org.samarth.rideshare.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Principal principal) {
        User user = userService.getByUsername(principal.getName());
        // Don't send password
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@Valid @RequestBody UpdateProfileRequest request, Principal principal) {
        User user = userService.getByUsername(principal.getName());

        // Only drivers can set vehicle type
        if ("ROLE_DRIVER".equals(user.getRole()) && request.getVehicleType() != null) {
            user.setVehicleType(request.getVehicleType());
            user = userService.save(user);
        }

        // Don't send password
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
