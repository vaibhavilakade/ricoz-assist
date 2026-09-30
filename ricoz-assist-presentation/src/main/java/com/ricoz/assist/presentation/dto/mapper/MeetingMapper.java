package com.ricoz.assist.presentation.dto.mapper;

import com.ricoz.assist.core.domain.Meeting;
import com.ricoz.assist.presentation.dto.MeetingDTO;
import org.mapstruct.Mapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Builder;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface MeetingMapper {

    DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "owner.username", target = "ownerUsername")
    @Mapping(source = "participants", target = "participantIds")
    @Mapping(target = "actionItemCount", ignore = true)
    MeetingDTO toDTO(Meeting meeting);

    @BeanMapping(builder = @Builder(disableBuilder = true))
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(source = "ownerId", target = "owner")
    @Mapping(source = "participantIds", target = "participants")
    @Mapping(target = "actionItems", ignore = true)
    Meeting toEntity(MeetingDTO meetingDTO);

    default com.ricoz.assist.core.domain.User mapOwnerId(java.util.UUID id) {
        if (id == null) {
            return null;
        }
        com.ricoz.assist.core.domain.User owner = new com.ricoz.assist.core.domain.User();
        owner.setId(id);
        return owner;
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "actionItems", ignore = true)
    void updateEntityFromDTO(MeetingDTO meetingDTO, @MappingTarget Meeting meeting);

    default List<java.util.UUID> mapParticipants(java.util.Set<com.ricoz.assist.core.domain.User> participants) {
        return participants != null ? participants.stream()
                .map(com.ricoz.assist.core.domain.User::getId)
                .collect(Collectors.toList()) : null;
    }

    default java.util.Set<com.ricoz.assist.core.domain.User> mapParticipantIds(List<java.util.UUID> participantIds) {
        if (participantIds == null) {
            return null;
        }
        return participantIds.stream()
                .map(id -> {
                    com.ricoz.assist.core.domain.User user = new com.ricoz.assist.core.domain.User();
                    user.setId(id);
                    return user;
                })
                .collect(Collectors.toSet());
    }

    default String mapToString(java.time.LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(FORMATTER) : null;
    }
}
