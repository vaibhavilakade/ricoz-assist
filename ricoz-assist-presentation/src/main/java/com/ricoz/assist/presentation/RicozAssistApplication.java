package com.ricoz.assist.presentation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication(scanBasePackages = "com.ricoz.assist")
@EntityScan("com.ricoz.assist.core.domain")
@EnableJpaRepositories("com.ricoz.assist.infrastructure.persistence")
@EnableJpaAuditing
@EnableAsync
public class RicozAssistApplication {

    public static void main(String[] args) {
        SpringApplication.run(RicozAssistApplication.class, args);
    }
}
