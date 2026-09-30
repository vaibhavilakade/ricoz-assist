package com.ricoz.assist.presentation.controller;

import com.ricoz.assist.application.service.ActionItemService;
import com.ricoz.assist.core.domain.ActionItem;
import com.ricoz.assist.presentation.dto.ActionItemDTO;
import com.ricoz.assist.presentation.dto.mapper.ActionItemMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/action-items")
@RequiredArgsConstructor
@Tag(name = "Action Item Management", description = "APIs for managing action items")
public class ActionItemController {

    private final ActionItemService actionItemService;
    private final ActionItemMapper actionItemMapper;

    @PostMapping
    @Operation(summary = "Create a new action item")
    public ResponseEntity<ActionItemDTO> createActionItem(@Valid @RequestBody ActionItemDTO actionItemDTO) {
        ActionItem actionItem = actionItemMapper.toEntity(actionItemDTO);
        ActionItem created = actionItemService.createActionItem(actionItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(actionItemMapper.toDTO(created));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get action item by ID")
    public ResponseEntity<ActionItemDTO> getActionItemById(@PathVariable UUID id) {
        ActionItem actionItem = actionItemService.getActionItemById(id);
        return ResponseEntity.ok(actionItemMapper.toDTO(actionItem));
    }

    @GetMapping("/assigned-to/{userId}")
    @Operation(summary = "Get action items assigned to user")
    public ResponseEntity<List<ActionItemDTO>> getActionItemsByAssignedTo(@PathVariable UUID userId) {
        List<ActionItem> actionItems = actionItemService.getActionItemsByAssignedTo(userId);
        return ResponseEntity.ok(actionItems.stream()
                .map(actionItemMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/assigned-to/{userId}/status/{status}")
    @Operation(summary = "Get action items by assigned user and status")
    public ResponseEntity<List<ActionItemDTO>> getActionItemsByAssignedToAndStatus(
            @PathVariable UUID userId, @PathVariable ActionItem.ActionItemStatus status) {
        List<ActionItem> actionItems = actionItemService.getActionItemsByAssignedToAndStatus(userId, status);
        return ResponseEntity.ok(actionItems.stream()
                .map(actionItemMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/meeting/{meetingId}")
    @Operation(summary = "Get action items by meeting")
    public ResponseEntity<List<ActionItemDTO>> getActionItemsByMeeting(@PathVariable UUID meetingId) {
        List<ActionItem> actionItems = actionItemService.getActionItemsByMeeting(meetingId);
        return ResponseEntity.ok(actionItems.stream()
                .map(actionItemMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue action items")
    public ResponseEntity<List<ActionItemDTO>> getOverdueActionItems() {
        List<ActionItem> actionItems = actionItemService.getOverdueActionItems();
        return ResponseEntity.ok(actionItems.stream()
                .map(actionItemMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/due-between")
    @Operation(summary = "Get action items due between dates")
    public ResponseEntity<List<ActionItemDTO>> getActionItemsDueBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<ActionItem> actionItems = actionItemService.getActionItemsDueBetween(start, end);
        return ResponseEntity.ok(actionItems.stream()
                .map(actionItemMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/assigned-to/{userId}/priority/{priority}")
    @Operation(summary = "Get action items by assigned user and priority")
    public ResponseEntity<List<ActionItemDTO>> getActionItemsByPriority(
            @PathVariable UUID userId, @PathVariable ActionItem.Priority priority) {
        List<ActionItem> actionItems = actionItemService.getActionItemsByPriority(userId, priority);
        return ResponseEntity.ok(actionItems.stream()
                .map(actionItemMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update action item")
    public ResponseEntity<ActionItemDTO> updateActionItem(@PathVariable UUID id, @Valid @RequestBody ActionItemDTO actionItemDTO) {
        ActionItem actionItem = actionItemMapper.toEntity(actionItemDTO);
        ActionItem updated = actionItemService.updateActionItem(id, actionItem);
        return ResponseEntity.ok(actionItemMapper.toDTO(updated));
    }

    @PatchMapping("/{id}/complete")
    @Operation(summary = "Complete action item")
    public ResponseEntity<ActionItemDTO> completeActionItem(@PathVariable UUID id) {
        ActionItem updated = actionItemService.completeActionItem(id);
        return ResponseEntity.ok(actionItemMapper.toDTO(updated));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update action item status")
    public ResponseEntity<ActionItemDTO> updateStatus(@PathVariable UUID id, @RequestParam ActionItem.ActionItemStatus status) {
        ActionItem updated = actionItemService.updateStatus(id, status);
        return ResponseEntity.ok(actionItemMapper.toDTO(updated));
    }

    @PatchMapping("/{id}/assign/{userId}")
    @Operation(summary = "Assign action item to user")
    public ResponseEntity<ActionItemDTO> assignToUser(@PathVariable UUID id, @PathVariable UUID userId) {
        ActionItem updated = actionItemService.assignToUser(id, userId);
        return ResponseEntity.ok(actionItemMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete action item (soft delete)")
    public ResponseEntity<Void> deleteActionItem(@PathVariable UUID id) {
        actionItemService.deleteActionItem(id);
        return ResponseEntity.noContent().build();
    }
}
