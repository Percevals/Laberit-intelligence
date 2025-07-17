#!/usr/bin/env node

/**
 * Enhanced Test Migration Script: DII v3 to v4 Business Model Migration
 * Uses the actual DIIBusinessModelClassifier algorithm from the application
 */

const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const iconv = require('iconv-lite');

// Configuration
const CSV_FILE_PATH = path.join(__dirname, '../data/historical_DB_report.csv');
const OUTPUT_FILE_PATH = path.join(__dirname, '../data/test_migration_results_enhanced.json');
const ENCODING = 'cp1252';

// DII v4 Business Models (Spanish names as used in the app)
const DIIv4BusinessModel = {
  SERVICIOS_FINANCIEROS: 'SERVICIOS_FINANCIEROS',
  COMERCIO_HIBRIDO: 'COMERCIO_HIBRIDO',
  SOFTWARE_CRITICO: 'SOFTWARE_CRITICO',
  INFORMACION_REGULADA: 'INFORMACION_REGULADA',
  ECOSISTEMA_DIGITAL: 'ECOSISTEMA_DIGITAL',
  CADENA_SUMINISTRO: 'CADENA_SUMINISTRO',
  SERVICIOS_DATOS: 'SERVICIOS_DATOS',
  INFRAESTRUCTURA_HEREDADA: 'INFRAESTRUCTURA_HEREDADA'
};

// Map English to Spanish model names
const MODEL_NAME_MAP = {
  'SERVICIOS_FINANCIEROS': 'SERVICIOS_FINANCIEROS',
  'MANUFACTURA': 'CADENA_SUMINISTRO', // Manufacturing maps to Supply Chain
  'COMERCIO_RETAIL': 'COMERCIO_HIBRIDO', // Traditional Retail maps to Hybrid Commerce
  'PLATAFORMA_TECNOLOGICA': 'ECOSISTEMA_DIGITAL', // Platform maps to Digital Ecosystem
  'SOFTWARE_SERVICIOS': 'SOFTWARE_CRITICO', // SaaS maps to Critical Software
  'SALUD_MEDICINA': 'INFORMACION_REGULADA', // Healthcare maps to Regulated Information
  'SERVICIOS_DATOS': 'SERVICIOS_DATOS',
  'INFRAESTRUCTURA_HEREDADA': 'INFRAESTRUCTURA_HEREDADA'
};

// Revenue model mapping based on v3 business models
const V3_TO_REVENUE_MODEL = {
  'Financial Services': 'per_transaction',
  'Manufacturing': 'product_sales',
  'Traditional Retail': 'direct_sales',
  'Platform': 'platform_fees',
  'SaaS': 'recurring_subscriptions',
  'Healthcare': 'enterprise_contracts',
  'XaaS': 'recurring_subscriptions',
  'Marketplace': 'platform_fees',
  'Hybrid': 'direct_sales'
};

// Operational dependency inference based on cloud adoption and industry
const CLOUD_TO_DEPENDENCY = {
  'Cloud-First': 'fully_digital',
  'Hybrid': 'hybrid_model',
  'Minimal': 'physical_critical',
  'On-Premise': 'physical_critical'
};

/**
 * DIIBusinessModelClassifier - Ported from TypeScript
 */
class DIIBusinessModelClassifier {
  /**
   * Industry-specific classification (direct port from the app)
   */
  static classifyByIndustry(industry, companyName) {
    const industryLower = industry.toLowerCase();
    const nameLower = companyName.toLowerCase();

    // Airlines → Digital Ecosystem
    if (industryLower.includes('airline') || industryLower.includes('aerolínea') ||
        industryLower.includes('transportation') || industryLower.includes('aviation')) {
      return {
        model: DIIv4BusinessModel.ECOSISTEMA_DIGITAL,
        confidence: 0.85,
        reasoning: 'Airlines operate digital booking ecosystems with partners, lounges, and services'
      };
    }

    // Banks → Financial Services
    if (industryLower.includes('bank') || industryLower.includes('banco') ||
        industryLower.includes('financial') || industryLower.includes('insurance') ||
        nameLower.includes('banco') || nameLower.includes('seguros')) {
      return {
        model: DIIv4BusinessModel.SERVICIOS_FINANCIEROS,
        confidence: 0.95,
        reasoning: 'Banking operations require real-time transaction processing with zero downtime tolerance'
      };
    }

    // Retail → Hybrid Commerce
    if (industryLower.includes('retail') || industryLower.includes('comercio') ||
        nameLower.includes('super') || nameLower.includes('market')) {
      return {
        model: DIIv4BusinessModel.COMERCIO_HIBRIDO,
        confidence: 0.90,
        reasoning: 'Retail operations span physical stores and digital channels requiring omnichannel security'
      };
    }

    // Software/Technology → Critical Software or Data Services
    if (industryLower.includes('software') || industryLower.includes('technology') || 
        industryLower.includes('tech')) {
      // Check for data/analytics keywords
      if (nameLower.includes('data') || nameLower.includes('analytics') || 
          nameLower.includes('intelligence')) {
        return {
          model: DIIv4BusinessModel.SERVICIOS_DATOS,
          confidence: 0.90,
          reasoning: 'Technology company focused on data services and analytics'
        };
      }
      return {
        model: DIIv4BusinessModel.SOFTWARE_CRITICO,
        confidence: 0.90,
        reasoning: 'Software platforms require 24/7 availability with customer data protection'
      };
    }

    // Healthcare → Regulated Information
    if (industryLower.includes('health') || industryLower.includes('salud') || 
        industryLower.includes('hospital') || industryLower.includes('medical')) {
      return {
        model: DIIv4BusinessModel.INFORMACION_REGULADA,
        confidence: 0.95,
        reasoning: 'Healthcare data requires strict compliance with patient privacy regulations'
      };
    }

    // Manufacturing/Industrial → Supply Chain or Legacy Infrastructure
    if (industryLower.includes('manufactur') || industryLower.includes('industrial')) {
      return null; // Will use matrix classification
    }

    // Energy/Utilities → Legacy Infrastructure
    if (industryLower.includes('energy') || industryLower.includes('utility') ||
        industryLower.includes('power') || industryLower.includes('oil') ||
        industryLower.includes('gas') || industryLower.includes('electric')) {
      return {
        model: DIIv4BusinessModel.INFRAESTRUCTURA_HEREDADA,
        confidence: 0.85,
        reasoning: 'Energy and utilities operate critical legacy infrastructure'
      };
    }

    // Public Sector → Depends on function
    if (industryLower.includes('public') || industryLower.includes('government')) {
      // Check if it's data/statistics focused
      if (nameLower.includes('statistics') || nameLower.includes('census') ||
          nameLower.includes('information') || nameLower.includes('data')) {
        return {
          model: DIIv4BusinessModel.SERVICIOS_DATOS,
          confidence: 0.80,
          reasoning: 'Public sector data and information services'
        };
      }
      return {
        model: DIIv4BusinessModel.ECOSISTEMA_DIGITAL,
        confidence: 0.70,
        reasoning: 'Public sector digital platform for citizen services'
      };
    }

    return null; // No industry match, use matrix
  }

  /**
   * Matrix-based classification
   */
  static classifyByMatrix(revenueModel, operationalDependency) {
    // Direct port of the classification matrix
    switch (revenueModel) {
      case 'recurring_subscriptions':
        if (operationalDependency === 'fully_digital') {
          return {
            model: DIIv4BusinessModel.SOFTWARE_CRITICO,
            confidence: 0.95,
            reasoning: 'Critical SaaS platform with recurring revenue requiring high availability'
          };
        } else if (operationalDependency === 'hybrid_model') {
          return {
            model: DIIv4BusinessModel.SOFTWARE_CRITICO,
            confidence: 0.80,
            reasoning: 'Software service with some physical touchpoints but primarily digital delivery'
          };
        } else {
          return {
            model: DIIv4BusinessModel.INFRAESTRUCTURA_HEREDADA,
            confidence: 0.75,
            reasoning: 'Subscription service built on legacy physical infrastructure'
          };
        }
        
      case 'per_transaction':
        if (operationalDependency === 'fully_digital') {
          return {
            model: DIIv4BusinessModel.SERVICIOS_FINANCIEROS,
            confidence: 0.90,
            reasoning: 'Digital payment processing requiring real-time availability and security'
          };
        } else {
          return {
            model: DIIv4BusinessModel.SERVICIOS_FINANCIEROS,
            confidence: 0.85,
            reasoning: 'Transaction processing with physical payment points (ATMs, POS)'
          };
        }
        
      case 'platform_fees':
        return {
          model: DIIv4BusinessModel.ECOSISTEMA_DIGITAL,
          confidence: 0.95,
          reasoning: 'Digital ecosystem monetizing through platform participation fees'
        };
        
      case 'data_monetization':
        return {
          model: DIIv4BusinessModel.SERVICIOS_DATOS,
          confidence: 0.95,
          reasoning: 'Business model centered on data collection, analysis, and insights'
        };
        
      case 'product_sales':
        if (operationalDependency === 'physical_critical') {
          return {
            model: DIIv4BusinessModel.CADENA_SUMINISTRO,
            confidence: 0.85,
            reasoning: 'Physical product distribution requiring supply chain coordination'
          };
        } else if (operationalDependency === 'hybrid_model') {
          return {
            model: DIIv4BusinessModel.COMERCIO_HIBRIDO,
            confidence: 0.90,
            reasoning: 'Omnichannel retail combining physical and digital sales channels'
          };
        } else {
          return {
            model: DIIv4BusinessModel.COMERCIO_HIBRIDO,
            confidence: 0.80,
            reasoning: 'Digital commerce platform with logistics integration'
          };
        }
        
      case 'direct_sales':
        if (operationalDependency === 'physical_critical') {
          return {
            model: DIIv4BusinessModel.COMERCIO_HIBRIDO,
            confidence: 0.90,
            reasoning: 'Traditional retail with digital transformation initiatives'
          };
        } else if (operationalDependency === 'hybrid_model') {
          return {
            model: DIIv4BusinessModel.COMERCIO_HIBRIDO,
            confidence: 0.95,
            reasoning: 'Hybrid commerce model balancing physical and digital channels'
          };
        } else {
          return {
            model: DIIv4BusinessModel.ECOSISTEMA_DIGITAL,
            confidence: 0.75,
            reasoning: 'Digital-first direct sales potentially evolving into platform'
          };
        }
        
      case 'enterprise_contracts':
        if (operationalDependency === 'physical_critical') {
          return {
            model: DIIv4BusinessModel.INFRAESTRUCTURA_HEREDADA,
            confidence: 0.85,
            reasoning: 'Enterprise services managing legacy infrastructure and systems'
          };
        } else if (operationalDependency === 'hybrid_model') {
          return {
            model: DIIv4BusinessModel.INFRAESTRUCTURA_HEREDADA,
            confidence: 0.80,
            reasoning: 'B2B services bridging legacy and modern systems'
          };
        } else {
          return {
            model: DIIv4BusinessModel.SOFTWARE_CRITICO,
            confidence: 0.85,
            reasoning: 'Enterprise software solutions critical for client operations'
          };
        }
        
      case 'project_based':
        if (operationalDependency === 'fully_digital') {
          return {
            model: DIIv4BusinessModel.SOFTWARE_CRITICO,
            confidence: 0.80,
            reasoning: 'Digital consulting and implementation services'
          };
        } else if (operationalDependency === 'physical_critical') {
          return {
            model: DIIv4BusinessModel.INFRAESTRUCTURA_HEREDADA,
            confidence: 0.75,
            reasoning: 'Project services for physical infrastructure modernization'
          };
        } else {
          return {
            model: DIIv4BusinessModel.SERVICIOS_DATOS,
            confidence: 0.70,
            reasoning: 'Professional services potentially involving data analysis'
          };
        }
        
      default:
        return {
          model: DIIv4BusinessModel.COMERCIO_HIBRIDO,
          confidence: 0.50,
          reasoning: 'Unable to determine specific model, defaulting to most common hybrid pattern'
        };
    }
  }
}

class EnhancedV3toV4Migrator {
  constructor() {
    this.results = [];
  }

  /**
   * Classify a company using the DII algorithm
   */
  classifyCompany(company) {
    console.log(`\n🔄 Processing: ${company.Real_Company_Name} (ID: ${company.Company_ID})`);
    
    const result = {
      companyId: company.Company_ID,
      companyName: company.Real_Company_Name,
      originalModel: company.Business_Model_v3,
      proposedModel: null,
      confidence: 0,
      reasoning: [],
      requiresReview: false,
      migrationStatus: 'success',
      validationErrors: [],
      classificationMethod: 'unknown'
    };

    // Validate required fields
    const validationErrors = this.validateCompanyData(company);
    if (validationErrors.length > 0) {
      result.validationErrors = validationErrors;
      result.migrationStatus = 'error';
      result.requiresReview = true;
    }

    // Step 1: Try industry-based classification first
    const industryClassification = DIIBusinessModelClassifier.classifyByIndustry(
      company.Real_Industry || '',
      company.Real_Company_Name
    );

    if (industryClassification) {
      result.proposedModel = industryClassification.model;
      result.confidence = industryClassification.confidence;
      result.reasoning.push(industryClassification.reasoning);
      result.classificationMethod = 'industry';
    } else {
      // Step 2: Use matrix classification as fallback
      const revenueModel = this.inferRevenueModel(company);
      const operationalDependency = this.inferOperationalDependency(company);
      
      console.log(`  Inferred: Revenue=${revenueModel}, Dependency=${operationalDependency}`);
      
      const matrixClassification = DIIBusinessModelClassifier.classifyByMatrix(
        revenueModel,
        operationalDependency
      );
      
      result.proposedModel = matrixClassification.model;
      result.confidence = matrixClassification.confidence;
      result.reasoning.push(matrixClassification.reasoning);
      result.reasoning.push(`Matrix classification: ${revenueModel} + ${operationalDependency}`);
      result.classificationMethod = 'matrix';
    }

    // Apply additional context adjustments
    this.applyContextAdjustments(company, result);

    // Flag for review if low confidence
    if (result.confidence < 0.7) {
      result.requiresReview = true;
      result.migrationStatus = result.migrationStatus === 'error' ? 'error' : 'warning';
    }

    // Generate SQL insert
    result.sqlInsert = this.generateSQLInsert(company, result.proposedModel);

    // Console output
    console.log(`  Original: ${result.originalModel} → Proposed: ${result.proposedModel}`);
    console.log(`  Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`  Method: ${result.classificationMethod}`);
    console.log(`  Reasoning: ${result.reasoning.join('; ')}`);
    console.log(`  Status: ${result.migrationStatus} ${result.requiresReview ? '⚠️ Requires Review' : '✅'}`);

    return result;
  }

  /**
   * Infer revenue model from v3 business model and context
   */
  inferRevenueModel(company) {
    // Direct mapping from v3 model
    if (V3_TO_REVENUE_MODEL[company.Business_Model_v3]) {
      return V3_TO_REVENUE_MODEL[company.Business_Model_v3];
    }

    // Infer from industry and company name
    const industry = (company.Real_Industry || '').toLowerCase();
    const name = (company.Real_Company_Name || '').toLowerCase();

    if (industry.includes('financial') || industry.includes('bank')) {
      return 'per_transaction';
    }
    if (industry.includes('software') || industry.includes('saas')) {
      return 'recurring_subscriptions';
    }
    if (industry.includes('retail') || industry.includes('commerce')) {
      return 'direct_sales';
    }
    if (name.includes('platform') || name.includes('marketplace')) {
      return 'platform_fees';
    }
    if (name.includes('data') || name.includes('analytics')) {
      return 'data_monetization';
    }

    // Default based on employee count
    const employees = parseInt(company.Employee_Count) || 0;
    if (employees > 5000) {
      return 'enterprise_contracts';
    }

    return 'product_sales'; // Default
  }

  /**
   * Infer operational dependency from cloud adoption and industry
   */
  inferOperationalDependency(company) {
    // Direct mapping from cloud adoption level
    if (CLOUD_TO_DEPENDENCY[company.CLOUD_ADOPTION_LEVEL]) {
      return CLOUD_TO_DEPENDENCY[company.CLOUD_ADOPTION_LEVEL];
    }

    // Infer from industry
    const industry = (company.Real_Industry || '').toLowerCase();
    
    if (industry.includes('software') || industry.includes('technology') || 
        industry.includes('saas') || industry.includes('digital')) {
      return 'fully_digital';
    }
    
    if (industry.includes('manufacturing') || industry.includes('industrial') ||
        industry.includes('energy') || industry.includes('utility')) {
      return 'physical_critical';
    }

    return 'hybrid_model'; // Default for most businesses
  }

  /**
   * Apply additional context adjustments
   */
  applyContextAdjustments(company, result) {
    const employees = parseInt(company.Employee_Count) || 0;
    const industry = (company.Real_Industry || '').toLowerCase();

    // Large manufacturing companies might be legacy infrastructure
    if (company.Business_Model_v3 === 'Manufacturing' && employees > 5000) {
      if (result.proposedModel === DIIv4BusinessModel.CADENA_SUMINISTRO) {
        result.proposedModel = DIIv4BusinessModel.INFRAESTRUCTURA_HEREDADA;
        result.reasoning.push(`Large manufacturer (${employees} employees) likely has legacy infrastructure`);
        result.confidence = Math.min(result.confidence, 0.8);
      }
    }

    // Platform companies in public sector often handle data
    if (company.Business_Model_v3 === 'Platform' && industry.includes('public')) {
      if (result.proposedModel === DIIv4BusinessModel.ECOSISTEMA_DIGITAL) {
        result.proposedModel = DIIv4BusinessModel.SERVICIOS_DATOS;
        result.reasoning.push('Public sector platform likely focuses on data services');
        result.confidence = Math.max(result.confidence, 0.75);
      }
    }

    // Adjust confidence based on data completeness
    if (!company.Business_Model_Confidence || parseFloat(company.Business_Model_Confidence) < 0.5) {
      result.confidence *= 0.8;
      result.reasoning.push('Low confidence in original classification');
    }
  }

  /**
   * Validate company data
   */
  validateCompanyData(company) {
    const errors = [];

    if (!company.Company_ID) errors.push('Missing Company_ID');
    if (!company.Real_Company_Name) errors.push('Missing Real_Company_Name');
    if (!company.Business_Model_v3) errors.push('Missing Business_Model_v3');
    
    return errors;
  }

  /**
   * Generate SQL INSERT statement
   */
  generateSQLInsert(company, v4Model) {
    const escapeString = (str) => str ? str.replace(/'/g, "''") : '';
    
    const values = [
      company.Company_ID,
      escapeString(company.Real_Company_Name),
      escapeString(company.Real_Country),
      escapeString(company.Real_Industry),
      parseInt(company.Employee_Count) || 0,
      v4Model,
      company.AER,
      company.HFP,
      company.BRI,
      company.TRD,
      company.RRG,
      escapeString(company.CLOUD_ADOPTION_LEVEL)
    ];

    return `INSERT INTO companies (id, name, country, industry, employee_count, business_model_v4, aer_score, hfp_score, bri_score, trd_score, rrg_score, cloud_adoption) VALUES (${values.map(v => typeof v === 'string' ? `'${v}'` : v).join(', ')});`;
  }

  /**
   * Process test subset
   */
  async processTestSubset(companies) {
    console.log('🚀 Starting Enhanced v3 to v4 Migration Test\n');
    console.log('Using DII Business Model Classifier Algorithm\n');
    console.log('=' .repeat(60));

    // Select same test subset as before for comparison
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
   * Select same test subset for comparison
   */
  selectTestSubset(companies) {
    const subset = [];

    // Same selection logic as before
    const financialServices = companies.filter(c => c.Business_Model_v3 === 'Financial Services');
    subset.push(...financialServices.slice(0, 3));

    const platforms = companies.filter(c => c.Business_Model_v3 === 'Platform');
    const publicPlatforms = platforms.filter(c => (c.Real_Industry || '').toLowerCase().includes('public'));
    subset.push(...publicPlatforms.slice(0, 3));

    const manufacturing = companies.filter(c => c.Business_Model_v3 === 'Manufacturing');
    const largeManufacturing = manufacturing
      .filter(c => parseInt(c.Employee_Count) > 2000)
      .sort((a, b) => parseInt(b.Employee_Count) - parseInt(a.Employee_Count));
    subset.push(...largeManufacturing.slice(0, 3));

    const lowConfidence = companies.filter(c => {
      const conf = parseFloat(c.Business_Model_Confidence);
      return conf > 0 && conf < 0.6;
    });
    subset.push(...lowConfidence.slice(0, 3));

    const saas = companies.find(c => c.Business_Model_v3 === 'SaaS');
    const healthcare = companies.find(c => c.Business_Model_v3 === 'Healthcare');
    const retail = companies.find(c => c.Business_Model_v3 === 'Traditional Retail');
    
    if (saas) subset.push(saas);
    if (healthcare) subset.push(healthcare);
    if (retail) subset.push(retail);

    const uniqueMap = new Map();
    subset.forEach(c => uniqueMap.set(c.Company_ID, c));
    return Array.from(uniqueMap.values()).slice(0, 15);
  }

  /**
   * Generate enhanced report
   */
  generateReport() {
    const byModel = {};
    const byMethod = { industry: 0, matrix: 0 };
    let totalConfidence = 0;
    let requiresReviewCount = 0;
    let successCount = 0;
    let warningCount = 0;
    let errorCount = 0;

    this.results.forEach(result => {
      byModel[result.proposedModel] = (byModel[result.proposedModel] || 0) + 1;
      byMethod[result.classificationMethod]++;
      totalConfidence += result.confidence;
      
      if (result.requiresReview) requiresReviewCount++;
      
      switch (result.migrationStatus) {
        case 'success': successCount++; break;
        case 'warning': warningCount++; break;
        case 'error': errorCount++; break;
      }
    });

    const report = {
      timestamp: new Date().toISOString(),
      totalCompanies: this.results.length,
      successCount,
      warningCount,
      errorCount,
      results: this.results,
      summary: {
        byModel: byModel,
        byMethod: byMethod,
        avgConfidence: totalConfidence / this.results.length,
        requiresReviewCount
      }
    };

    // Console summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 ENHANCED MIGRATION TEST SUMMARY\n');
    console.log(`Total Companies Tested: ${report.totalCompanies}`);
    console.log(`Success: ${successCount} | Warnings: ${warningCount} | Errors: ${errorCount}`);
    console.log(`Average Confidence: ${(report.summary.avgConfidence * 100).toFixed(1)}%`);
    console.log(`Requires Manual Review: ${requiresReviewCount}`);
    
    console.log('\nClassification Method Used:');
    console.log(`  Industry-based: ${byMethod.industry}`);
    console.log(`  Matrix-based: ${byMethod.matrix}`);
    
    console.log('\nProposed v4 Model Distribution:');
    Object.entries(byModel)
      .sort((a, b) => b[1] - a[1])
      .forEach(([model, count]) => {
        console.log(`  ${model}: ${count}`);
      });

    return report;
  }
}

// Main execution
async function runEnhancedMigrationTest() {
  try {
    // Read and parse CSV
    const fileBuffer = fs.readFileSync(CSV_FILE_PATH);
    const fileContent = iconv.decode(fileBuffer, ENCODING);
    
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

    // Run enhanced migration test
    const migrator = new EnhancedV3toV4Migrator();
    const report = await migrator.processTestSubset(parseResult.data);

    console.log('\n✅ Enhanced migration test complete!');
    console.log(`\nKey Improvements:`);
    console.log(`- Uses actual DII classification algorithm`);
    console.log(`- Industry-specific shortcuts for better accuracy`);
    console.log(`- Matrix-based classification with inferred parameters`);
    console.log(`- Context-aware adjustments`);

  } catch (error) {
    console.error('❌ Enhanced migration test failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  runEnhancedMigrationTest();
}

module.exports = { EnhancedV3toV4Migrator, runEnhancedMigrationTest };