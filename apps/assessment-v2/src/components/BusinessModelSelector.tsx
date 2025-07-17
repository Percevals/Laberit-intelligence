/**
 * Business Model Selector Component
 * Implements DII 4.0 model selection with archetype grouping
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Shield, Zap } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { ARCHETYPES, getArchetypeByModel, CLASSIFICATION_QUESTIONS } from '@/core/business-model/archetypes';
import { DII_V4_MODEL_PROFILES } from '@/core/business-model/model-profiles-dii-v4';
import type { BusinessModelId } from '@/core/types/business-model.types';

interface BusinessModelSelectorProps {
  onModelSelect: (modelId: BusinessModelId) => void;
  currentModel?: BusinessModelId;
  language?: 'es' | 'en';
}

export function BusinessModelSelector({ 
  onModelSelect, 
  currentModel,
  language = 'es' 
}: BusinessModelSelectorProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [hoveredModel, setHoveredModel] = useState<BusinessModelId | null>(null);

  const getModelName = (modelId: BusinessModelId) => {
    const model = DII_V4_MODEL_PROFILES[modelId];
    return model.name.replace(/_/g, ' ');
  };

  const getModelDescription = (modelId: BusinessModelId) => {
    const model = DII_V4_MODEL_PROFILES[modelId];
    return model.description;
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'operations':
        return <Zap className="w-4 h-4" />;
      case 'trust':
        return <AlertTriangle className="w-4 h-4" />;
      case 'compliance':
        return <Shield className="w-4 h-4" />;
      case 'competitive':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Classification Questions */}
      <div className="bg-dark-surface/50 rounded-lg p-6 border border-dark-border">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
          {language === 'es' ? 'Preguntas clave para clasificación' : 'Key Classification Questions'}
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-1 h-1 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-dark-text-secondary">
              <span className="font-medium text-dark-text-primary">
                {CLASSIFICATION_QUESTIONS.systemFailure[language]}
              </span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-1 h-1 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-dark-text-secondary">
              <span className="font-medium text-dark-text-primary">
                {CLASSIFICATION_QUESTIONS.worstNightmare[language]}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Archetype Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(ARCHETYPES).map(([key, archetype]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "bg-dark-surface rounded-lg p-6 border-2 transition-all cursor-pointer",
              selectedArchetype === key
                ? "border-primary-500"
                : "border-dark-border hover:border-dark-border-hover"
            )}
            onClick={() => setSelectedArchetype(key === selectedArchetype ? null : key)}
          >
            {/* Archetype Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{archetype.emoji}</span>
                  <h3 className="text-xl font-semibold text-dark-text-primary">
                    {archetype.name}
                  </h3>
                </div>
                <p className="text-sm text-dark-text-secondary">
                  {archetype.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-red-400">
                  {archetype.typicalLoss}
                </p>
                <p className="text-xs text-dark-text-tertiary">
                  {language === 'es' ? 'pérdida típica' : 'typical loss'}
                </p>
              </div>
            </div>

            {/* Loss Pattern */}
            <div className="bg-dark-bg/50 rounded p-3 mb-4">
              <p className="text-xs text-dark-text-tertiary mb-1">
                {language === 'es' ? 'Qué pierden primero:' : 'What they lose first:'}
              </p>
              <p className="text-sm font-medium text-dark-text-primary">
                {archetype.lossPattern}
              </p>
            </div>

            {/* Business Models in this Archetype */}
            <div className="space-y-3">
              {archetype.models.map(modelId => {
                const model = DII_V4_MODEL_PROFILES[modelId as BusinessModelId];
                const isSelected = currentModel === modelId;
                const isHovered = hoveredModel === modelId;

                return (
                  <motion.div
                    key={modelId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative p-4 rounded-lg border transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary-500/10 border-primary-500"
                        : "bg-dark-bg/30 border-dark-border hover:border-primary-500/50"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onModelSelect(modelId as BusinessModelId);
                    }}
                    onMouseEnter={() => setHoveredModel(modelId as BusinessModelId)}
                    onMouseLeave={() => setHoveredModel(null)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-dark-text-primary mb-1">
                          {getModelName(modelId as BusinessModelId)}
                        </h4>
                        <p className="text-xs text-dark-text-secondary">
                          {getModelDescription(modelId as BusinessModelId)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getImpactIcon(model.valueLoss.primaryImpact)}
                        <span className="text-xs text-dark-text-tertiary">
                          {model.valueLoss.primaryImpact}
                        </span>
                      </div>
                    </div>

                    {/* Worst Nightmare on Hover */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-dark-surface rounded-lg shadow-lg border border-dark-border z-10"
                      >
                        <p className="text-xs text-dark-text-tertiary mb-1">
                          {language === 'es' ? 'Peor pesadilla:' : 'Worst nightmare:'}
                        </p>
                        <p className="text-sm text-dark-text-primary">
                          "{model.valueLoss.worstNightmare}"
                        </p>
                      </motion.div>
                    )}

                    {isSelected && (
                      <motion.div
                        layoutId="selectedModel"
                        className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Value Loss Summary */}
      {currentModel && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-500/5 border border-primary-500/20 rounded-lg p-6"
        >
          <h4 className="text-lg font-semibold text-dark-text-primary mb-4">
            {language === 'es' ? 'Perfil de pérdida de valor' : 'Value Loss Profile'} - {getModelName(currentModel)}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-dark-text-tertiary mb-1">{language === 'es' ? 'Pérdida por hora' : 'Loss per hour'}</p>
              <p className="text-xl font-bold text-primary-500">
                {DII_V4_MODEL_PROFILES[currentModel].valueLoss.typicalLossPerHour}
              </p>
            </div>
            <div>
              <p className="text-sm text-dark-text-tertiary mb-1">{language === 'es' ? 'Impacto principal' : 'Primary impact'}</p>
              <p className="text-lg font-medium text-dark-text-primary capitalize">
                {DII_V4_MODEL_PROFILES[currentModel].valueLoss.primaryImpact}
              </p>
            </div>
            <div>
              <p className="text-sm text-dark-text-tertiary mb-1">{language === 'es' ? 'Dificultad de recuperación' : 'Recovery difficulty'}</p>
              <p className="text-lg font-medium text-dark-text-primary capitalize">
                {DII_V4_MODEL_PROFILES[currentModel].valueLoss.recoveryDifficulty}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}