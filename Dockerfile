# Multi-stage build for RicozAssist application
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom files
COPY pom.xml .
COPY ricoz-assist-core/pom.xml ./ricoz-assist-core/
COPY ricoz-assist-application/pom.xml ./ricoz-assist-application/
COPY ricoz-assist-infrastructure/pom.xml ./ricoz-assist-infrastructure/
COPY ricoz-assist-presentation/pom.xml ./ricoz-assist-presentation/

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY ricoz-assist-core/src ./ricoz-assist-core/src
COPY ricoz-assist-application/src ./ricoz-assist-application/src
COPY ricoz-assist-infrastructure/src ./ricoz-assist-infrastructure/src
COPY ricoz-assist-presentation/src ./ricoz-assist-presentation/src

# Build the application
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy jar from builder
COPY --from=builder /app/ricoz-assist-presentation/target/ricoz-assist-presentation-*.jar app.jar

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["java", "-jar", "app.jar"]
