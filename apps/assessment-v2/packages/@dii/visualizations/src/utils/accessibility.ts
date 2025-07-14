/**
 * Accessibility utilities for DII visualizations
 * Ensures WCAG 2.1 AA compliance
 */

import type { VisualizationTheme, DIIStage, DimensionScore } from '../types';

/**
 * Generate accessible descriptions for screen readers
 */
export function generateAccessibleDescription(
  type: 'gauge' | 'balance' | 'matrix' | 'economics',
  data: any
): string {
  switch (type) {
    case 'gauge':
      const { score, peerBenchmark } = data;
      return `Digital Immunity Index gauge showing score of ${score.current} out of 100. ` +
             `Current maturity stage is ${score.stage}. ` +
             `Performance is better than ${score.percentile}% of similar companies. ` +
             `${score.previous ? `Previous score was ${score.previous}, showing a ${score.current > score.previous ? 'improvement' : 'decline'} of ${Math.abs(score.current - score.previous)} points.` : ''}`;
    
    case 'balance':
      const { dimensions } = data;
      const weakest = dimensions.reduce((w: DimensionScore, d: DimensionScore) => d.score < w.score ? d : w);
      const strongest = dimensions.reduce((s: DimensionScore, d: DimensionScore) => d.score > s.score ? d : s);
      const preventionScore = dimensions.filter((d: DimensionScore) => ['TRD', 'AER', 'HFP'].includes(d.dimension))
        .reduce((sum: number, d: DimensionScore) => sum + d.score, 0) / 3;
      const resilienceScore = dimensions.filter((d: DimensionScore) => ['BRI', 'RRG'].includes(d.dimension))
        .reduce((sum: number, d: DimensionScore) => sum + d.score, 0) / 2;
      
      return `Dimension balance visualization showing prevention vs resilience strengths. ` +
             `Prevention score is ${preventionScore.toFixed(1)} out of 10. ` +
             `Resilience score is ${resilienceScore.toFixed(1)} out of 10. ` +
             `Strongest dimension is ${strongest.dimension} with score ${strongest.score.toFixed(1)}. ` +
             `Weakest dimension is ${weakest.dimension} with score ${weakest.score.toFixed(1)}.`;
    
    case 'matrix':
      const { positions } = data;
      const userPosition = positions.find((p: any) => p.isUser);
      if (userPosition) {
        return `Risk position matrix showing your business model position. ` +
               `Your digital attack surface is ${userPosition.attackSurface}% and operational impact severity is ${userPosition.impactSeverity}%. ` +
               `This places you in the ${getQuadrantDescription(userPosition.attackSurface, userPosition.impactSeverity)} quadrant.`;
      }
      return `Risk position matrix showing business model positions by attack surface and impact severity.`;
    
    case 'economics':
      const { economics } = data;
      return `Attack economics analysis showing cost-benefit balance for potential attackers. ` +
             `Attack cost including your immunity is ${economics.attackCost + economics.immunityBonus} units. ` +
             `Potential gain for attackers is ${economics.potentialGain} units. ` +
             `Result: Your business is ${economics.isTooExpensive ? 'too expensive to attack' : 'economically viable as a target'}.`;
    
    default:
      return 'DII visualization component';
  }
}

/**
 * Get quadrant description for risk matrix
 */
function getQuadrantDescription(attackSurface: number, impactSeverity: number): string {
  if (impactSeverity >= 50 && attackSurface < 50) return 'high impact, low surface - valuable but protected';
  if (impactSeverity >= 50 && attackSurface >= 50) return 'high impact, high surface - prime target';
  if (impactSeverity < 50 && attackSurface < 50) return 'low impact, low surface - low priority';
  return 'low impact, high surface - easy but unprofitable';
}

/**
 * Generate keyboard navigation instructions
 */
export function generateKeyboardInstructions(type: 'gauge' | 'balance' | 'matrix' | 'economics'): string[] {
  const common = [
    'Tab: Navigate to next interactive element',
    'Shift+Tab: Navigate to previous interactive element',
    'Space/Enter: Activate interactive elements'
  ];

  switch (type) {
    case 'gauge':
      return [
        ...common,
        'Arrow Keys: Navigate between gauge sections',
        'Home: Jump to main score',
        'End: Jump to peer comparison'
      ];
    
    case 'balance':
      return [
        ...common,
        'Arrow Keys: Navigate between dimension points',
        'Home: Jump to prevention score',
        'End: Jump to resilience score'
      ];
    
    case 'matrix':
      return [
        ...common,
        'Arrow Keys: Navigate between business model positions',
        'Home: Jump to your position',
        'Page Up/Down: Navigate by quadrant'
      ];
    
    case 'economics':
      return [
        ...common,
        'Left Arrow: Focus on attack cost side',
        'Right Arrow: Focus on potential gain side',
        'Home: Jump to balance point'
      ];
    
    default:
      return common;
  }
}

/**
 * Validate color contrast ratios
 */
export function validateContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): { passes: boolean; ratio: number; required: number } {
  const ratio = calculateContrastRatio(foreground, background);
  const required = level === 'AAA' ? 7 : 4.5;
  
  return {
    passes: ratio >= required,
    ratio,
    required
  };
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(foreground: string, background: string): number {
  const fgLuminance = getRelativeLuminance(foreground);
  const bgLuminance = getRelativeLuminance(background);
  
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance of a color
 */
function getRelativeLuminance(hex: string): number {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Generate alternative text for complex visualizations
 */
export function generateAltText(
  type: 'gauge' | 'balance' | 'matrix' | 'economics',
  data: any,
  includeDetails = false
): string {
  if (!includeDetails) {
    switch (type) {
      case 'gauge': return `DII score gauge showing ${data.score.current}/100`;
      case 'balance': return 'Dimension balance visualization';
      case 'matrix': return 'Risk position matrix visualization';
      case 'economics': return 'Attack economics balance visualization';
    }
  }
  
  return generateAccessibleDescription(type, data);
}

/**
 * Performance monitoring for accessibility
 */
export class A11yPerformanceMonitor {
  private renderStart: number = 0;
  private renderEnd: number = 0;
  
  startRender() {
    this.renderStart = performance.now();
  }
  
  endRender() {
    this.renderEnd = performance.now();
    const duration = this.renderEnd - this.renderStart;
    
    // Log if render takes longer than 100ms (target for accessibility)
    if (duration > 100) {
      console.warn(`DII Visualization render took ${duration.toFixed(2)}ms (target: <100ms)`);
    }
    
    return duration;
  }
  
  checkMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      
      // Log if memory usage exceeds 50MB (target for accessibility)
      if (usedMB > 50) {
        console.warn(`DII Visualization memory usage: ${usedMB.toFixed(2)}MB (target: <50MB)`);
      }
      
      return usedMB;
    }
    
    return null;
  }
}

/**
 * Reduced motion preferences detection
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * High contrast preferences detection
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Screen reader detection
 */
export function isScreenReaderActive(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Multiple methods to detect screen readers
  const hasScreenReader = 
    // NVDA, JAWS detection
    'speechSynthesis' in window ||
    // Windows Narrator detection
    navigator.userAgent.includes('Narrator') ||
    // VoiceOver detection (partial)
    navigator.userAgent.includes('VoiceOver');
  
  return hasScreenReader;
}