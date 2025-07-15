/**
 * Classification Metrics Component
 * Shows classification performance and potential issues
 */

import { useMemo } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Brain,
  PieChart
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { Company, DIIBusinessModel } from '@/database/types';
import { BUSINESS_MODEL_DEFINITIONS } from '@/core/business-model/business-model-definitions';

interface ClassificationMetricsProps {
  companies: Company[];
}

export function ClassificationMetrics({ companies }: ClassificationMetricsProps) {
  const metrics = useMemo(() => {
    const total = companies.length;
    if (total === 0) return null;

    // Rule-based vs AI classification
    const ruleBasedCount = companies.filter(c => c.confidence_score >= 0.8).length;
    const ruleBasedPercentage = (ruleBasedCount / total) * 100;

    // Manual modifications tracking (would need to be tracked in real DB)
    // For now, we'll simulate by looking at low confidence + verification source
    const manuallyModified = companies.filter(
      c => c.verification_source === 'manual' && c.confidence_score < 0.7
    ).length;

    // Business model distribution
    const modelDistribution: Record<DIIBusinessModel, number> = {} as any;
    companies.forEach(c => {
      modelDistribution[c.dii_business_model] = (modelDistribution[c.dii_business_model] || 0) + 1;
    });

    // Potential confusion signals
    const confusionSignals = companies.filter(c => {
      // Low confidence indicates potential confusion
      return c.confidence_score < 0.6;
    });

    // Industry confusion patterns
    const industryConfusion: Record<string, { total: number; lowConfidence: number }> = {};
    companies.forEach(c => {
      const industry = c.industry_traditional;
      if (!industryConfusion[industry]) {
        industryConfusion[industry] = { total: 0, lowConfidence: 0 };
      }
      industryConfusion[industry].total++;
      if (c.confidence_score < 0.7) {
        industryConfusion[industry].lowConfidence++;
      }
    });

    // Find problematic industries
    const problematicIndustries = Object.entries(industryConfusion)
      .filter(([_, stats]) => stats.total > 2 && (stats.lowConfidence / stats.total) > 0.5)
      .map(([industry, stats]) => ({
        industry,
        ...stats,
        confusionRate: (stats.lowConfidence / stats.total) * 100
      }))
      .sort((a, b) => b.confusionRate - a.confusionRate)
      .slice(0, 5);

    return {
      total,
      ruleBasedCount,
      ruleBasedPercentage,
      manuallyModified,
      modelDistribution,
      confusionSignals,
      problematicIndustries,
      avgConfidence: companies.reduce((sum, c) => sum + c.confidence_score, 0) / total
    };
  }, [companies]);

  if (!metrics) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <p className="text-dark-text-secondary text-center">No hay datos para mostrar métricas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Rule-based Classifications */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-xs text-green-400">Alta confianza</span>
          </div>
          <p className="text-2xl font-bold text-dark-text-primary">
            {metrics.ruleBasedPercentage.toFixed(1)}%
          </p>
          <p className="text-sm text-dark-text-secondary">
            Clasificaciones por reglas
          </p>
          <p className="text-xs text-dark-text-tertiary mt-1">
            {metrics.ruleBasedCount} de {metrics.total} empresas
          </p>
        </div>

        {/* Manual Modifications */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <Brain className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-yellow-400">Revisión manual</span>
          </div>
          <p className="text-2xl font-bold text-dark-text-primary">
            {metrics.manuallyModified}
          </p>
          <p className="text-sm text-dark-text-secondary">
            Modelos modificados
          </p>
          <p className="text-xs text-dark-text-tertiary mt-1">
            Requirieron intervención
          </p>
        </div>

        {/* Average Confidence */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-blue-400">Promedio</span>
          </div>
          <p className="text-2xl font-bold text-dark-text-primary">
            {(metrics.avgConfidence * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-dark-text-secondary">
            Confianza promedio
          </p>
          <p className="text-xs text-dark-text-tertiary mt-1">
            En todas las clasificaciones
          </p>
        </div>

        {/* Confusion Signals */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-xs text-red-400">Revisar</span>
          </div>
          <p className="text-2xl font-bold text-dark-text-primary">
            {metrics.confusionSignals.length}
          </p>
          <p className="text-sm text-dark-text-secondary">
            Señales confusas
          </p>
          <p className="text-xs text-dark-text-tertiary mt-1">
            Confianza {'<'} 60%
          </p>
        </div>
      </div>

      {/* Business Model Distribution */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-primary-600" />
          Distribución de Modelos de Negocio
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(metrics.modelDistribution).map(([model, count]) => {
            const percentage = (count / metrics.total) * 100;
            return (
              <div key={model} className="p-4 bg-dark-bg rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-primary-600">
                    {model}
                  </span>
                  <span className="text-xs text-dark-text-secondary">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <p className="text-lg font-bold text-dark-text-primary">
                  {count}
                </p>
                <p className="text-xs text-dark-text-secondary">
                  {BUSINESS_MODEL_DEFINITIONS[model as DIIBusinessModel].name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Problematic Industries */}
      {metrics.problematicIndustries.length > 0 && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-400" />
            Industrias con Mayor Confusión
          </h3>
          <p className="text-sm text-dark-text-secondary mb-4">
            Estas industrias generan clasificaciones de baja confianza frecuentemente
          </p>
          <div className="space-y-3">
            {metrics.problematicIndustries.map((industry) => (
              <div key={industry.industry} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-dark-text-primary">
                    {industry.industry}
                  </p>
                  <p className="text-xs text-dark-text-secondary">
                    {industry.lowConfidence} de {industry.total} con baja confianza
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-lg font-bold",
                    industry.confusionRate > 70 ? "text-red-400" : "text-orange-400"
                  )}>
                    {industry.confusionRate.toFixed(0)}%
                  </p>
                  <p className="text-xs text-dark-text-secondary">
                    tasa de confusión
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
            <p className="text-sm text-yellow-400">
              Recomendación: Revisar las señales de clasificación para estas industrias
            </p>
          </div>
        </div>
      )}

      {/* Confusion Examples */}
      {metrics.confusionSignals.length > 0 && (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
            Ejemplos de Clasificaciones Confusas
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {metrics.confusionSignals.slice(0, 10).map((company) => (
              <div key={company.id} className="flex items-center justify-between p-3 bg-dark-bg rounded-lg">
                <div>
                  <p className="font-medium text-dark-text-primary">{company.name}</p>
                  <p className="text-xs text-dark-text-secondary">
                    {company.industry_traditional} → {BUSINESS_MODEL_DEFINITIONS[company.dii_business_model].name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-400">
                    {(company.confidence_score * 100).toFixed(0)}%
                  </p>
                  <p className="text-xs text-dark-text-secondary">confianza</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}