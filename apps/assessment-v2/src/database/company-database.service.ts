/**
 * Company Database Service
 * Implements the DII Business Model Database with simplified 80/20 approach
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
import type { DatabaseConnection } from './connection';

export class CompanyDatabaseService implements ICompanyDatabaseService {
  private db: DatabaseConnection;
  
  constructor(databaseConnection: DatabaseConnection) {
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

    const id = this.generateUUID();
    const now = new Date().toISOString();

    this.db.execute(`
      INSERT INTO companies (
        id, name, legal_name, domain, industry_traditional, dii_business_model,
        confidence_score, classification_reasoning, headquarters, country, region,
        employees, revenue, last_verified, verification_source, data_freshness_days,
        is_prospect, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, data.name, data.legal_name || null, data.domain || null,
      data.industry_traditional, data.dii_business_model,
      data.confidence_score || null, data.classification_reasoning || null,
      data.headquarters || null, data.country || null, data.region || 'LATAM',
      data.employees || null, data.revenue || null,
      data.last_verified || now, data.verification_source || 'manual',
      data.data_freshness_days || 90, data.is_prospect || false,
      now, now
    ]);

    const company = this.db.queryOne('SELECT * FROM companies WHERE id = ?', [id]);
    return this.mapCompanyFromDB(company);
  }

  async getCompany(id: string): Promise<Company | null> {
    const result = this.db.queryOne('SELECT * FROM companies WHERE id = ?', [id]);
    return result ? this.mapCompanyFromDB(result) : null;
  }

  async getCompanyByDomain(domain: string): Promise<Company | null> {
    const result = this.db.queryOne('SELECT * FROM companies WHERE domain = ?', [domain]);
    return result ? this.mapCompanyFromDB(result) : null;
  }

  async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
    const now = new Date().toISOString();
    
    // Build dynamic update query
    const updateFields = Object.keys(data).filter(key => key !== 'id' && key !== 'created_at');
    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => (data as any)[field]);
    
    this.db.execute(`
      UPDATE companies 
      SET ${setClause}, updated_at = ?
      WHERE id = ?
    `, [...values, now, id]);

    const updated = this.db.queryOne('SELECT * FROM companies WHERE id = ?', [id]);
    return this.mapCompanyFromDB(updated);
  }

  async searchCompanies(query: string): Promise<Company[]> {
    const searchQuery = `%${query.toLowerCase()}%`;
    const results = this.db.query(`
      SELECT * FROM companies 
      WHERE LOWER(name) LIKE ? 
         OR LOWER(legal_name) LIKE ? 
         OR LOWER(domain) LIKE ?
      ORDER BY name ASC 
      LIMIT 50
    `, [searchQuery, searchQuery, searchQuery]);

    return results.map(row => this.mapCompanyFromDB(row));
  }

  // ===================================================================
  // DATA FRESHNESS MANAGEMENT
  // ===================================================================

  async isCompanyDataStale(companyId: string): Promise<boolean> {
    const result = this.db.queryOne(`
      SELECT last_verified, data_freshness_days 
      FROM companies 
      WHERE id = ?
    `, [companyId]);

    if (!result || !result.last_verified) {
      return true;
    }

    const lastVerified = new Date(result.last_verified);
    const daysSinceVerified = Math.floor(
      (Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceVerified > (result.data_freshness_days || 90);
  }

  async updateCompanyVerification(
    companyId: string, 
    source: 'ai_search' | 'manual' | 'import'
  ): Promise<void> {
    const now = new Date().toISOString();
    
    this.db.execute(`
      UPDATE companies 
      SET last_verified = ?, verification_source = ?, updated_at = ?
      WHERE id = ?
    `, [now, source, now, companyId]);
  }

  async getCompaniesNeedingVerification(limit: number = 10): Promise<Company[]> {
    const results = this.db.query(`
      SELECT * FROM companies 
      WHERE last_verified IS NULL 
         OR julianday('now') - julianday(last_verified) > data_freshness_days
      ORDER BY last_verified ASC NULLS FIRST
      LIMIT ?
    `, [limit]);

    return results.map(row => this.mapCompanyFromDB(row));
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
    const rules = this.db.query(`
      SELECT * FROM classification_rules 
      WHERE active = 1 AND industry_pattern IS NOT NULL
      ORDER BY rule_priority ASC
    `);

    const industryLower = input.industry_traditional.toLowerCase();
    const nameLower = input.company_name.toLowerCase();

    for (const rule of rules) {
      if (rule.industry_pattern) {
        const patterns = rule.industry_pattern.split('|');
        const matches = patterns.some((pattern: string) => 
          industryLower.includes(pattern.trim()) || 
          nameLower.includes(pattern.trim())
        );

        if (matches) {
          return {
            dii_business_model: rule.target_dii_model as DIIBusinessModel,
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

    const rule = this.db.queryOne(`
      SELECT * FROM classification_rules 
      WHERE active = 1 
        AND revenue_model = ? 
        AND operational_dependency = ?
      LIMIT 1
    `, [input.revenue_model, input.operational_dependency]);

    if (rule) {
      return {
        dii_business_model: rule.target_dii_model as DIIBusinessModel,
        confidence_score: rule.confidence_level,
        reasoning: rule.reasoning_template,
        method: 'two_question_matrix',
        rule_used: rule.id
      };
    }

    return null;
  }

  async updateBusinessModelClassification(companyId: string, classification: BusinessModelClassificationResult): Promise<void> {
    const now = new Date().toISOString();
    
    this.db.execute(`
      UPDATE companies 
      SET dii_business_model = ?, 
          confidence_score = ?, 
          classification_reasoning = ?,
          updated_at = ?
      WHERE id = ?
    `, [
      classification.dii_business_model,
      classification.confidence_score,
      classification.reasoning,
      now,
      companyId
    ]);
  }

  // ===================================================================
  // ASSESSMENT MANAGEMENT
  // ===================================================================

  async createAssessment(data: Omit<Assessment, 'id' | 'created_at'>): Promise<Assessment> {
    const id = this.generateUUID();
    const now = new Date().toISOString();

    this.db.execute(`
      INSERT INTO assessments (
        id, company_id, assessment_type, dii_raw_score, dii_final_score,
        confidence_level, assessed_at, assessed_by_user_id, framework_version,
        calculation_inputs, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, data.company_id, data.assessment_type, data.dii_raw_score || null,
      data.dii_final_score || null, data.confidence_level || null,
      data.assessed_at ? data.assessed_at.toISOString() : now,
      data.assessed_by_user_id || null, data.framework_version || 'v4.0',
      data.calculation_inputs ? JSON.stringify(data.calculation_inputs) : null,
      now
    ]);

    const assessment = this.db.queryOne('SELECT * FROM assessments WHERE id = ?', [id]);
    return this.mapAssessmentFromDB(assessment);
  }

  async getAssessment(id: string): Promise<Assessment | null> {
    const result = this.db.queryOne('SELECT * FROM assessments WHERE id = ?', [id]);
    return result ? this.mapAssessmentFromDB(result) : null;
  }

  async getCompanyAssessments(companyId: string): Promise<Assessment[]> {
    const results = this.db.query(`
      SELECT * FROM assessments 
      WHERE company_id = ? 
      ORDER BY assessed_at DESC
    `, [companyId]);

    return results.map(row => this.mapAssessmentFromDB(row));
  }

  // ===================================================================
  // DIMENSION SCORES
  // ===================================================================

  async saveDimensionScores(assessmentId: string, scores: DIICalculationInput): Promise<DimensionScore[]> {
    const dimensionScores: DimensionScore[] = [];
    const now = new Date().toISOString();

    for (const [dimension, scoreData] of Object.entries(scores)) {
      const id = this.generateUUID();
      
      this.db.execute(`
        INSERT INTO dimension_scores (
          id, assessment_id, dimension, raw_value, confidence_score,
          data_source, validation_status, supporting_evidence, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, assessmentId, dimension, scoreData.value, scoreData.confidence,
        scoreData.data_source, 'valid', 
        scoreData.evidence ? JSON.stringify(scoreData.evidence) : null,
        now
      ]);

      const saved = this.db.queryOne('SELECT * FROM dimension_scores WHERE id = ?', [id]);
      dimensionScores.push(this.mapDimensionScoreFromDB(saved));
    }

    return dimensionScores;
  }

  async getAssessmentDimensions(assessmentId: string): Promise<DimensionScore[]> {
    const results = this.db.query(`
      SELECT * FROM dimension_scores 
      WHERE assessment_id = ? 
      ORDER BY dimension ASC
    `, [assessmentId]);

    return results.map(row => this.mapDimensionScoreFromDB(row));
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
      validation_errors: validationErrors,
      ...(benchmark_percentile !== undefined && { benchmark_percentile }),
      ...(industry_median !== undefined && { industry_median }),
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

    const rules = this.db.query('SELECT * FROM validation_rules WHERE active = 1');

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
    const result = this.db.queryOne(`
      SELECT * FROM benchmark_data 
      WHERE business_model = ? AND region = ?
      ORDER BY calculation_date DESC 
      LIMIT 1
    `, [businessModel, region]);

    if (!result) return null;

    const benchmark: BenchmarkData = {
      id: result.id,
      business_model: result.business_model as DIIBusinessModel,
      region: result.region,
      sector: result.sector,
      calculation_date: new Date(result.calculation_date),
      sample_size: result.sample_size,
      dii_percentiles: JSON.parse(result.dii_percentiles),
      dimension_medians: result.dimension_medians ? JSON.parse(result.dimension_medians) : undefined,
      created_at: new Date(result.created_at)
    };

    if (result.next_recalculation_due) {
      benchmark.next_recalculation_due = new Date(result.next_recalculation_due);
    }

    return benchmark;
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
      const recentScores = this.db.query(`
        SELECT a.dii_final_score 
        FROM assessments a
        JOIN companies c ON a.company_id = c.id
        WHERE c.dii_business_model = ?
          AND a.dii_final_score IS NOT NULL
          AND a.assessed_at >= datetime('now', '-12 months')
      `, [businessModel]);

      if (recentScores.length >= 5) { // Minimum sample size
        const scores = recentScores.map((s: any) => s.dii_final_score).sort((a: number, b: number) => a - b);
        
        const percentiles = {
          p25: this.calculatePercentile(scores, 25),
          p50: this.calculatePercentile(scores, 50),
          p75: this.calculatePercentile(scores, 75),
          p90: this.calculatePercentile(scores, 90),
          p95: this.calculatePercentile(scores, 95)
        };

        // Upsert benchmark data (insert or update)
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const nextRecalc = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const existing = this.db.queryOne(`
          SELECT id FROM benchmark_data 
          WHERE business_model = ? AND region = ? AND calculation_date = ?
        `, [businessModel, 'LATAM', today]);

        if (existing) {
          // Update existing record
          this.db.execute(`
            UPDATE benchmark_data 
            SET sample_size = ?, dii_percentiles = ?, next_recalculation_due = ?
            WHERE id = ?
          `, [scores.length, JSON.stringify(percentiles), nextRecalc, existing.id]);
        } else {
          // Insert new record
          this.db.execute(`
            INSERT INTO benchmark_data (
              id, business_model, region, calculation_date, sample_size,
              dii_percentiles, next_recalculation_due, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            this.generateUUID(), businessModel, 'LATAM', today, scores.length,
            JSON.stringify(percentiles), nextRecalc, new Date().toISOString()
          ]);
        }
      }
    }
  }

  // ===================================================================
  // UTILITY METHODS
  // ===================================================================

  private async getModelProfile(businessModel: DIIBusinessModel): Promise<DIIModelProfile | null> {
    const result = this.db.queryOne(`
      SELECT * FROM dii_model_profiles 
      WHERE model_name = ?
    `, [businessModel]);

    if (!result) return null;

    return {
      model_id: result.model_id,
      model_name: result.model_name as DIIBusinessModel,
      dii_base_min: result.dii_base_min,
      dii_base_max: result.dii_base_max,
      dii_base_avg: result.dii_base_avg,
      risk_multiplier: result.risk_multiplier,
      digital_dependency_min: result.digital_dependency_min,
      digital_dependency_max: result.digital_dependency_max,
      typical_trd_hours_min: result.typical_trd_hours_min,
      typical_trd_hours_max: result.typical_trd_hours_max,
      vulnerability_patterns: result.vulnerability_patterns ? JSON.parse(result.vulnerability_patterns) : undefined,
      example_companies: result.example_companies ? JSON.parse(result.example_companies) : undefined,
      cyber_risk_explanation: result.cyber_risk_explanation,
      active_from: new Date(result.active_from),
      ...(result.active_to && { active_to: new Date(result.active_to) })
    };
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

  private getImprovementActions(dimension: DiiDimension, _businessModel: DIIBusinessModel): string[] {
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

  private getTargetScore(_dimension: DiiDimension, _modelProfile: DIIModelProfile): number {
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
      return sortedArray[lower] || 0;
    }
    
    return (sortedArray[lower] || 0) * (1 - weight) + (sortedArray[upper] || 0) * weight;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // ===================================================================
  // DATABASE MAPPING UTILITIES
  // ===================================================================

  private mapCompanyFromDB(row: any): Company {
    return {
      id: row.id,
      name: row.name,
      legal_name: row.legal_name,
      domain: row.domain,
      industry_traditional: row.industry_traditional,
      dii_business_model: row.dii_business_model as DIIBusinessModel,
      confidence_score: row.confidence_score,
      classification_reasoning: row.classification_reasoning,
      headquarters: row.headquarters,
      country: row.country,
      region: row.region,
      employees: row.employees,
      revenue: row.revenue,
      last_verified: row.last_verified ? new Date(row.last_verified) : undefined,
      verification_source: row.verification_source,
      data_freshness_days: row.data_freshness_days ?? 90,
      is_prospect: row.is_prospect ?? false,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at)
    };
  }

  public mapAssessmentFromDB(row: any): Assessment {
    return {
      id: row.id,
      company_id: row.company_id,
      assessment_type: row.assessment_type,
      dii_raw_score: row.dii_raw_score,
      dii_final_score: row.dii_final_score,
      confidence_level: row.confidence_level,
      assessed_at: new Date(row.assessed_at),
      assessed_by_user_id: row.assessed_by_user_id,
      framework_version: row.framework_version,
      calculation_inputs: row.calculation_inputs ? JSON.parse(row.calculation_inputs) : undefined,
      created_at: new Date(row.created_at)
    };
  }

  public mapDimensionScoreFromDB(row: any): DimensionScore {
    return {
      id: row.id,
      assessment_id: row.assessment_id,
      dimension: row.dimension as DiiDimension,
      raw_value: row.raw_value,
      normalized_value: row.normalized_value,
      confidence_score: row.confidence_score,
      data_source: row.data_source,
      validation_status: row.validation_status,
      calculation_method: row.calculation_method,
      supporting_evidence: row.supporting_evidence ? JSON.parse(row.supporting_evidence) : undefined,
      created_at: new Date(row.created_at)
    };
  }
}

// ===================================================================
// FACTORY FUNCTION
// ===================================================================

export function createCompanyDatabaseService(databaseConnection: DatabaseConnection): CompanyDatabaseService {
  return new CompanyDatabaseService(databaseConnection);
}