package com.ricoz.assist.application.service;

import com.ricoz.assist.core.domain.Query;
import com.ricoz.assist.application.port.out.repository.QueryRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class QueryProcessingService {

    private final QueryRepositoryPort queryRepository;
    private final KnowledgeRetrievalService knowledgeRetrievalService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public Query createQuery(Query query) {
        log.info("Creating query of type: {}", query.getQueryType());
        if (query.getCreatedByUser() == null) {
            throw new IllegalArgumentException("Query creator is required");
        }
        if (query.getKnowledgeBase() != null) {
            query.setKnowledgeBase(knowledgeRetrievalService.getKnowledgeBaseById(query.getKnowledgeBase().getId()));
        }
        query.setStatus(Query.QueryStatus.PROCESSING);
        query.setCreatedAt(LocalDateTime.now());
        Query saved = queryRepository.save(query);
        eventPublisher.publishEvent(new QueryCreatedEvent(saved.getId()));
        
        return saved;
    }

    @Transactional(readOnly = true)
    public Query getQueryById(UUID id) {
        log.debug("Fetching query with id: {}", id);
        return queryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Query not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Query> getQueriesByUser(UUID userId) {
        log.debug("Fetching queries for user: {}", userId);
        return queryRepository.findByCreatedByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Query> getQueriesByType(UUID userId, Query.QueryType type) {
        log.debug("Fetching queries for user {} of type {}", userId, type);
        return queryRepository.findByCreatedByUserIdAndQueryType(userId, type);
    }

    @Transactional(readOnly = true)
    public List<Query> getPendingQueries() {
        log.debug("Fetching pending queries");
        return queryRepository.findByStatus(Query.QueryStatus.PROCESSING);
    }

    @Transactional(readOnly = true)
    public Double getAverageProcessingTime() {
        return queryRepository.getAverageProcessingTime();
    }

    @Transactional
    public void deleteQuery(UUID id) {
        log.info("Soft deleting query with id: {}", id);
        Query query = queryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Query not found with id: " + id));
        query.setDeleted(true);
        query.setUpdatedAt(LocalDateTime.now());
        queryRepository.save(query);
    }
}
