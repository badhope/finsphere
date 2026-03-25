# Observability Monitoring

## Description
Expert in application observability including metrics, logging, tracing, alerting, and monitoring dashboards for production systems.

## Usage Scenario
Use this skill when:
- Setting up monitoring systems
- Implementing metrics collection
- Distributed tracing
- Log aggregation
- Alert configuration
- Dashboard creation

## Instructions

### Metrics

1. **Prometheus Setup**
   ```typescript
   import client from 'prom-client';
   
   const register = new client.Registry();
   client.collectDefaultMetrics({ register });
   
   const httpRequestDuration = new client.Histogram({
     name: 'http_request_duration_seconds',
     help: 'Duration of HTTP requests in seconds',
     labelNames: ['method', 'route', 'status_code'],
     buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
     registers: [register],
   });
   
   const activeConnections = new client.Gauge({
     name: 'active_connections',
     help: 'Number of active connections',
     registers: [register],
   });
   
   const dbQueryDuration = new client.Histogram({
     name: 'db_query_duration_seconds',
     help: 'Duration of database queries',
     labelNames: ['query_type', 'table'],
     registers: [register],
   });
   
   app.get('/metrics', async (req, res) => {
     res.set('Content-Type', register.contentType);
     res.end(await register.metrics());
   });
   ```

2. **Custom Metrics**
   ```typescript
   class MetricsService {
     private counter = new client.Counter({
       name: 'app_requests_total',
       help: 'Total number of requests',
       labelNames: ['endpoint', 'method'],
     });
     
     private gauge = new client.Gauge({
       name: 'app_queue_size',
       help: 'Current queue size',
       labelNames: ['queue_name'],
     });
     
     private histogram = new client.Histogram({
       name: 'app_processing_time',
       help: 'Processing time in seconds',
       labelNames: ['operation'],
     });
     
     private summary = new client.Summary({
       name: 'app_response_size_bytes',
       help: 'Response size in bytes',
       percentiles: [0.5, 0.9, 0.95, 0.99],
     });
     
     incrementCounter(endpoint: string, method: string) {
       this.counter.inc({ endpoint, method });
     }
     
     setGauge(queueName: string, value: number) {
       this.gauge.set({ queue_name: queueName }, value);
     }
     
     observeHistogram(operation: string, duration: number) {
       this.histogram.observe({ operation }, duration);
     }
   }
   ```

3. **Middleware**
   ```typescript
   function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
     const start = Date.now();
     
     res.on('finish', () => {
       const duration = (Date.now() - start) / 1000;
       httpRequestDuration.observe(
         {
           method: req.method,
           route: req.route?.path || req.path,
           status_code: res.statusCode,
         },
         duration
       );
     });
     
     next();
   }
   ```

### Logging

1. **Structured Logging**
   ```typescript
   import pino from 'pino';
   
   const logger = pino({
     level: process.env.LOG_LEVEL || 'info',
     formatters: {
       level: (label) => ({ level: label }),
     },
     timestamp: pino.stdTimeFunctions.isoTime,
   });
   
   logger.info({ userId: '123', action: 'login' }, 'User logged in');
   logger.error({ err: error, requestId: 'abc' }, 'Request failed');
   
   const childLogger = logger.child({ service: 'auth' });
   childLogger.info('Auth event');
   ```

2. **Winston Logger**
   ```typescript
   import winston from 'winston';
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.combine(
       winston.format.timestamp(),
       winston.format.errors({ stack: true }),
       winston.format.json()
     ),
     defaultMeta: { service: 'my-service' },
     transports: [
       new winston.transports.Console({
         format: winston.format.combine(
           winston.format.colorize(),
           winston.format.simple()
         ),
       }),
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' }),
     ],
   });
   
   if (process.env.NODE_ENV !== 'production') {
     logger.add(
       new winston.transports.Console({
         format: winston.format.simple(),
       })
     );
   }
   ```

3. **Request Logging**
   ```typescript
   import morgan from 'morgan';
   
   app.use(
     morgan('combined', {
       stream: {
         write: (message) => logger.info(message.trim()),
       },
     })
   );
   
   // Custom format
   morgan.token('user-id', (req) => req.user?.id || 'anonymous');
   app.use(
     morgan(':method :url :status :response-time ms - :user-id', {
       stream: { write: (msg) => logger.info(msg.trim()) },
     })
   );
   ```

### Distributed Tracing

1. **OpenTelemetry Setup**
   ```typescript
   import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
   import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
   import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
   import { Resource } from '@opentelemetry/resources';
   import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
   
   const provider = new NodeTracerProvider({
     resource: new Resource({
       [SemanticResourceAttributes.SERVICE_NAME]: 'my-service',
     }),
   });
   
   const exporter = new JaegerExporter({
     endpoint: 'http://localhost:14268/api/traces',
   });
   
   provider.addSpanProcessor(new BatchSpanProcessor(exporter));
   provider.register();
   
   import { trace } from '@opentelemetry/api';
   
   const tracer = trace.getTracer('my-service');
   
   async function processOrder(orderId: string) {
     const span = tracer.startSpan('process_order');
     
     try {
       span.setAttribute('order.id', orderId);
       
       await tracer.startActiveSpan('validate_order', async (childSpan) => {
         await validateOrder(orderId);
         childSpan.end();
       });
       
       await tracer.startActiveSpan('save_order', async (childSpan) => {
         await saveOrder(orderId);
         childSpan.end();
       });
       
       span.setStatus({ code: SpanStatusCode.OK });
     } catch (error) {
       span.recordException(error);
       span.setStatus({ code: SpanStatusCode.ERROR });
       throw error;
     } finally {
       span.end();
     }
   }
   ```

2. **HTTP Instrumentation**
   ```typescript
   import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
   import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
   import { registerInstrumentations } from '@opentelemetry/instrumentation';
   
   registerInstrumentations({
     instrumentations: [
       new HttpInstrumentation(),
       new ExpressInstrumentation(),
     ],
   });
   ```

### Alerting

1. **Prometheus Alert Rules**
   ```yaml
   # alerts.yml
   groups:
     - name: application
       rules:
         - alert: HighErrorRate
           expr: |
             sum(rate(http_request_duration_seconds_count{status_code=~"5.."}[5m]))
             /
             sum(rate(http_request_duration_seconds_count[5m])) > 0.05
           for: 5m
           labels:
             severity: critical
           annotations:
             summary: High error rate detected
             description: Error rate is {{ $value | humanizePercentage }}
   
         - alert: HighLatency
           expr: |
             histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
           for: 5m
           labels:
             severity: warning
           annotations:
             summary: High latency detected
             description: P95 latency is {{ $value }}s
   
         - alert: ServiceDown
           expr: up{job="my-service"} == 0
           for: 1m
           labels:
             severity: critical
           annotations:
             summary: Service is down
   ```

2. **Alertmanager Configuration**
   ```yaml
   # alertmanager.yml
   global:
     slack_api_url: 'https://hooks.slack.com/services/...'
   
   route:
     receiver: 'default'
     group_by: ['alertname', 'severity']
     group_wait: 30s
     group_interval: 5m
     repeat_interval: 4h
   
   receivers:
     - name: 'default'
       slack_configs:
         - channel: '#alerts'
           send_resolved: true
           title: '{{ .Status | toUpper }}: {{ .CommonAnnotations.summary }}'
           text: '{{ .CommonAnnotations.description }}'
   
   inhibit_rules:
     - source_match:
         severity: 'critical'
       target_match:
         severity: 'warning'
       equal: ['alertname']
   ```

### Dashboards

1. **Grafana Dashboard JSON**
   ```json
   {
     "dashboard": {
       "title": "Application Overview",
       "panels": [
         {
           "title": "Request Rate",
           "type": "graph",
           "targets": [
             {
               "expr": "sum(rate(http_request_duration_seconds_count[5m]))",
               "legendFormat": "Requests/s"
             }
           ]
         },
         {
           "title": "Error Rate",
           "type": "graph",
           "targets": [
             {
               "expr": "sum(rate(http_request_duration_seconds_count{status_code=~\"5..\"}[5m]))",
               "legendFormat": "Errors/s"
             }
           ]
         },
         {
           "title": "Latency",
           "type": "graph",
           "targets": [
             {
               "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
               "legendFormat": "P50"
             },
             {
               "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
               "legendFormat": "P95"
             },
             {
               "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))",
               "legendFormat": "P99"
             }
           ]
         }
       ]
     }
   }
   ```

### Health Checks

```typescript
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';

@Injectable()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}

// Express version
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
    },
  };
  
  const allHealthy = Object.values(health.checks).every((c) => c.status === 'ok');
  res.status(allHealthy ? 200 : 503).json(health);
});
```

## Output Contract
- Metrics configurations
- Logging setup
- Tracing implementations
- Alert rules
- Dashboard definitions

## Constraints
- Use structured logging
- Include trace context
- Set appropriate retention
- Monitor cardinality
- Define SLOs/SLIs

## Examples

### Example 1: Complete Middleware
```typescript
function observabilityMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const traceId = req.headers['x-trace-id'] || uuid();
  
  res.setHeader('x-trace-id', traceId);
  
  const logger = rootLogger.child({ traceId });
  req.logger = logger;
  
  logger.info({ method: req.method, path: req.path }, 'Request started');
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    httpRequestDuration.observe(
      { method: req.method, route: req.route?.path, status: res.statusCode },
      duration / 1000
    );
    
    logger.info(
      { method: req.method, path: req.path, status: res.statusCode, duration },
      'Request completed'
    );
  });
  
  next();
}
```

### Example 2: Custom Metrics Dashboard
```yaml
# grafana-dashboard.yml
apiVersion: 1
providers:
  - name: 'default'
    folder: ''
    type: file
    options:
      path: /var/lib/grafana/dashboards
dashboards:
  - uid: 'app-overview'
    title: 'Application Overview'
    panels:
      - title: 'Throughput'
        type: 'stat'
        targets:
          - expr: 'sum(rate(http_request_duration_seconds_count[1m]))'
```
