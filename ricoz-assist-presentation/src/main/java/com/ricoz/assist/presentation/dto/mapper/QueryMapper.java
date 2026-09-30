package com.ricoz.assist.presentation.dto.mapper;

import com.ricoz.assist.core.domain.Query;
import com.ricoz.assist.core.domain.KnowledgeBase;
import com.ricoz.assist.presentation.dto.QueryDTO;
import org.mapstruct.Mapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Builder;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface QueryMapper {

    DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Mapping(source = "createdByUser.id", target = "createdByUserId")
    @Mapping(source = "createdByUser.username", target = "createdByUsername")
    @Mapping(source = "knowledgeBase.id", target = "knowledgeBaseId")
    @Mapping(source = "knowledgeBase.name", target = "knowledgeBaseName")
    QueryDTO toDTO(Query query);

    @BeanMapping(builder = @Builder(disableBuilder = true))
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "createdByUser", ignore = true)
    @Mapping(source = "knowledgeBaseId", target = "knowledgeBase")
    Query toEntity(QueryDTO queryDTO);

    default KnowledgeBase mapKnowledgeBaseId(java.util.UUID id) {
        if (id == null) {
            return null;
        }
        KnowledgeBase knowledgeBase = new KnowledgeBase();
        knowledgeBase.setId(id);
        return knowledgeBase;
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "createdByUser", ignore = true)
    @Mapping(target = "knowledgeBase", ignore = true)
    void updateEntityFromDTO(QueryDTO queryDTO, @MappingTarget Query query);

    default String mapToString(java.time.LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(FORMATTER) : null;
    }
}
