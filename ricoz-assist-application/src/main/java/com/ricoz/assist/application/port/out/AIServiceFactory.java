package com.ricoz.assist.application.port.out;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class AIServiceFactory {

    private final List<AIService> aiServices;

    public AIService getService(String provider) {
        return aiServices.stream()
                .filter(service -> service.getClass().getSimpleName().equalsIgnoreCase(provider + "Service"))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("AI provider not found: " + provider));
    }

    public AIService getDefaultService() {
        return aiServices.stream()
                .filter(service -> service instanceof OpenAIService)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No default AI service available"));
    }
}
