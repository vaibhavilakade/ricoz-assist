package com.ricoz.assist.presentation.dto;

import com.ricoz.assist.core.domain.ActionItem;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionItemDTO {

    private UUID id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private ActionItem.Priority priority;

    @NotNull(message = "Status is required")
    private ActionItem.ActionItemStatus status;

    private LocalDate dueDate;

    private LocalDateTime completedAt;

    private UUID meetingId;

    private String meetingTitle;

    private UUID assignedToId;

    private String assignedToUsername;

    private Boolean aiExtracted;

    private String createdAt;

    private String updatedAt;
}
