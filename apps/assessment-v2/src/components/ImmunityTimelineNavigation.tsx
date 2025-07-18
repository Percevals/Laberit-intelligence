// import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Target, 
  Users, 
  Shield, 
  RotateCcw,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { DII_V4_DIMENSIONS } from '@/core/dii-engine/dimensions-v4';

export type DIIDimension = 'TRD' | 'AER' | 'HFP' | 'BRI' | 'RRG';

export interface ImmunityDimensionState {
  dimension: DIIDimension;
  status: 'completed' | 'active' | 'upcoming';
  capturedValue?: string | undefined;
  capturedScore?: number | undefined;
  question?: string | undefined;
  responseOptions?: Array<{
    value: number;
    label: string;
    interpretation: string;
  }> | undefined;
}

interface ImmunityTimelineNavigationProps {
  dimensions: ImmunityDimensionState[];
  onDimensionSelect: (dimension: DIIDimension) => void;
  className?: string;
}

const dimensionIcons = {
  TRD: Clock,
  AER: Target,
  HFP: AlertTriangle,
  BRI: Shield,
  RRG: Zap
};

function ImmunityScore({ score }: { score: number }) {
  const { t } = useTranslation();
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return t('assessment.scoreLabel.strong');
    if (score >= 6) return t('assessment.scoreLabel.moderate');
    if (score >= 4) return t('assessment.scoreLabel.weak');
    return t('assessment.scoreLabel.critical');
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn('text-sm font-medium', getScoreColor(score))}>
        {score.toFixed(1)}
      </div>
      <div className="flex items-center gap-1">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-1 h-3 rounded-full',
              i < score ? getScoreColor(score).replace('text-', 'bg-') : 'bg-dark-border'
            )}
          />
        ))}
      </div>
      <span className={cn('text-xs', getScoreColor(score))}>
        {getScoreLabel(score)}
      </span>
    </div>
  );
}

function DimensionCard({ 
  dimension, 
  onSelect
}: {
  dimension: ImmunityDimensionState;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  const Icon = dimensionIcons[dimension.dimension];
  const isCompleted = dimension.status === 'completed';
  const isActive = dimension.status === 'active';
  const isUpcoming = dimension.status === 'upcoming';
  
  // Get dimension info from v4 definitions
  const dimInfo = DII_V4_DIMENSIONS[dimension.dimension];
  
  // Get dimension key for translations
  const dimKey = dimension.dimension.toLowerCase();

  return (
    <motion.div
      layout
      className={cn(
        'relative cursor-pointer transition-all duration-300',
        isActive && 'z-10'
      )}
      onClick={onSelect}
    >
      {/* Timeline Line - Hidden on mobile for cleaner look */}
      <div className="hidden sm:block absolute left-6 top-12 bottom-0 w-0.5 bg-dark-border" />
      
      {/* Status Indicator */}
      <div className={cn(
        'absolute left-4 sm:left-4 top-4 w-4 h-4 rounded-full border-2 z-10 flex items-center justify-center',
        isCompleted && 'border-green-500 bg-green-500',
        isActive && 'border-primary-600 bg-primary-600 animate-pulse',
        isUpcoming && 'border-dark-border bg-dark-surface'
      )}>
        {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
        {isActive && <Circle className="w-2 h-2 bg-white rounded-full" />}
      </div>

      {/* Card Content */}
      <motion.div
        layout
        className={cn(
          'ml-12 sm:ml-12 mb-4 sm:mb-6 rounded-xl border transition-all duration-300',
          isCompleted && 'border-green-600/30 bg-green-600/10 hover:bg-green-600/15',
          isActive && 'border-primary-600/50 bg-primary-600/10 shadow-lg ring-2 ring-primary-600/20',
          isUpcoming && 'border-dark-border bg-dark-surface/50 hover:bg-dark-surface'
        )}
      >
        {/* Header */}
        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              'p-2 rounded-lg flex-shrink-0',
              isCompleted && 'bg-green-600/20',
              isActive && 'bg-primary-600/20',
              isUpcoming && 'bg-dark-bg'
            )}>
              <Icon className={cn(
                'w-4 h-4 sm:w-5 sm:h-5',
                isCompleted && 'text-green-400',
                isActive && 'text-primary-600',
                isUpcoming && 'text-dark-text-secondary'
              )} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={cn(
                  'font-semibold text-sm sm:text-base',
                  isCompleted && 'text-green-400',
                  isActive && 'text-primary-400',
                  isUpcoming && 'text-dark-text'
                )}>
                  {dimInfo.nameES}
                </h3>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">
                      {t('assessment.complete')}
                    </span>
                  </motion.div>
                )}
              </div>
              
              <p className={cn(
                'text-sm',
                isCompleted && 'text-green-300',
                isActive && 'text-primary-300',
                isUpcoming && 'text-dark-text-secondary'
              )}>
                {dimension.dimension}
              </p>

              {/* Completed State - Show captured value */}
              {isCompleted && dimension.capturedValue && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-300 font-medium">
                      {t(`dimensions.${dimKey}.completedPrefix`)}: {dimension.capturedValue}
                    </span>
                  </div>
                  {dimension.capturedScore && (
                    <ImmunityScore score={dimension.capturedScore} />
                  )}
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    <span>{t(`dimensions.${dimKey}.immunityAspect`)} {t('assessment.assessed')}</span>
                  </div>
                </motion.div>
              )}

              {/* Upcoming State - Show teaser */}
              {isUpcoming && (
                <div className="mt-2">
                  <p className="text-sm text-dark-text-secondary italic">
                    {t(`dimensions.${dimKey}.teaserText`)}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-dark-text-secondary">
                    <span>{t('assessment.next')}: {t(`dimensions.${dimKey}.immunityAspect`)}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active State - Show Active Indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-primary-600/20"
            >
              <div className="p-3 bg-primary-600/5">
                <p className="text-xs text-primary-400 font-medium flex items-center gap-2">
                  <Circle className="w-2 h-2 fill-current animate-pulse" />
                  {t('assessment.answeringNow')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function ImmunityTimelineNavigation({
  dimensions,
  onDimensionSelect,
  className
}: ImmunityTimelineNavigationProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const completedCount = dimensions.filter(d => d.status === 'completed').length;
  const progressPercentage = (completedCount / dimensions.length) * 100;

  return (
    <div className={cn('w-full max-w-2xl mx-auto px-4 sm:px-0', className)}>
      {/* Minimal Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-dark-surface rounded-full h-1 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-primary-600 to-green-500 rounded-full"
            />
          </div>
          <span className="text-xs font-medium text-dark-text-secondary">
            {completedCount}/{dimensions.length}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {dimensions.map((dimension) => {
          return (
            <DimensionCard
              key={dimension.dimension}
              dimension={dimension}
              onSelect={() => onDimensionSelect(dimension.dimension)}
            />
          );
        })}
      </div>

      {/* Completion Call-to-Action */}
      {completedCount === dimensions.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-6 bg-gradient-to-br from-green-600/10 to-primary-600/10 rounded-xl border border-green-600/30"
        >
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-green-400">
                {t('assessment.immunityProfileComplete')}
              </h3>
              <Sparkles className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-green-300">
              {t('assessment.profileCompleteDesc')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/assessment/results')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              {t('assessment.calculateDIIScore')}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}