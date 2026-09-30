package com.ricoz.assist.core.port.out;

import java.util.Optional;

public interface AuditPort {
    
    Optional<String> getCurrentUser();
}
