package com.ricoz.assist.presentation.dto;

import com.ricoz.assist.core.domain.Meeting;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingDTO {

    private UUID id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    private String description;

    @NotNull(message = "Scheduled start time is required")
    private LocalDateTime scheduledStart;

    @NotNull(message = "Scheduled end time is required")
    private LocalDateTime scheduledEnd;

    private LocalDateTime actualStart;

    private LocalDateTime actualEnd;

    @NotNull(message = "Status is required")
    private Meeting.MeetingStatus status;

    private String transcription;

    private String summary;

    private String recordingUrl;

    private UUID ownerId;

    private String ownerUsername;

    private List<UUID> participantIds;

    private Integer actionItemCount;

    private String createdAt;

    private String updatedAt;
}
