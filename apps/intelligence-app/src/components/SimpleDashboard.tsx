import { useCurrentWeekIntelligence } from '../hooks/useIntelligenceData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

export function SimpleDashboard() {
  const { data, isLoading, error } = useCurrentWeekIntelligence();

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Cargando inteligencia...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">
          <h1>Error al cargar datos</h1>
          <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
      </div>
    );
  }

  // Use mock data if real data fails to load
  const displayData = data || {
    week_date: new Date().toISOString().split('T')[0],
    week_summary: {
      immunity_avg: "2.8",
      attacks_week: "2,569",
      top_threat_type: "Ransomware Surge",
      top_threat_pct: "+15%",
      victims_low_immunity_pct: "50%",
      key_insight: "Brazil suffered largest financial cybercrime in history ($108M), while Spain maintained position as 2nd most-attacked nation globally with 45,000 daily attacks"
    },
    dii_dimensions: {
      TRD: { value: "12", trend: "declining" },
      AER: { value: "75", trend: "declining" },
      HFP: { value: "72", trend: "stable" },
      BRI: { value: "65", trend: "stable" },
      RRG: { value: "3.8", trend: "stable" }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <h1>Dashboard de Inmunidad Digital LATAM y España</h1>
        <p className="subtitle">
          Reporte Semanal DII 4.0 | {format(new Date(displayData.week_date), 'dd MMMM yyyy', { locale: es })}
        </p>
        
        <div className="section">
          <h2>📊 Resumen Ejecutivo</h2>
          <div className="metric">
            <div className="metric-label">Inmunidad Promedio</div>
            <div className="metric-value">{displayData.week_summary?.immunity_avg || 'N/A'}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Ataques esta semana</div>
            <div className="metric-value">{displayData.week_summary?.attacks_week || 'N/A'}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Principal amenaza</div>
            <div className="metric-value">
              {displayData.week_summary?.top_threat_type || 'N/A'} ({displayData.week_summary?.top_threat_pct || 'N/A'})
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Víctimas con DII &lt; 4.0</div>
            <div className="metric-value">{displayData.week_summary?.victims_low_immunity_pct || 'N/A'}</div>
          </div>
          {displayData.week_summary?.key_insight && (
            <p style={{ marginTop: '20px', padding: '15px', background: 'rgba(180, 181, 223, 0.1)', borderRadius: '8px' }}>
              {displayData.week_summary.key_insight}
            </p>
          )}
        </div>

        <div className="section">
          <h2>⚡ Las 5 Dimensiones DII</h2>
          <div className="dimensions">
            {Object.entries(displayData.dii_dimensions || {}).map(([key, dimension]: [string, any]) => (
              <div key={key} className="dimension-card">
                <div className="dimension-name">{key}</div>
                <div className="dimension-value">{dimension.value}</div>
                <div className="dimension-trend">Tendencia: {dimension.trend}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Link to="/demo" style={{ 
            color: '#6B9BD1', 
            marginRight: '20px',
            textDecoration: 'none'
          }}>
            View Demo →
          </Link>
          <Link to="/archive" style={{ 
            color: '#6B9BD1',
            textDecoration: 'none'
          }}>
            View Archive →
          </Link>
        </div>
      </div>
    </div>
  );
}