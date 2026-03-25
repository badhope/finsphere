# SQL Optimization

## Description
Expert in SQL query optimization, index design, execution plan analysis, and database performance tuning for PostgreSQL, MySQL, and other databases.

## Usage Scenario
Use this skill when:
- Optimizing slow queries
- Designing indexes
- Analyzing execution plans
- Database performance tuning
- Query rewriting
- Schema optimization

## Instructions

### Query Analysis

1. **EXPLAIN and EXPLAIN ANALYZE**
   ```sql
   EXPLAIN SELECT * FROM orders WHERE user_id = 123;
   
   EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;
   
   EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
   SELECT * FROM orders WHERE user_id = 123;
   ```

2. **Reading Execution Plans**
   ```
   -- PostgreSQL
   EXPLAIN ANALYZE SELECT o.*, u.name 
   FROM orders o 
   JOIN users u ON o.user_id = u.id 
   WHERE o.status = 'pending' 
   ORDER BY o.created_at DESC 
   LIMIT 100;
   
   -- Key indicators:
   -- Seq Scan = Full table scan (usually bad)
   -- Index Scan = Using index (good)
   -- Bitmap Scan = Partial index usage
   -- Hash Join = Hash table for join
   -- Nested Loop = Row-by-row join
   -- Sort = In-memory or disk sort
   ```

3. **Identifying Problems**
   ```sql
   -- Find slow queries (PostgreSQL)
   SELECT query, calls, total_time, mean_time, rows
   FROM pg_stat_statements
   ORDER BY mean_time DESC
   LIMIT 10;
   
   -- Find missing indexes
   SELECT schemaname, tablename, attname, n_distinct, correlation
   FROM pg_stats
   WHERE n_distinct > 100 AND correlation < 0.5;
   ```

### Index Design

1. **B-Tree Indexes**
   ```sql
   -- Single column
   CREATE INDEX idx_users_email ON users(email);
   
   -- Composite index (order matters!)
   CREATE INDEX idx_orders_user_status ON orders(user_id, status);
   
   -- Covering index
   CREATE INDEX idx_orders_user_status_date 
   ON orders(user_id, status) 
   INCLUDE (created_at, total);
   
   -- Partial index
   CREATE INDEX idx_orders_pending ON orders(created_at)
   WHERE status = 'pending';
   
   -- Unique index
   CREATE UNIQUE INDEX idx_users_email_unique ON users(email);
   ```

2. **Index Strategy**
   ```sql
   -- For queries like:
   -- SELECT * FROM orders WHERE user_id = ? AND status = ?
   CREATE INDEX idx_orders_user_status ON orders(user_id, status);
   
   -- For queries like:
   -- SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
   CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);
   
   -- For text search:
   CREATE INDEX idx_users_name_gin ON users USING gin(to_tsvector('english', name));
   ```

3. **Index Maintenance**
   ```sql
   -- Check index usage
   SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
   FROM pg_stat_user_indexes
   ORDER BY idx_scan ASC;
   
   -- Find unused indexes
   SELECT schemaname, tablename, indexname
   FROM pg_stat_user_indexes
   WHERE idx_scan = 0;
   
   -- Rebuild index
   REINDEX INDEX idx_orders_user_status;
   REINDEX TABLE orders;
   
   -- Update statistics
   ANALYZE orders;
   ```

### Query Rewriting

1. **Avoid SELECT ***
   ```sql
   -- Bad
   SELECT * FROM users WHERE id = 1;
   
   -- Good
   SELECT id, name, email FROM users WHERE id = 1;
   ```

2. **Use LIMIT with ORDER BY**
   ```sql
   -- Bad (sorts all rows)
   SELECT * FROM orders ORDER BY created_at DESC;
   
   -- Good
   SELECT * FROM orders ORDER BY created_at DESC LIMIT 100;
   ```

3. **Optimize JOINs**
   ```sql
   -- Bad: Subquery in SELECT
   SELECT u.*, 
     (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
   FROM users u;
   
   -- Good: JOIN with GROUP BY
   SELECT u.*, COALESCE(o.order_count, 0) as order_count
   FROM users u
   LEFT JOIN (
     SELECT user_id, COUNT(*) as order_count
     FROM orders
     GROUP BY user_id
   ) o ON u.id = o.user_id;
   ```

4. **Use EXISTS instead of IN**
   ```sql
   -- Bad
   SELECT * FROM users 
   WHERE id IN (SELECT user_id FROM orders WHERE status = 'pending');
   
   -- Good
   SELECT * FROM users u
   WHERE EXISTS (
     SELECT 1 FROM orders o 
     WHERE o.user_id = u.id AND o.status = 'pending'
   );
   ```

5. **Avoid OR in WHERE**
   ```sql
   -- Bad (may not use index)
   SELECT * FROM orders WHERE user_id = 1 OR status = 'pending';
   
   -- Good (UNION ALL)
   SELECT * FROM orders WHERE user_id = 1
   UNION ALL
   SELECT * FROM orders WHERE status = 'pending' AND user_id != 1;
   ```

### Pagination

1. **OFFSET Pagination (Simple)**
   ```sql
   -- Works but gets slower with high offset
   SELECT * FROM orders
   ORDER BY id
   LIMIT 20 OFFSET 100;
   ```

2. **Keyset Pagination (Efficient)**
   ```sql
   -- First page
   SELECT * FROM orders
   ORDER BY id
   LIMIT 20;
   
   -- Next page (using last seen id)
   SELECT * FROM orders
   WHERE id > 12345
   ORDER BY id
   LIMIT 20;
   
   -- With composite key
   SELECT * FROM orders
   WHERE (created_at, id) > ('2024-01-01', 12345)
   ORDER BY created_at, id
   LIMIT 20;
   ```

### Aggregation Optimization

1. **Optimize COUNT**
   ```sql
   -- Slow on large tables
   SELECT COUNT(*) FROM orders WHERE status = 'pending';
   
   -- Faster: use approximate count
   SELECT reltuples::bigint FROM pg_class WHERE relname = 'orders';
   
   -- Or maintain a counter table
   INSERT INTO order_counts (status, count) 
   VALUES ('pending', 1) 
   ON CONFLICT (status) DO UPDATE SET count = order_counts.count + 1;
   ```

2. **Optimize GROUP BY**
   ```sql
   -- Bad: GROUP BY on non-indexed column
   SELECT status, COUNT(*) FROM orders GROUP BY status;
   
   -- Good: Add index
   CREATE INDEX idx_orders_status ON orders(status);
   
   -- Better: Use hash aggregate for large groups
   SET enable_hashagg = on;
   ```

### Connection and Transaction

1. **Connection Pooling**
   ```sql
   -- PostgreSQL: pgBouncer configuration
   [pgbouncer]
   pool_mode = transaction
   max_client_conn = 1000
   default_pool_size = 25
   ```

2. **Transaction Optimization**
   ```sql
   -- Bad: Long transaction
   BEGIN;
   -- Many operations...
   COMMIT;
   
   -- Good: Short transactions
   BEGIN;
   UPDATE accounts SET balance = balance - 100 WHERE id = 1;
   UPDATE accounts SET balance = balance + 100 WHERE id = 2;
   COMMIT;
   ```

### Database Configuration

```sql
-- PostgreSQL tuning
-- postgresql.conf

-- Memory
shared_buffers = 4GB
work_mem = 64MB
maintenance_work_mem = 1GB
effective_cache_size = 12GB

-- WAL
wal_buffers = 64MB
checkpoint_completion_target = 0.9

-- Query Planner
random_page_cost = 1.1  -- For SSD
effective_io_concurrency = 200

-- Parallel Queries
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
```

### Monitoring Queries

```sql
-- Active queries
SELECT pid, query, state, wait_event, query_start
FROM pg_stat_activity
WHERE state = 'active';

-- Long-running queries
SELECT pid, query, now() - query_start as duration
FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '5 minutes';

-- Lock waits
SELECT blocked_locks.pid AS blocked_pid,
       blocked_activity.query AS blocked_query,
       blocking_locks.pid AS blocking_pid,
       blocking_activity.query AS blocking_query
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;

-- Table bloat
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
       n_dead_tup, n_live_tup,
       ROUND(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as dead_ratio
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

## Output Contract
- Optimized queries
- Index recommendations
- Execution plan analysis
- Configuration changes
- Performance reports

## Constraints
- Test changes in staging
- Monitor after changes
- Consider write performance
- Document optimizations
- Use appropriate indexes

## Examples

### Example 1: Query Optimization Report
```markdown
## Query Optimization Report

### Original Query
SELECT * FROM orders WHERE user_id = 123;

### Issue
- Full table scan (Seq Scan)
- Execution time: 2500ms

### Solution
CREATE INDEX idx_orders_user_id ON orders(user_id);

### Result
- Index Scan used
- Execution time: 2ms
- Improvement: 1250x
```

### Example 2: Index Strategy
```sql
-- For these queries:
-- 1. SELECT * FROM orders WHERE user_id = ? AND status = ?
-- 2. SELECT * FROM orders WHERE user_id = ? ORDER BY created_at

-- Best index:
CREATE INDEX idx_orders_user_status_date 
ON orders(user_id, status, created_at DESC);

-- Covers both queries efficiently
```
