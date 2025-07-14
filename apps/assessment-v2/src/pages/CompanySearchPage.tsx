import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Removed unused icons: ArrowRight, CheckCircle2, Edit2
import { CompanySearchInput } from '@features/company-search';
import { useAssessmentStore } from '@/store/assessment-store';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { AsyncErrorBoundary } from '@/components/ErrorBoundary';
import type { CompanyInfo } from '@services/ai/types';

export function CompanySearchPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    selectCompany,
    updateClassificationFromCompany,
    updateProgress
  } = useAssessmentStore();

  // Auto-navigate when company is selected  
  const handleCompanySelect = (company: CompanyInfo) => {
    selectCompany(company); // Store the selected company
    updateClassificationFromCompany(company); // Update classification data
    navigate('/assessment/confirm'); // Navigate immediately to confirmation page
  };

  // Update progress on mount
  React.useEffect(() => {
    updateProgress('company-search');
  }, [updateProgress]);

  const steps = [
    { label: t('steps.search', 'Búsqueda'), description: t('steps.searchDesc', 'Encuentra tu empresa') },
    { label: t('steps.confirm', 'Confirmar'), description: t('steps.confirmDesc', 'Verifica los datos') },
    { label: t('steps.discover', 'Descubrir'), description: t('steps.discoverDesc', 'Tu modelo de negocio') }
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
      <ProgressIndicator currentStep={1} steps={steps} />
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
              {t('companySearch.subtitle', 'Hagamos inteligencia con su información pública')}
            </p>
          </div>

          {/* Search Input */}
          <div className="card p-8">
            <AsyncErrorBoundary>
              <CompanySearchInput onSelect={handleCompanySelect} />
            </AsyncErrorBoundary>
            <p className="text-sm text-dark-text-secondary mt-4 text-center">
              {t('companySearch.privacy', 'Su información es confidencial y no será almacenada')}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Removed CompanyInfoDisplay and InfoField components as they're no longer needed
// Company details will be shown/edited on the confirmation page