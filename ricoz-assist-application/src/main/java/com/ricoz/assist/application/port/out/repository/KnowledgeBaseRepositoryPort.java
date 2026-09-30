package com.ricoz.assist.application.port.out.repository;

import com.ricoz.assist.core.domain.KnowledgeBase;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface KnowledgeBaseRepositoryPort {
    KnowledgeBase save(KnowledgeBase knowledgeBase);

    Optional<KnowledgeBase> findById(UUID id);

    List<KnowledgeBase> findAllIndexed();

    List<KnowledgeBase> findByAccessLevel(KnowledgeBase.AccessLevel accessLevel);
}
