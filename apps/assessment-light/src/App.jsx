import React, { useState } from 'react';
import { calculateDII, BUSINESS_MODELS } from './core/dii-calculator.js';
import { businessModels, getBusinessModel } from './core/business-models.js';
import ModelSelector from './components/ModelSelector';
import QuestionSlider from './components/QuestionSlider';
import ResultDisplay from './components/ResultDisplay';
import { AIStatusBadge } from './components/AIStatusBadge';

const DIMENSIONS = [
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

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedModel, setSelectedModel] = useState(null);
  const [dimensions, setDimensions] = useState({
    TRD: 5,
    AER: 5,
    HFP: 5,
    BRI: 5,
    RRG: 5
  });
  const [result, setResult] = useState(null);

  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
    setCurrentStep(2);
  };

  const handleDimensionChange = (key, value) => {
    setDimensions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const calculateResult = () => {
    const calculationResult = calculateDII({
      businessModel: selectedModel,
      dimensions: dimensions
    });
    
    if (calculationResult.success) {
      setResult(calculationResult.results);
      setCurrentStep(3);
    } else {
      alert('Error al calcular: ' + calculationResult.error);
    }
  };

  const restart = () => {
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DII Quick Assessment</h1>
              <p className="text-sm text-gray-500">Digital Immunity Index 4.0</p>
            </div>
            <div className="flex items-center space-x-4">
              <AIStatusBadge />
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
              className="h-full bg-dii-secondary rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && (
          <div className="fade-in">
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
          </div>
        )}

        {currentStep === 2 && (
          <div className="fade-in">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Evalúe sus dimensiones de inmunidad
              </h2>
              <p className="text-lg text-gray-600">
                Modelo seleccionado: <span className="font-semibold">{getBusinessModel(selectedModel)?.name}</span>
              </p>
            </div>

            <div className="space-y-8">
              {DIMENSIONS.map((dimension) => (
                <QuestionSlider
                  key={dimension.key}
                  dimension={dimension}
                  value={dimensions[dimension.key]}
                  onChange={(value) => handleDimensionChange(dimension.key, value)}
                />
              ))}
            </div>

            <div className="mt-12 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Cambiar modelo
              </button>
              <button
                onClick={calculateResult}
                className="px-8 py-3 bg-dii-secondary text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              >
                Calcular DII Score →
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && result && (
          <div className="fade-in">
            <ResultDisplay 
              result={result}
              businessModel={getBusinessModel(selectedModel)}
              onRestart={restart}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2025 Lãberit Intelligence. Digital Immunity Index 4.0
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;