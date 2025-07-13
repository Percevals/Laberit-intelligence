import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function QuestionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // TODO: Implement full assessment flow
  const businessModel = sessionStorage.getItem('businessModel');
  
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        <div className="card p-12">
          <h2 className="text-3xl font-light mb-4">
            {t('assessment.questions.title')}
          </h2>
          <p className="text-xl text-dark-text-secondary mb-8">
            Modelo de negocio: <span className="text-primary-600 font-bold">
              {businessModel ? t(`businessModels.names.${businessModel}`) : ''}
            </span>
          </p>
          <p className="text-dark-text-secondary mb-8">
            [Próximamente: Flujo completo de evaluación con preguntas dinámicas]
          </p>
          <button
            onClick={() => navigate('/assessment/results')}
            className="btn-primary"
          >
            Ver resultados de ejemplo →
          </button>
        </div>
      </div>
    </div>
  );
}