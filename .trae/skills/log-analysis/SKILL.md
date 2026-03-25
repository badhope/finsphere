# Log Analysis

## Description
Expert in log analysis, error tracking, performance bottleneck identification, and log pattern extraction. Supports various log formats and monitoring systems.

## Usage Scenario
Use this skill when:
- Analyzing application logs
- Identifying error patterns
- Performance troubleshooting
- Security incident investigation
- Log aggregation and parsing
- Creating monitoring dashboards

## Instructions

### Log Analysis Process

1. **Identify Log Format**
   - JSON structured logs
   - Apache/Nginx access logs
   - Application-specific formats
   - Syslog format

2. **Extract Key Information**
   - Timestamp
   - Log level (ERROR, WARN, INFO, DEBUG)
   - Service/Component
   - Message and stack traces
   - Request ID/Trace ID

3. **Pattern Recognition**
   - Error frequency analysis
   - Time-based patterns
   - Correlation analysis
   - Anomaly detection

### Common Log Formats

1. **JSON Structured Logs**
   ```json
   {
     "timestamp": "2024-03-25T10:00:00.000Z",
     "level": "ERROR",
     "service": "api-gateway",
     "traceId": "abc123",
     "message": "Connection timeout",
     "error": {
       "code": "ETIMEDOUT",
       "stack": "Error: Connection timeout\n    at..."
     },
     "metadata": {
       "host": "api.example.com",
       "port": 443,
       "duration_ms": 30000
     }
   }
   ```

2. **Apache/Nginx Access Log**
   ```
   192.168.1.1 - - [25/Mar/2024:10:00:00 +0000] "GET /api/users HTTP/1.1" 200 1234 "-" "Mozilla/5.0"
   ```

3. **Application Log**
   ```
   2024-03-25 10:00:00.000 [ERROR] [api-gateway] [trace-id:abc123] Connection timeout to database
   ```

### Analysis Commands

1. **Error Frequency**
   ```bash
   # Count errors by type
   grep -E "ERROR|error" app.log | \
     awk '{print $NF}' | \
     sort | uniq -c | sort -rn
   
   # JSON logs
   jq -r 'select(.level=="ERROR") | .message' app.log | \
     sort | uniq -c | sort -rn
   ```

2. **Time-Based Analysis**
   ```bash
   # Errors per hour
   grep ERROR app.log | \
     awk '{print substr($1, 1, 13)}' | \
     uniq -c
   
   # Peak traffic hours
   awk '{print substr($4, 14, 2)}' access.log | \
     sort | uniq -c | sort -rn
   ```

3. **Slow Requests**
   ```bash
   # Requests > 1 second
   awk '$NF > 1000' access.log
   
   # Average response time by endpoint
   awk '{print $7, $NF}' access.log | \
     awk '{sum[$1]+=$2; count[$1]++} END {for(e in sum) print e, sum[e]/count[e]}'
   ```

4. **IP Analysis**
   ```bash
   # Top IPs by request count
   awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -20
   
   # Unique IPs per hour
   awk '{print substr($4, 2, 14), $1}' access.log | \
     sort -u | awk '{print $1}' | uniq -c
   ```

### Error Pattern Detection

1. **Stack Trace Analysis**
   ```python
   import re
   from collections import Counter
   
   def extract_errors(log_content):
       pattern = r'(Error:.*?)(?=\n[0-9]{4}-|\Z)'
       errors = re.findall(pattern, log_content, re.DOTALL)
       return Counter(errors)
   ```

2. **Correlation Analysis**
   ```bash
   # Find all logs with same trace ID
   grep "trace-id:abc123" app.log
   
   # Correlate errors with requests
   grep -B5 -A5 "ERROR.*timeout" app.log
   ```

3. **Anomaly Detection**
   ```python
   import statistics
   
   def detect_anomalies(response_times, threshold=3):
       mean = statistics.mean(response_times)
       stdev = statistics.stdev(response_times)
       return [t for t in response_times 
               if abs(t - mean) > threshold * stdev]
   ```

### Performance Analysis

1. **Response Time Distribution**
   ```bash
   # Percentile analysis
   awk '{print $NF}' access.log | \
     sort -n | \
     awk '{all[NR]=$1} END {
       print "p50:", all[int(NR*0.50)]
       print "p90:", all[int(NR*0.90)]
       print "p99:", all[int(NR*0.99)]
     }'
   ```

2. **Database Query Analysis**
   ```bash
   # Slow queries
   grep "query.*took.*ms" app.log | \
     awk -F'took ' '{print $2}' | \
     sort -rn | head -20
   ```

3. **Memory Usage Tracking**
   ```bash
   # Memory pattern over time
   grep "memory.*MB" app.log | \
     awk '{print $1, $2, $NF}'
   ```

### Security Analysis

1. **Failed Login Attempts**
   ```bash
   grep "authentication failed" auth.log | \
     awk '{print $NF}' | \
     sort | uniq -c | sort -rn
   ```

2. **Suspicious Patterns**
   ```bash
   # SQL injection attempts
   grep -i "union.*select\|or.*1=1\|drop table" access.log
   
   # Path traversal attempts
   grep -E "\.\./|\.\.%2f" access.log
   
   # XSS attempts
   grep -i "<script\|javascript:" access.log
   ```

3. **Rate Limiting Analysis**
   ```bash
   # Requests per IP per minute
   awk '{print $1, substr($4, 2, 16)}' access.log | \
     sort | uniq -c | sort -rn | head -20
   ```

### Log Aggregation Queries

1. **Elasticsearch/Kibana**
   ```
   # Error rate over time
   GET /logs/_search
   {
     "size": 0,
     "aggs": {
       "errors_over_time": {
         "date_histogram": {
           "field": "timestamp",
           "calendar_interval": "hour"
         },
         "aggs": {
           "error_count": {
             "filter": {"term": {"level": "ERROR"}}
           }
         }
       }
     }
   }
   ```

2. **Grafana Loki**
   ```
   # Error count by service
   sum by (service) (count_over_time({level="ERROR"}[1h]))
   
   # Top error messages
   topk(10, sum by (message) (count_over_time({level="ERROR"}[1h])))
   ```

## Output Contract
- Error analysis reports
- Performance metrics
- Security findings
- Trend visualizations
- Actionable recommendations

## Constraints
- Handle sensitive data appropriately
- Respect log retention policies
- Consider log volume impact
- Document analysis methodology
- Provide reproducible queries

## Examples

### Example 1: Error Report
```
=== Error Analysis Report ===
Period: 2024-03-25 00:00 - 23:59

Total Errors: 1,234
Unique Error Types: 15

Top 5 Errors:
1. ConnectionTimeout (456 occurrences, 37%)
   - Most common in: api-gateway
   - Peak hours: 14:00-16:00
   
2. DatabaseError (234 occurrences, 19%)
   - Related to: slow queries
   - Affected endpoints: /api/users, /api/orders
   
3. AuthenticationFailed (189 occurrences, 15%)
   - Suspicious IPs: 192.168.1.100 (50+ attempts)
   
Recommendations:
- Increase connection pool size
- Add database query caching
- Implement rate limiting for auth endpoints
```

### Example 2: Performance Report
```
=== Performance Analysis ===

Response Time Percentiles:
p50:  45ms
p90:  120ms
p99:  850ms
p99.9: 3.2s

Slowest Endpoints:
1. /api/reports - avg: 2.3s
2. /api/search - avg: 1.8s
3. /api/export - avg: 1.5s

Database Queries:
- Slow query count: 234
- Avg slow query time: 1.2s
- Most common slow query: SELECT * FROM orders WHERE...

Recommendations:
- Add index on orders.created_at
- Implement pagination for /api/reports
- Consider caching for /api/search
```
