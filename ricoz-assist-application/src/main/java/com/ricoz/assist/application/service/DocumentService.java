package com.ricoz.assist.application.service;

import com.ricoz.assist.core.domain.Document;
import com.ricoz.assist.core.domain.KnowledgeBase;
import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.application.port.out.repository.DocumentRepositoryPort;
import com.ricoz.assist.application.port.out.repository.KnowledgeBaseRepositoryPort;
import com.ricoz.assist.application.port.out.repository.UserRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepositoryPort documentRepository;
    private final KnowledgeBaseRepositoryPort knowledgeBaseRepository;
    private final UserRepositoryPort userRepository;

    @Transactional
    public Document createDocument(Document document) {
        log.info("Creating document with title: {}", document.getTitle());
        if (document.getOwner() == null || document.getOwner().getId() == null) {
            throw new IllegalArgumentException("Document owner is required");
        }
        document.setOwner(userRepository.findById(document.getOwner().getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found with id: " + document.getOwner().getId())));
        if (document.getKnowledgeBase() != null) {
            document.setKnowledgeBase(knowledgeBaseRepository.findById(document.getKnowledgeBase().getId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Knowledge base not found with id: " + document.getKnowledgeBase().getId())));
        }
        document.setVersion(1);
        document.setCreatedAt(LocalDateTime.now());
        Document saved = documentRepository.save(document);
        log.info("Document created with id: {}", saved.getId());
        return saved;
    }

    @Transactional
    public Document updateDocument(UUID id, Document document) {
        log.info("Updating document with id: {}", id);
        Document existing = documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + id));

        existing.setTitle(document.getTitle());
        existing.setContent(document.getContent());
        existing.setStatus(document.getStatus());
        existing.setDocumentType(document.getDocumentType());
        existing.setTags(document.getTags());
        existing.setVersion(existing.getVersion() + 1);
        existing.setLastEditedAt(LocalDateTime.now());
        existing.setUpdatedAt(LocalDateTime.now());

        Document updated = documentRepository.save(existing);
        log.info("Document updated with id: {}, version: {}", updated.getId(), updated.getVersion());
        return updated;
    }

    @Transactional(readOnly = true)
    public Document getDocumentById(UUID id) {
        log.debug("Fetching document with id: {}", id);
        return documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Document> getDocumentsByOwner(UUID ownerId) {
        log.debug("Fetching documents for owner: {}", ownerId);
        return documentRepository.findByOwnerId(ownerId);
    }

    @Transactional(readOnly = true)
    public List<Document> getDocumentsByKnowledgeBase(UUID knowledgeBaseId) {
        log.debug("Fetching documents for knowledge base: {}", knowledgeBaseId);
        return documentRepository.findByKnowledgeBaseId(knowledgeBaseId);
    }

    @Transactional(readOnly = true)
    public List<Document> searchDocuments(String keyword) {
        log.debug("Searching documents with keyword: {}", keyword);
        return documentRepository.searchByKeyword(keyword);
    }

    @Transactional
    public void deleteDocument(UUID id) {
        log.info("Soft deleting document with id: {}", id);
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + id));
        document.setDeleted(true);
        document.setUpdatedAt(LocalDateTime.now());
        documentRepository.save(document);
    }

    @Transactional
    public Document addToKnowledgeBase(UUID documentId, UUID knowledgeBaseId) {
        log.info("Adding document {} to knowledge base {}", documentId, knowledgeBaseId);
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + documentId));
        
        KnowledgeBase kb = knowledgeBaseRepository.findById(knowledgeBaseId)
                .orElseThrow(() -> new IllegalArgumentException("Knowledge base not found with id: " + knowledgeBaseId));
        document.setKnowledgeBase(kb);
        document.setUpdatedAt(LocalDateTime.now());
        
        return documentRepository.save(document);
    }

    @Transactional
    public Document updateStatus(UUID id, Document.DocumentStatus status) {
        log.info("Updating document {} status to {}", id, status);
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + id));
        document.setStatus(status);
        document.setUpdatedAt(LocalDateTime.now());
        return documentRepository.save(document);
    }
}
