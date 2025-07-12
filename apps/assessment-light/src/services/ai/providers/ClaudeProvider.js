/**
 * ClaudeProvider - Anthropic Claude AI provider implementation
 * 
 * Supports both artifact environment (window.claude) and API access.
 * Optimized for executive conversations and cybersecurity analysis.
 */

import { BaseProvider } from './BaseProvider.js';

export class ClaudeProvider extends BaseProvider {
  constructor(config = {}) {
    super(config);
    this.apiKey = config.apiKey || import.meta.env?.VITE_CLAUDE_KEY;
    this.apiUrl = 'https://api.anthropic.com/v1/messages';
    this.model = config.model || 'claude-3-haiku-20240307'; // Fast, affordable model for demos
    this.maxTokens = config.maxTokens || 1024;
    this.claudeArtifact = null;
  }

  async initialize() {
    // Check for Claude artifact environment
    if (typeof window !== 'undefined' && window.claude?.complete) {
      this.claudeArtifact = window.claude;
      console.log('✅ Claude artifact environment detected');
      return;
    }

    // Validate API key if using API mode
    if (!this.apiKey && !this.claudeArtifact) {
      console.warn('⚠️ No Claude API key or artifact environment found');
    }
  }

  isAvailable() {
    return !!(this.claudeArtifact || this.apiKey);
  }

  getCapabilities() {
    return {
      compromiseAnalysis: true,
      executiveInsights: true,
      threatContext: true,
      scenarioSimulation: true,
      realtimeAnalysis: true
    };
  }

  async complete(request) {
    this.validateRequest(request);

    // Use artifact environment if available
    if (this.claudeArtifact) {
      return this.completeWithArtifact(request);
    }

    // Use API if key is available
    if (this.apiKey) {
      return this.completeWithAPI(request);
    }

    throw new Error('Claude provider not properly configured');
  }

  /**
   * Complete request using Claude artifact environment
   */
  async completeWithArtifact(request) {
    try {
      const prompt = this.buildPrompt(request);
      const response = await this.claudeArtifact.complete(prompt);
      
      return this.parseResponse(response, request.type);
    } catch (error) {
      return this.formatError(error, 'artifact_completion');
    }
  }

  /**
   * Complete request using Claude API
   */
  async completeWithAPI(request) {
    try {
      const prompt = this.buildPrompt(request);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: this.maxTokens,
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text || '';
      
      return this.parseResponse(content, request.type);
    } catch (error) {
      return this.formatError(error, 'api_completion');
    }
  }

  /**
   * Build prompt based on request type
   */
  buildPrompt(request) {
    const { type, data } = request;

    switch (type) {
      case 'compromise_analysis':
        return this.buildCompromiseAnalysisPrompt(data);
      
      case 'executive_insights':
        return this.buildExecutiveInsightsPrompt(data);
      
      case 'threat_context':
        return this.buildThreatContextPrompt(data);
      
      case 'scenario_simulation':
        return this.buildScenarioPrompt(data);
      
      default:
        return this.buildGenericPrompt(type, data);
    }
  }

  /**
   * Build compromise analysis prompt
   */
  buildCompromiseAnalysisPrompt(data) {
    return `You are a cybersecurity expert analyzing organizational compromise indicators for the Digital Immunity Index (DII) framework.

Based on the following assessment data, analyze the likelihood that this organization has already been compromised:

Business Model: ${data.businessModel}
Assessment Scores: ${JSON.stringify(data.scores, null, 2)}
Dimensions: ${JSON.stringify(data.dimensions, null, 2)}

Provide a JSON response with:
1. compromiseScore (0-1): Probability the organization is currently compromised
2. confidence (low/medium/high): Confidence in this assessment
3. indicators: Array of specific compromise indicators found
4. criticalGaps: Top 3 security gaps that suggest compromise
5. recommendation: Single most important action to take

Focus on behavioral patterns and operational indicators, not just technical controls.

Response format:
{
  "compromiseScore": 0.75,
  "confidence": "high",
  "indicators": ["No incident response drills", "Unknown data flows", "Manual security processes"],
  "criticalGaps": ["Visibility", "Response Time", "Access Control"],
  "recommendation": "Implement 24/7 SOC monitoring immediately"
}`;
  }

  /**
   * Build executive insights prompt
   */
  buildExecutiveInsightsPrompt(data) {
    return `You are preparing executive insights for a C-level presentation on Digital Immunity.

Assessment data:
Business Model: ${data.businessModel}
DII Score: ${data.scores?.diiScore || 'Calculating...'}
Key Weaknesses: ${JSON.stringify(data.dimensions, null, 2)}

Generate 3 executive-ready insights that:
1. Connect to business impact (revenue, operations, reputation)
2. Use industry comparisons
3. Provide actionable next steps

Format as JSON:
{
  "executiveSummary": "One sentence that a CEO would remember",
  "insights": [
    {
      "title": "Clear, impactful title",
      "impact": "Business impact in dollars or percentage",
      "comparison": "How they compare to peers",
      "action": "What to do about it"
    }
  ],
  "urgency": "immediate/high/medium/low"
}`;
  }

  /**
   * Build threat context prompt
   */
  buildThreatContextPrompt(data) {
    return `Provide current threat context for:
Business Model: ${data.businessModel}
Region: ${data.region}

Include:
1. Top 3 active threat actors targeting this sector
2. Recent incidents in similar organizations
3. Emerging attack vectors specific to this business model

Format as JSON with specific, actionable intelligence.`;
  }

  /**
   * Build scenario simulation prompt
   */
  buildScenarioPrompt(data) {
    return `Simulate the impact of the following changes on Digital Immunity:

Current state: ${JSON.stringify(data, null, 2)}
Proposed changes: ${JSON.stringify(data.changes, null, 2)}

Calculate:
1. New DII score
2. Improvement percentage
3. ROI timeline
4. Risk reduction

Be specific about operational improvements.`;
  }

  /**
   * Build generic prompt for other types
   */
  buildGenericPrompt(type, data) {
    return `Analyze the following data for ${type}:
${JSON.stringify(data, null, 2)}

Provide insights relevant to Digital Immunity and operational resilience.`;
  }

  /**
   * Parse Claude's response based on request type
   */
  parseResponse(response, type) {
    try {
      // Try to parse as JSON first
      if (response.trim().startsWith('{')) {
        return JSON.parse(response);
      }

      // Otherwise, structure the text response
      return this.structureTextResponse(response, type);
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      return {
        success: true,
        content: response,
        structured: false
      };
    }
  }

  /**
   * Structure text responses into expected format
   */
  structureTextResponse(text, type) {
    // This is a simplified parser - enhance based on actual Claude responses
    switch (type) {
      case 'compromise_analysis':
        return {
          compromiseScore: 0.65, // Extract from text in real implementation
          confidence: 'medium',
          indicators: ['Extracted from text'],
          criticalGaps: ['Parse from response'],
          recommendation: text.split('\n')[0] || 'Review security posture'
        };

      case 'executive_insights':
        return {
          executiveSummary: text.split('\n')[0] || 'Digital immunity requires attention',
          insights: [{
            title: 'Key Insight',
            impact: 'Significant',
            comparison: 'Below industry average',
            action: 'Implement improvements'
          }],
          urgency: 'high'
        };

      default:
        return {
          success: true,
          content: text,
          type
        };
    }
  }

  async getInsight(data, type) {
    // Delegate to complete with appropriate type
    return this.complete({
      type: type,
      data: data
    });
  }
}