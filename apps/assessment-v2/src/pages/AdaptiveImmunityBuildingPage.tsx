/**
 * Adaptive Immunity Building Page
 * Intelligent dimension ordering with dynamic flow management
 */

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  Shield, 
  Sparkles,
  Clock,
  Brain,
  Info,
  SkipForward,
  Navigation
} from 'lucide-react';
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
import { lightAssessmentAdapter } from '@services/question-adapter';
import { 
  generateInsightRevelation, 
  generateCuriosityHook,
  type InsightRevelation 
} from '@/services';
import { 
  DimensionOrchestrator,
  type OrchestrationResult,
  type SkipRecommendation 
} from '@/services/dimension-orchestrator';
import type { BusinessModelScenarioId } from '@core/types/pain-scenario.types';
import type { LightAssessmentQuestion } from '@services/question-adapter/light-assessment-adapter';
import { cn } from '@shared/utils/cn';
import { AsyncErrorBoundary } from '@/components/ErrorBoundary';

// Map business model IDs to numeric IDs
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

interface SmartSkipModalProps {
  recommendations: SkipRecommendation[];
  onApply: (skips: SkipRecommendation[]) => void;
  onCancel: () => void;
}

function SmartSkipModal({ recommendations, onApply, onCancel }: SmartSkipModalProps) {
  const [selectedSkips, setSelectedSkips] = useState<Set<DIIDimension>>(new Set());
  
  const handleToggle = (dimension: DIIDimension) => {
    const newSet = new Set(selectedSkips);
    if (newSet.has(dimension)) {
      newSet.delete(dimension);
    } else {
      newSet.add(dimension);
    }
    setSelectedSkips(newSet);
  };
  
  const handleApply = () => {
    const skipsToApply = recommendations.filter(r => selectedSkips.has(r.dimension));
    onApply(skipsToApply);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-dark-surface border border-dark-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-dark-border">
          <h3 className="text-xl font-semibold text-dark-text flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary-600" />
            Smart Skip Recommendations
          </h3>
          <p className="text-sm text-dark-text-secondary mt-1">
            Based on your answers, we can estimate these dimensions with reasonable confidence
          </p>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {recommendations.map((rec) => (
            <motion.div
              key={rec.dimension}
              whileHover={{ scale: 1.01 }}
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all",
                selectedSkips.has(rec.dimension)
                  ? "border-primary-600 bg-primary-600/10"
                  : "border-dark-border hover:border-primary-600/50"
              )}
              onClick={() => handleToggle(rec.dimension)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-dark-text">{rec.dimension}</h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      rec.confidence >= 70 ? "bg-green-600/20 text-green-400" :
                      rec.confidence >= 50 ? "bg-yellow-600/20 text-yellow-400" :
                      "bg-red-600/20 text-red-400"
                    )}>
                      {rec.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-dark-text-secondary mb-2">{rec.rationale}</p>
                  <div className="text-sm font-medium text-primary-400">
                    Suggested value: {rec.suggestedMetric} 
                    {rec.dimension === 'TRD' && ' hours'}
                    {rec.dimension === 'AER' && ` ($${rec.suggestedMetric >= 1000000 ? (rec.suggestedMetric/1000000).toFixed(1) + 'M' : Math.round(rec.suggestedMetric/1000) + 'K'})`}
                    {rec.dimension === 'HFP' && '%'}
                    {rec.dimension === 'BRI' && '%'}
                    {rec.dimension === 'RRG' && 'x'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedSkips.has(rec.dimension)}
                  onChange={() => handleToggle(rec.dimension)}
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="p-6 border-t border-dark-border bg-dark-bg flex justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-dark-text-secondary hover:text-dark-text transition-colors"
          >
            Answer All Questions
          </button>
          <button
            onClick={handleApply}
            disabled={selectedSkips.size === 0}
            className={cn(
              "px-6 py-2 rounded-lg font-medium transition-colors",
              selectedSkips.size > 0
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-dark-surface text-dark-text-secondary cursor-not-allowed"
            )}
          >
            Apply {selectedSkips.size} Skip{selectedSkips.size !== 1 ? 's' : ''}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AdaptiveImmunityBuildingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Assessment store
  const { 
    companySearch,
    classification,
    addScenarioResponse,
    getScenarioResponse,
    completeAssessment,
    updateProgress
  } = useAssessmentStore();

  // DII dimensions store
  const {
    dimensions,
    currentDII,
    setBusinessModel,
    setDimensionResponse
  } = useDIIDimensionsStore();

  // State
  const [orchestration, setOrchestration] = useState<OrchestrationResult | null>(null);
  const [currentDimension, setCurrentDimension] = useState<DIIDimension | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<LightAssessmentQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [showingInsight, setShowingInsight] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<InsightRevelation | null>(null);
  const [allQuestions, setAllQuestions] = useState<Map<DIIDimension, LightAssessmentQuestion>>(new Map());
  const [showSmartSkip, setShowSmartSkip] = useState(false);
  const [skipRecommendations, setSkipRecommendations] = useState<SkipRecommendation[]>([]);
  const [transitionMessage, setTransitionMessage] = useState<string | null>(null);
  const [adaptiveMessage, setAdaptiveMessage] = useState<string | null>(null);

  const answeredDimensions = Object.keys(dimensions) as DIIDimension[];
  const remainingDimensions = orchestration?.recommendedOrder.filter(d => !answeredDimensions.includes(d)) || [];
  const timeEstimate = DimensionOrchestrator.estimateRemainingTime(answeredDimensions);
  const correlationHints = DimensionOrchestrator.getCorrelationHints(dimensions);
  const curiosityMessage = generateCuriosityHook(answeredDimensions.length, 5, currentDII || undefined);

  useEffect(() => {
    updateProgress('questions');
  }, [updateProgress]);

  // Initialize
  useEffect(() => {
    if (!companySearch.selectedCompany || !classification.businessModel) {
      navigate('/assessment/company');
      return;
    }

    const numericId = BUSINESS_MODEL_ID_MAP[classification.businessModel];
    if (numericId) {
      setBusinessModel(numericId as any);
      const initial = DimensionOrchestrator.getInitialOrder(numericId as any);
      setOrchestration(initial);
    }

    loadAllQuestions();
  }, [companySearch.selectedCompany, classification.businessModel]);

  // Update orchestration when dimensions change
  useEffect(() => {
    if (orchestration && answeredDimensions.length > 0) {
      const numericId = BUSINESS_MODEL_ID_MAP[classification.businessModel!];
      const adapted = DimensionOrchestrator.adaptOrder(
        orchestration.recommendedOrder,
        dimensions,
        numericId as any
      );
      
      if (adapted.adaptiveReason) {
        setAdaptiveMessage(adapted.adaptiveReason);
        setTimeout(() => setAdaptiveMessage(null), 5000);
      }
      
      setOrchestration(adapted);
    }
  }, [dimensions]);

  // Set current dimension
  useEffect(() => {
    if (orchestration && !showingInsight) {
      const nextDimension = orchestration.recommendedOrder.find(d => !answeredDimensions.includes(d));
      if (nextDimension && nextDimension !== currentDimension) {
        // Check for transition message
        if (currentDimension) {
          const transition = DimensionOrchestrator.getTransition(currentDimension, nextDimension);
          if (transition) {
            setTransitionMessage(transition.correlationHint);
            setTimeout(() => setTransitionMessage(null), 4000);
          }
        }
        setCurrentDimension(nextDimension);
      }
    }
  }, [orchestration, answeredDimensions, showingInsight]);

  // Load current question
  useEffect(() => {
    if (currentDimension && allQuestions.size > 0) {
      const question = allQuestions.get(currentDimension);
      setCurrentQuestion(question || null);
      setLoading(false);
    }
  }, [currentDimension, allQuestions]);

  // Check for skip recommendations
  useEffect(() => {
    if (answeredDimensions.length >= 2 && remainingDimensions.length > 0) {
      const recommendations = DimensionOrchestrator.getSkipRecommendations(
        dimensions,
        remainingDimensions
      );
      setSkipRecommendations(recommendations);
    }
  }, [dimensions, remainingDimensions]);

  const loadAllQuestions = async () => {
    if (!companySearch.selectedCompany || !classification.businessModel) return;

    setLoading(true);
    try {
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
      const questionsMap = new Map<DIIDimension, LightAssessmentQuestion>();

      for (const dimension of ['TRD', 'AER', 'HFP', 'BRI', 'RRG'] as DIIDimension[]) {
        try {
          const question = await lightAssessmentAdapter.getPersonalizedQuestion(
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
    if (!currentQuestion || !currentDimension) return;

    // Store response
    addScenarioResponse(
      currentQuestion.dimension,
      currentQuestion.adaptedQuestion.adapted,
      value,
      metric
    );

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
        normalizedScore: value * 2,
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

  const handleNextDimension = useCallback(() => {
    if (remainingDimensions.length === 0) {
      handleComplete();
    } else {
      setShowingInsight(false);
      setCurrentInsight(null);
    }
  }, [remainingDimensions]);

  const handleDimensionClick = (dimension: DIIDimension) => {
    if (answeredDimensions.includes(dimension) || dimension === currentDimension) {
      setCurrentDimension(dimension);
      setShowingInsight(false);
    }
  };

  const handleApplySkips = async (skips: SkipRecommendation[]) => {
    setShowSmartSkip(false);
    
    for (const skip of skips) {
      await setDimensionResponse(
        skip.dimension,
        skip.suggestedValue,
        skip.suggestedMetric
      );
    }
    
    // If all dimensions answered, complete
    if (answeredDimensions.length + skips.length >= 5) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (!currentDII) return;

    const score = currentDII.score;
    const stage = score >= 76 ? 'ADAPTATIVO' :
                  score >= 51 ? 'RESILIENTE' :
                  score >= 26 ? 'ROBUSTO' : 'FRAGIL';
    const percentile = currentDII.percentile || 50;

    completeAssessment(score as any, stage, percentile);
    navigate('/assessment/results');
  };

  // Build dimension states
  const dimensionStates: ImmunityDimensionState[] = (orchestration?.recommendedOrder || []).map((dim) => {
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
    } else if (dim === currentDimension) {
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
            {t('assessment.optimizingFlow', 'Optimizing assessment flow for')} {classification.businessModel}...
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
        <div className="text-center mb-6">
          <h1 className="text-3xl font-light mb-3 text-dark-text">
            {t('assessment.adaptiveTitle', 'Adaptive Immunity Assessment')}
          </h1>
          <p className="text-dark-text-secondary">
            {companySearch.selectedCompany?.name} • {classification.businessModel}
          </p>
        </div>

        {/* Progress and Time Estimate */}
        <div className="mb-6 space-y-4">
          <InsightProgressBar
            current={answeredDimensions.length}
            total={5}
            message={curiosityMessage}
          />
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-dark-text-secondary">
              <Clock className="w-4 h-4" />
              <span>~{timeEstimate.minutes} minutes remaining</span>
            </div>
            {skipRecommendations.length > 0 && answeredDimensions.length >= 2 && (
              <button
                onClick={() => setShowSmartSkip(true)}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-500 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                Smart Skip Available
              </button>
            )}
          </div>
        </div>

        {/* Adaptive Message */}
        <AnimatePresence>
          {adaptiveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-primary-600/10 border border-primary-600/20 rounded-lg flex items-start gap-3"
            >
              <Brain className="w-5 h-5 text-primary-600 mt-0.5" />
              <p className="text-sm text-dark-text">{adaptiveMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transition Message */}
        <AnimatePresence>
          {transitionMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 p-4 bg-purple-600/10 border border-purple-600/20 rounded-lg flex items-start gap-3"
            >
              <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
              <p className="text-sm text-dark-text">{transitionMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Correlation Hints */}
        {correlationHints.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
            <h4 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Pattern Detected
            </h4>
            <ul className="space-y-1">
              {correlationHints.map((hint, index) => (
                <li key={index} className="text-sm text-dark-text-secondary">{hint}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Timeline Navigation */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-dark-text-secondary mb-2 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Optimized for {classification.businessModel?.replace(/_/g, ' ')}
              </h3>
            </div>
            <AsyncErrorBoundary>
              <ImmunityTimelineNavigation
                dimensions={dimensionStates}
                onDimensionSelect={handleDimensionClick}
              />
            </AsyncErrorBoundary>
          </div>

          {/* Question and Insights Area */}
          <div className="lg:col-span-3 space-y-6">
            <AsyncErrorBoundary>
              <AnimatePresence mode="wait">
                {!showingInsight ? (
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
                          onNextDimension={() => handleNextDimension()}
                        />
                        
                        <div className="flex justify-center">
                          <button
                            onClick={handleNextDimension}
                            className="btn-primary flex items-center gap-2 px-8 py-3"
                          >
                            {remainingDimensions.length > 0 ? (
                              <>
                                {t('assessment.continue', 'Continue Assessment')}
                                <ArrowRight className="w-5 h-5" />
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-5 h-5" />
                                {t('assessment.viewCompleteProfile', 'View Complete Profile')}
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
            </AsyncErrorBoundary>

            {/* Live DII Score */}
            {answeredDimensions.length >= 2 && currentDII && !showingInsight && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-surface rounded-lg p-6 text-center"
              >
                <div className="text-sm text-dark-text-secondary mb-2">
                  {t('assessment.currentDII', 'Current DII')}
                </div>
                <div className="text-4xl font-bold text-primary-600">
                  {currentDII.score}
                </div>
                <div className="text-xs text-dark-text-secondary mt-2">
                  {t('assessment.confidence', 'Confidence')}: {currentDII.confidence}%
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={() => {
              if (showingInsight) {
                setShowingInsight(false);
              } else {
                navigate('/assessment/business-model');
              }
            }}
            className="flex items-center gap-2 text-dark-text-secondary hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {t('common.back', 'Back')}
          </button>

          {!showingInsight && hasCurrentResponse && (
            <button
              onClick={handleNextDimension}
              className="flex items-center gap-2 px-6 py-3 btn-primary"
            >
              {remainingDimensions.length > 0 ? (
                <>
                  {t('common.continue', 'Continue')}
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  {t('assessment.viewResults', 'View Results')}
                  <Shield className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Smart Skip Modal */}
      <AnimatePresence>
        {showSmartSkip && (
          <SmartSkipModal
            recommendations={skipRecommendations}
            onApply={handleApplySkips}
            onCancel={() => setShowSmartSkip(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}