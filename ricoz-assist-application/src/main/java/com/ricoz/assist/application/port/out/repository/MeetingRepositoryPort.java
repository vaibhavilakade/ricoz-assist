package com.ricoz.assist.application.port.out.repository;

import com.ricoz.assist.core.domain.Meeting;
import com.ricoz.assist.core.domain.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MeetingRepositoryPort {
    Meeting save(Meeting meeting);

    Optional<Meeting> findById(UUID id);

    List<Meeting> findByOwnerId(UUID ownerId);

    List<Meeting> findByOwnerIdAndStatus(UUID ownerId, Meeting.MeetingStatus status);

    List<Meeting> findByParticipant(User participant);

    List<Meeting> findByScheduledStartBetween(LocalDateTime start, LocalDateTime end);
}
