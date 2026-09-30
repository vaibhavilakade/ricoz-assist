package com.ricoz.assist.infrastructure.persistence;

import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.application.port.out.repository.UserRepositoryPort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, UserRepositoryPort {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.active = true AND u.deleted = false")
    java.util.List<User> findAllActiveUsers();
}
