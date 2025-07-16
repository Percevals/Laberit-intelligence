/**
 * Dimension Card Component
 * Displays DII v4.0 dimension information with updated names and explanations
 */

import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Zap, 
  Target, 
  Clock,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { DII_V4_DIMENSIONS } from '@/core/dii-engine/dimensions-v4';
import type { DIIDimensions } from '@/core/types/dii.types';

interface DimensionCardProps {
  dimension: keyof DIIDimensions;
  value?: number;
  showDetails?: boolean;
  language?: 'es' | 'en';
  className?: string;
}

export function DimensionCard({
  dimension,
  value,
  showDetails = false,
  language = 'es',
  className
}: DimensionCardProps) {
  const dimInfo = DII_V4_DIMENSIONS[dimension];
  const isPreventive = dimInfo.category === 'prevention';
  
  const getIcon = () => {
    switch (dimension) {
      case 'AER':
        return Target;
      case 'HFP':
        return AlertTriangle;
      case 'BRI':
        return Shield;
      case 'TRD':
        return Clock;
      case 'RRG':
        return Zap;
      default:
        return Info;
    }
  };
  
  const Icon = getIcon();
  const name = language === 'es' ? dimInfo.nameES : dimInfo.nameEN;
  const description = dimInfo.description[language];
  const question = dimInfo.executiveQuestion[language];
  
  const getValueColor = (val: number) => {
    if (isPreventive) {
      // For prevention dimensions, higher is better
      if (val >= 7) return 'text-green-500';
      if (val >= 4) return 'text-yellow-500';
      return 'text-red-500';
    } else {
      // For resilience dimensions, interpretation depends on the specific dimension
      if (dimension === 'TRD') {
        // Higher TRD is better (more time before impact)
        if (val >= 7) return 'text-green-500';
        if (val >= 4) return 'text-yellow-500';
        return 'text-red-500';
      } else {
        // Lower RRG is better (smaller gap)
        if (val >= 7) return 'text-green-500';
        if (val >= 4) return 'text-yellow-500';
        return 'text-red-500';
      }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-dark-surface rounded-lg p-6 border border-dark-border",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            isPreventive ? "bg-blue-500/10" : "bg-purple-500/10"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              isPreventive ? "text-blue-400" : "text-purple-400"
            )} />
          </div>
          <div>
            <h3 className="font-semibold text-dark-text-primary">
              {dimension} - {name}
            </h3>
            <p className="text-xs text-dark-text-tertiary mt-1">
              {isPreventive ? 'Prevención' : 'Resiliencia'}
            </p>
          </div>
        </div>
        
        {value !== undefined && (
          <div className="text-right">
            <p className={cn(
              "text-2xl font-bold",
              getValueColor(value)
            )}>
              {value.toFixed(1)}
            </p>
            <p className="text-xs text-dark-text-tertiary">
              / 10
            </p>
          </div>
        )}
      </div>
      
      {/* Description */}
      <p className="text-sm text-dark-text-secondary mb-3">
        {description}
      </p>
      
      {/* Executive Question */}
      <div className="bg-dark-bg/50 rounded p-3 mb-4">
        <p className="text-xs text-dark-text-tertiary mb-1">
          Pregunta ejecutiva:
        </p>
        <p className="text-sm text-dark-text-primary font-medium">
          {question}
        </p>
      </div>
      
      {/* Details */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3 pt-3 border-t border-dark-border"
        >
          {/* Measurement Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-dark-text-tertiary mb-1">Unidad</p>
              <p className="text-dark-text-secondary">{dimInfo.measurement.unit}</p>
            </div>
            <div>
              <p className="text-dark-text-tertiary mb-1">Rango típico</p>
              <p className="text-dark-text-secondary">{dimInfo.measurement.typicalRange}</p>
            </div>
          </div>
          
          {/* v4 Changes */}
          {dimInfo.v4Changes.length > 0 && (
            <div>
              <p className="text-xs text-dark-text-tertiary mb-2">
                Cambios en v4.0:
              </p>
              <ul className="space-y-1">
                {dimInfo.v4Changes.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <TrendingUp className="w-3 h-3 text-primary-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-dark-text-secondary">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}