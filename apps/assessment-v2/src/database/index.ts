/**
 * Database Module Entry Point
 * Provides configured database service instance
 */

// Use PostgreSQL version
import { createCompanyDatabaseService } from './company-database.service.v2';
import type { CompanyDatabaseService } from './types';

// Singleton database service instance
let serviceInstance: CompanyDatabaseService | null = null;

/**
 * Get the database service instance (singleton)
 * Automatically initializes database on first call
 */
export async function getDatabaseService(): Promise<CompanyDatabaseService> {
  if (!serviceInstance) {
    // Create service instance (it handles its own initialization)
    serviceInstance = createCompanyDatabaseService();
    
    console.log('✅ Database service initialized');
  }

  return serviceInstance;
}

/**
 * Initialize database manually (useful for setup/testing)
 */
export async function initDatabase(): Promise<void> {
  // Database initialization happens automatically on first use
  await getDatabaseService();
}

/**
 * Reset database service (useful for testing)
 */
export function resetDatabaseService(): void {
  serviceInstance = null;
}

// Re-export types
export type { CompanyDatabaseService } from './types';

// Re-export the service for direct usage
export { createCompanyDatabaseService } from './company-database.service.v2';