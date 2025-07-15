/**
 * Database Module Entry Point
 * Provides configured database service instance
 * Always uses browser-compatible implementation for GitHub Pages deployment
 */

import type { CompanyDatabaseService } from './types';
import { createMockDatabaseService } from './mock-database.service';

// Singleton database service instance
let serviceInstance: CompanyDatabaseService | null = null;

/**
 * Get the database service instance (singleton)
 * Automatically initializes database on first call
 */
export async function getDatabaseService(): Promise<CompanyDatabaseService> {
  if (!serviceInstance) {
    // Always use browser-compatible service for now
    // This ensures the app works on GitHub Pages
    serviceInstance = createMockDatabaseService();
    console.log('🌐 Using browser database service (mock mode)');
  }

  return serviceInstance!;
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
// Note: Removed v2 export to prevent Node.js modules from being bundled