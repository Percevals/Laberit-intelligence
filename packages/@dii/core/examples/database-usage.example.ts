/**
 * Database Abstraction Layer Usage Examples
 * Demonstrates how to use the repositories and database providers
 */

import { connectionManager } from '../database/providers/connection-manager';
import { getDatabaseConfig } from '../config/database.config';
import { CompanyRepository } from '../repositories/company.repository';
import { AssessmentRepository } from '../repositories/assessment.repository';
import { DatabaseError } from '../errors/database.error';

async function main() {
  try {
    // 1. Initialize database connection
    console.log('🚀 Initializing database connection...');
    
    const dbConfig = getDatabaseConfig();
    const db = await connectionManager.createConnection(dbConfig);
    
    console.log('✅ Database connected');
    console.log('📊 Connection stats:', db.getStats());

    // 2. Initialize repositories
    const companyRepo = new CompanyRepository(db);
    const assessmentRepo = new AssessmentRepository(db);

    // 3. Create a company
    console.log('\n📝 Creating a company...');
    
    const newCompany = await companyRepo.createCompany({
      name: 'TechCorp México',
      legal_name: 'TechCorp S.A. de C.V.',
      domain: 'techcorp.mx',
      industry_traditional: 'Technology',
      dii_business_model: 'SOFTWARE_CRITICO',
      confidence_score: 0.95,
      classification_reasoning: 'SaaS platform requiring 24/7 availability',
      headquarters: 'Ciudad de México',
      country: 'México',
      region: 'LATAM',
      employees: 250,
      revenue: 15000000 // $15M USD
    });

    console.log('✅ Company created:', newCompany.id);

    // 4. Search for companies
    console.log('\n🔍 Searching companies...');
    
    const searchResults = await companyRepo.searchByName('tech', 5);
    console.log(`Found ${searchResults.length} companies matching "tech"`);

    // 5. Advanced search
    const advancedResults = await companyRepo.search({
      industry: 'Technology',
      dii_business_model: 'SOFTWARE_CRITICO',
      region: 'LATAM'
    });
    console.log(`Found ${advancedResults.length} LATAM tech companies`);

    // 6. Create an assessment with scores
    console.log('\n📊 Creating assessment...');
    
    const { assessment, scores } = await assessmentRepo.createWithScores(
      {
        company_id: newCompany.id,
        assessment_type: 'quick_30min',
        dii_raw_score: 2.45,
        dii_final_score: 4.9,
        confidence_level: 85,
        assessed_by_user_id: 'user-123',
        calculation_inputs: {
          method: 'automated',
          version: '4.0'
        }
      },
      [
        {
          dimension: 'TRD',
          raw_value: 4.0,
          normalized_value: 0.8,
          confidence_score: 0.9,
          data_source: 'simulation_exercise',
          calculation_method: 'Recovery time simulation'
        },
        {
          dimension: 'AER',
          raw_value: 0.5,
          normalized_value: 0.5,
          confidence_score: 0.85,
          data_source: 'industry_benchmark',
          calculation_method: 'Cost ratio analysis'
        },
        {
          dimension: 'HFP',
          raw_value: 0.15,
          normalized_value: 0.3,
          confidence_score: 0.8,
          data_source: 'expert_estimate',
          calculation_method: 'Human factor analysis'
        },
        {
          dimension: 'BRI',
          raw_value: 0.7,
          normalized_value: 0.7,
          confidence_score: 0.85,
          data_source: 'incident_history',
          calculation_method: 'Impact radius calculation'
        },
        {
          dimension: 'RRG',
          raw_value: 1.8,
          normalized_value: 0.6,
          confidence_score: 0.9,
          data_source: 'simulation_exercise',
          calculation_method: 'Resource gap analysis'
        }
      ]
    );

    console.log('✅ Assessment created:', assessment.id);
    console.log(`   DII Score: ${assessment.dii_final_score}`);
    console.log(`   Dimension scores: ${scores.length}`);

    // 7. Get company statistics
    console.log('\n📈 Company statistics:');
    const stats = await companyRepo.getStatistics();
    console.log('   Total companies:', stats.total);
    console.log('   By business model:', stats.byBusinessModel);
    console.log('   By region:', stats.byRegion);

    // 8. Transaction example - bulk import
    console.log('\n💾 Bulk import example...');
    
    const companiesData = [
      {
        name: 'FinTech Solutions',
        industry_traditional: 'Financial Services',
        dii_business_model: 'SERVICIOS_FINANCIEROS' as const
      },
      {
        name: 'DataMart Analytics',
        industry_traditional: 'Data Services',
        dii_business_model: 'SERVICIOS_DATOS' as const
      }
    ];

    const imported = await companyRepo.bulkCreate(companiesData);
    console.log(`✅ Imported ${imported.length} companies`);

    // 9. Error handling example
    console.log('\n⚠️  Error handling example...');
    
    try {
      // Try to create duplicate company
      await companyRepo.createCompany({
        name: 'TechCorp México',
        domain: 'techcorp.mx', // This will cause duplicate key error
        industry_traditional: 'Technology'
      });
    } catch (error) {
      if (error instanceof DatabaseError) {
        console.log('Caught DatabaseError:');
        console.log('   Code:', error.code);
        console.log('   User message:', error.getUserMessage());
        
        // In production, log the full error
        // error.logError();
      }
    }

    // 10. Connection pool stats
    console.log('\n📊 Final connection stats:');
    console.log(connectionManager.getAllConnectionStats());

  } catch (error) {
    console.error('❌ Example failed:', error);
    
    if (error instanceof DatabaseError) {
      error.logError();
    }
  } finally {
    // Always close connections
    await connectionManager.closeAll();
    console.log('\n👋 Database connections closed');
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

// Export for testing
export { main as databaseUsageExample };