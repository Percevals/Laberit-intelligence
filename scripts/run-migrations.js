#!/usr/bin/env node

/**
 * PostgreSQL Migration Runner
 * Executes SQL migration files in order and tracks which have been run
 */

const fs = require('fs').promises;
const path = require('path');
const { Client } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dii_dev',
  user: process.env.DB_USER || 'dii_user',
  password: process.env.DB_PASSWORD || 'dii_dev_password',
};

const connectionString = process.env.DATABASE_URL || 
  `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

const MIGRATIONS_DIR = path.join(__dirname, '..', 'database', 'migrations');

class MigrationRunner {
  constructor() {
    this.client = new Client({ connectionString });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('✅ Connected to database');
    } catch (err) {
      console.error('❌ Failed to connect to database:', err.message);
      throw err;
    }
  }

  async disconnect() {
    await this.client.end();
  }

  async ensureMigrationsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        migration_name VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await this.client.query(query);
    console.log('✅ Migrations table ready');
  }

  async getExecutedMigrations() {
    const query = 'SELECT migration_name FROM schema_migrations ORDER BY migration_name';
    const result = await this.client.query(query);
    return new Set(result.rows.map(row => row.migration_name));
  }

  async getMigrationFiles() {
    try {
      const files = await fs.readdir(MIGRATIONS_DIR);
      return files
        .filter(file => file.endsWith('.sql'))
        .sort(); // Ensures migrations run in order
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error(`❌ Migrations directory not found: ${MIGRATIONS_DIR}`);
        console.error('   Create the directory and add migration files.');
        return [];
      }
      throw err;
    }
  }

  async executeMigration(filename) {
    const filepath = path.join(MIGRATIONS_DIR, filename);
    
    console.log(`\n📄 Running migration: ${filename}`);
    
    try {
      // Read the SQL file
      const sql = await fs.readFile(filepath, 'utf8');
      
      // Start a transaction
      await this.client.query('BEGIN');
      
      try {
        // Execute the migration
        await this.client.query(sql);
        
        // Record that this migration has been executed
        // Only if it's not already recorded (some migrations self-record)
        const checkQuery = 'SELECT 1 FROM schema_migrations WHERE migration_name = $1';
        const checkResult = await this.client.query(checkQuery, [filename]);
        
        if (checkResult.rows.length === 0) {
          const recordQuery = 'INSERT INTO schema_migrations (migration_name) VALUES ($1)';
          await this.client.query(recordQuery, [filename]);
        }
        
        // Commit the transaction
        await this.client.query('COMMIT');
        
        console.log(`   ✅ Migration completed successfully`);
        return true;
      } catch (err) {
        // Rollback on error
        await this.client.query('ROLLBACK');
        throw err;
      }
    } catch (err) {
      console.error(`   ❌ Migration failed: ${err.message}`);
      
      // Log more details for common errors
      if (err.code === '42710') {
        console.error('   💡 Object already exists. This migration may have partially run before.');
      } else if (err.code === '42P07') {
        console.error('   💡 Table already exists. Check if migration was partially applied.');
      } else if (err.code === '42601') {
        console.error('   💡 SQL syntax error. Check the migration file.');
      }
      
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting PostgreSQL migrations...\n');
    
    try {
      await this.connect();
      await this.ensureMigrationsTable();
      
      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = await this.getMigrationFiles();
      
      console.log(`📊 Found ${migrationFiles.length} migration files`);
      console.log(`✅ Already executed: ${executedMigrations.size} migrations\n`);
      
      let newMigrations = 0;
      let failedMigrations = 0;
      
      for (const file of migrationFiles) {
        if (executedMigrations.has(file)) {
          console.log(`⏭️  Skipping ${file} (already executed)`);
        } else {
          const success = await this.executeMigration(file);
          if (success) {
            newMigrations++;
          } else {
            failedMigrations++;
            // Stop on first failure
            break;
          }
        }
      }
      
      console.log('\n📈 Migration Summary:');
      console.log(`   Total migrations: ${migrationFiles.length}`);
      console.log(`   Previously executed: ${executedMigrations.size}`);
      console.log(`   Newly executed: ${newMigrations}`);
      
      if (failedMigrations > 0) {
        console.log(`   ❌ Failed: ${failedMigrations}`);
        console.log('\n⚠️  Migration process stopped due to errors.');
        process.exit(1);
      } else if (newMigrations === 0) {
        console.log('\n✅ Database is already up to date!');
      } else {
        console.log('\n✅ All migrations completed successfully!');
      }
      
    } catch (err) {
      console.error('\n❌ Migration runner error:', err.message);
      process.exit(1);
    } finally {
      await this.disconnect();
    }
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
PostgreSQL Migration Runner

Usage:
  node run-migrations.js [options]

Options:
  --help, -h     Show this help message
  --status, -s   Show migration status without running migrations

Environment Variables:
  DB_HOST        Database host (default: localhost)
  DB_PORT        Database port (default: 5432)
  DB_NAME        Database name (default: dii_dev)
  DB_USER        Database user (default: dii_user)
  DB_PASSWORD    Database password (default: dii_dev_password)
  DATABASE_URL   Full connection string (overrides individual settings)

Examples:
  node run-migrations.js
  DB_HOST=production.db node run-migrations.js
  DATABASE_URL=postgresql://user:pass@host:5432/db node run-migrations.js
    `);
    return;
  }
  
  if (args.includes('--status') || args.includes('-s')) {
    // Just show status
    const runner = new MigrationRunner();
    try {
      await runner.connect();
      await runner.ensureMigrationsTable();
      
      const executedMigrations = await runner.getExecutedMigrations();
      const migrationFiles = await runner.getMigrationFiles();
      
      console.log('📊 Migration Status:\n');
      
      for (const file of migrationFiles) {
        const status = executedMigrations.has(file) ? '✅' : '⏳';
        console.log(`   ${status} ${file}`);
      }
      
      console.log(`\n   Total: ${migrationFiles.length} migrations`);
      console.log(`   Executed: ${executedMigrations.size}`);
      console.log(`   Pending: ${migrationFiles.length - executedMigrations.size}`);
      
      await runner.disconnect();
    } catch (err) {
      console.error('❌ Error checking status:', err.message);
      process.exit(1);
    }
    return;
  }
  
  // Run migrations
  const runner = new MigrationRunner();
  await runner.run();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MigrationRunner };