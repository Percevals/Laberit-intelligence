import { useCurrentWeekIntelligence } from '../hooks/useIntelligenceData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function SimpleDashboard() {
  const { data, isLoading, error } = useCurrentWeekIntelligence();

  if (isLoading) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#091F2C', color: 'white', minHeight: '100vh' }}>
        <h1>Cargando inteligencia...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#091F2C', color: 'white', minHeight: '100vh' }}>
        <h1>Error al cargar datos</h1>
        <p>{error instanceof Error ? error.message : 'Error desconocido'}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#091F2C', color: 'white', minHeight: '100vh' }}>
        <h1>No hay datos disponibles</h1>
        <p>No se encontraron datos de inteligencia para esta semana</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#091F2C', color: 'white', minHeight: '100vh' }}>
      <h1>Dashboard de Inmunidad Digital LATAM y España</h1>
      <p>Reporte Semanal DII 4.0 | {format(new Date(data.week_date), 'dd MMMM yyyy', { locale: es })}</p>
      
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'rgba(180, 181, 223, 0.1)', borderRadius: '8px' }}>
        <h2>Resumen Ejecutivo</h2>
        <p>Inmunidad Promedio: {data.week_summary.immunity_avg}</p>
        <p>Ataques esta semana: {data.week_summary.attacks_week}</p>
        <p>Principal amenaza: {data.week_summary.top_threat_type} ({data.week_summary.top_threat_pct})</p>
        <p>Víctimas con DII &lt; 4.0: {data.week_summary.victims_low_immunity_pct}</p>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'rgba(180, 181, 223, 0.1)', borderRadius: '8px' }}>
        <h2>Dimensiones DII</h2>
        <ul>
          <li>TRD: {data.dii_dimensions.TRD.value} ({data.dii_dimensions.TRD.trend})</li>
          <li>AER: {data.dii_dimensions.AER.value} ({data.dii_dimensions.AER.trend})</li>
          <li>HFP: {data.dii_dimensions.HFP.value} ({data.dii_dimensions.HFP.trend})</li>
          <li>BRI: {data.dii_dimensions.BRI.value} ({data.dii_dimensions.BRI.trend})</li>
          <li>RRG: {data.dii_dimensions.RRG.value} ({data.dii_dimensions.RRG.trend})</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ color: '#B4B5DF' }}>
          Nota: Esta es una versión simplificada del dashboard. Las visualizaciones de firma (ImmunityGauge y DimensionBalance) 
          están temporalmente deshabilitadas mientras se resuelven problemas técnicos.
        </p>
      </div>
    </div>
  );
}