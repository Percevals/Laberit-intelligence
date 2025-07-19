/**
 * DII Visualization Types
 * Core data structures for all DII visualizations
 */

export type DIIStage = 'FRAGIL' | 'ROBUSTO' | 'RESILIENTE' | 'ADAPTATIVO';

export type DIIDimension = 'TRD' | 'AER' | 'HFP' | 'BRI' | 'RRG';

export type BusinessModelId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface DIIScore {
  /** Current DII score (0-100) */
  current: number;
  /** Previous score for ghost arc display */
  previous?: number;
  /** Maturity stage */
  stage: DIIStage;
  /** Percentile rank against peers */
  percentile: number;
  /** Confidence level (0-100) */
  confidence: number;
}

// Alias for backward compatibility
export interface ImmunityScore {
  /** Current immunity score (0-100) */
  current: number;
  /** Previous score for comparison */
  previous?: number;
  /** Maturity stage */
  stage: DIIStage;
  /** Trend direction */
  trend?: 'improving' | 'declining' | 'stable';
}

export interface DimensionScore {
  dimension: DIIDimension;
  /** Normalized score (0-10) */
  score: number;
  /** Raw metric value */
  rawValue: number;
  /** Is this the weakest dimension? */
  isWeakest?: boolean;
}

export interface PeerBenchmark {
  /** Percentile position (0-100) */
  percentile: number;
  /** Average score for this business model */
  average: number;
  /** Sample size for statistical significance */
  sampleSize: number;
}

export interface BusinessModelPosition {
  id: BusinessModelId;
  name: string;
  /** Digital attack surface (0-100) */
  attackSurface: number;
  /** Operational impact severity (0-100) */
  impactSeverity: number;
  /** Is this the user's business model? */
  isUser?: boolean;
  /** Peer cluster size at this position */
  peerCount?: number;
}

export interface AttackEconomics {
  /** Cost for attacker to succeed (0-100 scale) */
  attackCost: number;
  /** Potential gain for attacker (0-100 scale) */
  potentialGain: number;
  /** Your immunity level tips the scale */
  immunityBonus: number;
  /** Is the business "too expensive" to attack? */
  isTooExpensive: boolean;
}

export interface VisualizationTheme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    status: {
      fragil: string;
      robusto: string;
      resiliente: string;
      adaptativo: string;
    };
    gradient: {
      immunity: string[];
      risk: string[];
      balance: string[];
    };
  };
  typography: {
    fontFamily: string;
    sizes: {
      hero: string;
      large: string;
      medium: string;
      small: string;
      micro: string;
    };
    weights: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  animation: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      ease: string;
      easeInOut: string;
      spring: string;
    };
  };
}

export interface StaticExportOptions {
  /** Output format */
  format: 'svg' | 'png' | 'html';
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Background color override */
  backgroundColor?: string;
  /** High DPI scaling factor */
  scale?: number;
}

export interface VisualizationProps {
  /** Custom theme override */
  theme?: Partial<VisualizationTheme>;
  /** Custom CSS class name */
  className?: string;
  /** Accessibility label */
  'aria-label'?: string;
  /** Animation disabled for static exports */
  staticMode?: boolean;
}