package com.ricoz.assist.presentation.dto;

import com.ricoz.assist.core.domain.KnowledgeBase;
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
public class KnowledgeBaseDTO {

    private UUID id;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    private String description;

    @NotNull(message = "Access level is required")
    private KnowledgeBase.AccessLevel accessLevel;

    private Boolean indexed;

    private String indexingStatus;

    private Integer documentCount;

    private String createdAt;

    private String updatedAt;
}
