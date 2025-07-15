/**
 * Company Repository
 * Handles all company-related database operations
 */

import { BaseRepository } from './base.repository';
import { 
  Company, 
  CreateCompanyDto, 
  UpdateCompanyDto,
  CompanySearchCriteria,
  DIIBusinessModel
} from '../types/entities';
import { DatabaseError } from '../errors/database.error';

export class CompanyRepository extends BaseRepository<Company> {
  protected tableName = 'companies';
  protected primaryKey = 'id';

  /**
   * Create a new company
   */
  async createCompany(data: CreateCompanyDto): Promise<Company> {
    // Generate UUID if not using database default
    const companyData = {
      ...data,
      region: data.region || 'LATAM',
      created_at: new Date(),
      updated_at: new Date()
    };

    return this.create(companyData);
  }

  /**
   * Update a company
   */
  async updateCompany(id: string, data: UpdateCompanyDto): Promise<Company | null> {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    return this.update(id, updateData);
  }

  /**
   * Find company by domain
   */
  async findByDomain(domain: string): Promise<Company | null> {
    const sql = `SELECT * FROM ${this.tableName} WHERE domain = $1`;
    
    try {
      return await this.db.queryOne<Company>(sql, [domain]);
    } catch (error) {
      throw new DatabaseError(
        'Failed to find company by domain',
        'FIND_BY_DOMAIN_FAILED',
        { domain, error }
      );
    }
  }

  /**
   * Search companies by name (with fuzzy matching)
   */
  async searchByName(query: string, limit: number = 10): Promise<Company[]> {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE 
        LOWER(name) LIKE LOWER($1) OR
        LOWER(legal_name) LIKE LOWER($1) OR
        LOWER(domain) LIKE LOWER($1)
      ORDER BY 
        CASE 
          WHEN LOWER(name) = LOWER($2) THEN 1
          WHEN LOWER(name) LIKE LOWER($3) THEN 2
          ELSE 3
        END,
        name ASC
      LIMIT $4
    `;

    const searchPattern = `%${query}%`;
    const exactMatch = query;
    const startsWithPattern = `${query}%`;

    try {
      const result = await this.db.query<Company>(
        sql, 
        [searchPattern, exactMatch, startsWithPattern, limit]
      );
      return result.rows;
    } catch (error) {
      throw new DatabaseError(
        'Company search failed',
        'SEARCH_FAILED',
        { query, error }
      );
    }
  }

  /**
   * Advanced search with multiple criteria
   */
  async search(criteria: CompanySearchCriteria): Promise<Company[]> {
    let sql = `SELECT * FROM ${this.tableName} WHERE 1=1`;
    const params: any[] = [];

    if (criteria.name) {
      params.push(`%${criteria.name}%`);
      sql += ` AND (LOWER(name) LIKE LOWER($${params.length}) OR LOWER(legal_name) LIKE LOWER($${params.length}))`;
    }

    if (criteria.industry) {
      params.push(criteria.industry);
      sql += ` AND industry_traditional = $${params.length}`;
    }

    if (criteria.dii_business_model) {
      params.push(criteria.dii_business_model);
      sql += ` AND dii_business_model = $${params.length}`;
    }

    if (criteria.country) {
      params.push(criteria.country);
      sql += ` AND country = $${params.length}`;
    }

    if (criteria.region) {
      params.push(criteria.region);
      sql += ` AND region = $${params.length}`;
    }

    sql += ` ORDER BY name ASC`;

    try {
      const result = await this.db.query<Company>(sql, params);
      return result.rows;
    } catch (error) {
      throw new DatabaseError(
        'Advanced company search failed',
        'ADVANCED_SEARCH_FAILED',
        { criteria, error }
      );
    }
  }

  /**
   * Get companies by business model
   */
  async findByBusinessModel(model: DIIBusinessModel): Promise<Company[]> {
    return this.find({
      where: { dii_business_model: model },
      orderBy: 'name',
      orderDirection: 'ASC'
    });
  }

  /**
   * Get companies by region
   */
  async findByRegion(region: string): Promise<Company[]> {
    return this.find({
      where: { region },
      orderBy: 'name',
      orderDirection: 'ASC'
    });
  }

  /**
   * Get company statistics
   */
  async getStatistics(): Promise<{
    total: number;
    byBusinessModel: Record<string, number>;
    byRegion: Record<string, number>;
    byCountry: Record<string, number>;
  }> {
    const sqls = {
      total: `SELECT COUNT(*) as count FROM ${this.tableName}`,
      byBusinessModel: `
        SELECT dii_business_model, COUNT(*) as count 
        FROM ${this.tableName} 
        GROUP BY dii_business_model
      `,
      byRegion: `
        SELECT region, COUNT(*) as count 
        FROM ${this.tableName} 
        GROUP BY region
      `,
      byCountry: `
        SELECT country, COUNT(*) as count 
        FROM ${this.tableName} 
        WHERE country IS NOT NULL
        GROUP BY country
      `
    };

    try {
      const [total, modelStats, regionStats, countryStats] = await Promise.all([
        this.db.queryScalar<number>(sqls.total),
        this.db.query<{ dii_business_model: string; count: number }>(sqls.byBusinessModel),
        this.db.query<{ region: string; count: number }>(sqls.byRegion),
        this.db.query<{ country: string; count: number }>(sqls.byCountry)
      ]);

      return {
        total: total || 0,
        byBusinessModel: this.arrayToRecord(modelStats.rows, 'dii_business_model', 'count'),
        byRegion: this.arrayToRecord(regionStats.rows, 'region', 'count'),
        byCountry: this.arrayToRecord(countryStats.rows, 'country', 'count')
      };
    } catch (error) {
      throw new DatabaseError(
        'Failed to get company statistics',
        'STATISTICS_FAILED',
        { error }
      );
    }
  }

  /**
   * Check if company name exists
   */
  async nameExists(name: string, excludeId?: string): Promise<boolean> {
    let sql = `SELECT 1 FROM ${this.tableName} WHERE LOWER(name) = LOWER($1)`;
    const params: any[] = [name];

    if (excludeId) {
      params.push(excludeId);
      sql += ` AND id != $${params.length}`;
    }

    sql += ` LIMIT 1`;

    const result = await this.db.queryOne(sql, params);
    return result !== null;
  }

  /**
   * Bulk create companies (for imports)
   */
  async bulkCreate(companies: CreateCompanyDto[]): Promise<Company[]> {
    return this.transaction(async (trx) => {
      const created: Company[] = [];

      for (const company of companies) {
        const sql = `
          INSERT INTO ${this.tableName} 
          (name, legal_name, domain, industry_traditional, dii_business_model,
           confidence_score, classification_reasoning, headquarters, country,
           region, employees, revenue, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          RETURNING *
        `;

        const now = new Date();
        const params = [
          company.name,
          company.legal_name || null,
          company.domain || null,
          company.industry_traditional,
          company.dii_business_model || 'COMERCIO_HIBRIDO',
          company.confidence_score || null,
          company.classification_reasoning || null,
          company.headquarters || null,
          company.country || null,
          company.region || 'LATAM',
          company.employees || null,
          company.revenue || null,
          now,
          now
        ];

        const result = await trx.query<Company>(sql, params);
        if (result.rows[0]) {
          created.push(result.rows[0]);
        }
      }

      return created;
    });
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