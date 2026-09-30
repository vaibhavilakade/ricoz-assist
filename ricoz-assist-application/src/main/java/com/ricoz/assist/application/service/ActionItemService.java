package com.ricoz.assist.application.service;

import com.ricoz.assist.core.domain.ActionItem;
import com.ricoz.assist.core.domain.Meeting;
import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.application.port.out.repository.ActionItemRepositoryPort;
import com.ricoz.assist.application.port.out.repository.MeetingRepositoryPort;
import com.ricoz.assist.application.port.out.repository.UserRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActionItemService {

    private final ActionItemRepositoryPort actionItemRepository;
    private final MeetingRepositoryPort meetingRepository;
    private final UserRepositoryPort userRepository;

    @Transactional
    public ActionItem createActionItem(ActionItem actionItem) {
        log.info("Creating action item with title: {}", actionItem.getTitle());
        if (actionItem.getAssignedTo() == null || actionItem.getAssignedTo().getId() == null) {
            throw new IllegalArgumentException("Assigned user is required");
        }
        actionItem.setAssignedTo(userRepository.findById(actionItem.getAssignedTo().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found with id: " + actionItem.getAssignedTo().getId())));
        if (actionItem.getMeeting() != null) {
            actionItem.setMeeting(meetingRepository.findById(actionItem.getMeeting().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Meeting not found with id: " + actionItem.getMeeting().getId())));
        }
        actionItem.setStatus(ActionItem.ActionItemStatus.OPEN);
        actionItem.setCreatedAt(LocalDateTime.now());
        ActionItem saved = actionItemRepository.save(actionItem);
        log.info("Action item created with id: {}", saved.getId());
        return saved;
    }

    @Transactional
    public ActionItem updateActionItem(UUID id, ActionItem actionItem) {
        log.info("Updating action item with id: {}", id);
        ActionItem existing = actionItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Action item not found with id: " + id));

        existing.setTitle(actionItem.getTitle());
        existing.setDescription(actionItem.getDescription());
        existing.setPriority(actionItem.getPriority());
        existing.setDueDate(actionItem.getDueDate());
        existing.setUpdatedAt(LocalDateTime.now());

        return actionItemRepository.save(existing);
    }

    @Transactional(readOnly = true)
    public ActionItem getActionItemById(UUID id) {
        log.debug("Fetching action item with id: {}", id);
        return actionItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Action item not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<ActionItem> getActionItemsByAssignedTo(UUID userId) {
        log.debug("Fetching action items for user: {}", userId);
        return actionItemRepository.findByAssignedToId(userId);
    }

    @Transactional(readOnly = true)
    public List<ActionItem> getActionItemsByAssignedToAndStatus(UUID userId, ActionItem.ActionItemStatus status) {
        log.debug("Fetching action items for user {} with status {}", userId, status);
        return actionItemRepository.findByAssignedToIdAndStatus(userId, status);
    }

    @Transactional(readOnly = true)
    public List<ActionItem> getActionItemsByMeeting(UUID meetingId) {
        log.debug("Fetching action items for meeting: {}", meetingId);
        return actionItemRepository.findByMeetingId(meetingId);
    }

    @Transactional(readOnly = true)
    public List<ActionItem> getOverdueActionItems() {
        log.debug("Fetching overdue action items");
        return actionItemRepository.findOverdue(LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<ActionItem> getActionItemsDueBetween(LocalDate start, LocalDate end) {
        log.debug("Fetching action items due between {} and {}", start, end);
        return actionItemRepository.findByDueDateBetween(start, end);
    }

    @Transactional(readOnly = true)
    public List<ActionItem> getActionItemsByPriority(UUID userId, ActionItem.Priority priority) {
        log.debug("Fetching action items for user {} with priority {}", userId, priority);
        return actionItemRepository.findByAssignedToIdAndPriority(userId, priority);
    }

    @Transactional
    public ActionItem completeActionItem(UUID id) {
        log.info("Completing action item: {}", id);
        ActionItem actionItem = actionItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Action item not found with id: " + id));

        actionItem.setStatus(ActionItem.ActionItemStatus.COMPLETED);
        actionItem.setCompletedAt(LocalDateTime.now());
        actionItem.setUpdatedAt(LocalDateTime.now());

        return actionItemRepository.save(actionItem);
    }

    @Transactional
    public ActionItem updateStatus(UUID id, ActionItem.ActionItemStatus status) {
        log.info("Updating action item {} status to {}", id, status);
        ActionItem actionItem = actionItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Action item not found with id: " + id));

        actionItem.setStatus(status);
        if (status == ActionItem.ActionItemStatus.COMPLETED) {
            actionItem.setCompletedAt(LocalDateTime.now());
        }
        actionItem.setUpdatedAt(LocalDateTime.now());

        return actionItemRepository.save(actionItem);
    }

    @Async
    @Transactional
    public void extractActionItemsFromMeeting(UUID meetingId, String transcription) {
        log.info("Extracting action items from meeting: {}", meetingId);
        // Placeholder for AI-based action item extraction
        // In real implementation, this would use NLP to extract action items from transcription
        
        log.info("Action items extracted from meeting {}", meetingId);
    }

    @Transactional
    public ActionItem assignToUser(UUID actionItemId, UUID userId) {
        log.info("Assigning action item {} to user {}", actionItemId, userId);
        ActionItem actionItem = actionItemRepository.findById(actionItemId)
                .orElseThrow(() -> new IllegalArgumentException("Action item not found with id: " + actionItemId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        actionItem.setAssignedTo(user);
        actionItem.setUpdatedAt(LocalDateTime.now());

        return actionItemRepository.save(actionItem);
    }

    @Transactional
    public void deleteActionItem(UUID id) {
        log.info("Soft deleting action item with id: {}", id);
        ActionItem actionItem = actionItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Action item not found with id: " + id));
        actionItem.setDeleted(true);
        actionItem.setUpdatedAt(LocalDateTime.now());
        actionItemRepository.save(actionItem);
    }
}
