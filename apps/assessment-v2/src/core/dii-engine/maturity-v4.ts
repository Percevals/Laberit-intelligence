/**
 * DII v4.0 Maturity Definitions
 * Business value protection focused maturity stages
 */

import type { BusinessModelId } from '@core/types/business-model.types';

export type MaturityStage = 'FRAGIL' | 'ROBUSTO' | 'RESILIENTE' | 'ADAPTATIVO';

export interface MaturityDefinition {
  stage: MaturityStage;
  diiRange: { min: number; max: number };
  valueLoss: string;
  businessCapability: string;
  description: string;
  symptoms: string[];
  indicators: {
    detectionTime: string;
    exposureRadius: string;
    recoveryAgility: string;
    automationLevel: string;
  };
  percentage: number; // % of LATAM organizations
}

export interface ImpactDistribution {
  operational: number;    // % operational impact
  trust: number;         // % trust/reputation impact  
  compliance: number;    // % compliance/regulatory impact
  strategic: number;     // % strategic/competitive impact
}

export const MATURITY_STAGES: Record<MaturityStage, MaturityDefinition> = {
  FRAGIL: {
    stage: 'FRAGIL',
    diiRange: { min: 0, max: 4.0 },
    valueLoss: 'Pierden >70% del valor durante incidentes',
    businessCapability: 'No saben que están comprometidos',
    description: 'La organización opera en la oscuridad. Los atacantes entran y salen sin ser detectados, a menudo durante meses. Cuando finalmente explota la crisis, la pérdida de valor es catastrófica en múltiples dimensiones: operacional, confianza, compliance y estratégico.',
    symptoms: [
      'Sin inventario de activos críticos',
      'Red plana sin segmentación',
      'Sin visibilidad de logs o eventos',
      'Respuesta manual y ad-hoc',
      'Backups sin probar >12 meses'
    ],
    indicators: {
      detectionTime: '>30 días (a menudo >200 días)',
      exposureRadius: '80-100% del valor del negocio',
      recoveryAgility: '5-10x más lenta que lo prometido',
      automationLevel: '<10%'
    },
    percentage: 59
  },

  ROBUSTO: {
    stage: 'ROBUSTO',
    diiRange: { min: 4.0, max: 6.0 },
    valueLoss: 'Pierden 40-70% del valor',
    businessCapability: 'Se enteran cuando es tarde',
    description: 'La organización tiene controles básicos pero reacciona tarde. Los breaches se detectan cuando el daño ya está hecho. Hay un plan de respuesta, pero ejecutarlo es caótico y costoso. La confianza se daña pero es recuperable.',
    symptoms: [
      'Inventario parcial de activos',
      'Segmentación básica tradicional',
      'SIEM básico con falsos positivos altos',
      'Playbooks documentados, ejecución semi-manual',
      'Backups probados anualmente'
    ],
    indicators: {
      detectionTime: '24-72 horas',
      exposureRadius: '50-80% del valor del negocio',
      recoveryAgility: '2-3x más lenta',
      automationLevel: '10-30%'
    },
    percentage: 30
  },

  RESILIENTE: {
    stage: 'RESILIENTE',
    diiRange: { min: 6.0, max: 8.0 },
    valueLoss: 'Pierden 15-40% del valor',
    businessCapability: 'Detectan rápido, limitan daño',
    description: 'La organización asume que será atacada y está preparada. Los intentos de breach se detectan en horas. La arquitectura limita el daño. La respuesta es rápida y coordinada. Los datos críticos están protegidos con múltiples capas.',
    symptoms: [
      'Gestión continua de superficie de ataque',
      'Micro-segmentación y Zero Trust parcial',
      'SIEM + SOAR con correlación avanzada',
      'Orquestación automatizada de respuesta',
      'Backups inmutables con pruebas mensuales'
    ],
    indicators: {
      detectionTime: '1-24 horas',
      exposureRadius: '20-50% del valor del negocio',
      recoveryAgility: '1-1.5x del plan',
      automationLevel: '30-70%'
    },
    percentage: 10
  },

  ADAPTATIVO: {
    stage: 'ADAPTATIVO',
    diiRange: { min: 8.0, max: 10.0 },
    valueLoss: 'Pierden <15%, ganan ventaja competitiva',
    businessCapability: 'Los ataques los fortalecen',
    description: 'La organización no solo resiste ataques - los convierte en ventaja competitiva. Los honeypots atrapan atacantes antes de que lleguen a sistemas reales. Cada intento genera inteligencia que mejora las defensas. Durante crisis del sector, ganan participación de mercado.',
    symptoms: [
      'Gestión predictiva con deception technology',
      'Zero Trust completo con arquitectura resiliente',
      'AI/ML-driven con detección comportamental',
      'Auto-remediación y chaos engineering',
      'Multi-site activo-activo con recuperación instantánea'
    ],
    indicators: {
      detectionTime: '<1 hora (a menudo <10 minutos)',
      exposureRadius: '<20% del valor del negocio',
      recoveryAgility: '0.8-1x (mejor que planeado)',
      automationLevel: '>70%'
    },
    percentage: 1
  }
};

/**
 * Get maturity stage based on DII score
 */
export function getMaturityStage(diiScore: number): MaturityStage {
  if (diiScore >= 8.0) return 'ADAPTATIVO';
  if (diiScore >= 6.0) return 'RESILIENTE';
  if (diiScore >= 4.0) return 'ROBUSTO';
  return 'FRAGIL';
}

/**
 * Get impact distribution by business model archetype
 */
export function getImpactDistribution(businessModelId: BusinessModelId): ImpactDistribution {
  // Based on business model archetype patterns from Module 1
  const distributions: Record<BusinessModelId, ImpactDistribution> = {
    // CUSTODIOS (Financieros, Info Regulada) - High compliance impact
    5: { operational: 25, trust: 30, compliance: 35, strategic: 10 },
    8: { operational: 20, trust: 25, compliance: 40, strategic: 15 },
    
    // CONECTORES (Ecosistemas, Cadena) - High trust impact
    4: { operational: 20, trust: 45, compliance: 15, strategic: 20 },
    7: { operational: 30, trust: 40, compliance: 20, strategic: 10 },
    
    // PROCESADORES (Software, Datos) - High strategic impact
    2: { operational: 25, trust: 20, compliance: 15, strategic: 40 },
    3: { operational: 20, trust: 25, compliance: 20, strategic: 35 },
    
    // REDUNDANTES (Híbrido, Infraestructura) - High operational impact
    1: { operational: 40, trust: 25, compliance: 20, strategic: 15 },
    6: { operational: 45, trust: 20, compliance: 25, strategic: 10 }
  };

  return distributions[businessModelId] || { operational: 30, trust: 25, compliance: 25, strategic: 20 };
}

/**
 * Get percentile context by business model
 */
export function getPercentileContext(
  diiScore: number, 
  businessModelId: BusinessModelId
): {
  percentile: number;
  modelAverage: number;
  interpretation: string;
  competitive: string;
} {
  // Benchmark data from Module 4
  const benchmarks: Record<BusinessModelId, { avg: number; p25: number; p50: number; p75: number; p90: number }> = {
    1: { avg: 5.2, p25: 4.1, p50: 5.5, p75: 6.8, p90: 7.5 },
    2: { avg: 4.8, p25: 3.5, p50: 4.8, p75: 6.0, p90: 7.0 },
    3: { avg: 4.2, p25: 3.0, p50: 4.2, p75: 5.5, p90: 6.5 },
    4: { avg: 3.8, p25: 2.8, p50: 3.8, p75: 5.0, p90: 6.2 },
    5: { avg: 3.5, p25: 2.5, p50: 3.5, p75: 4.8, p90: 6.0 },
    6: { avg: 2.8, p25: 2.0, p50: 2.8, p75: 4.0, p90: 5.2 },
    7: { avg: 4.0, p25: 3.0, p50: 4.0, p75: 5.2, p90: 6.5 },
    8: { avg: 3.7, p25: 2.7, p50: 3.7, p75: 5.0, p90: 6.3 }
  };

  const benchmark = benchmarks[businessModelId];
  
  // Calculate percentile
  let percentile = 50; // default
  if (diiScore >= benchmark.p90) percentile = 90;
  else if (diiScore >= benchmark.p75) percentile = 75;
  else if (diiScore >= benchmark.p50) percentile = 50;
  else if (diiScore >= benchmark.p25) percentile = 25;
  else percentile = 10;

  // Interpretation
  let interpretation = '';
  let competitive = '';
  
  if (percentile >= 90) {
    interpretation = 'Líder del modelo';
    competitive = 'Objetivo solo de ataques dirigidos';
  } else if (percentile >= 75) {
    interpretation = 'Top quartile';
    competitive = 'Resiliente a ataques oportunistas';
  } else if (percentile >= 50) {
    interpretation = 'Sobre promedio';
    competitive = 'Vulnerable en ataques masivos';
  } else if (percentile >= 25) {
    interpretation = 'Bajo promedio';
    competitive = 'Target prioritario para atacantes';
  } else {
    interpretation = 'Bottom quartile';
    competitive = 'Target prioritario para atacantes';
  }

  return {
    percentile,
    modelAverage: benchmark.avg,
    interpretation,
    competitive
  };
}

/**
 * Generate business value-focused recommendations
 */
export function getBusinessValueRecommendations(
  maturityStage: MaturityStage,
  businessModelId: BusinessModelId,
  weakestDimensions: string[]
): string[] {
  const recommendations: Record<MaturityStage, Record<string, string[]>> = {
    FRAGIL: {
      operational: [
        'Implementar monitoreo 24/7 de sistemas críticos para reducir tiempo de detección',
        'Crear redundancia operacional inmediata para servicios que generan ingresos',
        'Establecer procedimientos de failover automático para evitar pérdidas de ventas'
      ],
      trust: [
        'Desarrollar plan de comunicación de crisis para mantener confianza de clientes',
        'Implementar transparencia proactiva sobre medidas de seguridad tomadas',
        'Crear programa de notificación temprana a clientes en caso de incidentes'
      ],
      compliance: [
        'Mapear todos los requisitos regulatorios y sus plazos de notificación',
        'Implementar controles mínimos para evitar multas regulatorias inmediatas',
        'Crear equipo legal-técnico para respuesta rápida a violaciones'
      ],
      strategic: [
        'Proteger propiedad intelectual crítica con segmentación inmediata',
        'Identificar y aislar datos que proporcionan ventaja competitiva',
        'Implementar controles de acceso estrictos para información estratégica'
      ]
    },
    ROBUSTO: {
      operational: [
        'Automatizar respuesta a incidentes para reducir tiempo de recuperación',
        'Implementar monitoreo predictivo para prevenir interrupciones de servicio',
        'Crear dashboard ejecutivo de continuidad de negocio en tiempo real'
      ],
      trust: [
        'Desarrollar métricas de confianza de clientes post-incidente',
        'Implementar comunicación proactiva durante degradaciones de servicio',
        'Crear programa de compensación automática por interrupciones'
      ],
      compliance: [
        'Automatizar reportes regulatorios para cumplir plazos consistentemente',
        'Implementar controles continuos para evitar violaciones menores',
        'Crear dashboard de compliance para visibilidad ejecutiva'
      ],
      strategic: [
        'Implementar threat intelligence para proteger ventajas competitivas',
        'Crear honeypots para desviar ataques de activos estratégicos',
        'Desarrollar capacidad de atribución para entender motivaciones de atacantes'
      ]
    },
    RESILIENTE: {
      operational: [
        'Implementar chaos engineering para fortalecer resiliencia operacional',
        'Crear capacidad de operación degradada que mantenga servicios críticos',
        'Desarrollar métricas de valor protegido durante incidentes'
      ],
      trust: [
        'Convertir incidentes manejados exitosamente en casos de estudio públicos',
        'Desarrollar programa de educación a clientes sobre ciberseguridad',
        'Crear diferenciador competitivo basado en resiliencia demostrada'
      ],
      compliance: [
        'Convertirse en referente de mejores prácticas regulatorias',
        'Participar en desarrollo de nuevos estándares de la industria',
        'Ofrecer servicios de consulting en compliance a competidores'
      ],
      strategic: [
        'Desarrollar inteligencia de amenazas como ventaja competitiva',
        'Crear alianzas estratégicas basadas en capacidades de seguridad',
        'Monetizar capacidades de seguridad como servicio a terceros'
      ]
    },
    ADAPTATIVO: {
      operational: [
        'Crear modelo de negocio que se fortalezca durante crisis del sector',
        'Desarrollar capacidad de absorber operaciones de competidores afectados',
        'Implementar operaciones que mejoren durante situaciones de stress'
      ],
      trust: [
        'Posicionarse como refugio seguro durante crisis sectoriales',
        'Desarrollar marca basada en invulnerabilidad demostrada',
        'Crear community de clientes que promuevan su resiliencia'
      ],
      compliance: [
        'Liderar desarrollo de nuevos marcos regulatorios',
        'Ofrecer sandbox regulatorio para innovaciones de seguridad',
        'Convertirse en consultor preferido de reguladores'
      ],
      strategic: [
        'Convertir capacidades de ciberseguridad en línea de negocio',
        'Adquirir competidores vulnerables durante crisis',
        'Desarrollar ecosistema de partners basado en seguridad superior'
      ]
    }
  };

  // Get archetype to focus recommendations
  const distributions = getImpactDistribution(businessModelId);
  const topImpactArea = Object.entries(distributions)
    .sort(([,a], [,b]) => b - a)[0][0] as keyof typeof distributions;

  const baseRecommendations = recommendations[maturityStage][topImpactArea] || [];
  
  // Add dimension-specific recommendations if available
  const dimensionRecs = weakestDimensions.slice(0, 2).map(dim => {
    const dimRecs: Record<string, string> = {
      TRD: 'Reducir tiempo hasta impacto material mediante redundancia de ingresos',
      AER: 'Disminuir valor total expuesto mediante segmentación inteligente', 
      HFP: 'Fortalecer cultura de seguridad para proteger confianza de clientes',
      BRI: 'Limitar radio de exposición para contener pérdidas potenciales',
      RRG: 'Acelerar recuperación para minimizar pérdida de participación de mercado'
    };
    return dimRecs[dim];
  }).filter(Boolean);

  return [...baseRecommendations.slice(0, 2), ...dimensionRecs, baseRecommendations[2]].filter(Boolean);
}