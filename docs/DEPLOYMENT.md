# Deployment Guide

This guide covers deploying RicozAssist to various environments including local development, staging, and production.

## Prerequisites

- Docker and Docker Compose installed
- Kubernetes cluster (for production deployment)
- kubectl configured
- PostgreSQL database
- Redis instance
- Java 17 (for local development)

## Local Development

### Using Docker Compose

1. Clone the repository:
```bash
git clone https://github.com/your-org/ricoz-assist.git
cd ricoz-assist
```

2. Start all services:
```bash
docker-compose up -d
```

3. Verify services are running:
```bash
docker-compose ps
```

4. Access the application:
- API: http://localhost:8080
- Swagger UI: http://localhost:8080/api/v1/swagger-ui.html
- Health Check: http://localhost:8080/actuator/health

5. View logs:
```bash
docker-compose logs -f app
```

6. Stop services:
```bash
docker-compose down
```

### Running Locally with Maven

1. Set up PostgreSQL and Redis:
```bash
# Using Docker
docker run -d --name postgres -p 5432:5432 -e POSTGRES_DB=ricoz_assist -e POSTGRES_USER=ricoz_user -e POSTGRES_PASSWORD=ricoz_password postgres:15-alpine
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

2. Configure environment variables:
```bash
export SPRING_PROFILES_ACTIVE=dev
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/ricoz_assist
export SPRING_DATASOURCE_USERNAME=ricoz_user
export SPRING_DATASOURCE_PASSWORD=ricoz_password
export SPRING_REDIS_HOST=localhost
export SPRING_REDIS_PORT=6379
export JWT_SECRET=your-secret-key
```

3. Build and run:
```bash
mvn clean install
cd ricoz-assist-presentation
mvn spring-boot:run
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t ricoz-assist:latest .
```

### Run with Docker

```bash
docker run -d \
  --name ricoz-assist \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/ricoz_assist \
  -e SPRING_DATASOURCE_USERNAME=ricoz_user \
  -e SPRING_DATASOURCE_PASSWORD=your-password \
  -e SPRING_REDIS_HOST=your-redis-host \
  -e SPRING_REDIS_PORT=6379 \
  -e JWT_SECRET=your-jwt-secret \
  ricoz-assist:latest
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (v1.20+)
- kubectl configured
- Helm 3.x (optional)

### Deploy with Kubernetes Manifests

1. Update the secret file with your actual values:
```bash
vim k8s/secret.yaml
```

2. Apply all manifests:
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
```

3. Verify deployment:
```bash
kubectl get pods -l app=ricoz-assist
kubectl get services
kubectl logs -l app=ricoz-assist
```

4. Check health status:
```bash
kubectl exec -it <pod-name> -- wget -qO- http://localhost:8080/actuator/health
```

### Deploy with Helm (Optional)

1. Create values file:
```yaml
# values.yaml
image:
  repository: your-registry/ricoz-assist
  tag: latest
  pullPolicy: Always

replicaCount: 3

resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "1000m"

env:
  SPRING_PROFILES_ACTIVE: "prod"
  JWT_EXPIRATION: "86400000"
```

2. Install Helm chart:
```bash
helm install ricoz-assist ./helm-chart -f values.yaml
```

3. Upgrade deployment:
```bash
helm upgrade ricoz-assist ./helm-chart -f values.yaml
```

## CI/CD Pipeline

### GitHub Actions

The project includes a GitHub Actions workflow that:

1. Builds the application with Maven
2. Runs unit and integration tests
3. Generates test coverage reports
4. Scans for security vulnerabilities with Trivy
5. Builds Docker image
6. Pushes to Docker Hub (on main branch)
7. Deploys to Kubernetes (on main branch)

### Required Secrets

Configure these secrets in your GitHub repository:

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password or access token
- `KUBE_CONFIG`: Base64-encoded kubeconfig file

### Manual Trigger

To manually trigger the pipeline:
```bash
git push origin main
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| SPRING_PROFILES_ACTIVE | Spring profile | dev | No |
| SPRING_DATASOURCE_URL | JDBC URL | - | Yes |
| SPRING_DATASOURCE_USERNAME | Database username | - | Yes |
| SPRING_DATASOURCE_PASSWORD | Database password | - | Yes |
| SPRING_REDIS_HOST | Redis host | localhost | No |
| SPRING_REDIS_PORT | Redis port | 6379 | No |
| JWT_SECRET | JWT signing secret | - | Yes |
| JWT_EXPIRATION | Token expiration (ms) | 86400000 | No |
| CORS_ALLOWED_ORIGINS | CORS allowed origins | http://localhost:3000 | No |

## Health Checks

The application exposes several health endpoints:

- `/actuator/health` - General health status
- `/actuator/health/liveness` - Liveness probe
- `/actuator/health/readiness` - Readiness probe
- `/health/liveness` - Custom liveness endpoint
- `/health/readiness` - Custom readiness endpoint
- `/health/custom` - Custom health check with database status

## Monitoring

### Actuator Endpoints

- `/actuator/metrics` - Application metrics
- `/actuator/prometheus` - Prometheus metrics
- `/actuator/info` - Application information

### Logs

View application logs:
```bash
# Docker
docker logs -f ricoz-assist

# Kubernetes
kubectl logs -f deployment/ricoz-assist
```

## Troubleshooting

### Database Connection Issues

1. Verify database is accessible:
```bash
kubectl exec -it <pod-name> -- nc -zv postgres-service 5432
```

2. Check database credentials in secrets

3. Review application logs for connection errors

### Pod Not Starting

1. Check pod status:
```bash
kubectl describe pod <pod-name>
```

2. Check logs:
```bash
kubectl logs <pod-name>
```

3. Verify resource limits are not exceeded

### Health Check Failures

1. Verify liveness and readiness probes are configured correctly
2. Check if dependencies (database, Redis) are available
3. Review application startup logs

## Scaling

### Horizontal Pod Autoscaler

The HPA is configured to scale between 3 and 10 replicas based on CPU and memory usage:

```bash
kubectl get hpa ricoz-assist-hpa
```

### Manual Scaling

```bash
kubectl scale deployment ricoz-assist --replicas=5
```

## Rollback

### Kubernetes Rollback

```bash
kubectl rollout undo deployment/ricoz-assist
```

### View Rollout History

```bash
kubectl rollout history deployment/ricoz-assist
```

## Security Considerations

1. Always use strong secrets in production
2. Enable TLS/SSL for database connections
3. Use secrets management (e.g., Kubernetes Secrets, AWS Secrets Manager)
4. Regularly update dependencies
5. Scan images for vulnerabilities
6. Enable network policies in Kubernetes
7. Use RBAC for access control

## Backup and Recovery

### Database Backup

```bash
kubectl exec postgres-pod -- pg_dump -U ricoz_user ricoz_assist > backup.sql
```

### Database Restore

```bash
kubectl exec -i postgres-pod -- psql -U ricoz_user ricoz_assist < backup.sql
```

## Performance Tuning

### JVM Options

Adjust JVM settings in the deployment:
```yaml
env:
  - name: JAVA_OPTS
    value: "-Xms512m -Xmx1024m -XX:+UseG1GC"
```

### Connection Pool

Configure HikariCP in application-prod.yml:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
```

## Support

For deployment issues, contact:
- Email: support@ricozassist.com
- Documentation: https://docs.ricozassist.com
- Issues: https://github.com/your-org/ricoz-assist/issues
