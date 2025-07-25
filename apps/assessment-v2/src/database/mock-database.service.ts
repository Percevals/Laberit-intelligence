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
import { classifyBusinessModel, type ClassificationInput } from '@/core/business-model/enhanced-classifier';

export class MockDatabaseService implements ICompanyDatabaseService {
  private companies: Company[] = [];
  private assessments: Assessment[] = [];
  private readonly STORAGE_KEY = 'dii_mock_database';
  
  constructor() {
    console.log('🌐 Using mock database service (browser mode)');
    this.loadFromStorage();
    if (this.companies.length === 0) {
      this.initializeMockData();
      this.saveToStorage();
    }
  }

  private initializeMockData() {
    // Add some default mock companies - including lesser-known ones
    this.companies = [
      {
        id: '1',
        name: 'Demo Technology Corp',
        legal_name: 'Demo Technology Corporation S.A.',
        domain: 'demotechcorp.com',
        industry_traditional: 'Technology',
        dii_business_model: 'SOFTWARE_CRITICO',
        confidence_score: 0.9,
        classification_reasoning: 'SaaS platform requiring 24/7 availability',
        headquarters: 'Buenos Aires',
        country: 'Argentina',
        region: 'LATAM',
        employees: 500,
        revenue: 50000000,
        last_verified: new Date(),
        verification_source: 'manual',
        data_freshness_days: 90,
        is_prospect: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '2',
        name: 'Digital Banking Solutions',
        legal_name: 'Digital Banking Solutions Ltd.',
        domain: 'digitalbanking.io',
        industry_traditional: 'Financial Services',
        dii_business_model: 'SERVICIOS_FINANCIEROS',
        confidence_score: 0.95,
        classification_reasoning: 'Digital banking platform with real-time transactions',
        headquarters: 'São Paulo',
        country: 'Brazil',
        region: 'LATAM',
        employees: 1200,
        revenue: 120000000,
        last_verified: new Date(),
        verification_source: 'manual',
        data_freshness_days: 90,
        is_prospect: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '3',
        name: 'TechnoLogix Solutions',
        legal_name: 'TechnoLogix Solutions S.A.S.',
        domain: 'technologix.co',
        industry_traditional: 'Software Development',
        dii_business_model: 'SOFTWARE_CRITICO',
        confidence_score: 0.85,
        classification_reasoning: 'B2B software platform for logistics',
        headquarters: 'Bogotá',
        country: 'Colombia',
        region: 'LATAM',
        employees: 150,
        revenue: 12000000,
        last_verified: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago (stale)
        verification_source: 'manual',
        data_freshness_days: 90,
        is_prospect: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '4',
        name: 'MediCloud LATAM',
        legal_name: 'MediCloud América Latina S.A.',
        domain: 'medicloud-latam.com',
        industry_traditional: 'Healthcare Technology',
        dii_business_model: 'INFORMACION_REGULADA',
        confidence_score: 0.92,
        classification_reasoning: 'Healthcare data platform with strict regulatory requirements',
        headquarters: 'Mexico City',
        country: 'Mexico',
        region: 'LATAM',
        employees: 300,
        revenue: 25000000,
        last_verified: new Date(),
        verification_source: 'manual',
        data_freshness_days: 90,
        is_prospect: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '5',
        name: 'AgriTech Innovations',
        legal_name: 'AgriTech Innovations SpA',
        domain: 'agritech-innovations.cl',
        industry_traditional: 'Agriculture Technology',
        dii_business_model: 'SERVICIOS_DATOS',
        confidence_score: 0.88,
        classification_reasoning: 'Agricultural data analytics and IoT platform',
        headquarters: 'Santiago',
        country: 'Chile',
        region: 'LATAM',
        employees: 80,
        revenue: 8000000,
        last_verified: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // 200 days ago (critical)
        verification_source: 'manual',
        data_freshness_days: 90,
        is_prospect: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '6',
        name: 'QuickDelivery Express',
        legal_name: 'QuickDelivery Express S.A.C.',
        domain: 'quickdelivery.pe',
        industry_traditional: 'Logistics',
        dii_business_model: 'CADENA_SUMINISTRO',
        confidence_score: 0.87,
        classification_reasoning: 'Last-mile delivery platform with real-time tracking',
        headquarters: 'Lima',
        country: 'Peru',
        region: 'LATAM',
        employees: 2000,
        revenue: 45000000,
        last_verified: new Date(),
        verification_source: 'manual',
        data_freshness_days: 90,
        is_prospect: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '7',
        name: 'CyberDefend Uruguay',
        legal_name: 'CyberDefend Uruguay S.R.L.',
        domain: 'cyberdefend.uy',
        industry_traditional: 'Cybersecurity',
        dii_business_model: 'SOFTWARE_CRITICO',
        confidence_score: 0.91,
        classification_reasoning: 'Security software and monitoring services',
        headquarters: 'Montevideo',
        country: 'Uruguay',
        region: 'LATAM',
        employees: 45,
        revenue: 5000000,
        last_verified: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago (fresh)
        verification_source: 'ai_search',
        data_freshness_days: 90,
        is_prospect: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '8',
        name: 'EcoMarketplace',
        domain: 'ecomarketplace.com.ar',
        industry_traditional: 'E-commerce',
        dii_business_model: 'ECOSISTEMA_DIGITAL',
        confidence_score: 0.86,
        classification_reasoning: 'Sustainable products marketplace platform',
        headquarters: 'Córdoba',
        country: 'Argentina',
        region: 'LATAM',
        employees: 120,
        revenue: 15000000,
        last_verified: null, // Never verified (critical)
        verification_source: null,
        data_freshness_days: 90,
        is_prospect: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
  }

  // ===================================================================
  // COMPANY MANAGEMENT
  // ===================================================================

  async createCompany(data: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    // Validate required fields
    if (!data.name) {
      throw new Error('Company name is required');
    }
    if (!data.dii_business_model) {
      throw new Error('Business model is required');
    }
    
    const company: Company = {
      ...data,
      id: this.generateUUID(),
      // Set default values for data management fields if not provided
      legal_name: data.legal_name || data.name,
      country: data.country || 'Unknown',
      region: data.region || 'LATAM',
      confidence_score: data.confidence_score ?? 0.5,
      data_freshness_days: data.data_freshness_days ?? 90,
      is_prospect: data.is_prospect ?? false,
      last_verified: data.last_verified ?? new Date(),
      verification_source: data.verification_source ?? 'manual',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    this.companies.push(company);
    this.saveToStorage();
    console.log('Created company:', company.name, 'with ID:', company.id);
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
    
    this.saveToStorage();
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
    // Use the enhanced classifier
    const classificationInput: ClassificationInput = {
      name: input.company_name,
      industry: input.industry_traditional,
      // Add any additional available data
      description: input.company_description,
      employees: input.employee_count,
      revenue: input.annual_revenue,
      domain: input.domain,
      hasPhysicalStores: input.has_physical_stores,
      hasEcommerce: input.has_ecommerce,
      isB2B: input.is_b2b,
      isSaaS: input.is_saas,
      isRegulated: input.is_regulated,
      operatesCriticalInfrastructure: input.operates_critical_infrastructure
    };

    const result = classifyBusinessModel(classificationInput);

    // Convert to the expected format
    return {
      dii_business_model: result.model,
      confidence_score: result.confidence,
      reasoning: result.reasoning,
      method: result.confidence > 0.8 ? 'enhanced_classification' : 'signal_analysis',
      // Include additional metadata
      signals_matched: result.signals.matched,
      alternative_models: result.alternativeModels,
      risk_profile: result.riskProfile
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
  // DATA FRESHNESS MANAGEMENT
  // ===================================================================

  /**
   * Check if company data is stale based on data_freshness_days
   */
  async isCompanyDataStale(companyId: string): Promise<boolean> {
    const company = await this.getCompany(companyId);
    if (!company || !company.last_verified) {
      return true;
    }

    const daysSinceVerified = Math.floor(
      (Date.now() - company.last_verified.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceVerified > company.data_freshness_days;
  }

  /**
   * Update company verification timestamp
   */
  async updateCompanyVerification(
    companyId: string, 
    source: 'ai_search' | 'manual' | 'import'
  ): Promise<void> {
    await this.updateCompany(companyId, {
      last_verified: new Date(),
      verification_source: source
    });
  }

  /**
   * Get companies that need verification
   */
  async getCompaniesNeedingVerification(limit: number = 10): Promise<Company[]> {
    const staleCompanies: Company[] = [];
    
    for (const company of this.companies) {
      if (await this.isCompanyDataStale(company.id)) {
        staleCompanies.push(company);
        if (staleCompanies.length >= limit) break;
      }
    }
    
    return staleCompanies;
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

  // ===================================================================
  // STORAGE PERSISTENCE
  // ===================================================================

  private saveToStorage(): void {
    try {
      const data = {
        companies: this.companies,
        assessments: this.assessments,
        version: 1
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      console.log('💾 Saved to localStorage:', this.companies.length, 'companies');
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Convert date strings back to Date objects
        this.companies = (data.companies || []).map((c: any) => ({
          ...c,
          created_at: new Date(c.created_at),
          updated_at: new Date(c.updated_at),
          last_verified: c.last_verified ? new Date(c.last_verified) : null
        }));
        this.assessments = (data.assessments || []).map((a: any) => ({
          ...a,
          created_at: new Date(a.created_at),
          updated_at: new Date(a.updated_at),
          completed_at: a.completed_at ? new Date(a.completed_at) : null
        }));
        console.log('📂 Loaded from localStorage:', this.companies.length, 'companies');
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      this.companies = [];
      this.assessments = [];
    }
  }
}

// Factory function
export function createMockDatabaseService(): MockDatabaseService {
  return new MockDatabaseService();
}