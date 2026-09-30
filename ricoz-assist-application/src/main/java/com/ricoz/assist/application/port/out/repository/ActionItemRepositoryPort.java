package com.ricoz.assist.application.port.out.repository;

import com.ricoz.assist.core.domain.ActionItem;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ActionItemRepositoryPort {
    ActionItem save(ActionItem actionItem);

    Optional<ActionItem> findById(UUID id);

    List<ActionItem> findByAssignedToId(UUID assignedToId);

    List<ActionItem> findByAssignedToIdAndStatus(UUID assignedToId, ActionItem.ActionItemStatus status);

    List<ActionItem> findOverdue(LocalDate date);

    List<ActionItem> findByDueDateBetween(LocalDate start, LocalDate end);

    List<ActionItem> findByMeetingId(UUID meetingId);

    List<ActionItem> findByAssignedToIdAndPriority(UUID assignedToId, ActionItem.Priority priority);
}
