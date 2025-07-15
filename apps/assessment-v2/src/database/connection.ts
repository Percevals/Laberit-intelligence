/**
 * Database Connection Manager
 * Uses SQLite for simplicity and reliability in assessment applications
 */

import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';

export interface DatabaseConnection {
  db: Database.Database;
  isConnected: boolean;
  close(): void;
  execute(sql: string, params?: any[]): any;
  query(sql: string, params?: any[]): any[];
  queryOne(sql: string, params?: any[]): any | null;
}

class SQLiteConnection implements DatabaseConnection {
  public db: Database.Database;
  public isConnected: boolean = false;

  constructor(dbPath: string) {
    // Ensure database directory exists
    const dbDir = dbPath.substring(0, dbPath.lastIndexOf('/'));
    if (!existsSync(dbDir)) {
      mkdirSync(dbDir, { recursive: true });
    }

    // Initialize SQLite database
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL'); // Better performance
    this.db.pragma('foreign_keys = ON');  // Enable foreign key constraints
    this.isConnected = true;

    console.log(`✅ Database connected: ${dbPath}`);
  }

  execute(sql: string, params: any[] = []): any {
    try {
      const stmt = this.db.prepare(sql);
      return stmt.run(...params);
    } catch (error) {
      console.error('Database execute error:', error);
      throw error;
    }
  }

  query(sql: string, params: any[] = []): any[] {
    try {
      const stmt = this.db.prepare(sql);
      return stmt.all(...params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  queryOne(sql: string, params: any[] = []): any | null {
    try {
      const stmt = this.db.prepare(sql);
      return stmt.get(...params) || null;
    } catch (error) {
      console.error('Database queryOne error:', error);
      throw error;
    }
  }

  close(): void {
    if (this.isConnected) {
      this.db.close();
      this.isConnected = false;
      console.log('📴 Database connection closed');
    }
  }
}

// Database configuration
const DB_CONFIG = {
  development: './data/dii-assessment-dev.db',
  production: './data/dii-assessment.db',
  test: ':memory:' // In-memory for tests
};

// Singleton connection instance
let connectionInstance: DatabaseConnection | null = null;

/**
 * Get database connection (singleton pattern)
 */
export function getDatabaseConnection(): DatabaseConnection {
  if (!connectionInstance) {
    const env = process.env.NODE_ENV || 'development';
    const dbPath = DB_CONFIG[env as keyof typeof DB_CONFIG] || DB_CONFIG.development;
    
    connectionInstance = new SQLiteConnection(dbPath);
  }

  return connectionInstance;
}

/**
 * Initialize database with schema and seed data
 */
export async function initializeDatabase(): Promise<void> {
  const connection = getDatabaseConnection();
  
  console.log('🔧 Initializing database schema...');
  
  try {
    // Execute schema creation
    await createTables(connection);
    
    // Seed initial data
    await seedInitialData(connection);
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Create all database tables
 */
async function createTables(connection: DatabaseConnection): Promise<void> {
  // Read and execute schema.sql
  const schemaSQL = `
    -- Companies table
    CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        legal_name TEXT,
        domain TEXT UNIQUE,
        
        -- Traditional Industry (from industries.ts)
        industry_traditional TEXT NOT NULL,
        
        -- DII Business Model Classification (Static)
        dii_business_model TEXT NOT NULL CHECK (dii_business_model IN (
            'COMERCIO_HIBRIDO',
            'SOFTWARE_CRITICO', 
            'SERVICIOS_DATOS',
            'ECOSISTEMA_DIGITAL',
            'SERVICIOS_FINANCIEROS',
            'INFRAESTRUCTURA_HEREDADA',
            'CADENA_SUMINISTRO',
            'INFORMACION_REGULADA'
        )),
        confidence_score REAL CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
        classification_reasoning TEXT,
        
        -- Company Details
        headquarters TEXT,
        country TEXT,
        region TEXT DEFAULT 'LATAM',
        employees INTEGER,
        revenue INTEGER, -- Annual revenue in USD
        
        -- Metadata
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Assessments table
    CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
        
        -- Assessment Details
        assessment_type TEXT NOT NULL CHECK (assessment_type IN (
            'quick_30min',
            'formal_comprehensive', 
            'benchmark_update',
            'follow_up'
        )),
        
        -- DII Scores
        dii_raw_score REAL,
        dii_final_score REAL,
        confidence_level INTEGER CHECK (confidence_level >= 0 AND confidence_level <= 100),
        
        -- Assessment Context
        assessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        assessed_by_user_id TEXT,
        framework_version TEXT DEFAULT 'v4.0',
        
        -- Calculation Inputs (JSON)
        calculation_inputs TEXT, -- JSON stored as TEXT in SQLite
        
        -- Metadata
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Dimension Scores table
    CREATE TABLE IF NOT EXISTS dimension_scores (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
        
        -- The 5 DII Dimensions
        dimension TEXT NOT NULL CHECK (dimension IN ('TRD', 'AER', 'HFP', 'BRI', 'RRG')),
        
        -- Score Values
        raw_value REAL NOT NULL,
        normalized_value REAL,
        confidence_score REAL CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
        
        -- Data Quality
        data_source TEXT CHECK (data_source IN (
            'incident_history',
            'simulation_exercise', 
            'expert_estimate',
            'industry_benchmark',
            'ai_inference'
        )),
        validation_status TEXT DEFAULT 'valid' CHECK (validation_status IN (
            'valid', 'flagged', 'requires_review', 'invalid'
        )),
        
        -- Supporting Evidence
        calculation_method TEXT,
        supporting_evidence TEXT, -- JSON stored as TEXT
        
        -- Metadata  
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        -- Constraints
        UNIQUE(assessment_id, dimension)
    );

    -- DII Model Profiles table
    CREATE TABLE IF NOT EXISTS dii_model_profiles (
        model_id INTEGER PRIMARY KEY CHECK (model_id >= 1 AND model_id <= 8),
        model_name TEXT NOT NULL UNIQUE,
        
        -- DII Baseline Ranges
        dii_base_min REAL NOT NULL,
        dii_base_max REAL NOT NULL, 
        dii_base_avg REAL NOT NULL,
        risk_multiplier REAL NOT NULL,
        
        -- Digital Dependency Ranges
        digital_dependency_min INTEGER CHECK (digital_dependency_min >= 0 AND digital_dependency_min <= 100),
        digital_dependency_max INTEGER CHECK (digital_dependency_max >= 0 AND digital_dependency_max <= 100),
        
        -- Typical TRD Ranges (hours)
        typical_trd_hours_min REAL,
        typical_trd_hours_max REAL,
        
        -- Business Logic
        vulnerability_patterns TEXT, -- JSON stored as TEXT
        example_companies TEXT,      -- JSON stored as TEXT
        cyber_risk_explanation TEXT,
        
        -- Metadata
        active_from DATETIME DEFAULT CURRENT_TIMESTAMP,
        active_to DATETIME,
        
        -- Constraints
        CHECK (dii_base_min <= dii_base_avg),
        CHECK (dii_base_avg <= dii_base_max),
        CHECK (digital_dependency_min <= digital_dependency_max),
        CHECK (typical_trd_hours_min <= typical_trd_hours_max)
    );

    -- Classification Rules table
    CREATE TABLE IF NOT EXISTS classification_rules (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        
        -- Rule Conditions
        industry_pattern TEXT, -- Keyword patterns for industry matching
        revenue_model TEXT CHECK (revenue_model IN (
            'recurring_subscriptions', 'per_transaction', 'project_based',
            'product_sales', 'data_monetization', 'platform_fees',
            'direct_sales', 'enterprise_contracts'
        )),
        operational_dependency TEXT CHECK (operational_dependency IN (
            'fully_digital', 'hybrid_model', 'physical_critical'
        )),
        
        -- Rule Output
        target_dii_model TEXT NOT NULL,
        confidence_level REAL CHECK (confidence_level >= 0.0 AND confidence_level <= 1.0),
        reasoning_template TEXT NOT NULL,
        
        -- Rule Metadata
        rule_priority INTEGER DEFAULT 100, -- Lower = higher priority
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Benchmark Data table
    CREATE TABLE IF NOT EXISTS benchmark_data (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        
        -- Benchmark Scope
        business_model TEXT NOT NULL,
        region TEXT DEFAULT 'LATAM',
        sector TEXT, -- Optional sector filter
        
        -- Sample Data
        calculation_date DATE NOT NULL,
        sample_size INTEGER NOT NULL CHECK (sample_size >= 1),
        
        -- Percentile Data (JSON stored as TEXT)
        dii_percentiles TEXT NOT NULL, -- {"p25": 2.1, "p50": 3.5, ...}
        dimension_medians TEXT,        -- {"TRD": 24, "AER": 0.5, ...}
        
        -- Recalculation Schedule
        next_recalculation_due DATE,
        
        -- Metadata
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        -- Constraints
        UNIQUE(business_model, region, sector, calculation_date)
    );

    -- Validation Rules table
    CREATE TABLE IF NOT EXISTS validation_rules (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        
        -- Rule Definition
        rule_name TEXT NOT NULL UNIQUE,
        rule_type TEXT NOT NULL CHECK (rule_type IN (
            'dimension_validation', 'cross_dimension_check',
            'business_model_validation', 'data_quality_check'
        )),
        
        -- Rule Logic
        applies_to TEXT, -- Which dimension/model this applies to
        condition_sql TEXT NOT NULL, -- SQL condition to check
        severity TEXT DEFAULT 'warning' CHECK (severity IN ('error', 'warning', 'info')),
        message_template TEXT NOT NULL,
        
        -- Rule Status
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry_traditional);
    CREATE INDEX IF NOT EXISTS idx_companies_dii_model ON companies(dii_business_model);
    CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(country);
    CREATE INDEX IF NOT EXISTS idx_assessments_company ON assessments(company_id);
    CREATE INDEX IF NOT EXISTS idx_assessments_date ON assessments(assessed_at);
    CREATE INDEX IF NOT EXISTS idx_dimension_scores_assessment ON dimension_scores(assessment_id);
    CREATE INDEX IF NOT EXISTS idx_classification_rules_priority ON classification_rules(rule_priority);
  `;

  // Execute schema SQL
  const statements = schemaSQL.split(';').filter(stmt => stmt.trim());
  for (const statement of statements) {
    if (statement.trim()) {
      connection.execute(statement.trim());
    }
  }
}

/**
 * Seed initial data (DII model profiles, classification rules, validation rules)
 */
async function seedInitialData(connection: DatabaseConnection): Promise<void> {
  // Check if data already exists
  const existingModels = connection.query('SELECT COUNT(*) as count FROM dii_model_profiles');
  if (existingModels[0]?.count > 0) {
    console.log('📋 Initial data already exists, skipping seed');
    return;
  }

  console.log('🌱 Seeding initial data...');

  // Insert DII Model Profiles
  const modelProfiles = [
    {
      model_id: 1, model_name: 'COMERCIO_HIBRIDO', dii_base_min: 1.5, dii_base_max: 2.0, dii_base_avg: 1.75,
      risk_multiplier: 1.0, digital_dependency_min: 30, digital_dependency_max: 60,
      typical_trd_hours_min: 24, typical_trd_hours_max: 48,
      cyber_risk_explanation: 'Omnichannel operations create multiple attack vectors across physical and digital channels'
    },
    {
      model_id: 2, model_name: 'SOFTWARE_CRITICO', dii_base_min: 0.8, dii_base_max: 1.2, dii_base_avg: 1.0,
      risk_multiplier: 1.5, digital_dependency_min: 70, digital_dependency_max: 90,
      typical_trd_hours_min: 2, typical_trd_hours_max: 6,
      cyber_risk_explanation: 'SaaS platforms require 24/7 availability with customer data protection'
    },
    {
      model_id: 3, model_name: 'SERVICIOS_DATOS', dii_base_min: 0.5, dii_base_max: 0.9, dii_base_avg: 0.7,
      risk_multiplier: 2.0, digital_dependency_min: 80, digital_dependency_max: 95,
      typical_trd_hours_min: 4, typical_trd_hours_max: 12,
      cyber_risk_explanation: 'Data concentration makes companies high-value targets for sophisticated attacks'
    },
    {
      model_id: 4, model_name: 'ECOSISTEMA_DIGITAL', dii_base_min: 0.4, dii_base_max: 0.8, dii_base_avg: 0.6,
      risk_multiplier: 2.5, digital_dependency_min: 95, digital_dependency_max: 100,
      typical_trd_hours_min: 0.5, typical_trd_hours_max: 2,
      cyber_risk_explanation: 'Multi-sided platforms create complex attack surfaces across entire ecosystems'
    },
    {
      model_id: 5, model_name: 'SERVICIOS_FINANCIEROS', dii_base_min: 0.2, dii_base_max: 0.6, dii_base_avg: 0.4,
      risk_multiplier: 3.5, digital_dependency_min: 95, digital_dependency_max: 100,
      typical_trd_hours_min: 0.5, typical_trd_hours_max: 2,
      cyber_risk_explanation: 'Financial services have zero tolerance for downtime and attract criminal organizations'
    },
    {
      model_id: 6, model_name: 'INFRAESTRUCTURA_HEREDADA', dii_base_min: 0.2, dii_base_max: 0.5, dii_base_avg: 0.35,
      risk_multiplier: 2.8, digital_dependency_min: 20, digital_dependency_max: 50,
      typical_trd_hours_min: 48, typical_trd_hours_max: 168,
      cyber_risk_explanation: 'Legacy systems with known vulnerabilities create hybrid attack surfaces'
    },
    {
      model_id: 7, model_name: 'CADENA_SUMINISTRO', dii_base_min: 0.4, dii_base_max: 0.8, dii_base_avg: 0.6,
      risk_multiplier: 1.8, digital_dependency_min: 40, digital_dependency_max: 70,
      typical_trd_hours_min: 8, typical_trd_hours_max: 24,
      cyber_risk_explanation: 'Supply chain integrations multiply potential entry points and cascade failures'
    },
    {
      model_id: 8, model_name: 'INFORMACION_REGULADA', dii_base_min: 0.4, dii_base_max: 0.7, dii_base_avg: 0.55,
      risk_multiplier: 3.0, digital_dependency_min: 60, digital_dependency_max: 80,
      typical_trd_hours_min: 6, typical_trd_hours_max: 18,
      cyber_risk_explanation: 'Regulated data attracts nation-state actors and has severe compliance penalties'
    }
  ];

  for (const profile of modelProfiles) {
    connection.execute(`
      INSERT INTO dii_model_profiles (
        model_id, model_name, dii_base_min, dii_base_max, dii_base_avg, risk_multiplier,
        digital_dependency_min, digital_dependency_max, typical_trd_hours_min, typical_trd_hours_max,
        cyber_risk_explanation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      profile.model_id, profile.model_name, profile.dii_base_min, profile.dii_base_max, profile.dii_base_avg,
      profile.risk_multiplier, profile.digital_dependency_min, profile.digital_dependency_max,
      profile.typical_trd_hours_min, profile.typical_trd_hours_max, profile.cyber_risk_explanation
    ]);
  }

  // Insert Classification Rules (High Confidence Industry Patterns)
  const classificationRules = [
    ['banking|banco|bank', 'SERVICIOS_FINANCIEROS', 0.95, 'Banking operations require real-time transaction processing with zero downtime tolerance', 10],
    ['software|saas|cloud', 'SOFTWARE_CRITICO', 0.90, 'SaaS platforms require 24/7 availability with customer data protection', 10],
    ['retail|comercio|store|shop', 'COMERCIO_HIBRIDO', 0.90, 'Retail operations span physical stores and digital channels requiring omnichannel security', 10],
    ['health|salud|hospital|clinic', 'INFORMACION_REGULADA', 0.95, 'Healthcare data requires strict compliance with patient privacy regulations', 10],
    ['logistics|shipping|delivery', 'CADENA_SUMINISTRO', 0.90, 'Logistics operations depend on real-time tracking and partner integrations', 10],
    ['manufacturing|oil|energy|mining', 'INFRAESTRUCTURA_HEREDADA', 0.85, 'Traditional infrastructure with digital transformation creates hybrid vulnerabilities', 10],
    ['marketplace|platform|ecosystem', 'ECOSISTEMA_DIGITAL', 0.90, 'Multi-sided platform connecting multiple participants and service providers', 10],
    ['analytics|data|research|intelligence', 'SERVICIOS_DATOS', 0.90, 'Business model depends on data collection, processing, and monetization', 10]
  ];

  for (const [pattern, model, confidence, reasoning, priority] of classificationRules) {
    connection.execute(`
      INSERT INTO classification_rules (industry_pattern, target_dii_model, confidence_level, reasoning_template, rule_priority)
      VALUES (?, ?, ?, ?, ?)
    `, [pattern, model, confidence, reasoning, priority]);
  }

  // Insert Validation Rules
  const validationRules = [
    ['RRG_minimum_validation', 'dimension_validation', 'RRG', 'raw_value < 1.0', 'error', 'RRG cannot be less than 1.0 - recovery cannot be faster than documented'],
    ['HFP_range_validation', 'dimension_validation', 'HFP', 'raw_value < 0.05 OR raw_value > 0.95', 'warning', 'HFP outside normal range (5%-95%) - please verify data source'],
    ['TRD_minimum_validation', 'dimension_validation', 'TRD', 'raw_value < 0.5', 'warning', 'TRD less than 30 minutes is extremely rare - please verify'],
    ['AER_extreme_validation', 'dimension_validation', 'AER', 'raw_value > 50.0', 'warning', 'AER above 50 indicates very expensive attacks - please verify calculation'],
    ['BRI_maximum_validation', 'dimension_validation', 'BRI', 'raw_value > 1.0', 'error', 'BRI cannot exceed 100% (1.0) - blast radius cannot be more than complete']
  ];

  for (const [name, type, applies_to, condition, severity, message] of validationRules) {
    connection.execute(`
      INSERT INTO validation_rules (rule_name, rule_type, applies_to, condition_sql, severity, message_template)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, type, applies_to, condition, severity, message]);
  }

  console.log('✅ Initial data seeded successfully');
}

/**
 * Close database connection
 */
export function closeDatabaseConnection(): void {
  if (connectionInstance) {
    connectionInstance.close();
    connectionInstance = null;
  }
}