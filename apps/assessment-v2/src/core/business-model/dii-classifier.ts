/**
 * DII Business Model Classifier
 * Maps revenue model and operational dependency to 8 DII-specific cyber risk models
 */

import type { 
  BusinessModel, 
  BusinessModelClassification, 
  ClassificationAnswers 
} from '@core/types/business-model.types';
import { Percentage } from '@core/types/brand.types';

export class DIIBusinessModelClassifier {
  /**
   * Classify business model based on two key questions for DII framework
   */
  static classify(answers: ClassificationAnswers): BusinessModelClassification {
    const { revenueModel, operationalDependency } = answers;
    
    // Decision matrix for DII-specific classification
    const classification = this.getClassification(revenueModel, operationalDependency);
    
    return {
      model: classification.model,
      confidence: classification.confidence,
      reasoning: classification.reasoning,
      ...(classification.alternativeModel && { alternativeModel: classification.alternativeModel })
    };
  }

  /**
   * Industry-specific shortcuts for better accuracy
   */
  static classifyByIndustry(
    industry: string,
    companyName: string,
    fallbackAnswers?: ClassificationAnswers
  ): BusinessModelClassification {
    const industryLower = industry.toLowerCase();
    const nameLower = companyName.toLowerCase();

    // Airlines → Digital Ecosystem (booking platforms) or Supply Chain
    if (industryLower.includes('airline') || industryLower.includes('aerolínea') ||
        nameLower.includes('aero') || nameLower.includes('volaris') || nameLower.includes('interjet')) {
      return {
        model: 'ECOSISTEMA_DIGITAL',
        confidence: Percentage(85),
        reasoning: 'Airlines operate digital booking ecosystems with partners, lounges, and services'
      };
    }

    // Banks → Financial Services
    if (industryLower.includes('bank') || industryLower.includes('banco') ||
        nameLower.includes('banorte') || nameLower.includes('bbva') || nameLower.includes('santander')) {
      return {
        model: 'SERVICIOS_FINANCIEROS',
        confidence: Percentage(95),
        reasoning: 'Banking operations require real-time transaction processing with zero downtime tolerance'
      };
    }

    // Retail → Hybrid Commerce
    if (industryLower.includes('retail') || industryLower.includes('comercio') ||
        nameLower.includes('liverpool') || nameLower.includes('oxxo') || nameLower.includes('walmart')) {
      return {
        model: 'COMERCIO_HIBRIDO',
        confidence: Percentage(90),
        reasoning: 'Retail operations span physical stores and digital channels requiring omnichannel security'
      };
    }

    // Software/SaaS → Critical Software
    if (industryLower.includes('software') || industryLower.includes('saas') || industryLower.includes('cloud')) {
      return {
        model: 'SOFTWARE_CRITICO',
        confidence: Percentage(90),
        reasoning: 'SaaS platforms require 24/7 availability with customer data protection'
      };
    }

    // Healthcare → Regulated Information
    if (industryLower.includes('health') || industryLower.includes('salud') || industryLower.includes('hospital') ||
        nameLower.includes('imss') || nameLower.includes('issste')) {
      return {
        model: 'INFORMACION_REGULADA',
        confidence: Percentage(95),
        reasoning: 'Healthcare data requires strict compliance with patient privacy regulations'
      };
    }

    // Logistics → Supply Chain
    if (industryLower.includes('logistics') || industryLower.includes('logística') || 
        industryLower.includes('shipping') || nameLower.includes('dhl') || nameLower.includes('fedex')) {
      return {
        model: 'CADENA_SUMINISTRO',
        confidence: Percentage(90),
        reasoning: 'Logistics operations depend on real-time tracking and partner integrations'
      };
    }

    // Manufacturing with legacy → Legacy Infrastructure
    if (industryLower.includes('manufacturing') || industryLower.includes('oil') || 
        industryLower.includes('energy') || nameLower.includes('pemex') || nameLower.includes('cfe')) {
      return {
        model: 'INFRAESTRUCTURA_HEREDADA',
        confidence: Percentage(85),
        reasoning: 'Traditional infrastructure with digital transformation creates hybrid vulnerabilities'
      };
    }

    // Data/Analytics → Data Services
    if (industryLower.includes('analytics') || industryLower.includes('data') || 
        industryLower.includes('research') || industryLower.includes('credit bureau')) {
      return {
        model: 'SERVICIOS_DATOS',
        confidence: Percentage(90),
        reasoning: 'Business model depends on data collection, processing, and monetization'
      };
    }

    // Marketplaces/Platforms → Digital Ecosystem
    if (industryLower.includes('marketplace') || industryLower.includes('platform') ||
        nameLower.includes('mercado') || nameLower.includes('rappi') || nameLower.includes('uber')) {
      return {
        model: 'ECOSISTEMA_DIGITAL',
        confidence: Percentage(90),
        reasoning: 'Multi-sided platform connecting buyers, sellers, and service providers'
      };
    }

    // Fall back to answer-based classification
    if (fallbackAnswers) {
      return this.classify(fallbackAnswers);
    }

    // Default to hybrid commerce for unknown industries
    return {
      model: 'COMERCIO_HIBRIDO',
      confidence: Percentage(60),
      reasoning: 'Unable to determine specific model, defaulting to most common hybrid pattern'
    };
  }
  
  private static getClassification(
    revenue: ClassificationAnswers['revenueModel'],
    dependency: ClassificationAnswers['operationalDependency']
  ): BusinessModelClassification {
    // DII-specific classification matrix
    switch (revenue) {
      case 'recurring_subscriptions':
        if (dependency === 'fully_digital') {
          return {
            model: 'SOFTWARE_CRITICO',
            confidence: Percentage(95),
            reasoning: 'Critical SaaS platform with recurring revenue requiring high availability'
          };
        } else if (dependency === 'hybrid_model') {
          return {
            model: 'SOFTWARE_CRITICO',
            confidence: Percentage(80),
            reasoning: 'Software service with some physical touchpoints but primarily digital delivery',
            alternativeModel: 'ECOSISTEMA_DIGITAL'
          };
        } else {
          return {
            model: 'INFRAESTRUCTURA_HEREDADA',
            confidence: Percentage(75),
            reasoning: 'Subscription service built on legacy physical infrastructure',
            alternativeModel: 'SOFTWARE_CRITICO'
          };
        }
        
      case 'per_transaction':
        if (dependency === 'fully_digital') {
          return {
            model: 'SERVICIOS_FINANCIEROS',
            confidence: Percentage(90),
            reasoning: 'Digital payment processing requiring real-time availability and security'
          };
        } else {
          return {
            model: 'SERVICIOS_FINANCIEROS',
            confidence: Percentage(85),
            reasoning: 'Transaction processing with physical payment points (ATMs, POS)',
            alternativeModel: 'COMERCIO_HIBRIDO'
          };
        }
        
      case 'platform_fees':
        return {
          model: 'ECOSISTEMA_DIGITAL',
          confidence: Percentage(95),
          reasoning: 'Digital ecosystem monetizing through platform participation fees'
        };
        
      case 'data_monetization':
        return {
          model: 'SERVICIOS_DATOS',
          confidence: Percentage(95),
          reasoning: 'Business model centered on data collection, analysis, and insights'
        };
        
      case 'product_sales':
        if (dependency === 'physical_critical') {
          return {
            model: 'CADENA_SUMINISTRO',
            confidence: Percentage(85),
            reasoning: 'Physical product distribution requiring supply chain coordination',
            alternativeModel: 'COMERCIO_HIBRIDO'
          };
        } else if (dependency === 'hybrid_model') {
          return {
            model: 'COMERCIO_HIBRIDO',
            confidence: Percentage(90),
            reasoning: 'Omnichannel retail combining physical and digital sales channels'
          };
        } else {
          return {
            model: 'COMERCIO_HIBRIDO',
            confidence: Percentage(80),
            reasoning: 'Digital commerce platform with logistics integration'
          };
        }
        
      case 'direct_sales':
        if (dependency === 'physical_critical') {
          return {
            model: 'COMERCIO_HIBRIDO',
            confidence: Percentage(90),
            reasoning: 'Traditional retail with digital transformation initiatives'
          };
        } else if (dependency === 'hybrid_model') {
          return {
            model: 'COMERCIO_HIBRIDO',
            confidence: Percentage(95),
            reasoning: 'Hybrid commerce model balancing physical and digital channels'
          };
        } else {
          return {
            model: 'ECOSISTEMA_DIGITAL',
            confidence: Percentage(75),
            reasoning: 'Digital-first direct sales potentially evolving into platform',
            alternativeModel: 'COMERCIO_HIBRIDO'
          };
        }
        
      case 'enterprise_contracts':
        if (dependency === 'physical_critical') {
          return {
            model: 'INFRAESTRUCTURA_HEREDADA',
            confidence: Percentage(85),
            reasoning: 'Enterprise services managing legacy infrastructure and systems'
          };
        } else if (dependency === 'hybrid_model') {
          return {
            model: 'INFRAESTRUCTURA_HEREDADA',
            confidence: Percentage(80),
            reasoning: 'B2B services bridging legacy and modern systems',
            alternativeModel: 'SOFTWARE_CRITICO'
          };
        } else {
          return {
            model: 'SOFTWARE_CRITICO',
            confidence: Percentage(85),
            reasoning: 'Enterprise software solutions critical for client operations'
          };
        }
        
      case 'project_based':
        if (dependency === 'fully_digital') {
          return {
            model: 'SOFTWARE_CRITICO',
            confidence: Percentage(80),
            reasoning: 'Digital consulting and implementation services',
            alternativeModel: 'SERVICIOS_DATOS'
          };
        } else if (dependency === 'physical_critical') {
          return {
            model: 'INFRAESTRUCTURA_HEREDADA',
            confidence: Percentage(75),
            reasoning: 'Project services for physical infrastructure modernization'
          };
        } else {
          // Check if it's more data-focused
          return {
            model: 'SERVICIOS_DATOS',
            confidence: Percentage(70),
            reasoning: 'Professional services potentially involving data analysis',
            alternativeModel: 'SOFTWARE_CRITICO'
          };
        }
        
      default: {
        // Ensure exhaustive check
        const _exhaustive: never = revenue;
        return _exhaustive;
      }
    }
  }
  
  /**
   * Get cyber risk-focused explanation of classification
   */
  static explainCyberRisk(
    model: BusinessModel,
    answers: ClassificationAnswers
  ): string[] {
    const explanations: string[] = [];
    
    // Add model-specific cyber risk explanations
    switch (model) {
      case 'COMERCIO_HIBRIDO':
        explanations.push(
          'Omnichannel operations create multiple attack vectors across physical and digital',
          'POS malware and e-commerce skimming are constant threats',
          'Customer data spans multiple systems increasing breach impact'
        );
        break;
        
      case 'SOFTWARE_CRITICO':
        explanations.push(
          'Downtime directly impacts all customers simultaneously',
          'API vulnerabilities can expose entire customer base',
          'Supply chain attacks through dependencies are increasing'
        );
        break;
        
      case 'SERVICIOS_DATOS':
        explanations.push(
          'Data concentration makes you a high-value target',
          'Regulatory fines for breaches can exceed cyber insurance',
          'Insider threats have catastrophic potential with data access'
        );
        break;
        
      case 'ECOSISTEMA_DIGITAL':
        explanations.push(
          'Third-party vulnerabilities become your vulnerabilities',
          'Platform abuse affects trust across entire ecosystem',
          'Complex permission models create security gaps'
        );
        break;
        
      case 'SERVICIOS_FINANCIEROS':
        explanations.push(
          'Zero tolerance for transaction errors or downtime',
          'Regulatory compliance requires continuous investment',
          'Financial data attracts sophisticated criminal groups'
        );
        break;
        
      case 'INFRAESTRUCTURA_HEREDADA':
        explanations.push(
          'Legacy systems have known vulnerabilities difficult to patch',
          'Digital transformation creates hybrid attack surface',
          'Ransomware specifically targets operational technology'
        );
        break;
        
      case 'CADENA_SUMINISTRO':
        explanations.push(
          'Partner integrations multiply potential entry points',
          'IoT and tracking devices expand attack surface',
          'Supply chain attacks can cascade across network'
        );
        break;
        
      case 'INFORMACION_REGULADA':
        explanations.push(
          'Healthcare and government data attracts nation-state actors',
          'Compliance requirements may conflict with security needs',
          'Ransomware knows you must pay to restore critical services'
        );
        break;
    }
    
    // Add dependency-specific cyber risks
    if (answers.operationalDependency === 'physical_critical') {
      explanations.push(
        'Cyber-physical attacks can cause real-world damage',
        'Recovery requires on-site intervention increasing downtime'
      );
    } else if (answers.operationalDependency === 'hybrid_model') {
      explanations.push(
        'Integration points between physical and digital are vulnerable',
        'Security governance must span different operational models'
      );
    }
    
    return explanations;
  }

  /**
   * Get recommended DII scenario questions for the model
   */
  static getScenarioMapping(model: BusinessModel): string {
    const mapping: Record<string, string> = {
      'COMERCIO_HIBRIDO': '1_comercio_hibrido',
      'SOFTWARE_CRITICO': '2_software_critico',
      'SERVICIOS_DATOS': '3_servicios_datos',
      'ECOSISTEMA_DIGITAL': '4_ecosistema_digital',
      'SERVICIOS_FINANCIEROS': '5_servicios_financieros',
      'INFRAESTRUCTURA_HEREDADA': '6_infraestructura_heredada',
      'CADENA_SUMINISTRO': '7_cadena_suministro',
      'INFORMACION_REGULADA': '8_informacion_regulada',
      // Legacy mappings
      'SUBSCRIPTION_BASED': '2_software_critico',
      'TRANSACTION_BASED': '5_servicios_financieros',
      'ASSET_LIGHT': '2_software_critico',
      'ASSET_HEAVY': '6_infraestructura_heredada',
      'DATA_DRIVEN': '3_servicios_datos',
      'PLATFORM_ECOSYSTEM': '4_ecosistema_digital',
      'DIRECT_TO_CONSUMER': '1_comercio_hibrido',
      'B2B_ENTERPRISE': '5_servicios_financieros'
    };
    
    return mapping[model] || '1_comercio_hibrido'; // Default to comercio_hibrido if not found
  }
}