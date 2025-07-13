import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { cn } from '@shared/utils/cn';
import { useAssessmentStore } from '@/store/assessment-store';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  return (
    <button
      onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')}
      className="text-sm text-dark-text-secondary hover:text-dark-text-primary transition-colors"
    >
      {i18n.language === 'es' ? 'EN' : 'ES'}
    </button>
  );
}

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reset } = useAssessmentStore();
  
  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      fragil: '#DC2626',
      robusto: '#F59E0B',
      resiliente: '#10B981',
      adaptativo: '#3B82F6',
    };
    return colors[stage] || '#666';
  };
  
  const businessModels = [
    { key: 'subscription', color: 'text-primary-600' },
    { key: 'transaction', color: 'text-primary-500' },
    { key: 'assetLight', color: 'text-primary-400' },
    { key: 'assetHeavy', color: 'text-primary-700' },
    { key: 'dataDrivern', color: 'text-primary-600' },
    { key: 'platform', color: 'text-primary-500' },
    { key: 'directConsumer', color: 'text-primary-400' },
    { key: 'b2bEnterprise', color: 'text-primary-700' },
  ];
  
  const maturityStages = ['fragil', 'robusto', 'resiliente', 'adaptativo'];
  
  const startAssessment = () => {
    reset(); // Clear any previous assessment data
    navigate('/assessment/company');
  };
  
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-surface/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700" />
              <div>
                <h1 className="text-xl font-bold">DII Assessment Platform</h1>
                <p className="text-sm text-dark-text-secondary">Business Model Reality Check</p>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-dark-text-secondary hover:text-dark-text-primary transition-colors">
                {t('nav.about')}
              </a>
              <a href="#" className="text-dark-text-secondary hover:text-dark-text-primary transition-colors">
                {t('nav.intelligence')}
              </a>
              <LanguageSwitcher />
              <button onClick={startAssessment} className="btn-primary">
                {t('nav.startAssessment')}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-5xl font-light">
              {t('hero.title')} <span className="font-bold text-gradient">{t('hero.titleHighlight')}</span>
              <br />
              {t('hero.subtitle')}
            </h2>
            <p className="mb-8 text-xl text-dark-text-secondary">
              {t('hero.description')}
            </p>
            
            {/* Key metrics */}
            <div className="mb-12 grid grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="mb-2 text-3xl font-bold text-primary-600">8</div>
                <p className="text-sm text-dark-text-secondary">{t('metrics.businessModels')}</p>
              </div>
              <div className="card text-center">
                <div className="mb-2 text-3xl font-bold text-primary-600">150+</div>
                <p className="text-sm text-dark-text-secondary">{t('metrics.assessments')}</p>
              </div>
              <div className="card text-center">
                <div className="mb-2 text-3xl font-bold text-primary-600">95%</div>
                <p className="text-sm text-dark-text-secondary">{t('metrics.accuracy')}</p>
              </div>
            </div>
            
            {/* CTA */}
            <button onClick={startAssessment} className="btn-primary text-lg px-8 py-4">
              {t('hero.cta')}
            </button>
          </div>
        </div>
      </section>

      {/* Business Models Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="mb-8 text-center text-3xl font-light">
            {t('businessModels.title')}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {businessModels.map((model, i) => (
              <div
                key={i}
                onClick={() => {
                  reset();
                  navigate('/assessment/company');
                }}
                className={cn(
                  'card-interactive text-center cursor-pointer',
                  'hover:border-primary-600/50 hover:scale-105 transition-transform'
                )}
              >
                <div className={cn('mb-2 text-2xl font-bold', model.color)}>
                  {i + 1}
                </div>
                <p className="text-sm">{t(`businessModels.${model.key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maturity Stages */}
      <section className="border-t border-dark-border py-16">
        <div className="container mx-auto px-4">
          <h3 className="mb-8 text-center text-3xl font-light">
            {t('maturityStages.title')}
          </h3>
          
          <div className="grid gap-6 md:grid-cols-4">
            {maturityStages.map((stage) => (
              <div key={stage} className="card" style={{ borderColor: `${getStageColor(stage)}30` }}>
                <h4 className="mb-2 text-xl font-bold" style={{ color: getStageColor(stage) }}>
                  {t(`maturityStages.${stage}.name`)}
                </h4>
                <p className="text-sm text-dark-text-secondary">
                  {t(`maturityStages.${stage}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}