import React from 'react';
import { CompromiseAnalysis } from './ai/CompromiseAnalysis';
import type { DIIResults } from '@dii/types';

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

  const operationalCapacity = Math.round(result.diiScore * 10);
  
  // Get business model from props or result
  const businessModel: BusinessModel = {
    id: businessModelId || (result as any).businessModelId || 1,
    name: 'Modelo de Negocio'
  };

  // Prepare assessment data for AI analysis
  const assessmentData = {
    businessModel: businessModel.id,
    dimensions: result.dimensions,
    diiScore: result.diiScore
  };

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

      {/* AI-Powered Compromise Analysis */}
      <CompromiseAnalysis 
        assessmentData={assessmentData}
        mode="executive"
        className="mb-8"
      />

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