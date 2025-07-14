/**
 * What-If Scenario Engine
 * Strategic planning tool for DII improvement
 */

import type { DIIDimension, DimensionResponse, BusinessModelId } from '@/store/dii-dimensions-store';

export interface ImprovementAction {
  id: string;
  dimension: DIIDimension;
  title: string;
  description: string;
  businessJustification: string;
  
  // Impact metrics
  scoreImprovement: number; // Points gained (0-10 scale)
  implementationCost: number; // USD
  timeToImplement: number; // Months
  effortLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  
  // Risk reduction
  riskReductionPercentage: number;
  annualRiskCost: number; // USD saved per year
  
  // Implementation details
  prerequisites?: string[];
  maintenanceCost?: number; // Annual USD
  stakeholders: string[];
  
  // Business context
  quickWins: boolean;
  strategicValue: 'Low' | 'Medium' | 'High' | 'Critical';
  complianceImpact?: string;
}

export interface ScenarioAnalysis {
  id: string;
  name: string;
  description: string;
  
  // Current vs target state
  currentDII: number;
  targetDII: number;
  improvement: number;
  
  // Selected improvements
  actions: ImprovementAction[];
  
  // Financial analysis
  totalCost: number;
  totalTimeMonths: number;
  annualSavings: number;
  roi: number; // Return on investment percentage
  paybackMonths: number;
  
  // Risk analysis
  riskReduction: number;
  businessImpact: string;
  
  // Timeline
  phases: ImplementationPhase[];
  
  // Metadata
  createdAt: Date;
  lastModified: Date;
  isBookmarked: boolean;
}

export interface ImplementationPhase {
  phase: number;
  name: string;
  duration: number; // Months
  actions: string[]; // Action IDs
  cost: number;
  expectedDII: number;
  keyMilestones: string[];
}

export interface ScenarioComparison {
  scenarios: ScenarioAnalysis[];
  recommendations: {
    fastest: string; // Scenario ID
    cheapest: string;
    bestROI: string;
    mostImpactful: string;
  };
}

// Business model specific improvement actions
const IMPROVEMENT_ACTIONS: Record<BusinessModelId, Record<DIIDimension, ImprovementAction[]>> = {
  1: { // COMERCIO_HIBRIDO
    TRD: [
      {
        id: 'trd-1-1',
        dimension: 'TRD',
        title: 'Implement Real-time Revenue Monitoring',
        description: 'Deploy automated systems to detect revenue impact within 30 minutes of incidents',
        businessJustification: 'Reduces time to detect revenue loss from hours to minutes, enabling faster response',
        scoreImprovement: 2.5,
        implementationCost: 75000,
        timeToImplement: 3,
        effortLevel: 'Medium',
        riskReductionPercentage: 35,
        annualRiskCost: 250000,
        stakeholders: ['IT', 'Finance', 'Operations'],
        quickWins: false,
        strategicValue: 'High'
      },
      {
        id: 'trd-1-2',
        dimension: 'TRD',
        title: 'Automated Failover for Critical Systems',
        description: 'Implement automatic switching to backup systems for revenue-critical applications',
        businessJustification: 'Eliminates manual intervention delays during outages, maintaining revenue flow',
        scoreImprovement: 3.0,
        implementationCost: 120000,
        timeToImplement: 6,
        effortLevel: 'High',
        riskReductionPercentage: 45,
        annualRiskCost: 400000,
        prerequisites: ['System redundancy assessment'],
        maintenanceCost: 15000,
        stakeholders: ['IT', 'Engineering', 'Business Units'],
        quickWins: false,
        strategicValue: 'Critical'
      }
    ],
    AER: [
      {
        id: 'aer-1-1',
        dimension: 'AER',
        title: 'Advanced Customer Data Protection',
        description: 'Implement zero-trust architecture and advanced encryption for customer data',
        businessJustification: 'Protects high-value customer data that attracts sophisticated attackers',
        scoreImprovement: 2.0,
        implementationCost: 95000,
        timeToImplement: 4,
        effortLevel: 'Medium',
        riskReductionPercentage: 40,
        annualRiskCost: 300000,
        stakeholders: ['IT Security', 'Compliance', 'Customer Service'],
        quickWins: false,
        strategicValue: 'High',
        complianceImpact: 'GDPR, PCI-DSS compliance improvement'
      }
    ],
    HFP: [
      {
        id: 'hfp-1-1',
        dimension: 'HFP',
        title: 'Multi-Factor Authentication (MFA)',
        description: 'Deploy MFA across all business-critical systems and customer-facing applications',
        businessJustification: 'Prevents 99.9% of automated attacks and reduces human error impact',
        scoreImprovement: 2.5,
        implementationCost: 25000,
        timeToImplement: 2,
        effortLevel: 'Low',
        riskReductionPercentage: 60,
        annualRiskCost: 180000,
        maintenanceCost: 5000,
        stakeholders: ['IT', 'HR', 'All Users'],
        quickWins: true,
        strategicValue: 'High'
      },
      {
        id: 'hfp-1-2',
        dimension: 'HFP',
        title: 'Quarterly Security Awareness Training',
        description: 'Implement interactive security training with phishing simulations',
        businessJustification: 'Reduces successful phishing attacks by 70% and builds security culture',
        scoreImprovement: 1.8,
        implementationCost: 15000,
        timeToImplement: 1,
        effortLevel: 'Low',
        riskReductionPercentage: 30,
        annualRiskCost: 85000,
        maintenanceCost: 12000,
        stakeholders: ['HR', 'IT Security', 'All Employees'],
        quickWins: true,
        strategicValue: 'Medium'
      }
    ],
    BRI: [
      {
        id: 'bri-1-1',
        dimension: 'BRI',
        title: 'Network Segmentation',
        description: 'Implement micro-segmentation to isolate critical business systems',
        businessJustification: 'Limits blast radius of breaches, preventing cascade failures across business units',
        scoreImprovement: 3.2,
        implementationCost: 85000,
        timeToImplement: 5,
        effortLevel: 'High',
        riskReductionPercentage: 50,
        annualRiskCost: 350000,
        prerequisites: ['Network architecture review'],
        stakeholders: ['IT', 'Network Team', 'Business Units'],
        quickWins: false,
        strategicValue: 'Critical'
      }
    ],
    RRG: [
      {
        id: 'rrg-1-1',
        dimension: 'RRG',
        title: 'Automated Backup and Recovery',
        description: 'Deploy cloud-based automated backup with 1-hour recovery objectives',
        businessJustification: 'Reduces recovery time from days to hours, minimizing business disruption',
        scoreImprovement: 2.8,
        implementationCost: 65000,
        timeToImplement: 3,
        effortLevel: 'Medium',
        riskReductionPercentage: 45,
        annualRiskCost: 200000,
        maintenanceCost: 18000,
        stakeholders: ['IT', 'Operations', 'Finance'],
        quickWins: false,
        strategicValue: 'High'
      },
      {
        id: 'rrg-1-2',
        dimension: 'RRG',
        title: 'Business Continuity Automation',
        description: 'Implement automated failover processes and recovery orchestration',
        businessJustification: 'Eliminates manual recovery steps, reducing human error and recovery time',
        scoreImprovement: 3.5,
        implementationCost: 110000,
        timeToImplement: 6,
        effortLevel: 'High',
        riskReductionPercentage: 55,
        annualRiskCost: 450000,
        prerequisites: ['Business impact analysis', 'Process documentation'],
        maintenanceCost: 22000,
        stakeholders: ['IT', 'Operations', 'Business Continuity'],
        quickWins: false,
        strategicValue: 'Critical'
      }
    ]
  },
  
  2: { // SOFTWARE_CRITICO
    TRD: [
      {
        id: 'trd-2-1',
        dimension: 'TRD',
        title: 'Zero-Downtime Deployment Pipeline',
        description: 'Implement blue-green deployments with automated rollback capabilities',
        businessJustification: 'Eliminates service interruptions during updates, maintaining critical system availability',
        scoreImprovement: 3.0,
        implementationCost: 95000,
        timeToImplement: 4,
        effortLevel: 'High',
        riskReductionPercentage: 60,
        annualRiskCost: 500000,
        stakeholders: ['DevOps', 'Engineering', 'Operations'],
        quickWins: false,
        strategicValue: 'Critical'
      }
    ],
    AER: [
      {
        id: 'aer-2-1',
        dimension: 'AER',
        title: 'Advanced Threat Detection for Code',
        description: 'Deploy AI-powered code analysis and runtime threat detection',
        businessJustification: 'Protects valuable IP and prevents code theft that could damage competitive advantage',
        scoreImprovement: 2.8,
        implementationCost: 85000,
        timeToImplement: 3,
        effortLevel: 'Medium',
        riskReductionPercentage: 50,
        annualRiskCost: 350000,
        stakeholders: ['Security', 'Engineering', 'Product'],
        quickWins: false,
        strategicValue: 'Critical'
      }
    ],
    HFP: [
      {
        id: 'hfp-2-1',
        dimension: 'HFP',
        title: 'Developer Security Training',
        description: 'Implement secure coding practices and security-first development culture',
        businessJustification: 'Prevents security vulnerabilities at source, reducing critical system exposure',
        scoreImprovement: 2.2,
        implementationCost: 35000,
        timeToImplement: 2,
        effortLevel: 'Low',
        riskReductionPercentage: 40,
        annualRiskCost: 180000,
        maintenanceCost: 15000,
        stakeholders: ['Engineering', 'Security', 'HR'],
        quickWins: true,
        strategicValue: 'High'
      }
    ],
    BRI: [
      {
        id: 'bri-2-1',
        dimension: 'BRI',
        title: 'Microservices Security Architecture',
        description: 'Implement service mesh with granular security controls',
        businessJustification: 'Limits impact of compromised services, maintaining system integrity',
        scoreImprovement: 3.5,
        implementationCost: 125000,
        timeToImplement: 6,
        effortLevel: 'High',
        riskReductionPercentage: 55,
        annualRiskCost: 400000,
        stakeholders: ['Engineering', 'Security', 'Architecture'],
        quickWins: false,
        strategicValue: 'Critical'
      }
    ],
    RRG: [
      {
        id: 'rrg-2-1',
        dimension: 'RRG',
        title: 'Disaster Recovery Automation',
        description: 'Implement automated DR with sub-minute recovery time objectives',
        businessJustification: 'Ensures critical system availability, meeting SLA commitments to customers',
        scoreImprovement: 4.0,
        implementationCost: 150000,
        timeToImplement: 6,
        effortLevel: 'Critical',
        riskReductionPercentage: 70,
        annualRiskCost: 600000,
        maintenanceCost: 30000,
        stakeholders: ['Engineering', 'Operations', 'Customer Success'],
        quickWins: false,
        strategicValue: 'Critical'
      }
    ]
  },
  
  // Additional business models would follow similar patterns
  3: { TRD: [], AER: [], HFP: [], BRI: [], RRG: [] },
  4: { TRD: [], AER: [], HFP: [], BRI: [], RRG: [] },
  5: { TRD: [], AER: [], HFP: [], BRI: [], RRG: [] },
  6: { TRD: [], AER: [], HFP: [], BRI: [], RRG: [] },
  7: { TRD: [], AER: [], HFP: [], BRI: [], RRG: [] },
  8: { TRD: [], AER: [], HFP: [], BRI: [], RRG: [] }
};

export class ScenarioEngine {
  private businessModel: BusinessModelId;
  private currentDimensions: Record<DIIDimension, DimensionResponse>;
  private currentDII: number;

  constructor(
    businessModel: BusinessModelId,
    dimensions: Record<DIIDimension, DimensionResponse>,
    currentDII: number
  ) {
    this.businessModel = businessModel;
    this.currentDimensions = dimensions;
    this.currentDII = currentDII;
  }

  /**
   * Get available improvement actions for each dimension
   */
  getAvailableImprovements(): Record<DIIDimension, ImprovementAction[]> {
    const actions = IMPROVEMENT_ACTIONS[this.businessModel];
    
    // Filter actions based on current scores (don't suggest if already high)
    const filtered: Record<DIIDimension, ImprovementAction[]> = {} as any;
    
    Object.entries(actions).forEach(([dimension, dimensionActions]) => {
      const currentScore = this.currentDimensions[dimension as DIIDimension]?.normalizedScore || 0;
      
      // Only show improvements that would meaningfully impact the score
      filtered[dimension as DIIDimension] = dimensionActions.filter(action => 
        currentScore + action.scoreImprovement <= 10 && // Don't exceed max
        action.scoreImprovement > 0.5 // Meaningful improvement
      );
    });
    
    return filtered;
  }

  /**
   * Calculate DII impact of applying specific actions
   */
  calculateScenarioImpact(actionIds: string[]): {
    newDII: number;
    improvement: number;
    dimensionChanges: Record<DIIDimension, { current: number; target: number; improvement: number }>;
  } {
    const actions = this.getActionsByIds(actionIds);
    const dimensionChanges: Record<DIIDimension, { current: number; target: number; improvement: number }> = {} as any;
    
    // Calculate new dimension scores
    const newScores: Record<DIIDimension, number> = {} as any;
    
    Object.entries(this.currentDimensions).forEach(([dimension, response]) => {
      const dim = dimension as DIIDimension;
      const currentScore = response.normalizedScore;
      
      // Sum improvements for this dimension
      const improvements = actions
        .filter(action => action.dimension === dim)
        .reduce((sum, action) => sum + action.scoreImprovement, 0);
      
      const newScore = Math.min(10, currentScore + improvements);
      newScores[dim] = newScore;
      
      dimensionChanges[dim] = {
        current: currentScore,
        target: newScore,
        improvement: improvements
      };
    });
    
    // Calculate new DII using the formula: (TRD × AER) / (HFP × BRI × RRG)
    const newDII = this.calculateDII(newScores);
    
    return {
      newDII,
      improvement: newDII - this.currentDII,
      dimensionChanges
    };
  }

  /**
   * Create a complete scenario analysis
   */
  createScenario(
    name: string,
    description: string,
    actionIds: string[]
  ): ScenarioAnalysis {
    const actions = this.getActionsByIds(actionIds);
    const impact = this.calculateScenarioImpact(actionIds);
    
    // Calculate financial metrics
    const totalCost = actions.reduce((sum, action) => sum + action.implementationCost, 0);
    const annualSavings = actions.reduce((sum, action) => sum + action.annualRiskCost, 0);
    const maintenanceCost = actions.reduce((sum, action) => sum + (action.maintenanceCost || 0), 0);
    
    const netAnnualSavings = annualSavings - maintenanceCost;
    const roi = netAnnualSavings > 0 ? (netAnnualSavings / totalCost) * 100 : 0;
    const paybackMonths = netAnnualSavings > 0 ? (totalCost / netAnnualSavings) * 12 : Infinity;
    
    // Calculate timeline and phases
    const phases = this.generateImplementationPhases(actions);
    const totalTimeMonths = Math.max(...actions.map(a => a.timeToImplement));
    
    // Calculate risk reduction
    const riskReduction = actions.reduce((sum, action) => 
      sum + (action.riskReductionPercentage * action.annualRiskCost / 100), 0
    );
    
    return {
      id: `scenario-${Date.now()}`,
      name,
      description,
      currentDII: this.currentDII,
      targetDII: impact.newDII,
      improvement: impact.improvement,
      actions,
      totalCost,
      totalTimeMonths,
      annualSavings: netAnnualSavings,
      roi,
      paybackMonths: paybackMonths === Infinity ? 999 : paybackMonths,
      riskReduction,
      businessImpact: this.generateBusinessImpact(impact.improvement),
      phases,
      createdAt: new Date(),
      lastModified: new Date(),
      isBookmarked: false
    };
  }

  /**
   * Compare multiple scenarios
   */
  compareScenarios(scenarios: ScenarioAnalysis[]): ScenarioComparison {
    if (scenarios.length === 0) {
      throw new Error('At least one scenario is required for comparison');
    }

    const recommendations = {
      fastest: scenarios.reduce((fastest, current) => 
        current.totalTimeMonths < fastest.totalTimeMonths ? current : fastest
      ).id,
      cheapest: scenarios.reduce((cheapest, current) => 
        current.totalCost < cheapest.totalCost ? current : cheapest
      ).id,
      bestROI: scenarios.reduce((bestROI, current) => 
        current.roi > bestROI.roi ? current : bestROI
      ).id,
      mostImpactful: scenarios.reduce((mostImpactful, current) => 
        current.improvement > mostImpactful.improvement ? current : mostImpactful
      ).id
    };

    return {
      scenarios,
      recommendations
    };
  }

  /**
   * Generate quick win recommendations
   */
  getQuickWins(): ImprovementAction[] {
    const allActions = Object.values(this.getAvailableImprovements()).flat();
    
    return allActions
      .filter(action => action.quickWins)
      .sort((a, b) => {
        // Sort by ROI (annual savings / cost)
        const roiA = a.annualRiskCost / a.implementationCost;
        const roiB = b.annualRiskCost / b.implementationCost;
        return roiB - roiA;
      })
      .slice(0, 5); // Top 5 quick wins
  }

  /**
   * Generate strategic roadmap for target DII score
   */
  generateRoadmapToTarget(targetDII: number): {
    isAchievable: boolean;
    requiredImprovement: number;
    recommendedActions: ImprovementAction[];
    estimatedCost: number;
    estimatedTime: number;
    phases: ImplementationPhase[];
  } {
    const requiredImprovement = targetDII - this.currentDII;
    
    if (requiredImprovement <= 0) {
      return {
        isAchievable: true,
        requiredImprovement: 0,
        recommendedActions: [],
        estimatedCost: 0,
        estimatedTime: 0,
        phases: []
      };
    }

    // Get all available actions and sort by efficiency (improvement per cost)
    const allActions = Object.values(this.getAvailableImprovements()).flat();
    const sortedActions = allActions.sort((a, b) => {
      const efficiencyA = a.scoreImprovement / (a.implementationCost / 1000);
      const efficiencyB = b.scoreImprovement / (b.implementationCost / 1000);
      return efficiencyB - efficiencyA;
    });

    // Greedy algorithm to select actions that achieve target
    const selectedActions: ImprovementAction[] = [];
    let currentImprovement = 0;

    for (const action of sortedActions) {
      if (currentImprovement >= requiredImprovement) break;
      
      selectedActions.push(action);
      currentImprovement += action.scoreImprovement;
    }

    const isAchievable = currentImprovement >= requiredImprovement;
    const estimatedCost = selectedActions.reduce((sum, action) => sum + action.implementationCost, 0);
    const estimatedTime = Math.max(...selectedActions.map(action => action.timeToImplement));
    const phases = this.generateImplementationPhases(selectedActions);

    return {
      isAchievable,
      requiredImprovement,
      recommendedActions: selectedActions,
      estimatedCost,
      estimatedTime,
      phases
    };
  }

  // Private helper methods

  private getActionsByIds(actionIds: string[]): ImprovementAction[] {
    const allActions = Object.values(IMPROVEMENT_ACTIONS[this.businessModel]).flat();
    return actionIds.map(id => {
      const action = allActions.find(a => a.id === id);
      if (!action) throw new Error(`Action not found: ${id}`);
      return action;
    });
  }

  private calculateDII(scores: Record<DIIDimension, number>): number {
    // DII Formula: (TRD × AER) / (HFP × BRI × RRG) × 100
    const numerator = scores.TRD * scores.AER;
    const denominator = scores.HFP * scores.BRI * scores.RRG;
    
    if (denominator === 0) return 0;
    
    return Math.min(100, (numerator / denominator) * 10);
  }

  private generateImplementationPhases(actions: ImprovementAction[]): ImplementationPhase[] {
    // Group actions by effort level and dependencies
    const quickWins = actions.filter(a => a.quickWins).sort((a, b) => a.timeToImplement - b.timeToImplement);
    const mediumTerm = actions.filter(a => !a.quickWins && a.effortLevel !== 'Critical');
    const strategic = actions.filter(a => a.effortLevel === 'Critical');

    const phases: ImplementationPhase[] = [];

    if (quickWins.length > 0) {
      phases.push({
        phase: 1,
        name: 'Quick Wins',
        duration: Math.max(...quickWins.map(a => a.timeToImplement)),
        actions: quickWins.map(a => a.id),
        cost: quickWins.reduce((sum, a) => sum + a.implementationCost, 0),
        expectedDII: this.calculateScenarioImpact(quickWins.map(a => a.id)).newDII,
        keyMilestones: quickWins.map(a => a.title)
      });
    }

    if (mediumTerm.length > 0) {
      phases.push({
        phase: phases.length + 1,
        name: 'Core Improvements',
        duration: Math.max(...mediumTerm.map(a => a.timeToImplement)),
        actions: mediumTerm.map(a => a.id),
        cost: mediumTerm.reduce((sum, a) => sum + a.implementationCost, 0),
        expectedDII: this.calculateScenarioImpact([...quickWins, ...mediumTerm].map(a => a.id)).newDII,
        keyMilestones: mediumTerm.map(a => a.title)
      });
    }

    if (strategic.length > 0) {
      phases.push({
        phase: phases.length + 1,
        name: 'Strategic Transformation',
        duration: Math.max(...strategic.map(a => a.timeToImplement)),
        actions: strategic.map(a => a.id),
        cost: strategic.reduce((sum, a) => sum + a.implementationCost, 0),
        expectedDII: this.calculateScenarioImpact(actions.map(a => a.id)).newDII,
        keyMilestones: strategic.map(a => a.title)
      });
    }

    return phases;
  }

  private generateBusinessImpact(improvement: number): string {
    if (improvement >= 20) return 'Transformational - Fundamental shift in security posture';
    if (improvement >= 15) return 'Significant - Major improvement in resilience capabilities';
    if (improvement >= 10) return 'Substantial - Notable enhancement to immunity profile';
    if (improvement >= 5) return 'Moderate - Meaningful improvement in specific areas';
    return 'Incremental - Small but valuable security enhancements';
  }
}