import { BaseAIProvider } from '../base-provider';
import type { CompanyInfo } from '../types';

interface MistralResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class MistralProvider extends BaseAIProvider {
  constructor(apiKey: string) {
    super({
      id: 'mistral',
      name: 'Mistral AI',
      apiKey,
      endpoint: 'https://api.mistral.ai/v1/chat/completions',
      model: 'mistral-small-latest', // Free tier model
      maxTokens: 1000,
      temperature: 0.3,
      timeout: 30000,
      rateLimit: {
        requests: 5,
        window: 60 // 5 requests per minute for free tier
      }
    });
  }

  async searchCompany(query: string): Promise<CompanyInfo[]> {
    const prompt = `Find information about the company "${query}". Return ONLY a JSON array with this exact structure:
[{
  "name": "Company Name",
  "employees": 1000,
  "revenue": 50000000,
  "headquarters": "City, Country",
  "country": "Country",
  "industry": "Industry Sector",
  "description": "Brief description",
  "website": "https://company.com",
  "yearFounded": 2010,
  "dataSource": "ai",
  "confidence": 0.85
}]

If you cannot find the company, return an empty array [].
Ensure all numbers are actual numbers, not strings.`;

    const response = await this.makeRequest(async () => {
      return await this.callMistralAPI({
        model: this.config.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      });
    });

    if (!response.success || !response.data) {
      return [];
    }

    try {
      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        return [];
      }

      // Extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const companies = JSON.parse(jsonMatch[0]);
      return companies.map((company: any) => this.validateCompanyInfo(company));
    } catch (error) {
      console.error('Mistral company search parsing error:', error);
      return [];
    }
  }

  async enhanceCompanyData(partial: Partial<CompanyInfo>): Promise<CompanyInfo> {
    const prompt = `Enhance this company data with missing information. Return ONLY a JSON object:
Current data: ${JSON.stringify(partial)}

Fill in missing fields and return this exact structure:
{
  "name": "${partial.name || 'Unknown'}",
  "employees": number_of_employees,
  "revenue": annual_revenue_in_usd,
  "headquarters": "City, Country",
  "country": "Country",
  "industry": "Industry Sector",
  "description": "Brief description",
  "website": "https://company.com",
  "yearFounded": year,
  "dataSource": "ai",
  "confidence": 0.8
}

Use reasonable estimates for missing data based on company size and industry.`;

    const response = await this.makeRequest(async () => {
      return await this.callMistralAPI({
        model: this.config.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature
      });
    });

    if (!response.success || !response.data) {
      // Return original data with manual source
      return this.validateCompanyInfo({
        ...partial,
        name: partial.name || 'Unknown Company',
        dataSource: 'manual',
        confidence: 0.5
      });
    }

    try {
      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content');
      }

      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found');
      }

      const enhanced = JSON.parse(jsonMatch[0]);
      return this.validateCompanyInfo(enhanced);
    } catch (error) {
      console.error('Mistral enhancement parsing error:', error);
      // Return original data with manual source
      return this.validateCompanyInfo({
        ...partial,
        name: partial.name || 'Unknown Company',
        dataSource: 'manual',
        confidence: 0.5
      });
    }
  }

  async suggestBusinessModel(company: CompanyInfo) {
    const prompt = `Based on this company information, suggest the most appropriate business model:
Company: ${company.name}
Industry: ${company.industry}
Employees: ${company.employees}
Revenue: $${company.revenue ? (company.revenue / 1000000).toFixed(1) : 'unknown'}M

Choose from these 8 business models:
1. SUBSCRIPTION_BASED - Recurring revenue (SaaS, streaming)
2. TRANSACTION_BASED - Per-transaction fees (payments, marketplaces)
3. ASSET_LIGHT - Minimal physical assets (consulting, software)
4. ASSET_HEAVY - Significant infrastructure (manufacturing, logistics)
5. DATA_DRIVEN - Data as primary value (analytics, advertising)
6. PLATFORM_ECOSYSTEM - Multi-sided platforms (app stores, marketplaces)
7. DIRECT_TO_CONSUMER - Direct sales to end users
8. B2B_ENTERPRISE - Complex enterprise sales

Return ONLY this JSON structure:
{
  "model": "BUSINESS_MODEL_NAME",
  "confidence": 0.85,
  "reasoning": "Brief explanation in Spanish"
}`;

    const response = await this.makeRequest(async () => {
      return await this.callMistralAPI({
        model: this.config.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      });
    });

    if (!response.success || !response.data) {
      return {
        model: 'ASSET_LIGHT',
        confidence: 0.5,
        reasoning: 'Sugerencia por defecto debido a error en el servicio'
      };
    }

    try {
      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content');
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Mistral business model suggestion parsing error:', error);
      return {
        model: 'ASSET_LIGHT',
        confidence: 0.5,
        reasoning: 'Sugerencia por defecto basada en datos limitados'
      };
    }
  }

  private async callMistralAPI(payload: any): Promise<MistralResponse> {
    if (!this.config.apiKey) {
      throw new Error('Mistral API key not configured');
    }

    const response = await fetch(this.config.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mistral API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Simple health check
      const response = await fetch('https://api.mistral.ai/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async checkRateLimit(): Promise<{ available: boolean; resetIn?: number }> {
    // Use the base class implementation
    return super.checkRateLimit();
  }

  estimateCost(): number {
    // Mistral free tier - no cost
    return 0;
  }
}