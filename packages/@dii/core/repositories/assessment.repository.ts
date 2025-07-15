/**
 * Assessment Repository
 * Handles all assessment-related database operations
 */

import { BaseRepository } from './base.repository';
import { 
  Assessment, 
  DimensionScore,
  CreateAssessmentDto, 
  CreateDimensionScoreDto,
  AssessmentSearchCriteria,
  DIIDimension
} from '../types/entities';
import { DatabaseError } from '../errors/database.error';

export class AssessmentRepository extends BaseRepository<Assessment> {
  protected tableName = 'assessments';
  protected primaryKey = 'id';

  /**
   * Create a new assessment
   */
  async createAssessment(data: CreateAssessmentDto): Promise<Assessment> {
    const assessmentData = {
      ...data,
      framework_version: data.framework_version || 'v4.0',
      assessed_at: new Date(),
      created_at: new Date()
    };

    return this.create(assessmentData);
  }

  /**
   * Create assessment with dimension scores (transaction)
   */
  async createWithScores(
    assessmentData: CreateAssessmentDto,
    dimensionScores: Omit<CreateDimensionScoreDto, 'assessment_id'>[]
  ): Promise<{
    assessment: Assessment;
    scores: DimensionScore[];
  }> {
    return this.transaction(async (trx) => {
      // Create assessment
      const assessmentSql = `
        INSERT INTO assessments 
        (company_id, assessment_type, dii_raw_score, dii_final_score,
         confidence_level, assessed_at, assessed_by_user_id, 
         framework_version, calculation_inputs, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const now = new Date();
      const assessmentParams = [
        assessmentData.company_id,
        assessmentData.assessment_type,
        assessmentData.dii_raw_score || null,
        assessmentData.dii_final_score || null,
        assessmentData.confidence_level || null,
        now,
        assessmentData.assessed_by_user_id || null,
        assessmentData.framework_version || 'v4.0',
        assessmentData.calculation_inputs ? JSON.stringify(assessmentData.calculation_inputs) : null,
        now
      ];

      const assessmentResult = await trx.query<Assessment>(assessmentSql, assessmentParams);
      const assessment = assessmentResult.rows[0];

      if (!assessment) {
        throw new DatabaseError('Failed to create assessment', 'CREATE_ASSESSMENT_FAILED');
      }

      // Create dimension scores
      const scores: DimensionScore[] = [];
      
      for (const scoreData of dimensionScores) {
        const scoreSql = `
          INSERT INTO dimension_scores
          (assessment_id, dimension, raw_value, normalized_value,
           confidence_score, data_source, validation_status,
           calculation_method, supporting_evidence, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *
        `;

        const scoreParams = [
          assessment.id,
          scoreData.dimension,
          scoreData.raw_value,
          scoreData.normalized_value || null,
          scoreData.confidence_score || null,
          scoreData.data_source || null,
          scoreData.validation_status || 'valid',
          scoreData.calculation_method || null,
          scoreData.supporting_evidence ? JSON.stringify(scoreData.supporting_evidence) : null,
          now
        ];

        const scoreResult = await trx.query<DimensionScore>(scoreSql, scoreParams);
        if (scoreResult.rows[0]) {
          scores.push(scoreResult.rows[0]);
        }
      }

      return { assessment, scores };
    });
  }

  /**
   * Get latest assessment for a company
   */
  async getLatestByCompany(companyId: string): Promise<Assessment | null> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE company_id = $1
      ORDER BY assessed_at DESC
      LIMIT 1
    `;

    return this.db.queryOne<Assessment>(sql, [companyId]);
  }

  /**
   * Get assessments by company
   */
  async getByCompany(companyId: string, limit?: number): Promise<Assessment[]> {
    let sql = `
      SELECT * FROM ${this.tableName}
      WHERE company_id = $1
      ORDER BY assessed_at DESC
    `;

    const params: any[] = [companyId];

    if (limit) {
      params.push(limit);
      sql += ` LIMIT $${params.length}`;
    }

    const result = await this.db.query<Assessment>(sql, params);
    return result.rows;
  }

  /**
   * Get assessment with dimension scores
   */
  async getWithScores(assessmentId: string): Promise<{
    assessment: Assessment | null;
    scores: DimensionScore[];
  }> {
    const [assessment, scores] = await Promise.all([
      this.findById(assessmentId),
      this.getDimensionScores(assessmentId)
    ]);

    return { assessment, scores };
  }

  /**
   * Get dimension scores for an assessment
   */
  async getDimensionScores(assessmentId: string): Promise<DimensionScore[]> {
    const sql = `
      SELECT * FROM dimension_scores
      WHERE assessment_id = $1
      ORDER BY dimension ASC
    `;

    const result = await this.db.query<DimensionScore>(sql, [assessmentId]);
    return result.rows;
  }

  /**
   * Search assessments
   */
  async search(criteria: AssessmentSearchCriteria): Promise<Assessment[]> {
    let sql = `SELECT * FROM ${this.tableName} WHERE 1=1`;
    const params: any[] = [];

    if (criteria.company_id) {
      params.push(criteria.company_id);
      sql += ` AND company_id = $${params.length}`;
    }

    if (criteria.assessment_type) {
      params.push(criteria.assessment_type);
      sql += ` AND assessment_type = $${params.length}`;
    }

    if (criteria.from_date) {
      params.push(criteria.from_date);
      sql += ` AND assessed_at >= $${params.length}`;
    }

    if (criteria.to_date) {
      params.push(criteria.to_date);
      sql += ` AND assessed_at <= $${params.length}`;
    }

    if (criteria.min_score !== undefined) {
      params.push(criteria.min_score);
      sql += ` AND dii_final_score >= $${params.length}`;
    }

    if (criteria.max_score !== undefined) {
      params.push(criteria.max_score);
      sql += ` AND dii_final_score <= $${params.length}`;
    }

    sql += ` ORDER BY assessed_at DESC`;

    const result = await this.db.query<Assessment>(sql, params);
    return result.rows;
  }

  /**
   * Get assessment statistics
   */
  async getStatistics(companyId?: string): Promise<{
    total: number;
    byType: Record<string, number>;
    averageScore: number;
    scoreDistribution: {
      low: number;    // < 3
      medium: number; // 3-7
      high: number;   // > 7
    };
  }> {
    const baseWhere = companyId ? ` WHERE company_id = $1` : '';
    const params = companyId ? [companyId] : [];

    const sqls = {
      total: `SELECT COUNT(*) as count FROM ${this.tableName}${baseWhere}`,
      byType: `
        SELECT assessment_type, COUNT(*) as count 
        FROM ${this.tableName}${baseWhere}
        GROUP BY assessment_type
      `,
      averageScore: `
        SELECT AVG(dii_final_score) as avg_score 
        FROM ${this.tableName}${baseWhere}
        AND dii_final_score IS NOT NULL
      `,
      scoreDistribution: `
        SELECT 
          SUM(CASE WHEN dii_final_score < 3 THEN 1 ELSE 0 END) as low,
          SUM(CASE WHEN dii_final_score >= 3 AND dii_final_score <= 7 THEN 1 ELSE 0 END) as medium,
          SUM(CASE WHEN dii_final_score > 7 THEN 1 ELSE 0 END) as high
        FROM ${this.tableName}${baseWhere}
        AND dii_final_score IS NOT NULL
      `
    };

    try {
      const [total, typeStats, avgScore, distribution] = await Promise.all([
        this.db.queryScalar<number>(sqls.total, params),
        this.db.query<{ assessment_type: string; count: number }>(sqls.byType, params),
        this.db.queryScalar<number>(sqls.averageScore, params),
        this.db.queryOne<{ low: number; medium: number; high: number }>(sqls.scoreDistribution, params)
      ]);

      return {
        total: total || 0,
        byType: this.arrayToRecord(typeStats.rows, 'assessment_type', 'count'),
        averageScore: avgScore || 0,
        scoreDistribution: distribution || { low: 0, medium: 0, high: 0 }
      };
    } catch (error) {
      throw new DatabaseError(
        'Failed to get assessment statistics',
        'STATISTICS_FAILED',
        { companyId, error }
      );
    }
  }

  /**
   * Get dimension score statistics
   */
  async getDimensionStatistics(assessmentId: string): Promise<{
    dimensions: Record<DIIDimension, {
      value: number;
      confidence: number;
    }>;
    overallConfidence: number;
  }> {
    const sql = `
      SELECT 
        dimension,
        raw_value,
        confidence_score
      FROM dimension_scores
      WHERE assessment_id = $1
    `;

    const result = await this.db.query<{
      dimension: DIIDimension;
      raw_value: number;
      confidence_score: number;
    }>(sql, [assessmentId]);

    const dimensions: Record<string, { value: number; confidence: number }> = {};
    let totalConfidence = 0;
    let count = 0;

    for (const row of result.rows) {
      dimensions[row.dimension] = {
        value: row.raw_value,
        confidence: row.confidence_score || 0
      };
      totalConfidence += row.confidence_score || 0;
      count++;
    }

    return {
      dimensions: dimensions as Record<DIIDimension, { value: number; confidence: number }>,
      overallConfidence: count > 0 ? totalConfidence / count : 0
    };
  }

  /**
   * Helper to convert array to record
   */
  private arrayToRecord<T extends Record<string, any>>(
    array: T[],
    keyField: keyof T,
    valueField: keyof T
  ): Record<string, number> {
    const record: Record<string, number> = {};
    
    for (const item of array) {
      const key = String(item[keyField]);
      const value = Number(item[valueField]);
      record[key] = value;
    }

    return record;
  }
}