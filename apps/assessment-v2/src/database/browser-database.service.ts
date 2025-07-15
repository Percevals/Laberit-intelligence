/**
 * Browser-compatible Database Service
 * This service provides a mock implementation that works in browser environments
 * like GitHub Pages where Node.js modules are not available
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

// Mock data storage (in-memory)
const mockStorage = {
  companies: new Map<string, Company>(),
  assessments: new Map<string, Assessment>(),
  dimensionScores: new Map<string, DimensionScore[]>(),
  modelProfiles: new Map<DIIBusinessModel, DIIModelProfile>(),
  benchmarkData: new Map<string, BenchmarkData>()
};

// Initialize mock model profiles
const initializeMockProfiles = () => {
  const profiles: Array<[DIIBusinessModel, Partial<DIIModelProfile>]> = [
    ['COMERCIO_HIBRIDO', {
      businessModel: 'COMERCIO_HIBRIDO',
      diiBaseMin: 1.5,
      diiBaseMax: 2.0,
      diiBaseAvg: 1.75,
      riskMultiplier: 1.0,
      digitalDependencyMin: 30,
      digitalDependencyMax: 60,
      typicalTrdHoursMin: 24,
      typicalTrdHoursMax: 48,
      cyberRiskExplanation: 'Omnichannel operations create multiple attack vectors'
    }],
    ['SOFTWARE_CRITICO', {
      businessModel: 'SOFTWARE_CRITICO',
      diiBaseMin: 0.8,
      diiBaseMax: 1.2,
      diiBaseAvg: 1.0,
      riskMultiplier: 1.5,
      digitalDependencyMin: 70,
      digitalDependencyMax: 90,
      typicalTrdHoursMin: 2,
      typicalTrdHoursMax: 6,
      cyberRiskExplanation: 'SaaS platforms require 24/7 availability'
    }],
    ['SERVICIOS_DATOS', {
      businessModel: 'SERVICIOS_DATOS',
      diiBaseMin: 0.5,
      diiBaseMax: 0.9,
      diiBaseAvg: 0.7,
      riskMultiplier: 2.0,
      digitalDependencyMin: 80,
      digitalDependencyMax: 95,
      typicalTrdHoursMin: 4,
      typicalTrdHoursMax: 12,
      cyberRiskExplanation: 'Data concentration makes companies high-value targets'
    }],
    ['ECOSISTEMA_DIGITAL', {
      businessModel: 'ECOSISTEMA_DIGITAL',
      diiBaseMin: 0.4,
      diiBaseMax: 0.8,
      diiBaseAvg: 0.6,
      riskMultiplier: 2.5,
      digitalDependencyMin: 95,
      digitalDependencyMax: 100,
      typicalTrdHoursMin: 0.5,
      typicalTrdHoursMax: 2,
      cyberRiskExplanation: 'Multi-sided platforms create complex attack surfaces'
    }],
    ['SERVICIOS_FINANCIEROS', {
      businessModel: 'SERVICIOS_FINANCIEROS',
      diiBaseMin: 0.2,
      diiBaseMax: 0.6,
      diiBaseAvg: 0.4,
      riskMultiplier: 3.5,
      digitalDependencyMin: 95,
      digitalDependencyMax: 100,
      typicalTrdHoursMin: 0.5,
      typicalTrdHoursMax: 2,
      cyberRiskExplanation: 'Financial services have zero tolerance for downtime'
    }],
    ['INFRAESTRUCTURA_HEREDADA', {
      businessModel: 'INFRAESTRUCTURA_HEREDADA',
      diiBaseMin: 0.2,
      diiBaseMax: 0.5,
      diiBaseAvg: 0.35,
      riskMultiplier: 2.8,
      digitalDependencyMin: 20,
      digitalDependencyMax: 50,
      typicalTrdHoursMin: 48,
      typicalTrdHoursMax: 168,
      cyberRiskExplanation: 'Legacy systems with known vulnerabilities'
    }],
    ['CADENA_SUMINISTRO', {
      businessModel: 'CADENA_SUMINISTRO',
      diiBaseMin: 0.4,
      diiBaseMax: 0.8,
      diiBaseAvg: 0.6,
      riskMultiplier: 1.8,
      digitalDependencyMin: 40,
      digitalDependencyMax: 70,
      typicalTrdHoursMin: 8,
      typicalTrdHoursMax: 24,
      cyberRiskExplanation: 'Supply chain integrations multiply entry points'
    }],
    ['INFORMACION_REGULADA', {
      businessModel: 'INFORMACION_REGULADA',
      diiBaseMin: 0.4,
      diiBaseMax: 0.7,
      diiBaseAvg: 0.55,
      riskMultiplier: 3.0,
      digitalDependencyMin: 60,
      digitalDependencyMax: 80,
      typicalTrdHoursMin: 6,
      typicalTrdHoursMax: 18,
      cyberRiskExplanation: 'Regulated data attracts nation-state actors'
    }]
  ];

  profiles.forEach(([model, profile]) => {
    mockStorage.modelProfiles.set(model, profile as DIIModelProfile);
  });
};

// Initialize on first use
initializeMockProfiles();

export class BrowserDatabaseService implements ICompanyDatabaseService {
  private isInitialized = true; // Always initialized for browser

  constructor() {
    console.log('🌐 Browser Database Service initialized (mock mode)');
  }

  // Company operations
  async createCompany(company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> {
    const newCompany: Company = {
      ...company,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockStorage.companies.set(newCompany.id, newCompany);
    return newCompany;
  }

  async getCompanyById(id: string): Promise<Company | null> {
    return mockStorage.companies.get(id) || null;
  }

  async getCompanyByDomain(domain: string): Promise<Company | null> {
    for (const company of mockStorage.companies.values()) {
      if (company.domain === domain) {
        return company;
      }
    }
    return null;
  }

  async updateCompany(id: string, updates: Partial<Company>): Promise<Company | null> {
    const company = mockStorage.companies.get(id);
    if (!company) return null;
    
    const updated = {
      ...company,
      ...updates,
      id, // Preserve ID
      createdAt: company.createdAt, // Preserve creation date
      updatedAt: new Date()
    };
    mockStorage.companies.set(id, updated);
    return updated;
  }

  async searchCompanies(query: string): Promise<Company[]> {
    const results: Company[] = [];
    const searchLower = query.toLowerCase();
    
    for (const company of mockStorage.companies.values()) {
      if (
        company.name.toLowerCase().includes(searchLower) ||
        company.legalName?.toLowerCase().includes(searchLower) ||
        company.domain?.toLowerCase().includes(searchLower)
      ) {
        results.push(company);
      }
    }
    
    return results;
  }

  // Assessment operations
  async createAssessment(assessment: Omit<Assessment, 'id' | 'createdAt'>): Promise<Assessment> {
    const newAssessment: Assessment = {
      ...assessment,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    mockStorage.assessments.set(newAssessment.id, newAssessment);
    return newAssessment;
  }

  async getAssessmentById(id: string): Promise<Assessment | null> {
    return mockStorage.assessments.get(id) || null;
  }

  async getCompanyAssessments(companyId: string): Promise<Assessment[]> {
    const results: Assessment[] = [];
    for (const assessment of mockStorage.assessments.values()) {
      if (assessment.companyId === companyId) {
        results.push(assessment);
      }
    }
    return results.sort((a, b) => b.assessedAt.getTime() - a.assessedAt.getTime());
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<Assessment | null> {
    const assessment = mockStorage.assessments.get(id);
    if (!assessment) return null;
    
    const updated = {
      ...assessment,
      ...updates,
      id, // Preserve ID
      createdAt: assessment.createdAt // Preserve creation date
    };
    mockStorage.assessments.set(id, updated);
    return updated;
  }

  // Dimension scores
  async saveDimensionScores(assessmentId: string, scores: Omit<DimensionScore, 'id' | 'createdAt'>[]): Promise<void> {
    const dimensionScores: DimensionScore[] = scores.map(score => ({
      ...score,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }));
    mockStorage.dimensionScores.set(assessmentId, dimensionScores);
  }

  async getDimensionScores(assessmentId: string): Promise<DimensionScore[]> {
    return mockStorage.dimensionScores.get(assessmentId) || [];
  }

  // DII Model profiles
  async getDIIModelProfile(businessModel: DIIBusinessModel): Promise<DIIModelProfile | null> {
    return mockStorage.modelProfiles.get(businessModel) || null;
  }

  async getAllDIIModelProfiles(): Promise<DIIModelProfile[]> {
    return Array.from(mockStorage.modelProfiles.values());
  }

  // Benchmark data
  async getBenchmarkData(businessModel: DIIBusinessModel, region?: string): Promise<BenchmarkData | null> {
    // Return mock benchmark data
    return {
      id: crypto.randomUUID(),
      businessModel,
      region: region || 'LATAM',
      calculationDate: new Date(),
      sampleSize: Math.floor(Math.random() * 100) + 50,
      diiPercentiles: {
        p10: 0.5,
        p25: 1.0,
        p50: 2.0,
        p75: 3.5,
        p90: 5.0
      },
      dimensionMedians: {
        TRD: 24,
        AER: 0.5,
        HFP: 0.3,
        BRI: 0.4,
        RRG: 1.5
      }
    };
  }

  async updateBenchmarkData(businessModel: DIIBusinessModel, data: Partial<BenchmarkData>): Promise<void> {
    const key = `${businessModel}_LATAM`;
    const existing = mockStorage.benchmarkData.get(key) || {
      id: crypto.randomUUID(),
      businessModel,
      region: 'LATAM',
      calculationDate: new Date(),
      sampleSize: 0,
      diiPercentiles: {},
      dimensionMedians: {}
    };
    
    mockStorage.benchmarkData.set(key, {
      ...existing,
      ...data
    } as BenchmarkData);
  }

  // Business model classification
  async classifyBusinessModel(input: BusinessModelClassificationInput): Promise<BusinessModelClassificationResult> {
    // Simple classification based on industry keywords
    const industryLower = input.industryTraditional.toLowerCase();
    
    let businessModel: DIIBusinessModel = 'COMERCIO_HIBRIDO';
    let confidence = 0.7;
    let reasoning = 'Default classification based on industry';

    if (industryLower.includes('bank') || industryLower.includes('financ')) {
      businessModel = 'SERVICIOS_FINANCIEROS';
      confidence = 0.95;
      reasoning = 'Financial services detected based on industry';
    } else if (industryLower.includes('software') || industryLower.includes('saas')) {
      businessModel = 'SOFTWARE_CRITICO';
      confidence = 0.9;
      reasoning = 'Software/SaaS business model detected';
    } else if (industryLower.includes('health') || industryLower.includes('medical')) {
      businessModel = 'INFORMACION_REGULADA';
      confidence = 0.9;
      reasoning = 'Healthcare/regulated information business';
    } else if (industryLower.includes('retail') || industryLower.includes('commerce')) {
      businessModel = 'COMERCIO_HIBRIDO';
      confidence = 0.85;
      reasoning = 'Retail/commerce hybrid model';
    } else if (industryLower.includes('data') || industryLower.includes('analytics')) {
      businessModel = 'SERVICIOS_DATOS';
      confidence = 0.85;
      reasoning = 'Data services business model';
    } else if (industryLower.includes('platform') || industryLower.includes('marketplace')) {
      businessModel = 'ECOSISTEMA_DIGITAL';
      confidence = 0.9;
      reasoning = 'Digital ecosystem/platform model';
    } else if (industryLower.includes('manufactur') || industryLower.includes('industrial')) {
      businessModel = 'INFRAESTRUCTURA_HEREDADA';
      confidence = 0.8;
      reasoning = 'Traditional infrastructure with digital components';
    } else if (industryLower.includes('logistic') || industryLower.includes('supply')) {
      businessModel = 'CADENA_SUMINISTRO';
      confidence = 0.85;
      reasoning = 'Supply chain focused business';
    }

    return {
      businessModel,
      confidence,
      reasoning,
      alternativeModels: []
    };
  }

  // DII calculation
  async calculateDII(input: DIICalculationInput): Promise<DIICalculationResult> {
    const modelProfile = await this.getDIIModelProfile(input.businessModel);
    if (!modelProfile) {
      throw new Error(`Model profile not found for ${input.businessModel}`);
    }

    // Simple DII calculation
    const weights = { TRD: 0.3, AER: 0.2, HFP: 0.2, BRI: 0.15, RRG: 0.15 };
    let rawScore = 0;

    Object.entries(input.dimensions).forEach(([dim, value]) => {
      rawScore += value * (weights[dim as DiiDimension] || 0);
    });

    const finalScore = rawScore * modelProfile.riskMultiplier;

    return {
      rawScore,
      finalScore,
      confidence: 0.8,
      calculationMethod: 'weighted_average',
      modelProfile,
      dimensionContributions: input.dimensions
    };
  }

  // Additional utility methods
  async isHealthy(): Promise<boolean> {
    return true; // Always healthy in browser mode
  }

  async close(): Promise<void> {
    // No-op for browser
    console.log('Browser database service closed');
  }
}

// Factory function
export function createBrowserDatabaseService(): ICompanyDatabaseService {
  return new BrowserDatabaseService();
}