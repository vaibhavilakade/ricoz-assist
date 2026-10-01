package com.ricoz.assist.presentation.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(getAllowedOrigins());
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    private List<String> getAllowedOrigins() {
        Set<String> allowedOrigins = new LinkedHashSet<>(List.of(
                "https://ricoz-assist.vercel.app",
                "https://ricoz-assist-7hws03uut-vaibhavilakade.vercel.app",
                "http://localhost:5173",
                "http://localhost:3000",
                "http://localhost:8080"
        ));
        String additionalOrigins = System.getenv().getOrDefault("CORS_ALLOWED_ORIGINS", "");
        allowedOrigins.addAll(Arrays.stream(additionalOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isEmpty())
                .toList());
        return List.copyOf(allowedOrigins);
    }
}
