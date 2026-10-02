package com.ricoz.assist.presentation.controller;

import com.ricoz.assist.application.service.DocumentService;
import com.ricoz.assist.application.service.UserService;
import com.ricoz.assist.core.domain.Document;
import com.ricoz.assist.presentation.dto.DocumentDTO;
import com.ricoz.assist.presentation.dto.mapper.DocumentMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
@Tag(name = "Document Management", description = "APIs for managing documents")
public class DocumentController {

    private final DocumentService documentService;
    private final UserService userService;
    private final DocumentMapper documentMapper;

    @GetMapping
    @Operation(summary = "Get documents for the authenticated user")
    public ResponseEntity<List<DocumentDTO>> getDocuments(Authentication authentication) {
        UUID ownerId = userService.getUserByUsername(authentication.getName()).getId();
        List<DocumentDTO> documents = documentService.getDocumentsByOwner(ownerId).stream()
                .map(documentMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(documents);
    }

    @PostMapping
    @Operation(summary = "Create a new document")
    public ResponseEntity<DocumentDTO> createDocument(@Valid @RequestBody DocumentDTO documentDTO) {
        Document document = documentMapper.toEntity(documentDTO);
        Document created = documentService.createDocument(document);
        return ResponseEntity.status(HttpStatus.CREATED).body(documentMapper.toDTO(created));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get document by ID")
    public ResponseEntity<DocumentDTO> getDocumentById(@PathVariable UUID id) {
        Document document = documentService.getDocumentById(id);
        return ResponseEntity.ok(documentMapper.toDTO(document));
    }

    @GetMapping("/owner/{ownerId}")
    @Operation(summary = "Get documents by owner")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByOwner(@PathVariable UUID ownerId) {
        List<Document> documents = documentService.getDocumentsByOwner(ownerId);
        return ResponseEntity.ok(documents.stream()
                .map(documentMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/knowledge-base/{kbId}")
    @Operation(summary = "Get documents by knowledge base")
    public ResponseEntity<List<DocumentDTO>> getDocumentsByKnowledgeBase(@PathVariable UUID kbId) {
        List<Document> documents = documentService.getDocumentsByKnowledgeBase(kbId);
        return ResponseEntity.ok(documents.stream()
                .map(documentMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/search")
    @Operation(summary = "Search documents by keyword")
    public ResponseEntity<List<DocumentDTO>> searchDocuments(@RequestParam String keyword) {
        List<Document> documents = documentService.searchDocuments(keyword);
        return ResponseEntity.ok(documents.stream()
                .map(documentMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update document")
    public ResponseEntity<DocumentDTO> updateDocument(@PathVariable UUID id, @Valid @RequestBody DocumentDTO documentDTO) {
        Document document = documentMapper.toEntity(documentDTO);
        Document updated = documentService.updateDocument(id, document);
        return ResponseEntity.ok(documentMapper.toDTO(updated));
    }

    @PatchMapping("/{id}/knowledge-base/{kbId}")
    @Operation(summary = "Add document to knowledge base")
    public ResponseEntity<DocumentDTO> addToKnowledgeBase(@PathVariable UUID id, @PathVariable UUID kbId) {
        Document updated = documentService.addToKnowledgeBase(id, kbId);
        return ResponseEntity.ok(documentMapper.toDTO(updated));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update document status")
    public ResponseEntity<DocumentDTO> updateStatus(@PathVariable UUID id, @RequestParam Document.DocumentStatus status) {
        Document updated = documentService.updateStatus(id, status);
        return ResponseEntity.ok(documentMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete document (soft delete)")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
