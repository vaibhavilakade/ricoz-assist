package com.ricoz.assist.presentation.dto.mapper;

import com.ricoz.assist.core.domain.Document;
import com.ricoz.assist.core.domain.KnowledgeBase;
import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.presentation.dto.DocumentDTO;
import org.mapstruct.Mapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Builder;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface DocumentMapper {

    DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "owner.username", target = "ownerUsername")
    @Mapping(source = "knowledgeBase.id", target = "knowledgeBaseId")
    @Mapping(source = "knowledgeBase.name", target = "knowledgeBaseName")
    DocumentDTO toDTO(Document document);

    @BeanMapping(builder = @Builder(disableBuilder = true))
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(source = "ownerId", target = "owner")
    @Mapping(source = "knowledgeBaseId", target = "knowledgeBase")
    @Mapping(target = "lastEditedAt", ignore = true)
    @Mapping(target = "aiGenerated", defaultValue = "false")
    Document toEntity(DocumentDTO documentDTO);

    default User mapOwnerId(java.util.UUID id) {
        if (id == null) {
            return null;
        }
        User owner = new User();
        owner.setId(id);
        return owner;
    }

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
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "knowledgeBase", ignore = true)
    void updateEntityFromDTO(DocumentDTO documentDTO, @MappingTarget Document document);

    default String mapToString(java.time.LocalDateTime dateTime) {
        return dateTime != null ? dateTime.format(FORMATTER) : null;
    }
}
