#!/usr/bin/env node

/**
 * Full Historical Data Migration Script
 * Migrates 150 companies from CSV to PostgreSQL using DII v4 classifier
 * Features: Transactions, progress tracking, error handling, detailed reporting
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const Papa = require('papaparse');
const iconv = require('iconv-lite');

// Import the DII classifier logic
const { EnhancedV3toV4Migrator } = require('./test-migration-v3-to-v4-with-classifier');

// Configuration
const CSV_FILE_PATH = path.join(__dirname, '../data/historical_DB_report.csv');
const REPORT_FILE_PATH = path.join(__dirname, '../data/migration_report.json');
const REVIEW_QUEUE_PATH = path.join(__dirname, '../data/review_queue.csv');

// Database configuration from environment
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dii_dev',
  user: process.env.DB_USER || 'dii_user',
  password: process.env.DB_PASSWORD || 'dii_secure_password'
};

// Progress bar helper
class ProgressBar {
  constructor(total) {
    this.total = total;
    this.current = 0;
    this.barLength = 40;
  }

  update(current, message = '') {
    this.current = current;
    const progress = this.current / this.total;
    const filledLength = Math.round(this.barLength * progress);
    const bar = '█'.repeat(filledLength) + '░'.repeat(this.barLength - filledLength);
    const percentage = Math.round(progress * 100);
    
    process.stdout.write(`\r[${bar}] ${this.current}/${this.total} (${percentage}%) ${message}`);
    
    if (this.current === this.total) {
      process.stdout.write('\n');
    }
  }
}

// Migration report
class MigrationReport {
  constructor() {
    this.timestamp = new Date().toISOString();
    this.totalCompanies = 0;
    this.successCount = 0;
    this.errorCount = 0;
    this.warningCount = 0;
    this.modelDistribution = {};
    this.confidenceScores = [];
    this.reviewQueue = [];
    this.errors = [];
    this.startTime = Date.now();
  }

  addSuccess(company, model, confidence) {
    this.successCount++;
    this.modelDistribution[model] = (this.modelDistribution[model] || 0) + 1;
    this.confidenceScores.push(confidence);
    
    if (confidence < 0.7) {
      this.warningCount++;
      this.reviewQueue.push({
        id: company.Company_ID,
        name: company.Real_Company_Name,
        model,
        confidence,
        reason: 'Low confidence score'
      });
    }
  }

  addError(company, error) {
    this.errorCount++;
    this.errors.push({
      id: company.Company_ID,
      name: company.Real_Company_Name,
      error: error.message
    });
  }

  getAverageConfidence() {
    if (this.confidenceScores.length === 0) return 0;
    const sum = this.confidenceScores.reduce((a, b) => a + b, 0);
    return sum / this.confidenceScores.length;
  }

  getDuration() {
    return ((Date.now() - this.startTime) / 1000).toFixed(2) + 's';
  }

  generateSummary() {
    return {
      timestamp: this.timestamp,
      duration: this.getDuration(),
      totalCompanies: this.totalCompanies,
      successCount: this.successCount,
      errorCount: this.errorCount,
      warningCount: this.warningCount,
      modelDistribution: this.modelDistribution,
      averageConfidence: this.getAverageConfidence(),
      reviewQueueCount: this.reviewQueue.length,
      reviewQueue: this.reviewQueue,
      errors: this.errors
    };
  }
}

// Main migration class
class HistoricalDataMigrator {
  constructor() {
    this.client = new Client(dbConfig);
    this.migrator = new EnhancedV3toV4Migrator();
    this.report = new MigrationReport();
    this.progressBar = null;
  }

  async connect() {
    console.log('🔌 Connecting to PostgreSQL...');
    try {
      await this.client.connect();
      console.log('✅ Connected to database\n');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error.message);
      console.log('\n💡 Make sure PostgreSQL is running:');
      console.log('   docker-compose up -d postgres');
      throw error;
    }
  }

  async validateSchema() {
    console.log('🔍 Validating database schema...');
    
    try {
      // Check if companies table exists
      const tableCheck = await this.client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'companies'
        );
      `);
      
      if (!tableCheck.rows[0].exists) {
        throw new Error('Companies table does not exist. Run migrations first: npm run migrate');
      }

      // Check for required columns
      const columnCheck = await this.client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'companies'
        AND column_name IN (
          'id', 'name', 'dii_business_model', 'confidence_score',
          'legacy_dii_id', 'migration_confidence', 'framework_version'
        );
      `);

      if (columnCheck.rows.length < 7) {
        throw new Error('Missing required columns. Check schema alignment.');
      }

      console.log('✅ Schema validation passed\n');
    } catch (error) {
      console.error('❌ Schema validation failed:', error.message);
      throw error;
    }
  }

  async checkExistingData() {
    console.log('🔍 Checking for existing migration data...');
    
    const result = await this.client.query(`
      SELECT COUNT(*) as count 
      FROM companies 
      WHERE verification_source = 'historical_migration'
    `);
    
    const existingCount = parseInt(result.rows[0].count);
    
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing migrated companies`);
      const answer = await this.promptUser('Do you want to delete existing data and re-migrate? (yes/no): ');
      
      if (answer.toLowerCase() === 'yes') {
        await this.client.query(`
          DELETE FROM companies 
          WHERE verification_source = 'historical_migration'
        `);
        console.log('✅ Existing data deleted\n');
      } else {
        throw new Error('Migration cancelled by user');
      }
    } else {
      console.log('✅ No existing migration data found\n');
    }
  }

  promptUser(question) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  prepareCompanyData(company, classification) {
    // Calculate average DII score
    const diiScore = (
      parseFloat(company.AER) +
      parseFloat(company.HFP) +
      parseFloat(company.BRI) +
      parseFloat(company.TRD) +
      parseFloat(company.RRG)
    ) / 5;

    // Infer domain from company name
    const domain = this.inferDomain(company.Real_Company_Name);

    return {
      id: company.Company_ID,
      name: company.Real_Company_Name,
      domain: domain,
      industry_traditional: company.Real_Industry,
      dii_business_model: classification.proposedModel,
      confidence_score: classification.confidence,
      classification_reasoning: classification.reasoning.join('; '),
      headquarters: company.Real_Country,
      country: company.Real_Country,
      region: this.getRegion(company.Real_Country),
      employees: parseInt(company.Employee_Count) || 0,
      revenue: 0, // Not in CSV
      last_verified: new Date(),
      verification_source: 'historical_migration',
      data_freshness_days: 0,
      is_prospect: false,
      
      // Historical tracking
      legacy_dii_id: parseInt(company.Company_ID),
      original_dii_score: diiScore,
      migration_confidence: classification.confidence,
      framework_version: 'v4.0',
      migration_date: new Date(),
      needs_reassessment: classification.confidence < 0.7,
      data_completeness: 1.0,
      has_zt_maturity: false
    };
  }

  inferDomain(companyName) {
    // Simple domain inference
    const cleanName = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    return cleanName ? `${cleanName}.com` : null;
  }

  getRegion(country) {
    const regions = {
      'Brazil': 'South America',
      'Argentina': 'South America',
      'Chile': 'South America',
      'Colombia': 'South America',
      'Peru': 'South America',
      'Ecuador': 'South America',
      'Uruguay': 'South America',
      'Venezuela': 'South America',
      'Mexico': 'North America',
      'United States': 'North America',
      'Canada': 'North America',
      'Guatemala': 'Central America',
      'El Salvador': 'Central America',
      'Honduras': 'Central America',
      'Costa Rica': 'Central America',
      'Panama': 'Central America',
      'Dominican Republic': 'Caribbean',
      'Puerto Rico': 'Caribbean',
      'Paraguay': 'South America'
    };
    return regions[country] || 'Unknown';
  }

  async migrateCompanies(companies) {
    console.log(`\n🚀 Starting migration of ${companies.length} companies...\n`);
    
    this.report.totalCompanies = companies.length;
    this.progressBar = new ProgressBar(companies.length);
    
    // Start transaction
    await this.client.query('BEGIN');
    
    try {
      for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        
        try {
          // Classify company
          const classification = this.migrator.classifyCompany(company);
          
          // Prepare data
          const data = this.prepareCompanyData(company, classification);
          
          // Insert into database
          const query = `
            INSERT INTO companies (
              id, name, domain, industry_traditional, dii_business_model,
              confidence_score, classification_reasoning, headquarters,
              country, region, employees, revenue, last_verified,
              verification_source, data_freshness_days, is_prospect,
              legacy_dii_id, original_dii_score, migration_confidence,
              framework_version, migration_date, needs_reassessment,
              data_completeness, has_zt_maturity
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
              $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
            )
          `;
          
          const values = [
            data.id, data.name, data.domain, data.industry_traditional,
            data.dii_business_model, data.confidence_score,
            data.classification_reasoning, data.headquarters,
            data.country, data.region, data.employees, data.revenue,
            data.last_verified, data.verification_source,
            data.data_freshness_days, data.is_prospect,
            data.legacy_dii_id, data.original_dii_score,
            data.migration_confidence, data.framework_version,
            data.migration_date, data.needs_reassessment,
            data.data_completeness, data.has_zt_maturity
          ];
          
          await this.client.query(query, values);
          
          this.report.addSuccess(company, data.dii_business_model, data.confidence_score);
          
          const status = data.confidence_score < 0.7 ? '⚠️' : '✅';
          this.progressBar.update(i + 1, `${status} ${company.Real_Company_Name}`);
          
        } catch (error) {
          this.report.addError(company, error);
          this.progressBar.update(i + 1, `❌ ${company.Real_Company_Name}: ${error.message}`);
          
          // Continue with next company instead of failing entire migration
          console.error(`\n❌ Error migrating ${company.Real_Company_Name}:`, error.message);
        }
      }
      
      // Commit transaction
      await this.client.query('COMMIT');
      console.log('\n\n✅ Migration transaction committed successfully!');
      
    } catch (error) {
      // Rollback on any error
      await this.client.query('ROLLBACK');
      console.error('\n\n❌ Migration failed, rolling back:', error.message);
      throw error;
    }
  }

  async generateReports() {
    console.log('\n📊 Generating migration reports...');
    
    // Save JSON report
    const summary = this.report.generateSummary();
    fs.writeFileSync(REPORT_FILE_PATH, JSON.stringify(summary, null, 2));
    console.log(`✅ Migration report saved to: ${REPORT_FILE_PATH}`);
    
    // Save review queue as CSV
    if (this.report.reviewQueue.length > 0) {
      const csvContent = Papa.unparse(this.report.reviewQueue);
      fs.writeFileSync(REVIEW_QUEUE_PATH, csvContent);
      console.log(`✅ Review queue saved to: ${REVIEW_QUEUE_PATH}`);
    }
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY\n');
    console.log(`Duration: ${summary.duration}`);
    console.log(`Total Companies: ${summary.totalCompanies}`);
    console.log(`Success: ${summary.successCount} (${(summary.successCount/summary.totalCompanies*100).toFixed(1)}%)`);
    console.log(`Errors: ${summary.errorCount}`);
    console.log(`Warnings: ${summary.warningCount}`);
    console.log(`Average Confidence: ${(summary.averageConfidence * 100).toFixed(1)}%`);
    console.log(`Requires Review: ${summary.reviewQueueCount}`);
    
    console.log('\nBusiness Model Distribution:');
    Object.entries(summary.modelDistribution)
      .sort((a, b) => b[1] - a[1])
      .forEach(([model, count]) => {
        const percentage = (count / summary.successCount * 100).toFixed(1);
        console.log(`  ${model}: ${count} (${percentage}%)`);
      });
    
    if (summary.errors.length > 0) {
      console.log('\n❌ Migration Errors:');
      summary.errors.forEach(err => {
        console.log(`  - ${err.name} (ID: ${err.id}): ${err.error}`);
      });
    }
  }

  async verifyMigration() {
    console.log('\n🔍 Verifying migration...');
    
    // Count migrated records
    const countResult = await this.client.query(`
      SELECT COUNT(*) as count 
      FROM companies 
      WHERE verification_source = 'historical_migration'
    `);
    
    const migratedCount = parseInt(countResult.rows[0].count);
    console.log(`✅ Found ${migratedCount} migrated companies in database`);
    
    // Check model distribution
    const modelResult = await this.client.query(`
      SELECT dii_business_model, COUNT(*) as count 
      FROM companies 
      WHERE verification_source = 'historical_migration'
      GROUP BY dii_business_model
      ORDER BY count DESC
    `);
    
    console.log('\nDatabase Model Distribution:');
    modelResult.rows.forEach(row => {
      console.log(`  ${row.dii_business_model}: ${row.count}`);
    });
    
    // Check confidence distribution
    const confidenceResult = await this.client.query(`
      SELECT 
        AVG(confidence_score) as avg_confidence,
        MIN(confidence_score) as min_confidence,
        MAX(confidence_score) as max_confidence,
        COUNT(CASE WHEN confidence_score < 0.7 THEN 1 END) as low_confidence_count
      FROM companies 
      WHERE verification_source = 'historical_migration'
    `);
    
    const stats = confidenceResult.rows[0];
    console.log('\nConfidence Statistics:');
    console.log(`  Average: ${(parseFloat(stats.avg_confidence) * 100).toFixed(1)}%`);
    console.log(`  Min: ${(parseFloat(stats.min_confidence) * 100).toFixed(1)}%`);
    console.log(`  Max: ${(parseFloat(stats.max_confidence) * 100).toFixed(1)}%`);
    console.log(`  Low confidence (<70%): ${stats.low_confidence_count}`);
  }

  async disconnect() {
    await this.client.end();
    console.log('\n🔌 Disconnected from database');
  }

  async run() {
    try {
      // Connect to database
      await this.connect();
      
      // Validate schema
      await this.validateSchema();
      
      // Check existing data
      await this.checkExistingData();
      
      // Read and parse CSV
      console.log('📁 Reading historical data...');
      const fileBuffer = fs.readFileSync(CSV_FILE_PATH);
      const fileContent = iconv.decode(fileBuffer, 'cp1252');
      
      const parseResult = Papa.parse(fileContent, {
        delimiter: ';',
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value) => value.trim()
      });
      
      if (parseResult.errors.length > 0) {
        console.error('⚠️ CSV parsing errors:', parseResult.errors);
      }
      
      console.log(`✅ Loaded ${parseResult.data.length} companies from CSV\n`);
      
      // Run migration
      await this.migrateCompanies(parseResult.data);
      
      // Generate reports
      await this.generateReports();
      
      // Verify migration
      await this.verifyMigration();
      
      // Disconnect
      await this.disconnect();
      
      console.log('\n✅ Migration completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Review companies in review_queue.csv');
      console.log('2. Test assessment engine with migrated companies');
      console.log('3. Update any low-confidence classifications');
      
    } catch (error) {
      console.error('\n❌ Migration failed:', error);
      await this.disconnect();
      process.exit(1);
    }
  }
}

// Run migration
if (require.main === module) {
  const migrator = new HistoricalDataMigrator();
  migrator.run();
}

module.exports = { HistoricalDataMigrator };