import type { 
  DIIDimension, 
  DimensionResponse, 
  BusinessModelId,
  DIICalculation 
} from '@/store/dii-dimensions-store';

export interface InsightRevelation {
  dimension: DIIDimension;
  headline: string; // Attention-grabbing headline
  businessImpact: string; // What this means in business terms
  peerComparison: {
    position: 'ahead' | 'behind' | 'average';
    percentile: number;
    message: string;
  };
  correlations: string[]; // Connections to other dimensions
  nextDimensionHint?: {
    dimension: DIIDimension;
    teaser: string;
  } | undefined;
  depthLevel: 1 | 2 | 3 | 4 | 5; // Based on dimensions answered
}

// Industry benchmarks by business model and dimension
const INDUSTRY_BENCHMARKS: Record<BusinessModelId, Record<DIIDimension, {
  p25: number; // 25th percentile (poor)
  p50: number; // 50th percentile (average)
  p75: number; // 75th percentile (good)
  p90: number; // 90th percentile (excellent)
}>> = {
  1: { // COMERCIO_HIBRIDO
    TRD: { p25: 4, p50: 12, p75: 24, p90: 48 },
    AER: { p25: 500000, p50: 200000, p75: 100000, p90: 50000 },
    HFP: { p25: 35, p50: 25, p75: 15, p90: 10 },
    BRI: { p25: 70, p50: 50, p75: 35, p90: 20 },
    RRG: { p25: 4.0, p50: 3.0, p75: 2.0, p90: 1.5 }
  },
  2: { // SOFTWARE_CRITICO
    TRD: { p25: 2, p50: 6, p75: 12, p90: 24 },
    AER: { p25: 1000000, p50: 400000, p75: 150000, p90: 75000 },
    HFP: { p25: 40, p50: 30, p75: 20, p90: 10 },
    BRI: { p25: 80, p50: 60, p75: 40, p90: 25 },
    RRG: { p25: 5.0, p50: 3.5, p75: 2.5, p90: 1.8 }
  },
  3: { // SERVICIOS_DATOS
    TRD: { p25: 6, p50: 18, p75: 36, p90: 72 },
    AER: { p25: 800000, p50: 350000, p75: 150000, p90: 60000 },
    HFP: { p25: 30, p50: 20, p75: 12, p90: 8 },
    BRI: { p25: 65, p50: 45, p75: 30, p90: 15 },
    RRG: { p25: 3.5, p50: 2.5, p75: 1.8, p90: 1.3 }
  },
  4: { // ECOSISTEMA_DIGITAL
    TRD: { p25: 3, p50: 8, p75: 16, p90: 32 },
    AER: { p25: 1200000, p50: 500000, p75: 200000, p90: 80000 },
    HFP: { p25: 45, p50: 35, p75: 25, p90: 15 },
    BRI: { p25: 85, p50: 70, p75: 50, p90: 30 },
    RRG: { p25: 6.0, p50: 4.0, p75: 2.8, p90: 2.0 }
  },
  5: { // SERVICIOS_FINANCIEROS
    TRD: { p25: 1, p50: 3, p75: 6, p90: 12 },
    AER: { p25: 2000000, p50: 800000, p75: 300000, p90: 100000 },
    HFP: { p25: 50, p50: 40, p75: 30, p90: 20 },
    BRI: { p25: 90, p50: 75, p75: 55, p90: 35 },
    RRG: { p25: 7.0, p50: 5.0, p75: 3.5, p90: 2.5 }
  },
  6: { // INFRAESTRUCTURA_HEREDADA
    TRD: { p25: 8, p50: 24, p75: 48, p90: 96 },
    AER: { p25: 300000, p50: 150000, p75: 75000, p90: 40000 },
    HFP: { p25: 25, p50: 18, p75: 10, p90: 5 },
    BRI: { p25: 60, p50: 40, p75: 25, p90: 12 },
    RRG: { p25: 3.0, p50: 2.2, p75: 1.5, p90: 1.1 }
  },
  7: { // CADENA_SUMINISTRO
    TRD: { p25: 4, p50: 10, p75: 20, p90: 40 },
    AER: { p25: 1500000, p50: 600000, p75: 250000, p90: 100000 },
    HFP: { p25: 38, p50: 28, p75: 18, p90: 12 },
    BRI: { p25: 75, p50: 55, p75: 38, p90: 22 },
    RRG: { p25: 5.5, p50: 3.8, p75: 2.6, p90: 1.9 }
  },
  8: { // INFORMACION_REGULADA
    TRD: { p25: 2, p50: 6, p75: 12, p90: 24 },
    AER: { p25: 1800000, p50: 700000, p75: 280000, p90: 110000 },
    HFP: { p25: 48, p50: 38, p75: 28, p90: 18 },
    BRI: { p25: 88, p50: 72, p75: 52, p90: 32 },
    RRG: { p25: 6.5, p50: 4.5, p75: 3.2, p90: 2.3 }
  }
};

// Business impact translations
const BUSINESS_IMPACTS: Record<DIIDimension, (value: number, model: BusinessModelId) => string> = {
  TRD: (hours, _model) => {
    if (hours <= 2) return `Critical operations would fail within ${hours} hours - faster than most ransomware attacks.`;
    if (hours <= 6) return `You'd lose 10% revenue in just ${hours} hours. That's $${getHourlyRevenueLoss(_model)} per hour of downtime.`;
    if (hours <= 24) return `A full day outage means significant customer defection risk. Most competitors recover faster.`;
    if (hours <= 72) return `Three days to revenue impact gives breathing room, but reputation damage starts after day one.`;
    return `Your revenue streams are well-protected, but don't get complacent about emerging threats.`;
  },
  AER: (value, _model) => {
    const millions = value >= 1000000;
    const amount = millions ? `$${(value/1000000).toFixed(1)}M` : `$${Math.round(value/1000)}K`;
    if (value >= 1000000) return `Attackers could extract ${amount} from your systems - you're a prime target for sophisticated groups.`;
    if (value >= 500000) return `${amount} potential loss makes you attractive to mid-tier cybercrime syndicates.`;
    if (value >= 200000) return `At ${amount} attack value, you're below the radar of major groups but still vulnerable to opportunists.`;
    if (value >= 50000) return `${amount} extraction potential means limited attacker interest, but automation makes everyone a target.`;
    return `Low attack value (${amount}) reduces threat actor motivation, but zero-day exploits don't discriminate.`;
  },
  HFP: (percentage, _model) => {
    if (percentage >= 40) return `${percentage}% phishing success rate means nearly half your team would fall for attacks. Major training needed.`;
    if (percentage >= 25) return `One in four employees (${percentage}%) failing security tests creates multiple breach vectors daily.`;
    if (percentage >= 15) return `${percentage}% failure rate is improving but still above industry standards. Focus on repeat offenders.`;
    if (percentage >= 8) return `Strong security culture with only ${percentage}% vulnerability. Consider advanced threat simulations.`;
    return `Excellent human firewall at ${percentage}% failure rate. Your team could mentor others.`;
  },
  BRI: (percentage, _model) => {
    const systems = getAffectedSystems(percentage, _model);
    if (percentage >= 70) return `A breach would impact ${percentage}% of systems (${systems}). Near-total business paralysis.`;
    if (percentage >= 50) return `Half your infrastructure (${percentage}%) at risk means ${systems} could go down simultaneously.`;
    if (percentage >= 30) return `${percentage}% blast radius limits damage but ${systems} is still significant downtime.`;
    if (percentage >= 15) return `Good isolation with only ${percentage}% exposure. Smart architecture protecting ${100-percentage}% of systems.`;
    return `Excellent segmentation! Only ${percentage}% blast radius shows defense-in-depth working.`;
  },
  RRG: (multiplier, _model) => {
    const realHours = Math.round(8 * multiplier); // Assuming 8-hour RTO
    if (multiplier >= 5.0) return `Recovery takes ${multiplier}x longer than planned (${realHours} hours vs 8). Disaster waiting to happen.`;
    if (multiplier >= 3.0) return `${multiplier}x gap means ${realHours}-hour recovery instead of 8. Customer SLAs at severe risk.`;
    if (multiplier >= 2.0) return `Moderate ${multiplier}x gap (${realHours} hours actual). Test scenarios don't match real incidents.`;
    if (multiplier >= 1.5) return `Small ${multiplier}x gap shows good planning. Regular drills keeping recovery realistic.`;
    return `Excellent ${multiplier}x factor! Your tested recovery times match reality. Industry-leading preparedness.`;
  }
};

// Correlation insights
const CORRELATIONS: Record<DIIDimension, (
  value: number, 
  otherDimensions: Partial<Record<DIIDimension, DimensionResponse>>,
  model: BusinessModelId
) => string[]> = {
  TRD: (hours, others, _model) => {
    const correlations: string[] = [];
    if (hours <= 6) {
      correlations.push("Fast revenue loss amplifies the importance of recovery speed - check your RRG next");
      if (others.BRI && others.BRI.metricValue > 50) {
        correlations.push("Combined with your high blast radius, a major incident could be catastrophic");
      }
    }
    if (hours <= 24 && others.HFP && others.HFP.metricValue > 30) {
      correlations.push("Quick revenue impact + high human failure rate = urgent need for automated defenses");
    }
    return correlations;
  },
  AER: (value, others, _model) => {
    const correlations: string[] = [];
    if (value >= 500000) {
      correlations.push("High attack value makes you a priority target - human defenses become critical");
      if (others.TRD && others.TRD.metricValue <= 12) {
        correlations.push("Fast revenue loss + high attack value = perfect storm for ransomware groups");
      }
    }
    if (value >= 200000 && others.BRI && others.BRI.metricValue > 60) {
      correlations.push("Valuable data across many systems increases both attack surface and potential losses");
    }
    return correlations;
  },
  HFP: (percentage, others, _model) => {
    const correlations: string[] = [];
    if (percentage >= 25) {
      correlations.push("High human vulnerability multiplies all other risks - people are your weakest link");
      if (others.AER && others.AER.metricValue >= 500000) {
        correlations.push("Valuable targets + vulnerable humans = social engineering paradise for attackers");
      }
    }
    if (percentage >= 20 && others.RRG && others.RRG.metricValue >= 3.0) {
      correlations.push("Human errors during recovery could extend your already slow restoration times");
    }
    return correlations;
  },
  BRI: (percentage, others, _model) => {
    const correlations: string[] = [];
    if (percentage >= 60) {
      correlations.push("Wide blast radius means recovery complexity skyrockets - check your RRG capability");
      if (others.TRD && others.TRD.metricValue <= 24) {
        correlations.push("Fast revenue impact across ${percentage}% of systems could trigger business continuity crisis");
      }
    }
    if (percentage >= 40 && others.HFP && others.HFP.metricValue >= 25) {
      correlations.push("Human mistakes in interconnected systems cascade into enterprise-wide incidents");
    }
    return correlations;
  },
  RRG: (multiplier, others, _model) => {
    const correlations: string[] = [];
    if (multiplier >= 3.0) {
      correlations.push("Slow recovery amplifies all other vulnerabilities - time is your enemy in incidents");
      if (others.TRD && others.TRD.metricValue <= 12) {
        correlations.push("Fast revenue loss + slow recovery = potential business extinction event");
      }
      if (others.BRI && others.BRI.metricValue >= 60) {
        correlations.push("Recovering ${others.BRI.metricValue}% of systems at ${multiplier}x planned time could take weeks");
      }
    }
    return correlations;
  }
};

// Next dimension hints
const NEXT_DIMENSION_HINTS: Record<DIIDimension, (
  currentValue: number,
  answeredDimensions: DIIDimension[],
  model: BusinessModelId
) => { dimension: DIIDimension; teaser: string } | undefined> = {
  TRD: (hours, answered, _model) => {
    if (!answered.includes('RRG')) {
      return {
        dimension: 'RRG',
        teaser: hours <= 12 
          ? "Your fast revenue loss makes recovery speed critical. How quickly can you really bounce back?"
          : "You have buffer time, but can you actually recover within that window?"
      };
    }
    if (!answered.includes('AER')) {
      return {
        dimension: 'AER',
        teaser: "Now let's see if you're valuable enough for attackers to target those revenue streams"
      };
    }
    return undefined;
  },
  AER: (value, answered, _model) => {
    if (!answered.includes('HFP')) {
      return {
        dimension: 'HFP',
        teaser: value >= 500000
          ? "High-value targets need strong human defenses. How susceptible is your team?"
          : "Even low-value targets fall to human tricks. What's your team's resistance?"
      };
    }
    if (!answered.includes('BRI')) {
      return {
        dimension: 'BRI',
        teaser: "Let's see how far an attack could spread through your systems"
      };
    }
    return undefined;
  },
  HFP: (percentage, answered, _model) => {
    if (!answered.includes('BRI')) {
      return {
        dimension: 'BRI',
        teaser: percentage >= 25
          ? "Human errors can cascade. How interconnected are your critical systems?"
          : "Your team is strong, but can system design contain the mistakes that do happen?"
      };
    }
    if (!answered.includes('AER')) {
      return {
        dimension: 'AER',
        teaser: "Let's see what attackers could gain by exploiting those human vulnerabilities"
      };
    }
    return undefined;
  },
  BRI: (percentage, answered, _model) => {
    if (!answered.includes('RRG')) {
      return {
        dimension: 'RRG',
        teaser: percentage >= 50
          ? "Wide blast radius means complex recovery. Can you restore all those systems quickly?"
          : "Good isolation helps, but how fast can you recover what does get hit?"
      };
    }
    if (!answered.includes('TRD')) {
      return {
        dimension: 'TRD',
        teaser: "Let's see how quickly this level of damage hits your bottom line"
      };
    }
    return undefined;
  },
  RRG: (multiplier, answered, _model) => {
    if (!answered.includes('TRD')) {
      return {
        dimension: 'TRD',
        teaser: multiplier >= 3.0
          ? "Slow recovery is costly. How fast does downtime hit your revenue?"
          : "Good recovery capability! Let's see how much time pressure you're under"
      };
    }
    if (!answered.includes('BRI')) {
      return {
        dimension: 'BRI',
        teaser: "Recovery complexity depends on damage scope. How far can incidents spread?"
      };
    }
    return undefined;
  }
};

// Helper functions
function getHourlyRevenueLoss(model: BusinessModelId): string {
  const losses: Record<BusinessModelId, string> = {
    1: "125K", 2: "250K", 3: "180K", 4: "300K",
    5: "500K", 6: "80K", 7: "200K", 8: "150K"
  };
  return losses[model];
}

function getAffectedSystems(percentage: number, model: BusinessModelId): string {
  const systemCounts: Record<BusinessModelId, number> = {
    1: 50, 2: 200, 3: 150, 4: 500,
    5: 1000, 6: 30, 7: 250, 8: 180
  };
  const affected = Math.round((percentage / 100) * systemCounts[model]);
  return `~${affected} critical systems`;
}

function calculatePercentile(
  dimension: DIIDimension,
  value: number,
  model: BusinessModelId
): { position: 'ahead' | 'behind' | 'average'; percentile: number } {
  const benchmarks = INDUSTRY_BENCHMARKS[model][dimension];
  
  // For TRD, AER, HFP, BRI, RRG - lower is better
  let percentile: number;
  if (dimension === 'TRD' || dimension === 'HFP' || dimension === 'BRI' || dimension === 'RRG') {
    if (value <= benchmarks.p90) percentile = 90;
    else if (value <= benchmarks.p75) percentile = 75;
    else if (value <= benchmarks.p50) percentile = 50;
    else if (value <= benchmarks.p25) percentile = 25;
    else percentile = 10;
  } else { // AER - higher means more valuable/vulnerable
    if (value >= benchmarks.p25) percentile = 25;
    else if (value >= benchmarks.p50) percentile = 50;
    else if (value >= benchmarks.p75) percentile = 75;
    else if (value >= benchmarks.p90) percentile = 90;
    else percentile = 95;
  }
  
  const position: 'ahead' | 'behind' | 'average' = 
    percentile >= 70 ? 'ahead' :
    percentile <= 30 ? 'behind' : 'average';
    
  return { position, percentile };
}

function generateHeadline(
  dimension: DIIDimension,
  comparison: { position: 'ahead' | 'behind' | 'average'; percentile: number },
  depthLevel: number
): string {
  const headlines: Record<DIIDimension, Record<'ahead' | 'behind' | 'average', string[]>> = {
    TRD: {
      ahead: [
        "⚡ Lightning-Fast Revenue Protection",
        "🛡️ Revenue Fortress: Well Defended",
        "💰 Money Machine: Highly Resilient"
      ],
      average: [
        "⏱️ Moderate Revenue Exposure",
        "⚠️ Typical Downtime Tolerance",
        "📊 Industry-Standard Protection"
      ],
      behind: [
        "🚨 Revenue at Critical Risk",
        "💸 Money Hemorrhage Warning",
        "🔥 Downtime Disaster Zone"
      ]
    },
    AER: {
      ahead: [
        "🎯 Low-Value Target Status",
        "🛡️ Minimal Attack Interest",
        "✅ Below Threat Radar"
      ],
      average: [
        "👁️ Moderate Target Value",
        "⚖️ Balanced Risk Profile",
        "📍 On Attacker Watchlists"
      ],
      behind: [
        "💎 High-Value Target Alert",
        "🎰 Cybercrime Jackpot",
        "🔴 Prime Attack Target"
      ]
    },
    HFP: {
      ahead: [
        "🧠 Human Firewall Active",
        "💪 Security Champions",
        "🎯 Phishing Resistant Team"
      ],
      average: [
        "👥 Typical Human Risk",
        "📧 Standard Phishing Defense",
        "⚖️ Average Security Awareness"
      ],
      behind: [
        "🎣 Phishing Paradise",
        "🚪 Human Backdoor Open",
        "⚠️ Social Engineering Risk"
      ]
    },
    BRI: {
      ahead: [
        "🏰 Fortress Architecture",
        "🔒 Damage Well Contained",
        "✂️ Excellent Segmentation"
      ],
      average: [
        "🏗️ Standard Architecture",
        "🔗 Moderate Connectivity",
        "📏 Typical Blast Zone"
      ],
      behind: [
        "💥 Domino Effect Risk",
        "🕸️ Dangerously Connected",
        "🌊 Breach Tsunami Zone"
      ]
    },
    RRG: {
      ahead: [
        "🚀 Recovery Excellence",
        "⚡ Rapid Restoration Ready",
        "🎯 Practice Makes Perfect"
      ],
      average: [
        "🔄 Standard Recovery Gap",
        "📋 Typical Plan vs Reality",
        "⏳ Average Restoration Speed"
      ],
      behind: [
        "🐌 Recovery Fantasy Land",
        "📚 Paper Plans Only",
        "⏰ Time Bomb Ticking"
      ]
    }
  };
  
  const index = Math.min(depthLevel - 1, 2);
  return headlines[dimension][comparison.position][index] || '';
}

// Main service function
export function generateInsightRevelation(
  dimension: DIIDimension,
  response: DimensionResponse,
  businessModelId: BusinessModelId,
  allDimensions: Partial<Record<DIIDimension, DimensionResponse>>,
  currentDII?: DIICalculation
): InsightRevelation {
  const answeredDimensions = Object.keys(allDimensions) as DIIDimension[];
  const depthLevel = Math.min(answeredDimensions.length, 5) as 1 | 2 | 3 | 4 | 5;
  
  // Calculate peer comparison
  const comparison = calculatePercentile(dimension, response.metricValue, businessModelId);
  const peerMessage = comparison.position === 'ahead' 
    ? `You're in the top ${100 - comparison.percentile}% of your industry`
    : comparison.position === 'behind'
    ? `${comparison.percentile}% of peers perform better here`
    : `You're right at industry average (${comparison.percentile}th percentile)`;
  
  // Generate business impact
  const businessImpact = BUSINESS_IMPACTS[dimension](response.metricValue, businessModelId);
  
  // Generate correlations
  const correlations = CORRELATIONS[dimension](response.metricValue, allDimensions, businessModelId);
  
  // Add depth-based correlations
  if (depthLevel >= 3 && currentDII) {
    if (currentDII.score < 40) {
      correlations.push("Multiple weak dimensions are compounding your vulnerability exponentially");
    } else if (currentDII.score > 70) {
      correlations.push("Strong performance across dimensions creates resilience multiplier effect");
    }
  }
  
  // Generate next dimension hint
  const nextHint = NEXT_DIMENSION_HINTS[dimension](
    response.metricValue, 
    answeredDimensions, 
    businessModelId
  );
  
  // Generate headline
  const headline = generateHeadline(dimension, comparison, depthLevel);
  
  return {
    dimension,
    headline,
    businessImpact,
    peerComparison: {
      position: comparison.position,
      percentile: comparison.percentile,
      message: peerMessage
    },
    correlations,
    nextDimensionHint: nextHint,
    depthLevel
  };
}

// Additional helper for generating curiosity-building messages
export function generateCuriosityHook(
  answeredCount: number,
  _totalDimensions: number = 5,
  currentDII?: DIICalculation
): string {
  if (answeredCount === 1) {
    return "First insight captured. Four more dimensions will complete your immunity profile.";
  }
  
  if (answeredCount === 2) {
    return "Pattern emerging. Your next answer could reveal critical vulnerabilities.";
  }
  
  if (answeredCount === 3) {
    if (currentDII && currentDII.score < 50) {
      return "Immunity gaps detected. Two more dimensions will show if recovery is possible.";
    }
    return "Immunity profile taking shape. Final dimensions will determine your true resilience.";
  }
  
  if (answeredCount === 4) {
    return "One dimension remains. This final piece could transform your entire security posture.";
  }
  
  return "Complete immunity profile achieved. Now you can see your full defensive capability.";
}