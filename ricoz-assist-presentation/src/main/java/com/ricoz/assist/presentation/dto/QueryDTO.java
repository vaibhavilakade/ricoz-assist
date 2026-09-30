package com.ricoz.assist.presentation.dto;

import com.ricoz.assist.core.domain.Query;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueryDTO {

    private UUID id;

    @NotBlank(message = "Query text is required")
    private String queryText;

    private String response;

    @NotNull(message = "Query type is required")
    private Query.QueryType queryType;

    private Query.QueryStatus status;

    private Long processingTimeMs;

    private Double confidenceScore;

    private UUID createdByUserId;

    private String createdByUsername;

    private UUID knowledgeBaseId;

    private String knowledgeBaseName;

    private String contextUsed;

    private String sourceSystem;

    private String createdAt;

    private String updatedAt;
}
