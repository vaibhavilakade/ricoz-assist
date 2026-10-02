package com.ricoz.assist.presentation.controller;

import com.ricoz.assist.application.service.MeetingService;
import com.ricoz.assist.application.service.UserService;
import com.ricoz.assist.core.domain.Meeting;
import com.ricoz.assist.presentation.dto.MeetingDTO;
import com.ricoz.assist.presentation.dto.mapper.MeetingMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/meetings")
@RequiredArgsConstructor
@Tag(name = "Meeting Management", description = "APIs for managing meetings")
public class MeetingController {

    private final MeetingService meetingService;
    private final UserService userService;
    private final MeetingMapper meetingMapper;

    @GetMapping
    @Operation(summary = "Get meetings for the authenticated user")
    public ResponseEntity<List<MeetingDTO>> getMeetings(Authentication authentication) {
        UUID ownerId = userService.getUserByUsername(authentication.getName()).getId();
        List<MeetingDTO> meetings = meetingService.getMeetingsByOwner(ownerId).stream()
                .map(meetingMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(meetings);
    }

    @PostMapping
    @Operation(summary = "Create a new meeting")
    public ResponseEntity<MeetingDTO> createMeeting(@Valid @RequestBody MeetingDTO meetingDTO) {
        Meeting meeting = meetingMapper.toEntity(meetingDTO);
        Meeting created = meetingService.createMeeting(meeting);
        return ResponseEntity.status(HttpStatus.CREATED).body(meetingMapper.toDTO(created));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get meeting by ID")
    public ResponseEntity<MeetingDTO> getMeetingById(@PathVariable UUID id) {
        Meeting meeting = meetingService.getMeetingById(id);
        return ResponseEntity.ok(meetingMapper.toDTO(meeting));
    }

    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "Get meetings by owner")
    public ResponseEntity<List<MeetingDTO>> getMeetingsByOwner(@PathVariable UUID ownerId) {
        List<Meeting> meetings = meetingService.getMeetingsByOwner(ownerId);
        return ResponseEntity.ok(meetings.stream()
                .map(meetingMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/owner/{ownerId}/status/{status}")
    @Operation(summary = "Get meetings by owner and status")
    public ResponseEntity<List<MeetingDTO>> getMeetingsByOwnerAndStatus(
            @PathVariable UUID ownerId, @PathVariable Meeting.MeetingStatus status) {
        List<Meeting> meetings = meetingService.getMeetingsByOwnerAndStatus(ownerId, status);
        return ResponseEntity.ok(meetings.stream()
                .map(meetingMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get meetings in date range")
    public ResponseEntity<List<MeetingDTO>> getMeetingsInDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Meeting> meetings = meetingService.getMeetingsInDateRange(start, end);
        return ResponseEntity.ok(meetings.stream()
                .map(meetingMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update meeting")
    public ResponseEntity<MeetingDTO> updateMeeting(@PathVariable UUID id, @Valid @RequestBody MeetingDTO meetingDTO) {
        Meeting meeting = meetingMapper.toEntity(meetingDTO);
        Meeting updated = meetingService.updateMeeting(id, meeting);
        return ResponseEntity.ok(meetingMapper.toDTO(updated));
    }

    @PostMapping("/{id}/participants/{userId}")
    @Operation(summary = "Add participant to meeting")
    public ResponseEntity<MeetingDTO> addParticipant(@PathVariable UUID id, @PathVariable UUID userId) {
        Meeting updated = meetingService.addParticipant(id, userId);
        return ResponseEntity.ok(meetingMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}/participants/{userId}")
    @Operation(summary = "Remove participant from meeting")
    public ResponseEntity<MeetingDTO> removeParticipant(@PathVariable UUID id, @PathVariable UUID userId) {
        Meeting updated = meetingService.removeParticipant(id, userId);
        return ResponseEntity.ok(meetingMapper.toDTO(updated));
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "Start meeting")
    public ResponseEntity<MeetingDTO> startMeeting(@PathVariable UUID id) {
        Meeting updated = meetingService.startMeeting(id);
        return ResponseEntity.ok(meetingMapper.toDTO(updated));
    }

    @PostMapping("/{id}/end")
    @Operation(summary = "End meeting")
    public ResponseEntity<MeetingDTO> endMeeting(@PathVariable UUID id) {
        Meeting updated = meetingService.endMeeting(id);
        return ResponseEntity.ok(meetingMapper.toDTO(updated));
    }

    @PostMapping("/{id}/transcription")
    @Operation(summary = "Process meeting transcription")
    public ResponseEntity<Void> processTranscription(@PathVariable UUID id, @RequestBody String transcription) {
        meetingService.processMeetingTranscription(id, transcription);
        return ResponseEntity.accepted().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete meeting (soft delete)")
    public ResponseEntity<Void> deleteMeeting(@PathVariable UUID id) {
        meetingService.deleteMeeting(id);
        return ResponseEntity.noContent().build();
    }
}
