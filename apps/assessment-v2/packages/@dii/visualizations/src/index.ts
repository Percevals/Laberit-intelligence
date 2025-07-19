/**
 * @dii/visualizations
 * DII signature visualization components with unique visual identity
 * 
 * Features:
 * - Zen-inspired minimalism with dark backgrounds
 * - Mobile-first responsive design
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Static export capabilities for reports
 * - Performance optimized (<100ms render, <50MB memory)
 */

// Core Components
export { ImmunityGaugeV2 as ImmunityGauge } from './components/ImmunityGaugeV2';
export type { ImmunityGaugeProps } from './components/ImmunityGaugeV2';

export { ArcGaugeFoundation } from './components/ArcGaugeFoundation';
export type { ArcGaugeFoundationProps } from './components/ArcGaugeFoundation';

export { ProgressiveArc } from './components/ProgressiveArc';
export type { ProgressiveArcProps } from './components/ProgressiveArc';

export { IndexDisplay, DIMENSION_NAMES } from './components/IndexDisplay';
export type { IndexDisplayProps, DimensionKey } from './components/IndexDisplay';

export { DimensionBalance } from './components/DimensionBalance';
export type { DimensionBalanceProps, DimensionConfig } from './components/DimensionBalance';

export { RiskPositionMatrix } from './components/RiskPositionMatrix';
export type { RiskPositionMatrixProps } from './components/RiskPositionMatrix';

export { AttackEconomics } from './components/AttackEconomics';
export type { AttackEconomicsProps } from './components/AttackEconomics';

export { VisualizationDemo } from './components/VisualizationDemo';
export type { VisualizationDemoProps } from './components/VisualizationDemo';

// Types
export type {
  DIIStage,
  DIIDimension,
  BusinessModelId,
  DIIScore,
  DimensionScore,
  PeerBenchmark,
  BusinessModelPosition,
  AttackEconomics as AttackEconomicsData,
  VisualizationTheme,
  VisualizationProps,
  StaticExportOptions
} from './types';

// Themes
export { defaultTheme, whiteLabelTheme, mobileTheme } from './themes/default';

// Utilities
export {
  mergeTheme,
  getStageColor,
  getGradientStop,
  createArcPath,
  polarToCartesian,
  getResponsiveFontSize,
  ensureContrast
} from './utils/theme';

export {
  generateSVG,
  generatePNG,
  generateHTML,
  exportUtils,
  exportVisualizationSuite
} from './utils/static-export';

export {
  generateAccessibleDescription,
  generateKeyboardInstructions,
  generateAltText,
  validateContrast,
  A11yPerformanceMonitor,
  prefersReducedMotion,
  prefersHighContrast,
  isScreenReaderActive
} from './utils/accessibility';

// Constants
export { 
  DIMENSION_LABELS, 
  DIMENSION_DESCRIPTIONS,
  getDimensionConfig 
} from './constants/dimensionLabels';

// Convenience exports for common use cases
export const DIIVisualizations = {
  ImmunityGauge,
  DimensionBalance,
  RiskPositionMatrix,
  AttackEconomics,
  VisualizationDemo
} as const;

// Quick setup functions
export function createVisualizationSuite() {
  return {
    components: DIIVisualizations,
    theme: defaultTheme,
    utils: {
      mergeTheme,
      getStageColor,
      exportUtils
    }
  };
}

// Default export for easy importing
const DIIVisualizationsPackage = {
  components: DIIVisualizations,
  themes: {
    default: defaultTheme,
    whiteLabel: whiteLabelTheme,
    mobile: mobileTheme
  },
  utils: {
    theme: {
      mergeTheme,
      getStageColor,
      getGradientStop,
      createArcPath,
      polarToCartesian,
      getResponsiveFontSize,
      ensureContrast
    },
    export: {
      generateSVG,
      generatePNG,
      generateHTML,
      exportUtils,
      exportVisualizationSuite
    }
  }
};

export default DIIVisualizationsPackage;