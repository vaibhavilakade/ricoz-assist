package com.ricoz.assist.presentation.testutil;

import com.ricoz.assist.core.domain.Document;

import java.time.LocalDateTime;
import java.util.UUID;

public class DocumentTestDataBuilder {

    public static Document.DocumentStatus defaultStatus = Document.DocumentStatus.DRAFT;
    public static Document.DocumentType defaultType = Document.DocumentType.OTHER;

    public static Document aDocument() {
        LocalDateTime now = LocalDateTime.now();
        Document document = Document.builder()
                .title("Test Document")
                .content("Test content")
                .status(defaultStatus)
                .documentType(defaultType)
                .version(1)
                .aiGenerated(false)
                .build();
        document.setId(UUID.randomUUID());
        document.setCreatedAt(now);
        document.setUpdatedAt(now);
        return document;
    }

    public static Document aPublishedDocument() {
        Document document = aDocument();
        document.setStatus(Document.DocumentStatus.PUBLISHED);
        return document;
    }

    public static Document anAiGeneratedDocument() {
        Document document = aDocument();
        document.setAiGenerated(true);
        return document;
    }
}
