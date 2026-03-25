# Config Management

## Description
Expert in application configuration management including environment variables, config files, secrets handling, and configuration validation.

## Usage Scenario
Use this skill when:
- Managing environment configs
- Configuration validation
- Multi-environment setup
- Feature flags
- Config hot-reloading
- Secrets integration

## Instructions

### Environment Variables

1. **Type-Safe Config**
   ```typescript
   import { z } from 'zod';
   
   const configSchema = z.object({
     NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
     PORT: z.string().transform(Number).default('3000'),
     DATABASE_URL: z.string().url(),
     REDIS_URL: z.string().url().optional(),
     JWT_SECRET: z.string().min(32),
     LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
     CORS_ORIGIN: z.string().optional(),
   });
   
   type Config = z.infer<typeof configSchema>;
   
   function loadConfig(): Config {
     return configSchema.parse(process.env);
   }
   
   export const config = loadConfig();
   ```

2. **Dotenv Integration**
   ```typescript
   import dotenv from 'dotenv';
   import dotenvExpand from 'dotenv-expand';
   import path from 'path';
   
   const env = process.env.NODE_ENV || 'development';
   
   const envPath = path.resolve(process.cwd(), `.env.${env}`);
   dotenvExpand.expand(dotenv.config({ path: envPath }));
   
   dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });
   dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
   ```

3. **Required Variables**
   ```typescript
   function requireEnv(name: string): string {
     const value = process.env[name];
     if (!value) {
       throw new Error(`Missing required environment variable: ${name}`);
     }
     return value;
   }
   
   function getEnv(name: string, defaultValue?: string): string | undefined {
     return process.env[name] ?? defaultValue;
   }
   
   function getEnvInt(name: string, defaultValue?: number): number {
     const value = process.env[name];
     if (!value) return defaultValue ?? 0;
     const parsed = parseInt(value, 10);
     if (isNaN(parsed)) {
       throw new Error(`Environment variable ${name} must be an integer`);
     }
     return parsed;
   }
   ```

### Configuration Files

1. **JSON/YAML Config**
   ```typescript
   import fs from 'fs';
   import yaml from 'yaml';
   import path from 'path';
   
   interface AppConfig {
     app: {
       name: string;
       version: string;
     };
     database: {
       host: string;
       port: number;
       name: string;
       pool: {
         min: number;
         max: number;
       };
     };
     cache: {
       enabled: boolean;
       ttl: number;
     };
   }
   
   function loadConfigFile(): AppConfig {
     const env = process.env.NODE_ENV || 'development';
     const configPath = path.resolve(process.cwd(), `config/${env}.yaml`);
     
     if (!fs.existsSync(configPath)) {
       throw new Error(`Config file not found: ${configPath}`);
     }
     
     const fileContent = fs.readFileSync(configPath, 'utf8');
     return yaml.parse(fileContent) as AppConfig;
   }
   ```

2. **Config with Overrides**
   ```typescript
   import { deepmerge } from 'deepmerge-ts';
   
   function loadConfigWithOverrides(): AppConfig {
     const defaultConfig = loadYaml('config/default.yaml');
     const envConfig = loadYaml(`config/${process.env.NODE_ENV}.yaml`);
     const localConfig = loadYaml('config/local.yaml');
     
     return deepmerge(defaultConfig, envConfig, localConfig);
   }
   ```

3. **Config Directory Structure**
   ```
   config/
   ├── default.yaml
   ├── development.yaml
   ├── test.yaml
   ├── production.yaml
   └── local.yaml (gitignored)
   ```

### Validation

1. **Joi Validation**
   ```typescript
   import Joi from 'joi';
   
   const schema = Joi.object({
     NODE_ENV: Joi.string()
       .valid('development', 'production', 'test')
       .default('development'),
     PORT: Joi.number().port().default(3000),
     DATABASE_URL: Joi.string().uri().required(),
     JWT_SECRET: Joi.string().min(32).required(),
     REDIS_URL: Joi.string().uri().optional(),
   }).unknown();
   
   const { value: config, error } = schema.validate(process.env, {
     abortEarly: false,
     allowUnknown: true,
   });
   
   if (error) {
     console.error('Config validation error:', error.details);
     process.exit(1);
   }
   ```

2. **Custom Validators**
   ```typescript
   function validateConfig(config: unknown): Config {
     const errors: string[] = [];
     
     if (!config.database.url) {
       errors.push('database.url is required');
     }
     
     if (config.database.pool.max < config.database.pool.min) {
       errors.push('database.pool.max must be >= database.pool.min');
     }
     
     if (config.jwt.expiresIn && !/^\d+[smhd]$/.test(config.jwt.expiresIn)) {
       errors.push('jwt.expiresIn must be in format: 1s, 1m, 1h, 1d');
     }
     
     if (errors.length > 0) {
       throw new Error(`Config validation failed:\n${errors.join('\n')}`);
     }
     
     return config as Config;
   }
   ```

### Feature Flags

1. **Simple Feature Flags**
   ```typescript
   interface FeatureFlags {
     enableNewUI: boolean;
     enableBetaFeatures: boolean;
     maxUploadSize: number;
     rateLimit: {
       enabled: boolean;
       requestsPerMinute: number;
     };
   }
   
   const defaultFlags: FeatureFlags = {
     enableNewUI: false,
     enableBetaFeatures: false,
     maxUploadSize: 10 * 1024 * 1024,
     rateLimit: {
       enabled: true,
       requestsPerMinute: 60,
     },
   };
   
   function getFeatureFlags(): FeatureFlags {
     return {
       enableNewUI: process.env.FEATURE_NEW_UI === 'true',
       enableBetaFeatures: process.env.FEATURE_BETA === 'true',
       maxUploadSize: parseInt(process.env.MAX_UPLOAD_SIZE || '10485760'),
       rateLimit: {
         enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
         requestsPerMinute: parseInt(process.env.RATE_LIMIT_RPM || '60'),
       },
     };
   }
   
   function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
     const flags = getFeatureFlags();
     const value = flags[flag];
     return typeof value === 'boolean' ? value : false;
   }
   ```

2. **LaunchDarkly Integration**
   ```typescript
   import LaunchDarkly from 'launchdarkly-node-server-sdk';
   
   let client: LaunchDarkly.LDClient;
   
   async function initFeatureFlags(sdkKey: string): Promise<void> {
     client = LaunchDarkly.init(sdkKey);
     await client.waitForInitialization();
   }
   
   async function getFlag<T>(
     key: string,
     user: { key: string },
     defaultValue: T
   ): Promise<T> {
     return client.variation(key, user, defaultValue);
   }
   
   async function checkFeature(
     flagKey: string,
     userId: string,
     defaultValue: boolean = false
   ): Promise<boolean> {
     return getFlag(flagKey, { key: userId }, defaultValue);
   }
   ```

### Hot Reloading

```typescript
import chokidar from 'chokidar';
import { EventEmitter } from 'events';

class ConfigManager extends EventEmitter {
  private config: AppConfig;
  private configPath: string;

  constructor(configPath: string) {
    super();
    this.configPath = configPath;
    this.config = this.loadConfig();
    this.watch();
  }

  private loadConfig(): AppConfig {
    return yaml.parse(fs.readFileSync(this.configPath, 'utf8'));
  }

  private watch(): void {
    const watcher = chokidar.watch(this.configPath);

    watcher.on('change', () => {
      try {
        const oldConfig = this.config;
        this.config = this.loadConfig();
        this.emit('change', { oldConfig, newConfig: this.config });
        console.log('Config reloaded');
      } catch (error) {
        console.error('Failed to reload config:', error);
      }
    });
  }

  get(): AppConfig {
    return { ...this.config };
  }
}

const configManager = new ConfigManager('config/production.yaml');

configManager.on('change', ({ newConfig }) => {
  // Update services with new config
});
```

### Secrets Integration

1. **AWS Secrets Manager**
   ```typescript
   import { SecretsManager } from '@aws-sdk/client-secrets-manager';

   async function getSecret(secretName: string): Promise<Record<string, string>> {
     const client = new SecretsManager({ region: 'us-east-1' });
     
     const response = await client.getSecretValue({ SecretId: secretName });
     
     if (response.SecretString) {
       return JSON.parse(response.SecretString);
     }
     
     throw new Error('Secret not found');
   }

   async function loadSecrets(): Promise<void> {
     const secrets = await getSecret('my-app/production');
     
     process.env.DATABASE_URL = secrets.DATABASE_URL;
     process.env.JWT_SECRET = secrets.JWT_SECRET;
   }
   ```

2. **HashiCorp Vault**
   ```typescript
   import Vault from 'node-vault';

   const vault = Vault({
     endpoint: process.env.VAULT_ADDR,
     token: process.env.VAULT_TOKEN,
   });

   async function getVaultSecret(path: string): Promise<any> {
     const result = await vault.read(path);
     return result.data;
   }

   async function loadVaultSecrets(): Promise<void> {
     const dbSecrets = await getVaultSecret('secret/data/database');
     process.env.DATABASE_URL = dbSecrets.url;
     process.env.DATABASE_PASSWORD = dbSecrets.password;
   }
   ```

## Output Contract
- Config schemas
- Validation logic
- Environment setup
- Feature flag implementations
- Secrets integration

## Constraints
- Never commit secrets
- Validate on startup
- Use type-safe config
- Support multiple environments
- Enable hot reloading when needed

## Examples

### Example 1: Complete Config Module
```typescript
// config/index.ts
import { z } from 'zod';
import dotenv from 'dotenv';

const schema = z.object({
  env: z.enum(['development', 'production', 'test']),
  port: z.number(),
  database: z.object({
    url: z.string(),
    pool: z.object({
      min: z.number(),
      max: z.number(),
    }),
  }),
  jwt: z.object({
    secret: z.string(),
    expiresIn: z.string(),
  }),
});

export type Config = z.infer<typeof schema>;

dotenv.config();

export const config: Config = schema.parse({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  database: {
    url: process.env.DATABASE_URL!,
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2'),
      max: parseInt(process.env.DB_POOL_MAX || '10'),
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
```

### Example 2: Environment-Specific Config
```yaml
# config/production.yaml
app:
  name: my-app
  logLevel: info

database:
  ssl: true
  pool:
    min: 5
    max: 20

cache:
  enabled: true
  ttl: 3600

rateLimit:
  enabled: true
  windowMs: 60000
  max: 100
```
