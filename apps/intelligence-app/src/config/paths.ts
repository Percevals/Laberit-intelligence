/**
 * Path configuration for accessing intelligence data
 * Maintains separation between app code and intelligence data
 */

export const DATA_PATHS = {
  // During development - read from local filesystem via public directory
  development: {
    weeklyData: '/intel-data/weekly',
    research: '/intel-data/research',
    outputs: '/intel-data/outputs',
  },
  
  // In production - could be API endpoints or CDN URLs
  production: {
    weeklyData: '/api/intelligence/weekly',
    research: '/api/intelligence/research',
    outputs: '/api/intelligence/outputs',
  }
};

export const getDataPath = (type: keyof typeof DATA_PATHS.development): string => {
  const env = import.meta.env.MODE;
  const paths = env === 'production' ? DATA_PATHS.production : DATA_PATHS.development;
  return paths[type];
};

// Helper to construct full data URLs
export const getWeeklyDataUrl = (year: number, week: number): string => {
  const basePath = getDataPath('weeklyData');
  return `${basePath}/${year}/week-${week}/weekly-intelligence.json`;
};

export const getResearchDataUrl = (year: number, week: number): string => {
  const basePath = getDataPath('research');
  return `${basePath}/${year}/week-${week}/`;
};