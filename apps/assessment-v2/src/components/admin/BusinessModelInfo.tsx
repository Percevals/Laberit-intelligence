/**
 * Business Model Information Display
 * Shows detailed information about a DII business model
 */

import { motion } from 'framer-motion';
import { 
  Info, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';
import { getModelDefinition } from '@/core/business-model/business-model-definitions';
import type { DIIBusinessModel } from '@/types/business-model';
import { cn } from '@shared/utils/cn';

interface BusinessModelInfoProps {
  model: DIIBusinessModel;
  confidence?: number;
  className?: string;
  showDetails?: boolean;
}

export function BusinessModelInfo({ 
  model, 
  confidence, 
  className,
  showDetails = false 
}: BusinessModelInfoProps) {
  const definition = getModelDefinition(model);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(amount * 1000);
  };

  const getConfidenceColor = (conf?: number) => {
    if (!conf) return 'text-dark-text-secondary';
    if (conf >= 0.8) return 'text-green-400';
    if (conf >= 0.6) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-dark-text-primary flex items-center gap-2">
            {definition.name}
            <span className="text-sm text-dark-text-secondary">({definition.nameEn})</span>
          </h3>
          <p className="text-sm text-dark-text-secondary mt-1">
            {definition.description}
          </p>
        </div>
        {confidence !== undefined && (
          <div className={cn(
            'px-3 py-1 rounded-full text-sm font-medium',
            'bg-dark-surface border border-dark-border'
          )}>
            <span className={getConfidenceColor(confidence)}>
              {Math.round(confidence * 100)}% confianza
            </span>
          </div>
        )}
      </div>

      {/* Core Definition */}
      <div className="bg-dark-surface/50 p-3 rounded-lg border border-dark-border">
        <p className="text-sm text-primary-400 italic">
          "{definition.coreDefinition}"
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-dark-surface p-3 rounded-lg border border-dark-border">
          <div className="flex items-center gap-2 text-dark-text-secondary mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-xs">Dependencia Digital</span>
          </div>
          <p className="text-lg font-semibold text-dark-text-primary">
            {definition.digitalDependency.min}-{definition.digitalDependency.max}%
          </p>
        </div>

        <div className="bg-dark-surface p-3 rounded-lg border border-dark-border">
          <div className="flex items-center gap-2 text-dark-text-secondary mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Tolerancia</span>
          </div>
          <p className="text-lg font-semibold text-dark-text-primary">
            {definition.interruptionTolerance.min}-{definition.interruptionTolerance.max}h
          </p>
        </div>

        <div className="bg-dark-surface p-3 rounded-lg border border-dark-border">
          <div className="flex items-center gap-2 text-dark-text-secondary mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs">Impacto/hora</span>
          </div>
          <p className="text-lg font-semibold text-dark-text-primary">
            {formatCurrency(definition.cyberImpact.perHourMin)}-{formatCurrency(definition.cyberImpact.perHourMax)}
          </p>
        </div>

        <div className="bg-dark-surface p-3 rounded-lg border border-dark-border">
          <div className="flex items-center gap-2 text-dark-text-secondary mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">Prioridad</span>
          </div>
          <p className="text-lg font-semibold text-dark-text-primary">
            #{definition.classificationPriority}
          </p>
        </div>
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-4 pt-4 border-t border-dark-border"
        >
          {/* Primary Risks */}
          <div>
            <h4 className="text-sm font-semibold text-dark-text-primary mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Riesgos Principales
            </h4>
            <div className="flex flex-wrap gap-2">
              {definition.cyberImpact.primaryRisks.map((risk, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded-full border border-red-500/20"
                >
                  {risk.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths & Vulnerabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-dark-text-primary mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                Fortalezas
              </h4>
              <ul className="space-y-1">
                {definition.cyberImpact.strengths.map((strength, i) => (
                  <li key={i} className="text-sm text-dark-text-secondary flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>{strength.replace(/_/g, ' ')}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-dark-text-primary mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                Vulnerabilidades
              </h4>
              <ul className="space-y-1">
                {definition.cyberImpact.vulnerabilities.map((vuln, i) => (
                  <li key={i} className="text-sm text-dark-text-secondary flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{vuln.replace(/_/g, ' ')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Example Companies */}
          <div>
            <h4 className="text-sm font-semibold text-dark-text-primary mb-2">
              Ejemplos en LATAM
            </h4>
            <div className="flex flex-wrap gap-2">
              {definition.companyExamples.map((company, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-dark-surface text-dark-text-primary text-sm rounded-lg border border-dark-border"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>

          {/* Industry Keywords */}
          <div>
            <h4 className="text-sm font-semibold text-dark-text-primary mb-2">
              Palabras Clave de Industria
            </h4>
            <div className="flex flex-wrap gap-1">
              {definition.industryKeywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-primary-600/10 text-primary-400 text-xs rounded"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Export a compact version for use in tables
export function BusinessModelBadge({ 
  model, 
  confidence 
}: { 
  model: DIIBusinessModel; 
  confidence?: number;
}) {
  const definition = getModelDefinition(model);
  
  // Model-specific colors matching the definitions
  const modelColors: Record<DIIBusinessModel, string> = {
    COMERCIO_HIBRIDO: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    SOFTWARE_CRITICO: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    SERVICIOS_DATOS: 'bg-green-500/20 text-green-400 border-green-500/30',
    ECOSISTEMA_DIGITAL: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    SERVICIOS_FINANCIEROS: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    INFRAESTRUCTURA_HEREDADA: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    CADENA_SUMINISTRO: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    INFORMACION_REGULADA: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  };

  return (
    <div className="flex items-center gap-2">
      <span className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
        modelColors[model]
      )}>
        {definition.name}
      </span>
      {confidence !== undefined && confidence < 0.7 && (
        <Info className="w-4 h-4 text-amber-400" title={`Confianza: ${Math.round(confidence * 100)}%`} />
      )}
    </div>
  );
}