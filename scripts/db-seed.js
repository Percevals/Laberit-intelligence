#!/usr/bin/env node

/**
 * Database Seeding Script for Azure PostgreSQL
 * Seeds sample data for development and testing
 */

const { Client } = require('pg');

// Connection configuration
const connectionString = process.env.DATABASE_URL || 
  'postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require';

// Sample companies data
const sampleCompanies = [
  {
    name: 'TechCorp Solutions',
    domain: 'techcorp.com',
    industry_traditional: 'Software & Technology',
    dii_business_model: 'SOFTWARE_CRITICO',
    confidence_score: 0.95,
    classification_reasoning: 'SaaS platform requiring 24/7 availability',
    headquarters: 'São Paulo, Brazil',
    country: 'Brazil',
    region: 'LATAM',
    employees: 500,
    revenue: 50000000
  },
  {
    name: 'Banco Digital Latinoamericano',
    domain: 'bancodigital.com',
    industry_traditional: 'Financial Services',
    dii_business_model: 'SERVICIOS_FINANCIEROS',
    confidence_score: 0.98,
    classification_reasoning: 'Digital banking platform with real-time transaction processing',
    headquarters: 'Mexico City, Mexico',
    country: 'Mexico',
    region: 'LATAM',
    employees: 1200,
    revenue: 150000000
  },
  {
    name: 'EcoMarketplace',
    domain: 'ecomarketplace.com',
    industry_traditional: 'E-commerce',
    dii_business_model: 'ECOSISTEMA_DIGITAL',
    confidence_score: 0.92,
    classification_reasoning: 'Multi-sided platform connecting buyers and sellers',
    headquarters: 'Buenos Aires, Argentina',
    country: 'Argentina',
    region: 'LATAM',
    employees: 300,
    revenue: 25000000
  },
  {
    name: 'DataInsights Analytics',
    domain: 'datainsights.io',
    industry_traditional: 'Data Analytics',
    dii_business_model: 'SERVICIOS_DATOS',
    confidence_score: 0.89,
    classification_reasoning: 'Business model depends on data monetization and analytics services',
    headquarters: 'Santiago, Chile',
    country: 'Chile',
    region: 'LATAM',
    employees: 150,
    revenue: 15000000
  },
  {
    name: 'RetailChain LATAM',
    domain: 'retailchain.com',
    industry_traditional: 'Retail',
    dii_business_model: 'COMERCIO_HIBRIDO',
    confidence_score: 0.91,
    classification_reasoning: 'Omnichannel retail operations spanning physical and digital channels',
    headquarters: 'Lima, Peru',
    country: 'Peru',
    region: 'LATAM',
    employees: 5000,
    revenue: 200000000
  },
  {
    name: 'MedTech Solutions',
    domain: 'medtechsolutions.com',
    industry_traditional: 'Healthcare Technology',
    dii_business_model: 'INFORMACION_REGULADA',
    confidence_score: 0.94,
    classification_reasoning: 'Healthcare data platform requiring strict compliance and security',
    headquarters: 'Bogotá, Colombia',
    country: 'Colombia',
    region: 'LATAM',
    employees: 200,
    revenue: 30000000
  },
  {
    name: 'LogiChain Express',
    domain: 'logichain.com',
    industry_traditional: 'Logistics',
    dii_business_model: 'CADENA_SUMINISTRO',
    confidence_score: 0.88,
    classification_reasoning: 'Supply chain operations dependent on partner integrations',
    headquarters: 'Panama City, Panama',
    country: 'Panama',
    region: 'LATAM',
    employees: 800,
    revenue: 75000000
  },
  {
    name: 'Petróleo Nacional',
    domain: 'petroleonacional.com',
    industry_traditional: 'Energy',
    dii_business_model: 'INFRAESTRUCTURA_HEREDADA',
    confidence_score: 0.85,
    classification_reasoning: 'Traditional infrastructure with ongoing digital transformation',
    headquarters: 'Caracas, Venezuela',
    country: 'Venezuela',
    region: 'LATAM',
    employees: 10000,
    revenue: 500000000
  },
  {
    name: 'CloudFirst Technologies',
    domain: 'cloudfirst.tech',
    industry_traditional: 'Cloud Services',
    dii_business_model: 'SOFTWARE_CRITICO',
    confidence_score: 0.96,
    classification_reasoning: 'Cloud infrastructure provider with critical uptime requirements',
    headquarters: 'Montevideo, Uruguay',
    country: 'Uruguay',
    region: 'LATAM',
    employees: 100,
    revenue: 10000000
  },
  {
    name: 'SecurePayments Corp',
    domain: 'securepayments.com',
    industry_traditional: 'Payment Processing',
    dii_business_model: 'SERVICIOS_FINANCIEROS',
    confidence_score: 0.97,
    classification_reasoning: 'Payment gateway requiring high availability and security',
    headquarters: 'San José, Costa Rica',
    country: 'Costa Rica',
    region: 'LATAM',
    employees: 250,
    revenue: 40000000
  }
];

// Sample dimension values for assessments
const dimensionTemplates = {
  SOFTWARE_CRITICO: { TRD: 4, AER: 85, HFP: 3, BRI: 0.8, RRG: 1.2 },
  SERVICIOS_FINANCIEROS: { TRD: 2, AER: 95, HFP: 4, BRI: 0.9, RRG: 1.1 },
  ECOSISTEMA_DIGITAL: { TRD: 8, AER: 70, HFP: 3, BRI: 0.7, RRG: 1.3 },
  SERVICIOS_DATOS: { TRD: 12, AER: 60, HFP: 2, BRI: 0.6, RRG: 1.4 },
  COMERCIO_HIBRIDO: { TRD: 24, AER: 50, HFP: 3, BRI: 0.7, RRG: 1.5 },
  INFORMACION_REGULADA: { TRD: 6, AER: 90, HFP: 4, BRI: 0.95, RRG: 1.1 },
  CADENA_SUMINISTRO: { TRD: 48, AER: 40, HFP: 2, BRI: 0.5, RRG: 1.8 },
  INFRAESTRUCTURA_HEREDADA: { TRD: 72, AER: 30, HFP: 2, BRI: 0.4, RRG: 2.0 }
};

async function seedDatabase() {
  const isAzure = connectionString.includes('azure.com');
  const config = {
    connectionString,
    ...(isAzure && { ssl: { rejectUnauthorized: false } })
  };
  
  const client = new Client(config);
  
  try {
    console.log('🚀 Starting database seeding...');
    await client.connect();
    console.log('✅ Connected to Azure PostgreSQL');
    
    // Check if data already exists
    const checkResult = await client.query('SELECT COUNT(*) FROM companies');
    const existingCount = parseInt(checkResult.rows[0].count);
    
    if (existingCount > 0) {
      console.log(`⚠️  Database already contains ${existingCount} companies. Skipping seed.`);
      return;
    }
    
    // Begin transaction
    await client.query('BEGIN');
    
    console.log('\n📦 Seeding companies...');
    const companyIds = [];
    
    for (const company of sampleCompanies) {
      const result = await client.query(`
        INSERT INTO companies (
          name, domain, industry_traditional, dii_business_model,
          confidence_score, classification_reasoning, headquarters,
          country, region, employees, revenue
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, name, dii_business_model
      `, [
        company.name, company.domain, company.industry_traditional,
        company.dii_business_model, company.confidence_score,
        company.classification_reasoning, company.headquarters,
        company.country, company.region, company.employees, company.revenue
      ]);
      
      companyIds.push(result.rows[0]);
      console.log(`   ✅ Created: ${company.name}`);
    }
    
    console.log('\n📊 Seeding assessments...');
    let assessmentCount = 0;
    
    // Create assessments for the first 5 companies
    for (let i = 0; i < 5 && i < companyIds.length; i++) {
      const company = companyIds[i];
      const dimensions = dimensionTemplates[company.dii_business_model];
      
      // Calculate DII scores (ensuring they fit in DECIMAL(8,5))
      const dii_raw_score = Math.min(
        (dimensions.TRD * dimensions.AER) / (dimensions.HFP * dimensions.BRI * dimensions.RRG),
        999.99999
      );
      const dii_final_score = Math.min(dii_raw_score / 10, 999.99999); // Scale down and cap at max value
      const confidence_level = Math.floor(85 + Math.random() * 10); // 85-95% as integer
      
      const assessmentResult = await client.query(`
        INSERT INTO assessments (
          company_id, assessment_type, dii_raw_score, dii_final_score,
          confidence_level, framework_version, calculation_inputs
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        company.id, 'quick_30min', dii_raw_score.toFixed(5),
        dii_final_score.toFixed(5), confidence_level,
        'v4.0', JSON.stringify(dimensions)
      ]);
      
      const assessmentId = assessmentResult.rows[0].id;
      
      // Insert dimension scores
      for (const [dimension, value] of Object.entries(dimensions)) {
        await client.query(`
          INSERT INTO dimension_scores (
            assessment_id, dimension, raw_value, confidence_score,
            data_source, validation_status
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          assessmentId, dimension, value, 0.8 + Math.random() * 0.15,
          'expert_estimate', 'valid'
        ]);
      }
      
      assessmentCount++;
      console.log(`   ✅ Created assessment for: ${company.name}`);
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('\n✨ Seeding completed successfully!');
    console.log(`   - ${companyIds.length} companies created`);
    console.log(`   - ${assessmentCount} assessments created`);
    console.log(`   - ${assessmentCount * 5} dimension scores created`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the seeding
seedDatabase().catch(console.error);