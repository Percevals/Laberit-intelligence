/**
 * Default DII Visualization Theme
 * Zen-inspired minimalism with dark backgrounds and high contrast
 */

import type { VisualizationTheme } from '../types';

export const defaultTheme: VisualizationTheme = {
  colors: {
    background: '#0F0F0F',      // Deep black for zen minimalism
    surface: '#1A1A1A',        // Slightly lighter for cards/surfaces
    primary: '#FFFFFF',         // Pure white for high contrast
    secondary: '#A0A0A0',       // Medium gray for secondary elements
    accent: '#3B82F6',          // Blue accent for interactive elements
    text: {
      primary: '#FFFFFF',       // White text on dark background
      secondary: '#D1D5DB',     // Light gray for secondary text
      muted: '#6B7280',         // Muted gray for subtle text
    },
    status: {
      fragil: '#EF4444',        // Red for fragile/critical
      robusto: '#F59E0B',       // Amber for robust/warning
      resiliente: '#10B981',    // Green for resilient/good
      adaptativo: '#3B82F6',    // Blue for adaptive/excellent
    },
    gradient: {
      immunity: [
        '#EF4444',              // Red (0-25)
        '#F59E0B',              // Amber (25-50)
        '#10B981',              // Green (50-75)
        '#3B82F6'               // Blue (75-100)
      ],
      risk: [
        '#1F2937',              // Dark gray (low risk)
        '#7C2D12',              // Dark red (high risk)
      ],
      balance: [
        '#374151',              // Dark side (prevention)
        '#F3F4F6'               // Light side (resilience)
      ]
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    sizes: {
      hero: '4rem',             // 64px for main DII score
      large: '2rem',            // 32px for section headers
      medium: '1.125rem',       // 18px for body text
      small: '0.875rem',        // 14px for labels
      micro: '0.75rem',         // 12px for tiny text
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.6, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    }
  }
};

/**
 * White-label theme for future customization
 */
export const whiteLabelTheme: Partial<VisualizationTheme> = {
  colors: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    primary: '#111827',
    text: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6B7280',
    }
  }
};

/**
 * Mobile-optimized theme adjustments
 */
export const mobileTheme: Partial<VisualizationTheme> = {
  typography: {
    sizes: {
      hero: '3rem',             // Smaller hero text on mobile
      large: '1.5rem',
      medium: '1rem',
      small: '0.875rem',
      micro: '0.75rem',
    }
  },
  spacing: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  }
};