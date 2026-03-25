# CI/CD Pipeline

## Description
Expert in CI/CD pipeline configuration including GitHub Actions, GitLab CI, Jenkins, Azure DevOps, and CircleCI. Covers build automation, testing, deployment strategies, and pipeline optimization.

## Usage Scenario
Use this skill when:
- Setting up CI/CD pipelines
- Configuring build automation
- Implementing deployment strategies
- Creating release workflows
- Pipeline debugging and optimization
- Multi-environment deployments

## Instructions

### GitHub Actions

1. **Basic Workflow Structure**
   ```yaml
   name: CI/CD Pipeline
   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main]
   
   env:
     NODE_VERSION: '20'
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: ${{ env.NODE_VERSION }}
             cache: 'npm'
         - run: npm ci
         - run: npm run build
         - run: npm test
   ```

2. **Matrix Strategy**
   ```yaml
   jobs:
     test:
       runs-on: ${{ matrix.os }}
       strategy:
         matrix:
           os: [ubuntu-latest, macos-latest, windows-latest]
           node: [18, 20, 22]
         fail-fast: false
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: ${{ matrix.node }}
   ```

3. **Deployment Workflow**
   ```yaml
   name: Deploy
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       environment: production
       steps:
         - uses: actions/checkout@v4
         - name: Deploy to Production
           run: |
             echo "Deploying to production..."
           env:
             DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
   ```

### GitLab CI

1. **Basic Pipeline**
   ```yaml
   stages:
     - build
     - test
     - deploy
   
   variables:
     NODE_VERSION: "20"
   
   build:
     stage: build
     image: node:${NODE_VERSION}
     script:
       - npm ci
       - npm run build
     artifacts:
       paths:
         - dist/
   
   test:
     stage: test
     image: node:${NODE_VERSION}
     script:
       - npm ci
       - npm test
     coverage: '/Coverage: \d+%/'
   
   deploy:
     stage: deploy
     image: alpine:latest
     script:
       - echo "Deploying..."
     only:
       - main
   ```

2. **Multi-Environment**
   ```yaml
   .deploy_template: &deploy_template
     script:
       - ./deploy.sh $ENVIRONMENT
   
   deploy_staging:
     <<: *deploy_template
     environment: staging
     variables:
       ENVIRONMENT: staging
     only:
       - develop
   
   deploy_production:
     <<: *deploy_template
     environment: production
     variables:
       ENVIRONMENT: production
     only:
       - main
     when: manual
   ```

### Jenkins Pipeline

1. **Declarative Pipeline**
   ```groovy
   pipeline {
       agent any
       
       environment {
           NODE_VERSION = '20'
       }
       
       stages {
           stage('Build') {
               steps {
                   sh 'npm ci'
                   sh 'npm run build'
               }
           }
           
           stage('Test') {
               steps {
                   sh 'npm test'
               }
               post {
                   always {
                       junit 'test-results/*.xml'
                       coverageReport()
                   }
               }
           }
           
           stage('Deploy') {
               when {
                   branch 'main'
               }
               steps {
                   sh './deploy.sh production'
               }
           }
       }
       
       post {
           success {
               slackSend(color: 'good', message: 'Build succeeded!')
           }
           failure {
               slackSend(color: 'danger', message: 'Build failed!')
           }
       }
   }
   ```

### Common Patterns

1. **Caching Strategy**
   ```yaml
   # GitHub Actions
   - uses: actions/cache@v4
     with:
       path: |
         ~/.npm
         node_modules
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
       restore-keys: |
         ${{ runner.os }}-node-
   ```

2. **Secrets Management**
   ```yaml
   env:
     API_KEY: ${{ secrets.API_KEY }}
     # Or use vault
   steps:
     - name: Get Secrets
       uses: hashicorp/vault-action@v2
       with:
         url: ${{ secrets.VAULT_URL }}
         secrets: |
           secret/data/app api_key | API_KEY;
   ```

3. **Conditional Deployment**
   ```yaml
   deploy:
     needs: [build, test]
     if: github.event_name == 'push' && github.ref == 'refs/heads/main'
     runs-on: ubuntu-latest
     environment:
       name: production
       url: https://app.example.com
   ```

4. **Rollback Strategy**
   ```yaml
   deploy:
     steps:
       - name: Deploy
         id: deploy
         run: ./deploy.sh
       
       - name: Health Check
         run: ./health-check.sh
       
       - name: Rollback on Failure
         if: failure()
         run: ./rollback.sh ${{ steps.deploy.outputs.previous_version }}
   ```

### Pipeline Optimization

1. **Parallel Jobs**
   ```yaml
   jobs:
     lint:
       runs-on: ubuntu-latest
       steps: [lint steps]
     
     test-unit:
       runs-on: ubuntu-latest
       steps: [unit test steps]
     
     test-e2e:
       runs-on: ubuntu-latest
       steps: [e2e test steps]
     
     build:
       needs: [lint, test-unit, test-e2e]
       runs-on: ubuntu-latest
   ```

2. **Conditional Steps**
   ```yaml
   steps:
     - name: Skip for docs
       if: "!contains(github.event.head_commit.message, '[skip ci]')"
       run: npm test
   ```

## Output Contract
- Complete pipeline configurations
- Multi-environment deployment strategies
- Caching and optimization recommendations
- Security best practices
- Rollback procedures

## Constraints
- Never expose secrets in logs
- Use environment protection rules
- Implement proper approval workflows
- Include rollback capabilities
- Monitor pipeline performance

## Examples

### Example 1: Full GitHub Actions Pipeline
```yaml
name: Full CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
      - name: Deploy to Staging
        run: ./deploy.sh staging

  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build
      - name: Deploy to Production
        run: ./deploy.sh production
```

### Example 2: Docker Build and Push
```yaml
name: Docker Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:latest
            ghcr.io/${{ github.repository }}:${{ github.ref_name }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```
