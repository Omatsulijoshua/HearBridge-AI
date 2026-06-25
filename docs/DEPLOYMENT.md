# HearBridge AI Deployment Manual

This guide describes how to deploy the complete HearBridge AI SaaS platform in production environments.

## Architecture Overview
The system is divided into five core components:
1. **Frontend**: Next.js App Router (runs on port 3000)
2. **Backend**: NestJS REST API (runs on port 4000)
3. **Database**: PostgreSQL 15+ (relational storage, schema managed via Prisma)
4. **Cache**: Redis 7+ (session storage and rate limiting)
5. **Search**: Elasticsearch 8+ (index for speech logs and sound library lookups)

---

## 1-Click Launch (Docker Compose)

For local development or single-server staging, execute:

```bash
docker-compose up -d --build
```

This launches all five containers, handles automatic networking, and maps persistent database volumes.

---

## Production Cloud Deployment (AWS & Kubernetes)

### 1. Database (Amazon RDS PostgreSQL)
- Launch a multi-AZ PostgreSQL instance.
- Run migrations:
  ```bash
  cd backend
  npx prisma migrate deploy
  ```

### 2. Cache (Amazon ElastiCache Redis)
- Deploy a redis replication group. Configure backend env `REDIS_URL`.

### 3. File Storage (Amazon S3)
- Create an S3 Bucket for user sound uploads and profile imagery.
- Enable CORS permissions mapping to your custom domain.

### 4. Kubernetes Cluster (Amazon EKS)
Apply the manifests to deploy the pods and services:

```bash
kubectl apply -f deployment/k8s/postgres-service.yaml
kubectl apply -f deployment/k8s/redis-service.yaml
kubectl apply -f deployment/k8s/backend-deployment.yaml
kubectl apply -f deployment/k8s/frontend-deployment.yaml
```

---

## Environment Variables

### Backend Configuration (.env)
```env
PORT=4000
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
REDIS_URL="redis://host:6379"
JWT_SECRET="generate-secure-jwt-key"
JWT_REFRESH_SECRET="generate-secure-refresh-key"
OPENAI_API_KEY="your-openai-api-key"
```

### Frontend Configuration (.env.production)
```env
NEXT_PUBLIC_API_URL="https://api.hearbridge-ai.com"
```
