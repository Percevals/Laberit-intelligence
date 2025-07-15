#!/usr/bin/env node

/**
 * PostgreSQL Connection Test Script
 * Tests connection to the DII PostgreSQL database
 */

const { Client } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dii_dev',
  user: process.env.DB_USER || 'dii_user',
  password: process.env.DB_PASSWORD || 'dii_dev_password',
};

// Connection string alternative
const connectionString = process.env.DATABASE_URL || 
  `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

// Parse connection details from connection string for display
function parseConnectionString(connStr) {
  try {
    const url = new URL(connStr);
    return {
      host: url.hostname,
      port: url.port || 5432,
      database: url.pathname.slice(1),
      user: url.username,
      ssl: url.searchParams.get('sslmode') === 'require'
    };
  } catch (e) {
    return dbConfig;
  }
}

async function testConnection() {
  const isAzure = connectionString.includes('azure.com');
  const config = {
    connectionString,
    ...(isAzure && { ssl: { rejectUnauthorized: false } })
  };
  
  const client = new Client(config);
  const connDetails = parseConnectionString(connectionString);
  
  try {
    console.log('🔌 Attempting to connect to PostgreSQL...');
    console.log(`   Host: ${connDetails.host}:${connDetails.port}`);
    console.log(`   Database: ${connDetails.database}`);
    console.log(`   User: ${connDetails.user}`);
    if (connDetails.ssl || isAzure) {
      console.log('   SSL: Enabled (Azure PostgreSQL)');
    }
    console.log('');
    
    await client.connect();
    console.log('✅ Database connected successfully!');
    console.log('');
    
    // Test query - get PostgreSQL version
    const versionResult = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Version:');
    console.log(`   ${versionResult.rows[0].version}`);
    console.log('');
    
    // List all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    const tablesResult = await client.query(tablesQuery);
    
    if (tablesResult.rows.length === 0) {
      console.log('⚠️  No tables found. Have you run the migrations?');
      console.log('   Run: npm run migrate');
    } else {
      console.log(`📋 Found ${tablesResult.rows.length} tables:`);
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    console.log('');
    
    // List all custom types (ENUMs)
    const typesQuery = `
      SELECT typname 
      FROM pg_type 
      WHERE typtype = 'e' 
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
      ORDER BY typname;
    `;
    
    const typesResult = await client.query(typesQuery);
    
    if (typesResult.rows.length > 0) {
      console.log(`🏷️  Found ${typesResult.rows.length} custom types:`);
      typesResult.rows.forEach(row => {
        console.log(`   - ${row.typname}`);
      });
      console.log('');
    }
    
    // Check if UUID extension is installed
    const extensionQuery = `
      SELECT * 
      FROM pg_extension 
      WHERE extname = 'uuid-ossp';
    `;
    
    const extensionResult = await client.query(extensionQuery);
    
    if (extensionResult.rows.length > 0) {
      console.log('✅ UUID extension is installed');
    } else {
      console.log('⚠️  UUID extension not found. Migrations may fail.');
    }
    
    console.log('');
    console.log('🎉 All connection tests passed!');
    
  } catch (err) {
    console.error('❌ Connection failed!');
    console.error('   Error:', err.message);
    
    if (err.code === 'ECONNREFUSED') {
      console.error('');
      console.error('💡 Tips:');
      console.error('   - Is PostgreSQL running?');
      console.error('   - Check if Docker container is up: docker ps');
      console.error('   - Start PostgreSQL: docker-compose up -d postgres');
    } else if (err.code === '28P01') {
      console.error('');
      console.error('💡 Authentication failed. Check your credentials.');
    } else if (err.code === '3D000') {
      console.error('');
      console.error('💡 Database does not exist. Create it first:');
      console.error(`   CREATE DATABASE ${dbConfig.database};`);
    }
    
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the test
testConnection().catch(console.error);