package com.ricoz.assist.infrastructure.persistence;

import com.ricoz.assist.application.port.out.repository.QueryRepositoryPort;
import com.ricoz.assist.core.domain.Query;
import com.ricoz.assist.core.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface QueryRepository extends JpaRepository<Query, UUID>, QueryRepositoryPort {

    Page<Query> findByCreatedByUser(User user, Pageable pageable);

    List<Query> findByCreatedByUserId(UUID userId);

    @org.springframework.data.jpa.repository.Query("SELECT q FROM Query q WHERE q.createdByUser.id = :userId AND q.queryType = :type AND q.deleted = false")
    List<Query> findByCreatedByUserIdAndQueryType(@Param("userId") UUID userId, @Param("type") Query.QueryType type);

    @org.springframework.data.jpa.repository.Query("SELECT q FROM Query q WHERE q.status = :status AND q.deleted = false")
    List<Query> findByStatus(@Param("status") Query.QueryStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT q FROM Query q WHERE q.knowledgeBase.id = :kbId AND q.deleted = false")
    List<Query> findByKnowledgeBaseId(@Param("kbId") UUID knowledgeBaseId);

    @org.springframework.data.jpa.repository.Query("SELECT q FROM Query q WHERE q.createdAt BETWEEN :start AND :end AND q.deleted = false")
    List<Query> findByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT q FROM Query q WHERE q.queryText ILIKE %:keyword% AND q.deleted = false")
    List<Query> searchByQueryText(@Param("keyword") String keyword);

    @org.springframework.data.jpa.repository.Query("SELECT AVG(q.processingTimeMs) FROM Query q WHERE q.status = 'COMPLETED' AND q.deleted = false")
    Double getAverageProcessingTime();
}
