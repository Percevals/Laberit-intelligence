/**
 * Example usage of DimensionBalance component in different contexts
 * Shows how to leverage the flexible configuration pattern
 */

import React from 'react';
import { 
  DimensionBalance, 
  DimensionConfig,
  DIMENSION_LABELS,
  DIMENSION_DESCRIPTIONS,
  getDimensionConfig 
} from '@dii/visualizations';

// Example 1: Assessment V2 - Spanish Formal Names
export function AssessmentDimensionBalance({ assessmentData }: { assessmentData: any }) {
  // Using predefined formal Spanish labels
  const dimensions: DimensionConfig[] = Object.entries(DIMENSION_LABELS.es.formal).map(([key, label]) => ({
    key: key as 'trd' | 'aer' | 'bri' | 'hfp' | 'rrg',
    label,
    description: DIMENSION_DESCRIPTIONS.es[key as keyof typeof DIMENSION_DESCRIPTIONS.es]
  }));

  return (
    <div className="assessment-visualization">
      <h2>Evaluación de Inmunidad Digital</h2>
      <DimensionBalance
        dimensions={dimensions}
        values={assessmentData.dimensionScores}
        size="large"
        locale="es"
        showMaturityLegend={true}
        onHover={(dimension, stage) => {
          // Track user engagement with dimensions
          analytics.track('dimension_hover', { dimension, stage });
        }}
      />
    </div>
  );
}

// Example 2: Intelligence Dashboard - Simple Spanish Names
export function IntelligenceDashboard({ currentMetrics }: { currentMetrics: any }) {
  // Using helper function for simple configuration
  const dimensions = getDimensionConfig('es', 'simple');

  return (
    <div className="intelligence-widget">
      <DimensionBalance
        dimensions={dimensions}
        values={currentMetrics}
        size="medium"
        locale="es"
        showMaturityLegend={false} // Clean look for dashboard
        className="dashboard-balance"
      />
    </div>
  );
}

// Example 3: Executive Report - English Business Terms
export function ExecutiveReport({ quarterlyData }: { quarterlyData: any }) {
  const dimensions: DimensionConfig[] = [
    { key: 'trd', label: 'Operational Resilience' },
    { key: 'aer', label: 'Defense Economics' },
    { key: 'bri', label: 'Risk Exposure' },
    { key: 'hfp', label: 'Human Factor' },
    { key: 'rrg', label: 'Recovery Capability' }
  ];

  return (
    <div className="executive-summary">
      <h1>Digital Immunity Status</h1>
      <DimensionBalance
        dimensions={dimensions}
        values={quarterlyData.current}
        size="large"
        locale="en"
        ariaLabel="Quarterly digital immunity assessment showing operational resilience and risk factors"
      />
    </div>
  );
}

// Example 4: Technical Team Dashboard - Mixed Language
export function TechnicalDashboard({ systemMetrics }: { systemMetrics: any }) {
  const dimensions: DimensionConfig[] = [
    { 
      key: 'trd', 
      label: 'MTTR', 
      description: 'Mean Time To Recovery - Operational resilience metric'
    },
    { 
      key: 'aer', 
      label: 'Defense ROI', 
      description: 'Return on security investment'
    },
    { 
      key: 'bri', 
      label: 'BIA Score', 
      description: 'Business Impact Analysis vulnerability score'
    },
    { 
      key: 'hfp', 
      label: 'Human Risk', 
      description: 'Phishing susceptibility and training effectiveness'
    },
    { 
      key: 'rrg', 
      label: 'Recovery Gap', 
      description: 'Delta between RTO and actual recovery capability'
    }
  ];

  return (
    <DimensionBalance
      dimensions={dimensions}
      values={systemMetrics}
      size="small"
      locale="en"
    />
  );
}

// Example 5: Comparison View - Current vs Target
export function ComparisonView({ current, target }: { current: any; target: any }) {
  const dimensions = getDimensionConfig('es', 'simple');

  return (
    <div className="comparison-container">
      <div className="current-state">
        <h3>Estado Actual</h3>
        <DimensionBalance
          dimensions={dimensions}
          values={current}
          size="medium"
          showMaturityLegend={false}
        />
      </div>
      <div className="target-state">
        <h3>Objetivo 2025</h3>
        <DimensionBalance
          dimensions={dimensions.map(d => ({
            ...d,
            color: '#3b82f6' // Blue for targets
          }))}
          values={target}
          size="medium"
          showMaturityLegend={false}
        />
      </div>
    </div>
  );
}

// Example 6: Custom Implementation with Dynamic Labels
export function CustomImplementation() {
  const [language, setLanguage] = React.useState<'es' | 'en'>('es');
  const [style, setStyle] = React.useState('simple');

  // Dynamically get labels based on user preference
  const dimensions = React.useMemo(() => {
    const labels = DIMENSION_LABELS[language]?.[style as keyof typeof DIMENSION_LABELS.es] 
                   || DIMENSION_LABELS.es.simple;
    const descriptions = DIMENSION_DESCRIPTIONS[language] || DIMENSION_DESCRIPTIONS.es;

    return Object.entries(labels).map(([key, label]) => ({
      key: key as 'trd' | 'aer' | 'bri' | 'hfp' | 'rrg',
      label,
      description: descriptions[key as keyof typeof descriptions]
    }));
  }, [language, style]);

  const mockValues = {
    trd: 7.5,
    aer: 8.0,
    bri: 5.0,
    hfp: 6.0,
    rrg: 4.5
  };

  return (
    <div>
      <div className="controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}>
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value="simple">Simple</option>
          <option value="formal">Formal</option>
          <option value="technical">Technical</option>
        </select>
      </div>
      
      <DimensionBalance
        dimensions={dimensions}
        values={mockValues}
        locale={language}
      />
    </div>
  );
}

// Example 7: Mobile App Integration
export function MobileAppView({ companyData }: { companyData: any }) {
  // Ultra-compact for mobile
  const dimensions: DimensionConfig[] = [
    { key: 'trd', label: 'TRD' },
    { key: 'aer', label: 'AER' },
    { key: 'bri', label: 'BRI' },
    { key: 'hfp', label: 'HFP' },
    { key: 'rrg', label: 'RRG' }
  ];

  return (
    <DimensionBalance
      dimensions={dimensions}
      values={companyData.scores}
      size="small"
      showMaturityLegend={false}
      className="mobile-viz"
    />
  );
}