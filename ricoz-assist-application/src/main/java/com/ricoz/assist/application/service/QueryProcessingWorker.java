package com.ricoz.assist.application.service;

import com.ricoz.assist.core.domain.Query;
import com.ricoz.assist.application.port.out.repository.QueryRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class QueryProcessingWorker {

    private final QueryRepositoryPort queryRepository;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void process(QueryCreatedEvent event) {
        var queryId = event.queryId();
        log.info("Processing query asynchronously: {}", queryId);
        long startTime = System.currentTimeMillis();

        try {
            Query query = queryRepository.findById(queryId)
                    .orElseThrow(() -> new IllegalArgumentException("Query not found with id: " + queryId));

            query.setResponse(generateResponse(query));
            query.setStatus(Query.QueryStatus.COMPLETED);
            query.setProcessingTimeMs(System.currentTimeMillis() - startTime);
            query.setConfidenceScore(0.85);
            query.setUpdatedAt(LocalDateTime.now());
            queryRepository.save(query);
            log.info("Query {} processed successfully in {}ms", queryId, query.getProcessingTimeMs());
        } catch (RuntimeException e) {
            log.error("Error processing query {}", queryId, e);
            queryRepository.findById(queryId).ifPresent(query -> {
                query.setStatus(Query.QueryStatus.FAILED);
                query.setUpdatedAt(LocalDateTime.now());
                queryRepository.save(query);
            });
        }
    }

    private String generateResponse(Query query) {
        return switch (query.getQueryType()) {
            case KNOWLEDGE_SEARCH -> query.getKnowledgeBase() != null
                    ? "Based on the knowledge base search, here are the relevant documents..."
                    : "No knowledge base specified for search.";
            case DOCUMENT_QUERY -> "Document query processed. Here are the results...";
            case BUSINESS_SYSTEM_QUERY -> "Business system query processed. Data retrieved from ERP system.";
            case GENERAL_QA -> "General Q&A response generated based on available context.";
        };
    }
}
