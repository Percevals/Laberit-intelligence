/**
 * DII v4.0 Dimension Definitions
 * Refined for holistic business impact measurement
 */

import type { DIIDimensions } from '@core/types/dii.types';
import type { BusinessModelId } from '@core/types/business-model.types';
import { getArchetypeByModel } from '@/core/business-model/archetypes';

export interface DimensionDefinition {
  id: keyof DIIDimensions;
  nameES: string;
  nameEN: string;
  category: 'prevention' | 'resilience';
  description: {
    es: string;
    en: string;
  };
  executiveQuestion: {
    es: string;
    en: string;
  };
  measurement: {
    unit: string;
    typicalRange: string;
    formula?: string;
  };
  v4Changes: string[];
}

export const DII_V4_DIMENSIONS: Record<keyof DIIDimensions, DimensionDefinition> = {
  AER: {
    id: 'AER',
    nameES: 'Ratio de Economía del Ataque',
    nameEN: 'Attack Economics Ratio',
    category: 'prevention',
    description: {
      es: 'Por cada dólar que gasta un atacante, ¿cuántos dólares puede destruir en tu empresa?',
      en: 'For every dollar an attacker spends, how many dollars can they destroy in your business?'
    },
    executiveQuestion: {
      es: '¿Cuánto valor total está en riesgo si sufren un ataque exitoso?',
      en: 'What is the total value at risk if you suffer a successful attack?'
    },
    measurement: {
      unit: 'ratio',
      typicalRange: '1:20 to 1:200',
      formula: 'Attack_Cost / Total_Value_at_Risk'
    },
    v4Changes: [
      'Incluye multas regulatorias potenciales',
      'Incluye pérdida de clientes por reputación',
      'Incluye costos totales de recuperación',
      'Incluye daño competitivo a largo plazo'
    ]
  },
  
  HFP: {
    id: 'HFP',
    nameES: 'Ratio de Error Humano',
    nameEN: 'Human Failure Probability',
    category: 'prevention',
    description: {
      es: '¿Cuál es la probabilidad de que este mes al menos un empleado comprometa la seguridad?',
      en: 'What is the probability that at least one employee will compromise security this month?'
    },
    executiveQuestion: {
      es: '¿Qué tan preparado está su equipo para resistir ataques de ingeniería social?',
      en: 'How prepared is your team to resist social engineering attacks?'
    },
    measurement: {
      unit: 'probability',
      typicalRange: '15% - 95%',
      formula: '1 - (1 - individual_failure_rate)^(active_employees × days)'
    },
    v4Changes: []
  },
  
  BRI: {
    id: 'BRI',
    nameES: 'Radio de Exposición',
    nameEN: 'Blast Radius Index',
    category: 'prevention',
    description: {
      es: 'Si comprometen una computadora, ¿a qué porcentaje del valor del negocio pueden llegar?',
      en: 'If one computer is compromised, what percentage of business value can be reached?'
    },
    executiveQuestion: {
      es: '¿Qué porcentaje del valor total del negocio está expuesto desde un punto típico de entrada?',
      en: 'What percentage of total business value is exposed from a typical entry point?'
    },
    measurement: {
      unit: 'percentage',
      typicalRange: '20% - 95%'
    },
    v4Changes: [
      'Cambio de "sistemas alcanzables" a "valor de negocio expuesto"',
      'Incluye datos de clientes accesibles',
      'Incluye operaciones críticas interrumpibles',
      'Incluye propiedad intelectual expuesta'
    ]
  },
  
  TRD: {
    id: 'TRD',
    nameES: 'Tiempo hasta Afectación de Ingresos',
    nameEN: 'Time to Revenue Disruption',
    category: 'resilience',
    description: {
      es: '¿Cuántas horas pueden fallar sus sistemas antes de que empiece a perder valor significativo?',
      en: 'How many hours can your systems fail before you start losing significant value?'
    },
    executiveQuestion: {
      es: '¿Cuál es el camino más rápido hacia un impacto material en su negocio?',
      en: 'What is the fastest path to material impact on your business?'
    },
    measurement: {
      unit: 'hours',
      typicalRange: '0.5 - 168',
      formula: 'MIN(operational_loss, compliance_trigger, trust_loss, strategic_exposure)'
    },
    v4Changes: [
      'De solo ingresos a "impacto material más rápido"',
      'Incluye activación de multas regulatorias',
      'Incluye detección pública y pérdida de confianza',
      'Incluye exposición de ventaja competitiva'
    ]
  },
  
  RRG: {
    id: 'RRG',
    nameES: 'Agilidad para Recuperación',
    nameEN: 'Recovery Reality Gap',
    category: 'resilience',
    description: {
      es: 'Cuando dicen recuperar en 4 horas, ¿realmente cuánto tardan?',
      en: 'When you say recovery takes 4 hours, how long does it really take?'
    },
    executiveQuestion: {
      es: '¿Cuál es la diferencia entre su plan de recuperación y la realidad histórica?',
      en: 'What is the gap between your recovery plan and historical reality?'
    },
    measurement: {
      unit: 'multiplier',
      typicalRange: '1x - 10x',
      formula: 'Real_Recovery_Time / Documented_RTO'
    },
    v4Changes: []
  }
};

/**
 * Get dimension questions adapted by business archetype
 */
export function getDimensionQuestions(
  dimension: keyof DIIDimensions,
  businessModelId: BusinessModelId,
  language: 'es' | 'en' = 'es'
): string[] {
  const archetype = getArchetypeByModel(businessModelId);
  const baseQuestions = getBaseQuestions(dimension, language);
  
  if (!archetype) return baseQuestions;
  
  // Add archetype-specific questions
  switch (archetype.id) {
    case 'CUSTODIOS':
      return [...baseQuestions, ...getCustodiosQuestions(dimension, language)];
      
    case 'CONECTORES':
      return [...baseQuestions, ...getConectoresQuestions(dimension, language)];
      
    case 'PROCESADORES':
      return [...baseQuestions, ...getProcesadoresQuestions(dimension, language)];
      
    case 'REDUNDANTES':
      return baseQuestions; // Keep operational focus
      
    default:
      return baseQuestions;
  }
}

function getBaseQuestions(dimension: keyof DIIDimensions, language: 'es' | 'en'): string[] {
  const questions = {
    AER: {
      es: [
        '¿Cuál es el valor total de datos que manejan?',
        '¿Cuánto costaría un rescate típico de ransomware?',
        '¿Qué multas enfrentarían por un breach masivo?'
      ],
      en: [
        'What is the total value of data you handle?',
        'How much would a typical ransomware demand cost?',
        'What fines would you face for a massive breach?'
      ]
    },
    HFP: {
      es: [
        '¿Con qué frecuencia entrenan a su personal en seguridad?',
        '¿Qué porcentaje de empleados ha fallado en simulacros de phishing?',
        '¿Cuántos incidentes de seguridad fueron causados por error humano?'
      ],
      en: [
        'How often do you train your staff on security?',
        'What percentage of employees have failed phishing simulations?',
        'How many security incidents were caused by human error?'
      ]
    },
    BRI: {
      es: [
        '¿Qué porcentaje de sus sistemas críticos están segmentados?',
        '¿Desde un PC de usuario, a cuántos datos sensibles se puede acceder?',
        '¿Qué controles limitan el movimiento lateral en su red?'
      ],
      en: [
        'What percentage of your critical systems are segmented?',
        'From a user PC, how much sensitive data can be accessed?',
        'What controls limit lateral movement in your network?'
      ]
    },
    TRD: {
      es: [
        '¿Cuánto tiempo pueden operar sin sistemas digitales?',
        '¿En cuántas horas se activan penalizaciones por SLA?',
        '¿Cuándo comenzarían a perder clientes por un incidente público?'
      ],
      en: [
        'How long can you operate without digital systems?',
        'In how many hours do SLA penalties activate?',
        'When would you start losing customers due to a public incident?'
      ]
    },
    RRG: {
      es: [
        '¿Cuándo fue su última prueba completa de recuperación?',
        '¿Cuánto tardaron realmente en recuperarse del último incidente?',
        '¿Qué porcentaje de su recuperación está automatizada?'
      ],
      en: [
        'When was your last complete recovery test?',
        'How long did it really take to recover from the last incident?',
        'What percentage of your recovery is automated?'
      ]
    }
  };
  
  return questions[dimension][language] || [];
}

function getCustodiosQuestions(dimension: keyof DIIDimensions, language: 'es' | 'en'): string[] {
  const questions = {
    AER: {
      es: ['¿Cuál sería el impacto de perder su licencia operativa?'],
      en: ['What would be the impact of losing your operating license?']
    },
    BRI: {
      es: ['¿Qué porcentaje de datos regulados están en sistemas legacy?'],
      en: ['What percentage of regulated data is in legacy systems?']
    },
    TRD: {
      es: ['¿En cuántas horas deben notificar un breach a reguladores?'],
      en: ['In how many hours must you notify regulators of a breach?']
    }
  };
  
  return questions[dimension]?.[language] || [];
}

function getConectoresQuestions(dimension: keyof DIIDimensions, language: 'es' | 'en'): string[] {
  const questions = {
    AER: {
      es: ['¿Cuántos usuarios perderían si hay un fraude viral?'],
      en: ['How many users would you lose if there\'s viral fraud?']
    },
    BRI: {
      es: ['¿Qué porcentaje de transacciones involucran terceros?'],
      en: ['What percentage of transactions involve third parties?']
    },
    TRD: {
      es: ['¿Cuánto tarda un incidente en volverse viral en redes?'],
      en: ['How long does an incident take to go viral on social media?']
    }
  };
  
  return questions[dimension]?.[language] || [];
}

function getProcesadoresQuestions(dimension: keyof DIIDimensions, language: 'es' | 'en'): string[] {
  const questions = {
    AER: {
      es: ['¿Cuál es el valor de su propiedad intelectual core?'],
      en: ['What is the value of your core intellectual property?']
    },
    BRI: {
      es: ['¿Qué porcentaje de su código/algoritmos es accesible?'],
      en: ['What percentage of your code/algorithms is accessible?']
    },
    TRD: {
      es: ['¿Cuánto tardaría un competidor en replicar su proceso?'],
      en: ['How long would it take a competitor to replicate your process?']
    }
  };
  
  return questions[dimension]?.[language] || [];
}