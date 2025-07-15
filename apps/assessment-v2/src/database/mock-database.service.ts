/**
 * Mock Database Service for Browser Environments
 * Simple in-memory implementation that works without Node.js dependencies
 */

import type { 
  Company, 
  Assessment, 
  DimensionScore, 
  // DIIModelProfile,
  BenchmarkData,
  BusinessModelClassificationInput,
  BusinessModelClassificationResult,
  DIICalculationInput,
  DIICalculationResult,
  CompanyDatabaseService as ICompanyDatabaseService,
  DIIBusinessModel,
  DiiDimension
} from './types';

export class MockDatabaseService implements ICompanyDatabaseService {
  private companies: Company[] = [];
  private assessments: Assessment[] = [];
  
  constructor() {
    console.log('🌐 Using mock database service (browser mode)');
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add some default mock companies
    this.companies = [
      {
        id: '1',
        name: 'Demo Technology Corp',
        industry_traditional: 'Technology',
        dii_business_model: 'SOFTWARE_CRITICO',
        confidence_score: 0.9,
        classification_reasoning: 'SaaS platform requiring 24/7 availability',
        region: 'LATAM',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '2',
        name: 'Digital Banking Solutions',
        industry_traditional: 'Financial Services',
        dii_business_model: 'SERVICIOS_FINANCIEROS',
        confidence_score: 0.95,
        classification_reasoning: 'Digital banking platform with real-time transactions',
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
    
    this.companies.push(company);
    return company;
  }

  async getCompany(id: string): Promise<Company | null> {
    return this.companies.find(c => c.id === id) || null;
  }

  async getCompanyByDomain(domain: string): Promise<Company | null> {
    return this.companies.find(c => c.domain === domain) || null;
  }

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    this.companies[index] = {
      ...this.companies[index],
      ...data,
      id: this.companies[index].id,
      updated_at: new Date()
    };
    
    return this.companies[index];
  }

  async searchCompanies(query: string): Promise<Company[]> {
    const lowerQuery = query.toLowerCase();
    return this.companies.filter(c => 
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
      { pattern: /health|salud|hospital/i, model: 'INFORMACION_REGULADA' as DIIBusinessModel },
      { pattern: /logistics|shipping|delivery/i, model: 'CADENA_SUMINISTRO' as DIIBusinessModel },
      { pattern: /energy|oil|mining|manufacturing/i, model: 'INFRAESTRUCTURA_HEREDADA' as DIIBusinessModel },
      { pattern: /marketplace|platform|ecosystem/i, model: 'ECOSISTEMA_DIGITAL' as DIIBusinessModel },
      { pattern: /analytics|data|research/i, model: 'SERVICIOS_DATOS' as DIIBusinessModel }
    ];

    for (const { pattern, model } of patterns) {
      if (pattern.test(input.industry_traditional) || pattern.test(input.company_name)) {
        return {
          dii_business_model: model,
          confidence_score: 0.85,
          reasoning: 'Pattern matched from industry/name',
          method: 'industry_pattern'
        };
      }
    }

    return {
      dii_business_model: 'COMERCIO_HIBRIDO',
      confidence_score: 0.6,
      reasoning: 'Default classification for unmatched patterns',
      method: 'default_fallback'
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
    
    this.assessments.push(assessment);
    return assessment;
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    return this.assessments.find(a => a.id === id) || null;
  }

  async getCompanyAssessments(companyId: string): Promise<Assessment[]> {
    return this.assessments.filter(a => a.company_id === companyId);
  }

  // ===================================================================
  // DIMENSION SCORES
  // ===================================================================

  async saveDimensionScores(_assessmentId: string, scores: DIICalculationInput): Promise<DimensionScore[]> {
    // Mock implementation - return dimension scores based on input
    return Object.entries(scores).map(([dimension, scoreData]) => ({
      id: this.generateUUID(),
      assessment_id: _assessmentId,
      dimension: dimension as DiiDimension,
      raw_value: scoreData.value,
      confidence_score: scoreData.confidence,
      data_source: scoreData.data_source,
      validation_status: 'valid' as const,
      supporting_evidence: scoreData.evidence,
      created_at: new Date()
    }));
  }

  async getAssessmentDimensions(_assessmentId: string): Promise<DimensionScore[]> {
    // Return empty array in mock
    return [];
  }

  // ===================================================================
  // DII CALCULATION
  // ===================================================================

  async calculateDII(_companyId: string, input: DIICalculationInput): Promise<DIICalculationResult> {
    const { TRD, AER, HFP, BRI, RRG } = input;
    const dii_raw_score = (TRD.value * AER.value) / (HFP.value * BRI.value * RRG.value);
    const dii_final_score = Math.min(dii_raw_score / 10, 99.999);
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

  async validateDimensionScores(_input: DIICalculationInput): Promise<Array<{
    dimension?: DiiDimension;
    rule: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
  }>> {
    return [];
  }

  async getBenchmarkData(_businessModel: DIIBusinessModel, _region?: string): Promise<BenchmarkData | null> {
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
export function createMockDatabaseService(): MockDatabaseService {
  return new MockDatabaseService();
}