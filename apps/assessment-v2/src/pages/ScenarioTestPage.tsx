/**
 * Scenario Test Page
 * Temporary page to verify pain scenario service functionality
 */

import { useState } from 'react';
import { painScenarioService } from '@services/pain-scenarios';
import type { BusinessModelScenarioId, DIIDimension } from '@core/types/pain-scenario.types';

export function ScenarioTestPage() {
  const [selectedModel, setSelectedModel] = useState<BusinessModelScenarioId>('1_comercio_hibrido');
  const [selectedDimension, setSelectedDimension] = useState<DIIDimension>('TRD');
  const [error, setError] = useState<string | null>(null);

  const matrixInfo = painScenarioService.getMatrixInfo();

  const testScenario = () => {
    setError(null);
    try {
      const result = painScenarioService.getScenario(selectedModel, selectedDimension);
      console.log('Scenario retrieved:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const scenario = (() => {
    try {
      return painScenarioService.getScenario(selectedModel, selectedDimension);
    } catch {
      return null;
    }
  })();

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Pain Scenario Service Test</h1>
        
        {/* Matrix Info */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Matrix Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Version: <span className="text-primary-600">{matrixInfo.version}</span></div>
            <div>Business Models: <span className="text-primary-600">{matrixInfo.businessModels.length}</span></div>
            <div className="col-span-2">Description: <span className="text-dark-text-secondary">{matrixInfo.description}</span></div>
          </div>
        </div>

        {/* Controls */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business Model</label>
              <select 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value as BusinessModelScenarioId)}
                className="w-full p-2 bg-dark-surface border border-dark-border rounded"
              >
                {matrixInfo.businessModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Dimension</label>
              <select 
                value={selectedDimension} 
                onChange={(e) => setSelectedDimension(e.target.value as DIIDimension)}
                className="w-full p-2 bg-dark-surface border border-dark-border rounded"
              >
                {matrixInfo.dimensions.map(dim => (
                  <option key={dim} value={dim}>{dim}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            onClick={testScenario}
            className="btn-primary mt-4"
          >
            Test Retrieval
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500">
              Error: {error}
            </div>
          )}
        </div>

        {/* Scenario Display */}
        {scenario && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">
              Scenario: {selectedModel} - {selectedDimension}
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-primary-600 mb-2">Pain Point</h3>
                <p className="text-dark-text-secondary">{scenario.scenario.pain_point}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-600 mb-2">Root Cause</h3>
                <p className="text-dark-text-secondary">{scenario.scenario.root_cause}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-600 mb-2">Light Question</h3>
                <p className="text-dark-text-secondary italic">{scenario.scenario.light_question}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-600 mb-2">Premium Questions ({scenario.scenario.premium_questions?.length || 0})</h3>
                <ul className="list-disc list-inside space-y-1">
                  {(scenario.scenario.premium_questions || []).map((q, i) => (
                    <li key={i} className="text-dark-text-secondary">{q}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-primary-600 mb-2">Interpretation</h3>
                <p className="text-dark-text-secondary">{scenario.scenario.interpretation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}