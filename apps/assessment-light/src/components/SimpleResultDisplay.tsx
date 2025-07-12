import React from 'react';
import type { DIIResults } from '@dii/types';
import { BreachEvidence } from './intelligence/BreachEvidence';

interface SimpleResultDisplayProps {
  result: DIIResults;
  businessModelId?: number;
  onRestart: () => void;
}

interface BusinessModel {
  id: number;
  name: string;
}

function SimpleResultDisplay({ result, businessModelId, onRestart }: SimpleResultDisplayProps): React.ReactElement {
  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'text-blue-600';
    if (score >= 6) return 'text-green-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Handle error cases
  if ((result as any).error) {
    const errorResult = result as any;
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Calculation Issue Detected</h3>
              <p className="text-yellow-800 text-sm mb-3">
                {errorResult.message}
              </p>
              
              <div className="bg-yellow-100 rounded-lg p-3 mb-4">
                <h4 className="font-medium text-yellow-900 mb-2">Estimated Results</h4>
                <p className="text-sm text-yellow-800">
                  Based on your responses, your estimated DII score is approximately <strong>{errorResult.fallbackScore}</strong>.
                  This represents about {Math.round(errorResult.fallbackScore * 10)}% operational capacity during incidents.
                </p>
              </div>
              
              <div className="space-x-2">
                <button
                  onClick={onRestart}
                  className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700"
                >
                  Try Again
                </button>
                
                <a
                  href="https://laberit.com/contacto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 inline-block"
                >
                  Get Professional Assessment
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const operationalCapacity = Math.round(result.diiScore * 10);
  
  // Remove unused variables for now
  // const businessModel: BusinessModel = {
  //   id: businessModelId || (result as any).businessModelId || 1,
  //   name: 'Modelo de Negocio'
  // };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Resultado de su evaluación DII 4.0
        </h2>
        <p className="text-lg text-gray-600">
          Digital Immunity Index
        </p>
      </div>

      {/* Main Score Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border border-blue-200 text-center">
        <div className="mb-4">
          <div className={`text-6xl font-bold ${getScoreColor(result.diiScore)} mb-2`}>
            {result.diiScore}
          </div>
          <div className="text-xl text-gray-600">DII Score</div>
        </div>
        
        <div className="text-lg text-gray-700 mb-4">
          Su organización mantiene el <span className="font-bold text-blue-600">{operationalCapacity}%</span> de capacidad operacional durante ataques
        </div>
        
        <div className="text-sm text-gray-600">
          Nivel: <span className="font-semibold">{result.stage.name}</span> | 
          Percentil: <span className="font-semibold">{result.percentile}%</span>
        </div>
      </div>

      {/* AI Analysis Placeholder */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-blue-800 font-medium">
            Análisis AI: Disponible en Claude Artifacts y entornos de desarrollo
          </span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Riesgo estimado basado en DII: {result.diiScore < 4 ? 'Alto' : result.diiScore < 6 ? 'Medio' : 'Bajo'}
        </p>
      </div>

      {/* Dimensions Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Análisis de 5 Dimensiones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(result.dimensions).map(([key, value]) => (
            <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-600">{key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Breach Evidence Section */}
      {businessModelId && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Evidencia de Incidentes Similares
          </h3>
          <BreachEvidence
            businessModel={businessModelId}
            diiScore={result.diiScore}
            mode="summary"
          />
        </div>
      )}

      {/* Basic Recommendations */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recomendaciones Básicas
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Implementar redundancia activa</div>
              <div className="text-sm text-gray-600">Mejorar tiempo de degradación de ingresos</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Optimizar economía de defensa</div>
              <div className="text-sm text-gray-600">Reducir costos de ataque vs defensa</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Capacitación en ciberseguridad</div>
              <div className="text-sm text-gray-600">Reducir probabilidad de fallo humano</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          ¿Qué hacer a continuación?
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => alert('Función de descarga PDF en desarrollo')}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg 
                     transition-shadow border border-gray-200"
          >
            <span className="font-semibold text-gray-900">Descargar Reporte PDF</span>
            <span className="text-sm text-gray-500 mt-1">Informe ejecutivo completo</span>
          </button>
          
          <button
            onClick={() => window.open('https://laberit.com/contacto', '_blank')}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg 
                     transition-shadow border border-gray-200"
          >
            <span className="font-semibold text-gray-900">Agendar Assessment Formal</span>
            <span className="text-sm text-gray-500 mt-1">Evaluación completa 360°</span>
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

      {/* Technical Details */}
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

export default SimpleResultDisplay;