/**
 * Classification Page v4.0
 * Updated with archetype grouping and value loss patterns
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Building2, Info } from 'lucide-react';
import { BusinessModelSelector } from '@/components/BusinessModelSelector';
import { DII_V4_MODEL_PROFILES } from '@/core/business-model/model-profiles-dii-v4';
import { getArchetypeByModel } from '@/core/business-model/archetypes';
import { useAssessmentStore } from '@/store/assessment-store';
import type { BusinessModelId } from '@/core/types/business-model.types';

export function ClassificationPageV4() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setBusinessModel, setClassificationCompleted } = useAssessmentStore();
  const [selectedModel, setSelectedModel] = useState<BusinessModelId | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleModelSelect = (modelId: BusinessModelId) => {
    setSelectedModel(modelId);
    const model = DII_V4_MODEL_PROFILES[modelId];
    setBusinessModel(model.name);
  };

  const handleContinue = () => {
    if (selectedModel) {
      setClassificationCompleted(true);
      navigate('/assessment/questions');
    }
  };

  const selectedModelProfile = selectedModel ? DII_V4_MODEL_PROFILES[selectedModel] : null;
  const selectedArchetype = selectedModel ? getArchetypeByModel(selectedModel) : null;

  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-dark-text-primary mb-4">
            Clasificación de Modelo de Negocio
          </h1>
          <p className="text-lg text-dark-text-secondary max-w-3xl mx-auto">
            En la era digital, tu modelo de negocio determina cómo pierdes valor cuando tus sistemas fallan.
            Identifica tu modelo para entender tu perfil de riesgo único.
          </p>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-dark-text-primary">
                ¿Por qué importa el modelo de negocio?
              </h3>
              <p className="text-sm text-dark-text-secondary">
                Dos empresas del mismo sector pueden perder $5K o $100K por hora durante un incidente. 
                La diferencia no es el tamaño, es el modelo de negocio. Entender cómo creas y pierdes 
                valor es el primer paso para construir inmunidad digital.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Business Model Selector */}
        <BusinessModelSelector
          onModelSelect={handleModelSelect}
          currentModel={selectedModel || undefined}
          language={i18n.language as 'es' | 'en'}
        />

        {/* Selected Model Details */}
        {selectedModelProfile && selectedArchetype && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-dark-surface rounded-lg p-6 border border-dark-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark-text-primary">
                Modelo seleccionado: {selectedModelProfile.name.replace(/_/g, ' ')}
              </h3>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
              >
                {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
              </button>
            </div>

            {/* Key Characteristics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-dark-text-tertiary mb-3">
                  Fortalezas inherentes
                </h4>
                <ul className="space-y-2">
                  {selectedModelProfile.inherentStrengths.slice(0, 2).map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-dark-text-secondary">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-dark-text-tertiary mb-3">
                  Vulnerabilidades críticas
                </h4>
                <ul className="space-y-2">
                  {selectedModelProfile.fatalFlaws.slice(0, 2).map((flaw, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-dark-text-secondary">{flaw}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Show more details */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6 pt-6 border-t border-dark-border"
              >
                {/* Common Challenges */}
                <div>
                  <h4 className="text-sm font-medium text-dark-text-tertiary mb-3">
                    Desafíos comunes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedModelProfile.commonChallenges.map((challenge, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-dark-text-tertiary" />
                        <span className="text-sm text-dark-text-secondary">{challenge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DII Base Range */}
                <div>
                  <h4 className="text-sm font-medium text-dark-text-tertiary mb-3">
                    Rango DII esperado
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-dark-bg rounded-full h-2 relative">
                      <div
                        className="absolute inset-y-0 bg-primary-500/30 rounded-full"
                        style={{
                          left: `${(selectedModelProfile.diiBase.min / 250) * 100}%`,
                          right: `${100 - (selectedModelProfile.diiBase.max / 250) * 100}%`
                        }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full"
                        style={{
                          left: `${(selectedModelProfile.diiBase.avg / 250) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-dark-text-secondary">
                      {selectedModelProfile.diiBase.min} - {selectedModelProfile.diiBase.max}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex justify-end"
            >
              <button
                onClick={handleContinue}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                Continuar con la evaluación
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}