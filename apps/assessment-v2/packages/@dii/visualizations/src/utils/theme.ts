/**
 * Theme utility functions
 */

import type { VisualizationTheme, DIIStage } from '../types';

/**
 * Deep merge theme objects
 */
export function mergeTheme(
  baseTheme: VisualizationTheme, 
  override?: Partial<VisualizationTheme>
): VisualizationTheme {
  if (!override) return baseTheme;
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      ...override.colors,
      text: {
        ...baseTheme.colors.text,
        ...override.colors?.text
      },
      status: {
        ...baseTheme.colors.status,
        ...override.colors?.status
      },
      gradient: {
        ...baseTheme.colors.gradient,
        ...override.colors?.gradient
      }
    },
    typography: {
      ...baseTheme.typography,
      ...override.typography,
      sizes: {
        ...baseTheme.typography.sizes,
        ...override.typography?.sizes
      },
      weights: {
        ...baseTheme.typography.weights,
        ...override.typography?.weights
      }
    },
    spacing: {
      ...baseTheme.spacing,
      ...override.spacing
    },
    animation: {
      ...baseTheme.animation,
      ...override.animation,
      duration: {
        ...baseTheme.animation.duration,
        ...override.animation?.duration
      },
      easing: {
        ...baseTheme.animation.easing,
        ...override.animation?.easing
      }
    }
  };
}

/**
 * Get color for DII stage
 */
export function getStageColor(stage: DIIStage, theme: VisualizationTheme): string {
  return theme.colors.status[stage.toLowerCase() as keyof typeof theme.colors.status];
}

/**
 * Get gradient stop color based on score
 */
export function getGradientStop(score: number, gradientColors: string[]): string {
  const normalizedScore = Math.max(0, Math.min(100, score)) / 100;
  const index = normalizedScore * (gradientColors.length - 1);
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);
  
  if (lowerIndex === upperIndex) {
    return gradientColors[lowerIndex];
  }
  
  // Simple interpolation between colors (for solid color approximation)
  return gradientColors[upperIndex];
}

/**
 * Calculate path for circular arc
 */
export function createArcPath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

/**
 * Convert polar coordinates to cartesian
 */
export function polarToCartesian(
  centerX: number, 
  centerY: number, 
  radius: number, 
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

/**
 * Generate responsive font size based on container
 */
export function getResponsiveFontSize(
  baseSize: string, 
  containerWidth: number,
  breakpoints = { mobile: 480, tablet: 768, desktop: 1024 }
): string {
  const basePx = parseFloat(baseSize);
  
  if (containerWidth < breakpoints.mobile) {
    return `${basePx * 0.75}px`;
  } else if (containerWidth < breakpoints.tablet) {
    return `${basePx * 0.875}px`;
  }
  
  return baseSize;
}

/**
 * Generate accessible color contrast
 */
export function ensureContrast(
  foreground: string, 
  background: string, 
  minRatio = 4.5
): string {
  // Simplified contrast check - in production, use a proper color library
  const fgLuminance = getRelativeLuminance(foreground);
  const bgLuminance = getRelativeLuminance(background);
  
  const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                   (Math.min(fgLuminance, bgLuminance) + 0.05);
  
  if (contrast >= minRatio) {
    return foreground;
  }
  
  // Return high contrast alternative
  return bgLuminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Calculate relative luminance (simplified)
 */
function getRelativeLuminance(hex: string): number {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  // Simplified luminance calculation
  return 0.299 * r + 0.587 * g + 0.114 * b;
}