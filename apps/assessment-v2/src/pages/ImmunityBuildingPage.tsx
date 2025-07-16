/**
 * Immunity Building Page
 * Full 5-dimension journey with progressive DII calculation and insights
 */

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessmentStore } from '@/store/assessment-store';
import { useDIIDimensionsStore } from '@/store/dii-dimensions-store';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { 
  ImmunityTimelineNavigation,
  InsightRevelationCard,
  InsightProgressBar,
  type DIIDimension,
  type ImmunityDimensionState
} from '@/components';
import { ScenarioQuestionCard } from '@features/assessment/ScenarioQuestionCard';
import { assessmentAdapter } from '@services/question-adapter';
import { 
  generateInsightRevelation, 
  generateCuriosityHook,
  type InsightRevelation 
} from '@/services';
import type { BusinessModelScenarioId } from '@core/types/pain-scenario.types';
import type { AssessmentQuestion } from '@services/question-adapter/assessment-adapter';

const DIMENSION_ORDER: DIIDimension[] = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'];

// Map business model IDs to numeric IDs for dii-dimensions-store
const BUSINESS_MODEL_ID_MAP: Record<string, number> = {
  'COMERCIO_HIBRIDO': 1,
  'SOFTWARE_CRITICO': 2,
  'SERVICIOS_DATOS': 3,
  'ECOSISTEMA_DIGITAL': 4,
  'SERVICIOS_FINANCIEROS': 5,
  'INFRAESTRUCTURA_HEREDADA': 6,
  'CADENA_SUMINISTRO': 7,
  'INFORMACION_REGULADA': 8
};

export function ImmunityBuildingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Assessment store for company and model data
  const { 
    companySearch,
    classification,
    addScenarioResponse,
    getScenarioResponse,
    completeAssessment,
    updateProgress
  } = useAssessmentStore();

  // DII dimensions store for progressive calculation
  const {
    dimensions,
    currentDII,
    businessModelId,
    setBusinessModel,
    setDimensionResponse
  } = useDIIDimensionsStore();

  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [showingInsight, setShowingInsight] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<InsightRevelation | null>(null);
  const [allQuestions, setAllQuestions] = useState<Map<DIIDimension, AssessmentQuestion>>(new Map());

  const currentDimension = DIMENSION_ORDER[currentDimensionIndex];
  const answeredDimensions = Object.keys(dimensions) as DIIDimension[];
  const curiosityMessage = generateCuriosityHook(answeredDimensions.length, 5, currentDII || undefined);

  useEffect(() => {
    updateProgress('questions');
  }, [updateProgress]);

  // Initialize business model in DII store
  useEffect(() => {
    if (classification.businessModel) {
      const numericId = BUSINESS_MODEL_ID_MAP[classification.businessModel];
      if (numericId && numericId !== businessModelId) {
        setBusinessModel(numericId as any);
      }
    }
  }, [classification.businessModel, businessModelId, setBusinessModel]);

  // Load all questions upfront
  useEffect(() => {
    if (!companySearch.selectedCompany || !classification.businessModel) {
      navigate('/assessment/company');
      return;
    }

    loadAllQuestions();
  }, [companySearch.selectedCompany, classification.businessModel]);

  // Load current question
  useEffect(() => {
    if (allQuestions.size > 0) {
      if (currentDimension) {
        const question = allQuestions.get(currentDimension);
        setCurrentQuestion(question || null);
      }
      setLoading(false);
    }
  }, [currentDimension, allQuestions]);

  const loadAllQuestions = async () => {
    if (!companySearch.selectedCompany || !classification.businessModel) return;

    setLoading(true);
    try {
      // Map business model to scenario ID
      const modelMapping: Record<string, BusinessModelScenarioId> = {
        'COMERCIO_HIBRIDO': '1_comercio_hibrido',
        'SOFTWARE_CRITICO': '2_software_critico',
        'SERVICIOS_DATOS': '3_servicios_datos',
        'ECOSISTEMA_DIGITAL': '4_ecosistema_digital',
        'SERVICIOS_FINANCIEROS': '5_servicios_financieros',
        'INFRAESTRUCTURA_HEREDADA': '6_infraestructura_heredada',
        'CADENA_SUMINISTRO': '7_cadena_suministro',
        'INFORMACION_REGULADA': '8_informacion_regulada',
      };

      const scenarioId = modelMapping[classification.businessModel] || '1_comercio_hibrido';
      const questionsMap = new Map<DIIDimension, AssessmentQuestion>();

      // Load all dimension questions
      for (const dimension of DIMENSION_ORDER) {
        try {
          const question = await assessmentAdapter.getPersonalizedQuestion(
            scenarioId,
            dimension,
            companySearch.selectedCompany,
            classification.criticalInfra || false
          );
          questionsMap.set(dimension, question);
        } catch (error) {
          console.error(`Error loading question for ${dimension}:`, error);
        }
      }

      setAllQuestions(questionsMap);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleResponse = async (value: number, metric: any) => {
    if (!currentQuestion) return;

    // Store in assessment store
    addScenarioResponse(
      currentQuestion.dimension,
      currentQuestion.adaptedQuestion.adapted,
      value,
      metric
    );

    // Store in DII dimensions store and get impact
    await setDimensionResponse(
      currentQuestion.dimension,
      value,
      metric?.value || metric || value
    );

    // Generate insight
    const insight = generateInsightRevelation(
      currentQuestion.dimension,
      {
        dimension: currentQuestion.dimension,
        rawValue: value,
        metricValue: metric?.value || metric || value,
        normalizedScore: value * 2, // Simplified normalization
        timestamp: new Date(),
        confidence: 90
      },
      BUSINESS_MODEL_ID_MAP[classification.businessModel!] as any,
      dimensions,
      currentDII || undefined
    );

    setCurrentInsight(insight);
    setShowingInsight(true);
  };

  const handleNextDimension = useCallback((dimension?: string) => {
    if (dimension) {
      const index = DIMENSION_ORDER.indexOf(dimension as DIIDimension);
      if (index >= 0) {
        setCurrentDimensionIndex(index);
      }
    } else if (currentDimensionIndex < DIMENSION_ORDER.length - 1) {
      setCurrentDimensionIndex(currentDimensionIndex + 1);
    } else {
      // Complete assessment
      handleComplete();
    }
    setShowingInsight(false);
    setCurrentInsight(null);
  }, [currentDimensionIndex]);

  const handleComplete = () => {
    if (!currentDII) return;

    // Calculate final values
    const score = currentDII.score;
    const stage = score >= 76 ? 'ADAPTATIVO' :
                  score >= 51 ? 'RESILIENTE' :
                  score >= 26 ? 'ROBUSTO' : 'FRAGIL';
    const percentile = currentDII.percentile || 50;

    completeAssessment(score as any, stage, percentile);
    navigate('/assessment/results');
  };

  const handleDimensionClick = (dimension: DIIDimension) => {
    const index = DIMENSION_ORDER.indexOf(dimension);
    // Only allow navigation to answered dimensions or the next unanswered one
    if (index <= answeredDimensions.length) {
      setCurrentDimensionIndex(index);
      setShowingInsight(false);
    }
  };

  // Build dimension states for timeline
  const dimensionStates: ImmunityDimensionState[] = DIMENSION_ORDER.map((dim, index) => {
    const response = dimensions[dim];
    const question = allQuestions.get(dim);
    
    if (response) {
      return {
        dimension: dim,
        status: 'completed',
        capturedValue: `${response.metricValue}`,
        capturedScore: response.normalizedScore,
        question: question?.adaptedQuestion.adapted,
        responseOptions: question?.responseOptions
      };
    } else if (index === currentDimensionIndex) {
      return {
        dimension: dim,
        status: 'active',
        question: question?.adaptedQuestion.adapted,
        responseOptions: question?.responseOptions
      };
    } else {
      return {
        dimension: dim,
        status: 'upcoming',
        question: question?.dimensionName || `${dim} Assessment`
      };
    }
  });

  const steps = [
    { label: t('steps.search', 'Búsqueda') },
    { label: t('steps.confirm', 'Confirmar') },
    { label: t('steps.discover', 'Descubrir') },
    { label: t('steps.evaluate', 'Evaluar') }
  ];

  const hasCurrentResponse = currentQuestion && getScenarioResponse(currentQuestion.dimension);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="space-y-4 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-600/20 rounded-full"
          >
            <Shield className="w-8 h-8 text-primary-600" />
          </motion.div>
          <p className="text-dark-text-secondary">
            {t('assessment.loadingQuestions', 'Preparando tu evaluación de inmunidad...')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <ProgressIndicator currentStep={4} steps={steps} />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light mb-3 text-dark-text">
            {t('assessment.immunityTitle', 'Construyendo tu Perfil de Inmunidad Digital')}
          </h1>
          <p className="text-dark-text-secondary">
            {t('assessment.immunitySubtitle', 'Evaluación completa de')} {companySearch.selectedCompany?.name}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <InsightProgressBar
            current={answeredDimensions.length}
            total={5}
            message={curiosityMessage}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Timeline Navigation */}
          <div className="lg:col-span-1">
            <ImmunityTimelineNavigation
              dimensions={dimensionStates}
              onDimensionSelect={handleDimensionClick}
            />
          </div>

          {/* Question and Insights Area */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {!showingInsight ? (
                // Question Card
                <motion.div
                  key="question"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {currentQuestion && (
                    <ScenarioQuestionCard
                      dimension={currentQuestion.dimension}
                      dimensionName={currentQuestion.dimensionName}
                      question={currentQuestion.adaptedQuestion.adapted}
                      responseOptions={currentQuestion.responseOptions}
                      contextForUser={currentQuestion.contextForUser}
                      currentResponse={getScenarioResponse(currentQuestion.dimension)?.response}
                      onResponse={handleResponse}
                    />
                  )}
                </motion.div>
              ) : (
                // Insight Card
                <motion.div
                  key="insight"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  {currentInsight && (
                    <div className="space-y-6">
                      <InsightRevelationCard
                        insight={currentInsight}
                        onNextDimension={(dim) => handleNextDimension(dim)}
                      />
                      
                      {/* Continue Button */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleNextDimension()}
                          className="btn-primary flex items-center gap-2 px-8 py-3"
                        >
                          {currentDimensionIndex < DIMENSION_ORDER.length - 1 ? (
                            <>
                              {t('assessment.nextDimension', 'Siguiente Dimensión')}
                              <ArrowRight className="w-5 h-5" />
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              {t('assessment.viewCompleteProfile', 'Ver Perfil Completo')}
                              <Shield className="w-5 h-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Live DII Score (if multiple dimensions answered) */}
            {answeredDimensions.length >= 2 && currentDII && !showingInsight && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-surface rounded-lg p-6 text-center"
              >
                <div className="text-sm text-dark-text-secondary mb-2">
                  {t('assessment.currentDII', 'Tu DII actual')}
                </div>
                <div className="text-4xl font-bold text-primary-600">
                  {currentDII.score}
                </div>
                <div className="text-xs text-dark-text-secondary mt-2">
                  {t('assessment.confidenceLevel', 'Nivel de confianza')}: {currentDII.confidence}%
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={() => {
              if (currentDimensionIndex > 0 && !showingInsight) {
                setCurrentDimensionIndex(currentDimensionIndex - 1);
              } else if (showingInsight) {
                setShowingInsight(false);
              } else {
                navigate('/assessment/business-model');
              }
            }}
            className="flex items-center gap-2 text-dark-text-secondary hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {t('common.back', 'Atrás')}
          </button>

          {!showingInsight && hasCurrentResponse && (
            <button
              onClick={() => handleNextDimension()}
              className="flex items-center gap-2 px-6 py-3 btn-primary"
            >
              {currentDimensionIndex < DIMENSION_ORDER.length - 1 ? (
                <>
                  {t('common.continue', 'Continuar')}
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  {t('assessment.viewResults', 'Ver resultados')}
                  <Shield className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}