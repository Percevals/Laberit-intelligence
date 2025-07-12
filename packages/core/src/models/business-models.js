/**
 * Business Models Module for Digital Immunity Index 4.0
 * 
 * Defines the 8 business models with their characteristics, 
 * resilience factors, and regional examples.
 * 
 * @module @dii/core/models
 * @version 4.0.0
 * @author Laberit Intelligence
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
        { company: 'Cabify', country: 'España', sector: 'Ride-hailing' },
        { company: 'Idealista', country: 'España', sector: 'Real Estate Platform' }
      ]
    },
    sectorAdjustments: {
      marketplace: 1.0,
      delivery: 1.2,
      rideHailing: 1.1,
      socialPlatform: 0.9
    }
  },

  5: {
    id: 5,
    key: 'SERVICIOS_FINANCIEROS',
    name: 'Servicios Financieros',
    nameEn: 'Financial Services',
    description: 'Procesamiento de transacciones críticas y gestión de activos digitales. Blancos prioritarios con alto impacto.',
    diiBase: {
      min: 0.2,
      max: 0.6,
      average: 0.4,
      range: '0.2-0.6'
    },
    characteristics: {
      digitalDependency: '90-100%',
      naturalRedundancy: 'Ninguna',
      manualFallback: 'Muy limitado',
      customerChannels: ['Digital Banking', 'ATM', 'API', 'Mobile'],
      criticalFactor: 'Target prioritario + impacto cascada'
    },
    resilienceWindow: {
      minHours: 0,
      maxHours: 4,
      typical: 1,
      description: 'Impacto inmediato en liquidez y confianza'
    },
    riskMultiplier: 3.0,
    examples: {
      latam: [
        { company: 'Nubank', country: 'Brasil', sector: 'Digital Banking' },
        { company: 'Banco Azteca', country: 'México', sector: 'Banking' },
        { company: 'BancoEstado', country: 'Chile', sector: 'Banking' },
        { company: 'Bancolombia', country: 'Colombia', sector: 'Banking' },
        { company: 'Mercado Pago', country: 'Argentina', sector: 'Payments' }
      ],
      spain: [
        { company: 'BBVA', country: 'España', sector: 'Banking' },
        { company: 'Santander', country: 'España', sector: 'Banking' },
        { company: 'CaixaBank', country: 'España', sector: 'Banking' },
        { company: 'Bizum', country: 'España', sector: 'Payments' }
      ]
    },
    sectorAdjustments: {
      banking: 1.0,
      payments: 1.1,
      insurance: 0.9,
      wealthManagement: 0.8
    }
  },

  6: {
    id: 6,
    key: 'INFRAESTRUCTURA_HEREDADA',
    name: 'Infraestructura Heredada',
    nameEn: 'Legacy Infrastructure',
    description: 'Sistemas críticos legacy con décadas de deuda técnica. Vulnerabilidades conocidas difíciles de remediar.',
    diiBase: {
      min: 0.2,
      max: 0.5,
      average: 0.35,
      range: '0.2-0.5'
    },
    characteristics: {
      digitalDependency: '60-80%',
      naturalRedundancy: 'Variable',
      manualFallback: 'Parcial',
      customerChannels: ['Call Center', 'Branch', 'Legacy Systems'],
      criticalFactor: 'Deuda técnica acumulada + rigidez'
    },
    resilienceWindow: {
      minHours: 2,
      maxHours: 12,
      typical: 6,
      description: 'Degradación progresiva de servicios'
    },
    riskMultiplier: 2.5,
    examples: {
      latam: [
        { company: 'Telmex', country: 'México', sector: 'Telecom' },
        { company: 'Entel', country: 'Chile', sector: 'Telecom' },
        { company: 'CFE', country: 'México', sector: 'Energy' },
        { company: 'Ecopetrol', country: 'Colombia', sector: 'Oil & Gas' },
        { company: 'YPF', country: 'Argentina', sector: 'Oil & Gas' }
      ],
      spain: [
        { company: 'Telefónica', country: 'España', sector: 'Telecom' },
        { company: 'Endesa', country: 'España', sector: 'Energy' },
        { company: 'Repsol', country: 'España', sector: 'Oil & Gas' },
        { company: 'Iberdrola', country: 'España', sector: 'Utilities' }
      ]
    },
    sectorAdjustments: {
      telecom: 1.0,
      utilities: 1.1,
      oil: 0.9,
      manufacturing: 1.0
    }
  },

  7: {
    id: 7,
    key: 'CADENA_SUMINISTRO',
    name: 'Cadena de Suministro',
    nameEn: 'Supply Chain',
    description: 'Coordinación compleja multi-actor con sistemas heterogéneos. Vulnerabilidad en cascada por interdependencias.',
    diiBase: {
      min: 0.4,
      max: 0.8,
      average: 0.6,
      range: '0.4-0.8'
    },
    characteristics: {
      digitalDependency: '70-85%',
      naturalRedundancy: 'Baja',
      manualFallback: 'Muy limitado',
      customerChannels: ['EDI', 'Portal', 'Integration APIs'],
      criticalFactor: 'Efecto cascada en la cadena'
    },
    resilienceWindow: {
      minHours: 6,
      maxHours: 24,
      typical: 12,
      description: 'Disrupción progresiva en la cadena'
    },
    riskMultiplier: 2.0,
    examples: {
      latam: [
        { company: 'Bimbo', country: 'México', sector: 'Food Distribution' },
        { company: 'Femsa', country: 'México', sector: 'Beverage Distribution' },
        { company: 'Cencosud Logística', country: 'Chile', sector: 'Logistics' },
        { company: 'Grupo Éxito', country: 'Colombia', sector: 'Retail Supply' },
        { company: 'BRF', country: 'Brasil', sector: 'Food Supply' }
      ],
      spain: [
        { company: 'Logista', country: 'España', sector: 'Distribution' },
        { company: 'SEUR', country: 'España', sector: 'Logistics' },
        { company: 'Correos', country: 'España', sector: 'Postal/Logistics' },
        { company: 'Maersk España', country: 'España', sector: 'Shipping' }
      ]
    },
    sectorAdjustments: {
      logistics: 1.0,
      distribution: 1.1,
      manufacturing: 0.9,
      shipping: 1.2
    }
  },

  8: {
    id: 8,
    key: 'INFORMACION_REGULADA',
    name: 'Información Regulada',
    nameEn: 'Regulated Information',
    description: 'Gestión de datos sensibles bajo estricta regulación. Impacto legal/regulatorio además del operacional.',
    diiBase: {
      min: 0.4,
      max: 0.7,
      average: 0.55,
      range: '0.4-0.7'
    },
    characteristics: {
      digitalDependency: '85-95%',
      naturalRedundancy: 'Muy baja',
      manualFallback: 'No permitido',
      customerChannels: ['Secure Portal', 'Encrypted API', 'Audit Trail'],
      criticalFactor: 'Cumplimiento regulatorio + multas'
    },
    resilienceWindow: {
      minHours: 1,
      maxHours: 8,
      typical: 4,
      description: 'Violación regulatoria inmediata'
    },
    riskMultiplier: 2.5,
    examples: {
      latam: [
        { company: 'Laboratórios Fleury', country: 'Brasil', sector: 'Healthcare' },
        { company: 'Clínica Las Condes', country: 'Chile', sector: 'Healthcare' },
        { company: 'Hospital ABC', country: 'México', sector: 'Healthcare' },
        { company: 'Colsanitas', country: 'Colombia', sector: 'Health Insurance' },
        { company: 'Swiss Medical', country: 'Argentina', sector: 'Healthcare' }
      ],
      spain: [
        { company: 'Quirónsalud', country: 'España', sector: 'Healthcare' },
        { company: 'Sanitas', country: 'España', sector: 'Health Insurance' },
        { company: 'HM Hospitales', country: 'España', sector: 'Healthcare' },
        { company: 'Mapfre Salud', country: 'España', sector: 'Health Insurance' }
      ]
    },
    sectorAdjustments: {
      healthcare: 1.1,
      insurance: 1.0,
      pharma: 1.2,
      legal: 0.9
    }
  }
};

/**
 * Get business model by ID
 * @param {number} id - Business model ID (1-8)
 * @returns {Object|null} Business model data or null if not found
 */
export function getBusinessModelById(id) {
  return businessModels[id] || null;
}

/**
 * Get business model by key
 * @param {string} key - Business model key (e.g., 'COMERCIO_HIBRIDO')
 * @returns {Object|null} Business model data or null if not found
 */
export function getBusinessModelByKey(key) {
  return Object.values(businessModels).find(model => model.key === key) || null;
}

/**
 * Get all business models
 * @returns {Array} Array of all business models
 */
export function getAllBusinessModels() {
  return Object.values(businessModels);
}

/**
 * Get business model names for selection
 * @returns {Array} Array of {id, name, nameEn} objects
 */
export function getBusinessModelOptions() {
  return Object.values(businessModels).map(model => ({
    id: model.id,
    name: model.name,
    nameEn: model.nameEn,
    description: model.description
  }));
}

/**
 * Get sector adjustment factor
 * @param {number} modelId - Business model ID
 * @param {string} sector - Sector name
 * @returns {number} Adjustment factor (default 1.0)
 */
export function getSectorAdjustment(modelId, sector) {
  const model = getBusinessModelById(modelId);
  if (!model || !model.sectorAdjustments) {
    return 1.0;
  }
  
  const sectorKey = sector.toLowerCase().replace(/\s+/g, '');
  return model.sectorAdjustments[sectorKey] || 1.0;
}