/**
 * Predefined dimension labels for different contexts and languages
 * Follows the modular principle - core component uses standard keys,
 * applications choose appropriate labels
 */

export const DIMENSION_LABELS = {
  // Spanish labels
  es: {
    // Formal/complete names for assessment context
    formal: {
      trd: 'Tiempo de Resistencia al Daño',
      aer: 'Ratio de Economía del Ataque',
      bri: 'Impacto del Riesgo de Negocio',
      hfp: 'Probabilidad de Fallo Humano',
      rrg: 'Brecha de Recursos de Recuperación'
    },
    // Simple/short names for dashboards
    simple: {
      trd: 'Resistencia',
      aer: 'Ciber-ROI',
      bri: 'Exposición',
      hfp: 'Cultura',
      rrg: 'Respuesta'
    },
    // Technical names for IT teams
    technical: {
      trd: 'MTTR Operacional',
      aer: 'ROI Defensivo',
      bri: 'Exposición BIA',
      hfp: 'Factor Humano',
      rrg: 'Gap Recovery'
    }
  },
  
  // English labels
  en: {
    // Standard DII names
    standard: {
      trd: 'Time to Revenue Disruption',
      aer: 'Attack Economics Ratio',
      bri: 'Business Risk Impact',
      hfp: 'Human Failure Probability',
      rrg: 'Recovery Resource Gap'
    },
    // Abbreviated for compact displays
    abbreviated: {
      trd: 'TRD',
      aer: 'AER',
      bri: 'BRI',
      hfp: 'HFP',
      rrg: 'RRG'
    },
    // Executive-friendly names
    executive: {
      trd: 'Operational Resilience',
      aer: 'Defense Economics',
      bri: 'Risk Exposure',
      hfp: 'Human Factor',
      rrg: 'Recovery Capability'
    }
  },
  
  // Portuguese labels (for future expansion)
  pt: {
    simple: {
      trd: 'Resistência',
      aer: 'ROI Cibernético',
      bri: 'Exposição',
      hfp: 'Cultura',
      rrg: 'Resposta'
    }
  }
};

// Descriptions for tooltips/help text
export const DIMENSION_DESCRIPTIONS = {
  es: {
    trd: 'Horas que aguanta tu negocio antes de perder dinero',
    aer: 'Qué tan caro haces los ataques para los criminales',
    bri: 'Exposición financiera por incidentes de seguridad',
    hfp: 'Probabilidad de que el factor humano sea el punto débil',
    rrg: 'Capacidad de recuperación ante incidentes'
  },
  en: {
    trd: 'Hours your business can withstand before revenue loss',
    aer: 'How expensive you make attacks for criminals',
    bri: 'Financial exposure from security incidents',
    hfp: 'Probability of human factor being the weak point',
    rrg: 'Recovery capability during incidents'
  }
};

// Helper function to get dimension config
export function getDimensionConfig(locale: 'es' | 'en' | 'pt' = 'es', style: string = 'simple') {
  const labels = DIMENSION_LABELS[locale]?.[style as keyof typeof DIMENSION_LABELS.es] || DIMENSION_LABELS.es.simple;
  const descriptions = DIMENSION_DESCRIPTIONS[locale] || DIMENSION_DESCRIPTIONS.es;
  
  return [
    { key: 'trd' as const, label: labels.trd, description: descriptions.trd },
    { key: 'aer' as const, label: labels.aer, description: descriptions.aer },
    { key: 'bri' as const, label: labels.bri, description: descriptions.bri },
    { key: 'hfp' as const, label: labels.hfp, description: descriptions.hfp },
    { key: 'rrg' as const, label: labels.rrg, description: descriptions.rrg }
  ];
}