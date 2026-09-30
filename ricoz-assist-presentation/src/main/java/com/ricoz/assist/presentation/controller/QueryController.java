package com.ricoz.assist.presentation.controller;

import com.ricoz.assist.application.service.QueryProcessingService;
import com.ricoz.assist.application.service.UserService;
import com.ricoz.assist.core.domain.Query;
import com.ricoz.assist.presentation.dto.QueryDTO;
import com.ricoz.assist.presentation.dto.mapper.QueryMapper;
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
@RequestMapping("/queries")
@RequiredArgsConstructor
@Tag(name = "Query Processing", description = "APIs for processing AI queries")
public class QueryController {

    private final QueryProcessingService queryProcessingService;
    private final UserService userService;
    private final QueryMapper queryMapper;

    @PostMapping
    @Operation(summary = "Create and process a new query")
    public ResponseEntity<QueryDTO> createQuery(
            @Valid @RequestBody QueryDTO queryDTO, Authentication authentication) {
        Query query = queryMapper.toEntity(queryDTO);
        query.setCreatedByUser(userService.getUserByUsername(authentication.getName()));
        Query created = queryProcessingService.createQuery(query);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(queryMapper.toDTO(created));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get query by ID")
    public ResponseEntity<QueryDTO> getQueryById(@PathVariable UUID id) {
        Query query = queryProcessingService.getQueryById(id);
        return ResponseEntity.ok(queryMapper.toDTO(query));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get queries by user")
    public ResponseEntity<List<QueryDTO>> getQueriesByUser(@PathVariable UUID userId) {
        List<Query> queries = queryProcessingService.getQueriesByUser(userId);
        return ResponseEntity.ok(queries.stream()
                .map(queryMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/user/{userId}/type/{type}")
    @Operation(summary = "Get queries by user and type")
    public ResponseEntity<List<QueryDTO>> getQueriesByType(
            @PathVariable UUID userId, @PathVariable Query.QueryType type) {
        List<Query> queries = queryProcessingService.getQueriesByType(userId, type);
        return ResponseEntity.ok(queries.stream()
                .map(queryMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending queries")
    public ResponseEntity<List<QueryDTO>> getPendingQueries() {
        List<Query> queries = queryProcessingService.getPendingQueries();
        return ResponseEntity.ok(queries.stream()
                .map(queryMapper::toDTO)
                .collect(Collectors.toList()));
    }

    @GetMapping("/metrics/avg-processing-time")
    @Operation(summary = "Get average query processing time")
    public ResponseEntity<Double> getAverageProcessingTime() {
        Double avgTime = queryProcessingService.getAverageProcessingTime();
        return ResponseEntity.ok(avgTime);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete query (soft delete)")
    public ResponseEntity<Void> deleteQuery(@PathVariable UUID id) {
        queryProcessingService.deleteQuery(id);
        return ResponseEntity.noContent().build();
    }
}
