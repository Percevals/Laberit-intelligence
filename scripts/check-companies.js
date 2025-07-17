#!/usr/bin/env node

const { Client } = require('pg');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dii_dev',
  user: process.env.DB_USER || 'dii_user',
  password: process.env.DB_PASSWORD || 'dii_secure_password'
};

async function checkCompanies() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    
    // Find bank-related companies
    const result = await client.query(`
      SELECT name, dii_business_model, confidence_score
      FROM companies
      WHERE verification_source = 'historical_migration'
      AND (LOWER(name) LIKE '%banco%' OR LOWER(name) LIKE '%bank%')
      ORDER BY name
      LIMIT 20
    `);
    
    console.log(`Found ${result.rows.length} bank-related companies:\n`);
    result.rows.forEach(row => {
      console.log(`- ${row.name} (${row.dii_business_model}, ${(row.confidence_score * 100).toFixed(1)}%)`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkCompanies();