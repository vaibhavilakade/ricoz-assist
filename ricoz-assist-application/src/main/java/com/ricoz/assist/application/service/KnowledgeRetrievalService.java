package com.ricoz.assist.application.service;

import com.ricoz.assist.core.domain.Document;
import com.ricoz.assist.core.domain.KnowledgeBase;
import com.ricoz.assist.application.port.out.repository.DocumentRepositoryPort;
import com.ricoz.assist.application.port.out.repository.KnowledgeBaseRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class KnowledgeRetrievalService {

    private final KnowledgeBaseRepositoryPort knowledgeBaseRepository;
    private final DocumentRepositoryPort documentRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "knowledgeBases", key = "#id")
    public KnowledgeBase getKnowledgeBaseById(UUID id) {
        log.debug("Fetching knowledge base with id: {}", id);
        return knowledgeBaseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Knowledge base not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<KnowledgeBase> getAllIndexedKnowledgeBases() {
        log.debug("Fetching all indexed knowledge bases");
        return knowledgeBaseRepository.findAllIndexed();
    }

    @Transactional(readOnly = true)
    public List<KnowledgeBase> getKnowledgeBasesByAccessLevel(KnowledgeBase.AccessLevel accessLevel) {
        log.debug("Fetching knowledge bases with access level: {}", accessLevel);
        return knowledgeBaseRepository.findByAccessLevel(accessLevel);
    }

    @Transactional
    public KnowledgeBase createKnowledgeBase(KnowledgeBase knowledgeBase) {
        log.info("Creating knowledge base with name: {}", knowledgeBase.getName());
        knowledgeBase.setDocumentCount(0);
        knowledgeBase.setIndexed(false);
        KnowledgeBase saved = knowledgeBaseRepository.save(knowledgeBase);
        log.info("Knowledge base created with id: {}", saved.getId());
        return saved;
    }

    @Transactional
    public void indexKnowledgeBase(UUID id) {
        log.info("Starting indexing for knowledge base: {}", id);
        KnowledgeBase kb = knowledgeBaseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Knowledge base not found with id: " + id));
        
        kb.setIndexingStatus("IN_PROGRESS");
        knowledgeBaseRepository.save(kb);

        List<Document> documents = documentRepository.findByKnowledgeBaseId(id);
        kb.setDocumentCount(documents.size());
        
        // Simulate indexing process - in real implementation, this would use vector embeddings
        kb.setIndexed(true);
        kb.setIndexingStatus("COMPLETED");
        knowledgeBaseRepository.save(kb);
        
        log.info("Knowledge base {} indexed with {} documents", id, documents.size());
    }

    @Transactional(readOnly = true)
    public List<Document> searchInKnowledgeBase(UUID knowledgeBaseId, String query) {
        log.debug("Searching in knowledge base {} with query: {}", knowledgeBaseId, query);
        List<Document> documents = documentRepository.findByKnowledgeBaseId(knowledgeBaseId);
        
        // Simple keyword search - in real implementation, use semantic search with embeddings
        return documents.stream()
                .filter(doc -> doc.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                        (doc.getContent() != null && doc.getContent().toLowerCase().contains(query.toLowerCase())))
                .collect(Collectors.toList());
    }

    @Transactional
    public void addDocumentToKnowledgeBase(UUID documentId, UUID knowledgeBaseId) {
        log.info("Adding document {} to knowledge base {}", documentId, knowledgeBaseId);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + documentId));
        
        KnowledgeBase kb = knowledgeBaseRepository.findById(knowledgeBaseId)
                .orElseThrow(() -> new IllegalArgumentException("Knowledge base not found with id: " + knowledgeBaseId));
        
        document.setKnowledgeBase(kb);
        documentRepository.save(document);
        
        kb.setDocumentCount(kb.getDocumentCount() + 1);
        kb.setIndexed(false); // Re-index needed
        knowledgeBaseRepository.save(kb);
    }

    @Transactional
    public void removeDocumentFromKnowledgeBase(UUID documentId) {
        log.info("Removing document {} from knowledge base", documentId);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + documentId));
        
        if (document.getKnowledgeBase() != null) {
            KnowledgeBase kb = document.getKnowledgeBase();
            document.setKnowledgeBase(null);
            documentRepository.save(document);
            
            kb.setDocumentCount(Math.max(0, kb.getDocumentCount() - 1));
            kb.setIndexed(false);
            knowledgeBaseRepository.save(kb);
        }
    }
}
