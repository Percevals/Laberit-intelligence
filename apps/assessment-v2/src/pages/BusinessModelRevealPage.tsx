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
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAssessmentStore } from '@/store/assessment-store';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { BusinessModelClassifier } from '@core/business-model/classifier';
import type { BusinessModel } from '@core/types/business-model.types';
import { cn } from '@shared/utils/cn';

// Simplified model data for now - in production, this would come from model-profiles
const modelDescriptions: Record<BusinessModel, string> = {
  SUBSCRIPTION_BASED: 'Modelo de ingresos recurrentes a través de suscripciones. Alta predictibilidad pero vulnerable a cancelaciones masivas.',
  TRANSACTION_BASED: 'Ingresos por transacción individual. Escalable pero sensible a interrupciones del servicio.',
  ASSET_LIGHT: 'Mínimos activos físicos. Ágil pero dependiente de terceros para operaciones críticas.',
  ASSET_HEAVY: 'Infraestructura física significativa. Resiliente pero con alto costo de recuperación.',
  DATA_DRIVEN: 'Los datos como valor principal. Alto valor pero objetivo atractivo para atacantes.',
  PLATFORM_ECOSYSTEM: 'Plataforma multi-sided. Efectos de red pero complejidad en seguridad.',
  DIRECT_TO_CONSUMER: 'Ventas directas al consumidor final. Control total pero toda la responsabilidad.',
  B2B_ENTERPRISE: 'Ventas empresariales complejas. Contratos estables pero alto impacto por cliente.'
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
    // For now, use simple heuristics based on industry
    // In production, this would come from actual classification questions
    const result = BusinessModelClassifier.classify({
      revenueModel: 'recurring_subscriptions', 
      operationalDependency: 'fully_digital'
    });

    setSuggestedModel({
      model: result.model,
      confidence: result.confidence * 100,
      reasoning: `Basado en su industria: ${classification.industry || companySearch.selectedCompany.industry}`
    });
  }, [companySearch.selectedCompany, classification.industry, navigate]);

  if (!suggestedModel) return null;
  
  const steps = [
    { label: t('steps.search', 'Búsqueda'), description: t('steps.searchDesc', 'Encuentra tu empresa') },
    { label: t('steps.confirm', 'Confirmar'), description: t('steps.confirmDesc', 'Verifica los datos') },
    { label: t('steps.discover', 'Descubrir'), description: t('steps.discoverDesc', 'Tu modelo de negocio') }
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

  // Simplified attack patterns for demo
  const attackPatterns = {
    SUBSCRIPTION_BASED: [
      { type: 'Credential Stuffing', frequency: 'VERY_COMMON', impact: 'MEDIUM' },
      { type: 'API Abuse', frequency: 'COMMON', impact: 'HIGH' },
      { type: 'Supply Chain', frequency: 'OCCASIONAL', impact: 'CRITICAL' }
    ],
    TRANSACTION_BASED: [
      { type: 'DDoS', frequency: 'COMMON', impact: 'HIGH' },
      { type: 'Payment Fraud', frequency: 'VERY_COMMON', impact: 'MEDIUM' },
      { type: 'Data Breach', frequency: 'OCCASIONAL', impact: 'CRITICAL' }
    ],
    ASSET_LIGHT: [
      { type: 'Third-party Compromise', frequency: 'COMMON', impact: 'HIGH' },
      { type: 'Cloud Misconfiguration', frequency: 'COMMON', impact: 'MEDIUM' },
      { type: 'Insider Threat', frequency: 'OCCASIONAL', impact: 'HIGH' }
    ],
    ASSET_HEAVY: [
      { type: 'Ransomware', frequency: 'COMMON', impact: 'CRITICAL' },
      { type: 'Physical Security', frequency: 'OCCASIONAL', impact: 'HIGH' },
      { type: 'Supply Chain', frequency: 'OCCASIONAL', impact: 'HIGH' }
    ],
    DATA_DRIVEN: [
      { type: 'Data Exfiltration', frequency: 'VERY_COMMON', impact: 'CRITICAL' },
      { type: 'Privacy Violation', frequency: 'COMMON', impact: 'HIGH' },
      { type: 'Model Poisoning', frequency: 'RARE', impact: 'MEDIUM' }
    ],
    PLATFORM_ECOSYSTEM: [
      { type: 'Third-party Apps', frequency: 'COMMON', impact: 'MEDIUM' },
      { type: 'API Abuse', frequency: 'VERY_COMMON', impact: 'HIGH' },
      { type: 'Account Takeover', frequency: 'COMMON', impact: 'MEDIUM' }
    ],
    DIRECT_TO_CONSUMER: [
      { type: 'E-commerce Fraud', frequency: 'VERY_COMMON', impact: 'MEDIUM' },
      { type: 'Customer Data Breach', frequency: 'OCCASIONAL', impact: 'HIGH' },
      { type: 'Website Defacement', frequency: 'RARE', impact: 'LOW' }
    ],
    B2B_ENTERPRISE: [
      { type: 'Targeted Attacks', frequency: 'OCCASIONAL', impact: 'CRITICAL' },
      { type: 'Contract Breach', frequency: 'RARE', impact: 'HIGH' },
      { type: 'IP Theft', frequency: 'OCCASIONAL', impact: 'CRITICAL' }
    ]
  };

  const topAttacks = attackPatterns[suggestedModel.model] || [];

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
      <ProgressIndicator currentStep={3} steps={steps} />
      
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1 
              className="text-4xl font-light mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t('reveal.title', 'Hemos identificado su modelo de negocio')}
            </motion.h1>
            <motion.p 
              className="text-xl text-dark-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t('reveal.subtitle', 'Esto es lo que descubrimos sobre su empresa')}
            </motion.p>
          </div>

          {/* Business Model Card */}
          <motion.div 
            className="card p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-600/10 rounded-lg flex items-center justify-center">
                  <ModelIcon className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">
                    {t(`businessModels.names.${suggestedModel.model}`)}
                  </h2>
                  <p className="text-dark-text-secondary">
                    {t(`reveal.confidence`, 'Confianza')}: {suggestedModel.confidence.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            <p className="text-lg mb-6 text-dark-text-secondary">
              {modelDescriptions[suggestedModel.model]}
            </p>

            {/* Key Characteristics */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Attack Surface */}
              <div className="bg-dark-surface rounded-lg p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  {t('reveal.attackSurface', 'Superficie de Ataque')}
                </h3>
                
                <div className="space-y-3">
                  {topAttacks.map((attack, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full mt-1.5',
                        attack.frequency === 'VERY_COMMON' ? 'bg-red-500' :
                        attack.frequency === 'COMMON' ? 'bg-orange-500' :
                        attack.frequency === 'OCCASIONAL' ? 'bg-yellow-500' :
                        'bg-green-500'
                      )} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{attack.type}</p>
                        <p className="text-xs text-dark-text-secondary">
                          {t(`frequency.${attack.frequency.toLowerCase()}`) as string} · 
                          {' '}{t(`impact.${attack.impact.toLowerCase()}`) as string}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Severity */}
              <div className="bg-dark-surface rounded-lg p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary-600" />
                  {t('reveal.impactSeverity', 'Severidad del Impacto')}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('reveal.resilienceWindow', 'Ventana de resiliencia')}</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      24-48h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('reveal.operationalRisk', 'Riesgo operacional')}</span>
                    <span className={cn(
                      'font-medium px-2 py-1 rounded text-xs',
                      'bg-yellow-500/20 text-yellow-500'
                    )}>
                      {t('risk.medium', 'MEDIO')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('reveal.fatalFlaw', 'Vulnerabilidad clave')}</span>
                    <span className="text-sm text-dark-text-secondary text-right max-w-[150px]">
                      Dependencia de terceros
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Companies */}
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm">
                <span className="font-medium text-yellow-600">
                  {t('reveal.similarCompanies', 'Empresas similares que sufrieron brechas')}:
                </span>
                {' '}
                Netflix, Spotify, Adobe
              </p>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-lg text-dark-text-secondary mb-6">
              {t('reveal.readyToAssess', '¿Listo para evaluar su inmunidad digital?')}
            </p>
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