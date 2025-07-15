/**
 * Database Module Entry Point
 * Provides configured database service instance
 */

import { getDatabaseConnection, initializeDatabase } from './connection';
import { createCompanyDatabaseService } from './company-database.service';
import type { CompanyDatabaseService } from './types';

// Singleton database service instance
let serviceInstance: CompanyDatabaseService | null = null;

/**
 * Get the database service instance (singleton)
 * Automatically initializes database on first call
 */
export async function getDatabaseService(): Promise<CompanyDatabaseService> {
  if (!serviceInstance) {
    // Initialize database if needed
    await initializeDatabase();
    
    // Create service instance
    const connection = getDatabaseConnection();
    serviceInstance = createCompanyDatabaseService(connection);
    
    console.log('✅ Database service initialized');
  }

  return serviceInstance;
}

/**
 * Initialize database manually (useful for setup/testing)
 */
export async function initDatabase(): Promise<void> {
  await initializeDatabase();
}

/**
 * Reset database service (useful for testing)
 */
export function resetDatabaseService(): void {
  serviceInstance = null;
}

// Re-export types and utilities
export type { CompanyDatabaseService } from './types';
export type { DatabaseConnection } from './connection';
export { getDatabaseConnection, closeDatabaseConnection } from './connection';

// Re-export the service for direct usage
export { createCompanyDatabaseService } from './company-database.service';