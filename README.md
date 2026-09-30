# RicozAssist

A governed enterprise AI assistant that augments employee productivity with conversational intelligence, contextual drafting, and real-time knowledge access across business systems.

## Features

- **Conversational document drafting and editing** - AI-powered document creation and modification
- **Business system natural-language queries** - Query business systems using natural language
- **Enterprise knowledge retrieval and Q&A** - Intelligent search and question answering
- **Meeting summary and action capture** - Automatic meeting transcription and action item extraction

## Technology Stack

- **Java 17+**
- **Spring Boot 3.2.0**
- **Maven** - Build tool and dependency management
- **PostgreSQL** - Primary database
- **Redis** - Caching layer
- **JPA/Hibernate** - ORM
- **Flyway** - Database migrations
- **Spring Security** - Authentication and authorization
- **MapStruct** - DTO mapping
- **OpenAPI/Swagger** - API documentation
- **Lombok** - Reduce boilerplate code

## Architecture

The project follows clean architecture principles with a multi-module Maven structure:

- **ricoz-assist-core** - Domain entities and business logic
- **ricoz-assist-application** - Application services and use cases
- **ricoz-assist-infrastructure** - Repositories, external integrations, and persistence
- **ricoz-assist-presentation** - REST controllers, DTOs, and configuration

## Prerequisites

- JDK 17 or higher
- Maven 3.8+
- PostgreSQL 14+
- Redis 7+

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd untitledj
```

### 2. Install dependencies

Ensure `mvn -version` reports Java 17 or higher (set IntelliJ's Maven Runner JRE as well as the Project SDK).

```bash
mvn clean install
```

### 3. Configure database

Create PostgreSQL databases:

```sql
CREATE DATABASE ricoz_assist_dev;
CREATE DATABASE ricoz_assist_test;
```

### 4. Configure environment variables

For production, create an `.env` file or set environment variables:

```env
DB_URL=jdbc:postgresql://localhost:5432/ricoz_assist_prod
DB_USERNAME=your_username
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=replace-with-a-random-secret-of-at-least-64-characters
CORS_ALLOWED_ORIGINS=https://your-frontend.example.com
```

### 5. Run the application

```bash
mvn spring-boot:run -pl ricoz-assist-presentation
```

The application will start on `http://localhost:8080/api/v1`

### 6. Access API documentation

Swagger UI is available at: `http://localhost:8080/api/v1/swagger-ui.html`

## Profiles

The application supports three profiles:

- **dev** - Development environment (default)
- **test** - Testing environment
- **prod** - Production environment

To run with a specific profile:

```bash
mvn spring-boot:run -pl ricoz-assist-presentation -Dspring-boot.run.profiles=prod
```

## Project Structure

```
ricoz-assist/
├── ricoz-assist-core/
│   └── src/main/java/com/ricoz/assist/core/
│       ├── domain/          # Domain entities
│       └── port/            # Ports (interfaces)
├── ricoz-assist-application/
│   └── src/main/java/com/ricoz/assist/application/
│       ├── service/         # Application services
│       └── port/            # Port implementations
├── ricoz-assist-infrastructure/
│   └── src/main/java/com/ricoz/assist/infrastructure/
│       ├── persistence/     # Repository implementations
│       └── config/         # Infrastructure configuration
└── ricoz-assist-presentation/
    └── src/main/java/com/ricoz/assist/presentation/
        ├── controller/     # REST controllers
        ├── dto/            # Data transfer objects
        └── config/         # Presentation configuration
```

## Development

### Running tests

```bash
mvn clean verify
```

The integration tests use an in-memory H2 database and do not require PostgreSQL or Redis.
Running the application with the default `dev` profile uses PostgreSQL; set `DB_URL`,
`DB_USERNAME`, `DB_PASSWORD`, `REDIS_HOST`, and `REDIS_PORT` for the environment. The
`prod` profile also requires `JWT_SECRET`; use a randomly generated secret of at least
64 characters and do not use the development default.

### Building for production

```bash
mvn clean package -Pprod
```
