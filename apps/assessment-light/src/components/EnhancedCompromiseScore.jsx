import React, { useState } from 'react';
import { useCompromiseAnalysis } from '../services/ai/hooks';
import { RevenueContext } from './RevenueContext';
import { EconomicImpactCalculator } from './EconomicImpactCalculator';
import { ImpactWhatIfSimulator } from './ImpactWhatIfSimulator';
import { getBusinessModel } from '../core/business-models';

/**
 * EnhancedCompromiseScore Component
 * 
 * Integrates intelligent economic analysis with compromise scoring
 * Includes revenue context, impact calculations, and what-if scenarios
 */
export function EnhancedCompromiseScore({ 
  assessmentData, 
  mode = 'executive',
  className = '' 
}) {
  const [revenueData, setRevenueData] = useState(null);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis', 'economics', 'whatif'
  
  const { analysis, isAnalyzing, error } = useCompromiseAnalysis(assessmentData);
  const businessModel = getBusinessModel(assessmentData?.businessModel);
  
  // Don't render if no data
  if (!assessmentData || error || !businessModel) {
    return null;
  }
  
  // Loading state
  if (isAnalyzing) {
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
  
  // Compact mode for inline display
  if (mode === 'inline') {
    const score = analysis?.compromiseScore || 0;
    const scorePercent = Math.round(score * 100);
    const hasRevenue = !!revenueData;
    
    return (
      <div className={`inline-flex items-center space-x-3 ${className}`}>
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${
          score > 0.7 ? 'bg-red-100 text-red-800 border-red-300' :
          score > 0.4 ? 'bg-orange-100 text-orange-800 border-orange-300' :
          'bg-yellow-100 text-yellow-800 border-yellow-300'
        }`}>
          <span className="mr-1">⚠️</span>
          {scorePercent}% probabilidad de compromiso
        </div>
        {!hasRevenue && (
          <button
            onClick={() => setActiveTab('economics')}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Calcular impacto económico
          </button>
        )}
      </div>
    );
  }
  
  // Calculate base metrics for economic analysis
  const baseMetrics = revenueData ? {
    detectionTime: businessModel.resilienceWindow.minHours,
    impact24h: 0, // Will be calculated by EconomicImpactCalculator
    impact72h: 0,
    impact7d: 0,
    recoveryTime: 168 * (10 - (assessmentData.diiScore || 5)) / 10,
    totalPotentialLoss: 0
  } : null;
  
  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header with Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Análisis de Compromiso
            </span>
          </button>
          <button
            onClick={() => setActiveTab('economics')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'economics'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Impacto Económico
            </span>
          </button>
          <button
            onClick={() => setActiveTab('whatif')}
            disabled={!revenueData}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'whatif'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : revenueData 
                  ? 'text-gray-500 hover:text-gray-700'
                  : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Simulador What-If
            </span>
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* Compromise Analysis Tab */}
        {activeTab === 'analysis' && analysis && (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Análisis de Compromiso Existente
              </h3>
              <p className="text-sm text-gray-600">
                Evaluación basada en indicadores operacionales para {businessModel.name}
              </p>
            </div>
            
            {/* Score Display */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" 
                          fill="none" className="text-gray-200" />
                  <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="16" 
                          fill="none" strokeDasharray={`${2 * Math.PI * 80}`}
                          strokeDashoffset={`${2 * Math.PI * 80 * (1 - (analysis.compromiseScore || 0))}`}
                          className={
                            analysis.compromiseScore > 0.7 ? 'text-red-500' :
                            analysis.compromiseScore > 0.4 ? 'text-orange-500' :
                            'text-yellow-500'
                          }
                          strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-gray-900">
                    {Math.round((analysis.compromiseScore || 0) * 100)}%
                  </div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">
                    Probabilidad
                  </div>
                </div>
              </div>
            </div>
            
            {/* Indicators */}
            {analysis.indicators && analysis.indicators.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Indicadores Detectados:
                </h4>
                <div className="space-y-2">
                  {analysis.indicators.map((indicator, index) => (
                    <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <svg className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" 
                           fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" 
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                              clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Primary Recommendation */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">
                Acción Prioritaria:
              </h4>
              <p className="text-sm text-gray-700">
                {analysis.recommendation}
              </p>
            </div>
            
            {/* CTA to Economic Analysis */}
            {!revenueData && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setActiveTab('economics')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Calcular impacto económico específico
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Economic Impact Tab */}
        {activeTab === 'economics' && (
          <div>
            {!revenueData ? (
              <RevenueContext 
                onRevenueSet={setRevenueData}
                businessModel={businessModel}
              />
            ) : (
              <div>
                <EconomicImpactCalculator
                  revenueData={revenueData}
                  businessModelId={assessmentData.businessModel}
                  diiScore={assessmentData.diiScore || 5}
                  dimensions={assessmentData.dimensions}
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setRevenueData(null)}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Cambiar información de ingresos
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* What-If Simulator Tab */}
        {activeTab === 'whatif' && revenueData && (
          <ImpactWhatIfSimulator
            baseMetrics={{
              detectionTime: businessModel.resilienceWindow.minHours,
              impact24h: 50000, // These will be properly calculated
              impact72h: 200000,
              impact7d: 500000,
              recoveryTime: 168,
              totalPotentialLoss: 1000000
            }}
            revenueData={revenueData}
            businessModel={businessModel}
            assessmentData={assessmentData}
          />
        )}
      </div>
    </div>
  );
}

export default EnhancedCompromiseScore;