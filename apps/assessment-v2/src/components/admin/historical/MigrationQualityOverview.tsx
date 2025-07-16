/**
 * Migration Quality Overview Component
 * High-level statistics about data quality and migration status
 */

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  FileWarning,
  RefreshCw,
  TrendingUp,
  Users
} from 'lucide-react';
import { cn } from '@shared/utils/cn';

interface QualityMetrics {
  totalCompanies: number;
  highConfidence: number;
  mediumConfidence: number;
  lowConfidence: number;
  completeData: number;
  hasZTMaturity: number;
  needsReassessment: number;
  perfectScores: number;
  dataQualityScore: number;
  migrationConfidenceIndex: number;
}

interface MigrationQualityOverviewProps {
  metrics: QualityMetrics;
  onRefresh: () => void;
}

export function MigrationQualityOverview({ metrics, onRefresh }: MigrationQualityOverviewProps) {
  const confidenceData = [
    {
      label: 'HIGH Confidence',
      value: metrics.highConfidence,
      percentage: (metrics.highConfidence / metrics.totalCompanies * 100).toFixed(1),
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      icon: CheckCircle2
    },
    {
      label: 'MEDIUM Confidence',
      value: metrics.mediumConfidence,
      percentage: (metrics.mediumConfidence / metrics.totalCompanies * 100).toFixed(1),
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/20',
      icon: AlertTriangle
    },
    {
      label: 'LOW Confidence',
      value: metrics.lowConfidence,
      percentage: (metrics.lowConfidence / metrics.totalCompanies * 100).toFixed(1),
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
      icon: FileWarning
    }
  ];

  const dataQualityItems = [
    {
      label: 'Complete Data',
      value: metrics.completeData,
      total: metrics.totalCompanies,
      icon: Database,
      color: 'text-blue-400'
    },
    {
      label: 'ZT Maturity Data',
      value: metrics.hasZTMaturity,
      total: metrics.totalCompanies,
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    {
      label: 'Need Reassessment',
      value: metrics.needsReassessment,
      total: metrics.totalCompanies,
      icon: Clock,
      color: 'text-orange-400',
      inverse: true
    },
    {
      label: 'Perfect Scores (10.0)',
      value: metrics.perfectScores,
      total: metrics.totalCompanies,
      icon: AlertTriangle,
      color: 'text-red-400',
      warning: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-dark-text-primary">
          Migration Quality Overview
        </h2>
        <button
          onClick={onRefresh}
          className="p-2 text-dark-text-secondary hover:text-primary-600 transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Confidence Distribution */}
      <div>
        <h3 className="text-lg font-medium text-dark-text-primary mb-4">
          Confidence Distribution
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {confidenceData.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'p-4 rounded-lg border',
                  item.bgColor,
                  item.borderColor
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-dark-text-secondary mb-1">
                      {item.label}
                    </p>
                    <p className={cn('text-2xl font-bold', item.color)}>
                      {item.value}
                    </p>
                    <p className="text-sm text-dark-text-secondary mt-1">
                      {item.percentage}% of total
                    </p>
                  </div>
                  <Icon className={cn('w-8 h-8', item.color)} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Data Quality Indicators */}
      <div>
        <h3 className="text-lg font-medium text-dark-text-primary mb-4">
          Data Quality Indicators
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {dataQualityItems.map((item) => {
            const Icon = item.icon;
            const percentage = (item.value / item.total * 100).toFixed(1);
            const isGood = item.inverse 
              ? item.value < item.total * 0.2 
              : item.value > item.total * 0.8;
            
            return (
              <div
                key={item.label}
                className="bg-dark-bg border border-dark-border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={cn('w-5 h-5', item.color)} />
                    <span className="text-sm font-medium text-dark-text-primary">
                      {item.label}
                    </span>
                  </div>
                  {item.warning && (
                    <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                      Anomaly
                    </span>
                  )}
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-dark-text-primary">
                      {item.value}
                    </span>
                    <span className="text-sm text-dark-text-secondary ml-1">
                      / {item.total}
                    </span>
                  </div>
                  <span className={cn(
                    'text-sm font-medium',
                    isGood ? 'text-green-400' : 'text-yellow-400'
                  )}>
                    {percentage}%
                  </span>
                </div>
                
                <div className="mt-3 h-2 bg-dark-surface rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all',
                      item.warning ? 'bg-red-400' :
                      isGood ? 'bg-green-400' : 'bg-yellow-400'
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
        <h3 className="text-lg font-medium text-dark-text-primary mb-3">
          Key Insights
        </h3>
        <div className="space-y-2">
          {metrics.perfectScores > metrics.totalCompanies * 0.1 && (
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
              <p className="text-sm text-dark-text-secondary">
                <span className="text-red-400 font-medium">High number of perfect scores:</span> {metrics.perfectScores} companies 
                have a 10.0 DII score, which is statistically unlikely and requires review.
              </p>
            </div>
          )}
          
          {metrics.hasZTMaturity < metrics.totalCompanies * 0.5 && (
            <div className="flex items-start gap-2">
              <FileWarning className="w-4 h-4 text-yellow-400 mt-0.5" />
              <p className="text-sm text-dark-text-secondary">
                <span className="text-yellow-400 font-medium">Limited ZT maturity data:</span> Only {metrics.hasZTMaturity} companies 
                have Zero Trust maturity assessments, affecting migration accuracy.
              </p>
            </div>
          )}
          
          {metrics.dataQualityScore >= 80 && (
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
              <p className="text-sm text-dark-text-secondary">
                <span className="text-green-400 font-medium">Good overall quality:</span> Data quality score 
                of {metrics.dataQualityScore}% meets production readiness threshold.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-primary-600/10 border border-primary-600/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-text-secondary">Total Historical Companies</p>
            <p className="text-2xl font-bold text-primary-600">{metrics.totalCompanies}</p>
          </div>
          <Users className="w-8 h-8 text-primary-600/50" />
        </div>
        <p className="text-xs text-dark-text-secondary mt-2">
          Migrated from Zero Trust v1 to DII v4.0
        </p>
      </div>
    </div>
  );
}