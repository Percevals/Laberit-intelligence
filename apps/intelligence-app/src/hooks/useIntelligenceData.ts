import { useQuery } from '@tanstack/react-query';
import { getWeeklyDataUrl } from '../config/paths';
import type { WeeklyIntelligenceData } from '../types/intelligence';

/**
 * Hook to fetch weekly intelligence data
 * Reads from /intelligence/data/ via symlink in development
 */
export function useWeeklyIntelligence(year: number, week: number) {
  return useQuery<WeeklyIntelligenceData>({
    queryKey: ['intelligence', 'weekly', year, week],
    queryFn: async () => {
      const url = getWeeklyDataUrl(year, week);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch weekly data: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 30 * 60 * 1000,   // Keep in cache for 30 minutes
  });
}

/**
 * Hook to get the current week's intelligence data
 */
export function useCurrentWeekIntelligence() {
  const now = new Date();
  const year = now.getFullYear();
  const week = getISOWeek(now);
  
  return useWeeklyIntelligence(year, week);
}

/**
 * Get ISO week number from date
 */
function getISOWeek(date: Date): number {
  const tempDate = new Date(date.getTime());
  const dayNum = date.getDay() || 7;
  tempDate.setDate(tempDate.getDate() + 4 - dayNum);
  const yearStart = new Date(tempDate.getFullYear(), 0, 1);
  return Math.ceil((((tempDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}