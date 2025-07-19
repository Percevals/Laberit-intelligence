import { defaultTheme } from '../themes/default';
import type { VisualizationTheme } from '../types';

/**
 * Hook to get the current theme
 * For now, returns the default theme
 * Can be extended to support theme context in the future
 */
export function useTheme(): VisualizationTheme {
  // In the future, this could read from a ThemeContext
  // For now, return the default theme
  return defaultTheme;
}