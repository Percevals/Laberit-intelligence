import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Cpu } from 'lucide-react';
import { BusinessModelClassifier } from '@core/business-model/classifier';
import type { ClassificationAnswers } from '@core/types/business-model.types';
import { useAssessmentStore } from '@/store/assessment-store';
import { cn } from '@shared/utils/cn';

export function ClassificationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { classification, setBusinessModel, setClassificationAnswer } = useAssessmentStore();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Partial<ClassificationAnswers>>(classification.answers || {});
  
  const revenueOptions = [
    { value: 'recurring_subscriptions', icon: '🔄', translationKey: 'recurring' },
    { value: 'per_transaction', icon: '💳', translationKey: 'transaction' },
    { value: 'project_based', icon: '📋', translationKey: 'project' },
    { value: 'product_sales', icon: '📦', translationKey: 'product' },
    { value: 'data_monetization', icon: '📊', translationKey: 'data' },
    { value: 'platform_fees', icon: '🏛️', translationKey: 'platform' },
    { value: 'direct_sales', icon: '🛒', translationKey: 'direct' },
    { value: 'enterprise_contracts', icon: '🏢', translationKey: 'enterprise' },
  ] as const;
  
  const dependencyOptions = [
    { value: 'fully_digital', icon: <Cpu className="w-6 h-6" />, color: 'text-primary-500', translationKey: 'digital' },
    { value: 'hybrid_model', icon: '🔀', color: 'text-primary-600', translationKey: 'hybrid' },
    { value: 'physical_critical', icon: <Building2 className="w-6 h-6" />, color: 'text-primary-700', translationKey: 'physical' },
  ] as const;
  
  const handleRevenueSelect = (value: ClassificationAnswers['revenueModel']) => {
    setAnswers({ ...answers, revenueModel: value });
    setCurrentQuestion(2);
  };
  
  const handleDependencySelect = (value: ClassificationAnswers['operationalDependency']) => {
    const completeAnswers: ClassificationAnswers = {
      revenueModel: answers.revenueModel!,
      operationalDependency: value,
    };
    
    // Classify the business model
    const classification = BusinessModelClassifier.classify(completeAnswers);
    
    // Store in state
    setBusinessModel(classification.model);
    setClassificationAnswer('revenueModel', completeAnswers.revenueModel);
    setClassificationAnswer('operationalDependency', completeAnswers.operationalDependency);
    
    // Navigate to assessment questions
    navigate('/assessment/questions');
  };
  
  const goBack = () => {
    if (currentQuestion === 2) {
      setCurrentQuestion(1);
    } else {
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={goBack}
              className="text-dark-text-secondary hover:text-dark-text-primary transition-colors"
            >
              ← {t('common.back')}
            </button>
            <span className="text-sm text-dark-text-secondary">
              {currentQuestion} / 2
            </span>
          </div>
          <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-600 to-primary-700"
              initial={{ width: '0%' }}
              animate={{ width: `${currentQuestion * 50}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        {/* Question 1: Revenue Model */}
        {currentQuestion === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-4">
                {t('assessment.classification.title')}
              </h2>
              <p className="text-xl text-dark-text-secondary">
                {t('assessment.classification.subtitle')}
              </p>
            </div>
            
            <div className="card p-8">
              <h3 className="text-2xl mb-8">{t('assessment.classification.q1.label')}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {revenueOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleRevenueSelect(option.value)}
                    className={cn(
                      'card-interactive p-6 text-left',
                      'hover:border-primary-600 hover:bg-primary-600/5',
                      'transition-all duration-200'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.icon}</span>
                      <span className="text-lg">
                        {t(`assessment.classification.q1.options.${option.translationKey}`)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Question 2: Operational Dependency */}
        {currentQuestion === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light mb-4">
                {t('assessment.classification.title')}
              </h2>
              <p className="text-xl text-dark-text-secondary">
                {t('assessment.classification.subtitle')}
              </p>
            </div>
            
            <div className="card p-8">
              <h3 className="text-2xl mb-8">{t('assessment.classification.q2.label')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dependencyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleDependencySelect(option.value)}
                    className={cn(
                      'card-interactive p-8 text-center',
                      'hover:border-primary-600 hover:bg-primary-600/5',
                      'transition-all duration-200 group'
                    )}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className={cn('text-4xl', option.color)}>
                        {option.icon}
                      </div>
                      <span className="text-lg">
                        {t(`assessment.classification.q2.options.${option.translationKey}`)}
                      </span>
                      <ArrowRight className="w-5 h-5 text-dark-text-secondary group-hover:text-primary-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}