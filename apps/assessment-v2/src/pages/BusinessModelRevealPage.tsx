import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Target,
  Zap,
  Shield,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useAssessmentStore } from '@/store/assessment-store';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { BusinessModelClassifier } from '@core/business-model/classifier';
import type { BusinessModel } from '@core/types/business-model.types';
import { cn } from '@shared/utils/cn';

// Simplified model data
const modelDescriptions: Record<BusinessModel, string> = {
  SUBSCRIPTION_BASED: 'Ingresos recurrentes. Alta predictibilidad, vulnerable a cancelaciones masivas.',
  TRANSACTION_BASED: 'Ingresos por transacción. Escalable pero sensible a interrupciones.',
  ASSET_LIGHT: 'Mínimos activos físicos. Ágil pero dependiente de terceros.',
  ASSET_HEAVY: 'Infraestructura física significativa. Resiliente con alto costo de recuperación.',
  DATA_DRIVEN: 'Datos como valor principal. Alto valor, objetivo atractivo para atacantes.',
  PLATFORM_ECOSYSTEM: 'Plataforma multi-sided. Efectos de red, complejidad en seguridad.',
  DIRECT_TO_CONSUMER: 'Ventas directas. Control total, toda la responsabilidad.',
  B2B_ENTERPRISE: 'Ventas empresariales. Contratos estables, alto impacto por cliente.'
};

export function BusinessModelRevealPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    companySearch,
    classification,
    setBusinessModel 
  } = useAssessmentStore();
  
  const [suggestedModel, setSuggestedModel] = useState<{
    model: BusinessModel;
    confidence: number;
    reasoning: string;
  } | null>(null);

  useEffect(() => {
    if (!companySearch.selectedCompany) {
      navigate('/assessment/company');
      return;
    }

    // Use classifier to determine business model
    const result = BusinessModelClassifier.classify({
      revenueModel: 'recurring_subscriptions', 
      operationalDependency: 'fully_digital'
    });

    setSuggestedModel({
      model: result.model,
      confidence: Math.min(result.confidence * 100, 95), // Cap at 95%
      reasoning: `Basado en su industria: ${classification.industry || companySearch.selectedCompany.industry}`
    });
  }, [companySearch.selectedCompany, classification.industry, navigate]);

  if (!suggestedModel) return null;
  
  const steps = [
    { label: t('steps.search', 'Búsqueda') },
    { label: t('steps.confirm', 'Confirmar') },
    { label: t('steps.discover', 'Descubrir') }
  ];

  const handleContinue = () => {
    setBusinessModel(suggestedModel.model);
    navigate('/assessment/questions');
  };

  // Get model icon based on type
  const getModelIcon = (model: BusinessModel) => {
    const icons: Record<BusinessModel, any> = {
      SUBSCRIPTION_BASED: TrendingUp,
      TRANSACTION_BASED: Zap,
      ASSET_LIGHT: Target,
      ASSET_HEAVY: Shield,
      DATA_DRIVEN: AlertTriangle,
      PLATFORM_ECOSYSTEM: Target,
      DIRECT_TO_CONSUMER: Zap,
      B2B_ENTERPRISE: Shield
    };
    return icons[model] || Target;
  };

  const ModelIcon = getModelIcon(suggestedModel.model);

  // Top 2 key risks for each model
  const keyRisks: Record<BusinessModel, Array<{name: string, level: 'high' | 'medium' | 'low'}>> = {
    SUBSCRIPTION_BASED: [
      { name: 'Credential Stuffing', level: 'high' },
      { name: 'API Abuse', level: 'medium' }
    ],
    TRANSACTION_BASED: [
      { name: 'DDoS Attacks', level: 'high' },
      { name: 'Payment Fraud', level: 'high' }
    ],
    ASSET_LIGHT: [
      { name: 'Third-party Risk', level: 'high' },
      { name: 'Cloud Misconfiguration', level: 'medium' }
    ],
    ASSET_HEAVY: [
      { name: 'Ransomware', level: 'high' },
      { name: 'Physical Security', level: 'medium' }
    ],
    DATA_DRIVEN: [
      { name: 'Data Exfiltration', level: 'high' },
      { name: 'Privacy Violations', level: 'high' }
    ],
    PLATFORM_ECOSYSTEM: [
      { name: 'Third-party Apps', level: 'medium' },
      { name: 'API Abuse', level: 'high' }
    ],
    DIRECT_TO_CONSUMER: [
      { name: 'E-commerce Fraud', level: 'high' },
      { name: 'Customer Data Breach', level: 'medium' }
    ],
    B2B_ENTERPRISE: [
      { name: 'Targeted Attacks', level: 'high' },
      { name: 'IP Theft', level: 'medium' }
    ]
  };

  const modelRisks = keyRisks[suggestedModel.model] || [];

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
      <ProgressIndicator currentStep={3} steps={steps} />
      
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-3xl font-light mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t('reveal.title', 'Hemos identificado su modelo de negocio')}
            </motion.h1>
          </div>

          {/* Business Model Card */}
          <motion.div 
            className="card p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary-600/10 rounded-lg flex items-center justify-center">
                <ModelIcon className="w-7 h-7 text-primary-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {t(`businessModels.names.${suggestedModel.model}`)}
                </h2>
                <p className="text-sm text-dark-text-secondary">
                  {t(`reveal.confidence`, 'Confianza')}: {suggestedModel.confidence.toFixed(0)}%
                </p>
              </div>
            </div>

            <p className="text-sm text-dark-text-secondary mb-6">
              {modelDescriptions[suggestedModel.model]}
            </p>

            {/* Minimalist Risk Display */}
            <div className="border-t border-dark-border pt-4">
              <h3 className="text-sm font-medium mb-3 text-dark-text-secondary">
                {t('reveal.keyRisks', 'Riesgos principales para su modelo')}
              </h3>
              <div className="space-y-2">
                {modelRisks.map((risk, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{risk.name}</span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      risk.level === 'high' ? 'bg-red-500/20 text-red-500' :
                      risk.level === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-green-500/20 text-green-500'
                    )}>
                      {t(`risk.${risk.level}`, risk.level.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={handleContinue}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2 mx-auto"
            >
              {t('reveal.startAssessment', 'Iniciar evaluación')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}