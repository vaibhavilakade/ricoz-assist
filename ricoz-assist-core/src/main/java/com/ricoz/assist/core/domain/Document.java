package com.ricoz.assist.core.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Document extends BaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private DocumentStatus status = DocumentStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 50)
    private DocumentType documentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "knowledge_base_id")
    private KnowledgeBase knowledgeBase;

    @Column(name = "version", nullable = false)
    @Builder.Default
    private Integer version = 1;

    @Column(name = "last_edited_at")
    private LocalDateTime lastEditedAt;

    @Column(name = "ai_generated", nullable = false)
    @Builder.Default
    private Boolean aiGenerated = false;

    @Column(name = "tags", length = 500)
    private String tags;

    public enum DocumentStatus {
        DRAFT,
        IN_REVIEW,
        PUBLISHED,
        ARCHIVED
    }

    public enum DocumentType {
        REPORT,
        EMAIL,
        PROPOSAL,
        MEMO,
        CONTRACT,
        PRESENTATION,
        OTHER
    }
}
