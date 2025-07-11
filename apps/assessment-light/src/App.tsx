import React, { useState } from 'react';
import { calculateDII, businessModels } from '@dii/core';
import { ModelSelector, QuestionSlider, AIStatusBadge } from '@dii/ui-kit';
import SimpleResultDisplay from './components/SimpleResultDisplay';
import ErrorBoundary from './components/ErrorBoundary';
import { AssessmentFallback, CalculationFallback, UIFallback } from './components/SimpleFallback';
import ErrorTester from './components/ErrorTester';
import type { DIIDimensions, DIIResults } from '@dii/types';

interface DimensionConfig {
  key: keyof DIIDimensions;
  name: string;
  description: string;
  tooltip: string;
  lowLabel: string;
  highLabel: string;
  inverse: boolean;
}

const DIMENSIONS: DimensionConfig[] = [
  {
    key: 'TRD',
    name: 'Time to Revenue Degradation',
    description: 'Tiempo hasta degradación de ingresos',
    tooltip: 'Horas desde el inicio del incidente hasta pérdida del 10% de capacidad operacional',
    lowLabel: '2h',
    highLabel: '168h',
    inverse: false
  },
  {
    key: 'AER',
    name: 'Attack Economics Ratio',
    description: 'Ratio de economía del ataque',
    tooltip: 'Relación entre costo del ataque y beneficio potencial para el atacante',
    lowLabel: 'Muy rentable atacar',
    highLabel: 'Muy costoso atacar',
    inverse: false
  },
  {
    key: 'HFP',
    name: 'Human Failure Probability',
    description: 'Probabilidad de fallo humano',
    tooltip: 'Probabilidad mensual de que al menos un empleado comprometa la seguridad',
    lowLabel: '95% probabilidad',
    highLabel: '5% probabilidad',
    inverse: true
  },
  {
    key: 'BRI',
    name: 'Blast Radius Index',
    description: 'Índice de radio de explosión',
    tooltip: 'Porcentaje de operaciones críticas afectadas desde punto de compromiso promedio',
    lowLabel: '80%+ afectado',
    highLabel: '<20% afectado',
    inverse: true
  },
  {
    key: 'RRG',
    name: 'Recovery Reality Gap',
    description: 'Brecha de realidad en recuperación',
    tooltip: 'Factor multiplicador entre tiempo planeado y tiempo real de recuperación',
    lowLabel: '5x más lento',
    highLabel: '1x según plan',
    inverse: true
  }
];

function App(): React.ReactElement {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<DIIDimensions>({
    TRD: 5,
    AER: 5,
    HFP: 5,
    BRI: 5,
    RRG: 5
  });
  const [result, setResult] = useState<DIIResults | null>(null);
  
  // Temporary AI status (will be restored with proper AI service)
  const aiStatus = {
    isLoading: false,
    isAvailable: false,
    provider: 'offline',
    mode: 'offline' as const
  };

  const handleModelSelect = (modelId: number): void => {
    setSelectedModel(modelId);
    setCurrentStep(2);
  };

  const handleDimensionChange = (dimension: keyof DIIDimensions, value: number): void => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  const calculateResult = (): void => {
    if (!selectedModel) {
      alert('Por favor selecciona un modelo de negocio');
      return;
    }

    console.log('Calculating DII with:', { businessModel: selectedModel, dimensions });

    try {
      const calculationResult = calculateDII({
        businessModel: selectedModel,
        dimensions: dimensions
      });
      
      console.log('Calculation result:', calculationResult);
      
      if (calculationResult.success && calculationResult.results) {
        setResult(calculationResult.results);
        setCurrentStep(3);
      } else {
        console.error('Calculation failed:', calculationResult.error);
        
        // Show user-friendly error instead of alert
        setResult({
          error: true,
          message: calculationResult.error || 'Error en el cálculo',
          fallbackScore: 5.0,
          dimensions: dimensions
        } as any);
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Exception during calculation:', error);
      
      // Create fallback result
      setResult({
        error: true,
        message: error.message || 'Error inesperado en el cálculo',
        fallbackScore: 5.0,
        dimensions: dimensions
      } as any);
      setCurrentStep(3);
    }
  };

  const restart = (): void => {
    setCurrentStep(1);
    setSelectedModel(null);
    setDimensions({
      TRD: 5,
      AER: 5,
      HFP: 5,
      BRI: 5,
      RRG: 5
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DII Quick Assessment</h1>
              <p className="text-sm text-gray-500">Digital Immunity Index 4.0</p>
            </div>
            <div className="flex items-center space-x-4">
              <AIStatusBadge 
                isLoading={aiStatus.isLoading}
                isAvailable={aiStatus.isAvailable}
                provider={aiStatus.provider}
                mode={aiStatus.mode}
              />
              <div className="text-sm text-gray-500">
                Paso {currentStep} de 3
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-2 bg-gray-200 rounded-full my-4">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <div className="fade-in">
            <ErrorBoundary 
              componentName="Model Selection"
              fallbackComponent={<AssessmentFallback />}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Seleccione su modelo de negocio
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Identifique el modelo que mejor describe su organización
              </p>
              <ModelSelector 
                businessModels={businessModels}
                onSelect={handleModelSelect}
              />
            </ErrorBoundary>
          </div>
        )}

        {currentStep === 2 && selectedModel && (
          <div className="fade-in">
            <ErrorBoundary 
              componentName="Dimension Assessment"
              fallbackComponent={<UIFallback componentName="Assessment Questions" />}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Evalúe sus dimensiones de inmunidad
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Ajuste cada dimensión según la realidad actual de su organización
              </p>
              
              <div className="space-y-6">
                {DIMENSIONS.map((dimension) => (
                  <ErrorBoundary 
                    key={dimension.key}
                    componentName={`${dimension.name} Slider`}
                    fallbackComponent={
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          {dimension.name}: Value saved as {dimensions[dimension.key]}
                        </p>
                      </div>
                    }
                  >
                    <QuestionSlider
                      dimension={dimension}
                      value={dimensions[dimension.key]}
                      onChange={(value) => handleDimensionChange(dimension.key, value)}
                    />
                  </ErrorBoundary>
                ))}
              </div>
            </ErrorBoundary>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Anterior
              </button>
              <button
                onClick={calculateResult}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Calcular DII →
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && result && (
          <div className="fade-in">
            <ErrorBoundary>
              <SimpleResultDisplay
                result={result}
                businessModelId={selectedModel || undefined}
                onRestart={restart}
              />
            </ErrorBoundary>
          </div>
        )}
      </main>
      
      {/* Error Boundary Tester (Development Only) */}
      <ErrorBoundary componentName="Error Tester">
        <ErrorTester />
      </ErrorBoundary>
    </div>
  );
}

export default App;