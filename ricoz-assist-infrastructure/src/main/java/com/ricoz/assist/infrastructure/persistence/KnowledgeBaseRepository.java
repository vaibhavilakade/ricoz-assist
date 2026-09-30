package com.ricoz.assist.infrastructure.persistence;

import com.ricoz.assist.core.domain.KnowledgeBase;
import com.ricoz.assist.application.port.out.repository.KnowledgeBaseRepositoryPort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface KnowledgeBaseRepository extends JpaRepository<KnowledgeBase, UUID>, KnowledgeBaseRepositoryPort {

    @Query("SELECT kb FROM KnowledgeBase kb WHERE kb.indexed = true AND kb.deleted = false")
    List<KnowledgeBase> findAllIndexed();

    @Query("SELECT kb FROM KnowledgeBase kb WHERE kb.accessLevel = :accessLevel AND kb.deleted = false")
    List<KnowledgeBase> findByAccessLevel(@Param("accessLevel") KnowledgeBase.AccessLevel accessLevel);

    @Query("SELECT kb FROM KnowledgeBase kb WHERE kb.name ILIKE %:name% AND kb.deleted = false")
    List<KnowledgeBase> searchByName(@Param("name") String name);
}
