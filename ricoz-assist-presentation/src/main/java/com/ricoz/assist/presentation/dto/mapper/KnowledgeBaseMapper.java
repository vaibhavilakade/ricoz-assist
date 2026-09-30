package com.ricoz.assist.presentation.dto.mapper;

import com.ricoz.assist.core.domain.KnowledgeBase;
import com.ricoz.assist.presentation.dto.KnowledgeBaseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Builder;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface KnowledgeBaseMapper {

    DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    KnowledgeBaseDTO toDTO(KnowledgeBase knowledgeBase);

    @BeanMapping(builder = @Builder(disableBuilder = true))
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "documents", ignore = true)
    KnowledgeBase toEntity(KnowledgeBaseDTO knowledgeBaseDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "documents", ignore = true)
    void updateEntityFromDTO(KnowledgeBaseDTO knowledgeBaseDTO, @MappingTarget KnowledgeBase knowledgeBase);

    default String mapToString(java.time.LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(FORMATTER) : null;
    }
}
