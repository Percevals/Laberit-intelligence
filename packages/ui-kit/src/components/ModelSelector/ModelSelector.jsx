import React from 'react';

/**
 * ModelSelector component for business model selection
 * @param {Object} props
 * @param {Object} props.businessModels - Business models collection
 * @param {Function} props.onSelect - Model selection handler
 * @param {string} props.className - Additional CSS classes
 */
function ModelSelector({ businessModels, onSelect, className = '' }) {
  const getColorClass = (diiBase) => {
    if (diiBase >= 1.0) return 'border-green-500 hover:bg-green-50';
    if (diiBase >= 0.6) return 'border-yellow-500 hover:bg-yellow-50';
    return 'border-red-500 hover:bg-red-50';
  };

  const getRiskLabel = (multiplier) => {
    if (multiplier <= 1.0) return { text: 'Riesgo Bajo', color: 'text-green-600' };
    if (multiplier <= 2.0) return { text: 'Riesgo Medio', color: 'text-yellow-600' };
    if (multiplier <= 3.0) return { text: 'Riesgo Alto', color: 'text-orange-600' };
    return { text: 'Riesgo Crítico', color: 'text-red-600' };
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Object.values(businessModels).map((model) => {
        const riskLabel = getRiskLabel(model.riskMultiplier);
        
        return (
          <div
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={`
              relative p-6 bg-white rounded-lg shadow-md cursor-pointer 
              border-2 transition-all duration-300 transform hover:scale-105
              ${getColorClass(model.diiBase.average)}
            `}
          >
            {/* Model Number Badge */}
            <div className="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
              {model.id}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900">
                {model.name}
              </h3>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {model.description}
              </p>

              {/* Metrics */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">DII Base</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {model.diiBase.average} ({model.diiBase.range})
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Riesgo</span>
                  <span className={`text-sm font-semibold ${riskLabel.color}`}>
                    {riskLabel.text}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Digital</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {model.characteristics.digitalDependency}
                  </span>
                </div>
              </div>

              {/* Examples */}
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-1">Ejemplos:</p>
                <p className="text-xs text-gray-700">
                  {model.examples.latam.slice(0, 2).map(ex => ex.company).join(', ')}
                </p>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 hover:opacity-100 transition-opacity rounded-b-lg" />
          </div>
        );
      })}
    </div>
  );
}

export default ModelSelector;