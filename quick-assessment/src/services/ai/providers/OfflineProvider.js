/**
 * OfflineProvider - Offline AI provider for demos and fallback
 * 
 * Provides realistic responses without requiring any AI service.
 * Uses DII business logic to generate contextually appropriate insights.
 */

import { BaseProvider } from './BaseProvider.js';

export class OfflineProvider extends BaseProvider {
  constructor(config = {}) {
    super(config);
    
    // Business model risk profiles based on actual DII 4.0 models
    this.riskProfiles = {
      1: { name: 'Comercio Híbrido', baseRisk: 0.45, diiRange: [1.5, 2.0] },
      2: { name: 'Software Crítico', baseRisk: 0.65, diiRange: [0.8, 1.2] },
      3: { name: 'Servicios de Datos', baseRisk: 0.72, diiRange: [0.5, 0.9] },
      4: { name: 'Ecosistema Digital', baseRisk: 0.78, diiRange: [0.4, 0.8] },
      5: { name: 'Servicios Financieros', baseRisk: 0.85, diiRange: [0.2, 0.6] },
      6: { name: 'Infraestructura Heredada', baseRisk: 0.82, diiRange: [0.2, 0.5] },
      7: { name: 'Cadena de Suministro', baseRisk: 0.68, diiRange: [0.4, 0.8] },
      8: { name: 'Información Regulada', baseRisk: 0.75, diiRange: [0.4, 0.7] }
    };

    // Common compromise indicators by dimension
    this.compromiseIndicators = {
      trd: {
        high: ['Revenue impact within hours', 'No operational redundancy', 'Single points of failure'],
        medium: ['Revenue impact within days', 'Limited redundancy', 'Some backup systems'],
        low: ['Revenue protected for weeks', 'Full redundancy', 'Tested failover systems']
      },
      aer: {
        high: ['Low cost to attack', 'Public vulnerabilities', 'Default configurations'],
        medium: ['Moderate attack cost', 'Some hardening', 'Basic security controls'],
        low: ['High attack cost', 'Advanced defenses', 'Layered security']
      },
      hfp: {
        high: ['No security training', 'Phishing success >20%', 'Weak access controls'],
        medium: ['Annual training only', 'Phishing success 5-20%', 'Basic MFA'],
        low: ['Continuous training', 'Phishing success <5%', 'Zero-trust architecture']
      },
      bri: {
        high: ['No network segmentation', 'Flat architecture', 'Unrestricted lateral movement'],
        medium: ['Basic segmentation', 'Some isolation', 'Limited lateral movement'],
        low: ['Micro-segmentation', 'Zero-trust network', 'Contained blast radius']
      },
      rrg: {
        high: ['No tested recovery', 'Recovery time >1 week', 'Data loss likely'],
        medium: ['Annual DR tests', 'Recovery time 1-7 days', 'Some data loss'],
        low: ['Continuous DR testing', 'Recovery <24 hours', 'Zero data loss']
      }
    };
  }

  isAvailable() {
    return true; // Always available
  }

  getCapabilities() {
    return {
      compromiseAnalysis: true,
      executiveInsights: true,
      threatContext: true,
      scenarioSimulation: true,
      realtimeAnalysis: false // Not real-time, but provides instant responses
    };
  }

  async complete(request) {
    this.validateRequest(request);

    // Simulate processing delay for realism
    await this.simulateDelay();

    switch (request.type) {
      case 'compromise_analysis':
        return this.analyzeCompromise(request.data);
      
      case 'executive_insights':
        return this.generateExecutiveInsights(request.data);
      
      case 'threat_context':
        return this.getThreatContext(request.data);
      
      case 'scenario_simulation':
        return this.simulateScenario(request.data);
      
      default:
        return this.genericResponse(request);
    }
  }

  /**
   * Analyze compromise probability based on assessment data
   */
  async analyzeCompromise(data) {
    const profile = this.riskProfiles[data.businessModel] || this.riskProfiles[1];
    const baseRisk = profile.baseRisk;
    
    // Adjust risk based on dimension scores
    let adjustedRisk = baseRisk;
    const indicators = [];
    const criticalGaps = [];
    
    // Analyze each dimension
    if (data.scores) {
      Object.entries(data.scores).forEach(([dimension, score]) => {
        if (score < 3) {
          adjustedRisk += 0.05;
          const dimensionIndicators = this.compromiseIndicators[dimension]?.high || [];
          indicators.push(...dimensionIndicators);
          criticalGaps.push(this.getDimensionName(dimension));
        } else if (score < 7) {
          adjustedRisk += 0.02;
          const dimensionIndicators = this.compromiseIndicators[dimension]?.medium || [];
          indicators.push(...dimensionIndicators.slice(0, 1));
        } else {
          adjustedRisk -= 0.03;
        }
      });
    }
    
    // Ensure risk stays within bounds
    adjustedRisk = Math.max(0.1, Math.min(0.95, adjustedRisk));
    
    // Determine confidence based on data completeness
    const confidence = data.scores && Object.keys(data.scores).length >= 5 ? 'high' : 'medium';
    
    // Generate recommendation based on highest risk dimension
    const recommendation = this.generateRecommendation(data, criticalGaps);
    
    return {
      compromiseScore: Number(adjustedRisk.toFixed(2)),
      confidence,
      indicators: indicators.slice(0, 5), // Top 5 indicators
      criticalGaps: criticalGaps.slice(0, 3), // Top 3 gaps
      recommendation,
      analysis: `Based on ${profile.name} profile and current security posture, organization shows ${adjustedRisk > 0.7 ? 'high' : adjustedRisk > 0.4 ? 'moderate' : 'low'} compromise indicators.`
    };
  }

  /**
   * Generate executive insights
   */
  async generateExecutiveInsights(data) {
    const profile = this.riskProfiles[data.businessModel] || this.riskProfiles[1];
    const diiScore = data.scores?.diiScore || this.calculateEstimatedDII(data);
    
    const insights = [];
    
    // Financial impact insight
    insights.push({
      title: 'Costo Potencial de Incidente',
      impact: this.estimateFinancialImpact(profile, diiScore),
      comparison: `${diiScore < 2 ? '3x' : diiScore < 5 ? '1.5x' : '0.8x'} promedio del sector`,
      action: 'Evaluar ROI de mejoras en inmunidad digital'
    });
    
    // Operational resilience insight
    insights.push({
      title: 'Continuidad Operacional',
      impact: `${diiScore < 2 ? '>72' : diiScore < 5 ? '24-72' : '<24'} horas de interrupción esperada`,
      comparison: `${profile.name} típicamente ${diiScore < profile.diiRange[1] ? 'supera' : 'cumple'} estándares`,
      action: diiScore < 2 ? 'Implementar plan de continuidad urgente' : 'Optimizar tiempo de recuperación'
    });
    
    // Competitive position insight
    insights.push({
      title: 'Posición Competitiva',
      impact: diiScore < 2 ? 'Vulnerable a pérdida de clientes post-incidente' : 'Preparado para mantener confianza',
      comparison: `${diiScore < 3 ? 'Rezagado' : diiScore < 6 ? 'En línea' : 'Líder'} en el sector`,
      action: 'Certificar madurez de seguridad para diferenciación'
    });
    
    return {
      executiveSummary: this.generateExecutiveSummary(profile, diiScore),
      insights,
      urgency: diiScore < 2 ? 'immediate' : diiScore < 5 ? 'high' : 'medium',
      nextSteps: this.generateNextSteps(diiScore)
    };
  }

  /**
   * Get threat context for business model
   */
  async getThreatContext(data) {
    const profile = this.riskProfiles[data.businessModel] || this.riskProfiles[1];
    
    const threatActors = this.getThreatActors(profile.name, data.region);
    const recentIncidents = this.getRecentIncidents(profile.name, data.region);
    const emergingVectors = this.getEmergingVectors(profile.name);
    
    return {
      businessModel: profile.name,
      region: data.region || 'LATAM',
      threatLandscape: {
        severity: profile.baseRisk > 0.7 ? 'Critical' : profile.baseRisk > 0.5 ? 'High' : 'Medium',
        trend: 'Increasing', // In reality, this would be dynamic
        activeActors: threatActors,
        recentIncidents,
        emergingVectors
      },
      recommendations: this.getThreatRecommendations(profile, threatActors)
    };
  }

  /**
   * Simulate scenario changes
   */
  async simulateScenario(data) {
    const currentDII = data.scores?.diiScore || this.calculateEstimatedDII(data);
    const changes = data.changes || {};
    
    // Calculate impact of changes
    let newDII = currentDII;
    const improvements = [];
    
    Object.entries(changes).forEach(([dimension, change]) => {
      const impact = this.calculateChangeImpact(dimension, change, currentDII);
      newDII += impact;
      
      if (impact > 0) {
        improvements.push({
          dimension: this.getDimensionName(dimension),
          impact: `+${(impact).toFixed(1)} DII points`,
          timeframe: this.getImplementationTime(dimension, change)
        });
      }
    });
    
    // Ensure DII stays within bounds
    newDII = Math.max(0.1, Math.min(10, newDII));
    
    const improvementPercentage = ((newDII - currentDII) / currentDII * 100).toFixed(0);
    const roiMonths = this.calculateROI(currentDII, newDII, changes);
    
    return {
      currentDII: currentDII.toFixed(1),
      projectedDII: newDII.toFixed(1),
      improvementPercentage: `${improvementPercentage}%`,
      improvements,
      roiTimeline: `${roiMonths} months`,
      riskReduction: this.calculateRiskReduction(currentDII, newDII),
      implementation: this.getImplementationPlan(changes)
    };
  }

  async getInsight(data, type) {
    return this.complete({
      type: type,
      data: data
    });
  }

  // Helper methods

  async simulateDelay() {
    // Simulate processing time (100-300ms)
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  }

  getDimensionName(dimension) {
    const names = {
      trd: 'Time to Revenue Degradation',
      aer: 'Attack Economics Ratio',
      hfp: 'Human Failure Probability',
      bri: 'Blast Radius Index',
      rrg: 'Recovery Reality Gap'
    };
    return names[dimension] || dimension;
  }

  calculateEstimatedDII(data) {
    // Simplified DII calculation for offline mode
    if (!data.scores) return 2.5;
    
    const scores = Object.values(data.scores);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Map average score (1-10) to DII (0.1-10)
    return Math.max(0.1, avg);
  }

  estimateFinancialImpact(profile, diiScore, monthlyRevenue = null) {
    // Get model ID to look up base impacts
    const modelId = typeof profile === 'object' ? 
      Object.keys(this.riskProfiles).find(key => this.riskProfiles[key].name === profile.name) :
      profile;
    
    // If we have actual revenue, use it for more accurate calculations
    if (monthlyRevenue) {
      const hourlyRevenue = monthlyRevenue / (30 * 24);
      
      // Use profile data if available, otherwise use defaults
      const digitalDep = 0.7; // Default 70% digital dependency
      const undetectedHours = 6;
      
      // Calculate phased impact
      const degradationPhases = [
        { hours: 24, rate: 0.1 * digitalDep },
        { hours: 72, rate: 0.4 * digitalDep },
        { hours: 168, rate: 0.8 * digitalDep }
      ];
      
      let totalImpact = 0;
      degradationPhases.forEach(phase => {
        const hoursInPhase = Math.max(0, phase.hours - undetectedHours);
        totalImpact += hourlyRevenue * phase.rate * hoursInPhase;
      });
      
      const multiplier = diiScore < 2 ? 2 : diiScore < 5 ? 1.2 : 0.7;
      return totalImpact * multiplier;
    }
    
    // Fallback to estimates if no revenue provided
    const baseImpact = {
      1: 800000,   // Comercio Híbrido
      2: 1500000,  // Software Crítico
      3: 2000000,  // Servicios de Datos
      4: 3000000,  // Ecosistema Digital
      5: 5000000,  // Servicios Financieros
      6: 4000000,  // Infraestructura Heredada
      7: 2500000,  // Cadena de Suministro
      8: 3500000   // Información Regulada
    };
    
    const modelId = Object.keys(this.riskProfiles).find(
      key => this.riskProfiles[key].name === profile.name
    );
    
    const multiplier = diiScore < 2 ? 3 : diiScore < 5 ? 1.5 : 0.5;
    const impact = (baseImpact[modelId] || 2000000) * multiplier;
    
    return `$${(impact / 1000000).toFixed(1)}M USD`;
  }

  generateExecutiveSummary(profile, diiScore) {
    if (diiScore < 2) {
      return `${profile.name} enfrenta riesgo crítico: operaciones cesarán bajo ataque activo.`;
    } else if (diiScore < 5) {
      return `${profile.name} muestra vulnerabilidades significativas que impactarán continuidad operacional.`;
    } else {
      return `${profile.name} demuestra resiliencia adecuada pero requiere optimización continua.`;
    }
  }

  generateRecommendation(data, criticalGaps) {
    if (criticalGaps.includes('Time to Revenue Degradation')) {
      return 'Implementar redundancia operacional y sistemas de failover automático';
    } else if (criticalGaps.includes('Human Failure Probability')) {
      return 'Establecer programa continuo de concientización y simulacros de phishing';
    } else if (criticalGaps.includes('Blast Radius Index')) {
      return 'Segmentar red urgentemente y implementar zero-trust architecture';
    } else if (criticalGaps.includes('Recovery Reality Gap')) {
      return 'Ejecutar pruebas mensuales de recuperación y actualizar planes DR';
    } else {
      return 'Fortalecer monitoreo 24/7 y capacidad de respuesta a incidentes';
    }
  }

  generateNextSteps(diiScore) {
    if (diiScore < 2) {
      return [
        'Reunión ejecutiva de emergencia esta semana',
        'Evaluación formal DII completa (2-5 días)',
        'Plan de acción 90 días con quick wins'
      ];
    } else if (diiScore < 5) {
      return [
        'Presentación a directorio próximo mes',
        'Benchmark sectorial detallado',
        'Roadmap de madurez 6-12 meses'
      ];
    } else {
      return [
        'Revisión trimestral de postura',
        'Certificación de madurez',
        'Plan de mejora continua'
      ];
    }
  }

  getThreatActors(businessModel, region) {
    const actors = {
      'Comercio Híbrido': ['Magecart', 'POS malware groups', 'Skimmers'],
      'Software Crítico': ['Equation Group', 'Fancy Bear', 'SolarWinds actors'],
      'Servicios de Datos': ['APT33', 'Turla', 'CloudAtlas'],
      'Ecosistema Digital': ['Magecart', 'Silent Librarian', 'ShinyHunters'],
      'Servicios Financieros': ['Carbanak', 'FIN7', 'Lazarus Group'],
      'Infraestructura Heredada': ['Dragonfly', 'Xenotime', 'Trisis/Triton'],
      'Cadena de Suministro': ['APT41', 'Cobalt Group', 'FIN6'],
      'Información Regulada': ['APT29', 'APT28', 'Darkside']
    };
    
    return actors[businessModel] || ['Unknown Actors'];
  }

  getRecentIncidents(businessModel, region) {
    // Simulated recent incidents
    return [
      {
        date: '2024-11',
        impact: 'Alto',
        vector: 'Ransomware',
        recovery: '5 días'
      },
      {
        date: '2024-10',
        impact: 'Medio',
        vector: 'Data breach',
        recovery: '48 horas'
      }
    ];
  }

  getEmergingVectors(businessModel) {
    const vectors = {
      'Comercio Híbrido': ['E-skimming', 'Loyalty fraud', 'Inventory manipulation'],
      'Software Crítico': ['Zero-day exploits', 'Supply chain attacks', 'Code signing abuse'],
      'Servicios de Datos': ['Model poisoning', 'Data exfiltration', 'Cloud misconfig'],
      'Ecosistema Digital': ['Supply chain injection', 'OAuth abuse', 'API key exposure'],
      'Servicios Financieros': ['API attacks', 'Mobile banking trojans', 'Deepfake fraud'],
      'Infraestructura Heredada': ['ICS/SCADA attacks', 'Firmware implants', 'Physical access'],
      'Cadena de Suministro': ['Third-party compromise', 'Logistics disruption', 'GPS spoofing'],
      'Información Regulada': ['Medical device hacking', 'HIPAA ransomware', 'Insider threats']
    };
    
    return vectors[businessModel] || ['Emerging threats'];
  }

  getThreatRecommendations(profile, threatActors) {
    return [
      `Monitor ${threatActors[0]} TTPs specifically`,
      'Implement sector-specific threat intelligence feeds',
      'Conduct tabletop exercises for likely scenarios',
      'Review and update incident response playbooks'
    ];
  }

  calculateChangeImpact(dimension, change, currentDII) {
    // Simplified impact calculation
    const impactMap = {
      trd: { improvement: 0.8, major_improvement: 1.5 },
      aer: { improvement: 0.6, major_improvement: 1.2 },
      hfp: { improvement: 0.7, major_improvement: 1.3 },
      bri: { improvement: 0.5, major_improvement: 1.0 },
      rrg: { improvement: 0.9, major_improvement: 1.7 }
    };
    
    return impactMap[dimension]?.[change] || 0.5;
  }

  getImplementationTime(dimension, change) {
    const timeMap = {
      trd: { improvement: '3-6 months', major_improvement: '6-12 months' },
      aer: { improvement: '1-3 months', major_improvement: '3-6 months' },
      hfp: { improvement: '1-2 months', major_improvement: '3-4 months' },
      bri: { improvement: '2-4 months', major_improvement: '4-8 months' },
      rrg: { improvement: '2-3 months', major_improvement: '4-6 months' }
    };
    
    return timeMap[dimension]?.[change] || '3-6 months';
  }

  calculateROI(currentDII, newDII, changes) {
    // Simplified ROI calculation
    const improvement = newDII - currentDII;
    const investmentLevel = Object.keys(changes).length;
    
    if (improvement > 3) return 6;
    if (improvement > 2) return 9;
    if (improvement > 1) return 12;
    return 18;
  }

  calculateRiskReduction(currentDII, newDII) {
    const currentRisk = 100 - (currentDII * 10);
    const newRisk = 100 - (newDII * 10);
    const reduction = ((currentRisk - newRisk) / currentRisk * 100).toFixed(0);
    
    return `${reduction}% reduction in operational risk`;
  }

  getImplementationPlan(changes) {
    const plan = [];
    
    Object.entries(changes).forEach(([dimension, change]) => {
      plan.push({
        phase: plan.length + 1,
        focus: this.getDimensionName(dimension),
        duration: this.getImplementationTime(dimension, change),
        priority: change === 'major_improvement' ? 'High' : 'Medium'
      });
    });
    
    return plan;
  }

  genericResponse(request) {
    return {
      success: true,
      type: request.type,
      message: 'Offline provider processed request',
      data: request.data
    };
  }
}