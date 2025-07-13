import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Edit2 } from 'lucide-react';
import { CompanySearchInput } from '@features/company-search';
import { useAssessmentStore } from '@/store/assessment-store';
import type { CompanyInfo } from '@services/ai/types';

export function CompanySearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    companySearch,
    selectCompany,
    confirmCompany,
    updateClassificationFromCompany,
    startAssessment
  } = useAssessmentStore();

  const handleCompanySelect = (company: CompanyInfo) => {
    selectCompany(company);
    updateClassificationFromCompany(company);
  };

  const handleConfirm = () => {
    confirmCompany();
    startAssessment();
    navigate('/assessment/classify');
  };

  const handleEdit = () => {
    // Navigate to manual edit page or open modal
    navigate('/assessment/company-edit');
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light mb-4">
              {t('companySearch.title', 'Comencemos con su empresa')}
            </h1>
            <p className="text-xl text-dark-text-secondary">
              {t('companySearch.subtitle', 'Buscaremos información para ahorrarle tiempo')}
            </p>
          </div>

          {/* Search Input */}
          {!companySearch.selectedCompany && (
            <div className="card p-8">
              <CompanySearchInput onSelect={handleCompanySelect} />
              <p className="text-sm text-dark-text-secondary mt-4 text-center">
                {t('companySearch.privacy', 'Su información es confidencial y no será almacenada')}
              </p>
            </div>
          )}

          {/* Selected Company Review */}
          {companySearch.selectedCompany && !companySearch.isConfirmed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="card p-8"
            >
              <h2 className="text-2xl font-light mb-6">
                {t('companySearch.confirmTitle', '¿Es esta su empresa?')}
              </h2>
              
              <CompanyInfoDisplay company={companySearch.selectedCompany} />
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleEdit}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  {t('common.edit', 'Editar')}
                </button>
                <button
                  onClick={handleConfirm}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t('common.confirm', 'Confirmar')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {companySearch.isConfirmed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-light mb-4">
                {t('companySearch.confirmed', '¡Perfecto!')}
              </h2>
              <p className="text-dark-text-secondary mb-8">
                {t('companySearch.nextStep', 'Ahora identifiquemos su modelo de negocio')}
              </p>
              <button
                onClick={() => navigate('/assessment/classify')}
                className="btn-primary inline-flex items-center gap-2"
              >
                {t('common.continue', 'Continuar')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

interface CompanyInfoDisplayProps {
  company: CompanyInfo;
}

function CompanyInfoDisplay({ company }: CompanyInfoDisplayProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="border-b border-dark-border pb-4">
        <h3 className="text-xl font-semibold text-dark-text-primary">
          {company.name}
        </h3>
        {company.legalName && company.legalName !== company.name && (
          <p className="text-sm text-dark-text-secondary mt-1">
            {company.legalName}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {company.employees && (
          <InfoField
            label={t('company.employees', 'Empleados')}
            value={company.employees.toLocaleString()}
            verified={company.dataSource === 'ai'}
          />
        )}
        
        {company.revenue && (
          <InfoField
            label={t('company.revenue', 'Ingresos anuales')}
            value={`$${(company.revenue / 1000000).toFixed(0)}M USD`}
            verified={company.dataSource === 'ai'}
          />
        )}
        
        {company.headquarters && (
          <InfoField
            label={t('company.headquarters', 'Sede principal')}
            value={company.headquarters}
            verified={company.dataSource === 'ai'}
          />
        )}
        
        {company.industry && (
          <InfoField
            label={t('company.industry', 'Industria')}
            value={company.industry}
            verified={company.dataSource === 'ai'}
          />
        )}
        
        {company.yearFounded && (
          <InfoField
            label={t('company.founded', 'Año de fundación')}
            value={company.yearFounded.toString()}
            verified={company.dataSource === 'ai'}
          />
        )}
        
        {company.website && (
          <InfoField
            label={t('company.website', 'Sitio web')}
            value={company.website}
            isLink
            verified={company.dataSource === 'ai'}
          />
        )}
      </div>

      {company.description && (
        <div className="pt-4 border-t border-dark-border">
          <p className="text-sm text-dark-text-secondary">
            {company.description}
          </p>
        </div>
      )}

      {company.techStack && company.techStack.length > 0 && (
        <div className="pt-4 border-t border-dark-border">
          <h4 className="text-sm font-medium mb-2">
            {t('company.techStack', 'Tecnologías')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {company.techStack.map((tech: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-primary-600/10 text-primary-600 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface InfoFieldProps {
  label: string;
  value: string;
  verified?: boolean;
  isLink?: boolean;
}

function InfoField({ label, value, verified, isLink }: InfoFieldProps) {
  const content = isLink ? (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary-600 hover:text-primary-700 transition-colors"
    >
      {value}
    </a>
  ) : (
    <span className="text-dark-text-primary">{value}</span>
  );

  return (
    <div>
      <p className="text-sm text-dark-text-secondary mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {content}
        {verified && (
          <CheckCircle2 className="w-3 h-3 text-green-500" />
        )}
      </div>
    </div>
  );
}