#!/usr/bin/env node

/**
 * Assessment Engine Integration Test
 * Verifies that the assessment engine can query migrated companies
 */

const { Client } = require('pg');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dii_dev',
  user: process.env.DB_USER || 'dii_user',
  password: process.env.DB_PASSWORD || 'dii_secure_password'
};

class AssessmentIntegrationTester {
  constructor() {
    this.client = new Client(dbConfig);
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async connect() {
    console.log('🔌 Connecting to PostgreSQL...');
    try {
      await this.client.connect();
      console.log('✅ Connected to database\n');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error.message);
      throw error;
    }
  }

  async runTest(name, testFn) {
    console.log(`🧪 ${name}...`);
    try {
      const result = await testFn();
      this.testResults.passed++;
      this.testResults.tests.push({ name, status: 'passed', result });
      console.log(`   ✅ Passed\n`);
      return result;
    } catch (error) {
      this.testResults.failed++;
      this.testResults.tests.push({ name, status: 'failed', error: error.message });
      console.log(`   ❌ Failed: ${error.message}\n`);
      throw error;
    }
  }

  async testMigratedCompaniesExist() {
    return this.runTest('Verify migrated companies exist', async () => {
      const result = await this.client.query(`
        SELECT COUNT(*) as count 
        FROM companies 
        WHERE verification_source = 'historical_migration'
      `);
      
      const count = parseInt(result.rows[0].count);
      if (count === 0) {
        throw new Error('No migrated companies found');
      }
      
      console.log(`   Found ${count} migrated companies`);
      return count;
    });
  }

  async testCompanySearch() {
    return this.runTest('Test company search functionality', async () => {
      // Test exact name search
      const exactSearch = await this.client.query(`
        SELECT id, name, dii_business_model, confidence_score
        FROM companies
        WHERE LOWER(name) = LOWER($1)
        AND verification_source = 'historical_migration'
      `, ['Banco Galicia']);
      
      if (exactSearch.rows.length === 0) {
        throw new Error('Company not found by exact name search');
      }
      
      console.log(`   Found company: ${exactSearch.rows[0].name}`);
      console.log(`   Model: ${exactSearch.rows[0].dii_business_model}`);
      console.log(`   Confidence: ${(exactSearch.rows[0].confidence_score * 100).toFixed(1)}%`);
      
      // Test partial name search
      const partialSearch = await this.client.query(`
        SELECT COUNT(*) as count
        FROM companies
        WHERE LOWER(name) LIKE LOWER($1)
        AND verification_source = 'historical_migration'
      `, ['%banco%']);
      
      console.log(`   Partial search 'banco': ${partialSearch.rows[0].count} results`);
      
      return { exact: exactSearch.rows[0], partial: partialSearch.rows[0].count };
    });
  }

  async testBusinessModelFilter() {
    return this.runTest('Test business model filtering', async () => {
      const modelCounts = await this.client.query(`
        SELECT 
          dii_business_model,
          COUNT(*) as count,
          AVG(confidence_score) as avg_confidence
        FROM companies
        WHERE verification_source = 'historical_migration'
        GROUP BY dii_business_model
        ORDER BY count DESC
      `);
      
      console.log('   Business model distribution:');
      modelCounts.rows.forEach(row => {
        console.log(`   - ${row.dii_business_model}: ${row.count} companies (avg confidence: ${(row.avg_confidence * 100).toFixed(1)}%)`);
      });
      
      return modelCounts.rows;
    });
  }

  async testCountryFilter() {
    return this.runTest('Test country filtering', async () => {
      const countryCounts = await this.client.query(`
        SELECT 
          country,
          COUNT(*) as count
        FROM companies
        WHERE verification_source = 'historical_migration'
        GROUP BY country
        ORDER BY count DESC
        LIMIT 5
      `);
      
      console.log('   Top 5 countries:');
      countryCounts.rows.forEach(row => {
        console.log(`   - ${row.country}: ${row.count} companies`);
      });
      
      return countryCounts.rows;
    });
  }

  async testIndustrySearch() {
    return this.runTest('Test industry search', async () => {
      const industries = await this.client.query(`
        SELECT 
          industry_traditional,
          COUNT(*) as count
        FROM companies
        WHERE verification_source = 'historical_migration'
        AND industry_traditional IS NOT NULL
        GROUP BY industry_traditional
        ORDER BY count DESC
        LIMIT 5
      `);
      
      console.log('   Top 5 industries:');
      industries.rows.forEach(row => {
        console.log(`   - ${row.industry_traditional}: ${row.count} companies`);
      });
      
      // Test specific industry search
      const financeSearch = await this.client.query(`
        SELECT COUNT(*) as count
        FROM companies
        WHERE verification_source = 'historical_migration'
        AND LOWER(industry_traditional) LIKE '%financ%'
      `);
      
      console.log(`   Finance-related companies: ${financeSearch.rows[0].count}`);
      
      return { top: industries.rows, finance: financeSearch.rows[0].count };
    });
  }

  async testConfidenceFiltering() {
    return this.runTest('Test confidence score filtering', async () => {
      const confidenceRanges = await this.client.query(`
        SELECT 
          CASE 
            WHEN confidence_score >= 0.9 THEN 'High (90-100%)'
            WHEN confidence_score >= 0.7 THEN 'Medium (70-90%)'
            ELSE 'Low (<70%)'
          END as confidence_range,
          COUNT(*) as count
        FROM companies
        WHERE verification_source = 'historical_migration'
        GROUP BY 
          CASE 
            WHEN confidence_score >= 0.9 THEN 'High (90-100%)'
            WHEN confidence_score >= 0.7 THEN 'Medium (70-90%)'
            ELSE 'Low (<70%)'
          END
        ORDER BY 
          MIN(confidence_score) DESC
      `);
      
      console.log('   Confidence distribution:');
      confidenceRanges.rows.forEach(row => {
        console.log(`   - ${row.confidence_range}: ${row.count} companies`);
      });
      
      return confidenceRanges.rows;
    });
  }

  async testAssessmentReadiness() {
    return this.runTest('Test assessment readiness', async () => {
      // Check companies ready for assessment
      const readyForAssessment = await this.client.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN confidence_score >= 0.7 THEN 1 END) as high_confidence,
          COUNT(CASE WHEN needs_reassessment = true THEN 1 END) as needs_review
        FROM companies
        WHERE verification_source = 'historical_migration'
      `);
      
      const stats = readyForAssessment.rows[0];
      console.log(`   Total companies: ${stats.total}`);
      console.log(`   High confidence (≥70%): ${stats.high_confidence}`);
      console.log(`   Needs review: ${stats.needs_review}`);
      
      // Sample companies for testing
      const sampleCompanies = await this.client.query(`
        SELECT 
          id,
          name,
          dii_business_model,
          confidence_score,
          country,
          industry_traditional
        FROM companies
        WHERE verification_source = 'historical_migration'
        AND confidence_score >= 0.8
        ORDER BY RANDOM()
        LIMIT 5
      `);
      
      console.log('\n   Sample companies for assessment testing:');
      sampleCompanies.rows.forEach((company, idx) => {
        console.log(`   ${idx + 1}. ${company.name} (${company.country})`);
        console.log(`      - Model: ${company.dii_business_model}`);
        console.log(`      - Industry: ${company.industry_traditional}`);
        console.log(`      - Confidence: ${(company.confidence_score * 100).toFixed(1)}%`);
        console.log(`      - ID: ${company.id}`);
      });
      
      return { stats: stats, samples: sampleCompanies.rows };
    });
  }

  async testPaginationSupport() {
    return this.runTest('Test pagination support', async () => {
      const pageSize = 10;
      const offset = 0;
      
      const paginatedResults = await this.client.query(`
        SELECT 
          id,
          name,
          dii_business_model,
          confidence_score,
          country
        FROM companies
        WHERE verification_source = 'historical_migration'
        ORDER BY name ASC
        LIMIT $1 OFFSET $2
      `, [pageSize, offset]);
      
      console.log(`   Retrieved ${paginatedResults.rows.length} companies (page 1)`);
      console.log(`   First company: ${paginatedResults.rows[0]?.name}`);
      console.log(`   Last company: ${paginatedResults.rows[paginatedResults.rows.length - 1]?.name}`);
      
      // Get total count for pagination
      const totalCount = await this.client.query(`
        SELECT COUNT(*) as total
        FROM companies
        WHERE verification_source = 'historical_migration'
      `);
      
      const totalPages = Math.ceil(totalCount.rows[0].total / pageSize);
      console.log(`   Total pages: ${totalPages} (${pageSize} per page)`);
      
      return { 
        page1: paginatedResults.rows, 
        totalPages,
        totalCount: totalCount.rows[0].total 
      };
    });
  }

  async generateTestQueries() {
    console.log('\n📝 Sample queries for assessment engine:\n');
    
    const queries = [
      {
        name: 'Find company by exact name',
        query: `SELECT * FROM companies WHERE LOWER(name) = LOWER('Bancolombia') AND verification_source = 'historical_migration';`
      },
      {
        name: 'Search companies by partial name',
        query: `SELECT * FROM companies WHERE LOWER(name) LIKE LOWER('%banco%') AND verification_source = 'historical_migration' LIMIT 10;`
      },
      {
        name: 'Filter by business model',
        query: `SELECT * FROM companies WHERE dii_business_model = 'SERVICIOS_FINANCIEROS' AND verification_source = 'historical_migration' LIMIT 10;`
      },
      {
        name: 'Filter by country',
        query: `SELECT * FROM companies WHERE country = 'Colombia' AND verification_source = 'historical_migration' LIMIT 10;`
      },
      {
        name: 'High confidence companies only',
        query: `SELECT * FROM companies WHERE confidence_score >= 0.8 AND verification_source = 'historical_migration' ORDER BY confidence_score DESC LIMIT 10;`
      },
      {
        name: 'Companies needing review',
        query: `SELECT * FROM companies WHERE needs_reassessment = true AND verification_source = 'historical_migration' ORDER BY confidence_score ASC LIMIT 10;`
      }
    ];
    
    queries.forEach(q => {
      console.log(`-- ${q.name}`);
      console.log(q.query);
      console.log('');
    });
  }

  async disconnect() {
    await this.client.end();
  }

  async run() {
    try {
      console.log('🚀 Starting Assessment Engine Integration Tests\n');
      console.log('=' .repeat(60));
      console.log('\n');
      
      await this.connect();
      
      // Run all tests
      await this.testMigratedCompaniesExist();
      await this.testCompanySearch();
      await this.testBusinessModelFilter();
      await this.testCountryFilter();
      await this.testIndustrySearch();
      await this.testConfidenceFiltering();
      await this.testAssessmentReadiness();
      await this.testPaginationSupport();
      
      // Generate sample queries
      await this.generateTestQueries();
      
      // Summary
      console.log('=' .repeat(60));
      console.log('\n📊 TEST SUMMARY\n');
      console.log(`Total tests: ${this.testResults.passed + this.testResults.failed}`);
      console.log(`Passed: ${this.testResults.passed} ✅`);
      console.log(`Failed: ${this.testResults.failed} ❌`);
      
      if (this.testResults.failed === 0) {
        console.log('\n🎉 All integration tests passed!');
        console.log('\n✅ The assessment engine can successfully query migrated companies.');
        console.log('\n📋 Next steps:');
        console.log('1. Update the assessment-v2 app to use these queries');
        console.log('2. Implement the company search UI with filters');
        console.log('3. Add assessment workflow for selected companies');
      } else {
        console.log('\n⚠️  Some tests failed. Review the errors above.');
      }
      
      await this.disconnect();
      
    } catch (error) {
      console.error('\n❌ Integration test failed:', error);
      await this.disconnect();
      process.exit(1);
    }
  }
}

// Run tests
if (require.main === module) {
  const tester = new AssessmentIntegrationTester();
  tester.run();
}

module.exports = { AssessmentIntegrationTester };