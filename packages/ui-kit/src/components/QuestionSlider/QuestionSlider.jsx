import React, { useState } from 'react';

/**
 * QuestionSlider component for dimension input
 * @param {Object} props
 * @param {Object} props.dimension - Dimension configuration
 * @param {number} props.value - Current value (1-10)
 * @param {Function} props.onChange - Value change handler
 * @param {string} props.className - Additional CSS classes
 */
function QuestionSlider({ dimension, value, onChange, className = '' }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getValueColor = (val, inverse) => {
    const adjustedVal = inverse ? 11 - val : val;
    if (adjustedVal >= 7) return 'text-green-600';
    if (adjustedVal >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSliderBackground = (val, inverse) => {
    const adjustedVal = inverse ? 11 - val : val;
    const percentage = (val - 1) * 11.11; // Convert 1-10 to percentage
    
    let color = '#e74c3c'; // red
    if (adjustedVal >= 7) color = '#2ecc71'; // green
    else if (adjustedVal >= 4) color = '#f39c12'; // yellow
    
    return `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              {dimension.key} - {dimension.name}
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </h3>
            <p className="text-sm text-gray-600">{dimension.description}</p>
          </div>
          <div className={`text-3xl font-bold ${getValueColor(value, dimension.inverse)}`}>
            {value}
          </div>
        </div>

        {showTooltip && (
          <div className="mb-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800 fade-in">
            {dimension.tooltip}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <input
            type="range"
            min="1"
            max="10"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ background: getSliderBackground(value, dimension.inverse) }}
          />
          
          {/* Scale marks */}
          <div className="flex justify-between mt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <div key={num} className="flex flex-col items-center">
                <div className="w-0.5 h-2 bg-gray-300" />
                <span className="text-xs text-gray-500 mt-1">{num}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-gray-600 mt-4">
          <span className="flex items-center">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1" />
            {dimension.lowLabel}
          </span>
          <span className="flex items-center">
            {dimension.highLabel}
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-1" />
          </span>
        </div>
      </div>

      {/* Value interpretation */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <span className="font-medium">Interpretación: </span>
        <span className={getValueColor(value, dimension.inverse)}>
          {dimension.inverse ? (
            value <= 3 ? 'Excelente' : value <= 6 ? 'Bueno' : 'Necesita mejora'
          ) : (
            value >= 7 ? 'Excelente' : value >= 4 ? 'Bueno' : 'Necesita mejora'
          )}
        </span>
      </div>
    </div>
  );
}

export default QuestionSlider;