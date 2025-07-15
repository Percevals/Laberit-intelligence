/**
 * @dii/core - Database Abstraction Layer
 * Main entry point for the DII core package
 */

// Database Providers
export { DatabaseProvider, DatabaseConfig, QueryResult, DatabaseTransaction } from './database/providers/database-provider.interface';
export { PostgreSQLProvider } from './database/providers/postgresql.provider';
export { connectionManager, ConnectionManager } from './database/providers/connection-manager';

// Configuration
export { env, Environment, EnvironmentConfig } from './config/environment';
export { getDatabaseConfig, validateDatabaseConfig, DatabaseConfigWithEnvironment } from './config/database.config';

// Repositories
export { BaseRepository, QueryOptions, FindOptions } from './repositories/base.repository';
export { CompanyRepository } from './repositories/company.repository';
export { AssessmentRepository } from './repositories/assessment.repository';

// Types
export * from './types/entities';

// Errors
export { DatabaseError } from './errors/database.error';

// Convenience function to initialize database
export async function initializeDatabase(connectionName = 'default') {
  const { connectionManager } = await import('./database/providers/connection-manager');
  const { getDatabaseConfig } = await import('./config/database.config');
  
  const config = getDatabaseConfig();
  return connectionManager.createConnection(config, connectionName);
}