# Redis Caching

## Description
Expert in Redis caching strategies, data structures, distributed locks, and cache patterns for high-performance applications.

## Usage Scenario
Use this skill when:
- Implementing caching strategies
- Using Redis data structures
- Session management
- Rate limiting
- Distributed locks
- Pub/Sub messaging

## Instructions

### Connection Setup

1. **Node.js (ioredis)**
   ```typescript
   import Redis from 'ioredis';
   
   const redis = new Redis({
     host: process.env.REDIS_HOST || 'localhost',
     port: parseInt(process.env.REDIS_PORT || '6379'),
     password: process.env.REDIS_PASSWORD,
     db: parseInt(process.env.REDIS_DB || '0'),
     retryStrategy: (times) => {
       if (times > 3) {
         console.error('Redis connection failed');
         return null;
       }
       return Math.min(times * 200, 2000);
     },
   });
   
   redis.on('connect', () => console.log('Redis connected'));
   redis.on('error', (err) => console.error('Redis error:', err));
   
   export default redis;
   ```

2. **Connection Pool**
   ```typescript
   import { Redis } from 'ioredis';
   
   class RedisPool {
     private pool: Redis[] = [];
     private maxSize = 10;
     
     async acquire(): Promise<Redis> {
       if (this.pool.length > 0) {
         return this.pool.pop()!;
       }
       return new Redis({ host: 'localhost', port: 6379 });
     }
     
     release(client: Redis): void {
       if (this.pool.length < this.maxSize) {
         this.pool.push(client);
       } else {
         client.disconnect();
       }
     }
   }
   ```

### Caching Patterns

1. **Cache-Aside (Lazy Loading)**
   ```typescript
   async function getUser(id: string): Promise<User> {
     const cacheKey = `user:${id}`;
     
     const cached = await redis.get(cacheKey);
     if (cached) {
       return JSON.parse(cached);
     }
     
     const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
     
     await redis.setex(cacheKey, 3600, JSON.stringify(user));
     
     return user;
   }
   ```

2. **Write-Through**
   ```typescript
   async function updateUser(user: User): Promise<void> {
     await db.query('UPDATE users SET name = $1 WHERE id = $2', [user.name, user.id]);
     
     const cacheKey = `user:${user.id}`;
     await redis.setex(cacheKey, 3600, JSON.stringify(user));
   }
   ```

3. **Write-Behind (Write-Back)**
   ```typescript
   const writeQueue = 'write:queue';
   
   async function updateUserAsync(user: User): Promise<void> {
     const cacheKey = `user:${user.id}`;
     await redis.set(cacheKey, JSON.stringify(user));
     
     await redis.rpush(writeQueue, JSON.stringify({
       type: 'update',
       table: 'users',
       data: user,
     }));
   }
   
   async function processWriteQueue(): Promise<void> {
     while (true) {
       const item = await redis.blpop(writeQueue, 0);
       if (item) {
         const { type, table, data } = JSON.parse(item[1]);
         await db.query(`UPDATE ${table} SET ...`, [data]);
       }
     }
   }
   ```

4. **Cache Invalidation**
   ```typescript
   async function invalidateUserCache(id: string): Promise<void> {
     await redis.del(`user:${id}`);
   }
   
   async function invalidatePattern(pattern: string): Promise<void> {
     const keys = await redis.scan(0, 'MATCH', pattern, 'COUNT', 100);
     if (keys[1].length > 0) {
       await redis.del(...keys[1]);
     }
   }
   ```

### Data Structures

1. **Strings**
   ```typescript
   await redis.set('key', 'value');
   await redis.setex('key', 3600, 'value');
   await redis.get('key');
   await redis.del('key');
   await redis.incr('counter');
   await redis.incrby('counter', 10);
   await redis.decr('counter');
   ```

2. **Hashes**
   ```typescript
   await redis.hset('user:1', 'name', 'John');
   await redis.hset('user:1', 'email', 'john@example.com');
   await redis.hget('user:1', 'name');
   await redis.hgetall('user:1');
   await redis.hdel('user:1', 'email');
   await redis.hmset('user:1', { name: 'John', email: 'john@example.com' });
   ```

3. **Lists**
   ```typescript
   await redis.lpush('queue', 'item1');
   await redis.rpush('queue', 'item2');
   await redis.lpop('queue');
   await redis.rpop('queue');
   await redis.lrange('queue', 0, -1);
   await redis.llen('queue');
   await redis.blpop('queue', 5);
   ```

4. **Sets**
   ```typescript
   await redis.sadd('tags', 'redis', 'cache', 'database');
   await redis.srem('tags', 'cache');
   await redis.smembers('tags');
   await redis.sismember('tags', 'redis');
   await redis.scard('tags');
   await redis.sinter('set1', 'set2');
   await redis.sunion('set1', 'set2');
   ```

5. **Sorted Sets**
   ```typescript
   await redis.zadd('leaderboard', 100, 'user1');
   await redis.zadd('leaderboard', 200, 'user2');
   await redis.zrange('leaderboard', 0, -1, 'WITHSCORES');
   await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');
   await redis.zrank('leaderboard', 'user1');
   await redis.zscore('leaderboard', 'user1');
   await redis.zincrby('leaderboard', 50, 'user1');
   ```

### Rate Limiting

1. **Fixed Window**
   ```typescript
   async function rateLimit(
     key: string,
     limit: number,
     windowSeconds: number
   ): Promise<{ allowed: boolean; remaining: number }> {
     const current = await redis.incr(key);
     
     if (current === 1) {
       await redis.expire(key, windowSeconds);
     }
     
     return {
       allowed: current <= limit,
       remaining: Math.max(0, limit - current),
     };
   }
   ```

2. **Sliding Window**
   ```typescript
   async function slidingWindowRateLimit(
     key: string,
     limit: number,
     windowMs: number
   ): Promise<boolean> {
     const now = Date.now();
     const windowStart = now - windowMs;
     
     const pipeline = redis.pipeline();
     pipeline.zremrangebyscore(key, '-inf', windowStart);
     pipeline.zcard(key);
     pipeline.zadd(key, now, `${now}-${Math.random()}`);
     pipeline.expire(key, Math.ceil(windowMs / 1000));
     
     const results = await pipeline.exec();
     const count = results![1][1] as number;
     
     return count < limit;
   }
   ```

3. **Token Bucket**
   ```typescript
   async function tokenBucket(
     key: string,
     capacity: number,
     refillRate: number
   ): Promise<boolean> {
     const now = Date.now();
     const lastRefillKey = `${key}:last`;
     
     const [tokens, lastRefill] = await redis.mget(key, lastRefillKey);
     
     let currentTokens = parseInt(tokens || '0');
     const lastRefillTime = parseInt(lastRefill || '0');
     
     const elapsed = now - lastRefillTime;
     const refill = Math.floor(elapsed / refillRate);
     currentTokens = Math.min(capacity, currentTokens + refill);
     
     if (currentTokens >= 1) {
       await redis.mset(
         key, (currentTokens - 1).toString(),
         lastRefillKey, now.toString()
       );
       await redis.expire(key, Math.ceil(capacity * refillRate / 1000));
       return true;
     }
     
     return false;
   }
   ```

### Distributed Locks

1. **Simple Lock**
   ```typescript
   async function acquireLock(
     key: string,
     ttlMs: number
   ): Promise<string | null> {
     const token = crypto.randomUUID();
     const acquired = await redis.set(key, token, 'PX', ttlMs, 'NX');
     return acquired === 'OK' ? token : null;
   }
   
   async function releaseLock(key: string, token: string): Promise<boolean> {
     const script = `
       if redis.call("get", KEYS[1]) == ARGV[1] then
         return redis.call("del", KEYS[1])
       else
         return 0
       end
     `;
     
     const result = await redis.eval(script, 1, key, token);
     return result === 1;
   }
   ```

2. **Redlock Algorithm**
   ```typescript
   class Redlock {
     private servers: Redis[];
     private quorum: number;
     
     constructor(servers: Redis[]) {
       this.servers = servers;
       this.quorum = Math.floor(servers.length / 2) + 1;
     }
     
     async acquire(resource: string, ttlMs: number): Promise<string | null> {
       const token = crypto.randomUUID();
       const start = Date.now();
       
       const results = await Promise.all(
         this.servers.map((server) =>
           server.set(resource, token, 'PX', ttlMs, 'NX')
         )
       );
       
       const acquired = results.filter((r) => r === 'OK').length;
       const elapsed = Date.now() - start;
       
       if (acquired >= this.quorum && elapsed < ttlMs) {
         return token;
       }
       
       await this.release(resource, token);
       return null;
     }
     
     async release(resource: string, token: string): Promise<void> {
       const script = `
         if redis.call("get", KEYS[1]) == ARGV[1] then
           return redis.call("del", KEYS[1])
         end
       `;
       
       await Promise.all(
         this.servers.map((server) => server.eval(script, 1, resource, token))
       );
     }
   }
   ```

### Pub/Sub

1. **Publisher**
   ```typescript
   await redis.publish('channel', JSON.stringify({ event: 'update', data: {} }));
   ```

2. **Subscriber**
   ```typescript
   const subscriber = new Redis();
   
   await subscriber.subscribe('channel');
   
   subscriber.on('message', (channel, message) => {
     console.log(`Received: ${message}`);
   });
   ```

### Session Management

```typescript
interface Session {
   userId: string;
   createdAt: number;
   expiresAt: number;
}

async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  const session: Session = {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  
  await redis.setex(
    `session:${sessionId}`,
    86400,
    JSON.stringify(session)
  );
  
  return sessionId;
}

async function getSession(sessionId: string): Promise<Session | null> {
  const data = await redis.get(`session:${sessionId}`);
  return data ? JSON.parse(data) : null;
}

async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(`session:${sessionId}`);
}
```

## Output Contract
- Caching implementations
- Rate limiting logic
- Distributed lock patterns
- Session management
- Pub/Sub patterns

## Constraints
- Set appropriate TTLs
- Handle cache misses
- Use connection pooling
- Monitor memory usage
- Implement fallbacks

## Examples

### Example 1: API Cache Middleware
```typescript
async function cacheMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const key = `cache:${req.originalUrl}`;
  const cached = await redis.get(key);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  res.sendResponse = res.json;
  res.json = (body) => {
    redis.setex(key, 3600, JSON.stringify(body));
    return res.sendResponse(body);
  };
  
  next();
}
```

### Example 2: Leaderboard
```typescript
async function updateLeaderboard(userId: string, score: number): Promise<void> {
  await redis.zadd('leaderboard', score, userId);
}

async function getTopPlayers(limit: number): Promise<string[]> {
  return redis.zrevrange('leaderboard', 0, limit - 1);
}

async function getPlayerRank(userId: string): Promise<number> {
  return redis.zrevrank('leaderboard', userId);
}
```
