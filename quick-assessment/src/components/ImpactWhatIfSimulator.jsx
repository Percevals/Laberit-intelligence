import React, { useState, useEffect, useMemo } from 'react';
import { useScenarioSimulation } from '../services/ai/hooks';

/**
 * ImpactWhatIfSimulator Component
 * 
 * Interactive sliders to adjust parameters and see economic impact changes
 */
export function ImpactWhatIfSimulator({ 
  baseMetrics,
  revenueData,
  businessModel,
  assessmentData,
  className = '' 
}) {
  // Simulation parameters
  const [detectionTime, setDetectionTime] = useState(baseMetrics?.detectionTime || 6);
  const [operationsAffected, setOperationsAffected] = useState(60);
  const [recoverySpeed, setRecoverySpeed] = useState(1); // 1x = baseline, 0.5x = twice as fast
  const [investmentLevel, setInvestmentLevel] = useState('none');
  
  // Use AI for scenario simulation if available
  const { simulation, simulateScenario, isSimulating } = useScenarioSimulation(assessmentData);
  
  // Calculate adjusted metrics based on sliders
  const adjustedMetrics = useMemo(() => {
    if (!baseMetrics || !revenueData) return null;
    
    const hourlyRevenue = revenueData.type === 'range' 
      ? revenueData.estimatedMonthly / (30 * 24)
      : revenueData.monthlyRevenue / (30 * 24);
    
    // Adjusted detection time affects when losses start
    const adjustedDetection = detectionTime;
    
    // Operations affected scales the impact
    const impactScale = operationsAffected / 100;
    
    // Recovery speed affects total duration
    const adjustedRecoveryTime = baseMetrics.recoveryTime * recoverySpeed;
    
    // Recalculate impacts
    const calculateAdjustedImpact = (hours) => {
      if (hours <= adjustedDetection) return 0;
      
      const baseImpact = baseMetrics.impact72h * (hours / 72);
      return baseImpact * impactScale;
    };
    
    return {
      detectionTime: adjustedDetection,
      operationsAffected,
      recoveryTime: adjustedRecoveryTime,
      impact24h: calculateAdjustedImpact(24),
      impact72h: calculateAdjustedImpact(72),
      totalLoss: calculateAdjustedImpact(adjustedRecoveryTime),
      savedAmount: baseMetrics.totalPotentialLoss - calculateAdjustedImpact(adjustedRecoveryTime),
      improvementPercent: ((baseMetrics.totalPotentialLoss - calculateAdjustedImpact(adjustedRecoveryTime)) / baseMetrics.totalPotentialLoss * 100)
    };
  }, [detectionTime, operationsAffected, recoverySpeed, baseMetrics, revenueData]);
  
  // Investment options with costs and benefits
  const investmentOptions = {
    none: { label: 'Sin inversión', cost: 0, detection: 0, recovery: 1, operations: 1 },
    basic: { label: 'Básico ($50K)', cost: 50000, detection: -2, recovery: 0.8, operations: 0.9 },
    advanced: { label: 'Avanzado ($200K)', cost: 200000, detection: -4, recovery: 0.5, operations: 0.7 },
    comprehensive: { label: 'Integral ($500K)', cost: 500000, detection: -5, recovery: 0.3, operations: 0.5 }
  };
  
  // Apply investment effects
  useEffect(() => {
    const investment = investmentOptions[investmentLevel];
    if (investment.label !== 'Sin inversión') {
      setDetectionTime(Math.max(1, baseMetrics.detectionTime + investment.detection));
      setRecoverySpeed(investment.recovery);
      setOperationsAffected(60 * investment.operations);
      
      // Trigger AI simulation if available
      if (assessmentData) {
        const changes = {
          trd: investment.detection < -3 ? 'major_improvement' : 'improvement',
          rrg: investment.recovery < 0.5 ? 'major_improvement' : 'improvement'
        };
        simulateScenario(changes);
      }
    }
  }, [investmentLevel]);
  
  // Calculate ROI
  const roi = useMemo(() => {
    if (!adjustedMetrics || investmentLevel === 'none') return null;
    
    const investment = investmentOptions[investmentLevel];
    const annualSavings = adjustedMetrics.savedAmount * 2; // Assuming 2 incidents/year
    const paybackMonths = investment.cost / (annualSavings / 12);
    
    return {
      investment: investment.cost,
      annualSavings,
      paybackMonths: Math.round(paybackMonths),
      fiveYearROI: (annualSavings * 5 - investment.cost) / investment.cost * 100
    };
  }, [adjustedMetrics, investmentLevel]);
  
  // Format currency
  const formatCurrency = (value) => {
    const currency = revenueData?.currency || 'USD';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  if (!baseMetrics || !revenueData) {
    return null;
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Simulador Interactivo: ¿Qué pasaría si...?
        </h3>
        <p className="text-sm text-gray-600">
          Ajuste los parámetros para ver cómo las mejoras reducen el impacto económico
        </p>
      </div>
      
      {/* Parameter Sliders */}
      <div className="space-y-6 mb-8">
        {/* Detection Time */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Tiempo de Detección
            </label>
            <span className="text-sm font-semibold text-blue-600">
              {detectionTime} horas
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="24"
            value={detectionTime}
            onChange={(e) => setDetectionTime(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1h (Excelente)</span>
            <span>12h</span>
            <span>24h (Promedio)</span>
          </div>
        </div>
        
        {/* Operations Affected */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              % Operaciones Afectadas
            </label>
            <span className="text-sm font-semibold text-blue-600">
              {operationsAffected}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={operationsAffected}
            onChange={(e) => setOperationsAffected(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10% (Aislado)</span>
            <span>50%</span>
            <span>100% (Total)</span>
          </div>
        </div>
        
        {/* Recovery Speed */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">
              Velocidad de Recuperación
            </label>
            <span className="text-sm font-semibold text-blue-600">
              {recoverySpeed === 1 ? 'Normal' : 
               recoverySpeed < 0.5 ? 'Muy Rápida' :
               recoverySpeed < 1 ? 'Rápida' : 'Lenta'}
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2"
            step="0.1"
            value={recoverySpeed}
            onChange={(e) => setRecoverySpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5x más rápido</span>
            <span>Normal</span>
            <span>2x más lento</span>
          </div>
        </div>
      </div>
      
      {/* Investment Options */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Paquetes de Inversión en Seguridad
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(investmentOptions).map(([key, option]) => (
            <button
              key={key}
              onClick={() => setInvestmentLevel(key)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                investmentLevel === key
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-sm font-medium">{option.label}</div>
              {key !== 'none' && (
                <div className="text-xs text-gray-600 mt-1">
                  {formatCurrency(option.cost)}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Impact Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Original Impact */}
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Impacto Sin Mejoras
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Detección:</span>
              <span className="font-medium">{baseMetrics.detectionTime}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pérdida 72h:</span>
              <span className="font-medium text-red-600">
                {formatCurrency(baseMetrics.impact72h)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pérdida Total:</span>
              <span className="font-bold text-red-600">
                {formatCurrency(baseMetrics.totalPotentialLoss)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Adjusted Impact */}
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Impacto Con Mejoras
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Detección:</span>
              <span className="font-medium">{adjustedMetrics.detectionTime}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pérdida 72h:</span>
              <span className="font-medium text-green-600">
                {formatCurrency(adjustedMetrics.impact72h)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pérdida Total:</span>
              <span className="font-bold text-green-600">
                {formatCurrency(adjustedMetrics.totalLoss)}
              </span>
            </div>
          </div>
          
          {/* Savings Badge */}
          <div className="mt-4 p-2 bg-green-100 rounded text-center">
            <div className="text-lg font-bold text-green-800">
              {formatCurrency(adjustedMetrics.savedAmount)} ahorrados
            </div>
            <div className="text-xs text-green-700">
              {adjustedMetrics.improvementPercent.toFixed(0)}% reducción
            </div>
          </div>
        </div>
      </div>
      
      {/* ROI Analysis */}
      {roi && investmentLevel !== 'none' && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Análisis de Retorno de Inversión
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 block">Inversión</span>
              <span className="font-semibold">{formatCurrency(roi.investment)}</span>
            </div>
            <div>
              <span className="text-gray-600 block">Ahorro Anual</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(roi.annualSavings)}
              </span>
            </div>
            <div>
              <span className="text-gray-600 block">Recuperación</span>
              <span className="font-semibold">{roi.paybackMonths} meses</span>
            </div>
            <div>
              <span className="text-gray-600 block">ROI 5 años</span>
              <span className="font-semibold text-green-600">
                {roi.fiveYearROI.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Insights */}
      {simulation && !isSimulating && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Proyección IA: Mejora del DII Score
          </h4>
          <p className="text-sm text-gray-700">
            Las mejoras seleccionadas podrían elevar su DII de {' '}
            <span className="font-semibold">{simulation.currentDII}</span> a {' '}
            <span className="font-semibold text-green-600">{simulation.projectedDII}</span>, 
            una mejora del <span className="font-semibold">{simulation.improvementPercentage}</span>.
          </p>
          {simulation.implementation && (
            <div className="mt-2 text-xs text-gray-600">
              Tiempo de implementación estimado: {simulation.roiTimeline}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImpactWhatIfSimulator;