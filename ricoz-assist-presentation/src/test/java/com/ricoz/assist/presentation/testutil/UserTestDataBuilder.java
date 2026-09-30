package com.ricoz.assist.presentation.testutil;

import com.ricoz.assist.core.domain.User;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserTestDataBuilder {

    public static User.UserRole defaultRole = User.UserRole.USER;

    public static User aUser() {
        LocalDateTime now = LocalDateTime.now();
        User user = User.builder()
                .username("testuser")
                .email("test@example.com")
                .passwordHash("$2a$10$encodedPassword")
                .firstName("Test")
                .lastName("User")
                .role(defaultRole)
                .active(true)
                .build();
        user.setId(UUID.randomUUID());
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        return user;
    }

    public static User anAdminUser() {
        User user = aUser();
        user.setUsername("admin");
        user.setEmail("admin@example.com");
        user.setRole(User.UserRole.ADMIN);
        return user;
    }

    public static User aViewerUser() {
        User user = aUser();
        user.setUsername("viewer");
        user.setEmail("viewer@example.com");
        user.setRole(User.UserRole.VIEWER);
        return user;
    }

    public static User anInactiveUser() {
        User user = aUser();
        user.setActive(false);
        return user;
    }
}
