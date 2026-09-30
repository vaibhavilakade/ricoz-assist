package com.ricoz.assist.application.port.out.repository;

import com.ricoz.assist.core.domain.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QueryRepositoryPort {
    Query save(Query query);

    Optional<Query> findById(UUID id);

    List<Query> findByCreatedByUserId(UUID userId);

    List<Query> findByCreatedByUserIdAndQueryType(UUID userId, Query.QueryType type);

    List<Query> findByStatus(Query.QueryStatus status);

    Double getAverageProcessingTime();
}
