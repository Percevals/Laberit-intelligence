/**
 * OpenAI Provider Implementation
 * Uses GPT models for company intelligence
 */

import { BaseAIProvider } from '../base-provider';
import type { CompanyInfo, AIProviderConfig } from '../types';

export class OpenAIProvider extends BaseAIProvider {
  constructor(config?: Partial<AIProviderConfig>) {
    super({
      id: 'openai',
      name: 'OpenAI',
      model: 'gpt-3.5-turbo',
      maxTokens: 500,
      temperature: 0.3,
      timeout: 30000,
      rateLimit: {
        requests: 50,
        window: 60 // 50 requests per minute
      },
      ...config
    });
  }

  async searchCompany(query: string): Promise<CompanyInfo[]> {
    const response = await this.makeRequest(async () => {
      const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: `You are a company information specialist. Provide accurate, current company data.
                Focus on: employees, revenue, headquarters, industry, and brief description.
                If unsure about specific numbers, provide ranges (e.g., "1000-5000 employees").
                Return data in JSON format.`
            },
            {
              role: 'user',
              content: `Find information about the company: "${query}"
                
                Return a JSON array with up to 3 matching companies:
                {
                  "companies": [{
                    "name": "Company Name",
                    "legalName": "Legal Entity Name",
                    "employees": number or null,
                    "employeeRange": "range if exact unknown",
                    "revenue": number in USD or null,
                    "revenueRange": "range if exact unknown",
                    "headquarters": "City, Country",
                    "country": "Country",
                    "industry": "Primary Industry",
                    "description": "Brief description",
                    "website": "https://...",
                    "yearFounded": number,
                    "techStack": ["AWS", "Python", etc],
                    "publicCompany": boolean
                  }]
                }`
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        })
      });

      if (!apiResponse.ok) {
        throw new Error(`OpenAI API error: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      // Parse JSON response
      const parsed = JSON.parse(content);
      const companies = parsed.companies || [];
      
      // Validate and enhance each company
      return companies.map((company: any) => 
        this.validateCompanyInfo({
          ...company,
          dataSource: 'ai',
          confidence: 0.85
        })
      );
    });

    if (!response.success) {
      console.error('OpenAI search failed:', response.error);
      return [];
    }

    return response.data || [];
  }

  async enhanceCompanyData(partial: Partial<CompanyInfo>): Promise<CompanyInfo> {
    const response = await this.makeRequest(async () => {
      const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'You are a company information specialist. Enhance partial company data with additional accurate information.'
            },
            {
              role: 'user',
              content: `Enhance this company information:
                ${JSON.stringify(partial, null, 2)}
                
                Add missing fields like:
                - Employee count or range
                - Annual revenue or range
                - Full headquarters location
                - Industry classification
                - Brief description
                - Technology stack (if tech company)
                - Recent news or developments
                
                Return enhanced data in the same JSON format.`
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        })
      });

      if (!apiResponse.ok) {
        throw new Error(`OpenAI API error: ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      const enhanced = JSON.parse(content);
      return this.validateCompanyInfo({
        ...partial,
        ...enhanced,
        dataSource: partial.dataSource === 'manual' ? 'mixed' : 'ai',
        confidence: 0.8
      });
    });

    if (!response.success) {
      console.error('OpenAI enhance failed:', response.error);
      // Return original data if enhancement fails
      return this.validateCompanyInfo(partial);
    }

    return response.data!;
  }

  estimateCost(operation: 'search' | 'enhance'): number {
    // GPT-3.5-turbo pricing (approximate)
    const costs = {
      search: 0.002, // ~1000 tokens total
      enhance: 0.001 // ~500 tokens total
    };
    
    // GPT-4 would be ~10x more expensive
    if (this.config.model?.includes('gpt-4')) {
      return costs[operation] * 10;
    }
    
    return costs[operation];
  }

  protected handleError(error: any): any {
    // OpenAI-specific error handling
    if (error.message?.includes('401')) {
      return {
        success: false,
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid OpenAI API key',
          retryable: false
        }
      };
    }
    
    if (error.message?.includes('429')) {
      return {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: 'OpenAI rate limit exceeded',
          retryable: true
        }
      };
    }
    
    return super.handleError(error);
  }
}