#!/usr/bin/env node

/**
 * Import DII v4.0 historical data into PostgreSQL database
 * 
 * Usage: node scripts/import-historical-data.mjs [--dry-run] [--batch-size=10]
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Sector to Industry mapping
const SECTOR_TO_INDUSTRY_MAP = {
  'Financial': 'Financial Services',
  'Industrial': 'Manufacturing',
  'Public': 'Government',
  'Technology': 'Technology',
  'Health': 'Healthcare',
  'Retail': 'Retail',
  'Telecommunications': 'Telecommunications',
  'Energy': 'Energy',
  'Logistics': 'Logistics',
  'Education': 'Education'
};

// Business model mapping
const BUSINESS_MODEL_MAP = {
  'Ecosistema Digital': 'ECOSISTEMA_DIGITAL',
  'Servicios Financieros': 'SERVICIOS_FINANCIEROS',
  'Información Regulada': 'INFORMACION_REGULADA',
  'Comercio Híbrido': 'COMERCIO_HIBRIDO',
  'Servicios de Datos': 'SERVICIOS_DATOS',
  'Software Crítico': 'SOFTWARE_CRITICO',
  'Cadena de Suministro': 'CADENA_SUMINISTRO',
  'Infraestructura Heredada': 'INFRAESTRUCTURA_HEREDADA'
};

/**
 * Transform historical company data
 */
function transformHistoricalCompany(historicalData) {
  const { 
    id,
    company_name,
    country,
    sector,
    business_model_v4,
    dii_score,
    dii_stage,
    dimensions,
    migration_metadata
  } = historicalData;

  return {
    // Core company data
    name: company_name.trim(),
    legal_name: company_name.trim(),
    industry_traditional: SECTOR_TO_INDUSTRY_MAP[sector] || sector,
    dii_business_model: BUSINESS_MODEL_MAP[business_model_v4] || 'COMERCIO_HIBRIDO',
    confidence_score: migration_metadata?.confidence_level === 'HIGH' ? 0.9 : 0.7,
    
    // Location data
    country: country,
    region: 'LATAM',
    
    // Historical tracking
    legacy_dii_id: id,
    original_dii_score: dii_score,
    migration_confidence: migration_metadata?.confidence_level || 'MEDIUM',
    framework_version: 'v4.0',
    migration_date: migration_metadata?.migration_date || new Date().toISOString(),
    needs_reassessment: migration_metadata?.needs_reassessment || false,
    data_completeness: migration_metadata?.data_completeness || 0.8,
    has_zt_maturity: migration_metadata?.has_zt_maturity || false,
    
    // Verification data
    last_verified: migration_metadata?.migration_date || new Date().toISOString(),
    verification_source: 'import',
    data_freshness_days: 90,
    is_prospect: false
  };
}

/**
 * Create history record from historical data
 */
function createHistoryRecord(companyId, historicalData) {
  const {
    dii_score,
    dii_stage,
    dimensions,
    migration_metadata
  } = historicalData;

  return {
    company_id: companyId,
    framework_version: 'v4.0',
    dii_score: parseFloat(dii_score) || 0,
    dii_stage: dii_stage || 'Frágil',
    dimensions: dimensions || {},
    assessment_type: 'migrated',
    recorded_at: migration_metadata?.migration_date || new Date().toISOString(),
    source: 'dii_v4_migration',
    metadata: {
      confidence_level: migration_metadata?.confidence_level,
      data_completeness: migration_metadata?.data_completeness,
      has_zt_maturity: migration_metadata?.has_zt_maturity,
      original_framework: migration_metadata?.source_framework || 'v3.0',
      migration_notes: 'Imported from dii_v4_historical_data.json'
    }
  };
}

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
    
    // Calculate summary statistics
    const countries = [...new Set(companies.map(c => c.country))];
    const sectors = [...new Set(companies.map(c => c.sector))];
    const models = [...new Set(companies.map(c => c.business_model_v4))];
    
    console.log(`📍 Countries: ${countries.length} (${countries.slice(0, 5).join(', ')}${countries.length > 5 ? '...' : ''})`);
    console.log(`🏢 Sectors: ${sectors.length} (${sectors.slice(0, 5).join(', ')}${sectors.length > 5 ? '...' : ''})`);
    console.log(`📈 Business Models: ${models.length}`);
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
importHistoricalData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));