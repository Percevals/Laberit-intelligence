import pool from '../database/connection.js';

export class CompanyRepository {
  async findAll(filters = {}) {
    let query = 'SELECT * FROM companies WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filters.search) {
      query += ` AND (name ILIKE $${paramCount} OR domain ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    if (filters.businessModel && filters.businessModel !== 'all') {
      query += ` AND dii_business_model = $${paramCount}`;
      params.push(filters.businessModel);
      paramCount++;
    }

    if (filters.isProspect !== undefined) {
      query += ` AND is_prospect = $${paramCount}`;
      params.push(filters.isProspect);
      paramCount++;
    }

    query += ' ORDER BY updated_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM companies WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findByDomain(domain) {
    const result = await pool.query(
      'SELECT * FROM companies WHERE domain = $1',
      [domain]
    );
    return result.rows[0] || null;
  }

  async findByLegacyId(legacyId) {
    const result = await pool.query(
      'SELECT * FROM companies WHERE legacy_dii_id = $1',
      [parseInt(legacyId)]
    );
    return result.rows;
  }

  async create(companyData) {
    const {
      name,
      legal_name,
      domain,
      industry_traditional,
      dii_business_model,
      confidence_score,
      classification_reasoning,
      headquarters,
      country,
      region,
      employees,
      revenue,
      last_verified,
      verification_source,
      data_freshness_days,
      is_prospect,
      // Historical tracking fields
      legacy_dii_id,
      original_dii_score,
      migration_confidence,
      framework_version,
      migration_date,
      needs_reassessment,
      data_completeness,
      has_zt_maturity
    } = companyData;

    const result = await pool.query(
      `INSERT INTO companies (
        name, legal_name, domain, industry_traditional, dii_business_model,
        confidence_score, classification_reasoning, headquarters, country, region,
        employees, revenue, last_verified, verification_source, 
        data_freshness_days, is_prospect, legacy_dii_id, original_dii_score,
        migration_confidence, framework_version, migration_date, needs_reassessment,
        data_completeness, has_zt_maturity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      RETURNING *`,
      [
        name, legal_name, domain, industry_traditional, dii_business_model,
        confidence_score, classification_reasoning, headquarters, country, region,
        employees, revenue, last_verified || new Date(), verification_source || 'manual',
        data_freshness_days || 90, is_prospect || false,
        legacy_dii_id, original_dii_score, migration_confidence, framework_version,
        migration_date, needs_reassessment, data_completeness, has_zt_maturity
      ]
    );

    return result.rows[0];
  }

  async update(id, updateData) {
    // Build dynamic update query
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClause = fields.map((field, index) => 
      `${field} = $${index + 2}`
    ).join(', ');

    const query = `
      UPDATE companies 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM companies WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  async bulkCreate(companies) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      const created = [];

      for (const company of companies) {
        const result = await client.query(
          `INSERT INTO companies (
            name, legal_name, domain, industry_traditional, dii_business_model,
            confidence_score, classification_reasoning, headquarters, country, region,
            employees, revenue, last_verified, verification_source, 
            data_freshness_days, is_prospect
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          RETURNING *`,
          [
            company.name,
            company.legal_name || company.name,
            company.domain,
            company.industry_traditional,
            company.dii_business_model,
            company.confidence_score,
            company.classification_reasoning,
            company.headquarters,
            company.country,
            company.region || 'LATAM',
            company.employees,
            company.revenue,
            company.last_verified || new Date(),
            company.verification_source || 'csv_import',
            company.data_freshness_days || 90,
            company.is_prospect !== undefined ? company.is_prospect : true
          ]
        );
        created.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return created;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateVerification(id, source) {
    const result = await pool.query(
      `UPDATE companies 
       SET last_verified = CURRENT_TIMESTAMP, 
           verification_source = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, source]
    );
    return result.rows[0];
  }

  async getStaleCompanies(limit = 10) {
    const result = await pool.query(
      `SELECT * FROM companies 
       WHERE last_verified < CURRENT_TIMESTAMP - INTERVAL '1 day' * data_freshness_days
       ORDER BY last_verified ASC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}