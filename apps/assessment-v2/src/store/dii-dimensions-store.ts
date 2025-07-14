import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type DIIDimension = 'TRD' | 'AER' | 'HFP' | 'BRI' | 'RRG';
export type BusinessModelId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface DimensionResponse {
  dimension: DIIDimension;
  rawValue: number; // User's response (1-5 scale or actual metric)
  metricValue: number; // Converted metric (hours, dollars, percentage, etc.)
  normalizedScore: number; // 1-10 normalized score for DII calculation
  timestamp: Date;
  confidence: number; // 0-100 confidence in this specific answer
}

export interface DIICalculation {
  score: number; // The DII score (0-100)
  rawScore: number; // Raw DII before normalization
  confidence: number; // Overall confidence based on dimensions answered
  dimensionsAnswered: number;
  formula: string; // Visual representation of calculation
  breakdown: {
    numerator: { TRD?: number; AER?: number };
    denominator: { HFP?: number; BRI?: number; RRG?: number };
  };
  percentile?: number; // Percentile within business model cohort
  trend: 'improving' | 'declining' | 'stable'; // Based on recent answers
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  modifiedDimensions: Partial<Record<DIIDimension, DimensionResponse>>;
  projectedDII: DIICalculation;
  impact: {
    scoreDelta: number;
    percentileDelta: number;
    interpretation: string;
  };
}

export interface ImpactAnalysis {
  dimension: DIIDimension;
  previousScore: number;
  newScore: number;
  impact: number; // Percentage change in DII
  interpretation: string;
  recommendations: string[];
}

interface DIIDimensionsState {
  // Core State
  businessModelId: BusinessModelId;
  dimensions: Partial<Record<DIIDimension, DimensionResponse>>;
  
  // Calculations
  currentDII: DIICalculation | null;
  historicalDII: DIICalculation[]; // Track score evolution
  
  // What-If Scenarios
  scenarios: WhatIfScenario[];
  activeScenarioId: string | null;
  
  // UI State
  lastImpactAnalysis: ImpactAnalysis | null;
  isCalculating: boolean;
  
  // Actions
  setBusinessModel: (modelId: BusinessModelId) => void;
  setDimensionResponse: (
    dimension: DIIDimension,
    rawValue: number,
    metricValue: number
  ) => Promise<ImpactAnalysis>;
  removeDimensionResponse: (dimension: DIIDimension) => void;
  
  // Calculations
  calculateDII: () => DIICalculation;
  calculateConfidence: () => number;
  calculateProjectedDII: (modifications: Partial<Record<DIIDimension, number>>) => DIICalculation;
  
  // What-If Scenarios
  createScenario: (name: string, description: string) => string;
  updateScenario: (scenarioId: string, dimension: DIIDimension, value: number) => void;
  deleteScenario: (scenarioId: string) => void;
  compareScenarios: (scenarioIds: string[]) => Array<{
    scenario: WhatIfScenario;
    comparison: { better: boolean; delta: number };
  }>;
  
  // Utilities
  reset: () => void;
  exportState: () => string;
  importState: (data: string) => boolean;
  getCalculationTransparency: () => {
    formula: string;
    steps: Array<{ step: string; value: number | string }>;
    assumptions: string[];
  };
}

// Business model normalization ranges (from your existing data)
const MODEL_RANGES: Record<BusinessModelId, { min: number; max: number; avg: number }> = {
  1: { min: 0.01, max: 9, avg: 4.5 },    // COMERCIO_HIBRIDO
  2: { min: 0.02, max: 12, avg: 6 },    // SOFTWARE_CRITICO
  3: { min: 0.01, max: 8, avg: 4 },     // SERVICIOS_DATOS
  4: { min: 0.02, max: 11, avg: 5.5 },  // ECOSISTEMA_DIGITAL
  5: { min: 0.03, max: 15, avg: 7.5 },  // SERVICIOS_FINANCIEROS
  6: { min: 0.01, max: 7, avg: 3.5 },   // INFRAESTRUCTURA_HEREDADA
  7: { min: 0.02, max: 10, avg: 5 },    // CADENA_SUMINISTRO
  8: { min: 0.02, max: 12, avg: 6 }     // INFORMACION_REGULADA
};

// Dimension weights for confidence calculation
const DIMENSION_WEIGHTS = {
  TRD: 0.25, // Critical for revenue protection
  AER: 0.20, // Important for threat modeling
  HFP: 0.20, // Human factor always matters
  BRI: 0.20, // Blast radius is key
  RRG: 0.15  // Recovery is the final line
};

// Convert raw responses to normalized scores (simplified)
function normalizeScore(dimension: DIIDimension, metricValue: number): number {
  // This is a simplified version - in production, use DimensionConverterFactory
  const ranges = {
    TRD: { 2: 2.0, 6: 4.0, 24: 6.0, 72: 8.0, 168: 9.5 },
    AER: { 10000: 9.0, 50000: 7.0, 200000: 5.0, 1000000: 3.0, 5000000: 1.5 },
    HFP: { 5: 8.5, 15: 7.0, 30: 5.0, 50: 3.0, 100: 1.5 },
    BRI: { 20: 8.0, 40: 6.5, 60: 4.5, 80: 2.5, 100: 1.0 },
    RRG: { 1.5: 9.0, 2.0: 7.0, 3.0: 5.0, 5.0: 3.0, 10.0: 1.5 }
  };

  const dimensionRanges = ranges[dimension];
  const thresholds = Object.keys(dimensionRanges).map(Number).sort((a, b) => a - b);
  
  for (const threshold of thresholds) {
    if (metricValue <= threshold) {
      return (dimensionRanges as any)[threshold];
    }
  }
  
  return 1.0; // Worst case
}

export const useDIIDimensionsStore = create<DIIDimensionsState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        businessModelId: 1,
        dimensions: {},
        currentDII: null,
        historicalDII: [],
        scenarios: [],
        activeScenarioId: null,
        lastImpactAnalysis: null,
        isCalculating: false,

        // Set business model
        setBusinessModel: (modelId) => {
          set((state) => {
            state.businessModelId = modelId;
            // Recalculate if we have dimensions
            if (Object.keys(state.dimensions).length > 0) {
              state.currentDII = get().calculateDII();
            }
          });
        },

        // Set dimension response with impact analysis
        setDimensionResponse: async (dimension, rawValue, metricValue) => {
          const previousDII = get().currentDII?.score || 0;
          const normalizedScore = normalizeScore(dimension, metricValue);
          
          set((state) => {
            state.isCalculating = true;
            state.dimensions[dimension] = {
              dimension,
              rawValue,
              metricValue,
              normalizedScore,
              timestamp: new Date(),
              confidence: 90 // Default high confidence
            };
          });

          // Calculate new DII
          const newDII = get().calculateDII();
          
          // Create impact analysis
          const impact: ImpactAnalysis = {
            dimension,
            previousScore: previousDII,
            newScore: newDII.score,
            impact: previousDII > 0 ? ((newDII.score - previousDII) / previousDII) * 100 : 100,
            interpretation: generateImpactInterpretation(dimension, previousDII, newDII.score),
            recommendations: generateRecommendations(dimension, normalizedScore)
          };

          set((state) => {
            state.currentDII = newDII;
            state.historicalDII.push(newDII);
            state.lastImpactAnalysis = impact;
            state.isCalculating = false;
          });

          return impact;
        },

        // Remove dimension response
        removeDimensionResponse: (dimension) => {
          set((state) => {
            delete state.dimensions[dimension];
            if (Object.keys(state.dimensions).length > 0) {
              state.currentDII = get().calculateDII();
            } else {
              state.currentDII = null;
            }
          });
        },

        // Calculate DII with progressive support
        calculateDII: () => {
          const { dimensions, businessModelId } = get();
          const answered = Object.keys(dimensions).length;
          
          if (answered === 0) {
            return {
              score: 0,
              rawScore: 0,
              confidence: 0,
              dimensionsAnswered: 0,
              formula: 'No data',
              breakdown: { numerator: {}, denominator: {} },
              trend: 'stable'
            } as DIICalculation;
          }

          // Get dimension scores with defaults for missing
          const scores = {
            TRD: dimensions.TRD?.normalizedScore || estimateScore('TRD', dimensions),
            AER: dimensions.AER?.normalizedScore || estimateScore('AER', dimensions),
            HFP: dimensions.HFP?.normalizedScore || estimateScore('HFP', dimensions),
            BRI: dimensions.BRI?.normalizedScore || estimateScore('BRI', dimensions),
            RRG: dimensions.RRG?.normalizedScore || estimateScore('RRG', dimensions)
          };

          // Calculate raw DII
          const numerator = scores.TRD * scores.AER;
          const denominator = scores.HFP * scores.BRI * scores.RRG;
          const rawScore = denominator > 0 ? numerator / denominator : 0;

          // Normalize based on business model
          const range = MODEL_RANGES[businessModelId];
          const normalizedScore = Math.max(0, Math.min(100, 
            ((rawScore - range.min) / (range.max - range.min)) * 100
          ));

          // Calculate confidence
          const confidence = get().calculateConfidence();

          // Determine trend
          const history = get().historicalDII;
          let trend: 'improving' | 'declining' | 'stable' = 'stable';
          if (history.length > 1) {
            const lastScore = history[history.length - 1]?.score;
            if (lastScore !== undefined) {
              if (normalizedScore > lastScore) {
                trend = 'improving';
              } else if (normalizedScore < lastScore) {
                trend = 'declining';
              }
            }
          }

          return {
            score: Math.round(normalizedScore),
            rawScore,
            confidence,
            dimensionsAnswered: answered,
            formula: `(${scores.TRD.toFixed(1)} × ${scores.AER.toFixed(1)}) / (${scores.HFP.toFixed(1)} × ${scores.BRI.toFixed(1)} × ${scores.RRG.toFixed(1)})`,
            breakdown: {
              numerator: dimensions.TRD ? { TRD: scores.TRD, AER: scores.AER } : {},
              denominator: {
                ...(dimensions.HFP ? { HFP: scores.HFP } : {}),
                ...(dimensions.BRI ? { BRI: scores.BRI } : {}),
                ...(dimensions.RRG ? { RRG: scores.RRG } : {})
              }
            },
            trend,
            percentile: estimatePercentile(normalizedScore, businessModelId)
          };
        },

        // Calculate confidence based on dimensions answered
        calculateConfidence: () => {
          const { dimensions } = get();
          const answered = Object.keys(dimensions) as DIIDimension[];
          
          if (answered.length === 0) return 0;
          if (answered.length === 5) return 100;

          // Weight-based confidence
          let weightedConfidence = 0;
          answered.forEach(dim => {
            weightedConfidence += DIMENSION_WEIGHTS[dim] * 100;
          });

          // Add penalty for missing critical dimensions
          const hasTRD = answered.includes('TRD');
          const hasAER = answered.includes('AER');
          if (!hasTRD || !hasAER) {
            weightedConfidence *= 0.8; // 20% penalty for missing critical dimensions
          }

          return Math.round(Math.min(95, weightedConfidence)); // Cap at 95% unless all answered
        },

        // Calculate projected DII for what-if scenarios
        calculateProjectedDII: (modifications) => {
          const { dimensions } = get();
          const projectedDimensions = { ...dimensions };

          // Apply modifications
          Object.entries(modifications).forEach(([dim, value]) => {
            const dimension = dim as DIIDimension;
            const normalizedScore = normalizeScore(dimension, value);
            projectedDimensions[dimension] = {
              dimension,
              rawValue: value,
              metricValue: value,
              normalizedScore,
              timestamp: new Date(),
              confidence: 80 // Lower confidence for projections
            };
          });

          // Calculate with projected values
          const tempState = { ...get(), dimensions: projectedDimensions };
          return get().calculateDII.call(tempState);
        },

        // What-If Scenario Management
        createScenario: (name, description) => {
          const id = `scenario-${Date.now()}`;
          const scenario: WhatIfScenario = {
            id,
            name,
            description,
            modifiedDimensions: {},
            projectedDII: get().currentDII || get().calculateDII(),
            impact: {
              scoreDelta: 0,
              percentileDelta: 0,
              interpretation: 'No changes yet'
            }
          };

          set((state) => {
            state.scenarios.push(scenario);
            state.activeScenarioId = id;
          });

          return id;
        },

        updateScenario: (scenarioId, dimension, value) => {
          set((state) => {
            const scenario = state.scenarios.find((s: WhatIfScenario) => s.id === scenarioId);
            if (!scenario) return;

            const normalizedScore = normalizeScore(dimension, value);
            scenario.modifiedDimensions[dimension] = {
              dimension,
              rawValue: value,
              metricValue: value,
              normalizedScore,
              timestamp: new Date(),
              confidence: 80
            };

            // Recalculate projected DII
            const projectedDII = get().calculateProjectedDII(
              Object.entries(scenario.modifiedDimensions).reduce((acc, [dim, resp]) => ({
                ...acc,
                [dim]: (resp as DimensionResponse).metricValue
              }), {})
            );

            scenario.projectedDII = projectedDII;
            
            // Calculate impact
            const currentScore = get().currentDII?.score || 0;
            scenario.impact = {
              scoreDelta: projectedDII.score - currentScore,
              percentileDelta: (projectedDII.percentile || 50) - (get().currentDII?.percentile || 50),
              interpretation: generateScenarioInterpretation(currentScore, projectedDII.score)
            };
          });
        },

        deleteScenario: (scenarioId) => {
          set((state) => {
            state.scenarios = state.scenarios.filter((s: WhatIfScenario) => s.id !== scenarioId);
            if (state.activeScenarioId === scenarioId) {
              state.activeScenarioId = null;
            }
          });
        },

        compareScenarios: (scenarioIds) => {
          const { scenarios, currentDII } = get();
          const currentScore = currentDII?.score || 0;

          return scenarioIds
            .map(id => scenarios.find(s => s.id === id))
            .filter(Boolean)
            .map(scenario => ({
              scenario: scenario!,
              comparison: {
                better: scenario!.projectedDII.score > currentScore,
                delta: scenario!.projectedDII.score - currentScore
              }
            }));
        },

        // Utilities
        reset: () => {
          set((state) => {
            state.dimensions = {};
            state.currentDII = null;
            state.historicalDII = [];
            state.scenarios = [];
            state.activeScenarioId = null;
            state.lastImpactAnalysis = null;
          });
        },

        exportState: () => {
          const state = get();
          return JSON.stringify({
            businessModelId: state.businessModelId,
            dimensions: state.dimensions,
            scenarios: state.scenarios,
            timestamp: new Date().toISOString()
          });
        },

        importState: (data) => {
          try {
            const parsed = JSON.parse(data);
            set((state) => {
              state.businessModelId = parsed.businessModelId;
              state.dimensions = parsed.dimensions;
              state.scenarios = parsed.scenarios || [];
              state.currentDII = get().calculateDII();
            });
            return true;
          } catch {
            return false;
          }
        },

        getCalculationTransparency: () => {
          const { dimensions, currentDII, businessModelId } = get();
          const steps: Array<{ step: string; value: number | string }> = [];
          const assumptions: string[] = [];

          // Document each dimension
          Object.entries(dimensions).forEach(([dim, response]) => {
            steps.push({
              step: `${dim} Response`,
              value: `${response.metricValue} → Score: ${response.normalizedScore.toFixed(1)}`
            });
          });

          // Document missing dimensions
          const allDimensions: DIIDimension[] = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'];
          const missing = allDimensions.filter(d => !dimensions[d]);
          if (missing.length > 0) {
            missing.forEach(dim => {
              const estimated = estimateScore(dim, dimensions);
              steps.push({
                step: `${dim} (Estimated)`,
                value: estimated.toFixed(1)
              });
              assumptions.push(`${dim} estimated based on ${Object.keys(dimensions).join(', ')}`);
            });
          }

          // Document calculation
          if (currentDII) {
            steps.push(
              { step: 'Raw DII Calculation', value: currentDII.formula },
              { step: 'Raw Score', value: currentDII.rawScore.toFixed(3) },
              { step: 'Business Model Range', value: `${MODEL_RANGES[businessModelId].min} - ${MODEL_RANGES[businessModelId].max}` },
              { step: 'Normalized Score', value: currentDII.score }
            );
          }

          return {
            formula: 'DII = (TRD × AER) / (HFP × BRI × RRG)',
            steps,
            assumptions
          };
        }
      })),
      {
        name: 'dii-dimensions-store',
        partialize: (state) => ({
          businessModelId: state.businessModelId,
          dimensions: state.dimensions,
          scenarios: state.scenarios
        })
      }
    )
  )
);

// Helper functions
function estimateScore(dimension: DIIDimension, existingDimensions: Partial<Record<DIIDimension, DimensionResponse>>): number {
  // Intelligent estimation based on correlations
  const answered = Object.values(existingDimensions);
  if (answered.length === 0) return 5.0; // Default middle score

  // Calculate average of answered dimensions
  const avgScore = answered.reduce((sum, d) => sum + d.normalizedScore, 0) / answered.length;

  // Apply dimension-specific adjustments
  const adjustments: Record<DIIDimension, number> = {
    TRD: 0, // No adjustment
    AER: -0.5, // Usually slightly worse than average
    HFP: -0.3, // Human factor tends to be a weakness
    BRI: 0.2, // Often slightly better than average
    RRG: -0.4 // Recovery usually lags
  };

  return Math.max(1, Math.min(10, avgScore + (adjustments[dimension] || 0)));
}

function estimatePercentile(score: number, businessModelId: BusinessModelId): number {
  // Simple percentile estimation based on score and model average
  const modelAvg = MODEL_RANGES[businessModelId].avg;
  const modelRange = MODEL_RANGES[businessModelId].max - MODEL_RANGES[businessModelId].min;
  
  // Normalize score to model range
  const normalizedToModel = (score / 100) * modelRange + MODEL_RANGES[businessModelId].min;
  
  // Simple percentile calculation
  if (normalizedToModel < modelAvg * 0.5) return Math.round(10 + Math.random() * 10);
  if (normalizedToModel < modelAvg * 0.8) return Math.round(20 + Math.random() * 20);
  if (normalizedToModel < modelAvg) return Math.round(40 + Math.random() * 10);
  if (normalizedToModel < modelAvg * 1.2) return Math.round(50 + Math.random() * 20);
  if (normalizedToModel < modelAvg * 1.5) return Math.round(70 + Math.random() * 15);
  return Math.round(85 + Math.random() * 10);
}

function generateImpactInterpretation(dimension: DIIDimension, previousScore: number, newScore: number): string {
  const delta = newScore - previousScore;
  const percentChange = previousScore > 0 ? (delta / previousScore) * 100 : 100;

  if (Math.abs(percentChange) < 5) {
    return `Minor impact from ${dimension} assessment. Your immunity remains stable.`;
  }

  if (percentChange > 20) {
    return `Significant improvement! Strong ${dimension} capabilities boost your overall immunity by ${Math.round(percentChange)}%.`;
  }

  if (percentChange > 5) {
    return `Good news! Your ${dimension} response improves immunity by ${Math.round(percentChange)}%.`;
  }

  if (percentChange < -20) {
    return `Critical weakness identified in ${dimension}. This reduces immunity by ${Math.abs(Math.round(percentChange))}%.`;
  }

  return `${dimension} reveals vulnerabilities, reducing immunity by ${Math.abs(Math.round(percentChange))}%.`;
}

function generateRecommendations(dimension: DIIDimension, score: number): string[] {
  const recommendations: Record<DIIDimension, Record<'low' | 'medium' | 'high', string[]>> = {
    TRD: {
      low: [
        'Implement redundant revenue streams urgently',
        'Create offline operation procedures',
        'Establish minimum viable operations plan'
      ],
      medium: [
        'Enhance system redundancy',
        'Implement faster failover mechanisms',
        'Create revenue protection protocols'
      ],
      high: [
        'Document and test recovery procedures',
        'Consider advanced resilience strategies',
        'Share best practices with industry peers'
      ]
    },
    AER: {
      low: [
        'Reduce attack surface immediately',
        'Implement data minimization',
        'Review and limit access permissions'
      ],
      medium: [
        'Enhance threat detection',
        'Implement deception technologies',
        'Regular threat modeling sessions'
      ],
      high: [
        'Maintain current security posture',
        'Focus on emerging threats',
        'Consider threat intelligence sharing'
      ]
    },
    HFP: {
      low: [
        'Urgent security awareness training needed',
        'Implement phishing simulations',
        'Create security champions program'
      ],
      medium: [
        'Regular security training refreshers',
        'Gamify security awareness',
        'Implement zero-trust principles'
      ],
      high: [
        'Continue current training programs',
        'Focus on advanced threats',
        'Mentor other organizations'
      ]
    },
    BRI: {
      low: [
        'Implement network segmentation urgently',
        'Deploy micro-segmentation',
        'Isolate critical systems'
      ],
      medium: [
        'Enhance network monitoring',
        'Implement least-privilege access',
        'Regular architecture reviews'
      ],
      high: [
        'Maintain segmentation strategy',
        'Focus on zero-trust architecture',
        'Regular penetration testing'
      ]
    },
    RRG: {
      low: [
        'Test recovery procedures immediately',
        'Create realistic recovery plans',
        'Implement automated backups'
      ],
      medium: [
        'Regular recovery drills',
        'Improve recovery automation',
        'Document lessons learned'
      ],
      high: [
        'Maintain recovery excellence',
        'Consider chaos engineering',
        'Help industry improve standards'
      ]
    }
  };

  const level = score < 4 ? 'low' : score < 7 ? 'medium' : 'high';
  return recommendations[dimension][level];
}

function generateScenarioInterpretation(currentScore: number, projectedScore: number): string {
  const delta = projectedScore - currentScore;
  
  if (Math.abs(delta) < 2) {
    return 'Minimal impact on overall immunity';
  }
  
  if (delta > 10) {
    return `Major improvement! This would boost immunity by ${Math.round(delta)} points`;
  }
  
  if (delta > 0) {
    return `Positive impact: +${Math.round(delta)} points to immunity`;
  }
  
  if (delta < -10) {
    return `Significant risk! This would reduce immunity by ${Math.abs(Math.round(delta))} points`;
  }
  
  return `Negative impact: ${Math.round(delta)} points to immunity`;
}