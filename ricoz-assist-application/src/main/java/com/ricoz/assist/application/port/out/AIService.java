package com.ricoz.assist.application.port.out;

import java.util.Map;

public interface AIService {

    String generateText(String prompt, Map<String, Object> parameters);

    String generateSummary(String content);

    String extractActionItems(String transcription);

    String answerQuestion(String question, String context);

    double getConfidenceScore();
}
