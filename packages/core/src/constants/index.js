/**
 * Core constants for DII calculations
 * @module @dii/core/constants
 */

// Business Model Constants
export const BUSINESS_MODELS = {
  COMERCIO_HIBRIDO: 1,
  SOFTWARE_CRITICO: 2,
  SERVICIOS_DATOS: 3,
  ECOSISTEMA_DIGITAL: 4,
  SERVICIOS_FINANCIEROS: 5,
  INFRAESTRUCTURA_HEREDADA: 6,
  CADENA_SUMINISTRO: 7,
  INFORMACION_REGULADA: 8
};

// DII Base values per business model (using midpoint of ranges)
export const DII_BASE_VALUES = {
  [BUSINESS_MODELS.COMERCIO_HIBRIDO]: 1.75,          // Range: 1.5-2.0
  [BUSINESS_MODELS.SOFTWARE_CRITICO]: 1.00,          // Range: 0.8-1.2
  [BUSINESS_MODELS.SERVICIOS_DATOS]: 0.70,           // Range: 0.5-0.9
  [BUSINESS_MODELS.ECOSISTEMA_DIGITAL]: 0.60,        // Range: 0.4-0.8
  [BUSINESS_MODELS.SERVICIOS_FINANCIEROS]: 0.40,     // Range: 0.2-0.6
  [BUSINESS_MODELS.INFRAESTRUCTURA_HEREDADA]: 0.35,  // Range: 0.2-0.5
  [BUSINESS_MODELS.CADENA_SUMINISTRO]: 0.60,         // Range: 0.4-0.8
  [BUSINESS_MODELS.INFORMACION_REGULADA]: 0.55       // Range: 0.4-0.7
};

// DII Base ranges for validation
export const DII_BASE_RANGES = {
  [BUSINESS_MODELS.COMERCIO_HIBRIDO]: { min: 1.5, max: 2.0 },
  [BUSINESS_MODELS.SOFTWARE_CRITICO]: { min: 0.8, max: 1.2 },
  [BUSINESS_MODELS.SERVICIOS_DATOS]: { min: 0.5, max: 0.9 },
  [BUSINESS_MODELS.ECOSISTEMA_DIGITAL]: { min: 0.4, max: 0.8 },
  [BUSINESS_MODELS.SERVICIOS_FINANCIEROS]: { min: 0.2, max: 0.6 },
  [BUSINESS_MODELS.INFRAESTRUCTURA_HEREDADA]: { min: 0.2, max: 0.5 },
  [BUSINESS_MODELS.CADENA_SUMINISTRO]: { min: 0.4, max: 0.8 },
  [BUSINESS_MODELS.INFORMACION_REGULADA]: { min: 0.4, max: 0.7 }
};

// Dimension names and descriptions
export const DIMENSIONS = {
  TRD: {
    name: 'Time to Revenue Degradation',
    shortName: 'TRD',
    description: 'Tiempo hasta degradación de ingresos'
  },
  AER: {
    name: 'Attack Economics Ratio',
    shortName: 'AER',
    description: 'Ratio económico del ataque'
  },
  HFP: {
    name: 'Human Failure Probability',
    shortName: 'HFP',
    description: 'Probabilidad de fallo humano'
  },
  BRI: {
    name: 'Blast Radius Index',
    shortName: 'BRI',
    description: 'Índice de radio de explosión'
  },
  RRG: {
    name: 'Recovery Reality Gap',
    shortName: 'RRG',
    description: 'Brecha realidad de recuperación'
  }
};