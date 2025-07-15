import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Building2, 
  Users, 
  DollarSign, 
  Globe, 
  Shield,
  CheckCircle2,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { useAssessmentStore } from '@/store/assessment-store';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { AIHealthIndicator } from '@/components/AIHealthIndicator';
import { cn } from '@shared/utils/cn';
import { INDUSTRY_OPTIONS } from '@/constants/industries';
// import { getDatabaseService } from '@/database'; // TODO: Move to server-side API

export function CompanyConfirmationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    companySearch, 
    classification,
    updateClassificationField,
    setCriticalInfrastructure,
    selectCompany
  } = useAssessmentStore();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    name: companySearch.selectedCompany?.name || '',
    employees: classification.employees || companySearch.selectedCompany?.employees || 0,
    revenue: classification.revenue || companySearch.selectedCompany?.revenue || 0,
    geography: classification.geography || companySearch.selectedCompany?.country || '',
    industry: classification.industry || companySearch.selectedCompany?.industry || ''
  });

  if (!companySearch.selectedCompany) {
    navigate('/assessment/company');
    return null;
  }

  const steps = [
    { label: t('steps.search', 'Búsqueda'), description: t('steps.searchDesc', 'Encuentra tu empresa') },
    { label: t('steps.confirm', 'Confirmar'), description: t('steps.confirmDesc', 'Verifica los datos') },
    { label: t('steps.discover', 'Descubrir'), description: t('steps.discoverDesc', 'Tu modelo de negocio') }
  ];

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleSave = (field: string) => {
    if (field === 'name') {
      // Update the company name by updating the selected company
      if (companySearch.selectedCompany) {
        selectCompany({
          ...companySearch.selectedCompany,
          name: editValues.name
        });
      }
    } else {
      updateClassificationField(field, editValues[field as keyof typeof editValues]);
    }
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    // Reset to original values
    setEditValues({
      name: companySearch.selectedCompany?.name || '',
      employees: classification.employees || companySearch.selectedCompany?.employees || 0,
      revenue: classification.revenue || companySearch.selectedCompany?.revenue || 0,
      geography: classification.geography || companySearch.selectedCompany?.country || '',
      industry: classification.industry || companySearch.selectedCompany?.industry || ''
    });
  };

  const handleCriticalInfra = (value: boolean) => {
    setCriticalInfrastructure(value);
  };

  const handleContinue = async () => {
    // TODO: Integrate with server-side API to create company in database
    // For now, continue with in-memory flow
    console.log('Company confirmation completed, proceeding to business model classification');
    navigate('/assessment/business-model');
  };

  const isComplete = classification.criticalInfra !== null;
  const aiStatus = companySearch.selectedCompany.dataSource === 'ai' ? 'active' : 'offline';

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
      <ProgressIndicator currentStep={2} steps={steps} />
      
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light mb-4">
              {t('confirmation.title', 'Confirmemos la información de su empresa')}
            </h1>
            <p className="text-lg text-dark-text-secondary">
              {t('confirmation.subtitle', 'Verifique que los datos sean correctos')}
            </p>
          </div>

          {/* Company Info Card */}
          <div className="card p-8 mb-6 relative">
            <div className="absolute top-4 right-4">
              <AIHealthIndicator status={aiStatus} />
            </div>
            <div className="space-y-4">
              {/* Company Name Field */}
              <EditableField
                icon={<Building2 className="w-5 h-5" />}
                label={t('company.name', 'Nombre de la empresa')}
                value={editValues.name}
                displayValue={editValues.name}
                isEditing={editingField === 'name'}
                onEdit={() => handleEdit('name')}
                onSave={() => handleSave('name')}
                onCancel={handleCancel}
                onChange={(value) => setEditValues({ ...editValues, name: value })}
                type="text"
                aiEnhanced={false}
              />
              {/* Employees Field */}
              <EditableField
                icon={<Users className="w-5 h-5" />}
                label={t('company.employees', 'Empleados')}
                value={editValues.employees}
                displayValue={editValues.employees.toLocaleString()}
                isEditing={editingField === 'employees'}
                onEdit={() => handleEdit('employees')}
                onSave={() => handleSave('employees')}
                onCancel={handleCancel}
                onChange={(value) => setEditValues({ ...editValues, employees: parseInt(value) || 0 })}
                type="employees"
                aiEnhanced={classification.aiEnhanced.employees}
              />

              {/* Revenue Field */}
              <EditableField
                icon={<DollarSign className="w-5 h-5" />}
                label={t('company.revenue', 'Ingresos anuales')}
                value={editValues.revenue}
                displayValue={`$${(editValues.revenue / 1000000).toFixed(1)}M USD`}
                isEditing={editingField === 'revenue'}
                onEdit={() => handleEdit('revenue')}
                onSave={() => handleSave('revenue')}
                onCancel={handleCancel}
                onChange={(value) => setEditValues({ ...editValues, revenue: parseFloat(value) * 1000000 || 0 })}
                type="number"
                placeholder="10"
                aiEnhanced={classification.aiEnhanced.revenue}
              />

              {/* Geography Field */}
              <EditableField
                icon={<Globe className="w-5 h-5" />}
                label={t('company.headquarters', 'Sede principal')}
                value={editValues.geography}
                displayValue={editValues.geography}
                isEditing={editingField === 'geography'}
                onEdit={() => handleEdit('geography')}
                onSave={() => handleSave('geography')}
                onCancel={handleCancel}
                onChange={(value) => setEditValues({ ...editValues, geography: value })}
                type="text"
                aiEnhanced={classification.aiEnhanced.geography}
              />

              {/* Industry Field */}
              <EditableField
                icon={<Building2 className="w-5 h-5" />}
                label={t('company.industry', 'Industria')}
                value={editValues.industry}
                displayValue={editValues.industry}
                isEditing={editingField === 'industry'}
                onEdit={() => handleEdit('industry')}
                onSave={() => handleSave('industry')}
                onCancel={handleCancel}
                onChange={(value) => setEditValues({ ...editValues, industry: value })}
                type="text"
                aiEnhanced={classification.aiEnhanced.industry}
              />
            </div>

            {/* Critical Infrastructure Question */}
            <div className="mt-8 pt-8 border-t border-dark-border">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-5 h-5 text-primary-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium mb-2">
                    {t('classification.criticalInfra.title', '¿Opera infraestructura crítica?')}
                  </h3>
                  <p className="text-sm text-dark-text-secondary">
                    {t('classification.criticalInfra.description', 
                      'Servicios esenciales como energía, agua, telecomunicaciones, salud, finanzas'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleCriticalInfra(true)}
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
                  onClick={() => handleCriticalInfra(false)}
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
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!isComplete}
              className={cn(
                'btn-primary flex items-center gap-2',
                !isComplete && 'opacity-50 cursor-not-allowed'
              )}
            >
              {t('common.continue', 'Continuar')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface EditableFieldProps {
  icon: React.ReactNode;
  label: string;
  value: any;
  displayValue: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  type: 'text' | 'number' | 'employees';
  placeholder?: string;
  aiEnhanced?: boolean;
}

function EditableField({
  icon,
  label,
  value,
  displayValue,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
  type,
  placeholder,
  aiEnhanced
}: EditableFieldProps) {

  if (isEditing) {
    return (
      <div className="flex items-center gap-3 p-4 bg-dark-surface rounded-lg">
        <div className="text-primary-600">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-dark-text-secondary mb-1">{label}</p>
          {label.includes('Industria') ? (
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded focus:outline-none focus:border-primary-600"
              autoFocus
            >
              <option value="">Seleccione...</option>
              {INDUSTRY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'employees' ? (
            <div className="space-y-2">
              <select
                value={value > 0 ? 'custom' : ''}
                onChange={(e) => {
                  const presetValue = e.target.value;
                  if (presetValue && presetValue !== 'custom') {
                    onChange(presetValue);
                  }
                }}
                className="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded focus:outline-none focus:border-primary-600 text-sm"
              >
                <option value="">Seleccione rango...</option>
                <option value="200">200-500 empleados</option>
                <option value="500">500-1,000 empleados</option>
                <option value="1000">1,000-2,500 empleados</option>
                <option value="2500">2,500-5,000 empleados</option>
                <option value="5000">5,000-10,000 empleados</option>
                <option value="10000">10,000-25,000 empleados</option>
                <option value="25000">25,000-50,000 empleados</option>
                <option value="custom">Valor específico...</option>
              </select>
              <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="200"
                min="200"
                max="50000"
                step="50"
                className="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded focus:outline-none focus:border-primary-600"
                autoFocus
              />
              <p className="text-xs text-dark-text-secondary">
                Rango objetivo: 200 - 50,000 empleados
              </p>
            </div>
          ) : (
            <input
              type={type}
              value={type === 'number' && value ? value / 1000000 : value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-2 py-1 bg-dark-bg border border-dark-border rounded focus:outline-none focus:border-primary-600"
              autoFocus
            />
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="p-2 text-green-500 hover:bg-green-500/10 rounded transition-colors"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={onCancel}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 hover:bg-dark-surface/50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-primary-600">{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-dark-text-secondary">{label}</p>
          <p className="font-medium flex items-center gap-2">
            {displayValue}
            {aiEnhanced && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </p>
        </div>
        <button
          onClick={onEdit}
          className="p-2 text-dark-text-secondary hover:text-primary-600 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* AI Enhancement Notice */}
      {aiEnhanced && (
        <div className="mt-3 pt-3 border-t border-dark-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Información obtenida automáticamente</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-dark-text-secondary">¿Es correcto?</span>
              <button className="text-green-500 hover:text-green-400 font-medium">
                Sí, usar este dato
              </button>
              <span className="text-dark-text-secondary">•</span>
              <button 
                onClick={onEdit}
                className="text-yellow-500 hover:text-yellow-400 font-medium"
              >
                Corregir manualmente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}