/**
 * Anomaly Detection Component
 * Identifies suspicious patterns in historical data
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  TrendingUp,
  Users,
  AlertCircle,
  BarChart3,
  Activity,
  FileWarning,
  ChevronRight
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { Company } from '@/database/types';
import { BUSINESS_MODEL_DEFINITIONS } from '@/core/business-model/business-model-definitions';

interface AnomalyDetectionProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
}

interface Anomaly {
  type: 'score' | 'data' | 'statistical' | 'pattern';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedCompanies: Company[];
  icon: any;
}

export function AnomalyDetection({ companies, onSelectCompany }: AnomalyDetectionProps) {
  const anomalies = useMemo(() => {
    const detected: Anomaly[] = [];

    // 1. Perfect Score Anomaly
    const perfectScores = companies.filter(c => c.original_dii_score === 10.0);
    if (perfectScores.length > 0) {
      detected.push({
        type: 'score',
        severity: 'high',
        title: 'Perfect DII Scores (10.0)',
        description: `${perfectScores.length} companies have perfect scores, which is statistically improbable`,
        affectedCompanies: perfectScores,
        icon: TrendingUp
      });
    }

    // 2. Missing Dimensions
    const incompleteDimensions = companies.filter(c => (c.data_completeness || 0) < 0.8);
    if (incompleteDimensions.length > 0) {
      detected.push({
        type: 'data',
        severity: 'medium',
        title: 'Incomplete Dimension Data',
        description: `${incompleteDimensions.length} companies missing critical dimension measurements`,
        affectedCompanies: incompleteDimensions,
        icon: FileWarning
      });
    }

    // 3. Score Distribution Anomaly
    const scores = companies.map(c => c.original_dii_score || 0).filter(s => s > 0);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const stdDev = Math.sqrt(
      scores.reduce((sq, n) => sq + Math.pow(n - avgScore, 2), 0) / scores.length
    );
    
    const outliers = companies.filter(c => {
      const score = c.original_dii_score || 0;
      return Math.abs(score - avgScore) > 2 * stdDev;
    });
    
    if (outliers.length > 0) {
      detected.push({
        type: 'statistical',
        severity: 'medium',
        title: 'Statistical Outliers',
        description: `${outliers.length} companies with scores >2 standard deviations from mean`,
        affectedCompanies: outliers,
        icon: BarChart3
      });
    }

    // 4. Business Model Misalignment
    const modelMisalignments = companies.filter(c => {
      if (!c.dii_business_model || !c.industry_traditional) return false;
      
      // Simple heuristic - in production this would be more sophisticated
      const industry = c.industry_traditional.toLowerCase();
      const model = c.dii_business_model;
      
      if (industry.includes('financial') && model !== 'SERVICIOS_FINANCIEROS') return true;
      if (industry.includes('health') && model !== 'INFORMACION_REGULADA') return true;
      if (industry.includes('retail') && model !== 'COMERCIO_HIBRIDO') return true;
      
      return false;
    });
    
    if (modelMisalignments.length > 0) {
      detected.push({
        type: 'pattern',
        severity: 'low',
        title: 'Business Model Misalignment',
        description: `${modelMisalignments.length} companies with unexpected model-industry combinations`,
        affectedCompanies: modelMisalignments,
        icon: Activity
      });
    }

    // 5. Missing Zero Trust Data
    const missingZT = companies.filter(c => !c.has_zt_maturity);
    if (missingZT.length > companies.length * 0.4) {
      detected.push({
        type: 'data',
        severity: 'high',
        title: 'Missing Zero Trust Maturity Data',
        description: `${missingZT.length} companies (${(missingZT.length / companies.length * 100).toFixed(0)}%) lack ZT assessments`,
        affectedCompanies: missingZT,
        icon: AlertCircle
      });
    }

    // 6. Confidence Level Anomaly
    const lowConfidence = companies.filter(c => c.migration_confidence === 'LOW');
    if (lowConfidence.length > companies.length * 0.2) {
      detected.push({
        type: 'data',
        severity: 'medium',
        title: 'High Number of Low Confidence Migrations',
        description: `${lowConfidence.length} companies have low migration confidence`,
        affectedCompanies: lowConfidence,
        icon: AlertTriangle
      });
    }

    // 7. Score Clustering
    const scoreGroups = new Map<number, Company[]>();
    companies.forEach(c => {
      const score = Math.round(c.original_dii_score || 0);
      if (!scoreGroups.has(score)) scoreGroups.set(score, []);
      scoreGroups.get(score)!.push(c);
    });
    
    const clustered = Array.from(scoreGroups.entries())
      .filter(([score, comps]) => comps.length > companies.length * 0.2)
      .flatMap(([, comps]) => comps);
    
    if (clustered.length > 0) {
      detected.push({
        type: 'pattern',
        severity: 'medium',
        title: 'Score Clustering',
        description: `Unusual concentration of scores - possible systematic bias`,
        affectedCompanies: clustered,
        icon: Users
      });
    }

    return detected.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }, [companies]);

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'score': return 'Score Anomaly';
      case 'data': return 'Data Quality';
      case 'statistical': return 'Statistical';
      case 'pattern': return 'Pattern';
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-dark-bg border border-dark-border rounded-lg p-4">
        <h3 className="text-lg font-medium text-dark-text-primary mb-2">
          Anomaly Detection Summary
        </h3>
        <p className="text-sm text-dark-text-secondary mb-4">
          Automated analysis identified {anomalies.length} potential issues requiring review
        </p>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">
              {anomalies.filter(a => a.severity === 'high').length}
            </p>
            <p className="text-xs text-dark-text-secondary">High Severity</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">
              {anomalies.filter(a => a.severity === 'medium').length}
            </p>
            <p className="text-xs text-dark-text-secondary">Medium Severity</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {anomalies.filter(a => a.severity === 'low').length}
            </p>
            <p className="text-xs text-dark-text-secondary">Low Severity</p>
          </div>
        </div>
      </div>

      {/* Anomaly List */}
      <div className="space-y-4">
        {anomalies.map((anomaly, index) => {
          const Icon = anomaly.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "border rounded-lg p-4",
                getSeverityColor(anomaly.severity)
              )}
            >
              <div className="flex items-start gap-4">
                <Icon className="w-6 h-6 mt-1" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-dark-text-primary">
                      {anomaly.title}
                    </h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      anomaly.severity === 'high' ? 'bg-red-600/20 text-red-400' :
                      anomaly.severity === 'medium' ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-blue-600/20 text-blue-400'
                    )}>
                      {anomaly.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-dark-text-secondary">
                      {getTypeLabel(anomaly.type)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-dark-text-secondary mb-3">
                    {anomaly.description}
                  </p>
                  
                  {/* Affected Companies Preview */}
                  <div className="flex flex-wrap gap-2">
                    {anomaly.affectedCompanies.slice(0, 5).map(company => (
                      <button
                        key={company.id}
                        onClick={() => onSelectCompany(company)}
                        className="px-2 py-1 bg-dark-surface/50 rounded text-xs text-dark-text-primary
                                 hover:bg-dark-surface transition-colors flex items-center gap-1"
                      >
                        {company.name}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                    {anomaly.affectedCompanies.length > 5 && (
                      <span className="px-2 py-1 text-xs text-dark-text-secondary">
                        +{anomaly.affectedCompanies.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {anomalies.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-dark-text-primary font-medium">No significant anomalies detected</p>
          <p className="text-sm text-dark-text-secondary mt-1">
            The historical data appears to be within expected parameters
          </p>
        </div>
      )}
    </div>
  );
}