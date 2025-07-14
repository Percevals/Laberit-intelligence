// import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  TrendingUp
} from 'lucide-react';
import { cn } from '@shared/utils/cn';

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
  onResponseSelect: (dimension: DIIDimension, value: number) => void;
  className?: string;
}

const dimensionConfig = {
  TRD: {
    icon: Clock,
    title: 'Threat Resilience',
    subtitle: 'Time to Revenue Impact',
    description: 'How quickly can attacks hurt your bottom line?',
    teaserText: 'Discover your revenue vulnerability window',
    completedPrefix: 'Revenue impact in',
    immunityAspect: 'Operational Resilience',
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    darkColor: 'bg-red-900/20'
  },
  AER: {
    icon: Target,
    title: 'Attack Economics',
    subtitle: 'Target Attractiveness',
    description: 'How valuable are you to attackers?',
    teaserText: 'Understand your appeal to cybercriminals',
    completedPrefix: 'Attack value potential',
    immunityAspect: 'Target Profile',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    darkColor: 'bg-orange-900/20'
  },
  HFP: {
    icon: Users,
    title: 'Human Factor',
    subtitle: 'Workforce Vulnerability',
    description: 'How likely are your people to fall for attacks?',
    teaserText: 'Assess your human security layer',
    completedPrefix: 'Team susceptibility',
    immunityAspect: 'Human Firewall',
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-50',
    darkColor: 'bg-yellow-900/20'
  },
  BRI: {
    icon: Shield,
    title: 'Blast Radius',
    subtitle: 'Containment Capability',
    description: 'How far can an attack spread in your systems?',
    teaserText: 'Map your breach containment ability',
    completedPrefix: 'Potential system exposure',
    immunityAspect: 'Damage Containment',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    darkColor: 'bg-blue-900/20'
  },
  RRG: {
    icon: RotateCcw,
    title: 'Recovery Reality',
    subtitle: 'Restoration Capability',
    description: 'How well can you actually recover from attacks?',
    teaserText: 'Validate your recovery assumptions',
    completedPrefix: 'Recovery time reality',
    immunityAspect: 'Regenerative Capacity',
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    darkColor: 'bg-green-900/20'
  }
};

function ImmunityScore({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Strong';
    if (score >= 6) return 'Moderate';
    if (score >= 4) return 'Weak';
    return 'Critical';
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
              i < score ? getScoreColor(score).replace('text-', 'bg-') : 'bg-gray-200'
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
  config, 
  onSelect, 
  onResponseSelect 
}: {
  dimension: ImmunityDimensionState;
  config: typeof dimensionConfig[DIIDimension];
  onSelect: () => void;
  onResponseSelect: (value: number) => void;
}) {
  const Icon = config.icon;
  const isCompleted = dimension.status === 'completed';
  const isActive = dimension.status === 'active';
  const isUpcoming = dimension.status === 'upcoming';

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
      <div className="hidden sm:block absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
      
      {/* Status Indicator */}
      <div className={cn(
        'absolute left-4 sm:left-4 top-4 w-4 h-4 rounded-full border-2 bg-white z-10 flex items-center justify-center',
        isCompleted && 'border-green-500 bg-green-500',
        isActive && 'border-blue-500 bg-blue-500 animate-pulse',
        isUpcoming && 'border-gray-300'
      )}>
        {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
        {isActive && <Circle className="w-2 h-2 bg-white rounded-full" />}
      </div>

      {/* Card Content */}
      <motion.div
        layout
        className={cn(
          'ml-12 sm:ml-12 mb-4 sm:mb-6 rounded-xl border transition-all duration-300',
          isCompleted && 'border-green-200 bg-green-50/50 hover:bg-green-50',
          isActive && 'border-blue-200 bg-blue-50 shadow-lg ring-2 ring-blue-100',
          isUpcoming && 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
        )}
      >
        {/* Header */}
        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              'p-2 rounded-lg flex-shrink-0',
              isCompleted && 'bg-green-100',
              isActive && 'bg-blue-100',
              isUpcoming && 'bg-gray-100'
            )}>
              <Icon className={cn(
                'w-4 h-4 sm:w-5 sm:h-5',
                isCompleted && 'text-green-600',
                isActive && 'text-blue-600',
                isUpcoming && 'text-gray-500'
              )} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={cn(
                  'font-semibold text-sm sm:text-base',
                  isCompleted && 'text-green-900',
                  isActive && 'text-blue-900',
                  isUpcoming && 'text-gray-700'
                )}>
                  {config.title}
                </h3>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">
                      Complete
                    </span>
                  </motion.div>
                )}
              </div>
              
              <p className={cn(
                'text-sm',
                isCompleted && 'text-green-700',
                isActive && 'text-blue-700',
                isUpcoming && 'text-gray-600'
              )}>
                {config.subtitle}
              </p>

              {/* Completed State - Show captured value */}
              {isCompleted && dimension.capturedValue && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-800 font-medium">
                      {config.completedPrefix}: {dimension.capturedValue}
                    </span>
                  </div>
                  {dimension.capturedScore && (
                    <ImmunityScore score={dimension.capturedScore} />
                  )}
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>{config.immunityAspect} assessed</span>
                  </div>
                </motion.div>
              )}

              {/* Upcoming State - Show teaser */}
              {isUpcoming && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 italic">
                    {config.teaserText}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <span>Next: {config.immunityAspect}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active State - Show Question */}
        <AnimatePresence>
          {isActive && dimension.question && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-blue-200"
            >
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">
                    Building Your {config.immunityAspect}
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    {dimension.question}
                  </p>
                </div>

                {dimension.responseOptions && (
                  <div className="space-y-2">
                    {dimension.responseOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onResponseSelect(option.value);
                        }}
                        className="w-full p-3 text-left rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group active:bg-blue-100"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-blue-900 text-sm sm:text-base">
                            {option.label}
                          </span>
                          <ArrowRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs sm:text-sm text-blue-700 mt-1">
                          {option.interpretation}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                )}
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
  onResponseSelect,
  className
}: ImmunityTimelineNavigationProps) {
  const completedCount = dimensions.filter(d => d.status === 'completed').length;
  const progressPercentage = (completedCount / dimensions.length) * 100;

  return (
    <div className={cn('w-full max-w-2xl mx-auto px-4 sm:px-0', className)}>
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Building Your Immunity Profile
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Each dimension reveals how your organization responds to cyber threats
          </p>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {completedCount}/{dimensions.length} Complete
            </span>
          </div>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {dimensions.map((dimension) => {
          const config = dimensionConfig[dimension.dimension];
          
          return (
            <DimensionCard
              key={dimension.dimension}
              dimension={dimension}
              config={config}
              onSelect={() => onDimensionSelect(dimension.dimension)}
              onResponseSelect={(value) => onResponseSelect(dimension.dimension, value)}
            />
          );
        })}
      </div>

      {/* Completion Call-to-Action */}
      {completedCount === dimensions.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-200"
        >
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-bold text-green-900">
                Immunity Profile Complete!
              </h3>
              <Sparkles className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-green-800">
              You've built a comprehensive understanding of your cyber immunity. 
              Ready to see your Digital Immunity Index?
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              Calculate My DII Score
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}