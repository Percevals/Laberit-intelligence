/**
 * Enhanced Results Page
 * Shows DII score with full business context and interpretation
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  DollarSign,
  BarChart3,
  ArrowRight,
  Download
} from 'lucide-react';
import { useAssessmentStore } from '@/store/assessment-store';
import { AssessmentCalculator } from '@services/assessment';
import { DIIGauge } from '@ui/components/DIIGauge';
import { cn } from '@shared/utils/cn';
import type { Score } from '@core/types/dii.types';

export function EnhancedResultsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    companySearch,
    classification,
    results,
    scenarioResponses
  } = useAssessmentStore();

  // Recalculate with full context if needed
  const calculatedResult = results.diiScore ? null : (() => {
    if (!companySearch.selectedCompany || !classification.businessModel) return null;
    
    return AssessmentCalculator.calculateFromResponses({
      company: companySearch.selectedCompany,
      businessModel: classification.businessModel,
      criticalInfra: classification.criticalInfra || false,
      responses: scenarioResponses
    });
  })();

  const diiScore = results.diiScore || calculatedResult?.diiScore.normalized || 50 as Score;
  const stage = results.maturityStage || calculatedResult?.diiScore.interpretation.stage || 'ROBUSTO';
  const percentile = results.percentile || calculatedResult?.diiScore.interpretation.betterThan || 50;
  
  // Get interpretation details
  const interpretation = calculatedResult?.diiScore.interpretation || {
    operationalRisk: 'MEDIUM',
    estimatedDowntimeHours: 24,
    revenueAtRisk: 20,
    headline: 'Evaluación completada',
    strengths: [],
    vulnerabilities: []
  };

  // Stage descriptions
  const stageInfo = {
    FRAGIL: {
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      icon: AlertTriangle,
      description: t('maturityStages.fragil.description')
    },
    ROBUSTO: {
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      icon: Shield,
      description: t('maturityStages.robusto.description')
    },
    RESILIENTE: {
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      icon: TrendingUp,
      description: t('maturityStages.resiliente.description')
    },
    ADAPTATIVO: {
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      icon: TrendingUp,
      description: t('maturityStages.adaptativo.description')
    }
  };

  const currentStage = stageInfo[stage];
  const StageIcon = currentStage.icon;

  // Risk level colors
  const riskColors = {
    CRITICAL: 'text-red-500',
    HIGH: 'text-orange-500',
    MEDIUM: 'text-yellow-500',
    LOW: 'text-green-500'
  };

  useEffect(() => {
    if (!companySearch.selectedCompany) {
      navigate('/assessment/company');
    }
  }, [companySearch.selectedCompany, navigate]);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-gradient-to-b from-dark-surface to-dark-bg">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-light mb-2">
              {t('assessment.results.title')}
            </h1>
            <p className="text-xl text-dark-text-secondary">
              {companySearch.selectedCompany?.name}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Score Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Score Gauge */}
          <div className="card p-8 flex flex-col items-center justify-center">
            <DIIGauge 
              score={diiScore} 
              stage={stage}
              size="large"
              animated
              showLabels
            />
            <div className="mt-6 text-center">
              <p className="text-2xl font-bold mb-1">{diiScore}</p>
              <p className="text-dark-text-secondary">
                {t('assessment.results.betterThan', { percentage: percentile })}
              </p>
            </div>
          </div>
          
          {/* Stage & Risk Summary */}
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', currentStage.bgColor)}>
                <StageIcon className={cn('w-6 h-6', currentStage.color)} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{stage}</h2>
                <p className="text-sm text-dark-text-secondary">
                  {t('assessment.results.stage')}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-dark-text-secondary mb-6">
              {currentStage.description}
            </p>

            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-dark-surface rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-dark-text-secondary" />
                  <span className="text-sm">{t('assessment.results.operationalRisk')}</span>
                </div>
                <span className={cn('font-semibold', riskColors[interpretation.operationalRisk])}>
                  {interpretation.operationalRisk}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-surface rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-dark-text-secondary" />
                  <span className="text-sm">{t('assessment.results.estimatedDowntime')}</span>
                </div>
                <span className="font-semibold text-primary-600">
                  {interpretation.estimatedDowntimeHours}h
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-surface rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-dark-text-secondary" />
                  <span className="text-sm">{t('assessment.results.revenueAtRisk')}</span>
                </div>
                <span className="font-semibold text-primary-600">
                  {interpretation.revenueAtRisk}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dimension Breakdown (if available) */}
        {calculatedResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-8 mb-12"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary-600" />
              {t('assessment.results.dimensionBreakdown', 'Análisis por Dimensión')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(calculatedResult.interpretations).map(([dimension, interp]: [string, any]) => (
                <div key={dimension} className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {interp.interpretedValue}
                  </div>
                  <div className="text-sm font-medium">{dimension}</div>
                  <div className="text-xs text-dark-text-secondary">
                    {interp.rawResponse}/5 → {interp.interpretedValue}/10
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-dark-surface rounded-lg">
              <p className="text-sm text-dark-text-secondary">
                <span className="font-medium">{t('assessment.formula', 'Fórmula DII')}:</span>{' '}
                (TRD × AER) / (HFP × BRI × RRG)
              </p>
            </div>
          </motion.div>
        )}

        {/* Business Model Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-8 mb-12"
        >
          <h3 className="text-xl font-semibold mb-4">
            {t('assessment.results.context', 'Contexto de su Modelo de Negocio')}
          </h3>
          <p className="text-dark-text-secondary mb-4">
            Como {t(`businessModels.names.${classification.businessModel}`)}, 
            {classification.criticalInfra && ' operando infraestructura crítica,'}
            {' '}su organización enfrenta desafíos únicos de ciberseguridad.
          </p>
          
          {/* Key insights based on responses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarioResponses.slice(0, 2).map((response, idx) => (
              <div key={idx} className="p-4 bg-dark-surface rounded-lg">
                <p className="text-sm font-medium mb-1">{response.dimension}</p>
                <p className="text-xs text-dark-text-secondary">
                  {response.response <= 2 ? '⚠️ Área de mejora prioritaria' : 
                   response.response >= 4 ? '✅ Fortaleza identificada' : 
                   '📊 Rendimiento promedio'}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            {t('assessment.results.newAssessment', 'Nueva Evaluación')}
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-5 h-5" />
            {t('report.downloadPDF')}
          </button>
          <button className="btn-primary flex items-center gap-2">
            {t('assessment.results.fullReport', 'Ver Informe Completo')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Light Version Notice */}
        <div className="text-center mt-12 text-sm text-dark-text-secondary">
          <p>{t('assessment.results.lightNotice', 'Evaluación ligera basada en pregunta TRD.')}</p>
          <p className="mt-1">
            {t('assessment.results.premiumCTA', 'La versión premium incluye las 5 dimensiones completas.')}
          </p>
        </div>
      </div>
    </div>
  );
}