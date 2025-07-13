import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DIIGauge } from '@ui/components/DIIGauge';
import type { Score } from '@core/types/dii.types';

export function ResultsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Demo data - replace with actual calculation
  const demoScore = 72 as Score;
  const demoStage = 'RESILIENTE' as const;
  
  return (
    <div className="min-h-screen bg-dark-bg p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-light mb-4">
            {t('assessment.results.title')}
          </h1>
          <p className="text-xl text-dark-text-secondary">
            {t('assessment.results.betterThan', { percentage: 85 })}
          </p>
        </div>
        
        {/* Main Score Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="card p-8 flex items-center justify-center">
            <DIIGauge 
              score={demoScore} 
              stage={demoStage}
              size="large"
              animated
              showLabels
            />
          </div>
          
          <div className="card p-8">
            <h2 className="text-2xl mb-6">{t('assessment.results.stage')}: {demoStage}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-dark-text-secondary mb-1">
                  {t('assessment.results.operationalRisk')}
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-dark-surface rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-yellow-500 to-orange-500" />
                  </div>
                  <span className="text-sm font-bold text-orange-500">MEDIO</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-dark-text-secondary mb-1">
                  {t('assessment.results.estimatedDowntime')}
                </p>
                <p className="text-2xl font-bold text-primary-600">24-48 horas</p>
              </div>
              
              <div>
                <p className="text-sm text-dark-text-secondary mb-1">
                  {t('assessment.results.revenueAtRisk')}
                </p>
                <p className="text-2xl font-bold text-primary-600">15-25%</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            {t('common.back')}
          </button>
          <button className="btn-primary">
            {t('report.downloadPDF')}
          </button>
        </div>
      </div>
    </div>
  );
}