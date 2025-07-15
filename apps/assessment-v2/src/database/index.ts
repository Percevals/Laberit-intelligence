/**
 * Database Module Entry Point
 * Provides configured database service instance
 * Uses API service when backend is available, falls back to mock for GitHub Pages
 */

import type { CompanyDatabaseService } from './types';
import { createMockDatabaseService } from './mock-database.service';
import { createAPIDatabaseService } from './api-database.service';

// Singleton database service instance
let serviceInstance: CompanyDatabaseService | null = null;

// Check if backend API is available
const USE_API = import.meta.env.VITE_USE_API === 'true' || 
                import.meta.env.VITE_API_URL || 
                import.meta.env.PROD;

/**
 * Get the database service instance (singleton)
 * Automatically initializes database on first call
 */
export async function getDatabaseService(): Promise<CompanyDatabaseService> {
  if (!serviceInstance) {
    if (USE_API) {
      try {
        serviceInstance = createAPIDatabaseService();
        console.log('🐘 Using PostgreSQL database service (API mode)');
      } catch (error) {
        console.warn('Failed to create API database service, falling back to mock:', error);
        serviceInstance = createMockDatabaseService();
        console.log('🌐 Using browser database service (mock mode)');
      }
    } else {
      serviceInstance = createMockDatabaseService();
      console.log('🌐 Using browser database service (mock mode)');
    }
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