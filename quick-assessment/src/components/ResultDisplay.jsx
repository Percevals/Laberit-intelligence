import React from 'react';

function ResultDisplay({ result, businessModel, onRestart }) {
  const getScoreColor = (score) => {
    if (score >= 8) return 'text-blue-600';
    if (score >= 6) return 'text-green-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'ADAPTATIVO': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'RESILIENTE': return 'bg-green-100 text-green-800 border-green-300';
      case 'ROBUSTO': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'FRAGIL': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPercentileMessage = (percentile) => {
    if (percentile >= 90) return 'Top 10% en su categoría';
    if (percentile >= 75) return 'Mejor que 3 de cada 4 organizaciones';
    if (percentile >= 50) return 'Por encima del promedio';
    if (percentile >= 25) return 'Por debajo del promedio';
    return 'Necesita mejora urgente';
  };

  // Calculate operational capacity retention
  const operationalCapacity = Math.round(result.diiScore * 10);
  
  // Estimate hourly loss based on business model
  const hourlyLossBase = {
    1: 250000,  // Comercio Híbrido
    2: 500000,  // Servicios Esenciales
    3: 100000,  // Negocio Tradicional
    4: 350000,  // Cadena de Valor
    5: 400000,  // Servicios Profesionales
    6: 300000,  // Intermediación Financiera
    7: 750000,  // Banca Digital
    8: 1000000  // Información Regulada
  };
  
  const estimatedHourlyLoss = Math.round(
    (hourlyLossBase[businessModel.id] || 250000) * (1 - operationalCapacity / 100)
  );

  // Pentagon chart data
  const dimensions = [
    { key: 'TRD', name: 'Time to Revenue Degradation', value: result.dimensions.TRD },
    { key: 'AER', name: 'Attack Economics Ratio', value: result.dimensions.AER },
    { key: 'HFP', name: 'Human Failure Probability', value: 10 - result.dimensions.HFP },
    { key: 'BRI', name: 'Blast Radius Index', value: 10 - result.dimensions.BRI },
    { key: 'RRG', name: 'Recovery Reality Gap', value: 10 - result.dimensions.RRG }
  ];

  // Industry averages
  const industryAverages = {
    TRD: 5,
    AER: 4,
    HFP: 4,
    BRI: 5,
    RRG: 5
  };

  // Create pentagon path
  const createPentagonPath = (values, scale = 1) => {
    const centerX = 150;
    const centerY = 150;
    const angleStep = (2 * Math.PI) / 5;
    const radius = 120 * scale;
    
    return values.map((val, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const r = (val / 10) * radius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z';
  };

  // Get top 3 weak dimensions
  const weakDimensions = dimensions
    .sort((a, b) => a.value - b.value)
    .slice(0, 3)
    .map(dim => {
      const improvement = dim.key === 'TRD' || dim.key === 'AER' ? 2 : -2;
      const newValue = Math.max(1, Math.min(10, result.dimensions[dim.key] + improvement));
      const newDimensions = { ...result.dimensions, [dim.key]: newValue };
      
      // Recalculate potential DII
      const newNumerator = newDimensions.TRD * newDimensions.AER;
      const newDenominator = newDimensions.HFP * newDimensions.BRI * newDimensions.RRG;
      const newDiiRaw = newNumerator / newDenominator;
      const newDiiScore = Math.min(10, Math.round((newDiiRaw / businessModel.diiBase.average) * 10 * 10) / 10);
      
      return {
        dimension: dim,
        currentValue: result.dimensions[dim.key],
        improvement: Math.abs(improvement),
        potentialDII: newDiiScore,
        recommendation: getRecommendation(dim.key)
      };
    });

  function getRecommendation(dimension) {
    const recommendations = {
      TRD: 'Implementar redundancia activa y sistemas de failover automático',
      AER: 'Optimizar costos de defensa y automatizar respuesta a incidentes',
      HFP: 'Implementar MFA y capacitación continua en ciberseguridad',
      BRI: 'Segmentar redes y aplicar zero-trust architecture',
      RRG: 'Automatizar backups y realizar simulacros de recuperación mensuales'
    };
    return recommendations[dimension] || 'Mejorar controles de seguridad';
  }

  // Benchmark data for visualization
  const benchmarkStages = [
    { name: 'Frágil', min: 0, max: 3, color: '#e74c3c' },
    { name: 'Robusto', min: 3, max: 5, color: '#f39c12' },
    { name: 'Resiliente', min: 5, max: 7, color: '#2ecc71' },
    { name: 'Adaptativo', min: 7, max: 10, color: '#3498db' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Resultado de su evaluación DII 4.0
        </h2>
        <p className="text-lg text-gray-600">
          {businessModel.name} - Digital Immunity Index
        </p>
      </div>

      {/* Executive Summary Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 mb-8 border border-red-200">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 mb-4 md:mb-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Su organización mantiene solo el {operationalCapacity}% de capacidad operacional durante ataques
            </h3>
            <p className="text-lg text-gray-700">
              Esto representa una pérdida estimada de <span className="font-bold text-red-600">
              ${estimatedHourlyLoss.toLocaleString()}/hora</span> durante incidentes de seguridad
            </p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getScoreColor(result.diiScore)}`}>
              {result.diiScore}
            </div>
            <div className="text-gray-500">DII Score</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Pentagon Visualization */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Análisis de 5 Dimensiones
          </h3>
          <div className="relative">
            <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto">
              {/* Background pentagon grid */}
              {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                <path
                  key={i}
                  d={createPentagonPath([10, 10, 10, 10, 10], scale)}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              
              {/* Industry average pentagon */}
              <path
                d={createPentagonPath([
                  industryAverages.TRD,
                  industryAverages.AER,
                  10 - industryAverages.HFP,
                  10 - industryAverages.BRI,
                  10 - industryAverages.RRG
                ])}
                fill="rgba(59, 130, 246, 0.1)"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* User's pentagon */}
              <path
                d={createPentagonPath(dimensions.map(d => d.value))}
                fill="rgba(34, 197, 94, 0.2)"
                stroke="#22c55e"
                strokeWidth="3"
              />
              
              {/* Labels */}
              {dimensions.map((dim, i) => {
                const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                const labelRadius = 140;
                const x = 150 + labelRadius * Math.cos(angle);
                const y = 150 + labelRadius * Math.sin(angle);
                
                return (
                  <g key={dim.key}>
                    <circle cx={150 + (dim.value / 10) * 120 * Math.cos(angle)} 
                            cy={150 + (dim.value / 10) * 120 * Math.sin(angle)} 
                            r="4" 
                            fill="#22c55e" />
                    <text x={x} y={y} 
                          textAnchor="middle" 
                          className="text-xs font-medium fill-gray-700">
                      {dim.key}
                    </text>
                    <text x={x} y={y + 12} 
                          textAnchor="middle" 
                          className="text-xs fill-gray-500">
                      {dim.value}/10
                    </text>
                  </g>
                );
              })}
            </svg>
            
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 border-t-2 border-dashed border-blue-500"></div>
                <span className="text-gray-600">Promedio Industria</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-green-500"></div>
                <span className="text-gray-600">Su Organización</span>
              </div>
            </div>
          </div>
          
          {/* Dimension Details */}
          <div className="mt-6 space-y-2">
            {dimensions.map(dim => (
              <div key={dim.key} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{dim.name}:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{result.dimensions[dim.key]}</span>
                  <span className={`text-xs ${
                    dim.value >= industryAverages[dim.key] ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {dim.value >= industryAverages[dim.key] ? '↑' : '↓'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 Recommendations */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 3 Recomendaciones de Mejora
          </h3>
          <div className="space-y-4">
            {weakDimensions.map((item, index) => (
              <div key={item.dimension.key} 
                   className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {index + 1}. Mejorar {item.dimension.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.recommendation}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold text-green-600">
                      DII: {result.diiScore} → {item.potentialDII}
                    </div>
                    <div className="text-xs text-gray-500">
                      +{(item.potentialDII - result.diiScore).toFixed(1)} puntos
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Impacto combinado:</strong> Implementando estas 3 mejoras, 
              su DII podría aumentar hasta {Math.min(10, result.diiScore + 2.5).toFixed(1)}, 
              reduciendo las pérdidas operacionales en un 40%.
            </p>
          </div>
        </div>
      </div>

      {/* Benchmark Visualization */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Benchmark del Sector: {businessModel.name}
        </h3>
        
        <div className="relative">
          {/* Benchmark bar */}
          <div className="h-16 bg-gray-100 rounded-lg relative overflow-hidden">
            {benchmarkStages.map((stage, index) => (
              <div
                key={stage.name}
                className="absolute h-full flex items-center justify-center text-white font-semibold"
                style={{
                  left: `${stage.min * 10}%`,
                  width: `${(stage.max - stage.min) * 10}%`,
                  backgroundColor: stage.color
                }}
              >
                {stage.name}
              </div>
            ))}
          </div>
          
          {/* Position indicator */}
          <div 
            className="absolute top-0 h-16 w-1 bg-gray-900"
            style={{ left: `${result.diiScore * 10}%` }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                          bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
              Su posición: {result.diiScore}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                          w-0 h-0 border-l-8 border-r-8 border-t-8 
                          border-l-transparent border-r-transparent border-t-gray-900">
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{result.percentile}%</div>
            <div className="text-sm text-gray-600">Percentil en su industria</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round((10 - result.diiScore) * 10)}%
            </div>
            <div className="text-sm text-gray-600">Brecha vs Líderes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {result.stage.name}
            </div>
            <div className="text-sm text-gray-600">Nivel de Madurez</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(30 / result.diiScore)} días
            </div>
            <div className="text-sm text-gray-600">Para siguiente nivel</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          ¿Qué hacer a continuación?
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => {
              // PDF download logic would go here
              alert('Función de descarga PDF en desarrollo');
            }}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg 
                     transition-shadow border border-gray-200"
          >
            <svg className="w-12 h-12 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold text-gray-900">Descargar Reporte PDF</span>
            <span className="text-sm text-gray-500 mt-1">Informe ejecutivo completo</span>
          </button>
          
          <button
            onClick={() => {
              window.open('https://laberit.com/contacto', '_blank');
            }}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg 
                     transition-shadow border border-gray-200"
          >
            <svg className="w-12 h-12 text-blue-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold text-gray-900">Agendar Assessment Formal</span>
            <span className="text-sm text-gray-500 mt-1">Evaluación completa 360°</span>
          </button>
          
          <button
            onClick={() => {
              const shareUrl = window.location.href;
              const shareText = `Mi organización obtuvo ${result.diiScore}/10 en el Digital Immunity Index. ¿Cuál es tu score?`;
              
              if (navigator.share) {
                navigator.share({
                  title: 'Resultado DII 4.0',
                  text: shareText,
                  url: shareUrl
                });
              } else {
                // Fallback to copy to clipboard
                navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                alert('Link copiado al portapapeles');
              }
            }}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg 
                     transition-shadow border border-gray-200"
          >
            <svg className="w-12 h-12 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.684C18.114 16.938 18 17.482 18 18c0 .482.114.938.316 1.342m0-2.684a3 3 0 110 2.684M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-semibold text-gray-900">Compartir con mi equipo</span>
            <span className="text-sm text-gray-500 mt-1">Enviar resultados</span>
          </button>
        </div>
        
        <div className="text-center">
          <button
            onClick={onRestart}
            className="text-gray-600 hover:text-gray-900 underline"
          >
            Realizar nueva evaluación
          </button>
        </div>
      </div>

      {/* Technical Details (collapsed by default) */}
      <details className="mt-8 bg-gray-50 rounded-lg p-6">
        <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
          Detalles técnicos de la evaluación
        </summary>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">DII Raw:</span>
            <span className="ml-2 font-mono">{result.diiRaw}</span>
          </div>
          <div>
            <span className="text-gray-500">DII Base:</span>
            <span className="ml-2 font-mono">{result.diiBase}</span>
          </div>
          <div>
            <span className="text-gray-500">Modelo:</span>
            <span className="ml-2">{businessModel.key}</span>
          </div>
          {Object.entries(result.dimensions).map(([key, value]) => (
            <div key={key}>
              <span className="text-gray-500">{key}:</span>
              <span className="ml-2 font-mono">{value}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

export default ResultDisplay;