/**
 * Database Configuration
 * Provides database configuration for different environments
 */

import { DatabaseConfig } from '../database/providers/database-provider.interface';
import { env, Environment } from './environment';

export interface DatabaseConfigWithEnvironment extends DatabaseConfig {
  environment: Environment;
  logQueries?: boolean;
  poolSize?: {
    min: number;
    max: number;
  };
}

/**
 * Database configurations per environment
 */
const configs: Record<Environment, DatabaseConfigWithEnvironment> = {
  development: {
    environment: 'development',
    host: env.get('DB_HOST', 'localhost'),
    port: env.getNumber('DB_PORT', 5432) || 5432,
    database: env.get('DB_NAME', 'dii_dev'),
    username: env.get('DB_USER', 'dii_user'),
    password: env.get('DB_PASSWORD', 'dii_dev_password'),
    ssl: false,
    maxConnections: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    logQueries: true,
    poolSize: {
      min: 2,
      max: 10
    }
  },

  staging: {
    environment: 'staging',
    host: env.getRequired('DB_HOST'),
    port: env.getNumber('DB_PORT', 5432) || 5432,
    database: env.getRequired('DB_NAME'),
    username: env.getRequired('DB_USER'),
    password: env.getRequired('DB_PASSWORD'),
    ssl: true,
    maxConnections: 20,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 5000,
    logQueries: false,
    poolSize: {
      min: 5,
      max: 20
    }
  },

  production: {
    environment: 'production',
    host: env.getRequired('DB_HOST'),
    port: env.getNumber('DB_PORT', 5432) || 5432,
    database: env.getRequired('DB_NAME'),
    username: env.getRequired('DB_USER'),
    password: env.getRequired('DB_PASSWORD'),
    ssl: true,
    maxConnections: 50,
    idleTimeoutMillis: 300000,
    connectionTimeoutMillis: 10000,
    logQueries: false,
    poolSize: {
      min: 10,
      max: 50
    }
  },

  test: {
    environment: 'test',
    host: env.get('TEST_DB_HOST', 'localhost'),
    port: env.getNumber('TEST_DB_PORT', 5432) || 5432,
    database: env.get('TEST_DB_NAME', 'dii_test'),
    username: env.get('TEST_DB_USER', 'dii_user'),
    password: env.get('TEST_DB_PASSWORD', 'dii_test_password'),
    ssl: false,
    maxConnections: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 1000,
    logQueries: false,
    poolSize: {
      min: 1,
      max: 5
    }
  }
};

/**
 * Get database configuration for the current environment
 */
export function getDatabaseConfig(): DatabaseConfigWithEnvironment {
  const environment = env.getEnvironment();
  const config = configs[environment];

  // Allow DATABASE_URL to override individual settings
  const databaseUrl = env.get('DATABASE_URL');
  
  if (databaseUrl) {
    try {
      const url = new URL(databaseUrl);
      
      return {
        ...config,
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        username: url.username,
        password: url.password,
        ssl: url.searchParams.get('sslmode') === 'require'
      };
    } catch (error) {
      console.warn('Invalid DATABASE_URL format, using default config');
    }
  }

  return config;
}

/**
 * Validate database configuration
 */
export function validateDatabaseConfig(config: DatabaseConfig): void {
  const required: (keyof DatabaseConfig)[] = [
    'host', 'port', 'database', 'username', 'password'
  ];

  const missing: string[] = [];

  for (const key of required) {
    if (!config[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Invalid database configuration. Missing: ${missing.join(', ')}`
    );
  }

  // Validate port is a number
  if (typeof config.port !== 'number' || config.port < 1 || config.port > 65535) {
    throw new Error('Database port must be a number between 1 and 65535');
  }
}

/**
 * Log database configuration (safely, without password)
 */
export function logDatabaseConfig(config: DatabaseConfigWithEnvironment): void {
  const safeConfig = {
    ...config,
    password: '***hidden***'
  };

  console.log('Database Configuration:');
  console.log(JSON.stringify(safeConfig, null, 2));
}