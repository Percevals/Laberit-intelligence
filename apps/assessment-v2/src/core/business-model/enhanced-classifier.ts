/**
 * Enhanced Business Model Classifier
 * Uses comprehensive definitions and signals for accurate classification
 */

import type { DIIBusinessModel } from '@/types/business-model';
import { 
  BUSINESS_MODEL_DEFINITIONS,
  findBestMatchingModel,
  getModelDefinition,
  hasSignal,
  calculateSignalScore,
  DII_BUSINESS_MODELS
} from './business-model-definitions';

export interface ClassificationInput {
  name: string;
  industry?: string;
  description?: string;
  domain?: string;
  employees?: number;
  revenue?: number;
  headquarters?: string;
  website?: string;
  // Additional signals
  hasPhysicalStores?: boolean;
  hasEcommerce?: boolean;
  isB2B?: boolean;
  isSaaS?: boolean;
  isRegulated?: boolean;
  operatesCriticalInfrastructure?: boolean;
  primaryRevenueModel?: string;
  technologyStack?: string[];
  certifications?: string[];
  [key: string]: any;
}

export interface ClassificationResult {
  model: DIIBusinessModel;
  confidence: number;
  reasoning: string;
  alternativeModels?: Array<{
    model: DIIBusinessModel;
    confidence: number;
  }>;
  signals: {
    matched: string[];
    missing: string[];
    prohibited: string[];
  };
  riskProfile: {
    digitalDependency: number;
    interruptionToleranceHours: number;
    estimatedImpactPerHour: number;
    primaryRisks: string[];
  };
}

export class EnhancedBusinessModelClassifier {
  /**
   * Classify a company into one of the 8 DII business models
   */
  static classify(input: ClassificationInput): ClassificationResult {
    // First, try industry-specific shortcuts for high confidence
    const shortcutResult = this.tryIndustryShortcuts(input);
    if (shortcutResult && shortcutResult.confidence >= 0.8) {
      return shortcutResult;
    }
    
    // Enrich input with derived signals
    const enrichedInput = this.enrichInput(input);
    
    // Calculate scores for all models
    const modelScores = this.calculateAllModelScores(enrichedInput);
    
    // Select best model
    const bestModel = this.selectBestModel(modelScores);
    
    // Build comprehensive result
    return this.buildClassificationResult(bestModel, modelScores, enrichedInput);
  }
  
  /**
   * Try industry-specific shortcuts for common patterns
   */
  private static tryIndustryShortcuts(input: ClassificationInput): ClassificationResult | null {
    const name = input.name?.toLowerCase() || '';
    const industry = input.industry?.toLowerCase() || '';
    const description = input.description?.toLowerCase() || '';
    const combined = `${name} ${industry} ${description}`;
    
    // Financial services shortcuts
    if (industry.includes('bank') || industry.includes('financ') || 
        name.includes('bank') || name.includes('pay') || 
        combined.includes('fintech')) {
      const def = getModelDefinition('SERVICIOS_FINANCIEROS');
      return {
        model: 'SERVICIOS_FINANCIEROS',
        confidence: 0.85,
        reasoning: 'Strong financial services indicators in name/industry',
        signals: {
          matched: ['financial_keywords', 'payment_processing'],
          missing: [],
          prohibited: []
        },
        riskProfile: {
          digitalDependency: def.digitalDependency.max,
          interruptionToleranceHours: def.interruptionTolerance.min,
          estimatedImpactPerHour: def.cyberImpact.perHourMax,
          primaryRisks: def.cyberImpact.primaryRisks
        }
      };
    }
    
    // Airline/travel = Digital Ecosystem
    if (industry.includes('airline') || industry.includes('aero') || 
        name.includes('aero') || combined.includes('booking')) {
      const def = getModelDefinition('ECOSISTEMA_DIGITAL');
      return {
        model: 'ECOSISTEMA_DIGITAL',
        confidence: 0.85,
        reasoning: 'Airlines operate booking platforms and partner ecosystems',
        signals: {
          matched: ['booking_platform', 'partner_network', 'multi_sided'],
          missing: [],
          prohibited: []
        },
        riskProfile: {
          digitalDependency: def.digitalDependency.max,
          interruptionToleranceHours: def.interruptionTolerance.min,
          estimatedImpactPerHour: def.cyberImpact.perHourMax,
          primaryRisks: def.cyberImpact.primaryRisks
        }
      };
    }
    
    // Healthcare = Regulated Information
    if (industry.includes('health') || industry.includes('medical') || 
        industry.includes('hospital') || name.includes('clinic')) {
      const def = getModelDefinition('INFORMACION_REGULADA');
      return {
        model: 'INFORMACION_REGULADA',
        confidence: 0.9,
        reasoning: 'Healthcare organizations handle regulated patient data',
        signals: {
          matched: ['healthcare_industry', 'patient_data', 'compliance_required'],
          missing: [],
          prohibited: []
        },
        riskProfile: {
          digitalDependency: def.digitalDependency.max,
          interruptionToleranceHours: def.interruptionTolerance.min,
          estimatedImpactPerHour: def.cyberImpact.perHourMax,
          primaryRisks: def.cyberImpact.primaryRisks
        }
      };
    }
    
    // Government/utilities = Legacy Infrastructure
    if (industry.includes('government') || industry.includes('utility') || 
        industry.includes('energy') || name.includes('federal') || 
        name.includes('nacional')) {
      const def = getModelDefinition('INFRAESTRUCTURA_HEREDADA');
      return {
        model: 'INFRAESTRUCTURA_HEREDADA',
        confidence: 0.85,
        reasoning: 'Government and utilities typically run legacy systems',
        signals: {
          matched: ['government_entity', 'critical_infrastructure', 'legacy_systems'],
          missing: [],
          prohibited: []
        },
        riskProfile: {
          digitalDependency: def.digitalDependency.max,
          interruptionToleranceHours: def.interruptionTolerance.max,
          estimatedImpactPerHour: def.cyberImpact.perHourMax,
          primaryRisks: def.cyberImpact.primaryRisks
        }
      };
    }
    
    return null;
  }
  
  /**
   * Enrich input with derived signals
   */
  private static enrichInput(input: ClassificationInput): ClassificationInput {
    const enriched = { ...input };
    
    // Derive signals from employee count
    if (input.employees) {
      if (input.employees > 10000) {
        enriched.largeEnterprise = true;
      } else if (input.employees < 50) {
        enriched.startup = true;
      }
    }
    
    // Derive signals from revenue
    if (input.revenue) {
      if (input.revenue > 1000000000) { // > $1B
        enriched.unicorn = true;
      }
    }
    
    // Derive signals from domain
    if (input.domain) {
      if (input.domain.includes('.gob.') || input.domain.includes('.gov.')) {
        enriched.governmentDomain = true;
      }
    }
    
    // Derive B2B signals
    if (input.description) {
      const desc = input.description.toLowerCase();
      if (desc.includes('enterprise') || desc.includes('b2b') || 
          desc.includes('corporate') || desc.includes('business solutions')) {
        enriched.isB2B = true;
      }
      if (desc.includes('saas') || desc.includes('software as a service') || 
          desc.includes('cloud platform')) {
        enriched.isSaaS = true;
      }
    }
    
    return enriched;
  }
  
  /**
   * Calculate scores for all business models
   */
  private static calculateAllModelScores(input: ClassificationInput): Map<DIIBusinessModel, {
    score: number;
    matchedSignals: string[];
    missingSignals: string[];
    prohibitedSignals: string[];
  }> {
    const scores = new Map();
    
    Object.entries(BUSINESS_MODEL_DEFINITIONS).forEach(([modelId, definition]) => {
      const matchedSignals: string[] = [];
      const missingSignals: string[] = [];
      const prohibitedSignals: string[] = [];
      
      // Check required signals
      let requiredScore = 0;
      definition.requiredSignals.forEach(signal => {
        if (hasSignal(input, signal)) {
          matchedSignals.push(signal);
          requiredScore += 40;
        } else {
          missingSignals.push(signal);
        }
      });
      
      // Must have at least one required signal
      if (matchedSignals.length === 0) {
        scores.set(modelId, {
          score: 0,
          matchedSignals: [],
          missingSignals: definition.requiredSignals,
          prohibitedSignals: []
        });
        return;
      }
      
      // Check prohibited signals
      let disqualified = false;
      definition.prohibitedSignals.forEach(signal => {
        if (hasSignal(input, signal)) {
          prohibitedSignals.push(signal);
          disqualified = true;
        }
      });
      
      if (disqualified) {
        scores.set(modelId, {
          score: 0,
          matchedSignals,
          missingSignals,
          prohibitedSignals
        });
        return;
      }
      
      // Check optional signals
      let optionalScore = 0;
      definition.optionalSignals.forEach(signal => {
        if (hasSignal(input, signal)) {
          matchedSignals.push(signal);
          optionalScore += 15;
        }
      });
      
      // Check industry keywords
      let keywordScore = 0;
      const inputStr = JSON.stringify(input).toLowerCase();
      definition.industryKeywords.forEach(keyword => {
        if (inputStr.includes(keyword.toLowerCase())) {
          keywordScore += 20;
        }
      });
      
      // Check confidence boost keywords
      let boostScore = 0;
      definition.confidenceBoostKeywords.forEach(keyword => {
        if (inputStr.includes(keyword.toLowerCase())) {
          boostScore += 25;
        }
      });
      
      // Priority bonus (lower priority number = higher bonus)
      const priorityScore = (9 - definition.classificationPriority) * 10;
      
      // Calculate total score
      const totalScore = requiredScore + optionalScore + keywordScore + boostScore + priorityScore;
      
      scores.set(modelId, {
        score: totalScore,
        matchedSignals,
        missingSignals,
        prohibitedSignals
      });
    });
    
    return scores;
  }
  
  /**
   * Select best model from scores
   */
  private static selectBestModel(scores: Map<DIIBusinessModel, any>): {
    model: DIIBusinessModel;
    scoreData: any;
  } {
    let bestModel: DIIBusinessModel = 'COMERCIO_HIBRIDO'; // Default
    let bestScore = 0;
    let bestScoreData: any = null;
    
    scores.forEach((scoreData, model) => {
      if (scoreData.score > bestScore) {
        bestScore = scoreData.score;
        bestModel = model as DIIBusinessModel;
        bestScoreData = scoreData;
      }
    });
    
    return { model: bestModel, scoreData: bestScoreData };
  }
  
  /**
   * Build comprehensive classification result
   */
  private static buildClassificationResult(
    bestModel: { model: DIIBusinessModel; scoreData: any },
    allScores: Map<DIIBusinessModel, any>,
    input: ClassificationInput
  ): ClassificationResult {
    const definition = getModelDefinition(bestModel.model);
    const scoreData = bestModel.scoreData || { score: 0, matchedSignals: [], missingSignals: [], prohibitedSignals: [] };
    
    // Calculate confidence (0-1 scale)
    const maxPossibleScore = 300; // Approximate max score
    const confidence = Math.min(0.95, Math.max(0.4, scoreData.score / maxPossibleScore));
    
    // Find alternative models
    const alternatives: Array<{ model: DIIBusinessModel; confidence: number }> = [];
    allScores.forEach((data, model) => {
      if (model !== bestModel.model && data.score > 50) {
        alternatives.push({
          model: model as DIIBusinessModel,
          confidence: Math.min(0.7, data.score / maxPossibleScore)
        });
      }
    });
    alternatives.sort((a, b) => b.confidence - a.confidence);
    
    // Build reasoning
    const reasoning = this.buildReasoning(bestModel.model, scoreData, confidence);
    
    // Calculate risk profile
    const avgDigitalDependency = (definition.digitalDependency.min + definition.digitalDependency.max) / 2;
    const avgInterruption = (definition.interruptionTolerance.min + definition.interruptionTolerance.max) / 2;
    const avgImpact = (definition.cyberImpact.perHourMin + definition.cyberImpact.perHourMax) / 2;
    
    return {
      model: bestModel.model,
      confidence,
      reasoning,
      alternativeModels: alternatives.slice(0, 2),
      signals: {
        matched: scoreData.matchedSignals || [],
        missing: scoreData.missingSignals || [],
        prohibited: scoreData.prohibitedSignals || []
      },
      riskProfile: {
        digitalDependency: avgDigitalDependency,
        interruptionToleranceHours: avgInterruption,
        estimatedImpactPerHour: avgImpact * 1000, // Convert to USD
        primaryRisks: definition.cyberImpact.primaryRisks
      }
    };
  }
  
  /**
   * Build human-readable reasoning
   */
  private static buildReasoning(
    model: DIIBusinessModel,
    scoreData: any,
    confidence: number
  ): string {
    const definition = getModelDefinition(model);
    const matchedCount = scoreData.matchedSignals?.length || 0;
    
    let reasoning = `Classified as ${definition.name} with ${Math.round(confidence * 100)}% confidence. `;
    
    if (matchedCount > 0) {
      reasoning += `Matched ${matchedCount} key signals including: ${scoreData.matchedSignals.slice(0, 3).join(', ')}. `;
    }
    
    reasoning += definition.coreDefinition;
    
    return reasoning;
  }
  
  /**
   * Validate if a classification makes sense
   */
  static validateClassification(
    input: ClassificationInput,
    suggestedModel: DIIBusinessModel
  ): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const definition = getModelDefinition(suggestedModel);
    
    // Check for obvious mismatches
    if (suggestedModel === 'SERVICIOS_FINANCIEROS' && !input.isRegulated) {
      issues.push('Financial services typically require regulatory compliance');
      suggestions.push('Verify if the company has financial licenses or regulatory oversight');
    }
    
    if (suggestedModel === 'SOFTWARE_CRITICO' && input.hasPhysicalStores) {
      issues.push('Critical software providers typically don\'t have physical stores');
      suggestions.push('Consider COMERCIO_HIBRIDO if physical retail is significant');
    }
    
    if (suggestedModel === 'ECOSISTEMA_DIGITAL' && !input.isB2B && !input.description?.includes('platform')) {
      issues.push('Digital ecosystems are typically multi-sided platforms');
      suggestions.push('Verify if the company connects multiple user types (buyers/sellers, drivers/riders, etc.)');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}

// Export convenience function
export function classifyBusinessModel(input: ClassificationInput): ClassificationResult {
  return EnhancedBusinessModelClassifier.classify(input);
}