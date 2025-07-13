/**
 * DII Gauge Component
 * Signature visualization for Digital Immunity Index
 */

import { motion } from 'framer-motion';
import { cn } from '@shared/utils/cn';
import type { Score, MaturityStage } from '@core/types/dii.types';

interface DIIGaugeProps {
  score: Score;
  stage: MaturityStage;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  showLabels?: boolean;
  className?: string;
}

export function DIIGauge({
  score,
  stage,
  size = 'medium',
  animated = true,
  showLabels = true,
  className,
}: DIIGaugeProps) {
  // Size configurations
  const sizes = {
    small: { width: 200, strokeWidth: 12, fontSize: 'text-2xl' },
    medium: { width: 300, strokeWidth: 16, fontSize: 'text-4xl' },
    large: { width: 400, strokeWidth: 20, fontSize: 'text-6xl' },
  };

  const config = sizes[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = radius * Math.PI; // Semi-circle

  // Calculate stroke offset
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Stage colors
  const stageColors = {
    FRAGIL: '#DC2626',      // Red
    ROBUSTO: '#F59E0B',     // Amber
    RESILIENTE: '#10B981',  // Green
    ADAPTATIVO: '#3B82F6',  // Blue
  };

  const stageGlows = {
    FRAGIL: 'drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]',
    ROBUSTO: 'drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]',
    RESILIENTE: 'drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]',
    ADAPTATIVO: 'drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]',
  };

  const center = config.width / 2;

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg
        width={config.width}
        height={config.width / 2 + 20}
        viewBox={`0 0 ${config.width} ${config.width / 2 + 20}`}
        className="overflow-visible"
      >
        {/* Background track */}
        <path
          d={`
            M ${config.strokeWidth / 2} ${center}
            A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${center}
          `}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-dark-border"
        />

        {/* Animated progress arc */}
        <motion.path
          d={`
            M ${config.strokeWidth / 2} ${center}
            A ${radius} ${radius} 0 0 1 ${config.width - config.strokeWidth / 2} ${center}
          `}
          fill="none"
          stroke={stageColors[stage]}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          className={stageGlows[stage]}
          initial={animated ? { strokeDashoffset: circumference } : {}}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          style={{
            strokeDasharray: circumference,
            transform: 'rotate(180deg)',
            transformOrigin: 'center',
          }}
        />

        {/* Score display */}
        <text
          x={center}
          y={center - 10}
          textAnchor="middle"
          fill={stageColors[stage]}
          className={cn(
            'font-bold tabular-nums',
            config.fontSize
          )}
        >
          {animated ? (
            <motion.tspan
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              {score}
            </motion.tspan>
          ) : (
            score
          )}
        </text>

        {/* Stage label */}
        {showLabels && (
          <text
            x={center}
            y={center + 20}
            textAnchor="middle"
            className="fill-dark-text-secondary text-sm font-medium uppercase tracking-wider"
          >
            {animated ? (
              <motion.tspan
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.5 }}
              >
                {stage}
              </motion.tspan>
            ) : (
              stage
            )}
          </text>
        )}
      </svg>

      {/* Stage indicators */}
      {showLabels && (
        <motion.div
          className="mt-4 flex gap-1"
          initial={animated ? { opacity: 0 } : {}}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          <div
            className={cn(
              'h-1 w-12 rounded-full transition-all',
              score >= 0 ? 'bg-fragil' : 'bg-dark-border'
            )}
          />
          <div
            className={cn(
              'h-1 w-12 rounded-full transition-all',
              score > 25 ? 'bg-robusto' : 'bg-dark-border'
            )}
          />
          <div
            className={cn(
              'h-1 w-12 rounded-full transition-all',
              score > 50 ? 'bg-resiliente' : 'bg-dark-border'
            )}
          />
          <div
            className={cn(
              'h-1 w-12 rounded-full transition-all',
              score > 75 ? 'bg-adaptativo' : 'bg-dark-border'
            )}
          />
        </motion.div>
      )}
    </div>
  );
}