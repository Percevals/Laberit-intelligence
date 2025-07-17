#!/usr/bin/env node

/**
 * Mock Historical Data Migration Script
 * Tests the migration process without requiring a real database
 * Generates SQL file and reports for review
 */

const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const iconv = require('iconv-lite');

// Import the DII classifier logic
const { EnhancedV3toV4Migrator } = require('./test-migration-v3-to-v4-with-classifier');

// Configuration
const CSV_FILE_PATH = path.join(__dirname, '../data/historical_DB_report.csv');
const SQL_FILE_PATH = path.join(__dirname, '../data/migration.sql');
const REPORT_FILE_PATH = path.join(__dirname, '../data/migration_report_mock.json');
const REVIEW_QUEUE_PATH = path.join(__dirname, '../data/review_queue_mock.csv');

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

// Migration report (same as before)
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

// Mock migration class
class MockHistoricalDataMigrator {
  constructor() {
    this.migrator = new EnhancedV3toV4Migrator();
    this.report = new MigrationReport();
    this.progressBar = null;
    this.sqlStatements = [];
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
      revenue: 0,
      last_verified: new Date().toISOString(),
      verification_source: 'historical_migration',
      data_freshness_days: 0,
      is_prospect: false,
      legacy_dii_id: parseInt(company.Company_ID),
      original_dii_score: diiScore.toFixed(2),
      migration_confidence: classification.confidence,
      framework_version: 'v4.0',
      migration_date: new Date().toISOString(),
      needs_reassessment: classification.confidence < 0.7,
      data_completeness: 1.0,
      has_zt_maturity: false
    };
  }

  inferDomain(companyName) {
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

  generateSQL(data) {
    const escapeString = (str) => {
      if (str === null || str === undefined) return 'NULL';
      return `'${String(str).replace(/'/g, "''")}'`;
    };

    const values = [
      data.id,
      escapeString(data.name),
      escapeString(data.domain),
      escapeString(data.industry_traditional),
      escapeString(data.dii_business_model),
      data.confidence_score,
      escapeString(data.classification_reasoning),
      escapeString(data.headquarters),
      escapeString(data.country),
      escapeString(data.region),
      data.employees,
      data.revenue,
      escapeString(data.last_verified),
      escapeString(data.verification_source),
      data.data_freshness_days,
      data.is_prospect,
      data.legacy_dii_id,
      data.original_dii_score,
      data.migration_confidence,
      escapeString(data.framework_version),
      escapeString(data.migration_date),
      data.needs_reassessment,
      data.data_completeness,
      data.has_zt_maturity
    ];

    return `INSERT INTO companies (
  id, name, domain, industry_traditional, dii_business_model,
  confidence_score, classification_reasoning, headquarters,
  country, region, employees, revenue, last_verified,
  verification_source, data_freshness_days, is_prospect,
  legacy_dii_id, original_dii_score, migration_confidence,
  framework_version, migration_date, needs_reassessment,
  data_completeness, has_zt_maturity
) VALUES (
  ${values.join(', ')}
);`;
  }

  async migrateCompanies(companies) {
    console.log(`\n🚀 Starting MOCK migration of ${companies.length} companies...\n`);
    
    this.report.totalCompanies = companies.length;
    this.progressBar = new ProgressBar(companies.length);
    
    // Add transaction start
    this.sqlStatements.push('-- DII Historical Data Migration SQL');
    this.sqlStatements.push(`-- Generated: ${new Date().toISOString()}`);
    this.sqlStatements.push('-- Total Companies: ' + companies.length);
    this.sqlStatements.push('');
    this.sqlStatements.push('BEGIN;');
    this.sqlStatements.push('');
    
    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      
      try {
        // Classify company
        const classification = this.migrator.classifyCompany(company);
        
        // Prepare data
        const data = this.prepareCompanyData(company, classification);
        
        // Generate SQL
        const sql = this.generateSQL(data);
        this.sqlStatements.push(`-- Company: ${company.Real_Company_Name} (${data.dii_business_model} - ${(data.confidence_score * 100).toFixed(1)}%)`);
        this.sqlStatements.push(sql);
        this.sqlStatements.push('');
        
        this.report.addSuccess(company, data.dii_business_model, data.confidence_score);
        
        const status = data.confidence_score < 0.7 ? '⚠️' : '✅';
        this.progressBar.update(i + 1, `${status} ${company.Real_Company_Name}`);
        
      } catch (error) {
        this.report.addError(company, error);
        this.progressBar.update(i + 1, `❌ ${company.Real_Company_Name}: ${error.message}`);
        console.error(`\n❌ Error processing ${company.Real_Company_Name}:`, error.message);
      }
    }
    
    // Add transaction commit
    this.sqlStatements.push('COMMIT;');
    this.sqlStatements.push('');
    this.sqlStatements.push('-- Migration Summary:');
    this.sqlStatements.push(`-- Success: ${this.report.successCount}`);
    this.sqlStatements.push(`-- Errors: ${this.report.errorCount}`);
    this.sqlStatements.push(`-- Average Confidence: ${(this.report.getAverageConfidence() * 100).toFixed(1)}%`);
  }

  async generateReports() {
    console.log('\n📊 Generating migration reports...');
    
    // Save SQL file
    fs.writeFileSync(SQL_FILE_PATH, this.sqlStatements.join('\n'));
    console.log(`✅ SQL migration script saved to: ${SQL_FILE_PATH}`);
    
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
    console.log('📊 MOCK MIGRATION SUMMARY\n');
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

  async run() {
    try {
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
      
      console.log('\n✅ Mock migration completed successfully!');
      console.log('\n📋 Generated files:');
      console.log(`1. SQL script: ${SQL_FILE_PATH}`);
      console.log(`2. Migration report: ${REPORT_FILE_PATH}`);
      if (this.report.reviewQueue.length > 0) {
        console.log(`3. Review queue: ${REVIEW_QUEUE_PATH}`);
      }
      console.log('\n📋 Next steps:');
      console.log('1. Review the generated SQL file');
      console.log('2. Set up PostgreSQL using Docker or local installation');
      console.log('3. Run the SQL script: psql -U dii_user -d dii_dev -f data/migration.sql');
      console.log('4. Review companies in review queue');
      
    } catch (error) {
      console.error('\n❌ Mock migration failed:', error);
      process.exit(1);
    }
  }
}

// Run migration
if (require.main === module) {
  console.log('🔍 Running in MOCK mode (no database required)');
  const migrator = new MockHistoricalDataMigrator();
  migrator.run();
}

module.exports = { MockHistoricalDataMigrator };