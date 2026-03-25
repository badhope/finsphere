# Incident Response

## Description
Expert in production incident response, root cause analysis, fault recovery, and post-incident review processes. Follows SRE best practices for handling production issues.

## Usage Scenario
Use this skill when:
- Production systems are down or degraded
- Investigating production incidents
- Performing root cause analysis
- Creating incident response playbooks
- Conducting post-mortems
- Setting up monitoring and alerting

## Instructions

### Incident Classification

1. **Severity Levels**
   ```
   SEV1 - Critical
   - Complete service outage
   - Data loss or security breach
   - Response: Immediate, all hands
   
   SEV2 - Major
   - Significant feature unavailable
   - Major performance degradation
   - Response: Within 15 minutes
   
   SEV3 - Minor
   - Limited functionality affected
   - Workaround available
   - Response: Within 1 hour
   
   SEV4 - Low
   - Cosmetic issues
   - Non-critical bugs
   - Response: Next business day
   ```

2. **Incident States**
   ```
   Investigating → Identified → Mitigating → Resolved → Post-mortem
   ```

### Response Process

1. **Initial Response**
   ```
   1. Acknowledge the incident
   2. Assess severity
   3. Notify stakeholders
   4. Create incident channel
   5. Assign incident commander
   ```

2. **Investigation Steps**
   ```
   1. Check recent deployments
   2. Review error logs
   3. Check metrics dashboards
   4. Verify infrastructure health
   5. Review recent changes
   ```

3. **Communication Template**
   ```
   INCIDENT UPDATE #N
   
   Status: [Investigating/Identified/Mitigating/Resolved]
   Impact: [Description of user impact]
   Current Actions: [What we're doing]
   Next Update: [Time]
   
   Timeline:
   - HH:MM: Alert triggered
   - HH:MM: Investigation started
   - HH:MM: Root cause identified
   ```

### Diagnostic Commands

1. **Application Logs**
   ```bash
   # Recent errors
   kubectl logs deployment/app --tail=100 | grep -i error
   
   # Logs with context
   kubectl logs deployment/app --since=1h | grep -A5 -B5 "exception"
   
   # All pods
   kubectl logs -l app=myapp --all-containers
   ```

2. **Infrastructure Health**
   ```bash
   # Pod status
   kubectl get pods -l app=myapp
   
   # Resource usage
   kubectl top pods
   kubectl top nodes
   
   # Events
   kubectl get events --sort-by='.lastTimestamp'
   ```

3. **Database Issues**
   ```sql
   -- Active connections
   SELECT count(*) FROM pg_stat_activity;
   
   -- Long running queries
   SELECT pid, query, state, duration 
   FROM pg_stat_activity 
   WHERE state = 'active' 
   ORDER BY duration DESC;
   
   -- Locks
   SELECT * FROM pg_locks WHERE NOT granted;
   ```

4. **Network Issues**
   ```bash
   # DNS resolution
   nslookup service-name.namespace.svc.cluster.local
   
   # Connectivity
   curl -v http://service:port/health
   
   # Port check
   nc -zv hostname port
   ```

### Mitigation Strategies

1. **Rollback Deployment**
   ```bash
   # Kubernetes
   kubectl rollout undo deployment/app
   kubectl rollout status deployment/app
   
   # Verify
   kubectl rollout history deployment/app
   ```

2. **Scale Resources**
   ```bash
   # Scale up
   kubectl scale deployment/app --replicas=5
   
   # Horizontal Pod Autoscaler
   kubectl autoscale deployment/app --min=3 --max=10 --cpu-percent=80
   ```

3. **Traffic Management**
   ```bash
   # Enable circuit breaker
   # Feature flag off
   # Redirect traffic
   # Enable maintenance mode
   ```

4. **Database Recovery**
   ```sql
   -- Kill long queries
   SELECT pg_terminate_backend(pid) 
   FROM pg_stat_activity 
   WHERE duration > interval '5 minutes';
   
   -- Restore from backup
   pg_restore -d dbname backup.dump
   ```

### Root Cause Analysis

1. **5 Whys Method**
   ```
   Problem: API returning 500 errors
   
   Why? Database connection pool exhausted
   Why? Connections not being released
   Why? Missing connection.close() in error path
   Why? No try-finally block
   Why? Code review didn't catch it
   
   Root Cause: Insufficient error handling in database layer
   ```

2. **Fishbone Diagram**
   ```
   People: Training, expertise, communication
   Process: Deployment, monitoring, testing
   Technology: Tools, infrastructure, dependencies
   Environment: Load, time, external factors
   ```

### Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

## Summary
- Date: YYYY-MM-DD
- Duration: X hours Y minutes
- Severity: SEV[N]
- Impact: [User/business impact]

## Timeline (UTC)
- HH:MM: Alert triggered
- HH:MM: On-call acknowledged
- HH:MM: Investigation started
- HH:MM: Root cause identified
- HH:MM: Mitigation applied
- HH:MM: Service restored

## Root Cause
[Detailed explanation of what went wrong]

## Trigger
[What caused the incident to start]

## Detection
[How the incident was detected]

## Action Items
| Action | Owner | Priority | Status |
|--------|-------|----------|--------|
| Add monitoring | @user | High | Open |
| Update runbook | @user | Medium | Open |

## Lessons Learned
### What went well
- [Positive aspects]

### What could be improved
- [Areas for improvement]

## Appendix
- [Logs, metrics, screenshots]
```

### Monitoring & Alerting

1. **Alert Rules**
   ```yaml
   # Prometheus alerting rules
   groups:
     - name: app-alerts
       rules:
         - alert: HighErrorRate
           expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
           for: 5m
           labels:
             severity: critical
           annotations:
             summary: High error rate detected
             description: Error rate is {{ $value }} req/s
   ```

2. **SLI/SLO**
   ```
   SLI: Service Level Indicator
   - Request latency
   - Error rate
   - Availability
   
   SLO: Service Level Objective
   - 99.9% availability
   - P99 latency < 500ms
   - Error rate < 0.1%
   
   Error Budget:
   - Monthly budget: 43.2 minutes downtime
   - Remaining: X minutes
   ```

## Output Contract
- Incident response playbooks
- Diagnostic procedures
- Mitigation steps
- Post-mortem reports
- Monitoring configurations

## Constraints
- Prioritize user impact
- Document all actions
- Communicate regularly
- Don't skip post-mortems
- Learn from incidents

## Examples

### Example 1: Incident Response Playbook
```markdown
# Database Connection Pool Exhaustion

## Symptoms
- API returning 500 errors
- "Connection pool exhausted" in logs
- Slow response times

## Diagnosis
1. Check connection count
   ```sql
   SELECT count(*) FROM pg_stat_activity;
   ```
2. Check for idle connections
   ```sql
   SELECT state, count(*) FROM pg_stat_activity GROUP BY state;
   ```

## Mitigation
1. Immediate: Restart application pods
   ```bash
   kubectl rollout restart deployment/app
   ```
2. Short-term: Increase pool size
   ```yaml
   DB_POOL_SIZE: 50
   ```
3. Long-term: Fix connection leak

## Prevention
- Add connection pool monitoring
- Implement connection timeout
- Add health checks
```

### Example 2: Incident Communication
```
🚨 INCIDENT: API Service Degradation

Status: Investigating
Severity: SEV2
Started: 2024-03-25 10:00 UTC

Impact: Users experiencing slow API responses (>5s)

Current Actions:
- Investigating database performance
- Checking recent deployments

Next Update: 10:30 UTC

Incident Channel: #incident-20240325-api
```
