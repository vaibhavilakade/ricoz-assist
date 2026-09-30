package com.ricoz.assist.infrastructure.persistence;

import com.ricoz.assist.core.domain.Document;
import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.application.port.out.repository.DocumentRepositoryPort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID>, DocumentRepositoryPort {

    Page<Document> findByOwner(User owner, Pageable pageable);

    List<Document> findByOwnerId(UUID ownerId);

    @Query("SELECT d FROM Document d WHERE d.knowledgeBase.id = :kbId AND d.deleted = false")
    List<Document> findByKnowledgeBaseId(@Param("kbId") UUID knowledgeBaseId);

    @Query("SELECT d FROM Document d WHERE d.owner.id = :ownerId AND d.status = :status AND d.deleted = false")
    List<Document> findByOwnerIdAndStatus(@Param("ownerId") UUID ownerId, @Param("status") Document.DocumentStatus status);

    @Query("SELECT d FROM Document d WHERE (d.title ILIKE %:keyword% OR d.content ILIKE %:keyword%) AND d.deleted = false")
    List<Document> searchByKeyword(@Param("keyword") String keyword);
}
