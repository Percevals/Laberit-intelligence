#!/usr/bin/env node

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 
  'postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require';

async function clearDatabase() {
  const isAzure = connectionString.includes('azure.com');
  const config = {
    connectionString,
    ...(isAzure && { ssl: { rejectUnauthorized: false } })
  };
  
  const client = new Client(config);
  
  try {
    await client.connect();
    await client.query('DELETE FROM companies');
    console.log('✅ Cleared all companies and related data');
  } catch (error) {
    console.error('❌ Failed to clear database:', error.message);
  } finally {
    await client.end();
  }
}

clearDatabase();