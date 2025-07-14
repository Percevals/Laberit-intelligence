/**
 * Intelligence Engine
 * Contextual analysis and personalized insights generation
 */

import type { 
  BusinessModelId, 
  DIIDimension, 
  DimensionResponse
} from '@/store/dii-dimensions-store';

// Threat intelligence data structures
export interface ThreatPattern {
  id: string;
  name: string;
  description: string;
  industries: string[];
  businessModels: BusinessModelId[];
  regions: string[];
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  frequency: 'Rare' | 'Occasional' | 'Common' | 'Persistent';
  trend: 'Declining' | 'Stable' | 'Growing' | 'Accelerating';
  ttl: number; // Time to live in days
  lastUpdated: Date;
  indicators: string[];
  mitigations: string[];
}

export interface RegionalRisk {
  region: 'LATAM' | 'NA' | 'EMEA' | 'APAC';
  factors: {
    regulatoryMaturity: number; // 1-10
    cybercrimePrevalnce: number; // 1-10
    infrastructureResilience: number; // 1-10
    skillsAvailability: number; // 1-10
    economicStability: number; // 1-10
  };
  specificThreats: string[];
  emergingRisks: string[];
}

export interface IndustryContext {
  industry: string;
  regulatoryRequirements: string[];
  commonAttackVectors: string[];
  peerIncidents: RecentIncident[];
  maturityBenchmark: number; // Average DII for industry
  criticalAssets: string[];
  supplyChainRisks: string[];
}

export interface RecentIncident {
  date: Date;
  company: string; // Anonymized
  description: string;
  impact: {
    financial: number;
    operational: 'Minor' | 'Moderate' | 'Severe' | 'Critical';
    reputational: 'Low' | 'Medium' | 'High' | 'Severe';
  };
  attackVector: string;
  lessonsLearned: string[];
  preventiveMeasures: string[];
}

export interface VulnerabilityWindow {
  dimension: DIIDimension;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  timeframe: string;
  description: string;
  triggers: string[];
  probability: number; // 0-100%
  impact: string;
  mitigation: string;
}

export interface ImmunityPrescription {
  quickWins: PrescriptionAction[];
  strategic: PrescriptionAction[];
  critical: PrescriptionAction[];
  timeline: PrescriptionTimeline;
  expectedOutcome: {
    newDII: number;
    riskReduction: number;
    investment: number;
    timeframe: number; // months
  };
}

export interface PrescriptionAction {
  id: string;
  title: string;
  description: string;
  rationale: string; // Why this is important for your specific context
  dimension: DIIDimension;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  effort: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High' | 'Transformational';
  timeframe: string;
  dependencies: string[];
  specificTo: string[]; // What context makes this relevant
}

export interface PrescriptionTimeline {
  phase1: { // 0-3 months
    name: string;
    actions: string[];
    focus: string;
    expectedImprovement: number;
  };
  phase2: { // 3-9 months
    name: string;
    actions: string[];
    focus: string;
    expectedImprovement: number;
  };
  phase3: { // 9-18 months
    name: string;
    actions: string[];
    focus: string;
    expectedImprovement: number;
  };
}

export interface PersonalizedInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'trend' | 'benchmark' | 'prediction';
  title: string;
  description: string;
  relevance: string; // Why this matters to you
  dataPoints: string[];
  confidence: 'Low' | 'Medium' | 'High';
  actionable: boolean;
  suggestedActions?: string[];
  relatedDimensions: DIIDimension[];
  timeHorizon: 'Immediate' | 'Short-term' | 'Medium-term' | 'Long-term';
}

export interface ClassificationResult {
  company: string;
  industry: string;
  businessModel: string;
  companySize: string;
  region?: string;
}

export interface IntelligenceContext {
  classification: ClassificationResult;
  dimensions: Record<DIIDimension, DimensionResponse>;
  currentDII: number;
  assessmentDate: Date;
  previousAssessments?: {
    date: Date;
    dii: number;
    dimensions: Record<DIIDimension, number>;
  }[];
}

export interface IntelligenceReport {
  context: {
    company: string;
    industry: string;
    businessModel: string;
    size: string;
    region: string;
    assessmentDate: Date;
  };
  
  threatLandscape: {
    relevantPatterns: ThreatPattern[];
    emergingThreats: string[];
    industryTrends: string[];
    regionalFactors: RegionalRisk;
  };
  
  vulnerabilityAnalysis: {
    windows: VulnerabilityWindow[];
    criticalGaps: string[];
    exposureLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    timeToExploitation: string;
  };
  
  insights: PersonalizedInsight[];
  
  prescription: ImmunityPrescription;
  
  benchmarking: {
    industryPosition: 'Leader' | 'Above Average' | 'Average' | 'Below Average' | 'Laggard';
    peerComparison: {
      dimension: DIIDimension;
      yourScore: number;
      industryAvg: number;
      topQuartile: number;
    }[];
    improvementPotential: number;
  };
  
  weeklyIntelligence?: {
    updates: string[];
    alerts: string[];
    recommendations: string[];
    lastUpdated: Date;
  };
}

// Threat patterns database (would be externalized in production)
const THREAT_PATTERNS: ThreatPattern[] = [
  {
    id: 'tp-ransomware-latam-2024',
    name: 'LATAM Ransomware Surge',
    description: 'Significant increase in ransomware targeting Latin American businesses, especially retail and financial sectors',
    industries: ['Retail', 'Financial Services', 'Healthcare'],
    businessModels: [1, 5], // COMERCIO_HIBRIDO, SERVICIOS_FINANCIEROS
    regions: ['LATAM'],
    severity: 'Critical',
    frequency: 'Common',
    trend: 'Accelerating',
    ttl: 30,
    lastUpdated: new Date(),
    indicators: [
      'Increased phishing campaigns in Spanish/Portuguese',
      'Targeting of payment systems',
      'Focus on companies with weak backup strategies'
    ],
    mitigations: [
      'Implement immutable backups',
      'Employee training in local languages',
      'Network segmentation for payment systems'
    ]
  },
  {
    id: 'tp-supply-chain-software',
    name: 'Software Supply Chain Attacks',
    description: 'Attacks targeting software vendors to compromise their customers',
    industries: ['Technology', 'Software'],
    businessModels: [2], // SOFTWARE_CRITICO
    regions: ['Global'],
    severity: 'High',
    frequency: 'Occasional',
    trend: 'Growing',
    ttl: 60,
    lastUpdated: new Date(),
    indicators: [
      'Compromised dependencies',
      'Malicious code in updates',
      'Targeted attacks on CI/CD pipelines'
    ],
    mitigations: [
      'SBOM implementation',
      'Dependency scanning',
      'Secure development lifecycle'
    ]
  }
];

// Regional risk profiles
const REGIONAL_RISKS: Record<string, RegionalRisk> = {
  LATAM: {
    region: 'LATAM',
    factors: {
      regulatoryMaturity: 6,
      cybercrimePrevalnce: 8,
      infrastructureResilience: 5,
      skillsAvailability: 4,
      economicStability: 5
    },
    specificThreats: [
      'Banking trojans targeting Latin American banks',
      'Social engineering exploiting cultural factors',
      'Weak regulatory enforcement',
      'Limited incident response capabilities'
    ],
    emergingRisks: [
      'AI-powered phishing in local languages',
      'Cryptocurrency-related attacks',
      'Critical infrastructure targeting',
      'Supply chain compromises'
    ]
  }
};

// Industry-specific contexts (would be used for more detailed analysis)
// const INDUSTRY_CONTEXTS: Record<string, Partial<IndustryContext>> = {
//   'Retail': {
//     regulatoryRequirements: ['PCI-DSS', 'Consumer Data Protection'],
//     commonAttackVectors: ['POS malware', 'E-skimming', 'Supply chain attacks'],
//     criticalAssets: ['Payment systems', 'Customer databases', 'Inventory systems'],
//     supplyChainRisks: ['Third-party vendors', 'Logistics providers', 'Payment processors']
//   },
//   'Financial Services': {
//     regulatoryRequirements: ['SOX', 'PCI-DSS', 'Local banking regulations'],
//     commonAttackVectors: ['Banking trojans', 'APT groups', 'Insider threats'],
//     criticalAssets: ['Core banking systems', 'Customer data', 'Transaction systems'],
//     supplyChainRisks: ['Technology vendors', 'Data processors', 'Cloud providers']
//   }
// };

export class IntelligenceEngine {
  private context: IntelligenceContext;
  
  constructor(context: IntelligenceContext) {
    this.context = context;
  }
  
  /**
   * Generate complete intelligence report
   */
  async generateReport(): Promise<IntelligenceReport> {
    // Analyze threat landscape
    const threatLandscape = this.analyzeThreatLandscape();
    
    // Identify vulnerability windows
    const vulnerabilityAnalysis = this.analyzeVulnerabilities();
    
    // Generate personalized insights
    const insights = this.generateInsights();
    
    // Create immunity prescription
    const prescription = this.generatePrescription();
    
    // Benchmark against peers
    const benchmarking = this.performBenchmarking();
    
    // Check for weekly intelligence updates
    const weeklyIntelligence = await this.getWeeklyIntelligence();
    
    return {
      context: {
        company: this.context.classification.company,
        industry: this.context.classification.industry,
        businessModel: this.getBusinessModelName(this.context.classification.businessModel),
        size: this.context.classification.companySize,
        region: this.context.classification.region || 'LATAM',
        assessmentDate: this.context.assessmentDate
      },
      threatLandscape,
      vulnerabilityAnalysis,
      insights,
      prescription,
      benchmarking,
      weeklyIntelligence
    };
  }
  
  /**
   * Analyze relevant threat patterns
   */
  private analyzeThreatLandscape() {
    const relevantPatterns = THREAT_PATTERNS.filter(pattern => {
      const industryMatch = pattern.industries.includes(this.context.classification.industry);
      const businessModelMatch = pattern.businessModels.includes(
        this.getBusinessModelId(this.context.classification.businessModel)
      );
      const regionMatch = pattern.regions.includes('Global') || 
        pattern.regions.includes(this.context.classification.region || 'LATAM');
      
      return industryMatch || businessModelMatch || regionMatch;
    });
    
    const region = this.context.classification.region || 'LATAM';
    const regionalRisk = REGIONAL_RISKS[region] || REGIONAL_RISKS.LATAM;
    
    // Identify emerging threats based on weak dimensions
    const emergingThreats = this.identifyEmergingThreats();
    
    // Get industry trends
    const industryTrends = this.getIndustryTrends();
    
    return {
      relevantPatterns,
      emergingThreats,
      industryTrends,
      regionalFactors: regionalRisk
    };
  }
  
  /**
   * Analyze vulnerability windows
   */
  private analyzeVulnerabilities(): any {
    const windows: VulnerabilityWindow[] = [];
    
    // Analyze each dimension for vulnerabilities
    Object.entries(this.context.dimensions).forEach(([dimension, response]) => {
      if (response.normalizedScore < 5) {
        windows.push(this.createVulnerabilityWindow(
          dimension as DIIDimension,
          response
        ));
      }
    });
    
    // Sort by risk level
    windows.sort((a, b) => {
      const riskOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return riskOrder[b.risk] - riskOrder[a.risk];
    });
    
    const criticalGaps = this.identifyCriticalGaps();
    const exposureLevel = this.calculateExposureLevel();
    const timeToExploitation = this.estimateTimeToExploitation();
    
    return {
      windows,
      criticalGaps,
      exposureLevel,
      timeToExploitation
    };
  }
  
  /**
   * Generate personalized insights
   */
  private generateInsights(): PersonalizedInsight[] {
    const insights: PersonalizedInsight[] = [];
    
    // Risk insights
    insights.push(...this.generateRiskInsights());
    
    // Opportunity insights
    insights.push(...this.generateOpportunityInsights());
    
    // Trend insights
    insights.push(...this.generateTrendInsights());
    
    // Benchmark insights
    insights.push(...this.generateBenchmarkInsights());
    
    // Predictive insights
    insights.push(...this.generatePredictiveInsights());
    
    // Sort by relevance and confidence
    insights.sort((a, b) => {
      const confidenceOrder = { High: 3, Medium: 2, Low: 1 };
      const timeOrder = { Immediate: 4, 'Short-term': 3, 'Medium-term': 2, 'Long-term': 1 };
      
      const aScore = confidenceOrder[a.confidence] * timeOrder[a.timeHorizon];
      const bScore = confidenceOrder[b.confidence] * timeOrder[b.timeHorizon];
      
      return bScore - aScore;
    });
    
    return insights.slice(0, 10); // Top 10 insights
  }
  
  /**
   * Generate immunity prescription
   */
  private generatePrescription(): ImmunityPrescription {
    const allActions = this.generatePrescriptionActions();
    
    const quickWins = allActions.filter(a => 
      a.effort === 'Low' && a.timeframe === '0-3 months'
    );
    
    const strategic = allActions.filter(a => 
      a.effort !== 'Low' && a.priority !== 'Critical'
    );
    
    const critical = allActions.filter(a => 
      a.priority === 'Critical'
    );
    
    const timeline = this.createPrescriptionTimeline(allActions);
    
    const expectedOutcome = this.calculateExpectedOutcome(allActions);
    
    return {
      quickWins: quickWins.slice(0, 5),
      strategic: strategic.slice(0, 5),
      critical: critical.slice(0, 3),
      timeline,
      expectedOutcome
    };
  }
  
  /**
   * Perform peer benchmarking
   */
  private performBenchmarking() {
    const industryData = this.getIndustryBenchmarks();
    
    const peerComparison = Object.entries(this.context.dimensions).map(
      ([dimension, response]) => ({
        dimension: dimension as DIIDimension,
        yourScore: response.normalizedScore,
        industryAvg: industryData.averages[dimension as DIIDimension] || 5,
        topQuartile: industryData.topQuartile[dimension as DIIDimension] || 8
      })
    );
    
    const position = this.calculateIndustryPosition();
    const improvementPotential = this.calculateImprovementPotential();
    
    return {
      industryPosition: position,
      peerComparison,
      improvementPotential
    };
  }
  
  /**
   * Get weekly intelligence updates
   */
  private async getWeeklyIntelligence() {
    // In production, this would fetch from external intelligence feeds
    // For now, return mock data if recent
    
    const lastUpdate = new Date();
    lastUpdate.setDate(lastUpdate.getDate() - 3); // 3 days ago
    
    return {
      updates: [
        'New ransomware variant targeting retail sector in LATAM',
        'Increased credential stuffing attacks on e-commerce platforms',
        'Supply chain vulnerability discovered in popular payment gateway'
      ],
      alerts: [
        'Critical: Update payment processing systems by end of week',
        'High: Review third-party vendor access permissions'
      ],
      recommendations: [
        'Enable MFA on all administrative accounts immediately',
        'Conduct emergency response drill this month'
      ],
      lastUpdated: lastUpdate
    };
  }
  
  // Helper methods
  
  private createVulnerabilityWindow(
    dimension: DIIDimension, 
    response: DimensionResponse
  ): VulnerabilityWindow {
    const riskLevel = response.normalizedScore < 3 ? 'Critical' : 
                     response.normalizedScore < 5 ? 'High' : 'Medium';
    
    const dimensionVulnerabilities: Record<DIIDimension, any> = {
      TRD: {
        triggers: ['System outage', 'DDoS attack', 'Service degradation'],
        impact: 'Direct revenue loss, customer churn',
        mitigation: 'Implement automated failover and revenue monitoring'
      },
      AER: {
        triggers: ['Data breach', 'Ransomware', 'Intellectual property theft'],
        impact: 'High-value target for sophisticated attackers',
        mitigation: 'Enhance data protection and access controls'
      },
      HFP: {
        triggers: ['Phishing success', 'Insider threat', 'Social engineering'],
        impact: 'Human errors leading to security breaches',
        mitigation: 'Security awareness training and MFA deployment'
      },
      BRI: {
        triggers: ['Cascading failures', 'Supply chain attack', 'Lateral movement'],
        impact: 'Business-wide disruption from single point of failure',
        mitigation: 'Network segmentation and zero-trust architecture'
      },
      RRG: {
        triggers: ['Extended downtime', 'Data loss', 'Slow recovery'],
        impact: 'Prolonged business disruption and revenue loss',
        mitigation: 'Automated backup and disaster recovery planning'
      }
    };
    
    const vulnInfo = dimensionVulnerabilities[dimension];
    
    return {
      dimension,
      risk: riskLevel,
      timeframe: riskLevel === 'Critical' ? '0-3 months' : 
                 riskLevel === 'High' ? '3-6 months' : '6-12 months',
      description: `Your ${this.getDimensionName(dimension)} score indicates significant vulnerability`,
      triggers: vulnInfo.triggers,
      probability: (10 - response.normalizedScore) * 10,
      impact: vulnInfo.impact,
      mitigation: vulnInfo.mitigation
    };
  }
  
  private identifyEmergingThreats(): string[] {
    const threats: string[] = [];
    
    // Based on weak dimensions
    if (this.context.dimensions.HFP.normalizedScore < 5) {
      threats.push('AI-enhanced social engineering campaigns targeting your industry');
    }
    
    if (this.context.dimensions.AER.normalizedScore < 5) {
      threats.push('Increased interest from ransomware groups in your sector');
    }
    
    // Based on industry
    if (this.context.classification.industry === 'Retail') {
      threats.push('E-skimming attacks on payment pages');
    }
    
    // Based on region
    if (this.context.classification.region === 'LATAM') {
      threats.push('Banking trojans adapted for Latin American financial systems');
    }
    
    return threats;
  }
  
  private generateRiskInsights(): PersonalizedInsight[] {
    const insights: PersonalizedInsight[] = [];
    
    // Critical dimension risks
    Object.entries(this.context.dimensions).forEach(([dimension, response]) => {
      if (response.normalizedScore < 4) {
        insights.push({
          id: `risk-${dimension}`,
          type: 'risk',
          title: `Critical ${this.getDimensionName(dimension as DIIDimension)} Vulnerability`,
          description: `Your ${dimension} score of ${response.normalizedScore.toFixed(1)} puts you at significant risk`,
          relevance: `Companies in ${this.context.classification.industry} with low ${dimension} scores experience 3x more incidents`,
          dataPoints: [
            `Industry average: ${this.getIndustryAverage(dimension as DIIDimension).toFixed(1)}`,
            `Your score: ${response.normalizedScore.toFixed(1)}`,
            `Gap: ${(this.getIndustryAverage(dimension as DIIDimension) - response.normalizedScore).toFixed(1)} points`
          ],
          confidence: 'High',
          actionable: true,
          suggestedActions: this.getDimensionActions(dimension as DIIDimension),
          relatedDimensions: [dimension as DIIDimension],
          timeHorizon: 'Immediate'
        });
      }
    });
    
    return insights;
  }
  
  private generatePrescriptionActions(): PrescriptionAction[] {
    const actions: PrescriptionAction[] = [];
    
    // Generate actions based on dimension weaknesses
    Object.entries(this.context.dimensions).forEach(([dimension, response]) => {
      if (response.normalizedScore < 7) {
        actions.push(...this.createDimensionActions(
          dimension as DIIDimension, 
          response
        ));
      }
    });
    
    // Add context-specific actions
    if (this.context.classification.region === 'LATAM') {
      actions.push({
        id: 'latam-compliance',
        title: 'LATAM Regulatory Compliance Review',
        description: 'Ensure compliance with local data protection regulations',
        rationale: 'LATAM regulatory landscape is rapidly evolving with new privacy laws',
        dimension: 'BRI',
        priority: 'High',
        effort: 'Medium',
        impact: 'High',
        timeframe: '3-6 months',
        dependencies: [],
        specificTo: ['LATAM region', 'Evolving regulations']
      });
    }
    
    return actions;
  }
  
  private createDimensionActions(
    dimension: DIIDimension, 
    response: DimensionResponse
  ): PrescriptionAction[] {
    const gap = 8 - response.normalizedScore; // Target score of 8
    const actions: PrescriptionAction[] = [];
    
    if (gap > 5) {
      // Need transformational change
      actions.push({
        id: `${dimension}-transform`,
        title: `${this.getDimensionName(dimension)} Transformation Program`,
        description: `Comprehensive overhaul of ${dimension} capabilities`,
        rationale: `Your score is ${gap.toFixed(1)} points below target, requiring significant investment`,
        dimension,
        priority: 'Critical',
        effort: 'High',
        impact: 'Transformational',
        timeframe: '9-18 months',
        dependencies: [`${dimension}-quick`, `${dimension}-core`],
        specificTo: [`Low ${dimension} score`, this.context.classification.industry]
      });
    }
    
    return actions;
  }
  
  // Utility methods
  
  private getBusinessModelId(name: string): BusinessModelId {
    const mapping: Record<string, BusinessModelId> = {
      'COMERCIO_HIBRIDO': 1,
      'SOFTWARE_CRITICO': 2,
      'SERVICIOS_DATOS': 3,
      'ECOSISTEMA_DIGITAL': 4,
      'SERVICIOS_FINANCIEROS': 5,
      'INFRAESTRUCTURA_HEREDADA': 6,
      'CADENA_SUMINISTRO': 7,
      'INFORMACION_REGULADA': 8
    };
    return mapping[name] as BusinessModelId;
  }
  
  private getBusinessModelName(name: string): string {
    const names: Record<string, string> = {
      'COMERCIO_HIBRIDO': 'Hybrid Commerce',
      'SOFTWARE_CRITICO': 'Critical Software',
      'SERVICIOS_DATOS': 'Data Services',
      'ECOSISTEMA_DIGITAL': 'Digital Ecosystem',
      'SERVICIOS_FINANCIEROS': 'Financial Services',
      'INFRAESTRUCTURA_HEREDADA': 'Legacy Infrastructure',
      'CADENA_SUMINISTRO': 'Supply Chain',
      'INFORMACION_REGULADA': 'Regulated Information'
    };
    return names[name] || name;
  }
  
  private getDimensionName(dimension: DIIDimension): string {
    const names: Record<DIIDimension, string> = {
      TRD: 'Time to Revenue Damage',
      AER: 'Attack Economic Reward',
      HFP: 'Human Failure Probability',
      BRI: 'Business Risk Impact',
      RRG: 'Recovery Resource Gap'
    };
    return names[dimension];
  }
  
  private getIndustryAverage(dimension: DIIDimension): number {
    // Mock data - in production would come from real benchmarks
    const averages: Record<string, Record<DIIDimension, number>> = {
      'Retail': { TRD: 5.2, AER: 4.8, HFP: 5.5, BRI: 5.0, RRG: 4.9 },
      'Financial Services': { TRD: 6.5, AER: 7.2, HFP: 6.8, BRI: 7.0, RRG: 6.9 }
    };
    
    return averages[this.context.classification.industry]?.[dimension] || 5.0;
  }
  
  private getDimensionActions(dimension: DIIDimension): string[] {
    const actions: Record<DIIDimension, string[]> = {
      TRD: [
        'Implement real-time monitoring',
        'Deploy automated failover',
        'Create revenue impact dashboards'
      ],
      AER: [
        'Enhance data encryption',
        'Implement zero-trust architecture',
        'Deploy deception technologies'
      ],
      HFP: [
        'Deploy MFA across all systems',
        'Implement security awareness training',
        'Create security champions program'
      ],
      BRI: [
        'Implement network segmentation',
        'Deploy EDR solutions',
        'Create incident response playbooks'
      ],
      RRG: [
        'Automate backup processes',
        'Test disaster recovery plans',
        'Implement chaos engineering'
      ]
    };
    
    return actions[dimension] || [];
  }
  
  private getIndustryTrends(): string[] {
    const trends: Record<string, string[]> = {
      'Retail': [
        'Increased focus on payment security',
        'Supply chain attacks on the rise',
        'Customer data protection regulations tightening'
      ],
      'Financial Services': [
        'APT groups targeting financial institutions',
        'Regulatory scrutiny increasing',
        'Open banking creating new attack surfaces'
      ]
    };
    
    return trends[this.context.classification.industry] || [];
  }
  
  private identifyCriticalGaps(): string[] {
    const gaps: string[] = [];
    
    // Check for critical dimension combinations
    if (this.context.dimensions.TRD.normalizedScore < 5 && 
        this.context.dimensions.RRG.normalizedScore < 5) {
      gaps.push('Critical gap: Poor revenue protection with weak recovery capabilities');
    }
    
    if (this.context.dimensions.HFP.normalizedScore < 5 && 
        this.context.dimensions.AER.normalizedScore > 7) {
      gaps.push('Critical gap: High-value target with weak human defenses');
    }
    
    return gaps;
  }
  
  private calculateExposureLevel(): 'Low' | 'Medium' | 'High' | 'Critical' {
    const avgScore = Object.values(this.context.dimensions)
      .reduce((sum, d) => sum + d.normalizedScore, 0) / 5;
    
    if (avgScore < 3) return 'Critical';
    if (avgScore < 5) return 'High';
    if (avgScore < 7) return 'Medium';
    return 'Low';
  }
  
  private estimateTimeToExploitation(): string {
    const exposure = this.calculateExposureLevel();
    
    switch (exposure) {
      case 'Critical': return '0-30 days';
      case 'High': return '1-3 months';
      case 'Medium': return '3-6 months';
      case 'Low': return '6+ months';
    }
  }
  
  private generateOpportunityInsights(): PersonalizedInsight[] {
    return [{
      id: 'opp-quick-wins',
      type: 'opportunity',
      title: 'Quick Security Wins Available',
      description: '5 low-effort improvements could boost your DII by 15 points',
      relevance: 'These improvements require minimal investment but deliver immediate value',
      dataPoints: [
        'Average implementation time: 2 months',
        'Total investment: $50,000',
        'Expected DII improvement: 15 points'
      ],
      confidence: 'High',
      actionable: true,
      suggestedActions: ['Deploy MFA', 'Security training', 'Backup automation'],
      relatedDimensions: ['HFP', 'RRG'],
      timeHorizon: 'Short-term'
    }];
  }
  
  private generateTrendInsights(): PersonalizedInsight[] {
    return [{
      id: 'trend-industry',
      type: 'trend',
      title: `${this.context.classification.industry} Under Increased Attack`,
      description: '40% increase in attacks targeting your industry in the last quarter',
      relevance: 'Your industry is becoming a more attractive target for cybercriminals',
      dataPoints: [
        'Q4 2023: 120 reported incidents',
        'Q1 2024: 168 reported incidents',
        'Primary vector: Ransomware (65%)'
      ],
      confidence: 'High',
      actionable: true,
      suggestedActions: ['Review incident response', 'Test backups', 'Update threat models'],
      relatedDimensions: ['TRD', 'AER', 'RRG'],
      timeHorizon: 'Immediate'
    }];
  }
  
  private generateBenchmarkInsights(): PersonalizedInsight[] {
    const insights: PersonalizedInsight[] = [];
    
    // Find biggest gaps vs industry
    Object.entries(this.context.dimensions).forEach(([dimension, response]) => {
      const gap = this.getIndustryAverage(dimension as DIIDimension) - response.normalizedScore;
      
      if (gap > 2) {
        insights.push({
          id: `bench-${dimension}`,
          type: 'benchmark',
          title: `Below Industry Average in ${this.getDimensionName(dimension as DIIDimension)}`,
          description: `Your ${dimension} score is ${gap.toFixed(1)} points below peers`,
          relevance: 'This gap makes you a more attractive target than competitors',
          dataPoints: [
            `Your score: ${response.normalizedScore.toFixed(1)}`,
            `Industry average: ${this.getIndustryAverage(dimension as DIIDimension).toFixed(1)}`,
            `Top quartile: ${(this.getIndustryAverage(dimension as DIIDimension) + 2).toFixed(1)}`
          ],
          confidence: 'High',
          actionable: true,
          relatedDimensions: [dimension as DIIDimension],
          timeHorizon: 'Medium-term'
        });
      }
    });
    
    return insights;
  }
  
  private generatePredictiveInsights(): PersonalizedInsight[] {
    return [{
      id: 'pred-trajectory',
      type: 'prediction',
      title: 'DII Trajectory Warning',
      description: 'At current pace, you will fall below critical threshold in 6 months',
      relevance: 'Without intervention, your immunity will degrade as threats evolve',
      dataPoints: [
        'Current DII: ' + this.context.currentDII,
        'Projected DII (6mo): ' + (this.context.currentDII - 5),
        'Critical threshold: 40'
      ],
      confidence: 'Medium',
      actionable: true,
      suggestedActions: ['Implement continuous improvement program', 'Increase security budget'],
      relatedDimensions: ['TRD', 'AER', 'HFP', 'BRI', 'RRG'],
      timeHorizon: 'Medium-term'
    }];
  }
  
  private createPrescriptionTimeline(actions: PrescriptionAction[]): PrescriptionTimeline {
    const phase1Actions = actions.filter(a => a.timeframe === '0-3 months');
    const phase2Actions = actions.filter(a => a.timeframe === '3-6 months' || a.timeframe === '6-9 months');
    const phase3Actions = actions.filter(a => a.timeframe === '9-18 months');
    
    return {
      phase1: {
        name: 'Foundation & Quick Wins',
        actions: phase1Actions.map(a => a.id),
        focus: 'Address critical vulnerabilities and easy improvements',
        expectedImprovement: 10
      },
      phase2: {
        name: 'Core Capability Building',
        actions: phase2Actions.map(a => a.id),
        focus: 'Build robust security infrastructure and processes',
        expectedImprovement: 15
      },
      phase3: {
        name: 'Strategic Transformation',
        actions: phase3Actions.map(a => a.id),
        focus: 'Achieve industry-leading security posture',
        expectedImprovement: 20
      }
    };
  }
  
  private calculateExpectedOutcome(actions: PrescriptionAction[]) {
    // Simplified calculation - in production would be more sophisticated
    const improvement = actions.length * 2.5;
    const investment = actions.filter(a => a.priority === 'Critical').length * 100000 +
                      actions.filter(a => a.priority === 'High').length * 50000 +
                      actions.filter(a => a.priority === 'Medium').length * 25000;
    
    return {
      newDII: Math.min(100, this.context.currentDII + improvement),
      riskReduction: improvement * 3, // Percentage
      investment,
      timeframe: 18
    };
  }
  
  private calculateIndustryPosition(): 'Leader' | 'Above Average' | 'Average' | 'Below Average' | 'Laggard' {
    const industryAvg = 50; // Mock data
    const diff = this.context.currentDII - industryAvg;
    
    if (diff > 20) return 'Leader';
    if (diff > 10) return 'Above Average';
    if (diff > -10) return 'Average';
    if (diff > -20) return 'Below Average';
    return 'Laggard';
  }
  
  private calculateImprovementPotential(): number {
    const targetDII = 80; // Industry leaders
    return Math.max(0, targetDII - this.context.currentDII);
  }
  
  private getIndustryBenchmarks() {
    // Mock data - in production would come from real benchmarks
    return {
      averages: {
        TRD: 5.5,
        AER: 5.8,
        HFP: 6.0,
        BRI: 5.7,
        RRG: 5.3
      },
      topQuartile: {
        TRD: 8.0,
        AER: 8.5,
        HFP: 8.2,
        BRI: 8.3,
        RRG: 7.9
      }
    };
  }
}