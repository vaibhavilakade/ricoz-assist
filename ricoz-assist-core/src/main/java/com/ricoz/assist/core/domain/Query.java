package com.ricoz.assist.core.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "queries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Query extends BaseEntity {

    @Column(name = "query_text", nullable = false, columnDefinition = "TEXT")
    private String queryText;

    @Column(name = "response", columnDefinition = "TEXT")
    private String response;

    @Enumerated(EnumType.STRING)
    @Column(name = "query_type", nullable = false, length = 50)
    private QueryType queryType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private QueryStatus status = QueryStatus.PROCESSING;

    @Column(name = "processing_time_ms")
    private Long processingTimeMs;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdByUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "knowledge_base_id")
    private KnowledgeBase knowledgeBase;

    @Column(name = "context_used", columnDefinition = "TEXT")
    private String contextUsed;

    @Column(name = "source_system", length = 100)
    private String sourceSystem;

    public enum QueryType {
        KNOWLEDGE_SEARCH,
        DOCUMENT_QUERY,
        BUSINESS_SYSTEM_QUERY,
        GENERAL_QA
    }

    public enum QueryStatus {
        PROCESSING,
        COMPLETED,
        FAILED,
        TIMEOUT
    }
}
