# Message Queue

## Description
Expert in message queue systems including RabbitMQ, Kafka, and Redis Streams for asynchronous processing, event-driven architecture, and reliable messaging.

## Usage Scenario
Use this skill when:
- Setting up message queues
- Implementing async processing
- Event-driven architecture
- Reliable message delivery
- Worker queue patterns
- Event streaming

## Instructions

### RabbitMQ

1. **Connection Setup**
   ```typescript
   import amqp from 'amqplib';
   
   let connection: amqp.Connection;
   let channel: amqp.Channel;
   
   async function connect(): Promise<void> {
     connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
     channel = await connection.createChannel();
     
     connection.on('close', () => {
       console.log('RabbitMQ connection closed');
       setTimeout(connect, 5000);
     });
     
     connection.on('error', (err) => {
       console.error('RabbitMQ connection error:', err);
     });
   }
   ```

2. **Queue Management**
   ```typescript
   async function assertQueue(name: string, options: amqp.Options.AssertQueue = {}) {
     await channel.assertQueue(name, {
       durable: true,
       ...options,
     });
   }
   
   async function deleteQueue(name: string) {
     await channel.deleteQueue(name);
   }
   
   async function purgeQueue(name: string) {
     await channel.purgeQueue(name);
   }
   ```

3. **Producer**
   ```typescript
   interface Message {
     type: string;
     payload: any;
     timestamp: number;
   }
   
   async function sendMessage(
     queue: string,
     message: Message,
     options: amqp.Options.Publish = {}
   ): Promise<boolean> {
     await assertQueue(queue);
     
     return channel.sendToQueue(
       queue,
       Buffer.from(JSON.stringify(message)),
       {
         persistent: true,
         contentType: 'application/json',
         timestamp: Date.now(),
         ...options,
       }
     );
   }
   
   async function publish(
     exchange: string,
     routingKey: string,
     message: Message
   ): Promise<boolean> {
     await channel.assertExchange(exchange, 'topic', { durable: true });
     
     return channel.publish(
       exchange,
       routingKey,
       Buffer.from(JSON.stringify(message)),
       { persistent: true, contentType: 'application/json' }
     );
   }
   ```

4. **Consumer**
   ```typescript
   async function consume(
     queue: string,
     handler: (message: Message) => Promise<void>,
     options: amqp.Options.Consume = {}
   ): Promise<void> {
     await assertQueue(queue);
     
     await channel.consume(queue, async (msg) => {
       if (!msg) return;
       
       try {
         const message: Message = JSON.parse(msg.content.toString());
         await handler(message);
         channel.ack(msg);
       } catch (error) {
         console.error('Message processing failed:', error);
         channel.nack(msg, false, false);
       }
     }, {
       noAck: false,
       ...options,
     });
   }
   ```

5. **Dead Letter Queue**
   ```typescript
   async function setupDeadLetterQueue(mainQueue: string): Promise<string> {
     const dlq = `${mainQueue}.dlq`;
     const dlx = `${mainQueue}.dlx`;
     
     await channel.assertExchange(dlx, 'direct', { durable: true });
     await channel.assertQueue(dlq, { durable: true });
     await channel.bindQueue(dlq, dlx, dlq);
     
     await channel.assertQueue(mainQueue, {
       durable: true,
       deadLetterExchange: dlx,
       deadLetterRoutingKey: dlq,
     });
     
     return dlq;
   }
   ```

### Kafka

1. **Producer Setup**
   ```typescript
   import { Kafka, Producer, Message } from 'kafkajs';
   
   const kafka = new Kafka({
     brokers: ['localhost:9092'],
     clientId: 'my-app',
   });
   
   const producer: Producer = kafka.producer();
   
   async function connectProducer(): Promise<void> {
     await producer.connect();
   }
   
   async function sendMessage(
     topic: string,
     messages: Message[]
   ): Promise<void> {
     await producer.send({
       topic,
       messages: messages.map((msg) => ({
         key: msg.key,
         value: JSON.stringify(msg.value),
         headers: msg.headers,
         timestamp: Date.now().toString(),
       })),
     });
   }
   ```

2. **Consumer Setup**
   ```typescript
   import { Consumer, EachMessagePayload } from 'kafkajs';
   
   const consumer: Consumer = kafka.consumer({ groupId: 'my-group' });
   
   async function connectConsumer(): Promise<void> {
     await consumer.connect();
   }
   
   async function subscribe(
     topics: string[],
     handler: (payload: EachMessagePayload) => Promise<void>
   ): Promise<void> {
     for (const topic of topics) {
       await consumer.subscribe({ topic, fromBeginning: false });
     }
     
     await consumer.run({
       eachMessage: async (payload) => {
         try {
           await handler(payload);
         } catch (error) {
           console.error('Message processing failed:', error);
         }
       },
     });
   }
   ```

3. **Topic Management**
   ```typescript
   const admin = kafka.admin();
   
   async function createTopic(
     topic: string,
     partitions: number = 3,
     replicationFactor: number = 1
   ): Promise<void> {
     await admin.connect();
     await admin.createTopics({
       topics: [{
         topic,
         numPartitions: partitions,
         replicationFactor,
       }],
     });
     await admin.disconnect();
   }
   
   async function listTopics(): Promise<string[]> {
     await admin.connect();
     const topics = await admin.listTopics();
     await admin.disconnect();
     return topics;
   }
   ```

### Redis Streams

1. **Producer**
   ```typescript
   import Redis from 'ioredis';
   
   const redis = new Redis();
   
   async function addToStream(
     stream: string,
     data: Record<string, string>
   ): Promise<string> {
     return redis.xadd(stream, '*', data);
   }
   
   async function addWithMaxLen(
     stream: string,
     maxLen: number,
     data: Record<string, string>
   ): Promise<string> {
     return redis.xadd(stream, 'MAXLEN', '~', maxLen, '*', data);
   }
   ```

2. **Consumer**
   ```typescript
   async function readStream(
     stream: string,
     group: string,
     consumer: string,
     count: number = 10
   ): Promise<any[]> {
     await redis.xgroup('CREATE', stream, group, '$', 'MKSTREAM').catch(() => {});
     
     return redis.xreadgroup(
       'GROUP', group, consumer,
       'COUNT', count,
       'BLOCK', 5000,
       'STREAMS', stream, '>'
     );
   }
   
   async function acknowledge(
     stream: string,
     group: string,
     id: string
   ): Promise<void> {
     await redis.xack(stream, group, id);
   }
   
   async function processMessages(
     stream: string,
     group: string,
     handler: (id: string, data: any) => Promise<void>
   ): Promise<void> {
     const consumer = `consumer-${Date.now()}`;
     
     while (true) {
       const messages = await readStream(stream, group, consumer);
       
       if (messages) {
         for (const [streamName, entries] of messages) {
           for (const [id, fields] of entries) {
             try {
               await handler(id, fields);
               await acknowledge(stream, group, id);
             } catch (error) {
               console.error('Failed to process message:', error);
             }
           }
         }
       }
     }
   }
   ```

### Patterns

1. **Work Queue**
   ```typescript
   class WorkQueue {
     constructor(private queueName: string) {}
     
     async enqueue<T>(task: T): Promise<void> {
       await sendMessage(this.queueName, {
         type: 'task',
         payload: task,
         timestamp: Date.now(),
       });
     }
     
     async process<T>(
       handler: (task: T) => Promise<void>,
       concurrency: number = 1
     ): Promise<void> {
       await channel.prefetch(concurrency);
       
       await consume(this.queueName, async (message) => {
         await handler(message.payload);
       });
     }
   }
   ```

2. **Pub/Sub with Topics**
   ```typescript
   class TopicPublisher {
     private exchange: string;
     
     constructor(exchange: string) {
       this.exchange = exchange;
     }
     
     async publish(routingKey: string, event: any): Promise<void> {
       await channel.assertExchange(this.exchange, 'topic', { durable: true });
       await publish(this.exchange, routingKey, event);
     }
   }
   
   class TopicSubscriber {
     private exchange: string;
     private queue: string;
     
     constructor(exchange: string, queue: string) {
       this.exchange = exchange;
       this.queue = queue;
     }
     
     async subscribe(
       patterns: string[],
       handler: (event: any) => Promise<void>
     ): Promise<void> {
       await channel.assertExchange(this.exchange, 'topic', { durable: true });
       await channel.assertQueue(this.queue, { durable: true });
       
       for (const pattern of patterns) {
         await channel.bindQueue(this.queue, this.exchange, pattern);
       }
       
       await consume(this.queue, handler);
     }
   }
   ```

3. **Retry with Backoff**
   ```typescript
   async function processWithRetry(
     queue: string,
     handler: (message: Message) => Promise<void>,
     maxRetries: number = 3
   ): Promise<void> {
     await consume(queue, async (message) => {
       const retries = message.retries || 0;
       
       try {
         await handler(message);
       } catch (error) {
         if (retries < maxRetries) {
           const delay = Math.pow(2, retries) * 1000;
           setTimeout(() => {
             sendMessage(queue, { ...message, retries: retries + 1 });
           }, delay);
         } else {
           await sendMessage(`${queue}.dlq`, message);
         }
       }
     });
   }
   ```

## Output Contract
- Queue configurations
- Producer implementations
- Consumer implementations
- Error handling patterns
- Retry mechanisms

## Constraints
- Ensure message durability
- Handle failures gracefully
- Implement idempotency
- Monitor queue health
- Set appropriate timeouts

## Examples

### Example 1: Email Queue
```typescript
interface EmailJob {
  to: string;
  subject: string;
  body: string;
}

const emailQueue = new WorkQueue('email');

// Producer
await emailQueue.enqueue({
  to: 'user@example.com',
  subject: 'Welcome',
  body: 'Welcome to our service!',
});

// Consumer
await emailQueue.process<EmailJob>(async (job) => {
  await sendEmail(job.to, job.subject, job.body);
});
```

### Example 2: Event Sourcing
```typescript
interface Event {
  type: string;
  aggregateId: string;
  data: any;
  timestamp: number;
}

async function appendEvent(stream: string, event: Event): Promise<void> {
  await addToStream(stream, {
    type: event.type,
    aggregateId: event.aggregateId,
    data: JSON.stringify(event.data),
    timestamp: event.timestamp.toString(),
  });
}

async function readEvents(stream: string): Promise<Event[]> {
  const entries = await redis.xrange(stream, '-', '+');
  return entries.map(([id, fields]) => ({
    type: fields[1] as string,
    aggregateId: fields[3] as string,
    data: JSON.parse(fields[5] as string),
    timestamp: parseInt(fields[7] as string),
  }));
}
```
