package com.ricoz.assist.presentation.dto;

import com.ricoz.assist.core.domain.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {

    private UUID id;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    private String content;

    @NotNull(message = "Status is required")
    private Document.DocumentStatus status;

    @NotNull(message = "Document type is required")
    private Document.DocumentType documentType;

    private UUID ownerId;

    private String ownerUsername;

    private UUID knowledgeBaseId;

    private String knowledgeBaseName;

    private Integer version;

    private String lastEditedAt;

    private Boolean aiGenerated;

    private String tags;

    private String createdAt;

    private String updatedAt;
}
