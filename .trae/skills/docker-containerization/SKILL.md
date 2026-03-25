# Docker Containerization

## Description
Expert in Docker containerization including Dockerfile creation, docker-compose configuration, multi-stage builds, optimization, and container orchestration.

## Usage Scenario
Use this skill when:
- Creating Dockerfiles for applications
- Configuring docker-compose for multi-service apps
- Optimizing image size and build time
- Setting up development environments
- Container networking and volumes
- Production deployment preparation

## Instructions

### Dockerfile Best Practices

1. **Base Image Selection**
   - Use official images when possible
   - Prefer Alpine for smaller images
   - Pin specific versions: `node:20-alpine` not `node:latest`
   - Use multi-stage builds for optimization

2. **Layer Optimization**
   ```dockerfile
   # Order layers by change frequency (least to most)
   FROM node:20-alpine AS base
   WORKDIR /app
   
   # Dependencies (changes least)
   COPY package*.json ./
   RUN npm ci --only=production
   
   # Source code (changes most)
   COPY . .
   RUN npm run build
   ```

3. **Multi-Stage Build**
   ```dockerfile
   # Build stage
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   # Production stage
   FROM node:20-alpine AS production
   WORKDIR /app
   COPY --from=builder /app/dist ./dist
   COPY --from=builder /app/node_modules ./node_modules
   CMD ["node", "dist/main.js"]
   ```

4. **Security Best Practices**
   - Run as non-root user
   - Use `.dockerignore`
   - Scan for vulnerabilities
   - Don't store secrets in images

### Docker Compose Patterns

1. **Development Setup**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       volumes:
         - .:/app
         - /app/node_modules
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=development
       depends_on:
         - db
         - redis
     
     db:
       image: postgres:15-alpine
       volumes:
         - postgres_data:/var/lib/postgresql/data
       environment:
         POSTGRES_DB: app
         POSTGRES_USER: user
         POSTGRES_PASSWORD: password
     
     redis:
       image: redis:7-alpine
   
   volumes:
     postgres_data:
   ```

2. **Production Configuration**
   ```yaml
   version: '3.8'
   services:
     app:
       image: myapp:${VERSION:-latest}
       restart: always
       healthcheck:
         test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
         interval: 30s
         timeout: 10s
         retries: 3
       deploy:
         replicas: 3
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

### Common Dockerfile Templates

1. **Node.js Application**
   ```dockerfile
   FROM node:20-alpine AS base
   WORKDIR /app
   RUN addgroup -g 1001 -S nodejs
   RUN adduser -S nextjs -u 1001
   
   FROM base AS deps
   COPY package*.json ./
   RUN npm ci
   
   FROM base AS builder
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   FROM base AS runner
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   USER nextjs
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Python Application**
   ```dockerfile
   FROM python:3.11-slim AS base
   WORKDIR /app
   RUN groupadd -r appuser && useradd -r -g appuser appuser
   
   FROM base AS builder
   COPY requirements.txt .
   RUN pip install --user -r requirements.txt
   
   FROM base AS runner
   COPY --from=builder /root/.local /root/.local
   COPY --chown=appuser:appuser . .
   USER appuser
   CMD ["python", "main.py"]
   ```

3. **Go Application**
   ```dockerfile
   FROM golang:1.21-alpine AS builder
   WORKDIR /app
   COPY go.* ./
   RUN go mod download
   COPY . .
   RUN CGO_ENABLED=0 GOOS=linux go build -o main .
   
   FROM alpine:3.19 AS runner
   RUN apk --no-cache add ca-certificates
   WORKDIR /root/
   COPY --from=builder /app/main .
   EXPOSE 8080
   CMD ["./main"]
   ```

### Optimization Techniques

1. **Image Size Reduction**
   - Use `.dockerignore`
   - Multi-stage builds
   - Alpine base images
   - Combine RUN commands

2. **Build Cache Optimization**
   - Order by change frequency
   - Use BuildKit: `DOCKER_BUILDKIT=1`
   - Leverage layer caching

3. **Security Hardening**
   ```dockerfile
   # Non-root user
   RUN addgroup -g 1001 appgroup && \
       adduser -u 1001 -G appgroup -D appuser
   USER appuser
   
   # Read-only filesystem
   # In docker-compose: read_only: true
   ```

## Output Contract
- Optimized Dockerfiles
- Complete docker-compose configurations
- Build and run instructions
- Security recommendations
- Size optimization tips

## Constraints
- Never include secrets in images
- Always use specific version tags
- Include health checks for production
- Document exposed ports and volumes
- Provide both dev and prod configurations

## Examples

### Example 1: Next.js Production Dockerfile
```dockerfile
FROM node:20-alpine AS base
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]
```

### Example 2: Full Stack docker-compose
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      target: production
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000
    depends_on:
      api:
        condition: service_healthy

  api:
    build:
      context: ./api
      target: production
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 10s
      timeout: 5s
      retries: 5
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d app"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```
