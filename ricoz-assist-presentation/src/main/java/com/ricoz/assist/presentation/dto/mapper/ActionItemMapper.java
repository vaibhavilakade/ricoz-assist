package com.ricoz.assist.presentation.dto.mapper;

import com.ricoz.assist.core.domain.ActionItem;
import com.ricoz.assist.presentation.dto.ActionItemDTO;
import org.mapstruct.Mapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Builder;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface ActionItemMapper {

    DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Mapping(source = "meeting.id", target = "meetingId")
    @Mapping(source = "meeting.title", target = "meetingTitle")
    @Mapping(source = "assignedTo.id", target = "assignedToId")
    @Mapping(source = "assignedTo.username", target = "assignedToUsername")
    ActionItemDTO toDTO(ActionItem actionItem);

    @BeanMapping(builder = @Builder(disableBuilder = true))
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(source = "meetingId", target = "meeting")
    @Mapping(source = "assignedToId", target = "assignedTo")
    @Mapping(target = "aiExtracted", defaultValue = "false")
    ActionItem toEntity(ActionItemDTO actionItemDTO);

    default com.ricoz.assist.core.domain.Meeting mapMeetingId(java.util.UUID id) {
        if (id == null) {
            return null;
        }
        com.ricoz.assist.core.domain.Meeting meeting = new com.ricoz.assist.core.domain.Meeting();
        meeting.setId(id);
        return meeting;
    }

    default com.ricoz.assist.core.domain.User mapUserId(java.util.UUID id) {
        if (id == null) {
            return null;
        }
        com.ricoz.assist.core.domain.User user = new com.ricoz.assist.core.domain.User();
        user.setId(id);
        return user;
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "meeting", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    void updateEntityFromDTO(ActionItemDTO actionItemDTO, @MappingTarget ActionItem actionItem);

    default String mapToString(java.time.LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(FORMATTER) : null;
    }
}
