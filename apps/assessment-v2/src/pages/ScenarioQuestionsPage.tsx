/**
 * Scenario Questions Page
 * Displays personalized scenario questions based on business model
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { useAssessmentStore } from '@/store/assessment-store';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { ScenarioQuestionCard } from '@features/assessment/ScenarioQuestionCard';
import { lightAssessmentAdapter } from '@services/question-adapter';
// import { DIICalculator } from '@core/dii-engine/calculator'; // Will be used when implementing full calculation
import type { BusinessModelScenarioId } from '@core/types/pain-scenario.types';
import type { LightAssessmentQuestion } from '@services/question-adapter/light-assessment-adapter';
import type { Score, MaturityStage } from '@core/types/dii.types';

export function ScenarioQuestionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    companySearch,
    classification,
    addScenarioResponse,
    getScenarioResponse,
    completeAssessment,
    updateProgress
  } = useAssessmentStore();

  const [currentQuestion, setCurrentQuestion] = useState<LightAssessmentQuestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateProgress('questions');
  }, [updateProgress]);

  useEffect(() => {
    if (!companySearch.selectedCompany || !classification.businessModel) {
      navigate('/assessment/company');
      return;
    }

    loadQuestion();
  }, [companySearch.selectedCompany, classification.businessModel, navigate]);

  const loadQuestion = async () => {
    if (!companySearch.selectedCompany || !classification.businessModel) return;

    setLoading(true);
    try {
      // Map business model to scenario ID
      const modelMapping: Record<string, BusinessModelScenarioId> = {
        'SUBSCRIPTION_BASED': '2_software_critico',
        'TRANSACTION_BASED': '5_servicios_financieros',
        'ASSET_LIGHT': '2_software_critico',
        'ASSET_HEAVY': '6_infraestructura_heredada',
        'DATA_DRIVEN': '3_servicios_datos',
        'PLATFORM_ECOSYSTEM': '4_ecosistema_digital',
        'DIRECT_TO_CONSUMER': '1_comercio_hibrido',
        'B2B_ENTERPRISE': '5_servicios_financieros'
      };

      const scenarioId = modelMapping[classification.businessModel] || '1_comercio_hibrido';

      // For now, get only the TRD question
      const question = await lightAssessmentAdapter.getPersonalizedQuestion(
        scenarioId,
        'TRD',
        companySearch.selectedCompany,
        classification.criticalInfra || false
      );

      setCurrentQuestion(question);
    } catch (error) {
      console.error('Error loading question:', error);
    }
    setLoading(false);
  };

  const handleResponse = (value: number) => {
    if (!currentQuestion) return;

    addScenarioResponse(
      currentQuestion.dimension,
      currentQuestion.adaptedQuestion.adapted,
      value
    );
  };

  const handleComplete = () => {
    // Calculate preliminary score based on single TRD response
    const trdResponse = getScenarioResponse('TRD');
    if (!trdResponse) return;

    // Simple calculation for demo (will be expanded with all 5 dimensions)
    const baseScore = trdResponse.response * 20; // 1-5 scale to 20-100
    const score = Math.min(Math.max(baseScore, 0), 100) as Score;
    
    // Determine maturity stage
    let stage: MaturityStage = 'FRAGIL';
    if (score >= 76) stage = 'ADAPTATIVO';
    else if (score >= 51) stage = 'RESILIENTE';
    else if (score >= 26) stage = 'ROBUSTO';

    // Calculate percentile (simplified)
    const percentile = Math.round(score * 0.8);

    completeAssessment(score, stage, percentile);
    navigate('/assessment/results');
  };

  const steps = [
    { label: t('steps.search', 'Búsqueda') },
    { label: t('steps.confirm', 'Confirmar') },
    { label: t('steps.discover', 'Descubrir') },
    { label: t('steps.evaluate', 'Evaluar') }
  ];

  const hasResponse = currentQuestion && getScenarioResponse(currentQuestion.dimension);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <ProgressIndicator currentStep={4} steps={steps} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light mb-3">
              {t('assessment.title', 'Evaluación de Inmunidad Digital')}
            </h1>
            <p className="text-dark-text-secondary">
              {t('assessment.subtitle', 'Responda basándose en la situación actual de')} {companySearch.selectedCompany?.name}
            </p>
          </div>

          {/* Question Card */}
          {currentQuestion && (
            <ScenarioQuestionCard
              dimension={currentQuestion.dimension}
              question={currentQuestion.adaptedQuestion.adapted}
              interpretation={currentQuestion.interpretation}
              currentResponse={getScenarioResponse(currentQuestion.dimension)?.response}
              onResponse={handleResponse}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => navigate('/assessment/business-model')}
              className="flex items-center gap-2 text-dark-text-secondary hover:text-primary-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              {t('common.back', 'Atrás')}
            </button>

            <button
              onClick={handleComplete}
              disabled={!hasResponse}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg transition-all',
                hasResponse
                  ? 'btn-primary'
                  : 'bg-dark-surface text-dark-text-secondary cursor-not-allowed'
              )}
            >
              {t('assessment.viewResults', 'Ver resultados')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Info */}
          <div className="text-center mt-12 text-sm text-dark-text-secondary">
            <p>
              {t('assessment.lightVersion', 'Versión ligera: 1 pregunta clave')}
            </p>
            <p className="text-xs mt-1">
              {t('assessment.premiumHint', 'La versión premium incluye 5 dimensiones completas')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to ensure proper imports
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}