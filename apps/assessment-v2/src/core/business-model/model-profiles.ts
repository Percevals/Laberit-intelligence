/**
 * Business Model Profiles
 * Based on 150+ real assessments and breach data
 */

import type { ModelProfile, BusinessModelId } from '@core/types/business-model.types';
import { Hours } from '@core/types/brand.types';

// Legacy profiles - kept for backwards compatibility
export const LEGACY_MODEL_PROFILES: Record<BusinessModelId, ModelProfile> = {
  1: {
    id: 1,
    name: 'SUBSCRIPTION_BASED',
    description: 'Recurring revenue through subscriptions (SaaS, streaming, memberships)',
    
    diiBase: {
      min: 35,
      max: 85,
      avg: 62
    },
    
    inherentStrengths: [
      'Predictable revenue enables security investment',
      'Customer data centralization simplifies protection',
      'Cloud-native often means better baseline security',
      'Continuous updates allow rapid patching'
    ],
    
    fatalFlaws: [
      'Mass customer exodus risk from breaches',
      'Availability is existential - downtime = churn',
      'Credential stuffing targets subscription accounts',
      'Data concentration creates honeypot effect'
    ],
    
    typicalAttacks: [
      {
        vector: 'Credential stuffing',
        method: 'Automated account takeover attempts',
        frequency: 'VERY_COMMON',
        impact: 'MEDIUM',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'API abuse',
        method: 'Exploiting public APIs for data extraction',
        frequency: 'COMMON',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      },
      {
        vector: 'Supply chain',
        method: 'Compromising integration partners',
        frequency: 'OCCASIONAL',
        impact: 'CRITICAL',
        sophistication: 'ADVANCED'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(4),
      description: 'Customers expect 99.9% uptime, tolerance measured in hours'
    },
    
    exampleCompanies: [
      {
        name: 'Netflix',
        region: 'GLOBAL',
        size: 'ENTERPRISE',
        breachHistory: [{
          year: 2020,
          impact: 'Credential stuffing affected 0.1% of users',
          recovered: true
        }]
      },
      {
        name: 'Spotify',
        region: 'GLOBAL',
        size: 'ENTERPRISE'
      },
      {
        name: 'Salesforce',
        region: 'GLOBAL',
        size: 'ENTERPRISE'
      }
    ]
  },
  
  2: {
    id: 2,
    name: 'TRANSACTION_BASED',
    description: 'Revenue per transaction (payments, marketplaces, exchanges)',
    
    diiBase: {
      min: 40,
      max: 90,
      avg: 70
    },
    
    inherentStrengths: [
      'Security directly tied to revenue - strong incentive',
      'Regulatory compliance drives baseline controls',
      'Transaction monitoring creates breach detection',
      'Fraud prevention infrastructure aids security'
    ],
    
    fatalFlaws: [
      'Real-time availability critical - no buffer',
      'Financial data attracts sophisticated attackers',
      'Trust loss immediately impacts transaction volume',
      'Regulatory fines can exceed breach costs'
    ],
    
    typicalAttacks: [
      {
        vector: 'Web application attacks',
        method: 'SQL injection, XSS targeting payment flows',
        frequency: 'VERY_COMMON',
        impact: 'CRITICAL',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'Man-in-the-middle',
        method: 'Intercepting transaction data',
        frequency: 'COMMON',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      },
      {
        vector: 'Insider threat',
        method: 'Employees manipulating transactions',
        frequency: 'OCCASIONAL',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(1),
      description: 'Zero tolerance for transaction processing downtime'
    },
    
    exampleCompanies: [
      {
        name: 'PayPal',
        region: 'GLOBAL',
        size: 'ENTERPRISE'
      },
      {
        name: 'Mercado Pago',
        region: 'LATAM',
        size: 'ENTERPRISE'
      },
      {
        name: 'Square',
        region: 'US',
        size: 'ENTERPRISE'
      }
    ]
  },
  
  3: {
    id: 3,
    name: 'ASSET_LIGHT',
    description: 'Minimal physical assets (consulting, software, services)',
    
    diiBase: {
      min: 25,
      max: 75,
      avg: 50
    },
    
    inherentStrengths: [
      'Agile infrastructure enables quick pivots',
      'Limited physical attack surface',
      'Can operate fully remote if needed',
      'Lower capital at risk from disruption'
    ],
    
    fatalFlaws: [
      'Often weak security due to cost focus',
      'Intellectual property is entire value',
      'Client data breach impacts all contracts',
      'Reputation damage is existential'
    ],
    
    typicalAttacks: [
      {
        vector: 'Phishing',
        method: 'Targeting consultants for client access',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'Cloud misconfiguration',
        method: 'Exposed S3 buckets, databases',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'Supply chain',
        method: 'Compromising development tools',
        frequency: 'OCCASIONAL',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(24),
      description: 'Can survive short outages but client patience limited'
    },
    
    exampleCompanies: [
      {
        name: 'Accenture',
        region: 'GLOBAL',
        size: 'ENTERPRISE',
        breachHistory: [{
          year: 2021,
          impact: 'LockBit ransomware, client data exposed',
          recovered: true
        }]
      },
      {
        name: 'Local IT consultancies',
        region: 'LATAM',
        size: 'SMB'
      }
    ]
  },
  
  4: {
    id: 4,
    name: 'ASSET_HEAVY',
    description: 'Significant physical infrastructure (manufacturing, logistics)',
    
    diiBase: {
      min: 30,
      max: 70,
      avg: 45
    },
    
    inherentStrengths: [
      'Physical redundancy provides some resilience',
      'OT/IT separation can limit blast radius',
      'Established business continuity practices',
      'Insurance often covers cyber incidents'
    ],
    
    fatalFlaws: [
      'Cyber-physical attacks can halt production',
      'Legacy systems with unpatched vulnerabilities',
      'Complex supply chain creates many entry points',
      'Recovery requires physical intervention'
    ],
    
    typicalAttacks: [
      {
        vector: 'Ransomware',
        method: 'Targeting production systems',
        frequency: 'VERY_COMMON',
        impact: 'CRITICAL',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'Industrial espionage',
        method: 'Stealing manufacturing IP',
        frequency: 'COMMON',
        impact: 'HIGH',
        sophistication: 'ADVANCED'
      },
      {
        vector: 'Supply chain',
        method: 'Compromising vendor management systems',
        frequency: 'COMMON',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(72),
      description: 'Physical operations can run briefly without IT'
    },
    
    exampleCompanies: [
      {
        name: 'Colonial Pipeline',
        region: 'US',
        size: 'ENTERPRISE',
        breachHistory: [{
          year: 2021,
          impact: 'Ransomware shut down operations for 6 days',
          recovered: true
        }]
      },
      {
        name: 'JBS Foods',
        region: 'GLOBAL',
        size: 'ENTERPRISE',
        breachHistory: [{
          year: 2021,
          impact: 'Ransomware, $11M paid, operations halted',
          recovered: true
        }]
      }
    ]
  },
  
  5: {
    id: 5,
    name: 'DATA_DRIVEN',
    description: 'Data as primary value (analytics, advertising, research)',
    
    diiBase: {
      min: 35,
      max: 80,
      avg: 55
    },
    
    inherentStrengths: [
      'Data governance often mature',
      'Analytics can detect anomalies',
      'Compliance drives security investment',
      'Segmentation practices limit exposure'
    ],
    
    fatalFlaws: [
      'Data breaches trigger massive fines',
      'Privacy laws threaten business model',
      'Honeypot for nation-state actors',
      'Trust loss is nearly irreversible'
    ],
    
    typicalAttacks: [
      {
        vector: 'Advanced persistent threats',
        method: 'Long-term data exfiltration campaigns',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'ADVANCED'
      },
      {
        vector: 'Insider threats',
        method: 'Employees selling data access',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'TARGETED'
      },
      {
        vector: 'API exploitation',
        method: 'Mass data scraping through APIs',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'COMMODITY'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(0),
      description: 'Data breach impact is immediate and permanent'
    },
    
    exampleCompanies: [
      {
        name: 'Facebook/Meta',
        region: 'GLOBAL',
        size: 'ENTERPRISE',
        breachHistory: [{
          year: 2021,
          impact: '530M user records scraped and leaked',
          recovered: false
        }]
      },
      {
        name: 'Equifax',
        region: 'US',
        size: 'ENTERPRISE',
        breachHistory: [{
          year: 2017,
          impact: '147M records, $1.4B in costs',
          recovered: false
        }]
      }
    ]
  },
  
  6: {
    id: 6,
    name: 'PLATFORM_ECOSYSTEM',
    description: 'Multi-sided platforms (app stores, marketplaces, social)',
    
    diiBase: {
      min: 40,
      max: 85,
      avg: 65
    },
    
    inherentStrengths: [
      'Network effects provide resilience',
      'Diverse revenue streams reduce single points',
      'Platform monitoring catches many attacks',
      'Community can help identify threats'
    ],
    
    fatalFlaws: [
      'Third-party vulnerabilities impact platform',
      'Reputation contagion from partner breaches',
      'Complex permission models create gaps',
      'Scale makes comprehensive security hard'
    ],
    
    typicalAttacks: [
      {
        vector: 'Supply chain',
        method: 'Compromising popular platform apps/plugins',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'ADVANCED'
      },
      {
        vector: 'OAuth/API abuse',
        method: 'Exploiting integration permissions',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      },
      {
        vector: 'Fake apps/stores',
        method: 'Malicious apps targeting platform users',
        frequency: 'VERY_COMMON',
        impact: 'MEDIUM',
        sophistication: 'COMMODITY'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(12),
      description: 'Platform network effects provide some buffer'
    },
    
    exampleCompanies: [
      {
        name: 'Apple App Store',
        region: 'GLOBAL',
        size: 'ENTERPRISE'
      },
      {
        name: 'Shopify',
        region: 'GLOBAL',
        size: 'ENTERPRISE'
      },
      {
        name: 'MercadoLibre',
        region: 'LATAM',
        size: 'ENTERPRISE'
      }
    ]
  },
  
  7: {
    id: 7,
    name: 'DIRECT_TO_CONSUMER',
    description: 'Direct sales to end users (e-commerce, retail)',
    
    diiBase: {
      min: 30,
      max: 75,
      avg: 52
    },
    
    inherentStrengths: [
      'Direct customer relationship aids recovery',
      'Payment security usually mature (PCI)',
      'Brand investment drives security spending',
      'Customer data value understood'
    ],
    
    fatalFlaws: [
      'Customer PII makes attractive target',
      'Cart abandonment from security friction',
      'Seasonal peaks strain defenses',
      'Margin pressure limits security budget'
    ],
    
    typicalAttacks: [
      {
        vector: 'E-skimming',
        method: 'JavaScript injection on payment pages',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'Credential stuffing',
        method: 'Automated account takeover for fraud',
        frequency: 'VERY_COMMON',
        impact: 'MEDIUM',
        sophistication: 'COMMODITY'
      },
      {
        vector: 'Supply chain',
        method: 'Compromising e-commerce platforms/plugins',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'TARGETED'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(8),
      description: 'Customer patience limited but some loyalty exists'
    },
    
    exampleCompanies: [
      {
        name: 'Target',
        region: 'US',
        size: 'ENTERPRISE',
        breachHistory: [{
          year: 2013,
          impact: '110M customers affected, $290M in costs',
          recovered: true
        }]
      },
      {
        name: 'Amazon',
        region: 'GLOBAL',
        size: 'ENTERPRISE'
      }
    ]
  },
  
  8: {
    id: 8,
    name: 'B2B_ENTERPRISE',
    description: 'Complex enterprise sales (software, services, solutions)',
    
    diiBase: {
      min: 45,
      max: 85,
      avg: 68
    },
    
    inherentStrengths: [
      'Enterprise clients demand security',
      'Contracts include security requirements',
      'Higher margins support security investment',
      'Longer relationships provide stability'
    ],
    
    fatalFlaws: [
      'One breach can lose multiple contracts',
      'Client data breach is catastrophic',
      'Complex integrations create vulnerabilities',
      'Sales cycles give time for reputation damage'
    ],
    
    typicalAttacks: [
      {
        vector: 'Spear phishing',
        method: 'Targeting employees with client access',
        frequency: 'VERY_COMMON',
        impact: 'HIGH',
        sophistication: 'TARGETED'
      },
      {
        vector: 'Supply chain',
        method: 'Using vendor as entry to client systems',
        frequency: 'COMMON',
        impact: 'CRITICAL',
        sophistication: 'ADVANCED'
      },
      {
        vector: 'Insider threat',
        method: 'Employees with privileged client access',
        frequency: 'OCCASIONAL',
        impact: 'CRITICAL',
        sophistication: 'TARGETED'
      }
    ],
    
    resilienceWindow: {
      hours: Hours(48),
      description: 'Enterprise SLAs provide some buffer but penalties apply'
    },
    
    exampleCompanies: [
      {
        name: 'SolarWinds',
        region: 'US',
        size: 'ENTERPRISE',
        breachHistory: [{
          year: 2020,
          impact: 'Supply chain attack affected 18,000 customers',
          recovered: false
        }]
      },
      {
        name: 'Oracle',
        region: 'GLOBAL',
        size: 'ENTERPRISE'
      }
    ]
  }
};

// Export DII-specific profiles as the default
export { DII_MODEL_PROFILES as MODEL_PROFILES } from './model-profiles-dii';