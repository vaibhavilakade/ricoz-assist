package com.ricoz.assist.presentation.controller;

import com.ricoz.assist.application.service.KnowledgeRetrievalService;
import com.ricoz.assist.core.domain.KnowledgeBase;
import com.ricoz.assist.presentation.dto.KnowledgeBaseDTO;
import com.ricoz.assist.presentation.dto.mapper.KnowledgeBaseMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/knowledge-bases")
@RequiredArgsConstructor
@Tag(name = "Knowledge Base Management", description = "APIs for managing knowledge bases")
public class KnowledgeBaseController {

    private final KnowledgeRetrievalService knowledgeRetrievalService;
    private final KnowledgeBaseMapper knowledgeBaseMapper;

    @GetMapping
    @Operation(summary = "Get all knowledge bases")
    public ResponseEntity<List<KnowledgeBaseDTO>> getAllKnowledgeBases() {
        List<KnowledgeBase> knowledgeBases = knowledgeRetrievalService.getAllKnowledgeBases();
        return ResponseEntity.ok(knowledgeBases.stream()
                .map(knowledgeBaseMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @PostMapping
    @Operation(summary = "Create a new knowledge base")
    public ResponseEntity<KnowledgeBaseDTO> createKnowledgeBase(@Valid @RequestBody KnowledgeBaseDTO knowledgeBaseDTO) {
        KnowledgeBase kb = knowledgeBaseMapper.toEntity(knowledgeBaseDTO);
        KnowledgeBase created = knowledgeRetrievalService.createKnowledgeBase(kb);
        return ResponseEntity.status(HttpStatus.CREATED).body(knowledgeBaseMapper.toDTO(created));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get knowledge base by ID")
    public ResponseEntity<KnowledgeBaseDTO> getKnowledgeBaseById(@PathVariable UUID id) {
        KnowledgeBase kb = knowledgeRetrievalService.getKnowledgeBaseById(id);
        return ResponseEntity.ok(knowledgeBaseMapper.toDTO(kb));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a knowledge base")
    public ResponseEntity<KnowledgeBaseDTO> updateKnowledgeBase(
            @PathVariable UUID id, @Valid @RequestBody KnowledgeBaseDTO knowledgeBaseDTO) {
        KnowledgeBase knowledgeBase = knowledgeBaseMapper.toEntity(knowledgeBaseDTO);
        KnowledgeBase updated = knowledgeRetrievalService.updateKnowledgeBase(id, knowledgeBase);
        return ResponseEntity.ok(knowledgeBaseMapper.toDTO(updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a knowledge base (soft delete)")
    public ResponseEntity<Void> deleteKnowledgeBase(@PathVariable UUID id) {
        knowledgeRetrievalService.deleteKnowledgeBase(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/indexed")
    @Operation(summary = "Get all indexed knowledge bases")
    public ResponseEntity<List<KnowledgeBaseDTO>> getAllIndexedKnowledgeBases() {
        List<KnowledgeBase> kbs = knowledgeRetrievalService.getAllIndexedKnowledgeBases();
        return ResponseEntity.ok(kbs.stream()
                .map(knowledgeBaseMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/access-level/{accessLevel}")
    @Operation(summary = "Get knowledge bases by access level")
    public ResponseEntity<List<KnowledgeBaseDTO>> getKnowledgeBasesByAccessLevel(@PathVariable KnowledgeBase.AccessLevel accessLevel) {
        List<KnowledgeBase> kbs = knowledgeRetrievalService.getKnowledgeBasesByAccessLevel(accessLevel);
        return ResponseEntity.ok(kbs.stream()
                .map(knowledgeBaseMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @PostMapping("/{id}/index")
    @Operation(summary = "Index a knowledge base")
    public ResponseEntity<Void> indexKnowledgeBase(@PathVariable UUID id) {
        knowledgeRetrievalService.indexKnowledgeBase(id);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/{id}/search")
    @Operation(summary = "Search within a knowledge base")
    public ResponseEntity<List<com.ricoz.assist.presentation.dto.DocumentDTO>> searchInKnowledgeBase(
            @PathVariable UUID id, @RequestParam String query) {
        var documents = knowledgeRetrievalService.searchInKnowledgeBase(id, query);
        return ResponseEntity.ok(documents.stream()
                .map(doc -> {
                    var dto = new com.ricoz.assist.presentation.dto.DocumentDTO();
                    dto.setId(doc.getId());
                    dto.setTitle(doc.getTitle());
                    dto.setContent(doc.getContent());
                    dto.setStatus(doc.getStatus());
                    dto.setDocumentType(doc.getDocumentType());
                    return dto;
                })
                .collect(Collectors.toList()));
    }

    @PostMapping("/document/{documentId}/knowledge-base/{kbId}")
    @Operation(summary = "Add document to knowledge base")
    public ResponseEntity<Void> addDocumentToKnowledgeBase(@PathVariable UUID documentId, @PathVariable UUID kbId) {
        knowledgeRetrievalService.addDocumentToKnowledgeBase(documentId, kbId);
        return ResponseEntity.accepted().build();
    }

    @DeleteMapping("/document/{documentId}")
    @Operation(summary = "Remove document from knowledge base")
    public ResponseEntity<Void> removeDocumentFromKnowledgeBase(@PathVariable UUID documentId) {
        knowledgeRetrievalService.removeDocumentFromKnowledgeBase(documentId);
        return ResponseEntity.noContent().build();
    }
}
