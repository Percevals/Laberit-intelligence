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
 * Helper function to get SSL configuration
 */
function getSSLConfig(environment: Environment): boolean | { rejectUnauthorized: boolean } {
  // Check if SSL is disabled via environment variable
  if (env.get('DB_SSL') === 'false') {
    return false;
  }

  // For Azure PostgreSQL or when SSL is explicitly enabled
  if (env.get('DB_SSL') === 'true' || env.get('DB_HOST')?.includes('azure.com')) {
    return {
      rejectUnauthorized: false // Required for Azure self-signed certificates
    };
  }

  // Default SSL settings per environment
  if (environment === 'production' || environment === 'staging') {
    return {
      rejectUnauthorized: false
    };
  }

  return false;
}

/**
 * Database configurations per environment
 */
const configs: Record<Environment, DatabaseConfigWithEnvironment> = {
  development: {
    environment: 'development',
    host: env.get('DB_HOST', 'localhost') || 'localhost',
    port: env.getNumber('DB_PORT', 5432) || 5432,
    database: env.get('DB_NAME', 'dii_dev') || 'dii_dev',
    username: env.get('DB_USER', 'dii_user') || 'dii_user',
    password: env.get('DB_PASSWORD', 'dii_dev_password') || 'dii_dev_password',
    ssl: getSSLConfig('development'),
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
    ssl: getSSLConfig('staging'),
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
    ssl: getSSLConfig('production'),
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
    host: env.get('TEST_DB_HOST', 'localhost') || 'localhost',
    port: env.getNumber('TEST_DB_PORT', 5432) || 5432,
    database: env.get('TEST_DB_NAME', 'dii_test') || 'dii_test',
    username: env.get('TEST_DB_USER', 'dii_user') || 'dii_user',
    password: env.get('TEST_DB_PASSWORD', 'dii_test_password') || 'dii_test_password',
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
      
      // Determine SSL configuration based on URL parameters and host
      let sslConfig: boolean | { rejectUnauthorized: boolean } = false;
      
      if (url.searchParams.get('sslmode') === 'require' || 
          url.searchParams.get('ssl') === 'true' ||
          url.hostname.includes('azure.com')) {
        sslConfig = {
          rejectUnauthorized: false // Required for Azure self-signed certificates
        };
      }
      
      return {
        ...config,
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        username: url.username,
        password: url.password,
        ssl: sslConfig
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
    password: '***hidden***',
    ssl: typeof config.ssl === 'object' ? { ...config.ssl } : config.ssl
  };

  console.log('Database Configuration:');
  console.log(JSON.stringify(safeConfig, null, 2));
}