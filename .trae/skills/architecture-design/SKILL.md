# Architecture Design

## Description
Expert in software architecture design, system design patterns, microservices, monolithic architecture, and technical decision-making for scalable applications.

## Usage Scenario
Use this skill when:
- Designing system architecture
- Making technology decisions
- Planning microservices migration
- Creating architecture diagrams
- Evaluating trade-offs
- Documenting architecture decisions

## Instructions

### Architecture Patterns

1. **Monolithic Architecture**
   ```
   ┌─────────────────────────────────────┐
   │           Monolith                   │
   │  ┌─────────┐ ┌─────────┐ ┌────────┐ │
   │  │   UI    │ │  API    │ │  DB    │ │
   │  └─────────┘ └─────────┘ └────────┘ │
   └─────────────────────────────────────┘
   
   Pros:
   - Simple deployment
   - Easy debugging
   - Lower latency
   
   Cons:
   - Scaling challenges
   - Technology lock-in
   - Single point of failure
   ```

2. **Microservices Architecture**
   ```
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ Service A│    │ Service B│    │ Service C│
   └────┬─────┘    └────┬─────┘    └────┬─────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
              ┌─────────▼─────────┐
              │   API Gateway     │
              └─────────┬─────────┘
                        │
              ┌─────────▼─────────┐
              │   Message Queue   │
              └───────────────────┘
   
   Pros:
   - Independent scaling
   - Technology flexibility
   - Fault isolation
   
   Cons:
   - Complexity
   - Distributed system challenges
   - Network latency
   ```

3. **Event-Driven Architecture**
   ```
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Producer │     │  Event   │     │ Consumer │
   │    A     │────▶│  Bus     │────▶│    A     │
   └──────────┘     └──────────┘     └──────────┘
                         │
                         ▼
                   ┌──────────┐
                   │ Consumer │
                   │    B     │
                   └──────────┘
   ```

### Design Patterns

1. **CQRS (Command Query Responsibility Segregation)**
   ```
   ┌─────────────┐     ┌─────────────┐
   │   Command   │     │    Query    │
   │    Side     │     │    Side     │
   └──────┬──────┘     └──────┬──────┘
          │                   │
          ▼                   ▼
   ┌─────────────┐     ┌─────────────┐
   │  Write DB   │     │  Read DB    │
   │ (Normalized)│     │(Denormalized)│
   └─────────────┘     └─────────────┘
   ```

2. **Event Sourcing**
   ```
   State = fold(apply_event, initial_state, events)
   
   Events Store:
   - UserCreated
   - EmailUpdated
   - UserDeactivated
   
   Benefits:
   - Complete audit trail
   - Time travel debugging
   - Event replay capability
   ```

3. **Saga Pattern**
   ```
   Distributed Transaction:
   
   Step 1: Reserve Inventory
       │ Success
       ▼
   Step 2: Process Payment
       │ Success
       ▼
   Step 3: Create Order
       │ Failure → Compensating Actions
   
   Compensating Actions:
   - Refund Payment
   - Release Inventory
   ```

4. **Circuit Breaker**
   ```
   States:
   ┌─────────┐  failure threshold  ┌─────────┐
   │ CLOSED  │ ─────────────────▶ │  OPEN   │
   └────┬────┘                     └────┬────┘
        ▲                               │
        │         timeout               │
        │    ┌──────────────────────────┘
        │    │
        │    ▼
   ┌────┴────┐
   │HALF-OPEN│
   └─────────┘
   ```

### Technology Selection

1. **Database Selection**
   ```
   Relational (PostgreSQL, MySQL):
   - ACID transactions
   - Complex queries
   - Structured data
   
   Document (MongoDB):
   - Flexible schema
   - Nested documents
   - Horizontal scaling
   
   Key-Value (Redis):
   - Caching
   - Session storage
   - Real-time data
   
   Graph (Neo4j):
   - Relationship-heavy
   - Social networks
   - Recommendation engines
   
   Time-Series (InfluxDB):
   - Metrics
   - IoT data
   - Analytics
   ```

2. **Message Queue Selection**
   ```
   RabbitMQ:
   - Complex routing
   - Guaranteed delivery
   - AMQP protocol
   
   Kafka:
   - High throughput
   - Event streaming
   - Long retention
   
   SQS:
   - Managed service
   - Simple queue
   - AWS integration
   ```

### Scalability Patterns

1. **Horizontal Scaling**
   ```
   Load Balancer
        │
        ├──▶ Instance 1
        ├──▶ Instance 2
        └──▶ Instance 3
   
   Considerations:
   - Stateless design
   - Session management
   - Database connections
   ```

2. **Database Sharding**
   ```
   ┌─────────────┐
   │   Router    │
   └──────┬──────┘
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
   ┌───┐ ┌───┐ ┌───┐
   │ S1│ │ S2│ │ S3│
   └───┘ └───┘ └───┘
   
   Sharding Strategies:
   - Range-based
   - Hash-based
   - Directory-based
   ```

3. **Caching Strategies**
   ```
   Cache-Aside:
   1. Check cache
   2. If miss, get from DB
   3. Update cache
   
   Write-Through:
   1. Write to cache
   2. Write to DB
   
   Write-Behind:
   1. Write to cache
   2. Async write to DB
   ```

### Architecture Decision Records (ADR)

```markdown
# ADR-001: Use PostgreSQL as Primary Database

## Status
Accepted

## Context
We need a relational database for our e-commerce platform that:
- Handles ACID transactions
- Supports complex queries
- Has strong community support

## Decision
Use PostgreSQL as our primary database.

## Consequences
- Need to manage connection pooling
- Requires schema migrations
- Team needs PostgreSQL expertise

## Alternatives Considered
- MySQL: Less advanced features
- MongoDB: Not suitable for transactional data
```

### Documentation

1. **C4 Model**
   ```
   Level 1: Context
   - System in context with users and external systems
   
   Level 2: Container
   - Applications, databases, microservices
   
   Level 3: Component
   - Components within containers
   
   Level 4: Code
   - Classes, functions, modules
   ```

2. **Architecture Diagram Elements**
   ```
   ┌─────────────┐  Service/Container
   │             │
   └─────────────┘
   
   (  Database   )  Cylinder shape
   
   ┌─────────────┐
   │   Queue     │  Message queue
   └─────────────┘
   
   ───────▶  Sync communication
   - - - -▶  Async communication
   ```

## Output Contract
- Architecture diagrams
- Technology recommendations
- Trade-off analysis
- Migration strategies
- ADR templates

## Constraints
- Consider team expertise
- Budget constraints
- Time to market
- Operational complexity
- Future scalability needs

## Examples

### Example 1: E-commerce Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     CDN (CloudFront)                     │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                   API Gateway (Kong)                     │
└─────────────────────────┬───────────────────────────────┘
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
    ▼                     ▼                     ▼
┌─────────┐         ┌─────────┐         ┌─────────┐
│  User   │         │ Product │         │  Order  │
│ Service │         │ Service │         │ Service │
└────┬────┘         └────┬────┘         └────┬────┘
     │                   │                   │
     │              ┌────┴────┐              │
     │              │         │              │
     ▼              ▼         ▼              ▼
┌─────────┐   ┌─────────┐ ┌─────────┐   ┌─────────┐
│PostgreSQL│   │PostgreSQL│ │  Redis  │   │PostgreSQL│
└─────────┘   └─────────┘ └─────────┘   └─────────┘
                          │
                          ▼
                    ┌─────────┐
                    │  Kafka  │
                    └─────────┘
```

### Example 2: Microservices Checklist
```markdown
## Microservices Readiness Checklist

### Team
- [ ] Experience with distributed systems
- [ ] DevOps capabilities
- [ ] Monitoring and observability setup

### Infrastructure
- [ ] Container orchestration (K8s)
- [ ] Service mesh (optional)
- [ ] API Gateway
- [ ] Message queue

### Operations
- [ ] Centralized logging
- [ ] Distributed tracing
- [ ] Metrics collection
- [ ] Alerting system

### Development
- [ ] CI/CD pipelines
- [ ] Automated testing
- [ ] Documentation standards
- [ ] API versioning strategy
```
