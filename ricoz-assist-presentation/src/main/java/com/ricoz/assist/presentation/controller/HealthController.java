package com.ricoz.assist.presentation.controller;

import com.ricoz.assist.infrastructure.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.actuate.health.Health;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;

@RestController
@RequestMapping("/health")
@RequiredArgsConstructor
public class HealthController {

    private final DataSource dataSource;
    private final UserRepository userRepository;

    @GetMapping("/liveness")
    public Health liveness() {
        return Health.up()
                .withDetail("status", "UP")
                .withDetail("timestamp", System.currentTimeMillis())
                .build();
    }

    @GetMapping("/readiness")
    public Health readiness() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(2)) {
                return Health.up()
                        .withDetail("database", "connected")
                        .withDetail("timestamp", System.currentTimeMillis())
                        .build();
            } else {
                return Health.down()
                        .withDetail("database", "connection invalid")
                        .build();
            }
        } catch (Exception e) {
            return Health.down()
                    .withDetail("database", "connection failed")
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }

    @GetMapping("/custom")
    public Health customHealth() {
        Health.Builder builder = Health.up();

        try {
            long userCount = userRepository.count();
            builder.withDetail("userCount", userCount);
        } catch (Exception e) {
            builder.down().withDetail("error", e.getMessage());
        }

        return builder.build();
    }
}
