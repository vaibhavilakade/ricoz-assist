package com.ricoz.assist.presentation.dto.mapper;

import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.presentation.dto.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Builder;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface UserMapper {

    DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    UserDTO toDTO(User user);

    @BeanMapping(builder = @Builder(disableBuilder = true))
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "documents", ignore = true)
    @Mapping(target = "meetings", ignore = true)
    @Mapping(target = "assignedActionItems", ignore = true)
    @Mapping(target = "queries", ignore = true)
    User toEntity(UserDTO userDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "documents", ignore = true)
    @Mapping(target = "meetings", ignore = true)
    @Mapping(target = "assignedActionItems", ignore = true)
    @Mapping(target = "queries", ignore = true)
    void updateEntityFromDTO(UserDTO userDTO, @MappingTarget User user);

    default String mapToString(java.time.LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(FORMATTER) : null;
    }
}
