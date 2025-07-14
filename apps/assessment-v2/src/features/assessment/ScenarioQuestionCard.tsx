/**
 * Scenario Question Card Component
 * Displays a personalized scenario question with response options
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { DIIDimension } from '@core/types/pain-scenario.types';

interface ScenarioQuestionCardProps {
  dimension: DIIDimension;
  question: string;
  interpretation: string;
  currentResponse?: number | undefined;
  onResponse: (value: number) => void;
}

export function ScenarioQuestionCard({
  dimension,
  question,
  interpretation,
  currentResponse,
  onResponse
}: ScenarioQuestionCardProps) {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(currentResponse || 0);
  const [showInterpretation, setShowInterpretation] = useState(false);

  const handleSelect = (value: number) => {
    setSelectedValue(value);
    onResponse(value);
    setShowInterpretation(true);
  };

  // Response options
  const responseOptions = [
    { value: 1, label: t('assessment.responses.veryPoor', 'Muy deficiente'), color: 'text-red-500' },
    { value: 2, label: t('assessment.responses.poor', 'Deficiente'), color: 'text-orange-500' },
    { value: 3, label: t('assessment.responses.average', 'Regular'), color: 'text-yellow-500' },
    { value: 4, label: t('assessment.responses.good', 'Bueno'), color: 'text-blue-500' },
    { value: 5, label: t('assessment.responses.veryGood', 'Muy bueno'), color: 'text-green-500' }
  ];

  // Dimension descriptions
  const dimensionInfo: Record<DIIDimension, { name: string; icon: typeof AlertCircle }> = {
    TRD: { name: t('dimensions.TRD', 'Resiliencia ante Amenazas'), icon: AlertCircle },
    AER: { name: t('dimensions.AER', 'Exposición de Activos'), icon: AlertCircle },
    HFP: { name: t('dimensions.HFP', 'Factor Humano'), icon: AlertCircle },
    BRI: { name: t('dimensions.BRI', 'Radio de Impacto'), icon: AlertCircle },
    RRG: { name: t('dimensions.RRG', 'Brecha de Recuperación'), icon: AlertCircle }
  };

  const dimensionDetails = dimensionInfo[dimension];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary-600/10 rounded-lg flex items-center justify-center">
          <dimensionDetails.icon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{dimensionDetails.name}</h3>
          <p className="text-sm text-dark-text-secondary">
            {t('assessment.dimension', 'Dimensión')}: {dimension}
          </p>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <p className="text-lg leading-relaxed">{question}</p>
      </div>

      {/* Response Scale */}
      <div className="space-y-4">
        <p className="text-sm text-dark-text-secondary mb-2">
          {t('assessment.selectResponse', 'Seleccione su nivel actual:')}
        </p>
        
        <div className="grid grid-cols-5 gap-2">
          {responseOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'p-4 rounded-lg border-2 transition-all duration-200',
                'hover:border-primary-600/50',
                selectedValue === option.value
                  ? 'border-primary-600 bg-primary-600/10'
                  : 'border-dark-border bg-dark-surface'
              )}
            >
              <div className="text-2xl font-bold mb-1">{option.value}</div>
              <div className={cn('text-sm', option.color)}>{option.label}</div>
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
              
              {/* Show interpretation hint */}
              {showInterpretation && (
                <div className="p-3 bg-dark-border/30 rounded-lg">
                  <p className="text-xs text-dark-text-secondary">
                    <span className="font-medium">
                      {t('assessment.interpretation', 'Interpretación')}:
                    </span>{' '}
                    {interpretation}
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