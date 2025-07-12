import React, { useState, useEffect } from 'react';
import { useCompromiseAnalysis } from '../services/ai/hooks';

/**
 * CompromiseScore Component
 * 
 * Displays AI-powered compromise probability score
 * Works in both 'executive' (visual) and 'inline' (compact) modes
 */
export function CompromiseScore({ assessmentData, mode = 'executive', className = '' }) {
  const { analysis, isAnalyzing, error } = useCompromiseAnalysis(assessmentData);
  const [showDetails, setShowDetails] = useState(false);

  // Don't render if feature is disabled or no data
  if (!assessmentData || error) {
    return null;
  }

  // Loading state
  if (isAnalyzing) {
    if (mode === 'inline') {
      return (
        <div className="inline-flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span className="text-sm">Analizando compromiso...</span>
        </div>
      );
    }
    
    return (
      <div className={`bg-gray-100 rounded-lg p-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // No analysis available
  if (!analysis) {
    return null;
  }

  // Extract data
  const score = analysis.compromiseScore || 0;
  const scorePercent = Math.round(score * 100);
  const riskLevel = score > 0.7 ? 'critical' : score > 0.4 ? 'high' : 'moderate';
  
  // Business model specific context
  const businessModel = assessmentData.businessModel || 1;
  const industryAverages = {
    1: 32,  // Comercio Híbrido
    2: 55,  // Software Crítico
    3: 62,  // Servicios de Datos
    4: 68,  // Ecosistema Digital
    5: 75,  // Servicios Financieros
    6: 72,  // Infraestructura Heredada
    7: 58,  // Cadena de Suministro
    8: 65   // Información Regulada
  };
  
  const industryAvg = industryAverages[businessModel] || 45;
  const vsIndustry = scorePercent - industryAvg;
  
  // Estimated dwell time based on risk level and business model
  const dwellTimes = {
    critical: { min: 180, max: 365 },
    high: { min: 90, max: 180 },
    moderate: { min: 30, max: 90 }
  };
  
  const dwellTime = dwellTimes[riskLevel];
  const avgDwell = Math.round((dwellTime.min + dwellTime.max) / 2);

  // Risk styling
  const riskStyles = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      accent: 'text-red-600',
      indicator: 'bg-red-500',
      badge: 'bg-red-100 text-red-800 border-red-300'
    },
    high: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      accent: 'text-orange-600',
      indicator: 'bg-orange-500',
      badge: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    moderate: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      accent: 'text-yellow-600',
      indicator: 'bg-yellow-500',
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  };

  const style = riskStyles[riskLevel];

  // Inline mode - compact display
  if (mode === 'inline') {
    return (
      <div className={`inline-flex items-center space-x-3 ${className}`}>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${style.badge}`}>
          <span className="mr-1">⚠️</span>
          {scorePercent}% probabilidad de compromiso
        </div>
        {vsIndustry !== 0 && (
          <span className={`text-sm ${vsIndustry > 0 ? 'text-red-600' : 'text-green-600'}`}>
            ({vsIndustry > 0 ? '+' : ''}{vsIndustry}% vs industria)
          </span>
        )}
      </div>
    );
  }

  // Executive mode - full visual display
  return (
    <div className={`${style.bg} ${style.border} border-2 rounded-lg ${className}`}>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${style.text} mb-2`}>
              Análisis de Compromiso Existente
            </h3>
            <p className={`text-sm ${style.text} opacity-80`}>
              Basado en indicadores operacionales y patrones de comportamiento
            </p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`${style.text} hover:${style.accent} transition-colors`}
            title="Ver detalles"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Main Score Display */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Score Visual */}
          <div className="relative">
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                {/* Background circle */}
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - score)}`}
                    className={style.accent}
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-4xl font-bold ${style.text}`}>
                    {scorePercent}%
                  </div>
                  <div className={`text-xs ${style.text} opacity-70 uppercase tracking-wide`}>
                    Compromiso
                  </div>
                </div>
              </div>
            </div>
            
            {/* Confidence indicator */}
            <div className="text-center mt-4">
              <span className={`text-sm ${style.text} opacity-70`}>
                Confianza: {' '}
                <span className="font-medium">
                  {analysis.confidence === 'high' ? 'Alta' : 
                   analysis.confidence === 'medium' ? 'Media' : 'Baja'}
                </span>
              </span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-4">
            {/* Industry Comparison */}
            <div className={`p-4 rounded-lg bg-white bg-opacity-50 border ${style.border}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${style.text}`}>
                  Comparación con Industria
                </span>
                <span className={`text-lg font-bold ${vsIndustry > 0 ? style.accent : 'text-green-600'}`}>
                  {vsIndustry > 0 ? '+' : ''}{vsIndustry}%
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-gray-400"
                  style={{ width: `${industryAvg}%` }}
                />
                <div 
                  className={`absolute h-full ${style.indicator}`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">0%</span>
                <span className="text-xs text-gray-500">Promedio: {industryAvg}%</span>
                <span className="text-xs text-gray-500">100%</span>
              </div>
            </div>

            {/* Estimated Dwell Time */}
            <div className={`p-4 rounded-lg bg-white bg-opacity-50 border ${style.border}`}>
              <div className={`text-sm font-medium ${style.text} mb-1`}>
                Tiempo Estimado de Permanencia
              </div>
              <div className={`text-2xl font-bold ${style.accent}`}>
                {avgDwell} días
              </div>
              <div className={`text-xs ${style.text} opacity-70`}>
                Los atacantes podrían estar en su red entre {dwellTime.min}-{dwellTime.max} días
              </div>
            </div>
          </div>
        </div>

        {/* Indicators Section */}
        {analysis.indicators && analysis.indicators.length > 0 && (
          <div className="mb-6">
            <h4 className={`text-sm font-semibold ${style.text} mb-3`}>
              Indicadores de Compromiso Detectados:
            </h4>
            <div className="grid md:grid-cols-2 gap-2">
              {analysis.indicators.slice(0, 4).map((indicator, index) => (
                <div 
                  key={index} 
                  className={`flex items-start p-3 rounded-lg bg-white bg-opacity-50 border ${style.border}`}
                >
                  <svg className={`w-4 h-4 ${style.accent} mt-0.5 mr-2 flex-shrink-0`} 
                       fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                          clipRule="evenodd" />
                  </svg>
                  <span className={`text-sm ${style.text}`}>{indicator}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Gaps */}
        {analysis.criticalGaps && analysis.criticalGaps.length > 0 && (
          <div className="mb-6">
            <h4 className={`text-sm font-semibold ${style.text} mb-3`}>
              Brechas Críticas de Seguridad:
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.criticalGaps.map((gap, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full border ${style.badge}`}
                >
                  {gap}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Primary Recommendation */}
        <div className={`p-4 rounded-lg bg-white bg-opacity-70 border-2 ${style.border}`}>
          <div className="flex items-start">
            <svg className={`w-5 h-5 ${style.accent} mt-0.5 mr-3 flex-shrink-0`} 
                 fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" 
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                    clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h4 className={`font-semibold ${style.text} mb-1`}>
                Acción Prioritaria Recomendada:
              </h4>
              <p className={`text-sm ${style.text} opacity-90`}>
                {analysis.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Analysis (collapsible) */}
        {showDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className={`text-sm font-semibold ${style.text} mb-3`}>
              Análisis Detallado:
            </h4>
            <div className={`text-sm ${style.text} opacity-80 space-y-2`}>
              <p>
                Este análisis se basa en la evaluación de {Object.keys(assessmentData.scores || {}).length} dimensiones 
                clave del Digital Immunity Index. La probabilidad de compromiso se calcula considerando:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Patrones operacionales anómalos</li>
                <li>Brechas en controles de seguridad</li>
                <li>Indicadores de comportamiento</li>
                <li>Comparación con incidentes conocidos en su industria</li>
              </ul>
              <p className="mt-3">
                Un score de {scorePercent}% indica que existe una probabilidad {
                  riskLevel === 'critical' ? 'muy alta' :
                  riskLevel === 'high' ? 'alta' : 'moderada'
                } de que su organización ya haya sido comprometida o sea un objetivo activo.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with metadata */}
      <div className={`px-6 py-3 ${style.bg} border-t ${style.border}`}>
        <div className="flex items-center justify-between text-xs opacity-60">
          <span>
            Análisis por: {analysis.provider || 'Sistema DII'}
          </span>
          <span>
            Actualizado: {new Date().toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CompromiseScore;