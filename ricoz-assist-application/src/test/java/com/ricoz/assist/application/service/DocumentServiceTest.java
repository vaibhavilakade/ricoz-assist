package com.ricoz.assist.application.service;

import com.ricoz.assist.core.domain.Document;
import com.ricoz.assist.core.domain.User;
import com.ricoz.assist.application.port.out.repository.DocumentRepositoryPort;
import com.ricoz.assist.application.port.out.repository.KnowledgeBaseRepositoryPort;
import com.ricoz.assist.application.port.out.repository.UserRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocumentServiceTest {

    @Mock
    private DocumentRepositoryPort documentRepository;

    @Mock
    private KnowledgeBaseRepositoryPort knowledgeBaseRepository;

    @Mock
    private UserRepositoryPort userRepository;

    private DocumentService documentService;

    private Document testDocument;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .passwordHash("encodedPassword")
                .build();
        testUser.setId(UUID.randomUUID());
        testDocument = Document.builder()
                .title("Test Document")
                .content("Test content")
                .status(Document.DocumentStatus.DRAFT)
                .documentType(Document.DocumentType.OTHER)
                .owner(testUser)
                .version(1)
                .aiGenerated(false)
                .build();
        testDocument.setId(UUID.randomUUID());
        documentService = new DocumentService(documentRepository, knowledgeBaseRepository, userRepository);
    }

    @Test
    void createDocument_ShouldReturnDocument_WhenValidData() {
        when(documentRepository.save(any(Document.class))).thenReturn(testDocument);
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));

        Document created = documentService.createDocument(testDocument);

        assertThat(created).isNotNull();
        assertThat(created.getVersion()).isEqualTo(1);
        verify(documentRepository).save(any(Document.class));
    }

    @Test
    void updateDocument_ShouldIncrementVersion() {
        UUID documentId = testDocument.getId();
        when(documentRepository.findById(documentId)).thenReturn(Optional.of(testDocument));
        when(documentRepository.save(any(Document.class))).thenReturn(testDocument);

        documentService.updateDocument(documentId, testDocument);

        assertThat(testDocument.getVersion()).isEqualTo(2);
        verify(documentRepository).save(testDocument);
    }

    @Test
    void getDocumentById_ShouldReturnDocument_WhenExists() {
        UUID documentId = testDocument.getId();
        when(documentRepository.findById(documentId)).thenReturn(Optional.of(testDocument));

        Document found = documentService.getDocumentById(documentId);

        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(documentId);
        verify(documentRepository).findById(documentId);
    }

    @Test
    void getDocumentById_ShouldThrowException_WhenNotExists() {
        UUID documentId = UUID.randomUUID();
        when(documentRepository.findById(documentId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> documentService.getDocumentById(documentId))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Document not found");
    }

    @Test
    void updateStatus_ShouldUpdateDocumentStatus() {
        UUID documentId = testDocument.getId();
        Document.DocumentStatus newStatus = Document.DocumentStatus.PUBLISHED;
        when(documentRepository.findById(documentId)).thenReturn(Optional.of(testDocument));
        when(documentRepository.save(any(Document.class))).thenReturn(testDocument);

        Document updated = documentService.updateStatus(documentId, newStatus);

        assertThat(updated.getStatus()).isEqualTo(newStatus);
        verify(documentRepository).save(testDocument);
    }

    @Test
    void deleteDocument_ShouldSetDeletedToTrue() {
        UUID documentId = testDocument.getId();
        when(documentRepository.findById(documentId)).thenReturn(Optional.of(testDocument));
        when(documentRepository.save(any(Document.class))).thenReturn(testDocument);

        documentService.deleteDocument(documentId);

        assertThat(testDocument.getDeleted()).isTrue();
        verify(documentRepository).save(testDocument);
    }

    @Test
    void searchDocuments_ShouldReturnMatchingDocuments() {
        String keyword = "Test";
        when(documentRepository.searchByKeyword(keyword)).thenReturn(List.of(testDocument));

        List<Document> results = documentService.searchDocuments(keyword);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).contains(keyword);
        verify(documentRepository).searchByKeyword(keyword);
    }
}
