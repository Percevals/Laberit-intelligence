import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Globe, 
  Shield,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAssessmentStore } from '@/store/assessment-store';
import type { BusinessModel } from '@core/types/business-model.types';
import { DIIBusinessModelClassifier } from '@core/business-model/dii-classifier';
import { cn } from '@shared/utils/cn';

export function SmartClassificationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    companySearch, 
    classification,
    setBusinessModel,
    updateProgress
  } = useAssessmentStore();

  const [suggestedModel, setSuggestedModel] = useState<{
    model: BusinessModel;
    confidence: number;
    reasoning: string;
  } | null>(null);

  // Check what fields need to be filled
  const missingFields = {
    revenue: !classification.revenue && !classification.aiEnhanced.revenue,
    employees: !classification.employees && !classification.aiEnhanced.employees,
    geography: !classification.geography && !classification.aiEnhanced.geography,
    industry: !classification.industry && !classification.aiEnhanced.industry,
    criticalInfra: classification.criticalInfra === null
  };

  const fieldsToShow = Object.entries(missingFields)
    .filter(([_, missing]) => missing)
    .map(([field]) => field);

  // Suggest business model based on company data
  useEffect(() => {
    // Only suggest when all fields are complete
    const allFieldsComplete = fieldsToShow.length === 0 && 
      classification.criticalInfra !== null;
    
    if (allFieldsComplete && companySearch.selectedCompany) {
      // Use DII-specific industry classification
      const industry = classification.industry || companySearch.selectedCompany.industry || '';
      const companyName = companySearch.selectedCompany.name || '';
      
      const diiClassification = DIIBusinessModelClassifier.classifyByIndustry(
        industry,
        companyName
      );

      setSuggestedModel({
        model: diiClassification.model,
        confidence: diiClassification.confidence as any / 100,
        reasoning: diiClassification.reasoning
      });
    }
  }, [companySearch.selectedCompany, classification.industry, classification.criticalInfra, fieldsToShow.length]);

  const handleFieldUpdate = (field: string, value: any) => {
    switch (field) {
      case 'revenue':
        useAssessmentStore.setState(state => ({
          classification: { ...state.classification, revenue: value }
        }));
        break;
      case 'employees':
        useAssessmentStore.setState(state => ({
          classification: { ...state.classification, employees: value }
        }));
        break;
      case 'geography':
        useAssessmentStore.setState(state => ({
          classification: { ...state.classification, geography: value }
        }));
        break;
      case 'industry':
        useAssessmentStore.setState(state => ({
          classification: { ...state.classification, industry: value }
        }));
        break;
      case 'criticalInfra':
        useAssessmentStore.setState(state => ({
          classification: { ...state.classification, criticalInfra: value }
        }));
        break;
    }
  };


  // Don't auto-navigate - let user complete the flow here

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light mb-4">
              {fieldsToShow.length > 0 
                ? t('assessment.classification.complete', 'Completemos su perfil')
                : t('assessment.classification.confirm', 'Confirmemos su información')
              }
            </h1>
            <p className="text-lg text-dark-text-secondary">
              {fieldsToShow.length > 0
                ? t('assessment.classification.fillMissing', 'Solo necesitamos algunos datos más')
                : t('assessment.classification.review', 'Revise que todo esté correcto')
              }
            </p>
          </div>

          {/* AI Enhancement Notice */}
          {Object.values(classification.aiEnhanced).some(v => v) && (
            <div className="mb-6 p-4 bg-primary-600/10 border border-primary-600/30 rounded-lg flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <p className="text-sm text-primary-600">
                {t('assessment.classification.aiEnhanced', 'Hemos pre-llenado algunos campos con IA. Por favor verifique.')}
              </p>
            </div>
          )}

          {/* Classification Fields */}
          <div className="space-y-6">
            {/* Revenue Field */}
            {fieldsToShow.includes('revenue') && (
              <ClassificationField
                icon={<DollarSign className="w-5 h-5" />}
                label={t('assessment.classification.revenue', 'Ingresos anuales')}
                value={classification.revenue}
                aiEnhanced={classification.aiEnhanced.revenue}
                onChange={(value) => handleFieldUpdate('revenue', value)}
                type="revenue"
                required={fieldsToShow.includes('revenue')}
              />
            )}

            {/* Employees Field */}
            {fieldsToShow.includes('employees') && (
              <ClassificationField
                icon={<Users className="w-5 h-5" />}
                label={t('assessment.classification.employees', 'Número de empleados')}
                value={classification.employees}
                aiEnhanced={classification.aiEnhanced.employees}
                onChange={(value) => handleFieldUpdate('employees', value)}
                type="employees"
                required={fieldsToShow.includes('employees')}
              />
            )}

            {/* Geography Field */}
            {fieldsToShow.includes('geography') && (
              <ClassificationField
                icon={<Globe className="w-5 h-5" />}
                label={t('assessment.classification.geography', 'Ubicación principal')}
                value={classification.geography}
                aiEnhanced={classification.aiEnhanced.geography}
                onChange={(value) => handleFieldUpdate('geography', value)}
                type="text"
                required={fieldsToShow.includes('geography')}
              />
            )}

            {/* Industry Field */}
            {fieldsToShow.includes('industry') && (
              <ClassificationField
                icon={<Building2 className="w-5 h-5" />}
                label={t('assessment.classification.industry', 'Industria')}
                value={classification.industry}
                aiEnhanced={classification.aiEnhanced.industry}
                onChange={(value) => handleFieldUpdate('industry', value)}
                type="text"
                required={fieldsToShow.includes('industry')}
              />
            )}

            {/* Critical Infrastructure - Always show if not answered */}
            {classification.criticalInfra === null && (
              <div className="card p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="w-5 h-5 text-primary-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">
                      {t('assessment.classification.criticalInfra.title', '¿Opera infraestructura crítica?')}
                    </h3>
                    <p className="text-sm text-dark-text-secondary">
                      {t('assessment.classification.criticalInfra.description', 
                        'Servicios esenciales como energía, agua, telecomunicaciones, salud, finanzas'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleFieldUpdate('criticalInfra', true)}
                    className={cn(
                      'flex-1 p-3 rounded-lg border transition-all',
                      classification.criticalInfra === true
                        ? 'border-primary-600 bg-primary-600/10 text-primary-600'
                        : 'border-dark-border hover:border-primary-600/50'
                    )}
                  >
                    {t('common.yes', 'Sí')}
                  </button>
                  <button
                    onClick={() => handleFieldUpdate('criticalInfra', false)}
                    className={cn(
                      'flex-1 p-3 rounded-lg border transition-all',
                      classification.criticalInfra === false
                        ? 'border-primary-600 bg-primary-600/10 text-primary-600'
                        : 'border-dark-border hover:border-primary-600/50'
                    )}
                  >
                    {t('common.no', 'No')}
                  </button>
                </div>
              </div>
            )}

            {/* AI Model Suggestion */}
            {suggestedModel && !classification.businessModel && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 border-primary-600/30 bg-primary-600/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <h3 className="font-medium">
                    {t('assessment.classification.modelSuggestion', 'Modelo de negocio sugerido')}
                  </h3>
                </div>
                <p className="text-lg font-medium mb-2">
                  {t(`businessModels.names.${suggestedModel.model}`)}
                </p>
                <p className="text-sm text-dark-text-secondary mb-4">
                  {suggestedModel.reasoning}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setBusinessModel(suggestedModel.model);
                      updateProgress('questions');
                      navigate('/assessment/questions');
                    }}
                    className="btn-primary flex-1"
                  >
                    {t('assessment.classification.acceptSuggestion', 'Aceptar sugerencia')}
                  </button>
                  <button
                    onClick={() => {
                      // For now, use the suggested model but let user know we'll add selection later
                      setBusinessModel(suggestedModel.model);
                      updateProgress('questions');
                      navigate('/assessment/questions');
                    }}
                    className="btn-secondary"
                  >
                    {t('assessment.classification.chooseDifferent', 'Elegir otro')}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
}

interface ClassificationFieldProps {
  icon: React.ReactNode;
  label: string;
  value: any;
  aiEnhanced: boolean;
  onChange: (value: any) => void;
  type: 'text' | 'revenue' | 'employees';
  required: boolean;
}

function ClassificationField({
  icon,
  label,
  value,
  aiEnhanced,
  onChange,
  type,
  required
}: ClassificationFieldProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(required && !value);

  const formatValue = () => {
    if (!value) return '';
    
    switch (type) {
      case 'revenue':
        return `$${(value / 1000000).toFixed(1)}M USD`;
      case 'employees':
        return value.toLocaleString();
      default:
        return value;
    }
  };

  const parseValue = (input: string) => {
    switch (type) {
      case 'revenue':
        const revenue = parseFloat(input.replace(/[^0-9.]/g, ''));
        return isNaN(revenue) ? 0 : revenue * 1000000;
      case 'employees':
        const employees = parseInt(input.replace(/[^0-9]/g, ''));
        return isNaN(employees) ? 0 : employees;
      default:
        return input;
    }
  };

  if (!isEditing && value) {
    return (
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-primary-600">{icon}</div>
          <div>
            <p className="text-sm text-dark-text-secondary">{label}</p>
            <p className="font-medium">{formatValue()}</p>
          </div>
          {aiEnhanced && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          {t('common.edit', 'Editar')}
        </button>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-primary-600">{icon}</div>
        <label className="font-medium">{label}</label>
      </div>
      <input
        type={type === 'revenue' || type === 'employees' ? 'text' : 'text'}
        placeholder={
          type === 'revenue' ? '$10M USD' : 
          type === 'employees' ? '500' : 
          t('common.enterValue', 'Ingrese valor')
        }
        defaultValue={value ? formatValue() : ''}
        onBlur={(e) => {
          const parsed = parseValue(e.target.value);
          onChange(parsed);
          if (parsed) setIsEditing(false);
        }}
        className={cn(
          'w-full px-3 py-2',
          'bg-dark-bg border border-dark-border rounded',
          'text-dark-text-primary',
          'focus:outline-none focus:border-primary-600'
        )}
        autoFocus
      />
    </div>
  );
}