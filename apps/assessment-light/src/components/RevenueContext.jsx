import React, { useState } from 'react';

/**
 * RevenueContext Component
 * 
 * Collects company revenue information for accurate economic impact analysis
 */
export function RevenueContext({ onRevenueSet, businessModel, className = '' }) {
  const [inputMode, setInputMode] = useState('range'); // 'range' or 'specific'
  const [revenueRange, setRevenueRange] = useState('');
  const [specificRevenue, setSpecificRevenue] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [showHelp, setShowHelp] = useState(false);

  // Revenue ranges tailored by business model size
  const revenueRanges = [
    { id: 'micro', label: '< $100K/mes', min: 0, max: 100000, typical: 50000 },
    { id: 'small', label: '$100K - $500K/mes', min: 100000, max: 500000, typical: 250000 },
    { id: 'medium', label: '$500K - $2M/mes', min: 500000, max: 2000000, typical: 1000000 },
    { id: 'large', label: '$2M - $10M/mes', min: 2000000, max: 10000000, typical: 5000000 },
    { id: 'enterprise', label: '$10M - $50M/mes', min: 10000000, max: 50000000, typical: 25000000 },
    { id: 'corporate', label: '> $50M/mes', min: 50000000, max: 200000000, typical: 100000000 }
  ];

  const handleRangeSelect = (range) => {
    setRevenueRange(range.id);
    onRevenueSet({
      type: 'range',
      range: range,
      estimatedMonthly: range.typical,
      currency
    });
  };

  const handleSpecificSubmit = () => {
    const value = parseFloat(specificRevenue.replace(/,/g, ''));
    if (!isNaN(value) && value > 0) {
      onRevenueSet({
        type: 'specific',
        monthlyRevenue: value,
        currency
      });
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Contexto de Ingresos
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Para calcular el impacto económico real en su organización
            </p>
          </div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-gray-400 hover:text-gray-600"
            title="Ayuda"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {showHelp && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-2">¿Por qué necesitamos esta información?</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Calcular pérdidas por hora específicas a su escala</li>
              <li>Comparar con empresas similares en su industria</li>
              <li>Proyectar ROI realista de mejoras de seguridad</li>
              <li>Toda la información es procesada localmente</li>
            </ul>
          </div>
        )}

        {/* Input Mode Selector */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setInputMode('range')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              inputMode === 'range' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rango Aproximado
          </button>
          <button
            onClick={() => setInputMode('specific')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              inputMode === 'specific' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monto Específico
          </button>
        </div>

        {/* Currency Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Moneda
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USD">USD - Dólares</option>
            <option value="EUR">EUR - Euros</option>
            <option value="MXN">MXN - Pesos Mexicanos</option>
            <option value="COP">COP - Pesos Colombianos</option>
            <option value="ARS">ARS - Pesos Argentinos</option>
            <option value="CLP">CLP - Pesos Chilenos</option>
            <option value="BRL">BRL - Reales</option>
          </select>
        </div>

        {/* Range Selection */}
        {inputMode === 'range' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Seleccione el rango de ingresos mensuales
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {revenueRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => handleRangeSelect(range)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    revenueRange === range.id
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{range.label}</div>
                  <div className="text-sm opacity-75 mt-1">
                    Típico: {formatCurrency(range.typical)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Specific Input */}
        {inputMode === 'specific' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingreso mensual aproximado
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {currency}
                </span>
                <input
                  type="text"
                  value={specificRevenue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,]/g, '');
                    setSpecificRevenue(value);
                  }}
                  placeholder="1,000,000"
                  className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleSpecificSubmit}
                disabled={!specificRevenue}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Esta información se usa solo para cálculos y no se almacena
            </p>
          </div>
        )}
      </div>

      {/* Business Model Context */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Contexto para {businessModel.name}
        </h4>
        <p className="text-sm text-gray-600">
          Las organizaciones de tipo {businessModel.name} típicamente tienen una 
          dependencia digital del {businessModel.characteristics.digitalDependency}, 
          lo que influye directamente en el impacto económico durante incidentes.
        </p>
      </div>
    </div>
  );
}

export default RevenueContext;