package com.ricoz.assist.infrastructure.persistence;

import com.ricoz.assist.core.domain.Meeting;
import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.application.port.out.repository.MeetingRepositoryPort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, UUID>, MeetingRepositoryPort {

    Page<Meeting> findByOwner(User owner, Pageable pageable);

    List<Meeting> findByOwnerId(UUID ownerId);

    @Query("SELECT m FROM Meeting m WHERE m.owner.id = :ownerId AND m.status = :status AND m.deleted = false")
    List<Meeting> findByOwnerIdAndStatus(@Param("ownerId") UUID ownerId, @Param("status") Meeting.MeetingStatus status);

    @Query("SELECT m FROM Meeting m WHERE m.scheduledStart BETWEEN :start AND :end AND m.deleted = false")
    List<Meeting> findByScheduledStartBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT m FROM Meeting m WHERE :participant MEMBER OF m.participants AND m.deleted = false")
    List<Meeting> findByParticipant(@Param("participant") User participant);

    @Query("SELECT m FROM Meeting m WHERE m.title ILIKE %:keyword% AND m.deleted = false")
    List<Meeting> searchByTitle(@Param("keyword") String keyword);
}
