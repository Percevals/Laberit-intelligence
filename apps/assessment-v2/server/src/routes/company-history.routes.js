import express from 'express';
import pool from '../database/connection.js';

const router = express.Router();

/**
 * Create history record
 */
router.post('/', async (req, res) => {
  try {
    const {
      company_id,
      framework_version,
      dii_score,
      dii_stage,
      dimensions,
      assessment_type,
      recorded_at,
      source,
      metadata
    } = req.body;

    const result = await pool.query(
      `INSERT INTO company_history 
       (company_id, framework_version, dii_score, dii_stage, dimensions, 
        assessment_type, recorded_at, source, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        company_id,
        framework_version,
        dii_score,
        dii_stage,
        JSON.stringify(dimensions),
        assessment_type,
        recorded_at,
        source,
        JSON.stringify(metadata || {})
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating history record:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all historical data for dashboard
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        ch.*,
        c.name as company_name,
        c.legacy_dii_id,
        c.original_dii_score,
        c.migration_confidence,
        c.has_zt_maturity,
        c.country,
        c.industry_traditional,
        c.dii_business_model
      FROM company_history ch
      JOIN companies c ON ch.company_id = c.id
      ORDER BY ch.recorded_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all history:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get company history
 */
router.get('/company/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const { framework_version } = req.query;

    let query = `
      SELECT * FROM company_history 
      WHERE company_id = $1
    `;
    const params = [companyId];

    if (framework_version) {
      query += ' AND framework_version = $2';
      params.push(framework_version);
    }

    query += ' ORDER BY recorded_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching company history:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get latest scores for all companies
 */
router.get('/latest-scores', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM company_latest_scores ORDER BY company_id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching latest scores:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get score trends
 */
router.get('/trends/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    
    const result = await pool.query(`
      SELECT 
        framework_version,
        dii_score,
        dii_stage,
        dimensions,
        recorded_at
      FROM company_history
      WHERE company_id = $1
      ORDER BY recorded_at ASC
    `, [companyId]);

    // Calculate trends
    const history = result.rows;
    const trends = {
      score_evolution: history.map(h => ({
        date: h.recorded_at,
        score: parseFloat(h.dii_score),
        framework: h.framework_version
      })),
      dimension_trends: {},
      stage_progression: history.map(h => ({
        date: h.recorded_at,
        stage: h.dii_stage
      }))
    };

    // Calculate dimension trends
    if (history.length > 0) {
      const dimensions = ['AER', 'HFP', 'BRI', 'TRD', 'RRG'];
      dimensions.forEach(dim => {
        trends.dimension_trends[dim] = history
          .filter(h => h.dimensions && h.dimensions[dim])
          .map(h => ({
            date: h.recorded_at,
            value: h.dimensions[dim]
          }));
      });
    }

    res.json(trends);
  } catch (error) {
    console.error('Error calculating trends:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;