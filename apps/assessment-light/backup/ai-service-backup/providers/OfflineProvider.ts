/**
 * Offline AI Provider
 * Provides static responses when no AI service is available
 */

import { BaseProvider } from './BaseProvider';
import type { 
  AIRequest, 
  AIResponse, 
  ProviderConfig, 
  CompromiseAnalysisResponse,
  ExecutiveInsightsResponse 
} from '../types';

export class OfflineProvider extends BaseProvider {
  constructor(config: ProviderConfig) {
    const capabilities = {
      supportedRequestTypes: ['compromise-analysis', 'executive-insights'] as const,
      maxConcurrentRequests: 10,
      supportsStreaming: false,
      supportsCache: true,
      rateLimits: {
        requestsPerMinute: 60,
        requestsPerHour: 1000
      }
    };

    super('offline', '1.0.0', config, capabilities);
  }

  async initialize(): Promise<void> {
    this.log('info', 'Initializing offline provider');
    await this.performHealthCheck();
    this.log('info', 'Offline provider ready');
  }

  async complete(request: AIRequest): Promise<AIResponse> {
    return this.executeRequest(request.id, async () => {
      // Simulate processing delay if configured
      if (this.config.options?.simulateDelay) {
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      }

      switch (request.type) {
        case 'compromise-analysis':
          return this.generateCompromiseAnalysis(request);
        case 'executive-insights':
          return this.generateExecutiveInsights(request);
        default:
          throw new Error(`Request type '${request.type}' not supported by offline provider`);
      }
    });
  }

  async destroy(): Promise<void> {
    this.log('info', 'Offline provider destroyed');
  }

  protected async healthCheck(): Promise<void> {
    // Offline provider is always available
    return Promise.resolve();
  }

  private generateCompromiseAnalysis(request: AIRequest): CompromiseAnalysisResponse {
    const { diiScore, dimensions } = request.data;
    
    // Calculate risk score based on DII dimensions
    const riskScore = Math.max(10, Math.min(90, 100 - (diiScore * 8.5)));
    const confidence = 0.75; // Static confidence for offline mode

    // Generate risk factors based on dimensions
    const factors = this.generateRiskFactors(dimensions);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(dimensions);
    
    // Generate timeline
    const timeline = this.generateTimeline(diiScore);

    return {
      riskScore,
      confidence,
      factors,
      recommendations,
      timeline
    };
  }

  private generateExecutiveInsights(request: AIRequest): ExecutiveInsightsResponse {
    const { diiScore, dimensions, businessModel } = request.data;
    
    const summary = this.generateExecutiveSummary(diiScore, businessModel);
    const keyMetrics = this.generateKeyMetrics(diiScore, dimensions);
    const recommendations = this.generateExecutiveRecommendations(diiScore);
    const competitiveAnalysis = this.generateCompetitiveAnalysis(diiScore);

    return {
      summary,
      keyMetrics,
      recommendations,
      competitiveAnalysis
    };
  }

  private generateRiskFactors(dimensions: any) {
    const factors = [];
    
    if (dimensions.HFP > 6) {
      factors.push({
        category: 'Human Factor',
        impact: 'high' as const,
        probability: 0.8,
        description: 'High probability of human error due to insufficient security training'
      });
    }
    
    if (dimensions.BRI > 7) {
      factors.push({
        category: 'Blast Radius',
        impact: 'critical' as const,
        probability: 0.9,
        description: 'Wide impact radius indicates poor network segmentation'
      });
    }
    
    if (dimensions.RRG > 6) {
      factors.push({
        category: 'Recovery',
        impact: 'medium' as const,
        probability: 0.7,
        description: 'Recovery processes may not meet business requirements'
      });
    }

    return factors;
  }

  private generateRecommendations(dimensions: any): string[] {
    const recommendations = [];
    
    if (dimensions.TRD < 5) {
      recommendations.push('Implement redundant systems to improve revenue protection');
    }
    
    if (dimensions.AER < 5) {
      recommendations.push('Optimize security investments for better attack economics');
    }
    
    if (dimensions.HFP > 6) {
      recommendations.push('Enhance security awareness training and implement MFA');
    }
    
    if (dimensions.BRI > 6) {
      recommendations.push('Implement network segmentation and zero-trust architecture');
    }
    
    if (dimensions.RRG > 6) {
      recommendations.push('Improve backup and recovery procedures with regular testing');
    }

    return recommendations;
  }

  private generateTimeline(diiScore: number) {
    const immediate = [
      'Enable multi-factor authentication',
      'Review and update access controls',
      'Verify backup integrity'
    ];
    
    const shortTerm = [
      'Conduct security awareness training',
      'Implement network monitoring',
      'Establish incident response procedures'
    ];
    
    const longTerm = [
      'Deploy zero-trust architecture',
      'Implement continuous security monitoring',
      'Establish vendor risk management program'
    ];

    return { immediate, shortTerm, longTerm };
  }

  private generateExecutiveSummary(diiScore: number, businessModel: number): string {
    const riskLevel = diiScore < 4 ? 'high' : diiScore < 6 ? 'medium' : 'low';
    const modelNames: Record<number, string> = {
      1: 'Comercio Híbrido',
      2: 'Servicios Esenciales',
      3: 'Negocio Tradicional',
      4: 'Cadena de Valor',
      5: 'Servicios Profesionales',
      6: 'Intermediación Financiera',
      7: 'Banca Digital',
      8: 'Información Regulada'
    };

    return `Su organización con modelo ${modelNames[businessModel] || 'desconocido'} presenta un DII de ${diiScore}, indicando un nivel de riesgo ${riskLevel}. Se recomienda enfocar esfuerzos en las dimensiones de menor puntuación para mejorar la inmunidad digital.`;
  }

  private generateKeyMetrics(diiScore: number, dimensions: any) {
    return [
      {
        name: 'Digital Immunity Index',
        value: diiScore,
        unit: '/10',
        trend: 'stable' as const,
        significance: 'high' as const
      },
      {
        name: 'Capacidad Operacional',
        value: Math.round(diiScore * 10),
        unit: '%',
        trend: 'stable' as const,
        significance: 'high' as const
      },
      {
        name: 'Dimensiones Críticas',
        value: Object.values(dimensions).filter((v: any) => v < 4).length,
        trend: 'stable' as const,
        significance: 'medium' as const
      }
    ];
  }

  private generateExecutiveRecommendations(diiScore: number) {
    const recommendations = [
      {
        priority: 'high' as const,
        title: 'Implementar Redundancia Activa',
        description: 'Establecer sistemas redundantes para operaciones críticas',
        impact: 'Reducción del 40% en tiempo de degradación',
        effort: 'medium' as const,
        timeline: '3-6 meses',
        roi: 2.5
      },
      {
        priority: 'medium' as const,
        title: 'Mejorar Capacitación en Seguridad',
        description: 'Programa integral de concienciación en ciberseguridad',
        impact: 'Reducción del 60% en errores humanos',
        effort: 'low' as const,
        timeline: '1-3 meses',
        roi: 4.0
      }
    ];

    if (diiScore < 5) {
      recommendations.unshift({
        priority: 'high' as const,
        title: 'Assessment Formal Urgente',
        description: 'Evaluación completa para identificar vulnerabilidades críticas',
        impact: 'Identificación de riesgos críticos',
        effort: 'low' as const,
        timeline: '2-4 semanas',
        roi: 10.0
      });
    }

    return recommendations;
  }

  private generateCompetitiveAnalysis(diiScore: number) {
    // Industry averages (static for offline mode)
    const industryAverage = 5.2;
    const gap = Math.round((10 - diiScore) * 10);
    
    let ranking = 'Promedio';
    if (diiScore >= 7) ranking = 'Líder';
    else if (diiScore >= 6) ranking = 'Por encima del promedio';
    else if (diiScore >= 4) ranking = 'Promedio';
    else ranking = 'Por debajo del promedio';

    return {
      industryAverage,
      ranking,
      gap
    };
  }
}