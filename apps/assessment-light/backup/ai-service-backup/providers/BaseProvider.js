/**
 * BaseProvider - Abstract base class for all AI providers
 * 
 * All AI providers must extend this class and implement the required methods.
 * This ensures consistent interface across different AI services.
 */

export class BaseProvider {
  constructor(config = {}) {
    this.config = config;
    this.name = this.constructor.name;
  }

  /**
   * Initialize the provider (e.g., test API connection)
   * @returns {Promise<void>}
   */
  async initialize() {
    // Override in subclasses if needed
  }

  /**
   * Main completion method - must be implemented by all providers
   * @param {Object} request - Request object with type and data
   * @param {string} request.type - Type of completion (compromise_analysis, executive_insights, etc.)
   * @param {Object} request.data - Data for the completion
   * @returns {Promise<Object>} - Provider-specific response
   */
  async complete(request) {
    throw new Error(`Provider ${this.name} must implement complete() method`);
  }

  /**
   * Get specific insights - must be implemented by all providers
   * @param {Object} data - Context data for insight generation
   * @param {string} type - Type of insight requested
   * @returns {Promise<Object>} - Insight response
   */
  async getInsight(data, type) {
    throw new Error(`Provider ${this.name} must implement getInsight() method`);
  }

  /**
   * Check if the provider is available and ready to use
   * @returns {boolean}
   */
  isAvailable() {
    return false;
  }

  /**
   * Get provider capabilities
   * @returns {Object} - Object describing what the provider can do
   */
  getCapabilities() {
    return {
      compromiseAnalysis: false,
      executiveInsights: false,
      threatContext: false,
      scenarioSimulation: false,
      realtimeAnalysis: false
    };
  }

  /**
   * Estimate tokens/cost for a request (optional)
   * @param {Object} request - Request to estimate
   * @returns {Object} - Estimated tokens and cost
   */
  estimateUsage(request) {
    return {
      inputTokens: 0,
      outputTokens: 0,
      estimatedCost: 0,
      currency: 'USD'
    };
  }

  /**
   * Format error responses consistently
   * @param {Error} error - Original error
   * @param {string} context - Context where error occurred
   * @returns {Object} - Formatted error response
   */
  formatError(error, context) {
    return {
      success: false,
      error: {
        message: error.message || 'Unknown error',
        code: error.code || 'PROVIDER_ERROR',
        provider: this.name,
        context
      }
    };
  }

  /**
   * Validate request format
   * @param {Object} request - Request to validate
   * @throws {Error} - If request is invalid
   */
  validateRequest(request) {
    if (!request || typeof request !== 'object') {
      throw new Error('Request must be an object');
    }
    
    if (!request.type || typeof request.type !== 'string') {
      throw new Error('Request must have a type property');
    }
    
    if (!request.data || typeof request.data !== 'object') {
      throw new Error('Request must have a data property');
    }
  }
}