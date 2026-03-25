# Database Migration

## Description
Expert in database migration management including schema changes, data migrations, rollback strategies, and migration tool configuration (Flyway, Liquibase, Prisma, Django migrations, etc.).

## Usage Scenario
Use this skill when:
- Creating database schema migrations
- Performing data migrations
- Managing migration version control
- Setting up migration tools
- Handling rollback scenarios
- Multi-database migration strategies

## Instructions

### Migration Principles

1. **Core Principles**
   - Migrations should be reversible
   - Each migration should be atomic
   - Never modify existing migrations
   - Test migrations on staging first
   - Backup before migration

2. **Naming Convention**
   - Timestamp-based: `20240101_120000_create_users_table.sql`
   - Sequential: `V001__create_users_table.sql`
   - Descriptive names that explain the change

### SQL Migration Patterns

1. **Create Table**
   ```sql
   -- Up Migration
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       email VARCHAR(255) NOT NULL UNIQUE,
       name VARCHAR(100),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE INDEX idx_users_email ON users(email);
   
   -- Down Migration
   DROP INDEX IF EXISTS idx_users_email;
   DROP TABLE IF EXISTS users;
   ```

2. **Add Column**
   ```sql
   -- Up
   ALTER TABLE users ADD COLUMN phone VARCHAR(20);
   
   -- Down
   ALTER TABLE users DROP COLUMN phone;
   ```

3. **Data Migration**
   ```sql
   -- Up
   UPDATE users 
   SET status = 'active' 
   WHERE status IS NULL;
   
   -- Down
   UPDATE users 
   SET status = NULL 
   WHERE status = 'active' 
   AND created_at < '2024-01-01';
   ```

### Tool-Specific Configurations

1. **Prisma (Node.js)**
   ```prisma
   // schema.prisma
   model User {
     id        Int      @id @default(autoincrement())
     email     String   @unique
     name      String?
     posts     Post[]
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   
   model Post {
     id        Int      @id @default(autoincrement())
     title     String
     content   String?
     author    User     @relation(fields: [authorId], references: [id])
     authorId  Int
   }
   ```
   
   ```bash
   # Create migration
   npx prisma migrate dev --name add_user_table
   
   # Deploy migrations
   npx prisma migrate deploy
   
   # Reset database
   npx prisma migrate reset
   ```

2. **Flyway (Java)**
   ```sql
   -- V1__Create_users_table.sql
   CREATE TABLE users (
       id BIGSERIAL PRIMARY KEY,
       email VARCHAR(255) NOT NULL UNIQUE
   );
   ```
   
   ```properties
   # flyway.conf
   flyway.url=jdbc:postgresql://localhost:5432/mydb
   flyway.user=myuser
   flyway.password=mypassword
   flyway.locations=filesystem:db/migration
   ```
   
   ```bash
   flyway migrate
   flyway undo  # Requires Teams edition
   flyway info
   ```

3. **Django (Python)**
   ```python
   # models.py
   from django.db import models
   
   class User(models.Model):
       email = models.EmailField(unique=True)
       name = models.CharField(max_length=100, blank=True)
       created_at = models.DateTimeField(auto_now_add=True)
   ```
   
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py migrate app_name 0001  # Rollback to specific
   ```

4. **Liquibase (Java)**
   ```yaml
   # changelog.yaml
   databaseChangeLog:
     - changeSet:
         id: 1
         author: developer
         changes:
           - createTable:
               tableName: users
               columns:
                 - column:
                     name: id
                     type: BIGINT
                     autoIncrement: true
                     constraints:
                       primaryKey: true
                 - column:
                     name: email
                     type: VARCHAR(255)
                     constraints:
                       nullable: false
                       unique: true
   ```

### Safe Migration Patterns

1. **Non-Locking Migrations**
   ```sql
   -- Add column with default (PostgreSQL 11+)
   ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
   
   -- Create index concurrently
   CREATE INDEX CONCURRENTLY idx_users_status ON users(status);
   
   -- Add constraint with validation
   ALTER TABLE users ADD CONSTRAINT check_email 
   CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') 
   NOT VALID;
   
   ALTER TABLE users VALIDATE CONSTRAINT check_email;
   ```

2. **Large Table Migration**
   ```sql
   -- Batch updates
   DO $$
   DECLARE
       batch_size INT := 10000;
       updated INT;
   BEGIN
       LOOP
           UPDATE users 
           SET migrated = true 
           WHERE migrated = false 
           AND id IN (
               SELECT id FROM users 
               WHERE migrated = false 
               LIMIT batch_size
           );
           
           GET DIAGNOSTICS updated = ROW_COUNT;
           EXIT WHEN updated = 0;
           COMMIT;
       END LOOP;
   END $$;
   ```

3. **Zero-Downtime Migration**
   ```sql
   -- Step 1: Add new column
   ALTER TABLE users ADD COLUMN new_email VARCHAR(255);
   
   -- Step 2: Backfill data
   UPDATE users SET new_email = email WHERE new_email IS NULL;
   
   -- Step 3: Add constraints
   ALTER TABLE users ALTER COLUMN new_email SET NOT NULL;
   ALTER TABLE users ADD UNIQUE (new_email);
   
   -- Step 4: Update application to use new column
   
   -- Step 5: Drop old column
   ALTER TABLE users DROP COLUMN email;
   ALTER TABLE users RENAME COLUMN new_email TO email;
   ```

### Rollback Strategies

1. **Manual Rollback Script**
   ```sql
   -- rollback_001.sql
   BEGIN;
   
   ALTER TABLE users DROP COLUMN IF EXISTS phone;
   
   DROP INDEX IF EXISTS idx_users_phone;
   
   COMMIT;
   ```

2. **Version-Based Rollback**
   ```bash
   # Prisma
   npx prisma migrate resolve --rolled-back migration_name
   
   # Flyway
   flyway undo
   
   # Django
   python manage.py migrate app_name previous_migration
   ```

## Output Contract
- Migration scripts (up and down)
- Rollback procedures
- Tool-specific configurations
- Safety recommendations
- Performance considerations

## Constraints
- Always include rollback scripts
- Test on staging environment first
- Backup before production migrations
- Use transactions when possible
- Document breaking changes

## Examples

### Example 1: Complete Migration Set
```sql
-- V001__Create_users_table.sql
-- Up
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Down
DROP INDEX IF EXISTS idx_users_email;
DROP TABLE IF EXISTS users;
```

```sql
-- V002__Add_user_profile.sql
-- Up
ALTER TABLE users ADD COLUMN first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

CREATE INDEX idx_users_name ON users(last_name, first_name);

-- Down
DROP INDEX IF EXISTS idx_users_name;
ALTER TABLE users DROP COLUMN IF EXISTS phone;
ALTER TABLE users DROP COLUMN IF EXISTS last_name;
ALTER TABLE users DROP COLUMN IF EXISTS first_name;
```

### Example 2: Data Migration with Validation
```sql
-- V003__Migrate_user_status.sql
-- Up
ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';

-- Migrate existing data
UPDATE users SET status = 
    CASE 
        WHEN last_login > NOW() - INTERVAL '30 days' THEN 'active'
        WHEN last_login > NOW() - INTERVAL '90 days' THEN 'inactive'
        ELSE 'dormant'
    END;

-- Add constraint
ALTER TABLE users ADD CONSTRAINT check_status 
CHECK (status IN ('active', 'inactive', 'dormant', 'suspended'));

CREATE INDEX idx_users_status ON users(status);

-- Down
DROP INDEX IF EXISTS idx_users_status;
ALTER TABLE users DROP CONSTRAINT IF EXISTS check_status;
ALTER TABLE users DROP COLUMN IF EXISTS status;
```
