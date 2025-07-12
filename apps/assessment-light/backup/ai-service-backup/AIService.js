/**
 * AIService - Core AI abstraction layer for DII Quick Assessment
 * 
 * This service provides a provider-agnostic interface for AI capabilities.
 * It automatically detects available providers and falls back to offline mode.
 * 
 * Key principles:
 * - Provider independence: Works with Claude, OpenAI, Azure, Google, or offline
 * - Graceful degradation: Always returns useful data, even without AI
 * - No breaking changes: PWA works with or without AI
 */

import { ClaudeProvider } from './providers/ClaudeProvider.js';
import { OfflineProvider } from './providers/OfflineProvider.js';

export class AIService {
  constructor(provider = null) {
    this.provider = provider || this.detectProvider();
    this.initialized = false;
    this.initPromise = this.initialize();
  }

  /**
   * Auto-detect available AI provider
   * Priority: Environment config > Browser APIs > Offline
   */
  detectProvider() {
    // Check if we're in a browser/artifact environment
    if (typeof window !== 'undefined') {
      // Check for Claude artifact environment
      if (window.claude?.complete) {
        console.log('🤖 AI: Claude provider detected in artifact environment');
        return new ClaudeProvider();
      }
      
      // Check for other browser-based AI APIs
      if (window.ai?.complete) {
        console.log('🤖 AI: Browser AI API detected');
        return new ClaudeProvider(); // Use Claude provider interface for now
      }
    }
    
    // Check environment variables for API keys
    if (import.meta.env?.VITE_CLAUDE_KEY) {
      console.log('🤖 AI: Claude API key found');
      return new ClaudeProvider({ apiKey: import.meta.env.VITE_CLAUDE_KEY });
    }
    
    // Default to offline provider for demos
    console.log('🤖 AI: Using offline provider (demo mode)');
    return new OfflineProvider();
  }

  /**
   * Initialize the AI service and provider
   */
  async initialize() {
    try {
      if (this.provider.initialize) {
        await this.provider.initialize();
      }
      this.initialized = true;
      console.log('✅ AI Service initialized with:', this.provider.constructor.name);
    } catch (error) {
      console.warn('⚠️ AI initialization failed, using offline mode:', error.message);
      this.provider = new OfflineProvider();
      this.initialized = true;
    }
  }

  /**
   * Ensure service is initialized before use
   */
  async ensureInitialized() {
    if (!this.initialized) {
      await this.initPromise;
    }
  }

  /**
   * Check if AI service is available
   */
  isAvailable() {
    return this.provider && this.provider.isAvailable();
  }

  /**
   * Get current provider name
   */
  getProviderName() {
    return this.provider?.constructor.name || 'Unknown';
  }

  /**
   * Sanitize assessment data before sending to AI
   * Removes any sensitive information
   */
  sanitizeData(assessmentData) {
    const { 
      businessModel, 
      dimensions, 
      scores,
      timestamp,
      // Exclude any PII or sensitive data
      ...safeData 
    } = assessmentData;

    return {
      businessModel,
      dimensions: dimensions || {},
      scores: scores || {},
      timestamp: timestamp || new Date().toISOString(),
      ...safeData
    };
  }

  /**
   * Analyze compromise risk based on assessment data
   * Main method for compromise detection feature
   */
  async analyzeCompromiseRisk(assessmentData) {
    await this.ensureInitialized();
    
    const sanitized = this.sanitizeData(assessmentData);
    
    try {
      const result = await this.provider.complete({
        type: 'compromise_analysis',
        data: sanitized
      });
      
      return {
        success: true,
        ...result,
        provider: this.getProviderName()
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Fallback to offline analysis
      const offlineProvider = new OfflineProvider();
      const fallbackResult = await offlineProvider.complete({
        type: 'compromise_analysis',
        data: sanitized
      });
      
      return {
        success: true,
        ...fallbackResult,
        provider: 'Offline (Fallback)',
        fallback: true
      };
    }
  }

  /**
   * Get AI-powered insights with automatic fallback
   */
  async getInsightWithFallback(data, insightType) {
    await this.ensureInitialized();
    
    try {
      const result = await this.provider.getInsight(data, insightType);
      return {
        success: true,
        ...result,
        provider: this.getProviderName()
      };
    } catch (error) {
      console.warn('AI unavailable, using offline intelligence');
      return this.getOfflineInsight(data, insightType);
    }
  }

  /**
   * Get offline insights when AI is unavailable
   */
  async getOfflineInsight(data, insightType) {
    const offlineProvider = new OfflineProvider();
    const result = await offlineProvider.getInsight(data, insightType);
    
    return {
      success: true,
      ...result,
      provider: 'Offline',
      offline: true
    };
  }

  /**
   * Generate executive insights for presentation mode
   */
  async generateExecutiveInsights(assessmentData) {
    await this.ensureInitialized();
    
    const sanitized = this.sanitizeData(assessmentData);
    
    try {
      const result = await this.provider.complete({
        type: 'executive_insights',
        data: sanitized
      });
      
      return {
        success: true,
        ...result,
        provider: this.getProviderName()
      };
    } catch (error) {
      console.error('Executive insights generation failed:', error);
      // Use offline provider for fallback
      return this.getOfflineInsight(sanitized, 'executive_summary');
    }
  }

  /**
   * Get threat context based on business model and region
   */
  async getThreatContext(businessModel, region = 'LATAM') {
    await this.ensureInitialized();
    
    try {
      const result = await this.provider.complete({
        type: 'threat_context',
        data: {
          businessModel,
          region,
          timestamp: new Date().toISOString()
        }
      });
      
      return {
        success: true,
        ...result,
        provider: this.getProviderName()
      };
    } catch (error) {
      console.error('Threat context retrieval failed:', error);
      return this.getOfflineInsight({ businessModel, region }, 'threat_context');
    }
  }

  /**
   * Simulate "what-if" scenarios for executive presentations
   */
  async simulateScenario(baseAssessment, changes) {
    await this.ensureInitialized();
    
    const modifiedAssessment = {
      ...this.sanitizeData(baseAssessment),
      changes
    };
    
    try {
      const result = await this.provider.complete({
        type: 'scenario_simulation',
        data: modifiedAssessment
      });
      
      return {
        success: true,
        ...result,
        provider: this.getProviderName()
      };
    } catch (error) {
      console.error('Scenario simulation failed:', error);
      // Provide basic simulation using offline calculations
      return this.getOfflineInsight(modifiedAssessment, 'scenario');
    }
  }
}

// Singleton instance for easy access
let aiServiceInstance = null;

/**
 * Get or create AI service instance
 */
export function getAIService() {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService();
  }
  return aiServiceInstance;
}

/**
 * Reset AI service (useful for testing or provider switching)
 */
export function resetAIService() {
  aiServiceInstance = null;
}