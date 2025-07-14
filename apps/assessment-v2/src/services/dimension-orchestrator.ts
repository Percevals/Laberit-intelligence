import type { 
  DIIDimension, 
  BusinessModelId,
  DimensionResponse 
} from '@/store/dii-dimensions-store';

export interface DimensionPriority {
  dimension: DIIDimension;
  priority: number; // 1-5, 1 being highest
  rationale: string;
  estimatedMinutes: number;
}

export interface DimensionTransition {
  from: DIIDimension;
  to: DIIDimension;
  transitionText: string;
  correlationHint: string;
}

export interface OrchestrationResult {
  recommendedOrder: DIIDimension[];
  priorities: DimensionPriority[];
  estimatedTotalMinutes: number;
  adaptiveReason?: string;
}

export interface SkipRecommendation {
  dimension: DIIDimension;
  suggestedValue: number;
  suggestedMetric: number;
  confidence: number; // 0-100
  rationale: string;
}

// Business model dimension priorities
const BUSINESS_MODEL_PRIORITIES: Record<BusinessModelId, DimensionPriority[]> = {
  1: [ // COMERCIO_HIBRIDO
    { dimension: 'TRD', priority: 1, rationale: 'Physical/digital revenue streams need protection', estimatedMinutes: 2 },
    { dimension: 'BRI', priority: 2, rationale: 'Omnichannel systems create wide exposure', estimatedMinutes: 2 },
    { dimension: 'HFP', priority: 3, rationale: 'Staff across channels need security awareness', estimatedMinutes: 1 },
    { dimension: 'RRG', priority: 4, rationale: 'Complex recovery with dual operations', estimatedMinutes: 2 },
    { dimension: 'AER', priority: 5, rationale: 'Customer data attracts attackers', estimatedMinutes: 1 }
  ],
  2: [ // SOFTWARE_CRITICO
    { dimension: 'TRD', priority: 1, rationale: 'Zero downtime expectation for critical systems', estimatedMinutes: 2 },
    { dimension: 'RRG', priority: 2, rationale: 'Recovery speed is business survival', estimatedMinutes: 2 },
    { dimension: 'AER', priority: 3, rationale: 'IP and code are high-value targets', estimatedMinutes: 1 },
    { dimension: 'BRI', priority: 4, rationale: 'Microservices limit blast radius', estimatedMinutes: 2 },
    { dimension: 'HFP', priority: 5, rationale: 'Technical teams often security-aware', estimatedMinutes: 1 }
  ],
  3: [ // SERVICIOS_DATOS
    { dimension: 'AER', priority: 1, rationale: 'Data is your primary asset and target', estimatedMinutes: 2 },
    { dimension: 'BRI', priority: 2, rationale: 'Data lakes create massive exposure', estimatedMinutes: 2 },
    { dimension: 'HFP', priority: 3, rationale: 'Insider threats to data access', estimatedMinutes: 1 },
    { dimension: 'TRD', priority: 4, rationale: 'Data services have some buffer time', estimatedMinutes: 1 },
    { dimension: 'RRG', priority: 5, rationale: 'Data recovery complexity is high', estimatedMinutes: 2 }
  ],
  4: [ // ECOSISTEMA_DIGITAL
    { dimension: 'BRI', priority: 1, rationale: 'Interconnected systems amplify breaches', estimatedMinutes: 2 },
    { dimension: 'AER', priority: 2, rationale: 'Ecosystem data is extremely valuable', estimatedMinutes: 2 },
    { dimension: 'TRD', priority: 3, rationale: 'Network effects mean fast revenue impact', estimatedMinutes: 1 },
    { dimension: 'HFP', priority: 4, rationale: 'Many touchpoints increase human risk', estimatedMinutes: 1 },
    { dimension: 'RRG', priority: 5, rationale: 'Ecosystem recovery is complex', estimatedMinutes: 2 }
  ],
  5: [ // SERVICIOS_FINANCIEROS
    { dimension: 'TRD', priority: 1, rationale: 'Financial operations cannot stop', estimatedMinutes: 2 },
    { dimension: 'AER', priority: 2, rationale: 'Financial data is maximum value target', estimatedMinutes: 2 },
    { dimension: 'HFP', priority: 3, rationale: 'Social engineering targets finance heavily', estimatedMinutes: 1 },
    { dimension: 'RRG', priority: 4, rationale: 'Regulatory recovery requirements', estimatedMinutes: 2 },
    { dimension: 'BRI', priority: 5, rationale: 'Segmentation is regulatory requirement', estimatedMinutes: 1 }
  ],
  6: [ // INFRAESTRUCTURA_HEREDADA
    { dimension: 'BRI', priority: 1, rationale: 'Legacy systems often fully connected', estimatedMinutes: 2 },
    { dimension: 'RRG', priority: 2, rationale: 'Legacy recovery is slow and manual', estimatedMinutes: 2 },
    { dimension: 'HFP', priority: 3, rationale: 'Older workforce may lack security training', estimatedMinutes: 1 },
    { dimension: 'TRD', priority: 4, rationale: 'Some operational buffer exists', estimatedMinutes: 1 },
    { dimension: 'AER', priority: 5, rationale: 'Legacy data less structured/valuable', estimatedMinutes: 2 }
  ],
  7: [ // CADENA_SUMINISTRO
    { dimension: 'BRI', priority: 1, rationale: 'Supply chain creates cascade failures', estimatedMinutes: 2 },
    { dimension: 'TRD', priority: 2, rationale: 'Just-in-time means no buffer', estimatedMinutes: 2 },
    { dimension: 'RRG', priority: 3, rationale: 'Multi-party recovery coordination', estimatedMinutes: 2 },
    { dimension: 'AER', priority: 4, rationale: 'Supplier data and logistics valuable', estimatedMinutes: 1 },
    { dimension: 'HFP', priority: 5, rationale: 'Third-party human risks', estimatedMinutes: 1 }
  ],
  8: [ // INFORMACION_REGULADA
    { dimension: 'AER', priority: 1, rationale: 'Regulated data is high-value target', estimatedMinutes: 2 },
    { dimension: 'HFP', priority: 2, rationale: 'Compliance requires human vigilance', estimatedMinutes: 1 },
    { dimension: 'RRG', priority: 3, rationale: 'Regulatory recovery timelines', estimatedMinutes: 2 },
    { dimension: 'BRI', priority: 4, rationale: 'Compliance requires segmentation', estimatedMinutes: 2 },
    { dimension: 'TRD', priority: 5, rationale: 'Some regulatory grace periods', estimatedMinutes: 1 }
  ]
};

// Adaptive rules based on extreme scores
const ADAPTIVE_RULES: Array<{
  condition: (responses: Partial<Record<DIIDimension, DimensionResponse>>) => boolean;
  adjustment: (current: DIIDimension[], responses: Partial<Record<DIIDimension, DimensionResponse>>) => { order: DIIDimension[]; reason: string };
}> = [
  {
    // Very fast revenue loss (TRD <= 6 hours) prioritizes recovery
    condition: (responses) => {
      const trd = responses.TRD;
      return trd !== undefined && trd.metricValue <= 6;
    },
    adjustment: (current, _responses) => {
      const rrgIndex = current.indexOf('RRG');
      if (rrgIndex > 1) {
        const adjusted = [...current];
        adjusted.splice(rrgIndex, 1);
        adjusted.splice(1, 0, 'RRG');
        return {
          order: adjusted,
          reason: 'Your rapid revenue loss (≤6 hours) makes recovery speed critical. Assessing RRG next.'
        };
      }
      return { order: current, reason: '' };
    }
  },
  {
    // High attack value (AER >= $1M) prioritizes human defenses
    condition: (responses) => {
      const aer = responses.AER;
      return aer !== undefined && aer.metricValue >= 1000000;
    },
    adjustment: (current, responses) => {
      const hfpIndex = current.indexOf('HFP');
      const nextIndex = Object.keys(responses).length + 1;
      if (hfpIndex > nextIndex) {
        const adjusted = [...current];
        adjusted.splice(hfpIndex, 1);
        adjusted.splice(nextIndex, 0, 'HFP');
        return {
          order: adjusted,
          reason: 'High-value target ($1M+) makes human defenses crucial. Checking HFP next.'
        };
      }
      return { order: current, reason: '' };
    }
  },
  {
    // Wide blast radius (BRI >= 70%) prioritizes understanding recovery complexity
    condition: (responses) => {
      const bri = responses.BRI;
      return bri !== undefined && bri.metricValue >= 70;
    },
    adjustment: (current, responses) => {
      const rrgIndex = current.indexOf('RRG');
      const nextIndex = Object.keys(responses).length + 1;
      if (rrgIndex > nextIndex) {
        const adjusted = [...current];
        adjusted.splice(rrgIndex, 1);
        adjusted.splice(nextIndex, 0, 'RRG');
        return {
          order: adjusted,
          reason: 'Wide blast radius (70%+) makes recovery complexity critical. Evaluating RRG next.'
        };
      }
      return { order: current, reason: '' };
    }
  },
  {
    // Poor human defenses (HFP >= 40%) prioritizes understanding attack economics
    condition: (responses) => {
      const hfp = responses.HFP;
      return hfp !== undefined && hfp.metricValue >= 40;
    },
    adjustment: (current, responses) => {
      const aerIndex = current.indexOf('AER');
      const nextIndex = Object.keys(responses).length + 1;
      if (aerIndex > nextIndex) {
        const adjusted = [...current];
        adjusted.splice(aerIndex, 1);
        adjusted.splice(nextIndex, 0, 'AER');
        return {
          order: adjusted,
          reason: 'High human vulnerability (40%+) makes you an easy target. Checking attack value next.'
        };
      }
      return { order: current, reason: '' };
    }
  }
];

// Dimension transition messages
const DIMENSION_TRANSITIONS: Record<string, DimensionTransition> = {
  'TRD-AER': {
    from: 'TRD',
    to: 'AER',
    transitionText: 'Now let\'s see what attackers could gain',
    correlationHint: 'Fast revenue loss makes you a time-sensitive target'
  },
  'TRD-RRG': {
    from: 'TRD',
    to: 'RRG',
    transitionText: 'Critical: Can you recover before revenue collapses?',
    correlationHint: 'Your short revenue window demands fast recovery'
  },
  'AER-HFP': {
    from: 'AER',
    to: 'HFP',
    transitionText: 'High-value targets need strong human defenses',
    correlationHint: 'Valuable assets attract sophisticated social engineering'
  },
  'BRI-RRG': {
    from: 'BRI',
    to: 'RRG',
    transitionText: 'Wide damage means complex recovery',
    correlationHint: 'Restoring many systems multiplies recovery time'
  },
  'HFP-BRI': {
    from: 'HFP',
    to: 'BRI',
    transitionText: 'Let\'s see how far human errors can spread',
    correlationHint: 'Human mistakes can cascade through connected systems'
  }
};

// Smart skip recommendations based on correlations
const SKIP_CORRELATIONS: Array<{
  known: DIIDimension[];
  predict: DIIDimension;
  formula: (responses: Partial<Record<DIIDimension, DimensionResponse>>) => SkipRecommendation;
}> = [
  {
    known: ['TRD', 'BRI', 'HFP'],
    predict: 'RRG',
    formula: (responses) => {
      const trd = responses.TRD?.metricValue || 24;
      const bri = responses.BRI?.metricValue || 50;
      const hfp = responses.HFP?.metricValue || 25;
      
      // Estimate RRG based on complexity factors
      let estimatedMultiplier = 2.0;
      if (trd <= 6) estimatedMultiplier += 1.0; // Pressure increases mistakes
      if (bri >= 70) estimatedMultiplier += 1.5; // Wide damage slows recovery
      if (hfp >= 40) estimatedMultiplier += 0.5; // Human errors during recovery
      
      return {
        dimension: 'RRG',
        suggestedValue: Math.min(5, Math.round(estimatedMultiplier)),
        suggestedMetric: estimatedMultiplier,
        confidence: 75,
        rationale: `Based on your ${trd}h revenue window, ${bri}% blast radius, and ${hfp}% human failure rate`
      };
    }
  },
  {
    known: ['AER', 'HFP'],
    predict: 'TRD',
    formula: (responses) => {
      const aer = responses.AER?.metricValue || 200000;
      const hfp = responses.HFP?.metricValue || 25;
      
      // High-value + vulnerable humans = fast targeting
      let estimatedHours = 24;
      if (aer >= 1000000 && hfp >= 30) estimatedHours = 6;
      else if (aer >= 500000) estimatedHours = 12;
      else if (aer <= 100000) estimatedHours = 48;
      
      return {
        dimension: 'TRD',
        suggestedValue: estimatedHours <= 6 ? 1 : estimatedHours <= 24 ? 2 : 3,
        suggestedMetric: estimatedHours,
        confidence: 65,
        rationale: `$${aer >= 1000000 ? (aer/1000000).toFixed(1) + 'M' : Math.round(aer/1000) + 'K'} value + ${hfp}% human vulnerability suggests rapid targeting`
      };
    }
  }
];

export class DimensionOrchestrator {
  /**
   * Get initial dimension order based on business model
   */
  static getInitialOrder(businessModelId: BusinessModelId): OrchestrationResult {
    const priorities = BUSINESS_MODEL_PRIORITIES[businessModelId];
    const recommendedOrder = priorities
      .sort((a, b) => a.priority - b.priority)
      .map(p => p.dimension);
    
    const estimatedTotalMinutes = priorities.reduce((sum, p) => sum + p.estimatedMinutes, 0);
    
    return {
      recommendedOrder,
      priorities,
      estimatedTotalMinutes
    };
  }

  /**
   * Adapt dimension order based on responses
   */
  static adaptOrder(
    currentOrder: DIIDimension[],
    responses: Partial<Record<DIIDimension, DimensionResponse>>,
    businessModelId: BusinessModelId
  ): OrchestrationResult {
    let adaptedOrder = [...currentOrder];
    let adaptiveReason = '';
    
    // Apply adaptive rules
    for (const rule of ADAPTIVE_RULES) {
      if (rule.condition(responses)) {
        const adjustment = rule.adjustment(adaptedOrder, responses);
        if (adjustment.reason) {
          adaptedOrder = adjustment.order;
          adaptiveReason = adjustment.reason;
          break; // Apply only the first matching rule
        }
      }
    }
    
    // Recalculate priorities based on new order
    const basePriorities = BUSINESS_MODEL_PRIORITIES[businessModelId];
    const priorities = adaptedOrder.map((dim, index) => {
      const base = basePriorities.find(p => p.dimension === dim)!;
      return { ...base, priority: index + 1 };
    });
    
    // Adjust time estimates based on answers so far
    const estimatedTotalMinutes = priorities.reduce((sum, p) => {
      const answered = responses[p.dimension];
      return sum + (answered ? 0 : p.estimatedMinutes);
    }, 0);
    
    return {
      recommendedOrder: adaptedOrder,
      priorities,
      estimatedTotalMinutes,
      adaptiveReason
    };
  }

  /**
   * Get transition message between dimensions
   */
  static getTransition(from: DIIDimension, to: DIIDimension): DimensionTransition | null {
    const key = `${from}-${to}`;
    return DIMENSION_TRANSITIONS[key] || null;
  }

  /**
   * Get smart skip recommendations
   */
  static getSkipRecommendations(
    responses: Partial<Record<DIIDimension, DimensionResponse>>,
    remainingDimensions: DIIDimension[]
  ): SkipRecommendation[] {
    const recommendations: SkipRecommendation[] = [];
    
    for (const correlation of SKIP_CORRELATIONS) {
      // Check if we have all required dimensions
      const hasRequired = correlation.known.every(dim => responses[dim]);
      const canPredict = remainingDimensions.includes(correlation.predict);
      
      if (hasRequired && canPredict) {
        recommendations.push(correlation.formula(responses));
      }
    }
    
    // Add low-confidence defaults for any remaining dimensions
    const highConfidenceDims = new Set(recommendations.map(r => r.dimension));
    for (const dim of remainingDimensions) {
      if (!highConfidenceDims.has(dim)) {
        recommendations.push(getDefaultSkipRecommendation(dim, responses));
      }
    }
    
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Estimate remaining time dynamically
   */
  static estimateRemainingTime(
    answeredDimensions: DIIDimension[],
    totalDimensions: DIIDimension[] = ['TRD', 'AER', 'HFP', 'BRI', 'RRG']
  ): { minutes: number; dimensionsLeft: number } {
    const dimensionsLeft = totalDimensions.length - answeredDimensions.length;
    
    // Adjust time based on how many answered (people get faster)
    const baseMinutesPerDimension = 1.5;
    const speedUpFactor = 0.9 ** answeredDimensions.length; // 10% faster each dimension
    const minutes = Math.ceil(dimensionsLeft * baseMinutesPerDimension * speedUpFactor);
    
    return { minutes, dimensionsLeft };
  }

  /**
   * Get correlation hints for current state
   */
  static getCorrelationHints(
    responses: Partial<Record<DIIDimension, DimensionResponse>>
  ): string[] {
    const hints: string[] = [];
    
    // TRD + AER correlation
    if (responses.TRD && responses.AER) {
      const trd = responses.TRD.metricValue;
      const aer = responses.AER.metricValue;
      if (trd <= 12 && aer >= 500000) {
        hints.push('⚠️ Critical: Fast revenue loss + high value = prime ransomware target');
      }
    }
    
    // HFP + BRI correlation
    if (responses.HFP && responses.BRI) {
      const hfp = responses.HFP.metricValue;
      const bri = responses.BRI.metricValue;
      if (hfp >= 30 && bri >= 60) {
        hints.push('🔗 Human errors will cascade across your connected systems');
      }
    }
    
    // BRI + RRG correlation
    if (responses.BRI && responses.RRG) {
      const bri = responses.BRI.metricValue;
      const rrg = responses.RRG.metricValue;
      if (bri >= 70 && rrg >= 3) {
        hints.push('🚨 Wide damage + slow recovery = potential business failure');
      }
    }
    
    return hints;
  }
}

// Helper function for default skip recommendations
function getDefaultSkipRecommendation(
  dimension: DIIDimension,
  _responses: Partial<Record<DIIDimension, DimensionResponse>>
): SkipRecommendation {
  // Use industry averages as defaults
  const defaults: Record<DIIDimension, { value: number; metric: number }> = {
    TRD: { value: 3, metric: 24 },
    AER: { value: 3, metric: 200000 },
    HFP: { value: 3, metric: 25 },
    BRI: { value: 3, metric: 50 },
    RRG: { value: 3, metric: 2.5 }
  };
  
  const def = defaults[dimension];
  return {
    dimension,
    suggestedValue: def.value,
    suggestedMetric: def.metric,
    confidence: 40,
    rationale: 'Industry average estimate (low confidence)'
  };
}