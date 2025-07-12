/**
 * Benchmark constants for DII calculations
 * @module @dii/core/constants/benchmarks
 */

import { BUSINESS_MODELS } from './index.js';

// Maturity stages thresholds
export const MATURITY_STAGES = {
  FRAGIL: { max: 4.0, name: 'Frágil', description: 'Función severamente comprometida bajo ataque' },
  ROBUSTO: { min: 4.0, max: 6.0, name: 'Robusto', description: 'Función parcialmente mantenida' },
  RESILIENTE: { min: 6.0, max: 8.0, name: 'Resiliente', description: 'Función competitiva mantenida' },
  ADAPTATIVO: { min: 8.0, name: 'Adaptativo', description: 'Función superior mantenida' }
};

// Percentile data based on LATAM benchmarks
export const PERCENTILE_BENCHMARKS = {
  [BUSINESS_MODELS.COMERCIO_HIBRIDO]: [2.5, 3.8, 4.5, 5.5, 6.8, 7.5, 8.2],
  [BUSINESS_MODELS.SOFTWARE_CRITICO]: [2.0, 3.5, 4.0, 4.8, 6.0, 7.0, 8.0],
  [BUSINESS_MODELS.SERVICIOS_DATOS]: [1.8, 3.0, 3.5, 4.2, 5.5, 6.5, 7.8],
  [BUSINESS_MODELS.ECOSISTEMA_DIGITAL]: [1.5, 2.8, 3.2, 3.8, 5.0, 6.2, 7.5],
  [BUSINESS_MODELS.SERVICIOS_FINANCIEROS]: [1.2, 2.5, 3.0, 3.5, 4.8, 6.0, 7.2],
  [BUSINESS_MODELS.INFRAESTRUCTURA_HEREDADA]: [1.0, 2.0, 2.5, 2.8, 4.0, 5.2, 6.5],
  [BUSINESS_MODELS.CADENA_SUMINISTRO]: [1.8, 3.0, 3.5, 4.0, 5.2, 6.5, 7.8],
  [BUSINESS_MODELS.INFORMACION_REGULADA]: [1.5, 2.8, 3.2, 3.7, 5.0, 6.3, 7.5]
};