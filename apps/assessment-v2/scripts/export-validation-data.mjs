#!/usr/bin/env node

/**
 * Export validation data combining real company names with anonymized classification results
 * This allows manual validation of the classification algorithm accuracy
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import pg from 'pg';

const { Client } = pg;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require';

async function exportValidationData() {
  console.log('📊 Exporting Classification Validation Data');
  console.log('==========================================\n');

  try {
    // 1. Load real company names from CSV
    console.log('📂 Loading real company names...');
    const csvPath = path.join(__dirname, '../../../data/plantilla_historicalv1.csv');
    const csvContent = await fs.readFile(csvPath, 'utf8');
    const realCompanies = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    // 2. Load anonymized data from JSON
    console.log('📂 Loading anonymized historical data...');
    const jsonPath = path.join(__dirname, '../../../data/dii_v4_historical_data.json');
    const jsonContent = await fs.readFile(jsonPath, 'utf8');
    const anonymizedData = JSON.parse(jsonContent);
    
    // 3. Connect to database and get imported companies
    console.log('🗄️  Fetching imported companies from database...');
    const client = new Client({ connectionString });
    await client.connect();
    
    const result = await client.query(`
      SELECT 
        c.*,
        ch.dii_score as history_dii_score,
        ch.dimensions,
        ch.dii_stage
      FROM companies c
      LEFT JOIN company_history ch ON c.id = ch.company_id
      WHERE c.legacy_dii_id IS NOT NULL
      ORDER BY c.legacy_dii_id
    `);
    
    await client.end();
    
    // 4. Create validation dataset
    console.log('\n🔄 Creating validation dataset...');
    const validationData = [];
    
    // Match by position (ID - 1 since arrays are 0-indexed)
    anonymizedData.clients.forEach((anonCompany, index) => {
      const realCompany = realCompanies[index];
      const dbCompany = result.rows.find(c => c.legacy_dii_id === anonCompany.id);
      
      if (realCompany && dbCompany) {
        validationData.push({
          // Real data
          real_company_name: realCompany.Name || realCompany.Company || realCompany['Company Name'] || 'Unknown',
          real_country: realCompany.Country || realCompany.Pais || 'Unknown',
          real_industry: realCompany.Industry || realCompany.Industria || 'Unknown',
          
          // Anonymized data
          anonymized_name: anonCompany.company_name,
          anonymized_id: anonCompany.id,
          
          // Classification results
          classified_business_model: dbCompany.dii_business_model,
          confidence_score: dbCompany.confidence_score,
          migration_confidence: dbCompany.migration_confidence,
          
          // Scores
          original_dii_score: dbCompany.original_dii_score,
          dii_stage: dbCompany.dii_stage,
          
          // Dimensions
          AER: dbCompany.dimensions?.AER || 0,
          HFP: dbCompany.dimensions?.HFP || 0,
          BRI: dbCompany.dimensions?.BRI || 0,
          TRD: dbCompany.dimensions?.TRD || 0,
          RRG: dbCompany.dimensions?.RRG || 0,
          
          // Metadata
          has_zt_maturity: dbCompany.has_zt_maturity,
          needs_reassessment: dbCompany.needs_reassessment,
          data_completeness: dbCompany.data_completeness
        });
      }
    });
    
    // 5. Export to CSV for Excel
    console.log(`\n📝 Exporting ${validationData.length} companies for validation...`);
    
    // Create CSV content
    const headers = [
      'Real Company Name',
      'Real Country',
      'Real Industry',
      'Anonymized Name',
      'ID',
      'Classified Business Model',
      'Confidence Score',
      'Migration Confidence',
      'DII Score',
      'DII Stage',
      'AER',
      'HFP',
      'BRI',
      'TRD',
      'RRG',
      'Has ZT Maturity',
      'Needs Reassessment',
      'Data Completeness'
    ];
    
    let csvOutput = headers.join(',') + '\n';
    
    validationData.forEach(row => {
      csvOutput += [
        `"${row.real_company_name}"`,
        `"${row.real_country}"`,
        `"${row.real_industry}"`,
        `"${row.anonymized_name}"`,
        row.anonymized_id,
        row.classified_business_model,
        row.confidence_score,
        row.migration_confidence,
        row.original_dii_score,
        `"${row.dii_stage}"`,
        row.AER,
        row.HFP,
        row.BRI,
        row.TRD,
        row.RRG,
        row.has_zt_maturity,
        row.needs_reassessment,
        row.data_completeness
      ].join(',') + '\n';
    });
    
    // Save to file
    const outputPath = path.join(__dirname, '../../../data/classification_validation_report.csv');
    await fs.writeFile(outputPath, csvOutput);
    
    console.log(`\n✅ Validation report exported to: ${outputPath}`);
    console.log('\n📊 Summary:');
    console.log(`   Total companies: ${validationData.length}`);
    console.log(`   High confidence: ${validationData.filter(d => d.migration_confidence === 'HIGH').length}`);
    console.log(`   Medium confidence: ${validationData.filter(d => d.migration_confidence === 'MEDIUM').length}`);
    console.log(`   Low confidence: ${validationData.filter(d => d.migration_confidence === 'LOW').length}`);
    
    // Business model distribution
    const modelCounts = {};
    validationData.forEach(d => {
      modelCounts[d.classified_business_model] = (modelCounts[d.classified_business_model] || 0) + 1;
    });
    
    console.log('\n📈 Business Model Distribution:');
    Object.entries(modelCounts).forEach(([model, count]) => {
      console.log(`   ${model}: ${count} companies`);
    });
    
    console.log('\n💡 You can now open the CSV file in Excel to validate:');
    console.log('   1. Classification accuracy (Business Model assignment)');
    console.log('   2. Confidence score appropriateness');
    console.log('   3. Migration quality indicators');
    console.log('   4. Cross-reference with original industry classifications');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run export
exportValidationData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });