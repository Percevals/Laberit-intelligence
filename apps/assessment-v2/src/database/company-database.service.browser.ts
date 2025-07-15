/**
 * Company Database Service - Browser Safe Version
 * Mock implementation for browser environments
 * Maintains exact same API as original CompanyDatabaseService
 */

import type { 
  Company, 
  Assessment, 
  DimensionScore, 
  DIIModelProfile,
  BenchmarkData,
  BusinessModelClassificationInput,
  BusinessModelClassificationResult,
  DIICalculationInput,
  DIICalculationResult,
  CompanyDatabaseService as ICompanyDatabaseService,
  DIIBusinessModel,
  DiiDimension
} from './types';

export class CompanyDatabaseService implements ICompanyDatabaseService {
  private mockCompanies: Company[] = [];
  private mockAssessments: Assessment[] = [];
  
  constructor() {
    console.log('🌐 Using browser-safe mock database service');
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add some default mock companies
    this.mockCompanies = [
      {
        id: '1',
        name: 'Demo Company',
        industry_traditional: 'Technology',
        dii_business_model: 'SOFTWARE_CRITICO',
        confidence_score: 0.9,
        classification_reasoning: 'SaaS platform requiring 24/7 availability',
        region: 'LATAM',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
  }

  // ===================================================================
  // COMPANY MANAGEMENT
  // ===================================================================

  async createCompany(data: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    const company: Company = {
      ...data,
      id: this.generateUUID(),
      created_at: new Date(),
      updated_at: new Date()
    };
    
    this.mockCompanies.push(company);
    return company;
  }

  async getCompany(id: string): Promise<Company | null> {
    return this.mockCompanies.find(c => c.id === id) || null;
  }

  async getCompanyByDomain(domain: string): Promise<Company | null> {
    return this.mockCompanies.find(c => c.domain === domain) || null;
  }

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    const index = this.mockCompanies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    this.mockCompanies[index] = {
      ...this.mockCompanies[index],
      ...data,
      updated_at: new Date()
    };
    
    return this.mockCompanies[index];
  }

  async searchCompanies(query: string): Promise<Company[]> {
    const lowerQuery = query.toLowerCase();
    return this.mockCompanies.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      (c.domain && c.domain.toLowerCase().includes(lowerQuery))
    );
  }

  // ===================================================================
  // BUSINESS MODEL CLASSIFICATION
  // ===================================================================

  async classifyBusinessModel(input: BusinessModelClassificationInput): Promise<BusinessModelClassificationResult> {
    // Simple pattern matching for demo
    const patterns = [
      { pattern: /banking|banco|bank/i, model: 'SERVICIOS_FINANCIEROS' as DIIBusinessModel },
      { pattern: /software|saas|cloud/i, model: 'SOFTWARE_CRITICO' as DIIBusinessModel },
      { pattern: /retail|comercio|store/i, model: 'COMERCIO_HIBRIDO' as DIIBusinessModel },
      { pattern: /health|salud|hospital/i, model: 'INFORMACION_REGULADA' as DIIBusinessModel }
    ];

    for (const { pattern, model } of patterns) {
      if (pattern.test(input.industry_traditional) || pattern.test(input.company_name)) {
        return {
          dii_business_model: model,
          confidence_score: 0.85,
          reasoning: 'Pattern matched from industry/name',
          method: 'pattern_matching'
        };
      }
    }

    return {
      dii_business_model: 'COMERCIO_HIBRIDO',
      confidence_score: 0.6,
      reasoning: 'Default classification',
      method: 'default'
    };
  }

  async updateBusinessModelClassification(companyId: string, classification: BusinessModelClassificationResult): Promise<void> {
    await this.updateCompany(companyId, {
      dii_business_model: classification.dii_business_model,
      confidence_score: classification.confidence_score,
      classification_reasoning: classification.reasoning
    });
  }

  // ===================================================================
  // ASSESSMENT MANAGEMENT
  // ===================================================================

  async createAssessment(data: Omit<Assessment, 'id' | 'created_at'>): Promise<Assessment> {
    const assessment: Assessment = {
      ...data,
      id: this.generateUUID(),
      created_at: new Date()
    };
    
    this.mockAssessments.push(assessment);
    return assessment;
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    return this.mockAssessments.find(a => a.id === id) || null;
  }

  async getCompanyAssessments(companyId: string): Promise<Assessment[]> {
    return this.mockAssessments.filter(a => a.company_id === companyId);
  }

  // ===================================================================
  // DIMENSION SCORES
  // ===================================================================

  async saveDimensionScores(assessmentId: string, scores: DIICalculationInput): Promise<DimensionScore[]> {
    // Mock implementation
    return Object.entries(scores).map(([dimension, scoreData]) => ({
      id: this.generateUUID(),
      assessment_id: assessmentId,
      dimension: dimension as DiiDimension,
      raw_value: scoreData.value,
      confidence_score: scoreData.confidence,
      data_source: scoreData.data_source,
      validation_status: 'valid' as const,
      supporting_evidence: scoreData.evidence,
      created_at: new Date()
    }));
  }

  async getAssessmentDimensions(assessmentId: string): Promise<DimensionScore[]> {
    // Return empty array in mock
    return [];
  }

  // ===================================================================
  // DII CALCULATION
  // ===================================================================

  async calculateDII(companyId: string, input: DIICalculationInput): Promise<DIICalculationResult> {
    const { TRD, AER, HFP, BRI, RRG } = input;
    const dii_raw_score = (TRD.value * AER.value) / (HFP.value * BRI.value * RRG.value);
    const dii_final_score = Math.min(dii_raw_score / 10, 999.99999);
    const confidence_level = Math.min(
      (TRD.confidence + AER.confidence + HFP.confidence + BRI.confidence + RRG.confidence) / 5 * 100,
      100
    );

    return {
      dii_raw_score,
      dii_final_score,
      confidence_level,
      validation_errors: [],
      recommendations: []
    };
  }

  async validateDimensionScores(input: DIICalculationInput): Promise<Array<{
    dimension?: DiiDimension;
    rule: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
  }>> {
    return [];
  }

  async getBenchmarkData(businessModel: DIIBusinessModel, region?: string): Promise<BenchmarkData | null> {
    return null;
  }

  async updateBenchmarks(): Promise<void> {
    console.log('Benchmark update not available in browser');
  }

  // ===================================================================
  // UTILITIES
  // ===================================================================

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Factory function
export function createCompanyDatabaseService(): CompanyDatabaseService {
  return new CompanyDatabaseService();
}