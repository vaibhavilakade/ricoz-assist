package com.ricoz.assist.core.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "knowledge_bases")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class KnowledgeBase extends BaseEntity {

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "access_level", nullable = false, length = 20)
    @Builder.Default
    private AccessLevel accessLevel = AccessLevel.PRIVATE;

    @Column(name = "indexed", nullable = false)
    @Builder.Default
    private Boolean indexed = false;

    @Column(name = "indexing_status", length = 20)
    private String indexingStatus;

    @Column(name = "document_count")
    @Builder.Default
    private Integer documentCount = 0;

    @OneToMany(mappedBy = "knowledgeBase", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Document> documents = new HashSet<>();

    public enum AccessLevel {
        PRIVATE,
        TEAM,
        ORGANIZATION,
        PUBLIC
    }
}
