/**
 * Data transformation utilities for DII v4.0 historical data import
 */

// Sector to Industry mapping
const SECTOR_TO_INDUSTRY_MAP = {
  'Financiero': 'Financial Services',
  'Industrial': 'Manufacturing',
  'Público': 'Government',
  'Tecnología': 'Technology',
  'Salud': 'Healthcare',
  'Retail': 'Retail',
  'Telecomunicaciones': 'Telecommunications',
  'Energía': 'Energy',
  'Logística': 'Logistics',
  'Educación': 'Education'
};

// Business model mapping (already in v4.0 format)
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

// DII Stage mapping
const DII_STAGE_MAP = {
  'Frágil': 'Frágil',
  'Robusto': 'Robusto',
  'Resiliente': 'Resiliente',
  'Adaptativo': 'Adaptativo'
};

/**
 * Transform sector name to industry
 */
function mapSectorToIndustry(sector) {
  return SECTOR_TO_INDUSTRY_MAP[sector] || sector;
}

/**
 * Transform business model to enum value
 */
function mapBusinessModelToEnum(businessModel) {
  return BUSINESS_MODEL_MAP[businessModel] || 'COMERCIO_HIBRIDO';
}

/**
 * Calculate confidence score based on migration metadata
 */
function calculateConfidenceScore(metadata) {
  if (!metadata) return 0.5;
  
  const baseConfidence = metadata.confidence_level === 'HIGH' ? 0.9 : 0.7;
  const completenessBonus = (metadata.data_completeness || 0.8) * 0.1;
  
  return Math.min(0.95, baseConfidence + completenessBonus);
}

/**
 * Transform historical company data to database format
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
    industry_traditional: mapSectorToIndustry(sector),
    dii_business_model: mapBusinessModelToEnum(business_model_v4),
    confidence_score: calculateConfidenceScore(migration_metadata),
    
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
 * Transform dimensions for history record
 */
function transformDimensions(dimensions) {
  if (!dimensions) return {};
  
  return {
    AER: parseFloat(dimensions.AER) || 0,
    HFP: parseFloat(dimensions.HFP) || 0,
    BRI: parseFloat(dimensions.BRI) || 0,
    TRD: parseFloat(dimensions.TRD) || 0,
    RRG: parseFloat(dimensions.RRG) || 0
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
    dii_stage: DII_STAGE_MAP[dii_stage] || 'Frágil',
    dimensions: transformDimensions(dimensions),
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
 * Validate transformed data
 */
function validateTransformedData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Company name is required');
  }
  
  if (!data.dii_business_model) {
    errors.push('Business model is required');
  }
  
  if (data.confidence_score < 0 || data.confidence_score > 1) {
    errors.push('Confidence score must be between 0 and 1');
  }
  
  if (data.original_dii_score && (data.original_dii_score < 0 || data.original_dii_score > 10)) {
    errors.push('DII score must be between 0 and 10');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  mapSectorToIndustry,
  mapBusinessModelToEnum,
  calculateConfidenceScore,
  transformHistoricalCompany,
  transformDimensions,
  createHistoryRecord,
  validateTransformedData,
  SECTOR_TO_INDUSTRY_MAP,
  BUSINESS_MODEL_MAP,
  DII_STAGE_MAP
};