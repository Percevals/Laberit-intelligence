/**
 * DII 4.0 Business Model Profiles with Value Loss Patterns
 * 8 models designed for cyber risk assessment in Latin American context
 */

import type { ModelProfile, BusinessModelId } from '@core/types/business-model.types';

export const DII_V4_MODEL_PROFILES: Record<BusinessModelId, ModelProfile> = {
  // ARCHETYPE: REDUNDANTES
  1: {
    id: 1,
    name: 'COMERCIO_HIBRIDO',
    description: 'Retailers with physical stores and digital channels that can operate independently',
    
    diiBase: {
      min: 150,
      max: 200,
      avg: 175
    },
    
    valueLoss: {
      primaryImpact: 'operations',
      typicalLossPerHour: '$5-20K',
      recoveryDifficulty: 'low',
      worstNightmare: 'Ineficiencia prolongada que erosiona márgenes'
    },
    
    inherentStrengths: [
      'Physical channel provides fallback during digital outages',
      'Can process manual transactions indefinitely',
      'Customer relationships exist offline',
      'Inventory exists physically'
    ],
    
    fatalFlaws: [
      'Integration complexity between channels',
      'Legacy POS systems often unpatched',
      'Seasonal peaks strain security',
      'Manual processes are inefficient and error-prone'
    ],
    
    typicalAttacks: [
      {
        vector: 'POS malware',
        method: 'RAM scraping on payment terminals',
        frequency: 'VERY_COMMON',
        impact: 'MEDIUM',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'E-commerce skimming',
        method: 'Magecart attacks on checkout pages',
        frequency: 'VERY_COMMON',
        impact: 'MEDIUM',
        sophistication: 'COMMODITY'
      }
    ],
    
    migrationLikelihood: 'LOW',
    commonChallenges: [
      'Inventory sync between channels',
      'Unified customer view',
      'Payment processing resilience',
      'Peak season preparation'
    ]
  },

  // ARCHETYPE: PROCESADORES
  2: {
    id: 2,
    name: 'SOFTWARE_CRITICO',
    description: 'ERPs, CRMs, and business management systems that transform data into decisions',
    
    diiBase: {
      min: 80,
      max: 120,
      avg: 100
    },
    
    valueLoss: {
      primaryImpact: 'competitive',
      typicalLossPerHour: '$20-50K',
      recoveryDifficulty: 'high',
      worstNightmare: 'Competidor copia nuestro algoritmo/proceso diferenciador'
    },
    
    inherentStrengths: [
      'IP protection through code obfuscation',
      'Regular updates push security patches',
      'Professional development practices',
      'Cloud infrastructure resilience'
    ],
    
    fatalFlaws: [
      'Single codebase vulnerability affects all clients',
      'API keys often exposed in client implementations',
      'Update fatigue leads to unpatched instances',
      'Algorithm reverse engineering risk'
    ],
    
    typicalAttacks: [
      {
        vector: 'Supply chain compromise',
        method: 'Malicious updates or dependencies',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'ADVANCED'
      },
      {
        vector: 'API abuse',
        method: 'Credential stuffing and rate limit bypass',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'INTERMEDIATE'
      }
    ],
    
    migrationLikelihood: 'MEDIUM',
    commonChallenges: [
      'Protecting proprietary algorithms',
      'Managing multi-tenant security',
      'Preventing feature copying',
      'Maintaining performance at scale'
    ]
  },

  // ARCHETYPE: PROCESADORES
  3: {
    id: 3,
    name: 'SERVICIOS_DATOS',
    description: 'Analytics, credit scoring, and market intelligence transforming raw data into insights',
    
    diiBase: {
      min: 50,
      max: 90,
      avg: 70
    },
    
    valueLoss: {
      primaryImpact: 'competitive',
      typicalLossPerHour: '$20-50K',
      recoveryDifficulty: 'high',
      worstNightmare: 'Data poisoning destruye confiabilidad del modelo'
    },
    
    inherentStrengths: [
      'Data validation pipelines',
      'Model versioning and rollback',
      'Anomaly detection built-in',
      'Statistical quality controls'
    ],
    
    fatalFlaws: [
      'Model training data can be poisoned',
      'Insights can be reverse engineered',
      'Data sources may be compromised',
      'Competitive advantage is replicable'
    ],
    
    typicalAttacks: [
      {
        vector: 'Data poisoning',
        method: 'Feeding false data to skew models',
        frequency: 'COMMON',
        impact: 'HIGH',
        sophistication: 'ADVANCED'
      },
      {
        vector: 'Model extraction',
        method: 'API queries to replicate model behavior',
        frequency: 'EMERGING',
        impact: 'CRITICAL',
        sophistication: 'ADVANCED'
      }
    ],
    
    migrationLikelihood: 'HIGH',
    commonChallenges: [
      'Protecting model IP',
      'Ensuring data quality',
      'Preventing extraction attacks',
      'Maintaining competitive edge'
    ]
  },

  // ARCHETYPE: CONECTORES
  4: {
    id: 4,
    name: 'ECOSISTEMA_DIGITAL',
    description: 'Marketplaces and platforms connecting buyers, sellers, and service providers',
    
    diiBase: {
      min: 40,
      max: 80,
      avg: 60
    },
    
    valueLoss: {
      primaryImpact: 'trust',
      typicalLossPerHour: '$50-100K',
      recoveryDifficulty: 'high',
      worstNightmare: 'Fraude viral causa éxodo masivo de usuarios'
    },
    
    inherentStrengths: [
      'Network effects create stickiness',
      'Community self-polices fraud',
      'Multiple revenue streams',
      'Global best practices available'
    ],
    
    fatalFlaws: [
      'Trust is fragile and viral',
      'Fraud scales with platform',
      'User data honeypot',
      'Complex multi-party risks'
    ],
    
    typicalAttacks: [
      {
        vector: 'Account takeover',
        method: 'Credential stuffing at scale',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'Fraud rings',
        method: 'Coordinated seller/buyer fraud',
        frequency: 'COMMON',
        impact: 'HIGH',
        sophistication: 'INTERMEDIATE'
      }
    ],
    
    migrationLikelihood: 'LOW',
    commonChallenges: [
      'Balancing security and friction',
      'Scaling trust & safety',
      'Managing payment fraud',
      'Protecting user privacy'
    ]
  },

  // ARCHETYPE: CUSTODIOS
  5: {
    id: 5,
    name: 'SERVICIOS_FINANCIEROS',
    description: 'Banks, insurers, and fund administrators safeguarding financial assets',
    
    diiBase: {
      min: 20,
      max: 60,
      avg: 40
    },
    
    valueLoss: {
      primaryImpact: 'compliance',
      typicalLossPerHour: '$100K+',
      recoveryDifficulty: 'terminal',
      worstNightmare: 'Breach masivo pierde licencia bancaria'
    },
    
    inherentStrengths: [
      'Regulatory requirements drive security',
      'Mature fraud detection systems',
      'Insurance and capital reserves',
      'Industry information sharing'
    ],
    
    fatalFlaws: [
      'Attractive target for all attackers',
      'Legacy core banking systems',
      'Regulatory penalties are massive',
      'Trust loss is often permanent'
    ],
    
    typicalAttacks: [
      {
        vector: 'SWIFT/wire fraud',
        method: 'Business email compromise for transfers',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'INTERMEDIATE'
      },
      {
        vector: 'ATM jackpotting',
        method: 'Malware causing cash dispensing',
        frequency: 'REGIONAL',
        impact: 'HIGH',
        sophistication: 'ADVANCED'
      }
    ],
    
    migrationLikelihood: 'NONE',
    commonChallenges: [
      'Modernizing without risk',
      'Meeting regulations',
      'Preventing insider threats',
      'Managing third-party risk'
    ]
  },

  // ARCHETYPE: REDUNDANTES
  6: {
    id: 6,
    name: 'INFRAESTRUCTURA_HEREDADA',
    description: 'Utilities, government, and industrial systems with decades-old foundations',
    
    diiBase: {
      min: 20,
      max: 50,
      avg: 35
    },
    
    valueLoss: {
      primaryImpact: 'operations',
      typicalLossPerHour: '$5-20K',
      recoveryDifficulty: 'low',
      worstNightmare: 'Apagón masivo por semanas'
    },
    
    inherentStrengths: [
      'Air-gapped critical systems',
      'Manual override capabilities',
      'Experienced operators',
      'Simple, proven technology'
    ],
    
    fatalFlaws: [
      'Unpatchable legacy systems',
      'Tribal knowledge dependency',
      'Slow incident response',
      'Limited security expertise'
    ],
    
    typicalAttacks: [
      {
        vector: 'ICS/SCADA targeting',
        method: 'Exploiting industrial protocols',
        frequency: 'RARE',
        impact: 'CRITICAL',
        sophistication: 'NATION_STATE'
      },
      {
        vector: 'Ransomware',
        method: 'Encrypting IT systems',
        frequency: 'COMMON',
        impact: 'MEDIUM',
        sophistication: 'COMMODITY'
      }
    ],
    
    migrationLikelihood: 'FORCED',
    commonChallenges: [
      'Modernizing safely',
      'Finding expertise',
      'Budget constraints',
      'Change resistance'
    ]
  },

  // ARCHETYPE: CONECTORES
  7: {
    id: 7,
    name: 'CADENA_SUMINISTRO',
    description: 'Logistics operators digitally connecting shippers, carriers, and receivers',
    
    diiBase: {
      min: 40,
      max: 80,
      avg: 60
    },
    
    valueLoss: {
      primaryImpact: 'trust',
      typicalLossPerHour: '$50-100K',
      recoveryDifficulty: 'medium',
      worstNightmare: 'Pérdida masiva de mercancía sin trazabilidad'
    },
    
    inherentStrengths: [
      'Physical verification possible',
      'Multiple tracking systems',
      'Insurance coverage',
      'Partner redundancy'
    ],
    
    fatalFlaws: [
      'Complex multi-party systems',
      'Real-time pressure prevents security',
      'IoT devices often vulnerable',
      'Data sharing requirements'
    ],
    
    typicalAttacks: [
      {
        vector: 'GPS spoofing',
        method: 'Misdirecting shipments',
        frequency: 'EMERGING',
        impact: 'HIGH',
        sophistication: 'INTERMEDIATE'
      },
      {
        vector: 'Cargo theft',
        method: 'Using system access for physical theft',
        frequency: 'COMMON',
        impact: 'HIGH',
        sophistication: 'INTERMEDIATE'
      }
    ],
    
    migrationLikelihood: 'MEDIUM',
    commonChallenges: [
      'Securing IoT devices',
      'Partner integration security',
      'Real-time performance',
      'Cross-border compliance'
    ]
  },

  // ARCHETYPE: CUSTODIOS
  8: {
    id: 8,
    name: 'INFORMACION_REGULADA',
    description: 'Healthcare, education, and organizations handling regulated personal data',
    
    diiBase: {
      min: 40,
      max: 70,
      avg: 55
    },
    
    valueLoss: {
      primaryImpact: 'compliance',
      typicalLossPerHour: '$100K+',
      recoveryDifficulty: 'terminal',
      worstNightmare: 'Filtración masiva de datos médicos/personales'
    },
    
    inherentStrengths: [
      'Compliance frameworks exist',
      'Data classification mature',
      'Audit trails mandatory',
      'Professional standards'
    ],
    
    fatalFlaws: [
      'Data has permanent value',
      'Insider threat prevalent',
      'Complex privacy requirements',
      'Public trust critical'
    ],
    
    typicalAttacks: [
      {
        vector: 'Medical ransomware',
        method: 'Encrypting patient records',
        frequency: 'VERY_COMMON',
        impact: 'CRITICAL',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'Data exfiltration',
        method: 'Stealing PII for identity theft',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'INTERMEDIATE'
      }
    ],
    
    migrationLikelihood: 'LOW',
    commonChallenges: [
      'Balancing access and security',
      'Managing consent',
      'Preventing data breaches',
      'Meeting regulations'
    ]
  }
};