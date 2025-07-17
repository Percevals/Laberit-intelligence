#!/usr/bin/env node

/**
 * Test Migration Script: DII v3 to v4 Business Model Migration
 * Tests mapping logic on a subset of 15 companies before full migration
 */

import * as fs from 'fs';
import * as path from 'path';
import * as Papa from 'papaparse';
import * as iconv from 'iconv-lite';

// Configuration
const CSV_FILE_PATH = path.join(__dirname, '../data/historical_DB_report.csv');
const OUTPUT_FILE_PATH = path.join(__dirname, '../data/test_migration_results.json');
const ENCODING = 'cp1252';

// DII v4 Business Models (from the application)
enum DIIv4BusinessModel {
  SERVICIOS_FINANCIEROS = 'SERVICIOS_FINANCIEROS',
  MANUFACTURA = 'MANUFACTURA',
  COMERCIO_RETAIL = 'COMERCIO_RETAIL',
  PLATAFORMA_TECNOLOGICA = 'PLATAFORMA_TECNOLOGICA',
  SOFTWARE_SERVICIOS = 'SOFTWARE_SERVICIOS',
  SALUD_MEDICINA = 'SALUD_MEDICINA',
  SERVICIOS_DATOS = 'SERVICIOS_DATOS',
  INFRAESTRUCTURA_HEREDADA = 'INFRAESTRUCTURA_HEREDADA'
}

// v3 to v4 Direct Mappings
const DIRECT_MAPPINGS: Record<string, DIIv4BusinessModel> = {
  'Financial Services': DIIv4BusinessModel.SERVICIOS_FINANCIEROS,
  'Healthcare': DIIv4BusinessModel.SALUD_MEDICINA,
  'Traditional Retail': DIIv4BusinessModel.COMERCIO_RETAIL,
  'Marketplace': DIIv4BusinessModel.COMERCIO_RETAIL,
  'SaaS': DIIv4BusinessModel.SOFTWARE_SERVICIOS,
  'XaaS': DIIv4BusinessModel.SOFTWARE_SERVICIOS,
  'Hybrid': DIIv4BusinessModel.PLATAFORMA_TECNOLOGICA // Default, needs context
};

// Keywords for context-based classification
const DATA_SERVICE_KEYWORDS = [
  'analytics', 'data', 'bi', 'intelligence', 'insights', 'telemetry',
  'metrics', 'reporting', 'dashboard', 'visualization', 'mining',
  'information', 'statistics', 'analysis'
];

const LEGACY_INFRASTRUCTURE_KEYWORDS = [
  'energy', 'utility', 'power', 'water', 'telecom', 'transportation',
  'industrial', 'heavy', 'steel', 'mining', 'oil', 'gas', 'infrastructure',
  'electricity', 'petroleum', 'chemical', 'cement', 'manufacturing'
];

const TECH_PLATFORM_KEYWORDS = [
  'platform', 'marketplace', 'ecosystem', 'api', 'integration',
  'cloud', 'software', 'digital', 'online', 'web', 'app'
];

// Type definitions
interface CompanyRecord {
  Real_Company_Name: string;
  Real_Country: string;
  Real_Industry: string;
  Employee_Count: string;
  Company_ID: string;
  Business_Model_v3: string;
  Business_Model_Confidence: string;
  AER: string;
  HFP: string;
  BRI: string;
  TRD: string;
  RRG: string;
  CLOUD_ADOPTION_LEVEL: string;
}

interface MigrationResult {
  companyId: string;
  companyName: string;
  originalModel: string;
  proposedModel: DIIv4BusinessModel;
  confidence: number;
  reasoning: string[];
  requiresReview: boolean;
  migrationStatus: 'success' | 'warning' | 'error';
  validationErrors: string[];
  sqlInsert?: string;
}

interface TestReport {
  timestamp: string;
  totalCompanies: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
  results: MigrationResult[];
  summary: {
    byModel: Record<DIIv4BusinessModel, number>;
    avgConfidence: number;
    requiresReviewCount: number;
  };
}

class V3toV4Migrator {
  private results: MigrationResult[] = [];

  /**
   * Classify a company from v3 to v4 business model
   */
  classifyCompany(company: CompanyRecord): MigrationResult {
    console.log(`\n🔄 Processing: ${company.Real_Company_Name} (ID: ${company.Company_ID})`);
    
    const result: MigrationResult = {
      companyId: company.Company_ID,
      companyName: company.Real_Company_Name,
      originalModel: company.Business_Model_v3,
      proposedModel: DIIv4BusinessModel.PLATAFORMA_TECNOLOGICA, // Default
      confidence: 0,
      reasoning: [],
      requiresReview: false,
      migrationStatus: 'success',
      validationErrors: []
    };

    // Validate required fields
    const validationErrors = this.validateCompanyData(company);
    if (validationErrors.length > 0) {
      result.validationErrors = validationErrors;
      result.migrationStatus = 'error';
      result.requiresReview = true;
    }

    // Apply classification logic
    if (company.Business_Model_v3 === 'Platform') {
      this.classifyPlatformCompany(company, result);
    } else if (company.Business_Model_v3 === 'Manufacturing') {
      this.classifyManufacturingCompany(company, result);
    } else if (DIRECT_MAPPINGS[company.Business_Model_v3]) {
      // Direct mapping available
      result.proposedModel = DIRECT_MAPPINGS[company.Business_Model_v3];
      result.confidence = 0.9;
      result.reasoning.push(`Direct mapping from ${company.Business_Model_v3}`);
    } else {
      // Unknown model
      result.confidence = 0.1;
      result.reasoning.push('Unknown v3 model, defaulting to PLATAFORMA_TECNOLOGICA');
      result.requiresReview = true;
      result.migrationStatus = 'warning';
    }

    // Adjust confidence based on v3 confidence if available
    if (company.Business_Model_Confidence) {
      const v3Confidence = parseFloat(company.Business_Model_Confidence);
      result.confidence = result.confidence * v3Confidence;
      result.reasoning.push(`Adjusted by v3 confidence: ${v3Confidence}`);
    }

    // Flag for review if low confidence
    if (result.confidence < 0.6) {
      result.requiresReview = true;
      result.migrationStatus = result.migrationStatus === 'error' ? 'error' : 'warning';
    }

    // Generate SQL insert
    result.sqlInsert = this.generateSQLInsert(company, result.proposedModel);

    // Console output
    console.log(`  Original: ${result.originalModel} → Proposed: ${result.proposedModel}`);
    console.log(`  Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`  Reasoning: ${result.reasoning.join('; ')}`);
    console.log(`  Status: ${result.migrationStatus} ${result.requiresReview ? '⚠️ Requires Review' : '✅'}`);

    return result;
  }

  /**
   * Platform company classification logic
   */
  private classifyPlatformCompany(company: CompanyRecord, result: MigrationResult): void {
    const companyNameLower = company.Real_Company_Name.toLowerCase();
    const industryLower = (company.Real_Industry || '').toLowerCase();
    
    // Check for data service indicators
    const hasDataKeywords = DATA_SERVICE_KEYWORDS.some(keyword => 
      companyNameLower.includes(keyword) || industryLower.includes(keyword)
    );

    // Check for legacy infrastructure
    const hasInfraKeywords = LEGACY_INFRASTRUCTURE_KEYWORDS.some(keyword =>
      industryLower.includes(keyword)
    );

    // Check employee count for large enterprises
    const employees = parseInt(company.Employee_Count) || 0;
    const isLargeEnterprise = employees > 5000;

    if (hasDataKeywords) {
      result.proposedModel = DIIv4BusinessModel.SERVICIOS_DATOS;
      result.confidence = 0.8;
      result.reasoning.push('Platform with data/analytics keywords');
    } else if (hasInfraKeywords && isLargeEnterprise) {
      result.proposedModel = DIIv4BusinessModel.INFRAESTRUCTURA_HEREDADA;
      result.confidence = 0.7;
      result.reasoning.push(`Large infrastructure platform (${employees} employees)`);
    } else if (industryLower.includes('public') || industryLower.includes('government')) {
      // Public sector platforms often handle data
      result.proposedModel = DIIv4BusinessModel.SERVICIOS_DATOS;
      result.confidence = 0.6;
      result.reasoning.push('Public sector platform, likely data-focused');
      result.requiresReview = true;
    } else {
      // Default platform classification
      result.proposedModel = DIIv4BusinessModel.PLATAFORMA_TECNOLOGICA;
      result.confidence = 0.7;
      result.reasoning.push('General technology platform');
    }
  }

  /**
   * Manufacturing company classification logic
   */
  private classifyManufacturingCompany(company: CompanyRecord, result: MigrationResult): void {
    const industryLower = (company.Real_Industry || '').toLowerCase();
    const employees = parseInt(company.Employee_Count) || 0;
    
    // Check for legacy indicators
    const hasLegacyKeywords = LEGACY_INFRASTRUCTURE_KEYWORDS.some(keyword =>
      industryLower.includes(keyword)
    );

    const isLargeManufacturer = employees > 2000;
    const isCriticalIndustry = ['energy', 'utility', 'industrial', 'chemical'].some(
      sector => industryLower.includes(sector)
    );

    if ((hasLegacyKeywords || isCriticalIndustry) && isLargeManufacturer) {
      result.proposedModel = DIIv4BusinessModel.INFRAESTRUCTURA_HEREDADA;
      result.confidence = 0.8;
      result.reasoning.push(`Large legacy manufacturer (${employees} employees, ${company.Real_Industry})`);
    } else {
      result.proposedModel = DIIv4BusinessModel.MANUFACTURA;
      result.confidence = 0.9;
      result.reasoning.push('Standard manufacturing operation');
    }
  }

  /**
   * Validate company data for migration
   */
  private validateCompanyData(company: CompanyRecord): string[] {
    const errors: string[] = [];

    if (!company.Company_ID) errors.push('Missing Company_ID');
    if (!company.Real_Company_Name) errors.push('Missing Real_Company_Name');
    if (!company.Business_Model_v3) errors.push('Missing Business_Model_v3');
    
    // Validate DII scores
    const scores = ['AER', 'HFP', 'BRI', 'TRD', 'RRG'] as const;
    scores.forEach(score => {
      const value = parseFloat(company[score]);
      if (isNaN(value) || value < 0 || value > 10) {
        errors.push(`Invalid ${score} score: ${company[score]}`);
      }
    });

    return errors;
  }

  /**
   * Generate SQL INSERT statement for testing
   */
  private generateSQLInsert(company: CompanyRecord, v4Model: DIIv4BusinessModel): string {
    const values = [
      company.Company_ID,
      company.Real_Company_Name.replace(/'/g, "''"), // Escape quotes
      company.Real_Country.replace(/'/g, "''"),
      company.Real_Industry.replace(/'/g, "''"),
      parseInt(company.Employee_Count) || 0,
      v4Model,
      company.AER,
      company.HFP,
      company.BRI,
      company.TRD,
      company.RRG,
      company.CLOUD_ADOPTION_LEVEL
    ];

    return `INSERT INTO companies (id, name, country, industry, employee_count, business_model_v4, aer_score, hfp_score, bri_score, trd_score, rrg_score, cloud_adoption) VALUES (${values.map(v => typeof v === 'string' ? `'${v}'` : v).join(', ')});`;
  }

  /**
   * Process test subset of companies
   */
  async processTestSubset(companies: CompanyRecord[]): Promise<TestReport> {
    console.log('🚀 Starting v3 to v4 Migration Test\n');
    console.log('=' .repeat(60));

    // Select test subset
    const testSubset = this.selectTestSubset(companies);
    console.log(`\n📊 Selected ${testSubset.length} companies for testing:\n`);

    // Process each company
    testSubset.forEach(company => {
      const result = this.classifyCompany(company);
      this.results.push(result);
    });

    // Generate report
    const report = this.generateReport();
    
    // Save report
    fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(report, null, 2), 'utf8');
    console.log(`\n📄 Test report saved to: ${OUTPUT_FILE_PATH}`);

    return report;
  }

  /**
   * Select diverse test subset
   */
  private selectTestSubset(companies: CompanyRecord[]): CompanyRecord[] {
    const subset: CompanyRecord[] = [];

    // 1. High-confidence Financial Services (3)
    const financialServices = companies.filter(c => c.Business_Model_v3 === 'Financial Services');
    subset.push(...financialServices.slice(0, 3));

    // 2. Platform companies that might be SERVICIOS_DATOS (3)
    const platforms = companies.filter(c => c.Business_Model_v3 === 'Platform');
    const dataPlatforms = platforms.filter(c => {
      const name = c.Real_Company_Name.toLowerCase();
      const industry = (c.Real_Industry || '').toLowerCase();
      return DATA_SERVICE_KEYWORDS.some(kw => name.includes(kw) || industry.includes(kw));
    });
    subset.push(...dataPlatforms.slice(0, 3));
    
    // If not enough data platforms, add regular platforms
    if (subset.length < 6) {
      const regularPlatforms = platforms.filter(c => !dataPlatforms.includes(c));
      subset.push(...regularPlatforms.slice(0, 6 - subset.length));
    }

    // 3. Manufacturing companies (potential INFRAESTRUCTURA_HEREDADA) (3)
    const manufacturing = companies.filter(c => c.Business_Model_v3 === 'Manufacturing');
    const largeManufacturing = manufacturing
      .filter(c => parseInt(c.Employee_Count) > 2000)
      .sort((a, b) => parseInt(b.Employee_Count) - parseInt(a.Employee_Count));
    subset.push(...largeManufacturing.slice(0, 3));

    // 4. Low-confidence companies (3)
    const lowConfidence = companies.filter(c => {
      const conf = parseFloat(c.Business_Model_Confidence);
      return conf > 0 && conf < 0.6;
    });
    subset.push(...lowConfidence.slice(0, 3));

    // 5. Different models (SaaS, Healthcare, Traditional Retail) (3)
    const saas = companies.find(c => c.Business_Model_v3 === 'SaaS');
    const healthcare = companies.find(c => c.Business_Model_v3 === 'Healthcare');
    const retail = companies.find(c => c.Business_Model_v3 === 'Traditional Retail');
    
    if (saas) subset.push(saas);
    if (healthcare) subset.push(healthcare);
    if (retail) subset.push(retail);

    // Ensure we have exactly 15 unique companies
    const uniqueSubset = Array.from(new Map(subset.map(c => [c.Company_ID, c])).values());
    return uniqueSubset.slice(0, 15);
  }

  /**
   * Generate test report
   */
  private generateReport(): TestReport {
    const byModel: Record<string, number> = {};
    let totalConfidence = 0;
    let requiresReviewCount = 0;
    let successCount = 0;
    let warningCount = 0;
    let errorCount = 0;

    this.results.forEach(result => {
      // Count by model
      byModel[result.proposedModel] = (byModel[result.proposedModel] || 0) + 1;
      
      // Sum confidence
      totalConfidence += result.confidence;
      
      // Count reviews needed
      if (result.requiresReview) requiresReviewCount++;
      
      // Count by status
      switch (result.migrationStatus) {
        case 'success': successCount++; break;
        case 'warning': warningCount++; break;
        case 'error': errorCount++; break;
      }
    });

    const report: TestReport = {
      timestamp: new Date().toISOString(),
      totalCompanies: this.results.length,
      successCount,
      warningCount,
      errorCount,
      results: this.results,
      summary: {
        byModel: byModel as Record<DIIv4BusinessModel, number>,
        avgConfidence: totalConfidence / this.results.length,
        requiresReviewCount
      }
    };

    // Console summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 MIGRATION TEST SUMMARY\n');
    console.log(`Total Companies Tested: ${report.totalCompanies}`);
    console.log(`Success: ${successCount} | Warnings: ${warningCount} | Errors: ${errorCount}`);
    console.log(`Average Confidence: ${(report.summary.avgConfidence * 100).toFixed(1)}%`);
    console.log(`Requires Manual Review: ${requiresReviewCount}`);
    
    console.log('\nProposed v4 Model Distribution:');
    Object.entries(byModel).forEach(([model, count]) => {
      console.log(`  ${model}: ${count}`);
    });

    return report;
  }
}

// Main execution
async function runMigrationTest() {
  try {
    // Read and parse CSV
    const fileBuffer = fs.readFileSync(CSV_FILE_PATH);
    const fileContent = iconv.decode(fileBuffer, ENCODING);
    
    const parseResult = Papa.parse<CompanyRecord>(fileContent, {
      delimiter: ';',
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim()
    });

    if (parseResult.errors.length > 0) {
      console.error('⚠️ CSV parsing errors:', parseResult.errors);
    }

    // Run migration test
    const migrator = new V3toV4Migrator();
    const report = await migrator.processTestSubset(parseResult.data);

    console.log('\n✅ Migration test complete!');
    console.log(`\nNext steps:`);
    console.log(`1. Review the test results in: ${OUTPUT_FILE_PATH}`);
    console.log(`2. Adjust classification logic based on findings`);
    console.log(`3. Run full migration when satisfied with accuracy`);

  } catch (error) {
    console.error('❌ Migration test failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runMigrationTest();
}

export { V3toV4Migrator, runMigrationTest };