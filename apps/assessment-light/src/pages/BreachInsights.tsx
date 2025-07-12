/**
 * Breach Insights Page
 * Standalone page to view breach evidence and risk insights
 */

import React, { useState } from 'react';
import { BreachEvidence } from '../components/intelligence/BreachEvidence';

export function BreachInsights() {
  const [selectedModel, setSelectedModel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'inline' | 'summary' | 'detailed'>('summary');

  const businessModels = [
    { id: 1, name: 'Comercio Híbrido' },
    { id: 2, name: 'Software Crítico' },
    { id: 3, name: 'Servicios de Datos' },
    { id: 4, name: 'Ecosistema Digital' },
    { id: 5, name: 'Servicios Financieros' },
    { id: 6, name: 'Infraestructura Heredada' },
    { id: 7, name: 'Cadena de Suministro' },
    { id: 8, name: 'Información Regulada' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Intelligence-Driven Risk Insights
        </h1>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {businessModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex gap-2">
                {(['inline', 'summary', 'detailed'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-md ${
                      viewMode === mode
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Breach Evidence Display */}
        <BreachEvidence
          businessModel={selectedModel}
          companySize="1000-5000"
          region="Colombia"
          diiScore={3.5}
          mode={viewMode}
        />

        {/* Additional Context */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            How This Helps Your Assessment
          </h3>
          <p className="text-blue-800">
            These real breach cases show what happened to companies similar to yours. 
            Use this evidence to understand your specific risks and prioritize security investments.
          </p>
          <ul className="mt-4 space-y-2 text-blue-700">
            <li>• Compare your DII score with breached companies</li>
            <li>• See common attack patterns for your business model</li>
            <li>• Understand financial and operational impacts</li>
            <li>• Learn from their defense gaps</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BreachInsights;