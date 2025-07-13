/**
 * Business Model Classifier
 * Maps revenue model and operational dependency to 8 DII business models
 */

import type { 
  BusinessModel, 
  BusinessModelClassification, 
  ClassificationAnswers 
} from '@core/types/business-model.types';
import { Percentage } from '@core/types/brand.types';

export class BusinessModelClassifier {
  /**
   * Classify business model based on two key questions
   */
  static classify(answers: ClassificationAnswers): BusinessModelClassification {
    const { revenueModel, operationalDependency } = answers;
    
    // Decision matrix for classification
    const classification = this.getClassification(revenueModel, operationalDependency);
    
    return {
      model: classification.model,
      confidence: classification.confidence,
      reasoning: classification.reasoning,
      alternativeModel: classification.alternativeModel
    };
  }
  
  private static getClassification(
    revenue: ClassificationAnswers['revenueModel'],
    dependency: ClassificationAnswers['operationalDependency']
  ): BusinessModelClassification {
    // Primary classification logic based on revenue model
    switch (revenue) {
      case 'recurring_subscriptions':
        if (dependency === 'fully_digital') {
          return {
            model: 'SUBSCRIPTION_BASED',
            confidence: Percentage(95),
            reasoning: 'Pure SaaS model with recurring revenue and digital delivery'
          };
        } else {
          return {
            model: 'SUBSCRIPTION_BASED',
            confidence: Percentage(85),
            reasoning: 'Subscription model with some physical dependencies',
            alternativeModel: 'ASSET_HEAVY'
          };
        }
        
      case 'per_transaction':
        return {
          model: 'TRANSACTION_BASED',
          confidence: Percentage(90),
          reasoning: 'Revenue tied to transaction volume and processing'
        };
        
      case 'project_based':
        if (dependency === 'fully_digital') {
          return {
            model: 'ASSET_LIGHT',
            confidence: Percentage(90),
            reasoning: 'Service-based model with minimal infrastructure'
          };
        } else {
          return {
            model: 'ASSET_LIGHT',
            confidence: Percentage(75),
            reasoning: 'Project delivery with mixed digital/physical needs',
            alternativeModel: 'B2B_ENTERPRISE'
          };
        }
        
      case 'product_sales':
        if (dependency === 'physical_critical') {
          return {
            model: 'ASSET_HEAVY',
            confidence: Percentage(90),
            reasoning: 'Traditional model requiring significant physical assets'
          };
        } else {
          return {
            model: 'DIRECT_TO_CONSUMER',
            confidence: Percentage(80),
            reasoning: 'Product sales with digital/hybrid fulfillment',
            alternativeModel: 'ASSET_HEAVY'
          };
        }
        
      case 'data_monetization':
        return {
          model: 'DATA_DRIVEN',
          confidence: Percentage(95),
          reasoning: 'Primary value from data collection and analysis'
        };
        
      case 'platform_fees':
        return {
          model: 'PLATFORM_ECOSYSTEM',
          confidence: Percentage(90),
          reasoning: 'Multi-sided platform connecting different user groups'
        };
        
      case 'direct_sales':
        if (dependency === 'fully_digital') {
          return {
            model: 'DIRECT_TO_CONSUMER',
            confidence: Percentage(85),
            reasoning: 'Digital-first direct to consumer model'
          };
        } else {
          return {
            model: 'DIRECT_TO_CONSUMER',
            confidence: Percentage(90),
            reasoning: 'Traditional retail/e-commerce model'
          };
        }
        
      case 'enterprise_contracts':
        return {
          model: 'B2B_ENTERPRISE',
          confidence: Percentage(90),
          reasoning: 'Complex B2B sales with long cycles and high touch'
        };
        
      default:
        // Type safety ensures this is never reached
        const _exhaustive: never = revenue;
        throw new Error(`Unknown revenue model: ${revenue}`);
    }
  }
  
  /**
   * Get detailed explanation of classification
   */
  static explainClassification(
    model: BusinessModel,
    answers: ClassificationAnswers
  ): string[] {
    const explanations: string[] = [];
    
    // Add model-specific explanations
    switch (model) {
      case 'SUBSCRIPTION_BASED':
        explanations.push(
          'Your recurring revenue model creates predictable cash flow',
          'Customer retention is critical - churn directly impacts valuation',
          'Cyber incidents can trigger mass cancellations'
        );
        break;
        
      case 'TRANSACTION_BASED':
        explanations.push(
          'Revenue depends on transaction volume and system availability',
          'Even minutes of downtime translate to direct revenue loss',
          'Trust is paramount - security incidents can be fatal'
        );
        break;
        
      case 'DATA_DRIVEN':
        explanations.push(
          'Data is your primary asset and biggest vulnerability',
          'Breaches can trigger regulatory fines and lawsuits',
          'Privacy violations can destroy business model viability'
        );
        break;
        
      // Add other models...
    }
    
    // Add dependency-specific insights
    if (answers.operationalDependency === 'physical_critical') {
      explanations.push(
        'Physical operations create additional attack vectors',
        'Cyber-physical attacks can halt production entirely'
      );
    }
    
    return explanations;
  }
}