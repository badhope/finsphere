# Kubernetes Orchestration

## Description
Expert in Kubernetes container orchestration including Pod management, Service configuration, Deployment strategies, Helm Charts, and cluster operations.

## Usage Scenario
Use this skill when:
- Deploying applications to Kubernetes
- Creating and managing Kubernetes resources
- Configuring Services, Ingress, and networking
- Writing Helm Charts
- Troubleshooting cluster issues
- Setting up autoscaling and resource management

## Instructions

### Core Concepts

1. **Pod Management**
   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: my-app
     labels:
       app: my-app
       tier: frontend
   spec:
     containers:
       - name: app
         image: my-app:latest
         ports:
           - containerPort: 8080
         resources:
           requests:
             memory: "128Mi"
             cpu: "100m"
           limits:
             memory: "256Mi"
             cpu: "200m"
         livenessProbe:
           httpGet:
             path: /health
             port: 8080
           initialDelaySeconds: 30
           periodSeconds: 10
         readinessProbe:
           httpGet:
             path: /ready
             port: 8080
           initialDelaySeconds: 5
           periodSeconds: 5
         env:
           - name: DATABASE_URL
             valueFrom:
               secretKeyRef:
                 name: db-secret
                 key: url
   ```

2. **Deployment**
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: my-app
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: my-app
     strategy:
       type: RollingUpdate
       rollingUpdate:
         maxSurge: 1
         maxUnavailable: 0
     template:
       metadata:
         labels:
           app: my-app
       spec:
         containers:
           - name: app
             image: my-app:v1.0.0
             ports:
               - containerPort: 8080
             resources:
               requests:
                 memory: "128Mi"
                 cpu: "100m"
               limits:
                 memory: "256Mi"
                 cpu: "500m"
   ```

3. **Service Configuration**
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: my-app-service
   spec:
     type: ClusterIP
     selector:
       app: my-app
     ports:
       - port: 80
         targetPort: 8080
         protocol: TCP
   
   ---
   
   apiVersion: v1
   kind: Service
   metadata:
     name: my-app-nodeport
   spec:
     type: NodePort
     selector:
       app: my-app
     ports:
       - port: 80
         targetPort: 8080
         nodePort: 30080
   
   ---
   
   apiVersion: v1
   kind: Service
   metadata:
     name: my-app-loadbalancer
   spec:
     type: LoadBalancer
     selector:
       app: my-app
     ports:
       - port: 80
         targetPort: 8080
   ```

4. **Ingress Configuration**
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: my-app-ingress
     annotations:
       nginx.ingress.kubernetes.io/rewrite-target: /
       cert-manager.io/cluster-issuer: letsencrypt-prod
   spec:
     ingressClassName: nginx
     tls:
       - hosts:
           - myapp.example.com
         secretName: myapp-tls
     rules:
       - host: myapp.example.com
         http:
           paths:
             - path: /
               pathType: Prefix
               backend:
                 service:
                   name: my-app-service
                   port:
                     number: 80
   ```

### ConfigMap and Secrets

1. **ConfigMap**
   ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: app-config
   data:
     DATABASE_HOST: "postgres.default.svc.cluster.local"
     DATABASE_PORT: "5432"
     LOG_LEVEL: "info"
     config.yaml: |
       server:
         port: 8080
         host: 0.0.0.0
       database:
         pool_size: 10
   ```

2. **Secrets**
   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: db-secret
   type: Opaque
   stringData:
     url: "postgresql://user:pass@postgres:5432/db"
     password: "supersecret"
   ```

### Autoscaling

1. **Horizontal Pod Autoscaler**
   ```yaml
   apiVersion: autoscaling/v2
   kind: HorizontalPodAutoscaler
   metadata:
     name: my-app-hpa
   spec:
     scaleTargetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: my-app
     minReplicas: 2
     maxReplicas: 10
     metrics:
       - type: Resource
         resource:
           name: cpu
           target:
             type: Utilization
             averageUtilization: 70
       - type: Resource
         resource:
           name: memory
           target:
             type: Utilization
             averageUtilization: 80
   ```

2. **Vertical Pod Autoscaler**
   ```yaml
   apiVersion: autoscaling.k8s.io/v1
   kind: VerticalPodAutoscaler
   metadata:
     name: my-app-vpa
   spec:
     targetRef:
       apiVersion: apps/v1
       kind: Deployment
       name: my-app
     updatePolicy:
       updateMode: "Auto"
     resourcePolicy:
       containerPolicies:
         - containerName: app
           minAllowed:
             cpu: 100m
             memory: 128Mi
           maxAllowed:
             cpu: 1
             memory: 512Mi
   ```

### Helm Charts

1. **Chart Structure**
   ```
   my-chart/
   ├── Chart.yaml
   ├── values.yaml
   ├── templates/
   │   ├── deployment.yaml
   │   ├── service.yaml
   │   ├── ingress.yaml
   │   ├── configmap.yaml
   │   └── _helpers.tpl
   └── charts/
   ```

2. **Chart.yaml**
   ```yaml
   apiVersion: v2
   name: my-app
   description: A Helm chart for my application
   type: application
   version: 1.0.0
   appVersion: "1.0.0"
   dependencies:
     - name: postgresql
       version: "12.x.x"
       repository: "https://charts.bitnami.com/bitnami"
       condition: postgresql.enabled
   ```

3. **values.yaml**
   ```yaml
   replicaCount: 3
   
   image:
     repository: my-app
     pullPolicy: IfNotPresent
     tag: "1.0.0"
   
   service:
     type: ClusterIP
     port: 80
   
   ingress:
     enabled: true
     className: nginx
     hosts:
       - host: myapp.example.com
         paths:
           - path: /
             pathType: Prefix
   
   resources:
     requests:
       cpu: 100m
       memory: 128Mi
     limits:
       cpu: 500m
       memory: 256Mi
   
   autoscaling:
     enabled: true
     minReplicas: 2
     maxReplicas: 10
     targetCPUUtilizationPercentage: 70
   ```

4. **templates/deployment.yaml**
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: {{ include "my-app.fullname" . }}
     labels:
       {{- include "my-app.labels" . | nindent 4 }}
   spec:
     replicas: {{ .Values.replicaCount }}
     selector:
       matchLabels:
         {{- include "my-app.selectorLabels" . | nindent 6 }}
     template:
       metadata:
         labels:
           {{- include "my-app.selectorLabels" . | nindent 8 }}
       spec:
         containers:
           - name: {{ .Chart.Name }}
             image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
             imagePullPolicy: {{ .Values.image.pullPolicy }}
             ports:
               - containerPort: 8080
             resources:
               {{- toYaml .Values.resources | nindent 14 }}
   ```

### kubectl Commands

1. **Basic Operations**
   ```bash
   kubectl get pods -n namespace
   kubectl get deployments
   kubectl get services
   kubectl describe pod pod-name
   kubectl logs pod-name -f
   kubectl logs pod-name -c container-name
   
   kubectl apply -f deployment.yaml
   kubectl delete -f deployment.yaml
   kubectl delete pod pod-name
   
   kubectl exec -it pod-name -- /bin/sh
   kubectl cp file.txt pod-name:/path/
   ```

2. **Scaling and Updates**
   ```bash
   kubectl scale deployment my-app --replicas=5
   kubectl autoscale deployment my-app --min=2 --max=10 --cpu-percent=70
   
   kubectl rollout status deployment/my-app
   kubectl rollout history deployment/my-app
   kubectl rollout undo deployment/my-app
   kubectl rollout undo deployment/my-app --to-revision=2
   ```

3. **Debugging**
   ```bash
   kubectl describe pod pod-name
   kubectl logs pod-name --previous
   kubectl get events --sort-by='.lastTimestamp'
   kubectl top pods
   kubectl top nodes
   
   kubectl port-forward pod-name 8080:8080
   kubectl port-forward svc/service-name 8080:80
   
   kubectl run debug --image=busybox --rm -it --restart=Never -- sh
   ```

### Namespaces and Resource Quotas

```yaml
apiVersion: v1
kind: Namespace
metadata:
   name: production
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: production
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    pods: "50"
```

### Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-network-policy
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: database
      ports:
        - protocol: TCP
          port: 5432
```

## Output Contract
- Kubernetes manifests (YAML)
- Helm Charts
- kubectl commands
- Troubleshooting guides
- Best practices documentation

## Constraints
- Use resource limits and requests
- Implement health checks
- Use namespaces for isolation
- Follow security best practices
- Use version control for manifests

## Examples

### Example 1: Full Application Stack
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: myapp
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: nginx
          image: nginx:alpine
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: myapp
spec:
  selector:
    app: frontend
  ports:
    - port: 80
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: myapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: api
          image: myapi:latest
          ports:
            - containerPort: 8080
          env:
            - name: DB_HOST
              value: "postgres"
---
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: myapp
spec:
  selector:
    app: backend
  ports:
    - port: 8080
```

### Example 2: Helm Release Command
```bash
helm install my-release ./my-chart \
  --namespace production \
  --create-namespace \
  --set image.tag=v2.0.0 \
  --set replicaCount=5 \
  -f values-production.yaml
```
