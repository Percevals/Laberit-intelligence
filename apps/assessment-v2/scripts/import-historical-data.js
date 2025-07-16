#!/usr/bin/env node

/**
 * Import DII v4.0 historical data into PostgreSQL database
 * 
 * Usage: node scripts/import-historical-data.js [--dry-run] [--batch-size=10]
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { 
  transformHistoricalCompany, 
  createHistoryRecord,
  validateTransformedData 
} = require('./utils/data-transformers');

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:3001/api';
const HISTORICAL_DATA_PATH = path.join(__dirname, '../../../data/dii_v4_historical_data.json');
const DEFAULT_BATCH_SIZE = 10;

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const batchSizeArg = args.find(arg => arg.startsWith('--batch-size='));
const batchSize = batchSizeArg ? parseInt(batchSizeArg.split('=')[1]) : DEFAULT_BATCH_SIZE;

// Import statistics
const stats = {
  total: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  errors: []
};

/**
 * Load historical data from JSON file
 */
async function loadHistoricalData() {
  try {
    const data = await fs.readFile(HISTORICAL_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Failed to load historical data:', error.message);
    throw error;
  }
}

/**
 * Check if company already exists
 */
async function checkExistingCompany(legacyId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/companies?legacy_dii_id=${legacyId}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    return null;
  }
}

/**
 * Create company via API
 */
async function createCompany(companyData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/companies`, companyData);
    return response.data;
  } catch (error) {
    throw new Error(`API Error: ${error.response?.data?.error || error.message}`);
  }
}

/**
 * Create history record via API
 */
async function createHistory(historyData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/company-history`, historyData);
    return response.data;
  } catch (error) {
    throw new Error(`History API Error: ${error.response?.data?.error || error.message}`);
  }
}

/**
 * Process a single company
 */
async function processCompany(historicalCompany, index) {
  console.log(`\n[${index + 1}] Processing: ${historicalCompany.company_name}`);
  
  try {
    // Check if already imported
    const existing = await checkExistingCompany(historicalCompany.id);
    if (existing) {
      console.log(`   ⚠️  Already exists with ID: ${existing.id}`);
      stats.skipped++;
      return;
    }
    
    // Transform data
    const companyData = transformHistoricalCompany(historicalCompany);
    
    // Validate
    const validation = validateTransformedData(companyData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    
    if (isDryRun) {
      console.log('   📋 Dry run - would create:');
      console.log(`      Name: ${companyData.name}`);
      console.log(`      Model: ${companyData.dii_business_model}`);
      console.log(`      Score: ${historicalCompany.dii_score}`);
      console.log(`      Confidence: ${(companyData.confidence_score * 100).toFixed(0)}%`);
      stats.successful++;
      return;
    }
    
    // Create company
    const created = await createCompany(companyData);
    console.log(`   ✅ Company created with ID: ${created.id}`);
    
    // Create history record
    const historyData = createHistoryRecord(created.id, historicalCompany);
    await createHistory(historyData);
    console.log(`   📊 History record created`);
    
    stats.successful++;
    
  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}`);
    stats.failed++;
    stats.errors.push({
      company: historicalCompany.company_name,
      error: error.message
    });
  }
}

/**
 * Process companies in batches
 */
async function processBatch(companies, startIndex) {
  const batch = companies.slice(startIndex, startIndex + batchSize);
  
  console.log(`\n🔄 Processing batch ${Math.floor(startIndex / batchSize) + 1} (${batch.length} companies)`);
  
  for (let i = 0; i < batch.length; i++) {
    await processCompany(batch[i], startIndex + i);
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

/**
 * Main import function
 */
async function importHistoricalData() {
  console.log('🚀 DII v4.0 Historical Data Import');
  console.log('================================');
  console.log(`Mode: ${isDryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Batch size: ${batchSize}`);
  console.log(`API URL: ${API_BASE_URL}`);
  console.log('');
  
  try {
    // Load data
    console.log('📂 Loading historical data...');
    const historicalData = await loadHistoricalData();
    const companies = historicalData.clients || [];
    stats.total = companies.length;
    
    console.log(`📊 Found ${stats.total} companies to import`);
    console.log(`📍 Countries: ${historicalData.summary.geographic_distribution.countries}`);
    console.log(`🏢 Sectors: ${historicalData.summary.sector_distribution.sectors}`);
    console.log('');
    
    // Process in batches
    for (let i = 0; i < companies.length; i += batchSize) {
      await processBatch(companies, i);
    }
    
    // Print summary
    console.log('\n\n📈 Import Summary');
    console.log('================');
    console.log(`Total companies: ${stats.total}`);
    console.log(`✅ Successful: ${stats.successful}`);
    console.log(`⚠️  Skipped: ${stats.skipped}`);
    console.log(`❌ Failed: ${stats.failed}`);
    
    if (stats.errors.length > 0) {
      console.log('\n❌ Errors:');
      stats.errors.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err.company}: ${err.error}`);
      });
    }
    
    if (!isDryRun && stats.successful > 0) {
      console.log('\n✨ Import completed successfully!');
      console.log('   Run the admin panel to view imported companies.');
    }
    
  } catch (error) {
    console.error('\n💥 Fatal error:', error.message);
    process.exit(1);
  }
}

// Run import
if (require.main === module) {
  importHistoricalData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { importHistoricalData };