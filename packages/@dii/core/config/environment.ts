/**
 * Environment Detection and Configuration
 * Determines the current environment and provides utilities
 */

export type Environment = 'development' | 'staging' | 'production' | 'test';

export class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private env: Environment;

  private constructor() {
    this.env = this.detectEnvironment();
  }

  static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  /**
   * Get the current environment
   */
  getEnvironment(): Environment {
    return this.env;
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return this.env === 'development';
  }

  /**
   * Check if running in staging
   */
  isStaging(): boolean {
    return this.env === 'staging';
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this.env === 'production';
  }

  /**
   * Check if running in test
   */
  isTest(): boolean {
    return this.env === 'test';
  }

  /**
   * Get environment variable with fallback
   */
  get(key: string, defaultValue?: string): string | undefined {
    return process.env[key] || defaultValue;
  }

  /**
   * Get required environment variable
   */
  getRequired(key: string): string {
    const value = process.env[key];
    
    if (!value) {
      throw new Error(
        `Required environment variable "${key}" is not set. ` +
        `Current environment: ${this.env}`
      );
    }

    return value;
  }

  /**
   * Get environment variable as number
   */
  getNumber(key: string, defaultValue?: number): number | undefined {
    const value = process.env[key];
    
    if (!value) {
      return defaultValue;
    }

    const parsed = parseInt(value, 10);
    
    if (isNaN(parsed)) {
      throw new Error(
        `Environment variable "${key}" is not a valid number: ${value}`
      );
    }

    return parsed;
  }

  /**
   * Get environment variable as boolean
   */
  getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = process.env[key];
    
    if (!value) {
      return defaultValue ?? false;
    }

    return value.toLowerCase() === 'true' || value === '1';
  }

  /**
   * Validate required environment variables
   */
  validateRequired(keys: string[]): void {
    const missing: string[] = [];
    
    for (const key of keys) {
      if (!process.env[key]) {
        missing.push(key);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}. ` +
        `Current environment: ${this.env}`
      );
    }
  }

  private detectEnvironment(): Environment {
    const nodeEnv = process.env.NODE_ENV?.toLowerCase();
    
    switch (nodeEnv) {
      case 'production':
      case 'prod':
        return 'production';
      
      case 'staging':
      case 'stage':
        return 'staging';
      
      case 'test':
      case 'testing':
        return 'test';
      
      case 'development':
      case 'dev':
      default:
        return 'development';
    }
  }
}

// Export singleton instance
export const env = EnvironmentConfig.getInstance();