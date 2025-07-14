/**
 * Immunity Results Page
 * Complete immunity profile results with what-if scenarios
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAssessmentStore } from '@/store/assessment-store';
import { useDIIDimensionsStore } from '@/store/dii-dimensions-store';
import { AssessmentCompletion, DIIWhatIfScenarios } from '@/components';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

export function ImmunityResultsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { 
    companySearch,
    results,
    updateProgress
  } = useAssessmentStore();

  const {
    dimensions
  } = useDIIDimensionsStore();

  useEffect(() => {
    updateProgress('results');
  }, [updateProgress]);

  useEffect(() => {
    // Redirect if no assessment data
    if (!companySearch.selectedCompany || !results.diiScore || Object.keys(dimensions).length < 5) {
      navigate('/assessment/company');
    }
  }, [companySearch.selectedCompany, results.diiScore, dimensions, navigate]);

  const handleExploreScenarios = () => {
    // Scroll to scenarios section
    const scenariosElement = document.getElementById('what-if-scenarios');
    if (scenariosElement) {
      scenariosElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetDetailedAnalysis = () => {
    // Navigate to premium features or external link
    console.log('Navigate to detailed analysis');
    // You can implement navigation to a premium signup page or external service
  };

  const handleStartNew = () => {
    // Clear all state and start fresh
    useAssessmentStore.getState().reset();
    useDIIDimensionsStore.getState().reset();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-surface border-b border-dark-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/assessment/questions')}
              className="flex items-center gap-2 text-dark-text-secondary hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('common.back', 'Atrás')}
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-medium text-dark-text">
                {companySearch.selectedCompany?.name}
              </h1>
              <p className="text-sm text-dark-text-secondary">
                {t('results.immunityProfile', 'Perfil de Inmunidad Digital')}
              </p>
            </div>
            
            <button
              onClick={handleStartNew}
              className="flex items-center gap-2 text-dark-text-secondary hover:text-primary-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              {t('common.newAssessment', 'Nueva')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <AssessmentCompletion
          onExploreScenarios={handleExploreScenarios}
          onGetDetailedAnalysis={handleGetDetailedAnalysis}
        />
      </motion.div>

      {/* What-If Scenarios Section */}
      <motion.div
        id="what-if-scenarios"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-dark-surface border-t border-dark-border mt-16"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <DIIWhatIfScenarios />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Footer Actions */}
      <div className="bg-dark-bg border-t border-dark-border">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-dark-text-secondary">
              {t('results.sharePrompt', 'Comparte estos resultados con tu equipo para comenzar a mejorar tu inmunidad digital')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-dark-surface text-dark-text rounded-lg hover:bg-dark-hover transition-colors"
              >
                {t('results.print', 'Imprimir Reporte')}
              </button>
              <button
                onClick={handleGetDetailedAnalysis}
                className="px-6 py-3 btn-primary"
              >
                {t('results.getFullAnalysis', 'Obtener Análisis Completo')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}