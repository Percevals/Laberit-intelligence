/**
 * Modern Compromise Analysis Component
 * Clean, error-handled AI component with fallbacks
 */

import React from 'react';
import { useCompromiseAnalysis, useAIFeature } from '../../services/ai/hooks';
import type { AssessmentData } from '../../services/ai/types';

interface CompromiseAnalysisProps {
  assessmentData: AssessmentData;
  mode?: 'executive' | 'inline';
  className?: string;
}

export function CompromiseAnalysis({ 
  assessmentData, 
  mode = 'executive', 
  className = '' 
}: CompromiseAnalysisProps) {
  const isFeatureEnabled = useAIFeature('compromiseAnalysis');
  const { analysis, isAnalyzing, error } = useCompromiseAnalysis(
    assessmentData, 
    { autoRun: isFeatureEnabled }
  );

  // Don't render if feature is disabled
  if (!isFeatureEnabled) {
    return null;
  }

  // Error state with helpful message
  if (error && !isAnalyzing) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Análisis AI no disponible
            </h3>
            <p className="mt-1 text-sm text-yellow-700">
              Usando análisis básico. El análisis avanzado requiere conexión AI.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isAnalyzing) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-sm text-blue-800">
            Analizando riesgo de compromiso...
          </span>
        </div>
      </div>
    );
  }

  // Success state with analysis
  if (analysis) {
    return mode === 'executive' ? (
      <ExecutiveAnalysisView analysis={analysis} className={className} />
    ) : (
      <InlineAnalysisView analysis={analysis} className={className} />
    );
  }

  // No data state
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <p className="text-sm text-gray-600">
        Completa la evaluación para ver el análisis de riesgo de compromiso.
      </p>
    </div>
  );
}

// Executive view component
function ExecutiveAnalysisView({ 
  analysis, 
  className 
}: { 
  analysis: import('../../services/ai/types').CompromiseAnalysisResponse;
  className: string;
}) {
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 30) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const riskColorClasses = getRiskColor(analysis.riskScore);

  return (
    <div className={`rounded-lg border p-6 ${riskColorClasses} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Análisis de Riesgo de Compromiso
          </h3>
          <p className="text-sm opacity-90">
            Probabilidad de compromiso exitoso: <strong>{analysis.riskScore}%</strong>
          </p>
          <p className="text-xs opacity-75 mt-1">
            Confianza del análisis: {Math.round(analysis.confidence * 100)}%
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {analysis.riskScore}%
          </div>
          <div className="text-xs opacity-75">Riesgo</div>
        </div>
      </div>

      {/* Risk Factors */}
      {analysis.factors && analysis.factors.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Factores de Riesgo Principales:</h4>
          <div className="space-y-2">
            {analysis.factors.slice(0, 3).map((factor, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  factor.impact === 'critical' ? 'bg-red-500' :
                  factor.impact === 'high' ? 'bg-orange-500' :
                  factor.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{factor.category}</div>
                  <div className="text-xs opacity-75">{factor.description}</div>
                </div>
                <div className="text-xs opacity-75">
                  {Math.round(factor.probability * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Recomendaciones Inmediatas:</h4>
          <ul className="text-sm space-y-1">
            {analysis.recommendations.slice(0, 2).map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-xs mt-1">•</span>
                <span className="opacity-90">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Inline view component
function InlineAnalysisView({ 
  analysis, 
  className 
}: { 
  analysis: import('../../services/ai/types').CompromiseAnalysisResponse;
  className: string;
}) {
  const getRiskLevel = (score: number) => {
    if (score >= 70) return { level: 'Alto', color: 'text-red-600' };
    if (score >= 50) return { level: 'Medio', color: 'text-yellow-600' };
    if (score >= 30) return { level: 'Bajo', color: 'text-blue-600' };
    return { level: 'Muy Bajo', color: 'text-green-600' };
  };

  const riskInfo = getRiskLevel(analysis.riskScore);

  return (
    <div className={`inline-flex items-center gap-2 text-sm ${className}`}>
      <span className="text-gray-600">Riesgo de compromiso:</span>
      <span className={`font-medium ${riskInfo.color}`}>
        {riskInfo.level} ({analysis.riskScore}%)
      </span>
      <span className="text-xs text-gray-500">
        • {Math.round(analysis.confidence * 100)}% confianza
      </span>
    </div>
  );
}

export default CompromiseAnalysis;