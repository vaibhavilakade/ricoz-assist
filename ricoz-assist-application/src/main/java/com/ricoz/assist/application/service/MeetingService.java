package com.ricoz.assist.application.service;

import com.ricoz.assist.core.domain.Meeting;
import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.application.port.out.repository.MeetingRepositoryPort;
import com.ricoz.assist.application.port.out.repository.UserRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MeetingService {

    private final MeetingRepositoryPort meetingRepository;
    private final UserRepositoryPort userRepository;

    @Transactional
    public Meeting createMeeting(Meeting meeting) {
        log.info("Creating meeting with title: {}", meeting.getTitle());
        if (meeting.getOwner() == null || meeting.getOwner().getId() == null) {
            throw new IllegalArgumentException("Meeting owner is required");
        }
        meeting.setOwner(userRepository.findById(meeting.getOwner().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found with id: " + meeting.getOwner().getId())));
        if (meeting.getParticipants() != null) {
            Set<User> participants = meeting.getParticipants().stream()
                    .map(participant -> userRepository.findById(participant.getId())
                            .orElseThrow(() -> new IllegalArgumentException(
                                    "User not found with id: " + participant.getId())))
                    .collect(java.util.stream.Collectors.toSet());
            meeting.setParticipants(participants);
        }
        meeting.setStatus(Meeting.MeetingStatus.SCHEDULED);
        meeting.setCreatedAt(LocalDateTime.now());
        Meeting saved = meetingRepository.save(meeting);
        log.info("Meeting created with id: {}", saved.getId());
        return saved;
    }

    @Transactional
    public Meeting updateMeeting(UUID id, Meeting meeting) {
        log.info("Updating meeting with id: {}", id);
        Meeting existing = meetingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with id: " + id));

        existing.setTitle(meeting.getTitle());
        existing.setDescription(meeting.getDescription());
        existing.setScheduledStart(meeting.getScheduledStart());
        existing.setScheduledEnd(meeting.getScheduledEnd());
        existing.setUpdatedAt(LocalDateTime.now());

        return meetingRepository.save(existing);
    }

    @Transactional(readOnly = true)
    public Meeting getMeetingById(UUID id) {
        log.debug("Fetching meeting with id: {}", id);
        return meetingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Meeting> getMeetingsByOwner(UUID ownerId) {
        log.debug("Fetching meetings for owner: {}", ownerId);
        return meetingRepository.findByOwnerId(ownerId);
    }

    @Transactional(readOnly = true)
    public List<Meeting> getMeetingsByOwnerAndStatus(UUID ownerId, Meeting.MeetingStatus status) {
        log.debug("Fetching meetings for owner {} with status {}", ownerId, status);
        return meetingRepository.findByOwnerIdAndStatus(ownerId, status);
    }

    @Transactional(readOnly = true)
    public List<Meeting> getMeetingsByParticipant(User participant) {
        log.debug("Fetching meetings for participant: {}", participant.getId());
        return meetingRepository.findByParticipant(participant);
    }

    @Transactional(readOnly = true)
    public List<Meeting> getMeetingsInDateRange(LocalDateTime start, LocalDateTime end) {
        log.debug("Fetching meetings between {} and {}", start, end);
        return meetingRepository.findByScheduledStartBetween(start, end);
    }

    @Transactional
    public Meeting addParticipant(UUID meetingId, UUID userId) {
        log.info("Adding user {} to meeting {}", userId, meetingId);
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with id: " + meetingId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        meeting.getParticipants().add(user);
        meeting.setUpdatedAt(LocalDateTime.now());
        
        return meetingRepository.save(meeting);
    }

    @Transactional
    public Meeting removeParticipant(UUID meetingId, UUID userId) {
        log.info("Removing user {} from meeting {}", userId, meetingId);
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with id: " + meetingId));
        
        meeting.getParticipants().removeIf(p -> p.getId().equals(userId));
        meeting.setUpdatedAt(LocalDateTime.now());
        
        return meetingRepository.save(meeting);
    }

    @Transactional
    public Meeting startMeeting(UUID id) {
        log.info("Starting meeting: {}", id);
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with id: " + id));
        
        meeting.setStatus(Meeting.MeetingStatus.IN_PROGRESS);
        meeting.setActualStart(LocalDateTime.now());
        meeting.setUpdatedAt(LocalDateTime.now());
        
        return meetingRepository.save(meeting);
    }

    @Transactional
    public Meeting endMeeting(UUID id) {
        log.info("Ending meeting: {}", id);
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with id: " + id));
        
        meeting.setStatus(Meeting.MeetingStatus.COMPLETED);
        meeting.setActualEnd(LocalDateTime.now());
        meeting.setUpdatedAt(LocalDateTime.now());
        
        return meetingRepository.save(meeting);
    }

    @Async
    @Transactional
    public void processMeetingTranscription(UUID meetingId, String transcription) {
        log.info("Processing transcription for meeting: {}", meetingId);
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with id: " + meetingId));
        
        meeting.setTranscription(transcription);
        
        // Simulate AI summary generation
        String summary = generateSummary(transcription);
        meeting.setSummary(summary);
        
        meeting.setUpdatedAt(LocalDateTime.now());
        meetingRepository.save(meeting);
        
        log.info("Meeting {} transcription processed", meetingId);
    }

    private String generateSummary(String transcription) {
        // Placeholder for AI summary generation
        // In real implementation, this would call AI service to generate summary
        return "Meeting summary generated from transcription. Key points discussed and action items identified.";
    }

    @Transactional
    public void deleteMeeting(UUID id) {
        log.info("Soft deleting meeting with id: {}", id);
        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with id: " + id));
        meeting.setDeleted(true);
        meeting.setUpdatedAt(LocalDateTime.now());
        meetingRepository.save(meeting);
    }
}
