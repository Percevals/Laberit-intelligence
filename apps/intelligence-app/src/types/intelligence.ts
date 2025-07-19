/**
 * Type definitions for Intelligence Platform data structures
 * Matches the JSON structure from Python generators
 */

export interface WeeklyIntelligenceData {
  week_date: string;
  week_summary: WeekSummary;
  dii_dimensions: DIIDimensions;
  business_model_insights: Record<string, BusinessModelInsight>;
  incidents: Incident[];
  spain_specific: SpainSpecific;
  recommendations: Recommendation[];
  immunity_chart_data: ImmunityChartData;
}

export interface WeekSummary {
  immunity_avg: string;
  attacks_week: string;
  top_threat_pct: string;
  top_threat_type: string;
  victims_low_immunity_pct: string;
  key_insight: string;
}

export interface DIIDimensions {
  TRD: DimensionValue;
  AER: DimensionValue;
  HFP: DimensionValue;
  BRI: DimensionValue;
  RRG: DimensionValue;
}

export interface DimensionValue {
  value: string;
  trend: 'improving' | 'declining' | 'stable';
}

export interface BusinessModelInsight {
  immunity_score: number;
  trend: string;
  key_threats: string[];
  vulnerability: string;
  recommendation: string;
}

export interface Incident {
  date: string;
  country: string;
  sector: string;
  org_name: string;
  attack_type: string;
  business_model: string;
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  summary: string;
  business_lesson: string;
}

export interface SpainSpecific {
  incidents_count: number;
  regulatory_updates: RegulatoryUpdate[];
  spanish_companies_affected: string[];
}

export interface RegulatoryUpdate {
  date: string;
  type: string;
  severity: string;
  impact: string;
}

export interface Recommendation {
  priority: 'CRÍTICA' | 'ALTA' | 'MEDIA';
  business_models: string[];
  recommendation: string;
  expected_impact: string;
}

export interface ImmunityChartData {
  quadrants: {
    high_immunity_low_exposure: string[];
    high_immunity_high_exposure: string[];
    low_immunity_low_exposure: string[];
    low_immunity_high_exposure: string[];
  };
}