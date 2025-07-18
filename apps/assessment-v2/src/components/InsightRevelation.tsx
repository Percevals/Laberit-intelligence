import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Lightbulb,
  Link,
  ChevronRight,
  Sparkles,
  Shield,
  BarChart3
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { InsightRevelation } from '@/services/insight-revelation-service';
import { DII_V4_DIMENSIONS } from '@/core/dii-engine/dimensions-v4';

interface InsightRevelationProps {
  insight: InsightRevelation;
  onNextDimension?: (dimension: string) => void;
  className?: string;
}

export function InsightRevelationCard({ 
  insight, 
  onNextDimension,
  className 
}: InsightRevelationProps) {
  const { t } = useTranslation();
  const {
    headline,
    businessImpact,
    peerComparison,
    correlations,
    nextDimensionHint,
    depthLevel
  } = insight;

  // Determine icon based on peer comparison
  const ComparisonIcon = peerComparison.position === 'ahead' 
    ? TrendingUp 
    : peerComparison.position === 'behind' 
    ? TrendingDown 
    : BarChart3;

  const comparisonColor = peerComparison.position === 'ahead'
    ? 'text-green-400 bg-green-600/20'
    : peerComparison.position === 'behind'
    ? 'text-red-400 bg-red-600/20'
    : 'text-yellow-400 bg-yellow-600/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "bg-dark-surface rounded-lg border border-dark-border shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Headline */}
      <div className="p-6 pb-4">
        <motion.h3 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-xl font-bold text-dark-text mb-3"
        >
          {headline}
        </motion.h3>

        {/* Business Impact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <p className="text-dark-text-secondary leading-relaxed">
              {businessImpact}
            </p>
          </div>
        </motion.div>

        {/* Peer Comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
            comparisonColor
          )}>
            <ComparisonIcon className="w-4 h-4" />
            <span>{peerComparison.message}</span>
          </div>
        </motion.div>

        {/* Correlations (if depth > 1) */}
        {correlations.length > 0 && depthLevel > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-4 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-dark-text mb-2">
              <Link className="w-4 h-4" />
              <span>{t('assessment.connectionsRevealed', 'Conexiones Reveladas')}</span>
            </div>
            {correlations.map((correlation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-2 text-sm text-dark-text-secondary"
              >
                <Sparkles className="w-3 h-3 text-purple-500 mt-0.5 flex-shrink-0" />
                <span>{correlation}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Next Dimension Hint */}
      {nextDimensionHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="border-t border-dark-border bg-gradient-to-r from-primary-600/10 to-purple-600/10 p-4"
        >
          <button
            onClick={() => onNextDimension?.(nextDimensionHint.dimension)}
            className="w-full flex items-center justify-between gap-3 group"
          >
            <div className="flex items-start gap-3 text-left">
              <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-dark-text">
                  {t('assessment.nextInsight', 'Siguiente Insight')}: {nextDimensionHint.dimension} - {DII_V4_DIMENSIONS[nextDimensionHint.dimension as keyof typeof DII_V4_DIMENSIONS]?.nameES || nextDimensionHint.dimension}
                </p>
                <p className="text-sm text-dark-text-secondary mt-0.5">
                  {nextDimensionHint.teaser}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-dark-text-secondary group-hover:text-primary-600 transition-colors" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

interface InsightProgressBarProps {
  current: number;
  total: number;
  message: string;
}

export function InsightProgressBar({ current, total, message }: InsightProgressBarProps) {
  const { t } = useTranslation();
  const percentage = (current / total) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-dark-surface rounded-lg border border-dark-border p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-dark-text">
          {t('assessment.immunityProfileProgress', 'Progreso del Perfil de Inmunidad')}
        </span>
        <span className="text-sm text-dark-text-secondary">
          {current} {t('assessment.of', 'de')} {total} {t('assessment.dimensions', 'dimensiones')}
        </span>
      </div>
      
      <div className="relative h-2 bg-dark-bg rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>
      
      <p className="text-sm text-dark-text-secondary italic">
        {message}
      </p>
    </motion.div>
  );
}

interface InsightSummaryProps {
  insights: InsightRevelation[];
  currentDII?: number | undefined;
}

export function InsightSummary({ insights, currentDII }: InsightSummaryProps) {
  const strongDimensions = insights.filter(i => i.peerComparison.position === 'ahead');
  const weakDimensions = insights.filter(i => i.peerComparison.position === 'behind');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-br from-primary-600/10 to-purple-600/10 rounded-lg p-6 border border-dark-border"
    >
      <h3 className="text-lg font-semibold text-dark-text mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary-600" />
        Resumen del Perfil de Inmunidad
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Strengths */}
        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h4 className="font-medium text-green-400 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Sus Fortalezas ({strongDimensions.length})
          </h4>
          {strongDimensions.length > 0 ? (
            <ul className="space-y-1">
              {strongDimensions.map(insight => (
                <li key={insight.dimension} className="text-sm text-dark-text-secondary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  {DII_V4_DIMENSIONS[insight.dimension as keyof typeof DII_V4_DIMENSIONS]?.nameES || insight.dimension}: Top {100 - insight.peerComparison.percentile}%
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-dark-text-secondary italic">No hay fortalezas destacadas aún</p>
          )}
        </div>
        
        {/* Vulnerabilities */}
        <div className="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h4 className="font-medium text-red-400 mb-2 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Brechas Críticas ({weakDimensions.length})
          </h4>
          {weakDimensions.length > 0 ? (
            <ul className="space-y-1">
              {weakDimensions.map(insight => (
                <li key={insight.dimension} className="text-sm text-dark-text-secondary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {DII_V4_DIMENSIONS[insight.dimension as keyof typeof DII_V4_DIMENSIONS]?.nameES || insight.dimension}: Bottom {insight.peerComparison.percentile}%
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-dark-text-secondary italic">No se identificaron debilidades críticas</p>
          )}
        </div>
      </div>
      
      {currentDII !== undefined && (
        <div className="text-center pt-4 border-t border-dark-border">
          <div className="text-sm text-dark-text-secondary mb-1">Puntuación de Inmunidad Actual</div>
          <div className={cn(
            "text-3xl font-bold",
            currentDII >= 70 ? "text-green-400" :
            currentDII >= 40 ? "text-yellow-400" : "text-red-400"
          )}>
            {currentDII}
          </div>
        </div>
      )}
    </motion.div>
  );
}