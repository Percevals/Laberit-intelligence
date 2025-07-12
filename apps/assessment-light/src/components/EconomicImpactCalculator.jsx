import React, { useState, useEffect, useMemo } from 'react';
import { getBusinessModel } from '../core/business-models';

/**
 * EconomicImpactCalculator Component
 * 
 * Calculates and displays intelligent economic impact based on:
 * - Company revenue
 * - Business model resilience
 * - Time progression
 * - Detection capabilities
 */
export function EconomicImpactCalculator({ 
  revenueData, 
  businessModelId, 
  diiScore,
  dimensions,
  className = '' 
}) {
  const businessModel = getBusinessModel(businessModelId);
  const [selectedTimeframe, setSelectedTimeframe] = useState(72); // Default 72 hours
  
  // Calculate hourly revenue
  const hourlyRevenue = useMemo(() => {
    if (!revenueData) return 0;
    const monthly = revenueData.type === 'range' 
      ? revenueData.estimatedMonthly 
      : revenueData.monthlyRevenue;
    // Assuming 30 days, 24 hours operational
    return monthly / (30 * 24);
  }, [revenueData]);

  // Calculate impact based on time progression
  const calculateImpactByHour = (hour) => {
    if (!businessModel || !hourlyRevenue) return 0;
    
    // Business model specific resilience windows
    const resilience = businessModel.resilienceWindow;
    const digitalDep = parseInt(businessModel.characteristics.digitalDependency.split('-')[1]) / 100;
    
    // Phase 1: Undetected (0-6 hours typically)
    if (hour <= resilience.minHours) {
      return 0; // No revenue impact yet
    }
    
    // Phase 2: Initial degradation
    if (hour <= 24) {
      const degradationRate = 0.1 * digitalDep; // 10% degradation for fully digital
      return hourlyRevenue * degradationRate * (hour - resilience.minHours);
    }
    
    // Phase 3: Significant degradation
    if (hour <= 72) {
      const phase2Loss = hourlyRevenue * 0.1 * digitalDep * (24 - resilience.minHours);
      const degradationRate = 0.4 * digitalDep; // 40% degradation
      return phase2Loss + (hourlyRevenue * degradationRate * (hour - 24));
    }
    
    // Phase 4: Critical loss
    const phase2Loss = hourlyRevenue * 0.1 * digitalDep * (24 - resilience.minHours);
    const phase3Loss = hourlyRevenue * 0.4 * digitalDep * 48;
    const criticalRate = 0.8 * digitalDep; // 80% loss
    return phase2Loss + phase3Loss + (hourlyRevenue * criticalRate * (hour - 72));
  };

  // Generate timeline data
  const timelineData = useMemo(() => {
    const points = [];
    const intervals = [0, 1, 6, 12, 24, 48, 72, 96, 120, 144, 168];
    
    intervals.forEach(hour => {
      const loss = calculateImpactByHour(hour);
      const operationalCapacity = hour === 0 ? 100 : Math.max(20, 100 - (loss / (hourlyRevenue * hour) * 100));
      
      points.push({
        hour,
        loss,
        operationalCapacity,
        phase: hour <= 6 ? 'undetected' : 
               hour <= 24 ? 'initial' : 
               hour <= 72 ? 'significant' : 'critical',
        label: hour < 24 ? `${hour}h` : `${Math.floor(hour/24)}d`
      });
    });
    
    return points;
  }, [hourlyRevenue, businessModel]);

  // Calculate specific metrics
  const metrics = useMemo(() => {
    if (!revenueData || !businessModel) return null;
    
    const impact24h = calculateImpactByHour(24);
    const impact72h = calculateImpactByHour(72);
    const impact7d = calculateImpactByHour(168);
    
    // Factor in DII score for recovery time
    const baseRecoveryTime = 168 * (10 - diiScore) / 10; // Better DII = faster recovery
    const recoveryTime = Math.max(24, baseRecoveryTime);
    
    return {
      detectionTime: businessModel.resilienceWindow.minHours,
      impact24h,
      impact72h,
      impact7d,
      recoveryTime,
      totalPotentialLoss: calculateImpactByHour(recoveryTime),
      hourlyLossAtPeak: hourlyRevenue * 0.8
    };
  }, [revenueData, businessModel, diiScore]);

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

  // Industry comparisons
  const getIndustryComparison = () => {
    if (!metrics || !revenueData) return null;
    
    const monthlyRevenue = revenueData.type === 'range' 
      ? revenueData.estimatedMonthly 
      : revenueData.monthlyRevenue;
    
    // Simulated peer data based on business model and size
    const sizeCategory = monthlyRevenue < 500000 ? 'pequeña' :
                        monthlyRevenue < 2000000 ? 'mediana' : 'grande';
    
    const peerIncidents = {
      'Comercio Híbrido': { avg: 47000, range: '25K-85K', recovery: '3-5 días' },
      'Software Crítico': { avg: 125000, range: '75K-250K', recovery: '5-7 días' },
      'Servicios de Datos': { avg: 180000, range: '100K-350K', recovery: '7-10 días' },
      'Ecosistema Digital': { avg: 250000, range: '150K-500K', recovery: '7-14 días' },
      'Servicios Financieros': { avg: 500000, range: '300K-1M', recovery: '3-7 días' },
      'Infraestructura Heredada': { avg: 350000, range: '200K-700K', recovery: '10-20 días' },
      'Cadena de Suministro': { avg: 150000, range: '80K-300K', recovery: '5-10 días' },
      'Información Regulada': { avg: 300000, range: '180K-600K', recovery: '5-14 días' }
    };
    
    return {
      sizeCategory,
      peerData: peerIncidents[businessModel.name] || peerIncidents['Software Crítico'],
      comparison: metrics.impact72h
    };
  };

  const peerComparison = getIndustryComparison();

  if (!revenueData || !businessModel) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">
          Configure los ingresos para ver el análisis económico
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Análisis de Impacto Económico Inteligente
      </h3>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Pérdida Primeras 24h</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(metrics.impact24h)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Típicamente no detectado hasta {metrics.detectionTime}h
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Pérdida a 72h</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(metrics.impact72h)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            40% degradación operacional
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Pérdida Total Proyectada</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(metrics.totalPotentialLoss)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Recuperación: ~{Math.round(metrics.recoveryTime / 24)} días
          </div>
        </div>
      </div>

      {/* Impact Timeline Visualization */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-900 mb-4">
          Progresión del Impacto en el Tiempo
        </h4>
        <div className="relative h-64 bg-gray-50 rounded-lg p-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-8 h-full relative">
            <svg className="w-full h-full">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={`${100 - y}%`}
                  x2="100%"
                  y2={`${100 - y}%`}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              
              {/* Operational capacity line */}
              <polyline
                points={timelineData.map((point, i) => 
                  `${(i / (timelineData.length - 1)) * 100}%,${100 - point.operationalCapacity}%`
                ).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              
              {/* Phase indicators */}
              <rect x="0" y="0" width="10%" height="100%" fill="rgba(34, 197, 94, 0.1)" />
              <rect x="10%" y="0" width="20%" height="100%" fill="rgba(251, 146, 60, 0.1)" />
              <rect x="30%" y="0" width="40%" height="100%" fill="rgba(239, 68, 68, 0.1)" />
              <rect x="70%" y="0" width="30%" height="100%" fill="rgba(127, 29, 29, 0.1)" />
              
              {/* Data points */}
              {timelineData.map((point, i) => (
                <circle
                  key={point.hour}
                  cx={`${(i / (timelineData.length - 1)) * 100}%`}
                  cy={`${100 - point.operationalCapacity}%`}
                  r="4"
                  fill="#3b82f6"
                  className="cursor-pointer"
                />
              ))}
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 mt-2">
              {timelineData.filter((_, i) => i % 2 === 0).map((point) => (
                <span key={point.hour}>{point.label}</span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Phase legend */}
        <div className="flex items-center justify-center mt-4 space-x-6 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-200 rounded mr-1"></div>
            <span>No detectado</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-200 rounded mr-1"></div>
            <span>Degradación inicial</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-200 rounded mr-1"></div>
            <span>Impacto significativo</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-800 opacity-20 rounded mr-1"></div>
            <span>Pérdida crítica</span>
          </div>
        </div>
      </div>

      {/* Peer Comparison */}
      {peerComparison && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Comparación con Pares de la Industria
          </h4>
          <p className="text-sm text-gray-700">
            Una empresa {peerComparison.sizeCategory} de {businessModel.name} típicamente 
            enfrenta pérdidas de <span className="font-semibold">{formatCurrency(peerComparison.peerData.avg)}</span> por 
            incidente (rango: {peerComparison.peerData.range}), con tiempos de 
            recuperación de {peerComparison.peerData.recovery}.
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Su proyección de <span className="font-semibold">{formatCurrency(metrics.impact72h)}</span> a 
            72 horas está {metrics.impact72h > peerComparison.peerData.avg ? 
              <span className="text-red-600 font-semibold">por encima</span> : 
              <span className="text-green-600 font-semibold">por debajo</span>
            } del promedio de la industria.
          </p>
        </div>
      )}

      {/* Business Model Context */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Factores de Resiliencia: {businessModel.name}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Redundancia natural:</span>
            <span className="ml-2 font-medium">{businessModel.characteristics.naturalRedundancy}</span>
          </div>
          <div>
            <span className="text-gray-600">Fallback manual:</span>
            <span className="ml-2 font-medium">{businessModel.characteristics.manualFallback}</span>
          </div>
          <div>
            <span className="text-gray-600">Ventana de resiliencia:</span>
            <span className="ml-2 font-medium">{businessModel.resilienceWindow.description}</span>
          </div>
          <div>
            <span className="text-gray-600">Factor crítico:</span>
            <span className="ml-2 font-medium">{businessModel.characteristics.criticalFactor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EconomicImpactCalculator;