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
import { DIIBusinessModelClassifier } from '@core/business-model/dii-classifier';
import type { BusinessModel } from '@core/types/business-model.types';
import { cn } from '@shared/utils/cn';

// DII-specific model descriptions (with legacy support)
const modelDescriptions: Partial<Record<BusinessModel, string>> = {
  // DII models
  COMERCIO_HIBRIDO: 'Comercio híbrido. Canales físicos y digitales, múltiples vectores de ataque.',
  SOFTWARE_CRITICO: 'Software crítico. Alta disponibilidad requerida, downtime = pérdida inmediata.',
  SERVICIOS_DATOS: 'Servicios de datos. Concentración de valor, objetivo de alto perfil.',
  ECOSISTEMA_DIGITAL: 'Ecosistema digital. Vulnerabilidades de terceros se vuelven propias.',
  SERVICIOS_FINANCIEROS: 'Servicios financieros. Cero tolerancia a errores, regulación estricta.',
  INFRAESTRUCTURA_HEREDADA: 'Infraestructura heredada. Sistemas legacy difíciles de proteger.',
  CADENA_SUMINISTRO: 'Cadena de suministro. Integración de partners multiplica riesgos.',
  INFORMACION_REGULADA: 'Información regulada. Datos sensibles, objetivo de actores sofisticados.',
  // Legacy models (map to DII equivalents)
  SUBSCRIPTION_BASED: 'Software crítico. Alta disponibilidad requerida, downtime = pérdida inmediata.',
  TRANSACTION_BASED: 'Servicios financieros. Cero tolerancia a errores, regulación estricta.',
  ASSET_LIGHT: 'Software crítico. Alta disponibilidad requerida, downtime = pérdida inmediata.',
  ASSET_HEAVY: 'Infraestructura heredada. Sistemas legacy difíciles de proteger.',
  DATA_DRIVEN: 'Servicios de datos. Concentración de valor, objetivo de alto perfil.',
  PLATFORM_ECOSYSTEM: 'Ecosistema digital. Vulnerabilidades de terceros se vuelven propias.',
  DIRECT_TO_CONSUMER: 'Comercio híbrido. Canales físicos y digitales, múltiples vectores de ataque.',
  B2B_ENTERPRISE: 'Infraestructura heredada. Sistemas legacy difíciles de proteger.'
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
  
  const [showAlternatives, setShowAlternatives] = useState(false);

  useEffect(() => {
    if (!companySearch.selectedCompany) {
      navigate('/assessment/company');
      return;
    }

    // Use industry-based classification with real company data
    const industry = classification.industry || companySearch.selectedCompany.industry || '';
    const companyName = companySearch.selectedCompany.name;
    
    const result = DIIBusinessModelClassifier.classifyByIndustry(
      industry,
      companyName
    );

    setSuggestedModel({
      model: result.model,
      confidence: result.confidence, // Use actual confidence from classifier
      reasoning: result.reasoning || `Based on industry analysis: ${industry}`
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

  const handleModelSelect = (model: BusinessModel) => {
    setBusinessModel(model);
    navigate('/assessment/questions');
  };

  // All DII business models for manual selection
  const allModels: Array<{model: BusinessModel, name: string, description: string}> = [
    { 
      model: 'COMERCIO_HIBRIDO', 
      name: 'Comercio Híbrido', 
      description: 'Canales físicos y digitales combinados' 
    },
    { 
      model: 'SOFTWARE_CRITICO', 
      name: 'Software Crítico', 
      description: 'SaaS, plataformas en la nube, software empresarial' 
    },
    { 
      model: 'SERVICIOS_DATOS', 
      name: 'Servicios de Datos', 
      description: 'Monetización de datos, analytics, insights' 
    },
    { 
      model: 'ECOSISTEMA_DIGITAL', 
      name: 'Ecosistema Digital', 
      description: 'Plataformas multi-lado, marketplaces' 
    },
    { 
      model: 'SERVICIOS_FINANCIEROS', 
      name: 'Servicios Financieros', 
      description: 'Procesamiento de transacciones, fintech' 
    },
    { 
      model: 'INFRAESTRUCTURA_HEREDADA', 
      name: 'Infraestructura Heredada', 
      description: 'Sistemas legacy con capas digitales' 
    },
    { 
      model: 'CADENA_SUMINISTRO', 
      name: 'Cadena de Suministro', 
      description: 'Logística con seguimiento digital' 
    },
    { 
      model: 'INFORMACION_REGULADA', 
      name: 'Información Regulada', 
      description: 'Salud, datos sensibles, compliance' 
    }
  ];

  // Get model icon based on type
  const getModelIcon = (model: BusinessModel) => {
    const icons: Partial<Record<BusinessModel, any>> = {
      // DII models
      COMERCIO_HIBRIDO: Zap,
      SOFTWARE_CRITICO: TrendingUp,
      SERVICIOS_DATOS: AlertTriangle,
      ECOSISTEMA_DIGITAL: Target,
      SERVICIOS_FINANCIEROS: Shield,
      INFRAESTRUCTURA_HEREDADA: Shield,
      CADENA_SUMINISTRO: Target,
      INFORMACION_REGULADA: AlertTriangle,
      // Legacy models
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
  const keyRisks: Partial<Record<BusinessModel, Array<{name: string, level: 'high' | 'medium' | 'low'}>>> = {
    COMERCIO_HIBRIDO: [
      { name: 'POS Malware', level: 'high' },
      { name: 'E-commerce Skimming', level: 'high' }
    ],
    SOFTWARE_CRITICO: [
      { name: 'API Exploitation', level: 'high' },
      { name: 'Supply Chain Attack', level: 'medium' }
    ],
    SERVICIOS_DATOS: [
      { name: 'Data Exfiltration', level: 'high' },
      { name: 'Insider Threat', level: 'high' }
    ],
    ECOSISTEMA_DIGITAL: [
      { name: 'Third-party Vulnerabilities', level: 'high' },
      { name: 'OAuth Abuse', level: 'medium' }
    ],
    SERVICIOS_FINANCIEROS: [
      { name: 'Transaction Fraud', level: 'high' },
      { name: 'DDoS Attack', level: 'high' }
    ],
    INFRAESTRUCTURA_HEREDADA: [
      { name: 'Ransomware', level: 'high' },
      { name: 'Unpatched Systems', level: 'high' }
    ],
    CADENA_SUMINISTRO: [
      { name: 'Supply Chain Attack', level: 'high' },
      { name: 'GPS Manipulation', level: 'medium' }
    ],
    INFORMACION_REGULADA: [
      { name: 'Ransomware', level: 'high' },
      { name: 'Nation-state APT', level: 'medium' }
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
                <div className="flex items-center gap-2">
                  <p className="text-sm text-dark-text-secondary">
                    Clasificación automática: {suggestedModel.confidence.toFixed(0)}%
                  </p>
                  {suggestedModel.confidence >= 80 && (
                    <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded">
                      Coincidencia exacta
                    </span>
                  )}
                  {suggestedModel.confidence >= 60 && suggestedModel.confidence < 80 && (
                    <span className="text-xs bg-yellow-600/20 text-yellow-400 px-2 py-0.5 rounded">
                      Buena coincidencia
                    </span>
                  )}
                  {suggestedModel.confidence < 60 && (
                    <span className="text-xs bg-orange-600/20 text-orange-400 px-2 py-0.5 rounded">
                      Verificar manualmente
                    </span>
                  )}
                </div>
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

          {/* Alternative Models */}
          {showAlternatives && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="card p-6 mb-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                Seleccione su modelo de negocio
              </h3>
              <p className="text-sm text-dark-text-secondary mb-4">
                Si la sugerencia no es exacta, puede elegir manualmente el modelo que mejor describe su empresa:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allModels.map((model) => {
                  const ModelIcon = getModelIcon(model.model);
                  return (
                    <button
                      key={model.model}
                      onClick={() => handleModelSelect(model.model)}
                      className={cn(
                        "p-4 text-left rounded-lg border-2 transition-all hover:border-primary-600/50",
                        model.model === suggestedModel.model 
                          ? "border-primary-600 bg-primary-600/10" 
                          : "border-dark-border hover:bg-primary-600/5"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <ModelIcon className="w-5 h-5 text-primary-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">{model.name}</h4>
                          <p className="text-xs text-dark-text-secondary mt-1">
                            {model.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div 
            className="text-center space-y-4"
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
            
            {!showAlternatives && (
              <button
                onClick={() => setShowAlternatives(true)}
                className="text-sm text-primary-600 hover:text-primary-500 transition-colors underline"
              >
                ¿No coincide con su empresa? Seleccione manualmente
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}