#!/usr/bin/env node

/**
 * Historical Company Database Validation Script
 * Validates CSV data quality before PostgreSQL migration
 */

const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const iconv = require('iconv-lite');

// Configuration
const CSV_FILE_PATH = path.join(__dirname, '../data/historical_DB_report.csv');
const REPORT_FILE_PATH = path.join(__dirname, '../data/validation_report.md');
const EXPECTED_RECORD_COUNT = 150;
const ENCODING = 'cp1252';

// DII v3 to v4 mapping reference
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
];

const V4_BUSINESS_MODELS = [
  'SERVICIOS_FINANCIEROS',
  'MANUFACTURA',
  'COMERCIO_RETAIL',
  'PLATAFORMA_TECNOLOGICA',
  'SOFTWARE_SERVICIOS',
  'SALUD_MEDICINA',
  'SERVICIOS_DATOS',
  'INFRAESTRUCTURA_HEREDADA'
];

// Keywords for identifying potential v4 models
const DATA_SERVICE_KEYWORDS = [
  'analytics', 'data', 'bi', 'intelligence', 'insights', 'telemetry',
  'metrics', 'reporting', 'dashboard', 'visualization', 'mining'
];

const LEGACY_INFRASTRUCTURE_KEYWORDS = [
  'energy', 'utility', 'power', 'water', 'telecom', 'transportation',
  'industrial', 'heavy', 'steel', 'mining', 'oil', 'gas', 'infrastructure'
];

class ValidationReport {
  constructor() {
    this.summary = {
      totalRecords: 0,
      expectedRecords: EXPECTED_RECORD_COUNT,
      encodingIssues: [],
      parseErrors: [],
      dataCompleteness: {}
    };
    
    this.dataQuality = {
      missingValues: {},
      incompleteCompanies: [],
      duplicates: {
        byId: [],
        byName: []
      },
      invalidData: []
    };
    
    this.businessModelAnalysis = {
      v3Distribution: {},
      missingModels: [],
      migrationConcerns: []
    };
    
    this.v4Candidates = {
      serviciosDatos: [],
      infraestructuraHeredada: []
    };
    
    this.recommendations = [];
  }
  
  addEncodingIssue(issue) {
    this.summary.encodingIssues.push(issue);
  }
  
  addParseError(error) {
    this.summary.parseErrors.push(error);
  }
  
  addIncompleteCompany(company, missingFields) {
    this.dataQuality.incompleteCompanies.push({
      companyId: company.Company_ID,
      companyName: company.Real_Company_Name || company.Anonymized_Name,
      missingFields
    });
  }
  
  addInvalidData(company, field, value, reason) {
    this.dataQuality.invalidData.push({
      companyId: company.Company_ID,
      companyName: company.Real_Company_Name || company.Anonymized_Name,
      field,
      value,
      reason
    });
  }
  
  generateMarkdown() {
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
        report += `- ID ${dup.id}: ${dup.companies.join(', ')}\n`;
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
    
    return report;
  }
}

// Main validation function
async function validateHistoricalData() {
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
    const parseResult = Papa.parse(fileContent, {
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
    const columns = Object.keys(data[0] || {});
    columns.forEach(col => {
      report.dataQuality.missingValues[col] = 0;
    });
    
    // Track duplicates
    const idMap = new Map();
    const nameMap = new Map();
    
    // Analyze each record
    console.log('🔎 Analyzing data quality...');
    data.forEach((row, index) => {
      const criticalFields = [];
      
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
        if (idMap.has(row.Company_ID)) {
          idMap.get(row.Company_ID).push(row.Real_Company_Name || row.Anonymized_Name);
        } else {
          idMap.set(row.Company_ID, [row.Real_Company_Name || row.Anonymized_Name]);
        }
      }
      
      if (row.Real_Company_Name) {
        if (nameMap.has(row.Real_Company_Name)) {
          nameMap.get(row.Real_Company_Name).push(row.Company_ID);
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
      
      // Business model analysis
      const businessModel = row.Business_Model_v3;
      if (businessModel) {
        report.businessModelAnalysis.v3Distribution[businessModel] = 
          (report.businessModelAnalysis.v3Distribution[businessModel] || 0) + 1;
      } else {
        report.businessModelAnalysis.missingModels.push({
          companyId: row.Company_ID,
          companyName: row.Real_Company_Name || row.Anonymized_Name
        });
      }
      
      // Identify v4 model candidates
      if (businessModel === 'Platform' || businessModel === 'SaaS') {
        const companyName = (row.Real_Company_Name || '').toLowerCase();
        const industry = (row.Real_Industry || '').toLowerCase();
        
        const hasDataKeywords = DATA_SERVICE_KEYWORDS.some(keyword => 
          companyName.includes(keyword) || industry.includes(keyword)
        );
        
        if (hasDataKeywords) {
          report.v4Candidates.serviciosDatos.push({
            name: row.Real_Company_Name || row.Anonymized_Name,
            model: businessModel,
            industry: row.Real_Industry,
            reason: 'Keywords suggest data/analytics focus'
          });
        }
      }
      
      if ((businessModel === 'Manufacturing' || businessModel === 'Platform') && employees > 1000) {
        const industry = (row.Real_Industry || '').toLowerCase();
        
        const hasLegacyKeywords = LEGACY_INFRASTRUCTURE_KEYWORDS.some(keyword => 
          industry.includes(keyword)
        );
        
        if (hasLegacyKeywords || employees > 5000) {
          report.v4Candidates.infraestructuraHeredada.push({
            name: row.Real_Company_Name || row.Anonymized_Name,
            model: businessModel,
            industry: row.Real_Industry,
            employees: employees,
            reason: hasLegacyKeywords ? 'Legacy industry sector' : 'Large enterprise size'
          });
        }
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
    
    // Generate recommendations
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
    
    report.recommendations.push('Create a mapping table for v3 to v4 business model migration with manual review for edge cases');
    report.recommendations.push('Implement data validation rules in PostgreSQL to prevent future data quality issues');
    
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
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run validation
validateHistoricalData();