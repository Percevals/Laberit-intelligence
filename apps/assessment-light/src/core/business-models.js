/**
 * Business Models Module for Digital Immunity Index 4.0
 * 
 * Defines the 8 business models with their characteristics, 
 * resilience factors, and regional examples.
 * 
 * @module business-models
 * @version 4.0.0
 * @author Lãberit Intelligence
 */

/**
 * Business model definitions with complete characteristics
 * @constant {Object}
 */
export const businessModels = {
  1: {
    id: 1,
    key: 'COMERCIO_HIBRIDO',
    name: 'Comercio Híbrido',
    nameEn: 'Hybrid Commerce',
    description: 'Operaciones físicas + canal digital complementario. Mantienen redundancia natural entre canales físicos y digitales.',
    diiBase: {
      min: 1.5,
      max: 2.0,
      average: 1.75,
      range: '1.5-2.0'
    },
    characteristics: {
      digitalDependency: '30-60%',
      naturalRedundancy: 'Alta',
      manualFallback: 'Disponible',
      customerChannels: ['Tienda física', 'E-commerce', 'Teléfono', 'App móvil'],
      criticalFactor: 'Redundancia natural entre canales'
    },
    resilienceWindow: {
      minHours: 24,
      maxHours: 48,
      typical: 36,
      description: 'Puede operar 24-48h sin sistemas digitales'
    },
    riskMultiplier: 1.0,
    examples: {
      latam: [
        { company: 'Falabella', country: 'Chile', sector: 'Retail' },
        { company: 'Liverpool', country: 'México', sector: 'Retail' },
        { company: 'Cencosud', country: 'Chile', sector: 'Retail' },
        { company: 'Magazine Luiza', country: 'Brasil', sector: 'Retail' },
        { company: 'Éxito', country: 'Colombia', sector: 'Retail' }
      ],
      spain: [
        { company: 'El Corte Inglés', country: 'España', sector: 'Retail' },
        { company: 'Mercadona', country: 'España', sector: 'Supermercados' },
        { company: 'Inditex', country: 'España', sector: 'Moda' },
        { company: 'Carrefour España', country: 'España', sector: 'Retail' }
      ]
    },
    sectorAdjustments: {
      retail: 1.0,
      supermarkets: 0.95,
      fashion: 1.05,
      electronics: 1.1
    }
  },

  2: {
    id: 2,
    key: 'SOFTWARE_CRITICO',
    name: 'Software Crítico',
    nameEn: 'Critical Software',
    description: 'Soluciones cloud esenciales para operación empresarial. Alta dependencia de terceros y disponibilidad continua.',
    diiBase: {
      min: 0.8,
      max: 1.2,
      average: 1.0,
      range: '0.8-1.2'
    },
    characteristics: {
      digitalDependency: '70-90%',
      naturalRedundancy: 'Baja',
      manualFallback: 'Limitado',
      customerChannels: ['SaaS', 'API', 'Web App', 'Mobile SDK'],
      criticalFactor: 'Dependencia de infraestructura cloud'
    },
    resilienceWindow: {
      minHours: 6,
      maxHours: 24,
      typical: 12,
      description: 'Impacto severo después de 6-24h sin servicio'
    },
    riskMultiplier: 1.5,
    examples: {
      latam: [
        { company: 'Siigo', country: 'Colombia', sector: 'ERP/Contabilidad' },
        { company: 'ContPAQi', country: 'México', sector: 'Software Contable' },
        { company: 'Aspel', country: 'México', sector: 'Software Empresarial' },
        { company: 'TOTVS', country: 'Brasil', sector: 'ERP' },
        { company: 'Softland', country: 'Chile', sector: 'ERP' }
      ],
      spain: [
        { company: 'Sage España', country: 'España', sector: 'Software Empresarial' },
        { company: 'A3 Software', country: 'España', sector: 'Software Gestión' },
        { company: 'Holded', country: 'España', sector: 'Software Cloud' },
        { company: 'FacturaDirecta', country: 'España', sector: 'Facturación' }
      ]
    },
    sectorAdjustments: {
      erp: 1.1,
      accounting: 1.0,
      crm: 0.9,
      collaboration: 0.8
    }
  },

  3: {
    id: 3,
    key: 'SERVICIOS_DATOS',
    name: 'Servicios de Datos',
    nameEn: 'Data Services',
    description: 'Monetización mediante análisis y gestión de información. El valor está en los datos y su procesamiento.',
    diiBase: {
      min: 0.5,
      max: 0.9,
      average: 0.7,
      range: '0.5-0.9'
    },
    characteristics: {
      digitalDependency: '80-95%',
      naturalRedundancy: 'Muy baja',
      manualFallback: 'No viable',
      customerChannels: ['API', 'Dashboards', 'Reports', 'Data Feeds'],
      criticalFactor: 'Valor concentrado en información'
    },
    resilienceWindow: {
      minHours: 4,
      maxHours: 12,
      typical: 8,
      description: 'Pérdida de valor inmediata sin acceso a datos'
    },
    riskMultiplier: 2.0,
    examples: {
      latam: [
        { company: 'Experian', country: 'Brasil', sector: 'Credit Bureau' },
        { company: 'Serasa', country: 'Brasil', sector: 'Credit Information' },
        { company: 'DataCRM', country: 'Colombia', sector: 'CRM Analytics' },
        { company: 'Equifax', country: 'Chile', sector: 'Credit Bureau' },
        { company: 'Círculo de Crédito', country: 'México', sector: 'Credit Bureau' }
      ],
      spain: [
        { company: 'Axesor', country: 'España', sector: 'Risk Information' },
        { company: 'Informa D&B', country: 'España', sector: 'Business Information' },
        { company: 'CESCE', country: 'España', sector: 'Credit Insurance Data' },
        { company: 'Iberinform', country: 'España', sector: 'Commercial Information' }
      ]
    },
    sectorAdjustments: {
      creditBureau: 1.2,
      analytics: 1.0,
      marketResearch: 0.9,
      dataAggregation: 1.1
    }
  },

  4: {
    id: 4,
    key: 'ECOSISTEMA_DIGITAL',
    name: 'Ecosistema Digital',
    nameEn: 'Digital Ecosystem',
    description: 'Plataformas multi-actor con efectos de red. Complejidad por múltiples stakeholders interdependientes.',
    diiBase: {
      min: 0.4,
      max: 0.8,
      average: 0.6,
      range: '0.4-0.8'
    },
    characteristics: {
      digitalDependency: '95-100%',
      naturalRedundancy: 'Ninguna',
      manualFallback: 'Imposible',
      customerChannels: ['Platform', 'Mobile App', 'API Partners'],
      criticalFactor: 'Complejidad de actores y efectos de red'
    },
    resilienceWindow: {
      minHours: 0,
      maxHours: 6,
      typical: 2,
      description: 'Colapso inmediato sin plataforma digital'
    },
    riskMultiplier: 2.5,
    examples: {
      latam: [
        { company: 'MercadoLibre', country: 'Argentina', sector: 'E-commerce Platform' },
        { company: 'Rappi', country: 'Colombia', sector: 'Delivery Platform' },
        { company: 'Didi', country: 'México', sector: 'Ride-hailing' },
        { company: 'iFood', country: 'Brasil', sector: 'Food Delivery' },
        { company: 'Cornershop', country: 'Chile', sector: 'Grocery Delivery' }
      ],
      spain: [
        { company: 'Glovo', country: 'España', sector: 'Delivery Platform' },
        { company: 'Wallapop', country: 'España', sector: 'Marketplace' },
        { company: 'Idealista', country: 'España', sector: 'Real Estate Platform' },
        { company: 'Cabify', country: 'España', sector: 'Ride-hailing' }
      ]
    },
    sectorAdjustments: {
      marketplace: 1.0,
      delivery: 1.1,
      rideHailing: 1.2,
      socialCommerce: 0.9
    }
  },

  5: {
    id: 5,
    key: 'SERVICIOS_FINANCIEROS',
    name: 'Servicios Financieros',
    nameEn: 'Financial Services',
    description: 'Core del negocio en transacciones monetarias. Alta regulación y criticidad por manejo de dinero.',
    diiBase: {
      min: 0.2,
      max: 0.6,
      average: 0.4,
      range: '0.2-0.6'
    },
    characteristics: {
      digitalDependency: '95-100%',
      naturalRedundancy: 'Muy limitada',
      manualFallback: 'Regulatoriamente complejo',
      customerChannels: ['Mobile App', 'Web Banking', 'APIs', 'Cards'],
      criticalFactor: 'Regulación + manejo de dinero'
    },
    resilienceWindow: {
      minHours: 0,
      maxHours: 2,
      typical: 1,
      description: 'Impacto financiero y regulatorio inmediato'
    },
    riskMultiplier: 3.5,
    examples: {
      latam: [
        { company: 'Nubank', country: 'Brasil', sector: 'Digital Bank' },
        { company: 'Clip', country: 'México', sector: 'Payment Processing' },
        { company: 'Ualá', country: 'Argentina', sector: 'Fintech' },
        { company: 'Nequi', country: 'Colombia', sector: 'Digital Wallet' },
        { company: 'Mercado Pago', country: 'Argentina', sector: 'Payment Platform' }
      ],
      spain: [
        { company: 'Openbank', country: 'España', sector: 'Digital Bank' },
        { company: 'Bizum', country: 'España', sector: 'Payment System' },
        { company: 'Verse', country: 'España', sector: 'P2P Payments' },
        { company: 'Rebellion Pay', country: 'España', sector: 'Neobank' }
      ]
    },
    sectorAdjustments: {
      digitalBank: 1.2,
      paymentProcessor: 1.3,
      cryptocurrency: 1.5,
      insurtech: 1.0
    }
  },

  6: {
    id: 6,
    key: 'INFRAESTRUCTURA_HEREDADA',
    name: 'Infraestructura Heredada',
    nameEn: 'Legacy Infrastructure',
    description: 'Sistemas legacy con capas digitales agregadas. Alta deuda técnica y complejidad de modernización.',
    diiBase: {
      min: 0.2,
      max: 0.5,
      average: 0.35,
      range: '0.2-0.5'
    },
    characteristics: {
      digitalDependency: '20-50%',
      naturalRedundancy: 'Sistemas paralelos',
      manualFallback: 'Procesos manuales existentes',
      customerChannels: ['Oficinas', 'Call Center', 'Portal Web', 'Apps legacy'],
      criticalFactor: 'Deuda técnica crítica'
    },
    resilienceWindow: {
      minHours: 2,
      maxHours: 24,
      typical: 12,
      description: 'Degradación progresiva por sistemas interconectados'
    },
    riskMultiplier: 2.8,
    examples: {
      latam: [
        { company: 'CFE', country: 'México', sector: 'Energía' },
        { company: 'Pemex', country: 'México', sector: 'Petróleo' },
        { company: 'Ecopetrol', country: 'Colombia', sector: 'Petróleo' },
        { company: 'YPF', country: 'Argentina', sector: 'Energía' },
        { company: 'ENAP', country: 'Chile', sector: 'Petróleo' }
      ],
      spain: [
        { company: 'Endesa', country: 'España', sector: 'Energía' },
        { company: 'Repsol', country: 'España', sector: 'Petróleo' },
        { company: 'Correos', country: 'España', sector: 'Servicios Postales' },
        { company: 'ADIF', country: 'España', sector: 'Infraestructura Ferroviaria' }
      ]
    },
    sectorAdjustments: {
      energy: 1.1,
      oil: 1.2,
      government: 1.3,
      utilities: 1.0
    }
  },

  7: {
    id: 7,
    key: 'CADENA_SUMINISTRO',
    name: 'Cadena de Suministro',
    nameEn: 'Supply Chain',
    description: 'Logística física con trazabilidad digital crítica. Balance entre operaciones físicas y control digital.',
    diiBase: {
      min: 0.4,
      max: 0.8,
      average: 0.6,
      range: '0.4-0.8'
    },
    characteristics: {
      digitalDependency: '40-70%',
      naturalRedundancy: 'Moderada',
      manualFallback: 'Posible pero ineficiente',
      customerChannels: ['Tracking Web', 'EDI', 'Mobile Apps', 'Call Center'],
      criticalFactor: 'Continuidad operacional física-digital'
    },
    resilienceWindow: {
      minHours: 12,
      maxHours: 48,
      typical: 24,
      description: 'Operación degradada pero funcional sin sistemas'
    },
    riskMultiplier: 1.8,
    examples: {
      latam: [
        { company: 'DHL', country: 'Regional', sector: 'Courier' },
        { company: 'Estafeta', country: 'México', sector: 'Paquetería' },
        { company: 'TCC', country: 'Brasil', sector: 'Transporte' },
        { company: 'Coordinadora', country: 'Colombia', sector: 'Logística' },
        { company: 'Chilexpress', country: 'Chile', sector: 'Courier' }
      ],
      spain: [
        { company: 'SEUR', country: 'España', sector: 'Paquetería' },
        { company: 'MRW', country: 'España', sector: 'Mensajería' },
        { company: 'Nacex', country: 'España', sector: 'Transporte Urgente' },
        { company: 'Logista', country: 'España', sector: 'Distribución' }
      ]
    },
    sectorAdjustments: {
      courier: 1.0,
      freight: 0.9,
      lastMile: 1.2,
      warehousing: 0.8
    }
  },

  8: {
    id: 8,
    key: 'INFORMACION_REGULADA',
    name: 'Información Regulada',
    nameEn: 'Regulated Information',
    description: 'Manejo de datos sensibles bajo normativa estricta. Alto impacto por cumplimiento y privacidad.',
    diiBase: {
      min: 0.4,
      max: 0.7,
      average: 0.55,
      range: '0.4-0.7'
    },
    characteristics: {
      digitalDependency: '60-80%',
      naturalRedundancy: 'Baja',
      manualFallback: 'Limitado por volumen',
      customerChannels: ['Portal Pacientes', 'Apps Salud', 'Telemedicina', 'Presencial'],
      criticalFactor: 'Cumplimiento regulatorio + datos sensibles'
    },
    resilienceWindow: {
      minHours: 2,
      maxHours: 12,
      typical: 6,
      description: 'Impacto en atención y cumplimiento normativo'
    },
    riskMultiplier: 3.0,
    examples: {
      latam: [
        { company: 'Hospital Alemán', country: 'Argentina', sector: 'Salud' },
        { company: 'Clínica Las Condes', country: 'Chile', sector: 'Salud' },
        { company: 'Hospital ABC', country: 'México', sector: 'Salud' },
        { company: 'Colsanitas', country: 'Colombia', sector: 'Salud/Seguros' },
        { company: 'SulAmérica', country: 'Brasil', sector: 'Seguros Salud' }
      ],
      spain: [
        { company: 'Quirónsalud', country: 'España', sector: 'Salud' },
        { company: 'Sanitas', country: 'España', sector: 'Salud/Seguros' },
        { company: 'HM Hospitales', country: 'España', sector: 'Salud' },
        { company: 'DKV Seguros', country: 'España', sector: 'Seguros Salud' }
      ]
    },
    sectorAdjustments: {
      hospitals: 1.1,
      insurance: 1.0,
      laboratories: 1.2,
      telemedicine: 1.3
    }
  }
};

/**
 * Get a business model by ID
 * @param {number} id - Business model ID (1-8)
 * @returns {Object|null} Business model object or null if not found
 */
export function getBusinessModel(id) {
  if (!id || typeof id !== 'number' || id < 1 || id > 8) {
    return null;
  }
  return businessModels[id] || null;
}

/**
 * Get a business model by name (case insensitive)
 * @param {string} name - Business model name in Spanish or English
 * @returns {Object|null} Business model object or null if not found
 */
export function getBusinessModelByName(name) {
  if (!name || typeof name !== 'string') {
    return null;
  }
  
  const normalizedName = name.toLowerCase().trim();
  
  for (const model of Object.values(businessModels)) {
    if (model.name.toLowerCase() === normalizedName || 
        model.nameEn.toLowerCase() === normalizedName ||
        model.key.toLowerCase() === normalizedName) {
      return model;
    }
  }
  
  return null;
}

/**
 * Get resilience window for a business model
 * @param {number} modelId - Business model ID (1-8)
 * @returns {Object|null} Resilience window object with hours and description
 */
export function getResilienceWindow(modelId) {
  const model = getBusinessModel(modelId);
  if (!model) {
    return null;
  }
  
  return {
    modelId: model.id,
    modelName: model.name,
    window: model.resilienceWindow,
    interpretation: interpretResilienceWindow(model.resilienceWindow.typical)
  };
}

/**
 * Interpret resilience window hours
 * @private
 * @param {number} hours - Typical resilience window in hours
 * @returns {string} Human-readable interpretation
 */
function interpretResilienceWindow(hours) {
  if (hours === 0) {
    return 'Impacto inmediato - sin capacidad de operación manual';
  } else if (hours <= 2) {
    return 'Ventana crítica - menos de 2 horas para impacto severo';
  } else if (hours <= 6) {
    return 'Ventana muy limitada - degradación rápida';
  } else if (hours <= 12) {
    return 'Ventana limitada - medio día de operación degradada';
  } else if (hours <= 24) {
    return 'Ventana moderada - un día de resiliencia';
  } else {
    return 'Ventana amplia - múltiples días de operación alternativa';
  }
}

/**
 * Get regional examples for a business model
 * @param {number} modelId - Business model ID (1-8)
 * @param {string} [region='all'] - Region filter: 'latam', 'spain', or 'all'
 * @returns {Object|null} Examples object or null if not found
 */
export function getRegionalExamples(modelId, region = 'all') {
  const model = getBusinessModel(modelId);
  if (!model) {
    return null;
  }
  
  const normalizedRegion = region.toLowerCase().trim();
  
  switch (normalizedRegion) {
    case 'latam':
      return {
        modelId: model.id,
        modelName: model.name,
        region: 'LATAM',
        examples: model.examples.latam
      };
    
    case 'spain':
    case 'españa':
      return {
        modelId: model.id,
        modelName: model.name,
        region: 'España',
        examples: model.examples.spain
      };
    
    case 'all':
    default:
      return {
        modelId: model.id,
        modelName: model.name,
        region: 'All',
        examples: {
          latam: model.examples.latam,
          spain: model.examples.spain
        }
      };
  }
}

/**
 * Get sector adjustment factor for a business model and sector
 * @param {number} modelId - Business model ID (1-8)
 * @param {string} sector - Sector name
 * @returns {number} Adjustment factor (default 1.0 if not found)
 */
export function getSectorAdjustment(modelId, sector) {
  const model = getBusinessModel(modelId);
  if (!model || !sector) {
    return 1.0;
  }
  
  const normalizedSector = sector.toLowerCase().trim();
  
  // Look for exact match
  for (const [key, value] of Object.entries(model.sectorAdjustments)) {
    if (key === normalizedSector) {
      return value;
    }
  }
  
  // Look for partial match (sector contains key or key contains sector)
  for (const [key, value] of Object.entries(model.sectorAdjustments)) {
    if (key.includes(normalizedSector) || normalizedSector.includes(key)) {
      return value;
    }
  }
  
  // Default adjustment
  return 1.0;
}

/**
 * Get all business models sorted by DII base average
 * @param {string} [order='asc'] - Sort order: 'asc' or 'desc'
 * @returns {Array} Array of business models sorted by DII base
 */
export function getAllBusinessModelsSorted(order = 'asc') {
  const models = Object.values(businessModels);
  
  return models.sort((a, b) => {
    if (order === 'desc') {
      return b.diiBase.average - a.diiBase.average;
    }
    return a.diiBase.average - b.diiBase.average;
  });
}

/**
 * Get business models by digital dependency level
 * @param {string} level - Dependency level: 'low' (<50%), 'medium' (50-80%), 'high' (>80%)
 * @returns {Array} Array of business models matching the dependency level
 */
export function getModelsByDigitalDependency(level) {
  const normalizedLevel = level.toLowerCase().trim();
  
  return Object.values(businessModels).filter(model => {
    const dependency = model.characteristics.digitalDependency;
    const minDep = parseInt(dependency.split('-')[0]);
    const maxDep = parseInt(dependency.split('-')[1].replace('%', ''));
    const avgDep = (minDep + maxDep) / 2;
    
    switch (normalizedLevel) {
      case 'low':
        return avgDep < 50;
      case 'medium':
        return avgDep >= 50 && avgDep <= 80;
      case 'high':
        return avgDep > 80;
      default:
        return false;
    }
  });
}

/**
 * Get risk profile for a business model
 * @param {number} modelId - Business model ID (1-8)
 * @returns {Object|null} Risk profile with multiplier and interpretation
 */
export function getRiskProfile(modelId) {
  const model = getBusinessModel(modelId);
  if (!model) {
    return null;
  }
  
  return {
    modelId: model.id,
    modelName: model.name,
    riskMultiplier: model.riskMultiplier,
    diiBase: model.diiBase.average,
    riskLevel: interpretRiskLevel(model.riskMultiplier),
    criticalFactor: model.characteristics.criticalFactor,
    resilienceWindow: model.resilienceWindow.typical,
    recommendation: generateRiskRecommendation(model)
  };
}

/**
 * Interpret risk multiplier into risk level
 * @private
 * @param {number} multiplier - Risk multiplier value
 * @returns {string} Risk level interpretation
 */
function interpretRiskLevel(multiplier) {
  if (multiplier <= 1.0) {
    return 'Bajo';
  } else if (multiplier <= 1.5) {
    return 'Moderado';
  } else if (multiplier <= 2.5) {
    return 'Alto';
  } else {
    return 'Crítico';
  }
}

/**
 * Generate risk recommendation based on model characteristics
 * @private
 * @param {Object} model - Business model object
 * @returns {string} Risk mitigation recommendation
 */
function generateRiskRecommendation(model) {
  const { digitalDependency } = model.characteristics;
  const avgDep = (parseInt(digitalDependency.split('-')[0]) + 
                  parseInt(digitalDependency.split('-')[1].replace('%', ''))) / 2;
  
  if (avgDep > 90) {
    return 'Implementar arquitectura Zero Trust y redundancia geográfica crítica';
  } else if (avgDep > 70) {
    return 'Fortalecer planes de continuidad y respaldos automatizados';
  } else if (avgDep > 50) {
    return 'Mantener procesos manuales actualizados y personal entrenado';
  } else {
    return 'Preservar redundancia natural y evitar dependencia digital excesiva';
  }
}

// Export all models and functions
export default {
  businessModels,
  getBusinessModel,
  getBusinessModelByName,
  getResilienceWindow,
  getRegionalExamples,
  getSectorAdjustment,
  getAllBusinessModelsSorted,
  getModelsByDigitalDependency,
  getRiskProfile
};