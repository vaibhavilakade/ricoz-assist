package com.ricoz.assist.application.port.out.repository;

import com.ricoz.assist.core.domain.Document;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentRepositoryPort {
    Document save(Document document);

    Optional<Document> findById(UUID id);

    List<Document> findByOwnerId(UUID ownerId);

    List<Document> findByKnowledgeBaseId(UUID knowledgeBaseId);

    List<Document> searchByKeyword(String keyword);
}
