/**
 * Business Value Results Page
 * DII v4.0 results focused on business value protection
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Users,
  Award,
  Target,
  ArrowRight,
  Download,
  BarChart3,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Building
} from 'lucide-react';
import { useAssessmentStore } from '@/store/assessment-store';
import { useDIIDimensionsStore } from '@/store/dii-dimensions-store';
import { DIIGauge } from '@ui/components/DIIGauge';
import { ImpactDistributionChart } from '@/components/ImpactDistributionChart';
import { cn } from '@shared/utils/cn';
import { 
  MATURITY_STAGES, 
  getMaturityStage, 
  getImpactDistribution,
  getPercentileContext,
  getBusinessValueRecommendations
} from '@/core/dii-engine/maturity-v4';
import { DII_V4_DIMENSIONS } from '@/core/dii-engine/dimensions-v4';
import type { BusinessModelId } from '@core/types/business-model.types';

export function BusinessValueResultsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    companySearch,
    classification,
    results
  } = useAssessmentStore();
  
  const {
    currentDII,
    dimensions
  } = useDIIDimensionsStore();

  const [showFullBreakdown, setShowFullBreakdown] = useState(false);

  // Get the DII score and context
  const diiScore = currentDII?.score || results.diiScore || 50;
  const maturityStage = getMaturityStage(diiScore);
  const maturityInfo = MATURITY_STAGES[maturityStage];
  
  // Business model mapping
  const businessModelMapping: Record<string, BusinessModelId> = {
    'COMERCIO_HIBRIDO': 1,
    'SOFTWARE_CRITICO': 2,
    'SERVICIOS_DATOS': 3,
    'ECOSISTEMA_DIGITAL': 4,
    'SERVICIOS_FINANCIEROS': 5,
    'INFRAESTRUCTURA_HEREDADA': 6,
    'CADENA_SUMINISTRO': 7,
    'INFORMACION_REGULADA': 8
  };
  
  const businessModelId = businessModelMapping[classification.businessModel || 'COMERCIO_HIBRIDO'];
  const impactDistribution = getImpactDistribution(businessModelId);
  const percentileContext = getPercentileContext(diiScore, businessModelId);
  
  // Get dimension weaknesses for recommendations
  const dimensionScores = Object.entries(dimensions).map(([dim, response]) => ({
    dimension: dim,
    score: response.normalizedScore
  })).sort((a, b) => a.score - b.score);
  
  const weakestDimensions = dimensionScores.slice(0, 2).map(d => d.dimension);
  const recommendations = getBusinessValueRecommendations(maturityStage, businessModelId, weakestDimensions);

  // Stage icon and colors
  const stageConfig = {
    FRAGIL: { 
      icon: XCircle, 
      color: 'text-red-500', 
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    },
    ROBUSTO: { 
      icon: AlertTriangle, 
      color: 'text-orange-500', 
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    },
    RESILIENTE: { 
      icon: Shield, 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    ADAPTATIVO: { 
      icon: CheckCircle2, 
      color: 'text-green-500', 
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    }
  };

  const currentStageConfig = stageConfig[maturityStage];
  const StageIcon = currentStageConfig.icon;

  useEffect(() => {
    if (!companySearch.selectedCompany) {
      navigate('/assessment/company');
    }
  }, [companySearch.selectedCompany, navigate]);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-gradient-to-b from-dark-surface to-dark-bg">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-light mb-2">
              Capacidad de Protección de Valor
            </h1>
            <p className="text-xl text-dark-text-secondary">
              {companySearch.selectedCompany?.name} • {t(`businessModels.names.${classification.businessModel}`)}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Score and Maturity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* DII Score */}
          <div className="card p-8 text-center">
            <DIIGauge 
              score={diiScore} 
              stage={maturityStage}
              size="large"
              animated
              showLabels
            />
            <div className="mt-6">
              <p className="text-3xl font-bold mb-2">{diiScore}</p>
              <p className="text-dark-text-secondary">
                Digital Immunity Index
              </p>
            </div>
          </div>
          
          {/* Maturity Stage */}
          <div className={cn("card p-8 border-2", currentStageConfig.borderColor)}>
            <div className="flex items-center gap-4 mb-6">
              <div className={cn('w-16 h-16 rounded-xl flex items-center justify-center', currentStageConfig.bgColor)}>
                <StageIcon className={cn('w-8 h-8', currentStageConfig.color)} />
              </div>
              <div>
                <h2 className="text-3xl font-bold">{maturityStage}</h2>
                <p className="text-sm text-dark-text-secondary">
                  Estadio de Inmunidad Digital
                </p>
              </div>
            </div>
            
            <div className={cn('p-4 rounded-lg mb-4', currentStageConfig.bgColor)}>
              <p className={cn('font-semibold text-lg', currentStageConfig.color)}>
                {maturityInfo.valueLoss}
              </p>
            </div>
            
            <p className="text-sm text-dark-text-secondary">
              {maturityInfo.description}
            </p>
          </div>
        </motion.div>

        {/* Percentile and Competition Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12"
        >
          {/* Percentile */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-primary-600" />
              <h3 className="text-lg font-semibold">Su Posición</h3>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">
                P{percentileContext.percentile}
              </p>
              <p className="text-sm text-dark-text-secondary mb-3">
                {percentileContext.interpretation}
              </p>
              <div className="w-full bg-dark-surface rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${percentileContext.percentile}%` }}
                />
              </div>
            </div>
          </div>

          {/* Model Average */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building className="w-6 h-6 text-orange-500" />
              <h3 className="text-lg font-semibold">Promedio del Modelo</h3>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-500 mb-2">
                {percentileContext.modelAverage.toFixed(1)}
              </p>
              <p className="text-sm text-dark-text-secondary">
                Su industria promedia
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                {diiScore > percentileContext.modelAverage ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={cn(
                  'text-sm font-medium',
                  diiScore > percentileContext.modelAverage ? 'text-green-500' : 'text-red-500'
                )}>
                  {diiScore > percentileContext.modelAverage ? 'Sobre' : 'Bajo'} promedio
                </span>
              </div>
            </div>
          </div>

          {/* Competitive Context */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold">Contexto Competitivo</h3>
            </div>
            <div className="text-center">
              <div className={cn(
                'w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center',
                percentileContext.percentile >= 75 ? 'bg-green-500/10' :
                percentileContext.percentile >= 50 ? 'bg-yellow-500/10' :
                'bg-red-500/10'
              )}>
                {percentileContext.percentile >= 75 ? (
                  <Shield className="w-6 h-6 text-green-500" />
                ) : percentileContext.percentile >= 50 ? (
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                ) : (
                  <Target className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className="text-sm text-dark-text-secondary">
                {percentileContext.competitive}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Impact Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <ImpactDistributionChart 
            distribution={impactDistribution}
            businessModel={classification.businessModel || 'COMERCIO_HIBRIDO'}
          />
        </motion.div>

        {/* Dimension Breakdown */}
        {Object.keys(dimensions).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-8 mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary-600" />
                Fortalezas y Vulnerabilidades por Dimensión
              </h3>
              <button
                onClick={() => setShowFullBreakdown(!showFullBreakdown)}
                className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
              >
                {showFullBreakdown ? 'Ocultar detalles' : 'Ver detalles'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {Object.entries(dimensions).map(([dim, response]) => {
                const dimInfo = DII_V4_DIMENSIONS[dim as keyof typeof DII_V4_DIMENSIONS];
                const score = response.normalizedScore;
                const isStrong = score >= 7;
                const isWeak = score <= 4;
                
                return (
                  <div key={dim} className="text-center">
                    <div className={cn(
                      'w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center text-2xl font-bold',
                      isStrong ? 'bg-green-500/10 text-green-500' :
                      isWeak ? 'bg-red-500/10 text-red-500' :
                      'bg-blue-500/10 text-blue-500'
                    )}>
                      {score.toFixed(1)}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{dimInfo.nameES}</h4>
                    <p className="text-xs text-dark-text-secondary">{dim}</p>
                    {isStrong && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500">Fortaleza</span>
                      </div>
                    )}
                    {isWeak && (
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-500">Vulnerable</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {showFullBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-dark-border pt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(dimensions).map(([dim, response]) => {
                    const dimInfo = DII_V4_DIMENSIONS[dim as keyof typeof DII_V4_DIMENSIONS];
                    
                    return (
                      <div key={dim} className="p-4 bg-dark-surface rounded-lg">
                        <h5 className="font-medium mb-2">{dimInfo.nameES}</h5>
                        <p className="text-xs text-dark-text-secondary mb-3">
                          {dimInfo.description.es}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Valor capturado:</span>
                          <span className="font-medium">{response.metricValue}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Business Value Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-8 mb-12"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Recomendaciones para Proteger Valor de Negocio
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-4 bg-primary-600/10 border border-primary-600/20 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-dark-text-secondary leading-relaxed">
                    {recommendation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Maturity Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-8 mb-12"
        >
          <h3 className="text-xl font-semibold mb-6">Evolución hacia Siguiente Estadio</h3>
          
          <div className="grid grid-cols-4 gap-4">
            {Object.values(MATURITY_STAGES).map((stage, index) => {
              const isCurrentOrPast = stage.diiRange.max <= diiScore || stage.stage === maturityStage;
              const isCurrent = stage.stage === maturityStage;
              const config = stageConfig[stage.stage];
              const Icon = config.icon;
              
              return (
                <div key={stage.stage} className="relative">
                  {index < 3 && (
                    <div className={cn(
                      'absolute top-8 left-full w-full h-0.5 z-0',
                      isCurrentOrPast ? 'bg-primary-600' : 'bg-dark-border'
                    )} />
                  )}
                  
                  <div className="relative z-10 text-center">
                    <div className={cn(
                      'w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center mb-2',
                      isCurrent ? `${config.color} ${config.borderColor.replace('border-', 'border-')} ${config.bgColor}` :
                      isCurrentOrPast ? 'bg-primary-600 border-primary-600 text-white' :
                      'bg-dark-surface border-dark-border text-dark-text-secondary'
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <h4 className={cn(
                      'text-sm font-medium mb-1',
                      isCurrent ? config.color : 
                      isCurrentOrPast ? 'text-primary-600' : 'text-dark-text-secondary'
                    )}>
                      {stage.stage}
                    </h4>
                    
                    <p className="text-xs text-dark-text-secondary">
                      {stage.percentage}% de orgs
                    </p>
                    
                    {isCurrent && (
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
                          Actual
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-dark-text-secondary">
              {maturityStage !== 'ADAPTATIVO' && 
                `Para alcanzar el siguiente estadio, enfoque en: ${weakestDimensions.map(d => DII_V4_DIMENSIONS[d as keyof typeof DII_V4_DIMENSIONS]?.nameES).join(' y ')}`
              }
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Nueva Evaluación
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-5 h-5" />
            Descargar Reporte PDF
          </button>
          <button className="btn-primary flex items-center gap-2">
            Ver Plan de Mejora
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}