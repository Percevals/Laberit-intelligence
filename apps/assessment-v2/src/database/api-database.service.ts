/**
 * API-based Database Service
 * Implements the same interface as mock service but uses real PostgreSQL backend
 */

import type { 
  Company, 
  Assessment, 
  BusinessModelClassificationInput,
  BusinessModelClassificationResult,
  CompanyDatabaseService as ICompanyDatabaseService,
} from './types';
import { companyAPI } from '@/services/api/company.service';
import { classifyBusinessModel } from '@/core/business-model/enhanced-classifier';

export class APIDatabaseService implements ICompanyDatabaseService {
  constructor() {
    console.log('🌐 Using API database service (PostgreSQL backend)');
  }

  async createCompany(data: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    return companyAPI.create(data);
  }

  async getCompany(id: string): Promise<Company | null> {
    try {
      return await companyAPI.getById(id);
    } catch (error: any) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  async getCompanyByDomain(domain: string): Promise<Company | null> {
    const companies = await companyAPI.getAll({ search: domain });
    return companies.find(c => c.domain === domain) || null;
  }

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    return companyAPI.update(id, data);
  }

  async searchCompanies(query: string): Promise<Company[]> {
    return companyAPI.getAll({ search: query });
  }

  async createAssessment(data: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>): Promise<Assessment> {
    // TODO: Implement assessment endpoints
    throw new Error('Assessment endpoints not yet implemented');
  }

  async updateAssessment(id: string, data: Partial<Assessment>): Promise<Assessment> {
    // TODO: Implement assessment endpoints
    throw new Error('Assessment endpoints not yet implemented');
  }

  async getCompanyAssessments(companyId: string): Promise<Assessment[]> {
    // TODO: Implement assessment endpoints
    return [];
  }

  async classifyBusinessModel(input: BusinessModelClassificationInput): Promise<BusinessModelClassificationResult> {
    // Use frontend classification logic
    const classification = classifyBusinessModel({
      companyName: input.company_name,
      industry: input.industry_traditional,
      description: input.company_description,
      employees: input.employee_count,
      revenue: input.annual_revenue,
      headquarters: input.headquarters,
      website: input.domain
    });

    return {
      dii_business_model: classification.model,
      confidence_score: classification.confidence,
      reasoning: classification.reasoning || 'Classified based on industry and company characteristics'
    };
  }

  async updateBusinessModelClassification(
    companyId: string, 
    businessModel: string, 
    confidence: number, 
    reasoning: string
  ): Promise<void> {
    await companyAPI.update(companyId, {
      dii_business_model: businessModel as any,
      confidence_score: confidence,
      classification_reasoning: reasoning
    });
  }

  async isCompanyDataStale(companyId: string): Promise<boolean> {
    const company = await this.getCompany(companyId);
    if (!company || !company.last_verified) return true;
    
    const daysSinceVerified = Math.floor(
      (Date.now() - new Date(company.last_verified).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysSinceVerified > company.data_freshness_days;
  }

  async updateCompanyVerification(
    companyId: string, 
    source: 'ai_search' | 'manual' | 'import'
  ): Promise<void> {
    await companyAPI.verify(companyId, source);
  }

  async getCompaniesNeedingVerification(limit: number = 10): Promise<Company[]> {
    return companyAPI.getStale(limit);
  }
}

// Factory function
export function createAPIDatabaseService(): APIDatabaseService {
  return new APIDatabaseService();
}