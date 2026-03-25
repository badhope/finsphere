# Secret Management

## Description
Expert in secrets management including secure storage, rotation, access control, and integration with cloud providers and HashiCorp Vault.

## Usage Scenario
Use this skill when:
- Managing application secrets
- Secret rotation
- Access control for secrets
- Cloud secrets integration
- Vault configuration
- Secure credential handling

## Instructions

### HashiCorp Vault

1. **Setup and Authentication**
   ```typescript
   import Vault from 'node-vault';
   
   const vault = Vault({
     endpoint: process.env.VAULT_ADDR || 'http://localhost:8200',
     token: process.env.VAULT_TOKEN,
   });
   
   async function authenticateWithAppRole(): Promise<void> {
     const { auth } = await vault.approleLogin({
       role_id: process.env.VAULT_ROLE_ID,
       secret_id: process.env.VAULT_SECRET_ID,
     });
     vault.token = auth.client_token;
   }
   
   async function authenticateWithKubernetes(): Promise<void> {
     const jwt = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token', 'utf8');
     const { auth } = await vault.kubernetesLogin({
       role: 'my-app',
       jwt,
     });
     vault.token = auth.client_token;
   }
   ```

2. **Reading Secrets**
   ```typescript
   interface DatabaseCredentials {
     username: string;
     password: string;
     host: string;
     port: number;
     database: string;
   }
   
   async function getDatabaseCredentials(): Promise<DatabaseCredentials> {
     const result = await vault.read('secret/data/database');
     return result.data.data;
   }
   
   async function getSecret(path: string): Promise<Record<string, any>> {
     const result = await vault.read(`secret/data/${path}`);
     return result.data.data;
   }
   
   async function getCachedSecret(path: string, ttl: number = 3600): Promise<Record<string, any>> {
     const cacheKey = `vault:${path}`;
     const cached = cache.get(cacheKey);
     
     if (cached) {
       return cached;
     }
     
     const secret = await getSecret(path);
     cache.set(cacheKey, secret, ttl);
     return secret;
   }
   ```

3. **Writing Secrets**
   ```typescript
   async function storeSecret(path: string, data: Record<string, any>): Promise<void> {
     await vault.write(`secret/data/${path}`, { data });
   }
   
   async function storeDatabaseCredentials(credentials: DatabaseCredentials): Promise<void> {
     await storeSecret('database', credentials);
   }
   ```

4. **Dynamic Secrets**
   ```typescript
   async function getDatabaseDynamicCredentials(): Promise<{
     username: string;
     password: string;
     lease_id: string;
     lease_duration: number;
   }> {
     const result = await vault.read('database/creds/my-role');
     return {
       username: result.data.username,
       password: result.data.password,
       lease_id: result.lease_id,
       lease_duration: result.lease_duration,
     };
   }
   
   async function renewLease(leaseId: string): Promise<void> {
     await vault.write(`sys/leases/renew`, {
       lease_id: leaseId,
       increment: 3600,
     });
   }
   
   async function revokeLease(leaseId: string): Promise<void> {
     await vault.write(`sys/leases/revoke`, { lease_id: leaseId });
   }
   ```

### AWS Secrets Manager

1. **Setup**
   ```typescript
   import { SecretsManager } from '@aws-sdk/client-secrets-manager';
   
   const client = new SecretsManager({
     region: process.env.AWS_REGION || 'us-east-1',
   });
   ```

2. **Get Secret**
   ```typescript
   async function getSecret(secretName: string): Promise<Record<string, string>> {
     const response = await client.getSecretValue({
       SecretId: secretName,
     });
     
     if (response.SecretString) {
       return JSON.parse(response.SecretString);
     }
     
     if (response.SecretBinary) {
       const buffer = Buffer.from(response.SecretBinary as any);
       return JSON.parse(buffer.toString('utf8'));
     }
     
     throw new Error('Secret not found');
   }
   
   async function getSecretValue(secretName: string, key: string): Promise<string> {
     const secret = await getSecret(secretName);
     return secret[key];
   }
   ```

3. **Create and Update**
   ```typescript
   async function createSecret(
     name: string,
     value: Record<string, string>,
     description?: string
   ): Promise<void> {
     await client.createSecret({
       Name: name,
       SecretString: JSON.stringify(value),
       Description: description,
     });
   }
   
   async function updateSecret(name: string, value: Record<string, string>): Promise<void> {
     await client.putSecretValue({
       SecretId: name,
       SecretString: JSON.stringify(value),
     });
   }
   ```

4. **Rotation**
   ```typescript
   async function rotateSecret(
     secretName: string,
     rotationLambdaArn: string,
     rotationDays: number = 30
   ): Promise<void> {
     await client.rotateSecret({
       SecretId: secretName,
       RotationLambdaARN: rotationLambdaArn,
       RotationRules: {
         AutomaticallyAfterDays: rotationDays,
       },
     });
   }
   ```

### Azure Key Vault

1. **Setup**
   ```typescript
   import { DefaultAzureCredential } from '@azure/identity';
   import { SecretClient } from '@azure/keyvault-secrets';
   
   const credential = new DefaultAzureCredential();
   const vaultUrl = `https://${process.env.KEYVAULT_NAME}.vault.azure.net`;
   const client = new SecretClient(vaultUrl, credential);
   ```

2. **Operations**
   ```typescript
   async function getSecret(name: string): Promise<string> {
     const secret = await client.getSecret(name);
     return secret.value!;
   }
   
   async function setSecret(name: string, value: string): Promise<void> {
     await client.setSecret(name, value);
   }
   
   async function deleteSecret(name: string): Promise<void> {
     const poller = await client.beginDeleteSecret(name);
     await poller.pollUntilDone();
   }
   ```

### Google Cloud Secret Manager

```typescript
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

async function getSecret(name: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: `projects/${process.env.PROJECT_ID}/secrets/${name}/versions/latest`,
  });
  
  return version.payload?.data?.toString() || '';
}

async function createSecret(name: string, value: string): Promise<void> {
  await client.createSecret({
    parent: `projects/${process.env.PROJECT_ID}`,
    secretId: name,
    secret: {
      replication: {
        automatic: {},
      },
    },
  });
  
  await client.addSecretVersion({
    parent: `projects/${process.env.PROJECT_ID}/secrets/${name}`,
    payload: {
      data: Buffer.from(value),
    },
  });
}
```

### Secret Rotation

1. **Rotation Handler**
   ```typescript
   interface RotationConfig {
     secretName: string;
     rotationInterval: number;
     onRotate: (newSecret: string) => Promise<void>;
   }
   
   class SecretRotator {
     private intervalId?: NodeJS.Timeout;
     
     constructor(private config: RotationConfig) {}
     
     start(): void {
       this.intervalId = setInterval(
         async () => {
           await this.rotate();
         },
         this.config.rotationInterval
       );
     }
     
     stop(): void {
       if (this.intervalId) {
         clearInterval(this.intervalId);
       }
     }
     
     private async rotate(): Promise<void> {
       try {
         const newSecret = await this.generateNewSecret();
         await this.updateSecret(newSecret);
         await this.config.onRotate(newSecret);
         console.log(`Secret ${this.config.secretName} rotated successfully`);
       } catch (error) {
         console.error(`Failed to rotate secret ${this.config.secretName}:`, error);
       }
     }
     
     private async generateNewSecret(): Promise<string> {
       return crypto.randomBytes(32).toString('base64');
     }
     
     private async updateSecret(value: string): Promise<void> {
       await client.putSecretValue({
         SecretId: this.config.secretName,
         SecretString: JSON.stringify({ password: value }),
       });
     }
   }
   ```

2. **Database Password Rotation**
   ```typescript
   async function rotateDatabasePassword(
     secretName: string,
     dbConfig: DatabaseConfig
   ): Promise<void> {
     const newPassword = generatePassword();
     
     const connection = await mysql.createConnection({
       host: dbConfig.host,
       user: dbConfig.adminUser,
       password: dbConfig.adminPassword,
     });
     
     try {
       await connection.execute(
         `ALTER USER '${dbConfig.appUser}'@'%' IDENTIFIED BY '${newPassword}'`
       );
       
       await updateSecret(secretName, {
         username: dbConfig.appUser,
         password: newPassword,
       });
       
       await connection.end();
     } catch (error) {
       await connection.end();
       throw error;
     }
   }
   ```

### Environment Variables Best Practices

```typescript
import dotenv from 'dotenv';

function loadSecretsToEnv(): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  
  dotenv.config();
}

async function loadSecretsFromVault(): Promise<void> {
  const secrets = await getSecret('application');
  
  for (const [key, value] of Object.entries(secrets)) {
    process.env[key] = value;
  }
}

function requireSecret(name: string): string {
  const value = process.env[name];
  
  if (!value) {
    throw new Error(`Required secret ${name} is not set`);
  }
  
  return value;
}

function maskSecret(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars) {
    return '*'.repeat(value.length);
  }
  
  return value.slice(0, visibleChars) + '*'.repeat(value.length - visibleChars);
}

console.log('Database URL:', maskSecret(process.env.DATABASE_URL!));
```

### Secret Caching

```typescript
class SecretCache {
  private cache = new Map<string, { value: any; expiresAt: number }>();
  
  constructor(private ttl: number = 300000) {}
  
  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }
    
    const value = await fetcher();
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
    });
    
    return value;
  }
  
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

const secretCache = new SecretCache();

async function getSecretWithCache(name: string): Promise<string> {
  return secretCache.get(name, () => getSecret(name));
}
```

## Output Contract
- Vault configurations
- Secret retrieval logic
- Rotation implementations
- Access control policies
- Caching strategies

## Constraints
- Never log secrets
- Use encryption at rest
- Implement rotation
- Audit access
- Use least privilege

## Examples

### Example 1: Complete Secret Manager
```typescript
class SecretManager {
  private vault: Vault;
  private cache: SecretCache;
  
  constructor() {
    this.vault = Vault({
      endpoint: process.env.VAULT_ADDR,
      token: process.env.VAULT_TOKEN,
    });
    this.cache = new SecretCache();
  }
  
  async getDatabaseUrl(): Promise<string> {
    const creds = await this.cache.get('database', () =>
      this.vault.read('secret/data/database')
    );
    return `postgresql://${creds.data.data.username}:${creds.data.data.password}@${creds.data.data.host}:${creds.data.data.port}/${creds.data.data.database}`;
  }
  
  async getJwtSecret(): Promise<string> {
    const secret = await this.cache.get('jwt', () =>
      this.vault.read('secret/data/jwt')
    );
    return secret.data.data.secret;
  }
}

export const secrets = new SecretManager();
```

### Example 2: Lambda Secret Loading
```typescript
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

let cachedSecrets: Record<string, string> | null = null;

async function loadSecrets(): Promise<Record<string, string>> {
  if (cachedSecrets) {
    return cachedSecrets;
  }
  
  const client = new SecretsManager({});
  const response = await client.getSecretValue({
    SecretId: process.env.SECRET_NAME!,
  });
  
  cachedSecrets = JSON.parse(response.SecretString!);
  return cachedSecrets;
}

export const handler = async (event: any) => {
  const secrets = await loadSecrets();
  // Use secrets...
};
```
