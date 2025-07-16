/**
 * Scenario Question Card Component
 * Displays a personalized scenario question with response options
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Target, AlertTriangle, Shield, Clock, Zap } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { DIIDimension, ResponseOption } from '@core/types/pain-scenario.types';
import { DII_V4_DIMENSIONS } from '@/core/dii-engine/dimensions-v4';

interface ScenarioQuestionCardProps {
  dimension: DIIDimension;
  dimensionName: string;
  question: string;
  responseOptions: ResponseOption[];
  contextForUser: string;
  currentResponse?: number | undefined;
  onResponse: (value: number, metric: { hours?: number; percentage?: number; ratio?: number; multiplier?: number }) => void;
  archetypeQuestions?: string[];
}

export function ScenarioQuestionCard({
  dimension,
  dimensionName,
  question,
  responseOptions,
  contextForUser,
  currentResponse,
  onResponse,
  archetypeQuestions
}: ScenarioQuestionCardProps) {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(currentResponse || 0);
  const [showInterpretation, setShowInterpretation] = useState(false);

  const handleSelect = (option: ResponseOption) => {
    setSelectedValue(option.value);
    const metric: { hours?: number; percentage?: number; ratio?: number; multiplier?: number } = {};
    if (option.hours !== undefined) metric.hours = option.hours;
    if (option.percentage !== undefined) metric.percentage = option.percentage;
    if (option.ratio !== undefined) metric.ratio = option.ratio;
    if (option.multiplier !== undefined) metric.multiplier = option.multiplier;
    onResponse(option.value, metric);
    setShowInterpretation(true);
  };

  // Get color based on value
  const getColorForValue = (value: number) => {
    switch (value) {
      case 1: return 'text-red-500';
      case 2: return 'text-orange-500';
      case 3: return 'text-yellow-500';
      case 4: return 'text-blue-500';
      case 5: return 'text-green-500';
      default: return 'text-dark-text-secondary';
    }
  };

  // Get dimension icon based on type
  const getIcon = () => {
    switch (dimension) {
      case 'AER':
        return Target;
      case 'HFP':
        return AlertTriangle;
      case 'BRI':
        return Shield;
      case 'TRD':
        return Clock;
      case 'RRG':
        return Zap;
      default:
        return AlertCircle;
    }
  };

  const Icon = getIcon();
  const dimInfo = DII_V4_DIMENSIONS[dimension];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary-600/10 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{dimInfo.nameES}</h3>
          <p className="text-sm text-dark-text-secondary">
            {t('assessment.dimension', 'Dimensión')}: {dimension}
          </p>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-lg leading-relaxed font-medium">{question}</p>
      </div>

      {/* Context Help */}
      <div className="mb-8 space-y-3">
        <div className="p-4 bg-primary-600/5 border border-primary-600/20 rounded-lg">
          <p className="text-sm text-dark-text-secondary leading-relaxed">
            <span className="font-medium text-primary-600">¿Por qué es importante?</span> {contextForUser}
          </p>
        </div>
        
        {/* Holistic Impact Explanation */}
        <div className="p-4 bg-purple-600/5 border border-purple-600/20 rounded-lg">
          <p className="text-sm text-dark-text-secondary leading-relaxed">
            <span className="font-medium text-purple-400">Impacto holístico:</span> {dimInfo.description.es}
          </p>
        </div>
        
        {/* Archetype-Specific Questions */}
        {archetypeQuestions && archetypeQuestions.length > 0 && (
          <div className="p-4 bg-blue-600/5 border border-blue-600/20 rounded-lg">
            <p className="text-sm font-medium text-blue-400 mb-2">
              Preguntas específicas para su arquetipo:
            </p>
            <ul className="space-y-1">
              {archetypeQuestions.map((q, idx) => (
                <li key={idx} className="text-sm text-dark-text-secondary flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Response Scale */}
      <div className="space-y-4">
        <p className="text-sm text-dark-text-secondary mb-2">
          {t('assessment.selectResponse', 'Seleccione su nivel actual:')}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {responseOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={cn(
                'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                'hover:border-primary-600/50',
                selectedValue === option.value
                  ? 'border-primary-600 bg-primary-600/10'
                  : 'border-dark-border bg-dark-surface'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-xl font-bold">{option.value}</div>
                <div className={cn('text-xs px-2 py-1 rounded', 
                  selectedValue === option.value ? 'bg-primary-600/20' : '',
                  getColorForValue(option.value)
                )}>
                  {option.interpretation}
                </div>
              </div>
              <div className="text-sm font-medium mb-1">{option.label}</div>
              <div className="text-xs text-dark-text-secondary">
                {option.hours && <span>{option.hours} horas</span>}
                {option.percentage && <span>{option.percentage}%</span>}
                {option.ratio && <span>{option.ratio}:1</span>}
                {option.multiplier && <span>{option.multiplier}x</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Response Feedback */}
      {selectedValue > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-6 border-t border-dark-border"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">
                {t('assessment.responseRecorded', 'Respuesta registrada')}
              </p>
              
              {/* Show selected option interpretation */}
              {showInterpretation && selectedValue > 0 && (
                <div className="p-3 bg-dark-border/30 rounded-lg">
                  <p className="text-sm text-dark-text-secondary">
                    <span className="font-medium">
                      {t('assessment.selectedOption', 'Opción seleccionada')}:
                    </span>{' '}
                    {responseOptions.find(opt => opt.value === selectedValue)?.label}
                  </p>
                  <p className="text-xs text-dark-text-secondary mt-1">
                    {responseOptions.find(opt => opt.value === selectedValue)?.interpretation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}