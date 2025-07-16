import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require';

const client = new Client({ connectionString });

async function checkHistoryData() {
  try {
    await client.connect();
    
    // Check company_history table content
    console.log('📋 Company History Records:');
    const history = await client.query('SELECT COUNT(*) FROM company_history');
    console.log(`Total history records: ${history.rows[0].count}`);
    
    if (parseInt(history.rows[0].count) > 0) {
      const sample = await client.query('SELECT * FROM company_history LIMIT 3');
      console.table(sample.rows);
    }
    
    // Check companies with historical fields
    console.log('\n🏢 Companies with legacy data:');
    const companies = await client.query(`
      SELECT 
        name, 
        legacy_dii_id, 
        original_dii_score, 
        migration_confidence,
        has_zt_maturity
      FROM companies 
      WHERE legacy_dii_id IS NOT NULL 
      LIMIT 5
    `);
    console.table(companies.rows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkHistoryData();