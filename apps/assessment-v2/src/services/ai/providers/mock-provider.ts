/**
 * Mock AI Provider
 * For development and testing without API costs
 * Now using enhanced fuzzy search capabilities
 */

import { EnhancedMockProvider } from './mock-provider-enhanced';

// Export the enhanced provider as MockProvider for backward compatibility
export class MockProvider extends EnhancedMockProvider {
  constructor() {
    super();
    // Override the ID to maintain compatibility
    this.config.id = 'mock';
    this.config.name = 'Mock Provider (Enhanced)';
  }

}