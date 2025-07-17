#!/usr/bin/env node

/**
 * Historical Company Database Validation Script (TypeScript)
 * Validates CSV data quality before PostgreSQL migration
 */

import * as fs from 'fs';
import * as path from 'path';
import * as Papa from 'papaparse';
import * as iconv from 'iconv-lite';

// Configuration
const CSV_FILE_PATH = path.join(__dirname, '../data/historical_DB_report.csv');
const REPORT_FILE_PATH = path.join(__dirname, '../data/validation_report.md');
const EXPECTED_RECORD_COUNT = 150;
const ENCODING = 'cp1252';

// Type definitions
interface CompanyRecord {
  Real_Company_Name: string;
  Real_Country: string;
  Real_Industry: string;
  Employee_Count: string;
  Anonymized_Name: string;
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

interface ValidationIssue {
  companyId: string;
  companyName: string;
  field: string;
  value: any;
  reason: string;
}

interface IncompleteCompany {
  companyId: string;
  companyName: string;
  missingFields: string[];
}

interface DuplicateEntry {
  id?: string;
  name?: string;
  companies?: string[];
  ids?: string[];
}

interface V4Candidate {
  name: string;
  model: string;
  industry: string;
  employees?: number;
  reason: string;
}

// Business model mappings
const V3_BUSINESS_MODELS = [
  'Financial Services',
  'Manufacturing',
  'Traditional Retail',
  'Platform',
  'SaaS',
  'Healthcare',
  'XaaS',
  'Hybrid',
  'Marketplace'
] as const;

const V4_BUSINESS_MODELS = [
  'SERVICIOS_FINANCIEROS',
  'MANUFACTURA',
  'COMERCIO_RETAIL',
  'PLATAFORMA_TECNOLOGICA',
  'SOFTWARE_SERVICIOS',
  'SALUD_MEDICINA',
  'SERVICIOS_DATOS',
  'INFRAESTRUCTURA_HEREDADA'
] as const;

// Keywords for classification
const DATA_SERVICE_KEYWORDS = [
  'analytics', 'data', 'bi', 'intelligence', 'insights', 'telemetry',
  'metrics', 'reporting', 'dashboard', 'visualization', 'mining'
];

const LEGACY_INFRASTRUCTURE_KEYWORDS = [
  'energy', 'utility', 'power', 'water', 'telecom', 'transportation',
  'industrial', 'heavy', 'steel', 'mining', 'oil', 'gas', 'infrastructure'
];

class ValidationReport {
  summary = {
    totalRecords: 0,
    expectedRecords: EXPECTED_RECORD_COUNT,
    encodingIssues: [] as string[],
    parseErrors: [] as string[],
    dataCompleteness: {} as Record<string, number>
  };
  
  dataQuality = {
    missingValues: {} as Record<string, number>,
    incompleteCompanies: [] as IncompleteCompany[],
    duplicates: {
      byId: [] as DuplicateEntry[],
      byName: [] as DuplicateEntry[]
    },
    invalidData: [] as ValidationIssue[]
  };
  
  businessModelAnalysis = {
    v3Distribution: {} as Record<string, number>,
    missingModels: [] as { companyId: string; companyName: string }[],
    migrationConcerns: [] as string[]
  };
  
  v4Candidates = {
    serviciosDatos: [] as V4Candidate[],
    infraestructuraHeredada: [] as V4Candidate[]
  };
  
  recommendations: string[] = [];
  
  addEncodingIssue(issue: string): void {
    this.summary.encodingIssues.push(issue);
  }
  
  addParseError(error: string): void {
    this.summary.parseErrors.push(error);
  }
  
  addIncompleteCompany(company: CompanyRecord, missingFields: string[]): void {
    this.dataQuality.incompleteCompanies.push({
      companyId: company.Company_ID,
      companyName: company.Real_Company_Name || company.Anonymized_Name,
      missingFields
    });
  }
  
  addInvalidData(company: CompanyRecord, field: string, value: any, reason: string): void {
    this.dataQuality.invalidData.push({
      companyId: company.Company_ID,
      companyName: company.Real_Company_Name || company.Anonymized_Name,
      field,
      value,
      reason
    });
  }
  
  generateMarkdown(): string {
    const timestamp = new Date().toISOString();
    let report = `# Historical Company Database Validation Report\n\n`;
    report += `Generated: ${timestamp}\n\n`;
    
    // Summary Section
    report += `## Summary\n\n`;
    report += `- **Total Records Found:** ${this.summary.totalRecords}\n`;
    report += `- **Expected Records:** ${this.summary.expectedRecords}\n`;
    report += `- **Status:** ${this.summary.totalRecords === this.summary.expectedRecords ? '✅ PASS' : '❌ FAIL'}\n`;
    report += `- **Encoding Issues:** ${this.summary.encodingIssues.length}\n`;
    report += `- **Parse Errors:** ${this.summary.parseErrors.length}\n\n`;
    
    // Data Completeness
    report += `## Data Completeness\n\n`;
    report += `| Column | Missing Values | Completeness % |\n`;
    report += `|--------|----------------|----------------|\n`;
    
    Object.entries(this.dataQuality.missingValues).forEach(([col, count]) => {
      const percentage = ((this.summary.totalRecords - count) / this.summary.totalRecords * 100).toFixed(1);
      report += `| ${col} | ${count} | ${percentage}% |\n`;
    });
    
    // Incomplete Companies
    report += `\n## Companies with Incomplete Data (${this.dataQuality.incompleteCompanies.length})\n\n`;
    if (this.dataQuality.incompleteCompanies.length > 0) {
      report += `| Company ID | Company Name | Missing Fields |\n`;
      report += `|------------|--------------|----------------|\n`;
      this.dataQuality.incompleteCompanies.forEach(c => {
        report += `| ${c.companyId} | ${c.companyName} | ${c.missingFields.join(', ')} |\n`;
      });
    }
    
    // Duplicates
    report += `\n## Duplicate Analysis\n\n`;
    report += `- **Duplicate IDs:** ${this.dataQuality.duplicates.byId.length}\n`;
    report += `- **Duplicate Names:** ${this.dataQuality.duplicates.byName.length}\n\n`;
    
    if (this.dataQuality.duplicates.byId.length > 0) {
      report += `### Duplicate Company IDs\n\n`;
      this.dataQuality.duplicates.byId.forEach(dup => {
        report += `- ID ${dup.id}: ${dup.companies?.join(', ')}\n`;
      });
    }
    
    // Invalid Data
    if (this.dataQuality.invalidData.length > 0) {
      report += `\n## Invalid Data Issues (${this.dataQuality.invalidData.length})\n\n`;
      report += `| Company | Field | Value | Issue |\n`;
      report += `|---------|-------|-------|-------|\n`;
      this.dataQuality.invalidData.forEach(issue => {
        report += `| ${issue.companyName} | ${issue.field} | ${issue.value} | ${issue.reason} |\n`;
      });
    }
    
    // Business Model Analysis
    report += `\n## Business Model v3 Analysis\n\n`;
    report += `### Distribution\n\n`;
    report += `| Business Model | Count | Percentage |\n`;
    report += `|----------------|-------|------------|\n`;
    
    const sortedModels = Object.entries(this.businessModelAnalysis.v3Distribution)
      .sort((a, b) => b[1] - a[1]);
    
    sortedModels.forEach(([model, count]) => {
      const percentage = (count / this.summary.totalRecords * 100).toFixed(1);
      report += `| ${model || 'Missing'} | ${count} | ${percentage}% |\n`;
    });
    
    // Migration Concerns
    report += `\n### Migration Concerns\n\n`;
    report += `The following v3 models have high volume and may need special attention:\n\n`;
    sortedModels.filter(([_, count]) => count > 20).forEach(([model, count]) => {
      report += `- **${model}** (${count} companies): `;
      if (model === 'Platform') {
        report += `Large volume requires careful classification between PLATAFORMA_TECNOLOGICA and SERVICIOS_DATOS\n`;
      } else if (model === 'Manufacturing') {
        report += `May include INFRAESTRUCTURA_HEREDADA candidates for large industrial companies\n`;
      } else {
        report += `Direct mapping available\n`;
      }
    });
    
    // V4 Model Candidates
    report += `\n## DII v4 Model Candidates\n\n`;
    
    report += `### SERVICIOS_DATOS Candidates (${this.v4Candidates.serviciosDatos.length})\n\n`;
    if (this.v4Candidates.serviciosDatos.length > 0) {
      report += `| Company | Current Model | Industry | Reason |\n`;
      report += `|---------|---------------|----------|--------|\n`;
      this.v4Candidates.serviciosDatos.forEach(c => {
        report += `| ${c.name} | ${c.model} | ${c.industry} | ${c.reason} |\n`;
      });
    }
    
    report += `\n### INFRAESTRUCTURA_HEREDADA Candidates (${this.v4Candidates.infraestructuraHeredada.length})\n\n`;
    if (this.v4Candidates.infraestructuraHeredada.length > 0) {
      report += `| Company | Current Model | Industry | Employees | Reason |\n`;
      report += `|---------|---------------|----------|-----------|--------|\n`;
      this.v4Candidates.infraestructuraHeredada.forEach(c => {
        report += `| ${c.name} | ${c.model} | ${c.industry} | ${c.employees} | ${c.reason} |\n`;
      });
    }
    
    // Recommendations
    report += `\n## Recommendations\n\n`;
    this.recommendations.forEach((rec, idx) => {
      report += `${idx + 1}. ${rec}\n`;
    });
    
    // Add data quality metrics
    report += `\n## Data Quality Metrics\n\n`;
    const criticalFieldsComplete = this.dataQuality.incompleteCompanies.length === 0;
    const noEncodingIssues = this.summary.encodingIssues.length === 0;
    const noDuplicates = this.dataQuality.duplicates.byId.length === 0 && 
                         this.dataQuality.duplicates.byName.length === 0;
    const noInvalidData = this.dataQuality.invalidData.length === 0;
    
    report += `- **Critical Fields Complete:** ${criticalFieldsComplete ? '✅' : '❌'}\n`;
    report += `- **No Encoding Issues:** ${noEncodingIssues ? '✅' : '❌'}\n`;
    report += `- **No Duplicates:** ${noDuplicates ? '✅' : '❌'}\n`;
    report += `- **No Invalid Data:** ${noInvalidData ? '✅' : '❌'}\n`;
    report += `- **Overall Quality Score:** ${this.calculateQualityScore()}/100\n`;
    
    return report;
  }
  
  calculateQualityScore(): number {
    let score = 100;
    
    // Deduct for missing critical data
    score -= this.dataQuality.incompleteCompanies.length * 2;
    
    // Deduct for encoding issues
    score -= this.summary.encodingIssues.length * 5;
    
    // Deduct for duplicates
    score -= (this.dataQuality.duplicates.byId.length + this.dataQuality.duplicates.byName.length) * 3;
    
    // Deduct for invalid data
    score -= this.dataQuality.invalidData.length * 2;
    
    // Deduct for parse errors
    score -= this.summary.parseErrors.length * 5;
    
    return Math.max(0, Math.min(100, score));
  }
}

// Enhanced validation with specific business logic checks
async function validateHistoricalData(): Promise<void> {
  console.log('🔍 Starting Historical Database Validation...\n');
  
  const report = new ValidationReport();
  
  try {
    // Read file with proper encoding
    console.log(`📁 Reading CSV file: ${CSV_FILE_PATH}`);
    const fileBuffer = fs.readFileSync(CSV_FILE_PATH);
    const fileContent = iconv.decode(fileBuffer, ENCODING);
    
    // Check for encoding issues
    const encodingTest = fileContent.match(/[�]/g);
    if (encodingTest) {
      report.addEncodingIssue(`Found ${encodingTest.length} potential encoding issues (� characters)`);
      console.log(`⚠️  Encoding issues detected: ${encodingTest.length} problematic characters`);
    }
    
    // Parse CSV
    console.log('📊 Parsing CSV data...');
    const parseResult = Papa.parse<CompanyRecord>(fileContent, {
      delimiter: ';',
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => value.trim()
    });
    
    if (parseResult.errors.length > 0) {
      console.log(`⚠️  Parse errors found: ${parseResult.errors.length}`);
      parseResult.errors.forEach(err => {
        report.addParseError(`Row ${err.row}: ${err.message}`);
      });
    }
    
    const data = parseResult.data;
    report.summary.totalRecords = data.length;
    console.log(`✅ Parsed ${data.length} records\n`);
    
    // Initialize column tracking
    const columns = Object.keys(data[0] || {}) as (keyof CompanyRecord)[];
    columns.forEach(col => {
      report.dataQuality.missingValues[col] = 0;
    });
    
    // Track duplicates
    const idMap = new Map<string, string[]>();
    const nameMap = new Map<string, string[]>();
    
    // Analyze each record
    console.log('🔎 Analyzing data quality...');
    data.forEach((row, index) => {
      const criticalFields: string[] = [];
      
      // Check missing values
      columns.forEach(col => {
        if (!row[col] || row[col] === '') {
          report.dataQuality.missingValues[col]++;
        }
      });
      
      // Check critical fields
      if (!row.Real_Company_Name) criticalFields.push('Real_Company_Name');
      if (!row.Real_Country) criticalFields.push('Real_Country');
      if (!row.Real_Industry) criticalFields.push('Real_Industry');
      if (!row.Business_Model_v3) criticalFields.push('Business_Model_v3');
      
      if (criticalFields.length > 0) {
        report.addIncompleteCompany(row, criticalFields);
      }
      
      // Check for duplicates
      if (row.Company_ID) {
        const companyName = row.Real_Company_Name || row.Anonymized_Name;
        if (idMap.has(row.Company_ID)) {
          idMap.get(row.Company_ID)!.push(companyName);
        } else {
          idMap.set(row.Company_ID, [companyName]);
        }
      }
      
      if (row.Real_Company_Name) {
        if (nameMap.has(row.Real_Company_Name)) {
          nameMap.get(row.Real_Company_Name)!.push(row.Company_ID);
        } else {
          nameMap.set(row.Real_Company_Name, [row.Company_ID]);
        }
      }
      
      // Validate data ranges
      const employees = parseInt(row.Employee_Count);
      if (employees && employees < 0) {
        report.addInvalidData(row, 'Employee_Count', employees, 'Negative employee count');
      }
      
      const confidence = parseFloat(row.Business_Model_Confidence);
      if (confidence && (confidence < 0 || confidence > 1)) {
        report.addInvalidData(row, 'Business_Model_Confidence', confidence, 'Confidence score outside 0-1 range');
      }
      
      // Validate DII scores
      const diiScores = ['AER', 'HFP', 'BRI', 'TRD', 'RRG'] as const;
      diiScores.forEach(score => {
        const value = parseFloat(row[score]);
        if (value && (value < 0 || value > 10)) {
          report.addInvalidData(row, score, value, `${score} score outside 0-10 range`);
        }
      });
      
      // Business model analysis
      const businessModel = row.Business_Model_v3;
      if (businessModel) {
        report.businessModelAnalysis.v3Distribution[businessModel] = 
          (report.businessModelAnalysis.v3Distribution[businessModel] || 0) + 1;
          
        // Check for invalid v3 models
        if (!V3_BUSINESS_MODELS.includes(businessModel as any)) {
          report.addInvalidData(row, 'Business_Model_v3', businessModel, 'Unknown v3 business model');
        }
      } else {
        report.businessModelAnalysis.missingModels.push({
          companyId: row.Company_ID,
          companyName: row.Real_Company_Name || row.Anonymized_Name
        });
      }
      
      // Enhanced v4 model candidate identification
      if (businessModel === 'Platform' || businessModel === 'SaaS') {
        const companyName = (row.Real_Company_Name || '').toLowerCase();
        const industry = (row.Real_Industry || '').toLowerCase();
        
        // Check for data service indicators
        const hasDataKeywords = DATA_SERVICE_KEYWORDS.some(keyword => 
          companyName.includes(keyword) || industry.includes(keyword)
        );
        
        // Additional checks for technology/public sector platforms
        const isTechPublic = industry.includes('technology') || industry.includes('public');
        
        if (hasDataKeywords || (businessModel === 'Platform' && isTechPublic)) {
          report.v4Candidates.serviciosDatos.push({
            name: row.Real_Company_Name || row.Anonymized_Name,
            model: businessModel,
            industry: row.Real_Industry,
            reason: hasDataKeywords ? 'Keywords suggest data/analytics focus' : 'Tech/Public platform likely data-focused'
          });
        }
      }
      
      // Enhanced legacy infrastructure identification
      const isLargeCompany = employees > 1000;
      const industry = (row.Real_Industry || '').toLowerCase();
      
      const hasLegacyKeywords = LEGACY_INFRASTRUCTURE_KEYWORDS.some(keyword => 
        industry.includes(keyword)
      );
      
      if ((businessModel === 'Manufacturing' || businessModel === 'Platform') && 
          (hasLegacyKeywords || isLargeCompany)) {
        report.v4Candidates.infraestructuraHeredada.push({
          name: row.Real_Company_Name || row.Anonymized_Name,
          model: businessModel,
          industry: row.Real_Industry,
          employees: employees,
          reason: hasLegacyKeywords ? 'Legacy industry sector' : 'Large enterprise size'
        });
      }
    });
    
    // Process duplicates
    idMap.forEach((companies, id) => {
      if (companies.length > 1) {
        report.dataQuality.duplicates.byId.push({ id, companies });
      }
    });
    
    nameMap.forEach((ids, name) => {
      if (ids.length > 1) {
        report.dataQuality.duplicates.byName.push({ name, ids });
      }
    });
    
    // Generate enhanced recommendations
    console.log('📝 Generating recommendations...\n');
    
    if (report.summary.encodingIssues.length > 0) {
      report.recommendations.push('Fix encoding issues by ensuring consistent UTF-8 encoding during migration');
    }
    
    if (report.summary.totalRecords !== EXPECTED_RECORD_COUNT) {
      report.recommendations.push(`Investigate record count mismatch (found ${report.summary.totalRecords}, expected ${EXPECTED_RECORD_COUNT})`);
    }
    
    if (report.dataQuality.incompleteCompanies.length > 10) {
      report.recommendations.push('Review and complete critical data for companies with missing information before migration');
    }
    
    if (report.dataQuality.duplicates.byId.length > 0 || report.dataQuality.duplicates.byName.length > 0) {
      report.recommendations.push('Resolve duplicate entries by merging or assigning unique identifiers');
    }
    
    const platformCount = report.businessModelAnalysis.v3Distribution['Platform'] || 0;
    if (platformCount > 40) {
      report.recommendations.push(`Carefully review ${platformCount} Platform companies for proper v4 classification (PLATAFORMA_TECNOLOGICA vs SERVICIOS_DATOS)`);
    }
    
    if (report.v4Candidates.serviciosDatos.length < 5) {
      report.recommendations.push('Consider manual review to identify more SERVICIOS_DATOS candidates from Platform/SaaS companies');
    }
    
    if (report.v4Candidates.infraestructuraHeredada.length < 5) {
      report.recommendations.push('Review large manufacturing and industrial companies for INFRAESTRUCTURA_HEREDADA classification');
    }
    
    // Additional specific recommendations
    report.recommendations.push('Create a mapping table for v3 to v4 business model migration with manual review for edge cases');
    report.recommendations.push('Implement data validation rules in PostgreSQL to prevent future data quality issues');
    report.recommendations.push('Consider adding a "migration_notes" field to track manual classification decisions');
    report.recommendations.push('Establish a regular data quality review process post-migration');
    
    // Write report
    const markdown = report.generateMarkdown();
    fs.writeFileSync(REPORT_FILE_PATH, markdown, 'utf8');
    console.log(`📄 Validation report written to: ${REPORT_FILE_PATH}\n`);
    
    // Console summary
    console.log('=== VALIDATION SUMMARY ===\n');
    console.log(`Total Records: ${report.summary.totalRecords} (${report.summary.totalRecords === EXPECTED_RECORD_COUNT ? 'PASS ✅' : 'FAIL ❌'})`);
    console.log(`Encoding Issues: ${report.summary.encodingIssues.length}`);
    console.log(`Parse Errors: ${report.summary.parseErrors.length}`);
    console.log(`Incomplete Companies: ${report.dataQuality.incompleteCompanies.length}`);
    console.log(`Invalid Data Issues: ${report.dataQuality.invalidData.length}`);
    console.log(`Data Quality Score: ${report.calculateQualityScore()}/100`);
    console.log(`\nBusiness Model Distribution:`);
    
    Object.entries(report.businessModelAnalysis.v3Distribution)
      .sort((a, b) => b[1] - a[1])
      .forEach(([model, count]) => {
        console.log(`  ${model}: ${count} (${(count / report.summary.totalRecords * 100).toFixed(1)}%)`);
      });
    
    console.log(`\nV4 Model Candidates:`);
    console.log(`  SERVICIOS_DATOS: ${report.v4Candidates.serviciosDatos.length}`);
    console.log(`  INFRAESTRUCTURA_HEREDADA: ${report.v4Candidates.infraestructuraHeredada.length}`);
    
    console.log('\n✅ Validation complete!');
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Run validation if executed directly
if (require.main === module) {
  validateHistoricalData();
}

export { validateHistoricalData, ValidationReport };