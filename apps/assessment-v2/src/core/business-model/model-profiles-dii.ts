/**
 * DII-Specific Business Model Profiles
 * 8 models designed for cyber risk assessment in Latin American context
 */

import type { ModelProfile, BusinessModelId } from '@core/types/business-model.types';
import { Hours } from '@core/types/brand.types';

export const DII_MODEL_PROFILES: Record<BusinessModelId, ModelProfile> = {
  1: {
    id: 1,
    name: 'COMERCIO_HIBRIDO',
    description: 'Hybrid Commerce - Companies operating both physical stores and digital channels',
    
    diiBase: {
      min: 25,
      max: 70,
      avg: 45
    },
    
    valueLoss: {
      primaryImpact: 'operations',
      typicalLossPerHour: '$5-20K',
      recoveryDifficulty: 'low',
      worstNightmare: 'Ineficiencia prolongada que erosiona márgenes'
    },
    
    inherentStrengths: [
      'Physical channel provides fallback during digital outages',
      'Diverse revenue streams reduce single point failures',
      'Customer data often distributed across systems',
      'Established fraud detection from retail experience'
    ],
    
    fatalFlaws: [
      'Integration between channels creates vulnerabilities',
      'Legacy POS systems often unpatched',
      'Seasonal peaks (Buen Fin, Hot Sale) strain security',
      'Omnichannel complexity increases attack surface'
    ],
    
    typicalAttacks: [
      {
        vector: 'POS malware',
        method: 'RAM scraping on payment terminals',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'E-commerce skimming',
        method: 'Magecart attacks on online stores',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'Supply chain',
        method: 'Compromising inventory/logistics systems',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'TARGETED'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(12),
      description: 'Can shift to physical operations but with reduced capacity'
    },
    
    exampleCompanies: [
      {
        name: 'Liverpool',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'Walmart México',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'Coppel',
        region: 'LATAM',
        size: 'ENTERPRISE'
      }
    ]
  },
  
  2: {
    id: 2,
    name: 'SOFTWARE_CRITICO',
    description: 'Critical Software - SaaS and cloud solutions essential for business operations',
    
    diiBase: {
      min: 40,
      max: 90,
      avg: 70
    },
    
    inherentStrengths: [
      'Security directly impacts revenue retention',
      'Cloud-native architecture enables rapid patching',
      'Continuous deployment allows quick fixes',
      'SOC2/ISO compliance common baseline'
    ],
    
    fatalFlaws: [
      'Downtime immediately visible to all customers',
      'Multi-tenant risks from shared infrastructure',
      'API security critical but often weak',
      'Customer churn accelerates after incidents'
    ],
    
    typicalAttacks: [
      {
        vector: 'API exploitation',
        method: 'Authentication bypass, data leakage',
        frequency: 'VERY_COMMON',
        impact: 'CRITICAL',
        sophistication: 'TARGETED'
      },
      {
        vector: 'Supply chain',
        method: 'Dependency confusion, malicious packages',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'ADVANCED'
      },
      {
        vector: 'Account takeover',
        method: 'Credential stuffing on admin accounts',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'COMMODITY'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(2),
      description: 'SLA violations trigger penalties within hours'
    },
    
    exampleCompanies: [
      {
        name: 'Kavak (platform infrastructure)',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'Kueski',
        region: 'LATAM',
        size: 'MID_MARKET'
      },
      {
        name: 'ContPAQi',
        region: 'LATAM',
        size: 'ENTERPRISE'
      }
    ]
  },
  
  3: {
    id: 3,
    name: 'SERVICIOS_DATOS',
    description: 'Data Services - Companies monetizing data collection, analysis, or insights',
    
    diiBase: {
      min: 30,
      max: 75,
      avg: 50
    },
    
    inherentStrengths: [
      'Data governance maturity from business model',
      'Analytics capability aids threat detection',
      'Segmentation practices limit breach scope',
      'Privacy regulations drive security investment'
    ],
    
    fatalFlaws: [
      'Data concentration creates honeypot effect',
      'Privacy law violations trigger massive fines',
      'Trust loss impacts all data collection',
      'Insider threats have catastrophic potential'
    ],
    
    typicalAttacks: [
      {
        vector: 'Data exfiltration',
        method: 'APT campaigns targeting databases',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'ADVANCED'
      },
      {
        vector: 'Insider threat',
        method: 'Employees selling data access',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'TARGETED'
      },
      {
        vector: 'API abuse',
        method: 'Mass scraping through public endpoints',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'COMMODITY'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(0),
      description: 'Data breach impact is immediate and irreversible'
    },
    
    exampleCompanies: [
      {
        name: 'Dun & Bradstreet',
        region: 'GLOBAL',
        size: 'ENTERPRISE'
      },
      {
        name: 'Nielsen México',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'Buró de Crédito',
        region: 'LATAM',
        size: 'ENTERPRISE'
      }
    ]
  },
  
  4: {
    id: 4,
    name: 'ECOSISTEMA_DIGITAL',
    description: 'Digital Ecosystem - Multi-sided platforms connecting users, vendors, or services',
    
    diiBase: {
      min: 35,
      max: 85,
      avg: 65
    },
    
    inherentStrengths: [
      'Network effects provide breach resilience',
      'Platform monitoring catches many attacks',
      'Diverse participants share security burden',
      'Scale justifies security investment'
    ],
    
    fatalFlaws: [
      'Third-party vulnerabilities impact entire platform',
      'Complex permission models create gaps',
      'Reputation contagion from participant breaches',
      'API security critical for ecosystem health'
    ],
    
    typicalAttacks: [
      {
        vector: 'Malicious apps/integrations',
        method: 'Fake services targeting platform users',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'OAuth abuse',
        method: 'Exploiting integration permissions',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      },
      {
        vector: 'Supply chain',
        method: 'Compromising popular platform plugins',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'ADVANCED'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(8),
      description: 'Network effects buffer short outages but trust erodes quickly'
    },
    
    exampleCompanies: [
      {
        name: 'Aeroméxico (booking ecosystem)',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'Rappi',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'MercadoLibre',
        region: 'LATAM',
        size: 'ENTERPRISE'
      }
    ]
  },
  
  5: {
    id: 5,
    name: 'SERVICIOS_FINANCIEROS',
    description: 'Financial Services - Transaction processing, payments, and financial operations',
    
    diiBase: {
      min: 50,
      max: 95,
      avg: 75
    },
    
    inherentStrengths: [
      'Regulatory compliance drives security maturity',
      'Fraud detection infrastructure aids defense',
      'Transaction monitoring catches anomalies',
      'Security directly tied to license retention'
    ],
    
    fatalFlaws: [
      'Zero tolerance for transaction errors',
      'Regulatory fines can exceed breach costs',
      'Real-time operations allow no downtime',
      'Financial data attracts nation-state actors'
    ],
    
    typicalAttacks: [
      {
        vector: 'ATM/POS malware',
        method: 'Jackpotting and transaction manipulation',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'TARGETED'
      },
      {
        vector: 'SWIFT/wire fraud',
        method: 'Business email compromise for transfers',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'TARGETED'
      },
      {
        vector: 'Web app attacks',
        method: 'SQL injection on banking portals',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'COMMODITY'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(0),
      description: 'Financial operations require 24/7 availability'
    },
    
    exampleCompanies: [
      {
        name: 'BBVA México',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'Banorte',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'OXXO Pay',
        region: 'LATAM',
        size: 'ENTERPRISE'
      }
    ]
  },
  
  6: {
    id: 6,
    name: 'INFRAESTRUCTURA_HEREDADA',
    description: 'Legacy Infrastructure - Traditional systems with digital transformation layers',
    
    diiBase: {
      min: 20,
      max: 60,
      avg: 35
    },
    
    inherentStrengths: [
      'Air-gapped systems provide some isolation',
      'Institutional knowledge of system quirks',
      'Change control processes slow attacks',
      'Physical security often mature'
    ],
    
    fatalFlaws: [
      'Unpatched systems with known vulnerabilities',
      'Digital transformation creates hybrid risks',
      'Limited security talent for legacy systems',
      'Incident response hampered by system age'
    ],
    
    typicalAttacks: [
      {
        vector: 'Ransomware',
        method: 'Exploiting unpatched legacy systems',
        frequency: 'VERY_COMMON',
        impact: 'CRITICAL',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'Living off the land',
        method: 'Using legitimate tools for persistence',
        frequency: 'COMMON',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      },
      {
        vector: 'Physical access',
        method: 'USB/insider threats on air-gapped systems',
        frequency: 'OCCASIONAL',
        impact: 'CRITICAL',
        sophistication: 'TARGETED'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(96),
      description: 'Manual processes can sustain short-term but inefficiently'
    },
    
    exampleCompanies: [
      {
        name: 'Pemex',
        region: 'LATAM',
        size: 'ENTERPRISE',
        breachHistory: [{
          year: 2019,
          impact: 'Ransomware affected 5% of computers',
          recovered: true
        }]
      },
      {
        name: 'CFE',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'Telmex',
        region: 'LATAM',
        size: 'ENTERPRISE'
      }
    ]
  },
  
  7: {
    id: 7,
    name: 'CADENA_SUMINISTRO',
    description: 'Supply Chain - Logistics and operations with digital tracking and optimization',
    
    diiBase: {
      min: 30,
      max: 70,
      avg: 48
    },
    
    inherentStrengths: [
      'Redundancy built into logistics networks',
      'Real-time monitoring aids incident detection',
      'Partner diversity reduces single points',
      'Physical operations provide some buffer'
    ],
    
    fatalFlaws: [
      'Third-party integration vulnerabilities',
      'IoT/tracking devices expand attack surface',
      'Just-in-time operations lack buffers',
      'Cascading failures across supply network'
    ],
    
    typicalAttacks: [
      {
        vector: 'GPS/tracking manipulation',
        method: 'Cargo theft through system compromise',
        frequency: 'COMMON',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      },
      {
        vector: 'Partner compromise',
        method: 'Using supplier access to infiltrate',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      },
      {
        vector: 'Ransomware',
        method: 'Disrupting logistics coordination systems',
        frequency: 'VERY_COMMON',
        impact: 'CRITICAL',
        sophistication: 'COMMODITY'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(24),
      description: 'Inventory buffers provide day of operations'
    },
    
    exampleCompanies: [
      {
        name: 'DHL México',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'Grupo TMM',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'FEMSA Logística',
        region: 'LATAM',
        size: 'ENTERPRISE'
      }
    ]
  },
  
  8: {
    id: 8,
    name: 'INFORMACION_REGULADA',
    description: 'Regulated Information - Healthcare, government, and sensitive data handlers',
    
    diiBase: {
      min: 40,
      max: 85,
      avg: 60
    },
    
    inherentStrengths: [
      'Compliance requirements drive baseline security',
      'Audit processes catch many vulnerabilities',
      'Data classification practices mature',
      'Incident response plans mandatory'
    ],
    
    fatalFlaws: [
      'Compliance theater vs actual security',
      'Legacy medical/government systems',
      'Nation-state interest in sensitive data',
      'Regulatory penalties can be existential'
    ],
    
    typicalAttacks: [
      {
        vector: 'Ransomware',
        method: 'Targeting healthcare for quick payment',
        frequency: 'VERY_COMMON',
        impact: 'CRITICAL',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'Nation-state espionage',
        method: 'APT campaigns for sensitive data',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'ADVANCED'
      },
      {
        vector: 'Insider threat',
        method: 'Employees selling patient/citizen data',
        frequency: 'COMMON',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(4),
      description: 'Healthcare/emergency services require rapid recovery'
    },
    
    exampleCompanies: [
      {
        name: 'IMSS',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'Hospital Angeles',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'SAT (tax authority)',
        region: 'LATAM',
        size: 'ENTERPRISE'
      }
    ]
  }
};

// Export mapping helper for backward compatibility
export const mapLegacyToDIIModel = (legacyModel: string): keyof typeof DII_MODEL_PROFILES => {
  const mapping: Record<string, BusinessModelId> = {
    'SUBSCRIPTION_BASED': 2,      // → SOFTWARE_CRITICO
    'TRANSACTION_BASED': 5,       // → SERVICIOS_FINANCIEROS
    'ASSET_LIGHT': 2,            // → SOFTWARE_CRITICO
    'ASSET_HEAVY': 6,            // → INFRAESTRUCTURA_HEREDADA
    'DATA_DRIVEN': 3,            // → SERVICIOS_DATOS
    'PLATFORM_ECOSYSTEM': 4,      // → ECOSISTEMA_DIGITAL
    'DIRECT_TO_CONSUMER': 1,      // → COMERCIO_HIBRIDO
    'B2B_ENTERPRISE': 6          // → INFRAESTRUCTURA_HEREDADA
  };
  
  return mapping[legacyModel] || 1;
};