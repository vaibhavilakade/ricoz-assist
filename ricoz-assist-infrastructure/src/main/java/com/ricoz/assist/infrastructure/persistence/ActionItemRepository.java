package com.ricoz.assist.infrastructure.persistence;

import com.ricoz.assist.core.domain.ActionItem;
import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.application.port.out.repository.ActionItemRepositoryPort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ActionItemRepository extends JpaRepository<ActionItem, UUID>, ActionItemRepositoryPort {

    List<ActionItem> findByAssignedTo(User assignedTo);

    @Override
    @EntityGraph(attributePaths = {"assignedTo", "meeting"})
    Optional<ActionItem> findById(UUID id);

    @Override
    @EntityGraph(attributePaths = {"assignedTo", "meeting"})
    @Query("SELECT ai FROM ActionItem ai WHERE ai.assignedTo.id = :assignedToId AND ai.deleted = false")
    List<ActionItem> findByAssignedToId(@Param("assignedToId") UUID assignedToId);

    @EntityGraph(attributePaths = {"assignedTo", "meeting"})
    @Query("SELECT ai FROM ActionItem ai WHERE ai.assignedTo.id = :userId AND ai.status = :status AND ai.deleted = false")
    List<ActionItem> findByAssignedToIdAndStatus(@Param("userId") UUID userId, @Param("status") ActionItem.ActionItemStatus status);

    @EntityGraph(attributePaths = {"assignedTo", "meeting"})
    @Query("SELECT ai FROM ActionItem ai WHERE ai.dueDate < :date AND ai.status NOT IN ('COMPLETED', 'CANCELLED') AND ai.deleted = false")
    List<ActionItem> findOverdue(@Param("date") LocalDate date);

    @EntityGraph(attributePaths = {"assignedTo", "meeting"})
    @Query("SELECT ai FROM ActionItem ai WHERE ai.dueDate BETWEEN :start AND :end AND ai.deleted = false")
    List<ActionItem> findByDueDateBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @EntityGraph(attributePaths = {"assignedTo", "meeting"})
    @Query("SELECT ai FROM ActionItem ai WHERE ai.meeting.id = :meetingId AND ai.deleted = false")
    List<ActionItem> findByMeetingId(@Param("meetingId") UUID meetingId);

    @EntityGraph(attributePaths = {"assignedTo", "meeting"})
    @Query("SELECT ai FROM ActionItem ai WHERE ai.assignedTo.id = :userId AND ai.priority = :priority AND ai.deleted = false")
    List<ActionItem> findByAssignedToIdAndPriority(@Param("userId") UUID userId, @Param("priority") ActionItem.Priority priority);
}
