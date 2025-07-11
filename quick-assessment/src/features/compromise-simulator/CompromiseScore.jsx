/**
 * CompromiseScore Component
 * 
 * Displays AI-powered compromise probability score
 * Works with or without AI service (graceful degradation)
 */

import React from 'react';
import { useCompromiseAnalysis } from '../../services/ai/hooks';

export const CompromiseScore = ({ assessmentData, className = '' }) => {
  const { analysis, isAnalyzing, error } = useCompromiseAnalysis(assessmentData);

  // Don't render if feature is disabled or no data
  if (!assessmentData || error) {
    return null;
  }

  // Loading state
  if (isAnalyzing) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // No analysis available
  if (!analysis) {
    return null;
  }

  // Determine risk level and colors
  const score = analysis.compromiseScore || 0;
  const riskLevel = score > 0.7 ? 'critical' : score > 0.4 ? 'high' : 'moderate';
  const riskColors = {
    critical: 'bg-red-900 border-red-600 text-red-100',
    high: 'bg-orange-900 border-orange-600 text-orange-100',
    moderate: 'bg-yellow-900 border-yellow-600 text-yellow-100'
  };

  const confidenceIcons = {
    high: '🎯',
    medium: '📊',
    low: '🔍'
  };

  return (
    <div className={`${riskColors[riskLevel]} border-2 rounded-lg p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">
            Probabilidad de Compromiso
          </h3>
          <p className="text-sm opacity-90">
            Análisis basado en indicadores operacionales
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">
            {(score * 100).toFixed(0)}%
          </div>
          <div className="text-xs opacity-75">
            {confidenceIcons[analysis.confidence]} {analysis.confidence} confianza
          </div>
        </div>
      </div>

      {/* Key Indicators */}
      {analysis.indicators && analysis.indicators.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Indicadores Detectados:</h4>
          <ul className="text-sm space-y-1">
            {analysis.indicators.slice(0, 3).map((indicator, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span className="opacity-90">{indicator}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Critical Gaps */}
      {analysis.criticalGaps && analysis.criticalGaps.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Brechas Críticas:</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.criticalGaps.map((gap, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded bg-black bg-opacity-20"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Primary Recommendation */}
      {analysis.recommendation && (
        <div className="pt-4 border-t border-current border-opacity-20">
          <h4 className="text-sm font-medium mb-1">Acción Prioritaria:</h4>
          <p className="text-sm opacity-90">{analysis.recommendation}</p>
        </div>
      )}

      {/* AI Provider Badge (if configured to show) */}
      {analysis.provider && analysis.fallback && (
        <div className="mt-4 text-xs opacity-60 text-right">
          Análisis offline
        </div>
      )}
    </div>
  );
};

/**
 * Compact version for inline display
 */
export const CompromiseScoreBadge = ({ assessmentData }) => {
  const { analysis, isAnalyzing } = useCompromiseAnalysis(assessmentData);

  if (!analysis || isAnalyzing) {
    return null;
  }

  const score = analysis.compromiseScore || 0;
  const riskLevel = score > 0.7 ? 'critical' : score > 0.4 ? 'high' : 'moderate';
  const badgeColors = {
    critical: 'bg-red-600 text-white',
    high: 'bg-orange-600 text-white',
    moderate: 'bg-yellow-600 text-gray-900'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeColors[riskLevel]}`}>
      <span className="mr-1">⚠️</span>
      {(score * 100).toFixed(0)}% compromiso probable
    </span>
  );
};