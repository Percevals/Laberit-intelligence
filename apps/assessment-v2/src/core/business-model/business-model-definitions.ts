/**
 * DII Business Model Definitions
 * Complete definitions for the 8 DII cyber risk business models
 * Based on /docs/Fundamentos_Modelo_de_Negocio.md
 */

import type { DIIBusinessModel } from '@/types/business-model';

// Business Model type for runtime validation
export const DII_BUSINESS_MODELS = {
  COMERCIO_HIBRIDO: 'COMERCIO_HIBRIDO',
  SOFTWARE_CRITICO: 'SOFTWARE_CRITICO',
  SERVICIOS_DATOS: 'SERVICIOS_DATOS',
  ECOSISTEMA_DIGITAL: 'ECOSISTEMA_DIGITAL',
  SERVICIOS_FINANCIEROS: 'SERVICIOS_FINANCIEROS',
  INFRAESTRUCTURA_HEREDADA: 'INFRAESTRUCTURA_HEREDADA',
  CADENA_SUMINISTRO: 'CADENA_SUMINISTRO',
  INFORMACION_REGULADA: 'INFORMACION_REGULADA'
} as const;

export interface BusinessModelDefinition {
  id: DIIBusinessModel;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  coreDefinition: string;
  
  // Características identificadoras
  digitalDependency: {
    min: number; // Percentage
    max: number;
  };
  
  interruptionTolerance: {
    min: number; // Hours
    max: number;
  };
  
  revenueModel: string[];
  criticalInfrastructure: string[];
  
  // Señales de clasificación
  requiredSignals: string[];
  prohibitedSignals: string[];
  optionalSignals: string[];
  
  // Impacto de ciberataques
  cyberImpact: {
    perHourMin: number; // USD thousands
    perHourMax: number;
    primaryRisks: string[];
    strengths: string[];
    vulnerabilities: string[];
  };
  
  // Ejemplos y palabras clave
  industryKeywords: string[];
  companyExamples: string[];
  
  // Scoring y prioridad
  classificationPriority: number; // 1-8, lower is higher priority
  confidenceBoostKeywords: string[];
}

export const BUSINESS_MODEL_DEFINITIONS: Record<DIIBusinessModel, BusinessModelDefinition> = {
  COMERCIO_HIBRIDO: {
    id: 'COMERCIO_HIBRIDO',
    name: 'Comercio Híbrido',
    nameEn: 'Hybrid Commerce',
    description: 'Organizaciones que mantienen operaciones físicas significativas complementadas con canales digitales',
    descriptionEn: 'Organizations maintaining significant physical operations complemented by digital channels',
    coreDefinition: 'La tecnología mejora pero no reemplaza el core del negocio físico',
    
    digitalDependency: { min: 30, max: 60 },
    interruptionTolerance: { min: 24, max: 48 },
    
    revenueModel: ['ventas_fisicas', 'ecommerce_complementario', 'click_and_collect'],
    criticalInfrastructure: ['pos_systems', 'inventario_fisico', 'logistica_ultima_milla', 'tiendas_fisicas'],
    
    requiredSignals: [
      'tiendas_fisicas',
      'inventario_fisico_significativo',
      'pos_como_tecnologia_principal'
    ],
    
    prohibitedSignals: [
      'puramente_digital',
      'sin_inventario_propio',
      'marketplace_puro'
    ],
    
    optionalSignals: [
      'ecommerce_presente',
      'app_movil',
      'programa_lealtad_digital'
    ],
    
    cyberImpact: {
      perHourMin: 5,
      perHourMax: 20,
      primaryRisks: ['pos_malware', 'skimming_ecommerce', 'ransomware_tiendas'],
      strengths: ['redundancia_fisica_natural', 'operacion_manual_posible'],
      vulnerabilities: ['integracion_omnicanal', 'multiples_puntos_entrada']
    },
    
    industryKeywords: ['retail', 'tienda', 'comercio', 'venta', 'almacen', 'sucursal'],
    companyExamples: ['Falabella', 'Liverpool', 'Cencosud', 'Walmart', 'Coppel', 'Farmacias Guadalajara'],
    
    classificationPriority: 1,
    confidenceBoostKeywords: ['tienda', 'sucursal', 'retail', 'pos', 'inventario']
  },

  SOFTWARE_CRITICO: {
    id: 'SOFTWARE_CRITICO',
    name: 'Software Crítico',
    nameEn: 'Critical Software',
    description: 'Proveedores de software/SaaS donde la interrupción impacta directamente las operaciones de clientes',
    descriptionEn: 'Software/SaaS providers where interruption directly impacts customer operations',
    coreDefinition: 'El software ES el producto, no un canal de entrega',
    
    digitalDependency: { min: 70, max: 90 },
    interruptionTolerance: { min: 6, max: 24 },
    
    revenueModel: ['suscripciones_recurrentes', 'licencias_software', 'saas_b2b'],
    criticalInfrastructure: ['cloud_computing', 'apis_criticas', 'bases_datos_multitenant', 'ci_cd_pipeline'],
    
    requiredSignals: [
      'modelo_saas_b2b',
      'clientes_empresariales_dependientes',
      'actualizaciones_continuas_software'
    ],
    
    prohibitedSignals: [
      'inventario_fisico',
      'operaciones_manuales',
      'servicio_presencial_principal'
    ],
    
    optionalSignals: [
      'sla_99_9_percent',
      'api_publica',
      'integraciones_enterprise'
    ],
    
    cyberImpact: {
      perHourMin: 15,
      perHourMax: 50,
      primaryRisks: ['supply_chain_attack', 'api_exploitation', 'ransomware_cloud'],
      strengths: ['agilidad_parcheo', 'monitoreo_continuo', 'devops_culture'],
      vulnerabilities: ['efecto_cascada_clientes', 'single_point_failure', 'complejidad_integraciones']
    },
    
    industryKeywords: ['software', 'saas', 'cloud', 'platform', 'api', 'b2b', 'enterprise'],
    companyExamples: ['Siigo', 'ContPAQi', 'Aspel', 'Totvs', 'Softland', 'Defontana'],
    
    classificationPriority: 2,
    confidenceBoostKeywords: ['saas', 'software', 'api', 'cloud', 'b2b', 'enterprise']
  },

  SERVICIOS_DATOS: {
    id: 'SERVICIOS_DATOS',
    name: 'Servicios de Datos',
    nameEn: 'Data Services',
    description: 'Empresas cuyo valor principal radica en recopilación, procesamiento y monetización de información',
    descriptionEn: 'Companies whose main value lies in data collection, processing and monetization',
    coreDefinition: 'Los datos SON el producto, no un subproducto',
    
    digitalDependency: { min: 80, max: 95 },
    interruptionTolerance: { min: 4, max: 12 },
    
    revenueModel: ['venta_insights', 'reportes_datos', 'acceso_apis_datos', 'data_licensing'],
    criticalInfrastructure: ['data_lakes', 'pipelines_procesamiento', 'apis_consulta', 'ml_models'],
    
    requiredSignals: [
      'datos_como_producto_principal',
      'apis_consulta_masiva',
      'actualizacion_continua_datasets'
    ],
    
    prohibitedSignals: [
      'producto_fisico_principal',
      'servicios_presenciales',
      'transacciones_financieras_core'
    ],
    
    optionalSignals: [
      'modelos_ml_propietarios',
      'partnerships_datos',
      'certificaciones_privacidad'
    ],
    
    cyberImpact: {
      perHourMin: 25,
      perHourMax: 75,
      primaryRisks: ['data_breach_masivo', 'poisoning_datasets', 'insider_threats'],
      strengths: ['datos_historicos_mantienen_valor', 'multiples_fuentes_datos'],
      vulnerabilities: ['breach_expone_activo_principal', 'honeypot_effect', 'compliance_multas']
    },
    
    industryKeywords: ['datos', 'analytics', 'intelligence', 'insights', 'bureau', 'informacion'],
    companyExamples: ['DataCrédito', 'Círculo de Crédito', 'Dun & Bradstreet', 'Nielsen', 'Experian'],
    
    classificationPriority: 4,
    confidenceBoostKeywords: ['data', 'analytics', 'insights', 'bureau', 'intelligence']
  },

  ECOSISTEMA_DIGITAL: {
    id: 'ECOSISTEMA_DIGITAL',
    name: 'Ecosistema Digital',
    nameEn: 'Digital Ecosystem',
    description: 'Plataformas multi-actor donde el valor emerge de las interacciones entre participantes',
    descriptionEn: 'Multi-actor platforms where value emerges from interactions between participants',
    coreDefinition: 'El valor está en la red, no en el inventario',
    
    digitalDependency: { min: 95, max: 100 },
    interruptionTolerance: { min: 0, max: 6 },
    
    revenueModel: ['comisiones_transaccion', 'publicidad_dirigida', 'fees_plataforma', 'suscripciones_premium'],
    criticalInfrastructure: ['plataforma_central', 'sistemas_pago', 'matching_algorithms', 'review_systems'],
    
    requiredSignals: [
      'modelo_dos_o_mas_lados',
      'efectos_red_evidentes',
      'sin_inventario_propio'
    ],
    
    prohibitedSignals: [
      'manufactura_propia',
      'servicios_unilaterales',
      'inventario_significativo'
    ],
    
    optionalSignals: [
      'crecimiento_exponencial_usuarios',
      'apis_terceros',
      'programa_partners'
    ],
    
    cyberImpact: {
      perHourMin: 50,
      perHourMax: 200,
      primaryRisks: ['platform_takeover', 'ddos_masivo', 'fraude_coordinado'],
      strengths: ['resiliencia_distribuida', 'comunidad_detecta_anomalias'],
      vulnerabilities: ['complejidad_actores_multiplica_vectores', 'contagio_reputacional', 'dependencia_confianza']
    },
    
    industryKeywords: ['marketplace', 'platform', 'booking', 'delivery', 'rideshare', 'p2p'],
    companyExamples: ['MercadoLibre', 'Rappi', 'Uber', 'Airbnb', 'OLX', 'Aeroméxico (booking)'],
    
    classificationPriority: 3,
    confidenceBoostKeywords: ['marketplace', 'platform', 'booking', 'app', 'riders', 'sellers']
  },

  SERVICIOS_FINANCIEROS: {
    id: 'SERVICIOS_FINANCIEROS',
    name: 'Servicios Financieros',
    nameEn: 'Financial Services',
    description: 'Organizaciones cuyo core es movimiento, custodia o gestión de dinero y activos financieros',
    descriptionEn: 'Organizations whose core is movement, custody or management of money and financial assets',
    coreDefinition: 'Cada transacción es crítica, cada segundo cuenta',
    
    digitalDependency: { min: 95, max: 100 },
    interruptionTolerance: { min: 0, max: 2 },
    
    revenueModel: ['intereses', 'comisiones_transaccion', 'spreads', 'fees_servicio'],
    criticalInfrastructure: ['core_bancario', 'redes_pago', 'sistemas_cumplimiento', 'kyc_aml'],
    
    requiredSignals: [
      'licencia_financiera_regulada',
      'procesamiento_pagos_core',
      'conexion_redes_bancarias'
    ],
    
    prohibitedSignals: [
      'inventario_fisico_principal',
      'servicios_no_financieros_mayoria',
      'operacion_offline_posible'
    ],
    
    optionalSignals: [
      'pci_dss_compliance',
      'swift_connection',
      'crypto_operations'
    ],
    
    cyberImpact: {
      perHourMin: 100,
      perHourMax: 500,
      primaryRisks: ['fraude_transaccional', 'ddos_extorsion', 'apt_nation_state'],
      strengths: ['alta_inversion_seguridad', 'regulacion_obliga_controles', 'monitoreo_24_7'],
      vulnerabilities: ['target_prioritario', 'impacto_regulatorio', 'contagio_sistemico']
    },
    
    industryKeywords: ['banco', 'fintech', 'pago', 'credito', 'wallet', 'remesa', 'bolsa'],
    companyExamples: ['Nubank', 'BBVA', 'Banorte', 'Clip', 'MercadoPago', 'Konfío'],
    
    classificationPriority: 5,
    confidenceBoostKeywords: ['bank', 'fintech', 'payment', 'wallet', 'credit', 'financial']
  },

  INFRAESTRUCTURA_HEREDADA: {
    id: 'INFRAESTRUCTURA_HEREDADA',
    name: 'Infraestructura Heredada',
    nameEn: 'Legacy Infrastructure',
    description: 'Organizaciones tradicionales con sistemas legacy críticos y capas digitales agregadas',
    descriptionEn: 'Traditional organizations with critical legacy systems and added digital layers',
    coreDefinition: 'Lo viejo es crítico, lo nuevo es parche',
    
    digitalDependency: { min: 20, max: 50 },
    interruptionTolerance: { min: 2, max: 24 },
    
    revenueModel: ['tradicional_con_componentes_digitales', 'tarifas_reguladas', 'contratos_largo_plazo'],
    criticalInfrastructure: ['mainframes', 'sistemas_propietarios', 'scada_ot', 'redes_industriales'],
    
    requiredSignals: [
      'sistemas_core_10_anos_plus',
      'multiples_capas_integracion',
      'dependencia_hardware_especifico'
    ],
    
    prohibitedSignals: [
      'cloud_native',
      'desarrollo_agil',
      'actualizaciones_frecuentes'
    ],
    
    optionalSignals: [
      'documentacion_escasa',
      'personal_proximo_retiro',
      'modernizacion_en_proceso'
    ],
    
    cyberImpact: {
      perHourMin: 30,
      perHourMax: 150,
      primaryRisks: ['ransomware_sin_backup', 'sabotaje_ot', 'supply_chain_firmware'],
      strengths: ['sistemas_aislados_por_antiguedad', 'air_gap_natural'],
      vulnerabilities: ['imposible_parchear', 'costoso_reemplazar', 'conocimiento_concentrado']
    },
    
    industryKeywords: ['gobierno', 'utility', 'energia', 'estatal', 'publico', 'infraestructura'],
    companyExamples: ['CFE', 'Pemex', 'Telmex', 'IMSS', 'SAT', 'Metro CDMX'],
    
    classificationPriority: 6,
    confidenceBoostKeywords: ['gobierno', 'estatal', 'publico', 'federal', 'nacional']
  },

  CADENA_SUMINISTRO: {
    id: 'CADENA_SUMINISTRO',
    name: 'Cadena de Suministro',
    nameEn: 'Supply Chain',
    description: 'Empresas cuya operación principal es mover bienes físicos con trazabilidad digital crítica',
    descriptionEn: 'Companies whose main operation is moving physical goods with critical digital traceability',
    coreDefinition: 'La visibilidad digital es tan importante como el movimiento físico',
    
    digitalDependency: { min: 40, max: 70 },
    interruptionTolerance: { min: 12, max: 48 },
    
    revenueModel: ['tarifas_envio', 'almacenamiento', '3pl_services', 'valor_agregado_logistico'],
    criticalInfrastructure: ['wms', 'tms', 'tracking_systems', 'iot_sensores'],
    
    requiredSignals: [
      'flota_propia_o_control_logistico',
      'tracking_tiempo_real',
      'integraciones_edi_api'
    ],
    
    prohibitedSignals: [
      'sin_movimiento_fisico',
      'servicios_digitales_puros',
      'sin_infraestructura_logistica'
    ],
    
    optionalSignals: [
      'certificaciones_logisticas',
      'cold_chain',
      'cross_docking'
    ],
    
    cyberImpact: {
      perHourMin: 20,
      perHourMax: 80,
      primaryRisks: ['gps_spoofing', 'ransomware_wms', 'partner_compromise'],
      strengths: ['operacion_manual_emergencia', 'redundancia_rutas'],
      vulnerabilities: ['perdida_visibilidad_perdida_confianza', 'efecto_domino', 'iot_surface_attack']
    },
    
    industryKeywords: ['logistica', 'transporte', 'envio', 'paqueteria', 'almacen', 'distribucion'],
    companyExamples: ['DHL', 'FedEx', 'Estafeta', 'Coordinadora', 'TUM', 'FEMSA Logística'],
    
    classificationPriority: 7,
    confidenceBoostKeywords: ['logistics', 'shipping', 'delivery', 'warehouse', 'fleet', '3pl']
  },

  INFORMACION_REGULADA: {
    id: 'INFORMACION_REGULADA',
    name: 'Información Regulada',
    nameEn: 'Regulated Information',
    description: 'Organizaciones que manejan datos altamente sensibles bajo estrictas normativas',
    descriptionEn: 'Organizations handling highly sensitive data under strict regulations',
    coreDefinition: 'El cumplimiento es operación, la privacidad es supervivencia',
    
    digitalDependency: { min: 60, max: 80 },
    interruptionTolerance: { min: 2, max: 12 },
    
    revenueModel: ['servicios_basados_confianza', 'contratos_cumplimiento', 'tarifas_reguladas'],
    criticalInfrastructure: ['sistemas_gestion_datos', 'control_acceso', 'audit_trails', 'encryption_systems'],
    
    requiredSignals: [
      'certificaciones_obligatorias',
      'auditorias_regulatorias_frecuentes',
      'datos_personales_sensibles_core'
    ],
    
    prohibitedSignals: [
      'datos_publicos_unicamente',
      'sin_regulacion_especifica',
      'anonimizacion_completa'
    ],
    
    optionalSignals: [
      'hipaa_compliance',
      'iso_27001',
      'sox_compliance'
    ],
    
    cyberImpact: {
      perHourMin: 40,
      perHourMax: 120,
      primaryRisks: ['ransomware_doble_extorsion', 'apt_datos_sensibles', 'insider_medical'],
      strengths: ['controles_obligatorios', 'auditorias_frecuentes', 'awareness_alto'],
      vulnerabilities: ['target_valioso', 'multas_millonarias', 'perdida_licencia_operar']
    },
    
    industryKeywords: ['hospital', 'clinica', 'salud', 'educacion', 'seguros', 'laboratorio'],
    companyExamples: ['Hospital Angeles', 'IMSS', 'Cruz Roja', 'Universidades', 'Aseguradoras Salud'],
    
    classificationPriority: 8,
    confidenceBoostKeywords: ['health', 'medical', 'hospital', 'clinic', 'insurance', 'education']
  }
};

// Helper function to get all industry keywords
export function getAllIndustryKeywords(): Set<string> {
  const keywords = new Set<string>();
  Object.values(BUSINESS_MODEL_DEFINITIONS).forEach(model => {
    model.industryKeywords.forEach(keyword => keywords.add(keyword.toLowerCase()));
  });
  return keywords;
}

// Helper function to check if a signal is present
export function hasSignal(companyData: any, signal: string): boolean {
  const normalizedData = JSON.stringify(companyData).toLowerCase();
  return normalizedData.includes(signal.toLowerCase().replace(/_/g, ' '));
}

// Helper function to calculate signal match score
export function calculateSignalScore(
  companyData: any,
  requiredSignals: string[],
  prohibitedSignals: string[],
  optionalSignals: string[]
): number {
  let score = 0;
  let requiredFound = 0;
  
  // Check required signals (must have at least one)
  requiredSignals.forEach(signal => {
    if (hasSignal(companyData, signal)) {
      requiredFound++;
      score += 30;
    }
  });
  
  // If no required signals found, this model doesn't apply
  if (requiredFound === 0) return 0;
  
  // Check prohibited signals (instant disqualification)
  for (const signal of prohibitedSignals) {
    if (hasSignal(companyData, signal)) {
      return 0;
    }
  }
  
  // Check optional signals (bonus points)
  optionalSignals.forEach(signal => {
    if (hasSignal(companyData, signal)) {
      score += 10;
    }
  });
  
  // Normalize score to 0-100
  return Math.min(100, score);
}

// Helper function to find best matching model
export function findBestMatchingModel(companyData: {
  name: string;
  industry?: string;
  description?: string;
  [key: string]: any;
}): {
  model: DIIBusinessModel;
  confidence: number;
  reasoning: string;
} {
  const scores: Array<{
    model: DIIBusinessModel;
    score: number;
    keywordMatches: string[];
  }> = [];
  
  const dataString = JSON.stringify(companyData).toLowerCase();
  
  Object.entries(BUSINESS_MODEL_DEFINITIONS).forEach(([modelId, definition]) => {
    // Check industry keywords
    const keywordMatches = definition.industryKeywords.filter(keyword => 
      dataString.includes(keyword.toLowerCase())
    );
    
    // Check confidence boost keywords
    const boostMatches = definition.confidenceBoostKeywords.filter(keyword =>
      dataString.includes(keyword.toLowerCase())
    );
    
    // Calculate signal score
    const signalScore = calculateSignalScore(
      companyData,
      definition.requiredSignals,
      definition.prohibitedSignals,
      definition.optionalSignals
    );
    
    // Calculate total score
    const keywordScore = keywordMatches.length * 20;
    const boostScore = boostMatches.length * 15;
    const priorityScore = (9 - definition.classificationPriority) * 5;
    
    const totalScore = signalScore + keywordScore + boostScore + priorityScore;
    
    if (totalScore > 0) {
      scores.push({
        model: modelId as DIIBusinessModel,
        score: totalScore,
        keywordMatches
      });
    }
  });
  
  // Sort by score
  scores.sort((a, b) => b.score - a.score);
  
  if (scores.length === 0) {
    // Default fallback based on basic heuristics
    if (dataString.includes('bank') || dataString.includes('fintech')) {
      return {
        model: 'SERVICIOS_FINANCIEROS',
        confidence: 0.6,
        reasoning: 'Detected financial keywords, defaulting to Financial Services'
      };
    }
    return {
      model: 'COMERCIO_HIBRIDO',
      confidence: 0.4,
      reasoning: 'No clear signals found, defaulting to most common model'
    };
  }
  
  const bestMatch = scores[0];
  const confidence = Math.min(0.95, bestMatch.score / 100);
  
  return {
    model: bestMatch.model,
    confidence,
    reasoning: `Matched based on: ${bestMatch.keywordMatches.join(', ')} with signal score ${bestMatch.score}`
  };
}

// Export convenience functions
export function getModelDefinition(model: DIIBusinessModel): BusinessModelDefinition {
  return BUSINESS_MODEL_DEFINITIONS[model];
}

export function getModelsByDigitalDependency(minDependency: number): DIIBusinessModel[] {
  return Object.entries(BUSINESS_MODEL_DEFINITIONS)
    .filter(([_, def]) => def.digitalDependency.min >= minDependency)
    .map(([model]) => model as DIIBusinessModel);
}

export function getModelsByRiskImpact(minImpactPerHour: number): DIIBusinessModel[] {
  return Object.entries(BUSINESS_MODEL_DEFINITIONS)
    .filter(([_, def]) => def.cyberImpact.perHourMin >= minImpactPerHour)
    .map(([model]) => model as DIIBusinessModel);
}