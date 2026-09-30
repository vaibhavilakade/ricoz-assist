package com.ricoz.assist.application.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConversationContextManager {

    private static final String CONTEXT_PREFIX = "conversation:";
    private static final Duration CONTEXT_TTL = Duration.ofHours(2);

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public void saveContext(UUID sessionId, ConversationContext context) {
        String key = CONTEXT_PREFIX + sessionId;
        log.debug("Saving context for session: {}", sessionId);
        try {
            redisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(context), CONTEXT_TTL);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Could not serialize conversation context", e);
        }
    }

    public ConversationContext getContext(UUID sessionId) {
        String key = CONTEXT_PREFIX + sessionId;
        log.debug("Retrieving context for session: {}", sessionId);
        String context = redisTemplate.opsForValue().get(key);
        if (context == null) {
            return null;
        }
        try {
            return objectMapper.readValue(context, ConversationContext.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Could not deserialize conversation context for " + sessionId, e);
        }
    }

    public void addMessage(UUID sessionId, Message message) {
        ConversationContext context = getContext(sessionId);
        if (context == null) {
            context = new ConversationContext();
            context.setSessionId(sessionId);
        }
        context.getMessages().add(message);
        context.setLastActivity(System.currentTimeMillis());
        saveContext(sessionId, context);
        log.debug("Added message to session: {}", sessionId);
    }

    public void updateContext(UUID sessionId, String key, Object value) {
        ConversationContext context = getContext(sessionId);
        if (context == null) {
            context = new ConversationContext();
            context.setSessionId(sessionId);
        }
        context.getMetadata().put(key, value);
        context.setLastActivity(System.currentTimeMillis());
        saveContext(sessionId, context);
        log.debug("Updated context for session: {}, key: {}", sessionId, key);
    }

    public void clearContext(UUID sessionId) {
        String key = CONTEXT_PREFIX + sessionId;
        log.debug("Clearing context for session: {}", sessionId);
        redisTemplate.delete(key);
    }

    public List<Message> getRecentMessages(UUID sessionId, int limit) {
        ConversationContext context = getContext(sessionId);
        if (context == null || context.getMessages().isEmpty() || limit <= 0) {
            return new ArrayList<>();
        }
        
        int size = context.getMessages().size();
        int fromIndex = Math.max(0, size - limit);
        return new ArrayList<>(context.getMessages().subList(fromIndex, size));
    }

    public boolean hasActiveSession(UUID sessionId) {
        String key = CONTEXT_PREFIX + sessionId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    @Data
    public static class ConversationContext {
        private UUID sessionId;
        private UUID userId;
        private List<Message> messages = new ArrayList<>();
        private java.util.Map<String, Object> metadata = new java.util.HashMap<>();
        private long lastActivity;
        private String currentTopic;
    }

    @Data
    public static class Message {
        private String role; // user, assistant, system
        private String content;
        private long timestamp;
        private String type; // text, document, query
    }
}
