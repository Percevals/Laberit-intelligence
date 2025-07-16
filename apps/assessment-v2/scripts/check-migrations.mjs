import pg from 'pg';
const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require';

const client = new Client({ connectionString });

async function checkMigrations() {
  try {
    await client.connect();
    
    // Check migrations table
    console.log('📋 Executed migrations:');
    const migrations = await client.query('SELECT * FROM migrations ORDER BY executed_at');
    console.table(migrations.rows);
    
    // Check if columns exist
    console.log('\n🔍 Checking for historical columns in companies table:');
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'companies' 
      AND column_name IN ('legacy_dii_id', 'original_dii_score', 'migration_confidence', 'has_zt_maturity')
    `);
    console.table(columns.rows);
    
    // Check if company_history table exists
    console.log('\n📊 Checking for company_history table:');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'company_history'
    `);
    console.log(tables.rows.length > 0 ? '✅ company_history table exists' : '❌ company_history table NOT found');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkMigrations();