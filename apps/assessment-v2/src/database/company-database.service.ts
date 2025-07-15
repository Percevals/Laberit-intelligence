/**
 * Company Database Service
 * Implements the DII Business Model Database with simplified 80/20 approach
 */

import type { 
  Company, 
  Assessment, 
  DimensionScore, 
  DIIModelProfile,
  ClassificationRule,
  BenchmarkData,
  BusinessModelClassificationInput,
  BusinessModelClassificationResult,
  DIICalculationInput,
  DIICalculationResult,
  CompanyDatabaseService,
  DIIBusinessModel,
  DiiDimension,
  ValidationRule
} from './types';

export class CompanyDatabaseService implements CompanyDatabaseService {
  private db: any; // Database connection - implement with your preferred DB client
  
  constructor(databaseConnection: any) {
    this.db = databaseConnection;
  }

  // ===================================================================
  // COMPANY MANAGEMENT
  // ===================================================================

  async createCompany(data: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    // Auto-classify business model if not provided
    if (!data.dii_business_model) {
      const classification = await this.classifyBusinessModel({
        company_name: data.name,
        industry_traditional: data.industry_traditional
      });
      
      data.dii_business_model = classification.dii_business_model;
      data.confidence_score = classification.confidence_score;
      data.classification_reasoning = classification.reasoning;
    }

    const company = await this.db.companies.create({
      data: {
        ...data,
        id: this.generateUUID(),
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return company;
  }

  async getCompany(id: string): Promise<Company | null> {
    return await this.db.companies.findUnique({
      where: { id }
    });
  }

  async getCompanyByDomain(domain: string): Promise<Company | null> {
    return await this.db.companies.findUnique({
      where: { domain }
    });
  }

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    return await this.db.companies.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });
  }

  async searchCompanies(query: string): Promise<Company[]> {
    return await this.db.companies.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { legal_name: { contains: query, mode: 'insensitive' } },
          { domain: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { name: 'asc' },
      take: 50
    });
  }

  // ===================================================================
  // BUSINESS MODEL CLASSIFICATION
  // ===================================================================

  async classifyBusinessModel(input: BusinessModelClassificationInput): Promise<BusinessModelClassificationResult> {
    // Step 1: Try industry pattern matching (high confidence)
    const industryResult = await this.classifyByIndustryPattern(input);
    if (industryResult) {
      return industryResult;
    }

    // Step 2: Try two-question matrix (if provided)
    if (input.revenue_model && input.operational_dependency) {
      const matrixResult = await this.classifyByTwoQuestionMatrix(input);
      if (matrixResult) {
        return matrixResult;
      }
    }

    // Step 3: Default fallback to most common model
    return {
      dii_business_model: 'COMERCIO_HIBRIDO',
      confidence_score: 0.6,
      reasoning: 'Unable to determine specific model from available data, defaulting to most common hybrid commerce pattern',
      method: 'default_fallback'
    };
  }

  private async classifyByIndustryPattern(input: BusinessModelClassificationInput): Promise<BusinessModelClassificationResult | null> {
    const rules = await this.db.classification_rules.findMany({
      where: {
        active: true,
        industry_pattern: { not: null }
      },
      orderBy: { rule_priority: 'asc' }
    });

    const industryLower = input.industry_traditional.toLowerCase();
    const nameLower = input.company_name.toLowerCase();

    for (const rule of rules) {
      if (rule.industry_pattern) {
        const patterns = rule.industry_pattern.split('|');
        const matches = patterns.some(pattern => 
          industryLower.includes(pattern.trim()) || 
          nameLower.includes(pattern.trim())
        );

        if (matches) {
          return {
            dii_business_model: rule.target_dii_model,
            confidence_score: rule.confidence_level,
            reasoning: rule.reasoning_template,
            method: 'industry_pattern',
            rule_used: rule.id
          };
        }
      }
    }

    return null;
  }

  private async classifyByTwoQuestionMatrix(input: BusinessModelClassificationInput): Promise<BusinessModelClassificationResult | null> {
    if (!input.revenue_model || !input.operational_dependency) {
      return null;
    }

    const rule = await this.db.classification_rules.findFirst({
      where: {
        active: true,
        revenue_model: input.revenue_model,
        operational_dependency: input.operational_dependency
      }
    });

    if (rule) {
      return {
        dii_business_model: rule.target_dii_model,
        confidence_score: rule.confidence_level,
        reasoning: rule.reasoning_template,
        method: 'two_question_matrix',
        rule_used: rule.id
      };
    }

    return null;
  }

  async updateBusinessModelClassification(companyId: string, classification: BusinessModelClassificationResult): Promise<void> {
    await this.db.companies.update({
      where: { id: companyId },
      data: {
        dii_business_model: classification.dii_business_model,
        confidence_score: classification.confidence_score,
        classification_reasoning: classification.reasoning,
        updated_at: new Date()
      }
    });
  }

  // ===================================================================
  // ASSESSMENT MANAGEMENT
  // ===================================================================

  async createAssessment(data: Omit<Assessment, 'id' | 'created_at'>): Promise<Assessment> {
    return await this.db.assessments.create({
      data: {
        ...data,
        id: this.generateUUID(),
        created_at: new Date()
      }
    });
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    return await this.db.assessments.findUnique({
      where: { id },
      include: {
        company: true,
        dimension_scores: true
      }
    });
  }

  async getCompanyAssessments(companyId: string): Promise<Assessment[]> {
    return await this.db.assessments.findMany({
      where: { company_id: companyId },
      orderBy: { assessed_at: 'desc' }
    });
  }

  // ===================================================================
  // DIMENSION SCORES
  // ===================================================================

  async saveDimensionScores(assessmentId: string, scores: DIICalculationInput): Promise<DimensionScore[]> {
    const dimensionScores: DimensionScore[] = [];

    for (const [dimension, scoreData] of Object.entries(scores)) {
      const dimensionScore = await this.db.dimension_scores.create({
        data: {
          id: this.generateUUID(),
          assessment_id: assessmentId,
          dimension: dimension as DiiDimension,
          raw_value: scoreData.value,
          confidence_score: scoreData.confidence,
          data_source: scoreData.data_source,
          validation_status: 'valid', // Will be updated by validation
          supporting_evidence: scoreData.evidence || {},
          created_at: new Date()
        }
      });
      dimensionScores.push(dimensionScore);
    }

    return dimensionScores;
  }

  async getAssessmentDimensions(assessmentId: string): Promise<DimensionScore[]> {
    return await this.db.dimension_scores.findMany({
      where: { assessment_id: assessmentId },
      orderBy: { dimension: 'asc' }
    });
  }

  // ===================================================================
  // DII CALCULATION
  // ===================================================================

  async calculateDII(companyId: string, input: DIICalculationInput): Promise<DIICalculationResult> {
    // Get company and business model profile
    const company = await this.getCompany(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    const modelProfile = await this.getModelProfile(company.dii_business_model);
    if (!modelProfile) {
      throw new Error('Business model profile not found');
    }

    // Validate dimension scores
    const validationErrors = await this.validateDimensionScores(input);

    // Calculate DII Raw Score
    // Formula: DII Raw = (TRD × AER) / (HFP × BRI × RRG)
    const { TRD, AER, HFP, BRI, RRG } = input;
    const dii_raw_score = (TRD.value * AER.value) / (HFP.value * BRI.value * RRG.value);

    // Normalize against model baseline
    // Formula: DII Score = (DII Raw / Model Base) × 10
    const dii_final_score = (dii_raw_score / modelProfile.dii_base_avg) * 10;

    // Calculate overall confidence
    const confidence_level = Math.min(
      (TRD.confidence + AER.confidence + HFP.confidence + BRI.confidence + RRG.confidence) / 5 * 100,
      100
    );

    // Get benchmark comparison
    const benchmark = await this.getBenchmarkData(company.dii_business_model, company.region);
    let benchmark_percentile: number | undefined;
    let industry_median: number | undefined;

    if (benchmark) {
      industry_median = benchmark.dii_percentiles.p50;
      
      // Calculate percentile position
      if (dii_final_score <= benchmark.dii_percentiles.p25) benchmark_percentile = 25;
      else if (dii_final_score <= benchmark.dii_percentiles.p50) benchmark_percentile = 50;
      else if (dii_final_score <= benchmark.dii_percentiles.p75) benchmark_percentile = 75;
      else if (dii_final_score <= benchmark.dii_percentiles.p90) benchmark_percentile = 90;
      else benchmark_percentile = 95;
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(input, modelProfile);

    return {
      dii_raw_score,
      dii_final_score,
      confidence_level,
      validation_errors,
      benchmark_percentile,
      industry_median,
      recommendations
    };
  }

  // ===================================================================
  // VALIDATION
  // ===================================================================

  async validateDimensionScores(input: DIICalculationInput): Promise<Array<{
    dimension?: DiiDimension;
    rule: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
  }>> {
    const errors: Array<{
      dimension?: DiiDimension;
      rule: string;
      severity: 'error' | 'warning' | 'info';
      message: string;
    }> = [];

    const rules = await this.db.validation_rules.findMany({
      where: { active: true }
    });

    for (const rule of rules) {
      // Check each dimension against applicable rules
      for (const [dimension, scoreData] of Object.entries(input)) {
        if (rule.applies_to === dimension || rule.applies_to === 'all') {
          // Simple SQL condition evaluation (in real implementation, use proper SQL execution)
          const violated = this.evaluateValidationRule(rule.condition_sql, scoreData.value);
          
          if (violated) {
            errors.push({
              dimension: dimension as DiiDimension,
              rule: rule.rule_name,
              severity: rule.severity as 'error' | 'warning' | 'info',
              message: rule.message_template
            });
          }
        }
      }
    }

    return errors;
  }

  private evaluateValidationRule(conditionSql: string, value: number): boolean {
    // Simple condition evaluation - in real implementation, use proper SQL execution
    // This is a simplified version for demonstration
    
    if (conditionSql.includes('raw_value < 1.0')) {
      return value < 1.0;
    }
    if (conditionSql.includes('raw_value < 0.05 OR raw_value > 0.95')) {
      return value < 0.05 || value > 0.95;
    }
    if (conditionSql.includes('raw_value < 0.5')) {
      return value < 0.5;
    }
    if (conditionSql.includes('raw_value > 50.0')) {
      return value > 50.0;
    }
    if (conditionSql.includes('raw_value > 1.0')) {
      return value > 1.0;
    }
    
    return false;
  }

  // ===================================================================
  // BENCHMARKING
  // ===================================================================

  async getBenchmarkData(businessModel: DIIBusinessModel, region: string = 'LATAM'): Promise<BenchmarkData | null> {
    return await this.db.benchmark_data.findFirst({
      where: {
        business_model: businessModel,
        region: region
      },
      orderBy: { calculation_date: 'desc' }
    });
  }

  async updateBenchmarks(): Promise<void> {
    // Implementation for recalculating benchmarks from recent assessments
    // This would aggregate DII scores by business model and region
    
    const businessModels: DIIBusinessModel[] = [
      'COMERCIO_HIBRIDO', 'SOFTWARE_CRITICO', 'SERVICIOS_DATOS', 'ECOSISTEMA_DIGITAL',
      'SERVICIOS_FINANCIEROS', 'INFRAESTRUCTURA_HEREDADA', 'CADENA_SUMINISTRO', 'INFORMACION_REGULADA'
    ];

    for (const businessModel of businessModels) {
      // Get recent assessments for this business model
      const recentScores = await this.db.assessments.findMany({
        where: {
          company: {
            dii_business_model: businessModel
          },
          dii_final_score: { not: null },
          assessed_at: {
            gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last 12 months
          }
        },
        select: { dii_final_score: true }
      });

      if (recentScores.length >= 5) { // Minimum sample size
        const scores = recentScores.map(s => s.dii_final_score).sort((a, b) => a - b);
        
        const percentiles = {
          p25: this.calculatePercentile(scores, 25),
          p50: this.calculatePercentile(scores, 50),
          p75: this.calculatePercentile(scores, 75),
          p90: this.calculatePercentile(scores, 90),
          p95: this.calculatePercentile(scores, 95)
        };

        // Upsert benchmark data
        await this.db.benchmark_data.upsert({
          where: {
            business_model_region_sector_calculation_date: {
              business_model: businessModel,
              region: 'LATAM',
              sector: null,
              calculation_date: new Date()
            }
          },
          update: {
            sample_size: scores.length,
            dii_percentiles: percentiles,
            next_recalculation_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          },
          create: {
            id: this.generateUUID(),
            business_model: businessModel,
            region: 'LATAM',
            calculation_date: new Date(),
            sample_size: scores.length,
            dii_percentiles: percentiles,
            next_recalculation_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            created_at: new Date()
          }
        });
      }
    }
  }

  // ===================================================================
  // UTILITY METHODS
  // ===================================================================

  private async getModelProfile(businessModel: DIIBusinessModel): Promise<DIIModelProfile | null> {
    return await this.db.dii_model_profiles.findUnique({
      where: { model_name: businessModel }
    });
  }

  private generateRecommendations(input: DIICalculationInput, modelProfile: DIIModelProfile): Array<{
    dimension: DiiDimension;
    current_score: number;
    target_score: number;
    improvement_actions: string[];
  }> {
    const recommendations: Array<{
      dimension: DiiDimension;
      current_score: number;
      target_score: number;
      improvement_actions: string[];
    }> = [];

    // Identify weakest dimensions and suggest improvements
    const dimensions = Object.entries(input) as [DiiDimension, typeof input[DiiDimension]][];
    
    for (const [dimension, scoreData] of dimensions) {
      if (scoreData.confidence < 0.7) {
        const improvementActions = this.getImprovementActions(dimension, modelProfile.model_name);
        recommendations.push({
          dimension,
          current_score: scoreData.value,
          target_score: this.getTargetScore(dimension, modelProfile),
          improvement_actions: improvementActions
        });
      }
    }

    return recommendations;
  }

  private getImprovementActions(dimension: DiiDimension, businessModel: DIIBusinessModel): string[] {
    const actions: Record<DiiDimension, string[]> = {
      TRD: [
        'Implement automated failover systems',
        'Create redundant revenue streams',
        'Establish real-time monitoring alerts'
      ],
      AER: [
        'Increase security investment relative to accessible value',
        'Implement honeypots and deception technology',
        'Segment high-value assets'
      ],
      HFP: [
        'Enhance security awareness training',
        'Implement phishing simulation programs',
        'Deploy behavioral analytics'
      ],
      BRI: [
        'Network segmentation implementation',
        'Zero-trust architecture adoption',
        'Privilege access management'
      ],
      RRG: [
        'Regular disaster recovery testing',
        'Update and validate recovery procedures',
        'Cross-train recovery teams'
      ]
    };

    return actions[dimension] || [];
  }

  private getTargetScore(dimension: DiiDimension, modelProfile: DIIModelProfile): number {
    // Return industry best practice targets based on business model
    // This would be configured based on DII framework requirements
    return 5.0; // Simplified target
  }

  private calculatePercentile(sortedArray: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedArray.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (lower === upper) {
      return sortedArray[lower];
    }
    
    return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// ===================================================================
// FACTORY FUNCTION
// ===================================================================

export function createCompanyDatabaseService(databaseConnection: any): CompanyDatabaseService {
  return new CompanyDatabaseService(databaseConnection);
}