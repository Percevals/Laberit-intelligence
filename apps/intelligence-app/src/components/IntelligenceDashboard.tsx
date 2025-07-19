import { ImmunityGauge, DimensionBalance, getDimensionConfig } from '@dii/visualizations';
import { useCurrentWeekIntelligence } from '../hooks/useIntelligenceData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function IntelligenceDashboard() {
  const { data, isLoading, error } = useCurrentWeekIntelligence();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando inteligencia...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error al cargar datos</h2>
        <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="no-data-container">
        <h2>No hay datos disponibles</h2>
        <p>No se encontraron datos de inteligencia para esta semana</p>
      </div>
    );
  }

  // Convert data to visualization format
  const immunityScore = parseFloat(data.week_summary.immunity_avg);
  const dimensions = getDimensionConfig('es', 'simple');
  
  const dimensionValues = {
    trd: parseFloat(data.dii_dimensions.TRD.value) / 10, // Normalize to 1-10 scale
    aer: parseFloat(data.dii_dimensions.AER.value) / 10,
    bri: parseFloat(data.dii_dimensions.BRI.value) / 10,
    hfp: parseFloat(data.dii_dimensions.HFP.value) / 10,
    rrg: parseFloat(data.dii_dimensions.RRG.value)
  };

  return (
    <div className="intelligence-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Dashboard de Inmunidad Digital LATAM y España</h1>
        <p className="header-subtitle">
          Reporte Semanal DII 4.0 | {format(new Date(data.week_date), 'dd MMMM yyyy', { locale: es })}
        </p>
      </header>

      {/* DII Formula */}
      <section className="dii-formula-section">
        <div className="formula-text">DII = (TRD × AER) / (HFP × BRI × RRG)</div>
        <p className="formula-description">
          El DII es un innovador índice que mide su capacidad de prevención y resiliencia ante ciberataques 
          por medio de 5 indicadores relacionados con la digitalización de su modelo de negocio.
        </p>
      </section>

      {/* Executive Summary */}
      <section className="executive-summary">
        <h2>📊 Resumen Ejecutivo</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-number">{data.week_summary.immunity_avg}</div>
            <div className="summary-label">Inmunidad Promedio</div>
            <div className="summary-sublabel">Región LATAM + España</div>
          </div>
          <div className="summary-item">
            <div className="summary-number">{data.week_summary.top_threat_type}</div>
            <div className="summary-label">Principal Amenaza</div>
            <div className="summary-sublabel">{data.week_summary.top_threat_pct} esta semana</div>
          </div>
          <div className="summary-item">
            <div className="summary-number">{data.week_summary.attacks_week}</div>
            <div className="summary-label">Ataques Detectados</div>
            <div className="summary-sublabel">Esta semana</div>
          </div>
          <div className="summary-item">
            <div className="summary-number">{data.week_summary.victims_low_immunity_pct}</div>
            <div className="summary-label">Víctimas con DII {'<'} 4.0</div>
            <div className="summary-sublabel">En estadio frágil</div>
          </div>
        </div>
        {data.week_summary.key_insight && (
          <div className="key-insight">
            <p>{data.week_summary.key_insight}</p>
          </div>
        )}
      </section>

      {/* Signature Visualizations */}
      <section className="signature-visuals">
        <h2>🎯 Firma Visual de Inmunidad Digital</h2>
        <div className="visuals-grid">
          <div className="visual-container">
            <h3>Índice Global de Inmunidad</h3>
            <ImmunityGauge
              score={{
                current: immunityScore * 10, // Convert to 0-100 scale
                stage: getMaturityStage(immunityScore),
                trend: data.dii_dimensions.TRD.trend as any
              }}
              size="medium"
              showDetails={true}
            />
          </div>
          <div className="visual-container">
            <h3>Balance de las 5 Dimensiones DII</h3>
            <DimensionBalance
              dimensions={dimensions}
              values={dimensionValues}
              size="medium"
              locale="es"
              showMaturityLegend={false}
            />
          </div>
        </div>
      </section>

      {/* Business Models Analysis */}
      <section className="business-models">
        <h2>🏢 Análisis por Modelo de Negocio</h2>
        <div className="models-grid">
          {Object.entries(data.business_model_insights).map(([model, insight]) => (
            <div key={model} className={`model-card immunity-${getImmunityClass(insight.immunity_score)}`}>
              <div className="model-header">
                <h3>{model.replace(/_/g, ' ')}</h3>
                <span className="immunity-badge">DII {insight.immunity_score}</span>
              </div>
              <p className="vulnerability">{insight.vulnerability}</p>
              <p className="recommendation">{insight.recommendation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="incidents">
        <h2>🔥 Incidentes Relevantes</h2>
        <div className="incidents-timeline">
          {data.incidents.map((incident, index) => (
            <div key={index} className={`incident-card impact-${incident.impact.toLowerCase()}`}>
              <div className="incident-header">
                <h3>{incident.org_name} - {incident.sector}</h3>
                <span className="incident-date">{incident.date}</span>
              </div>
              <div className="incident-meta">
                <span>📍 {incident.country}</span>
                <span>🏢 {incident.business_model}</span>
                <span className="impact-badge">{incident.impact}</span>
              </div>
              <p className="incident-summary">{incident.summary}</p>
              <div className="business-lesson">
                💡 {incident.business_lesson}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="recommendations">
        <h2>💡 Recomendaciones Priorizadas</h2>
        <div className="recommendations-grid">
          {data.recommendations.map((rec, index) => (
            <div key={index} className={`recommendation-card priority-${rec.priority.toLowerCase()}`}>
              <div className="rec-header">
                <span className="priority">{rec.priority}</span>
                <h3>{rec.recommendation}</h3>
              </div>
              <div className="rec-models">
                Aplica a: {rec.business_models.join(', ')}
              </div>
              <div className="rec-impact">
                <strong>Impacto esperado:</strong> {rec.expected_impact}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Helper functions
function getMaturityStage(score: number): 'FRAGIL' | 'ROBUSTO' | 'RESILIENTE' | 'ADAPTATIVO' {
  if (score < 4) return 'FRAGIL';
  if (score < 6) return 'ROBUSTO';
  if (score < 8) return 'RESILIENTE';
  return 'ADAPTATIVO';
}

function getImmunityClass(score: number): string {
  if (score < 4) return 'fragil';
  if (score < 6) return 'robusto';
  if (score < 8) return 'resiliente';
  return 'adaptativo';
}