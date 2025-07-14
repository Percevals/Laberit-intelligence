import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '@/store/assessment-store';
import { ImmunityTimelineNavigation, type DIIDimension, type ImmunityDimensionState } from '@/components/ImmunityTimelineNavigation';
// import { DimensionConverterFactory } from '@packages/@dii/core/converters/dimension-converters';
// import { DIIBusinessModelClassifier } from '@core/business-model/dii-classifier';

export function ImmunityTimelinePage() {
  const navigate = useNavigate();
  const { 
    companySearch, 
    addScenarioResponse,
    getScenarioResponse
  } = useAssessmentStore();
  
  const businessModel = 'SOFTWARE_CRITICO'; // Default for demo

  // Initialize dimensions based on current assessment state
  const [dimensions, setDimensions] = useState<ImmunityDimensionState[]>(() => {
    const businessModelId = getBusinessModelId(businessModel);
    
    const trdResponse = getScenarioResponse('TRD');
    const aerResponse = getScenarioResponse('AER');
    const hfpResponse = getScenarioResponse('HFP');
    const briResponse = getScenarioResponse('BRI');
    const rrgResponse = getScenarioResponse('RRG');
    
    return [
      {
        dimension: 'TRD',
        status: trdResponse ? 'completed' : 'active',
        capturedValue: trdResponse ? formatTRDValue(trdResponse.metric?.hours || 0) : undefined,
        capturedScore: trdResponse ? convertToScore('TRD', trdResponse.metric?.hours || 0, businessModelId) : undefined,
        question: !trdResponse ? getTRDQuestion(companySearch.selectedCompany?.name) : undefined,
        responseOptions: !trdResponse ? getTRDOptions() : undefined
      },
      {
        dimension: 'AER',
        status: aerResponse ? 'completed' : 
                trdResponse ? 'active' : 'upcoming',
        capturedValue: aerResponse ? formatAERValue(aerResponse.response || 0) : undefined,
        capturedScore: aerResponse ? convertToScore('AER', aerResponse.response || 0, businessModelId) : undefined,
        question: !aerResponse && trdResponse ? getAERQuestion(companySearch.selectedCompany?.name) : undefined,
        responseOptions: !aerResponse && trdResponse ? getAEROptions() : undefined
      },
      {
        dimension: 'HFP',
        status: hfpResponse ? 'completed' : 
                (trdResponse && aerResponse) ? 'active' : 'upcoming',
        capturedValue: hfpResponse ? formatHFPValue(hfpResponse.metric?.percentage || 0) : undefined,
        capturedScore: hfpResponse ? convertToScore('HFP', hfpResponse.metric?.percentage || 0, businessModelId) : undefined,
        question: !hfpResponse && trdResponse && aerResponse ? getHFPQuestion() : undefined,
        responseOptions: !hfpResponse && trdResponse && aerResponse ? getHFPOptions() : undefined
      },
      {
        dimension: 'BRI',
        status: briResponse ? 'completed' : 
                (trdResponse && aerResponse && hfpResponse) ? 'active' : 'upcoming',
        capturedValue: briResponse ? formatBRIValue(briResponse.metric?.percentage || 0) : undefined,
        capturedScore: briResponse ? convertToScore('BRI', briResponse.metric?.percentage || 0, businessModelId) : undefined,
        question: !briResponse && trdResponse && aerResponse && hfpResponse ? getBRIQuestion() : undefined,
        responseOptions: !briResponse && trdResponse && aerResponse && hfpResponse ? getBRIOptions() : undefined
      },
      {
        dimension: 'RRG',
        status: rrgResponse ? 'completed' : 
                (trdResponse && aerResponse && hfpResponse && briResponse) ? 'active' : 'upcoming',
        capturedValue: rrgResponse ? formatRRGValue(rrgResponse.metric?.multiplier || 0) : undefined,
        capturedScore: rrgResponse ? convertToScore('RRG', rrgResponse.metric?.multiplier || 0, businessModelId) : undefined,
        question: !rrgResponse && trdResponse && aerResponse && hfpResponse && briResponse ? getRRGQuestion() : undefined,
        responseOptions: !rrgResponse && trdResponse && aerResponse && hfpResponse && briResponse ? getRRGOptions() : undefined
      }
    ];
  });

  const handleDimensionSelect = (dimension: DIIDimension) => {
    // Allow users to navigate to upcoming dimensions
    setDimensions(prev => prev.map(d => {
      if (d.dimension === dimension && d.status === 'upcoming') {
        return {
          ...d,
          status: 'active',
          question: getQuestionForDimension(dimension),
          responseOptions: getOptionsForDimension(dimension)
        };
      }
      return d;
    }));
  };

  const handleResponseSelect = (dimension: DIIDimension, responseValue: number) => {
    const businessModelId = getBusinessModelId(businessModel);
    
    // Convert response to actual metric value
    const metricValue = convertResponseToMetric(dimension, responseValue);
    
    // Store in assessment store
    const question = getQuestionForDimension(dimension);
    const metric = getMetricForDimension(dimension, metricValue);
    addScenarioResponse(dimension, question, responseValue, metric);
    
    // Update dimensions state
    setDimensions(prev => prev.map((d, index) => {
      if (d.dimension === dimension) {
        // Mark current as completed
        const completed: ImmunityDimensionState = {
          ...d,
          status: 'completed' as const,
          capturedValue: formatValue(dimension, metricValue),
          capturedScore: convertToScore(dimension, metricValue, businessModelId),
          question: undefined,
          responseOptions: undefined
        };

        // Activate next dimension if exists and not already completed
        const nextIndex = index + 1;
        if (nextIndex < prev.length && prev[nextIndex]?.status === 'upcoming') {
          setTimeout(() => {
            setDimensions(current => current.map((dim, i) => {
              if (i === nextIndex) {
                return {
                  ...dim,
                  status: 'active' as const,
                  question: getQuestionForDimension(dim.dimension),
                  responseOptions: getOptionsForDimension(dim.dimension)
                };
              }
              return dim;
            }));
          }, 500);
        }

        return completed;
      }
      return d;
    }));

    // Check if assessment is complete
    const allCompleted = dimensions.every(d => 
      d.dimension === dimension || getScenarioResponse(d.dimension) !== undefined
    );
    
    if (allCompleted) {
      setTimeout(() => {
        navigate('/assessment/results');
      }, 1500);
    }
  };

  // Check if user has valid company/business model
  if (!companySearch.selectedCompany || !businessModel) {
    navigate('/assessment/company');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ImmunityTimelineNavigation
        dimensions={dimensions}
        onDimensionSelect={handleDimensionSelect}
        onResponseSelect={handleResponseSelect}
      />
    </div>
  );
}

// Helper functions
function getBusinessModelId(model: string | null): number {
  const mapping: Record<string, number> = {
    'COMERCIO_HIBRIDO': 1,
    'SOFTWARE_CRITICO': 2,
    'SERVICIOS_DATOS': 3,
    'ECOSISTEMA_DIGITAL': 4,
    'SERVICIOS_FINANCIEROS': 5,
    'INFRAESTRUCTURA_HEREDADA': 6,
    'CADENA_SUMINISTRO': 7,
    'INFORMACION_REGULADA': 8
  };
  return mapping[model || 'COMERCIO_HIBRIDO'] || 1;
}

function convertToScore(_dimension: DIIDimension, value: number, _businessModelId: number): number {
  // Simplified scoring for demo - would use DimensionConverterFactory in production
  const baseScore = Math.max(1, Math.min(10, value));
  return baseScore;
}

function getMetricForDimension(dimension: DIIDimension, value: number) {
  switch (dimension) {
    case 'TRD':
      return { hours: value };
    case 'AER':
      return { ratio: value };
    case 'HFP':
      return { percentage: value };
    case 'BRI':
      return { percentage: value };
    case 'RRG':
      return { multiplier: value };
    default:
      return {};
  }
}

function convertResponseToMetric(dimension: DIIDimension, responseValue: number): number {
  // Convert 1-5 response to actual metric values
  const conversionTables = {
    TRD: [1, 4, 12, 48, 96], // hours
    AER: [2000000, 500000, 150000, 40000, 8000], // dollars
    HFP: [60, 35, 20, 10, 3], // percentage
    BRI: [85, 65, 45, 25, 15], // percentage
    RRG: [6, 3.5, 2.2, 1.6, 1.1] // multiplier
  };
  
  return conversionTables[dimension][responseValue - 1] || 0;
}

function formatValue(dimension: DIIDimension, value: number): string {
  switch (dimension) {
    case 'TRD':
      return value < 24 ? `${value} hours` : `${Math.round(value / 24)} days`;
    case 'AER':
      return value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M potential` : `$${Math.round(value / 1000)}K potential`;
    case 'HFP':
      return `${value}% susceptibility`;
    case 'BRI':
      return `${value}% exposure`;
    case 'RRG':
      return `${value}x recovery gap`;
    default:
      return String(value);
  }
}

function formatTRDValue(value: number): string {
  return formatValue('TRD', value);
}

function formatAERValue(value: number): string {
  return formatValue('AER', value);
}

function formatHFPValue(value: number): string {
  return formatValue('HFP', value);
}

function formatBRIValue(value: number): string {
  return formatValue('BRI', value);
}

function formatRRGValue(value: number): string {
  return formatValue('RRG', value);
}

function getTRDQuestion(companyName?: string): string {
  return `If ${companyName || 'your company'}'s core revenue-generating systems went down, how long before you lose 10% of expected revenue?`;
}

function getAERQuestion(companyName?: string): string {
  return `What is the total potential value an attacker could extract from ${companyName || 'your'} systems and data?`;
}

function getHFPQuestion(): string {
  return 'In your last phishing simulation, what percentage of employees fell for the attack?';
}

function getBRIQuestion(): string {
  return 'If an attacker compromises one system, what percentage of your other systems could they potentially access?';
}

function getRRGQuestion(): string {
  return 'When you last tested recovery procedures, how did actual time compare to your documented plans?';
}

function getQuestionForDimension(dimension: DIIDimension): string {
  switch (dimension) {
    case 'TRD': return getTRDQuestion();
    case 'AER': return getAERQuestion();
    case 'HFP': return getHFPQuestion();
    case 'BRI': return getBRIQuestion();
    case 'RRG': return getRRGQuestion();
  }
}

function getTRDOptions() {
  return [
    { value: 1, label: 'Less than 2 hours', interpretation: 'Critical revenue dependency - immediate impact' },
    { value: 2, label: '2-6 hours', interpretation: 'High vulnerability - short resilience window' },
    { value: 3, label: '6-24 hours', interpretation: 'Moderate buffer - can handle short disruptions' },
    { value: 4, label: '1-3 days', interpretation: 'Good resilience - multiple revenue streams' },
    { value: 5, label: 'More than 3 days', interpretation: 'Excellent diversification - strong immunity' }
  ];
}

function getAEROptions() {
  return [
    { value: 1, label: 'Over $1M potential', interpretation: 'Prime target - maximum attacker interest' },
    { value: 2, label: '$200K - $1M value', interpretation: 'High-value target - sophisticated attacks likely' },
    { value: 3, label: '$50K - $200K potential', interpretation: 'Moderate target - opportunistic attacks' },
    { value: 4, label: '$10K - $50K value', interpretation: 'Low priority - commodity attacks only' },
    { value: 5, label: 'Under $10K minimal', interpretation: 'Unattractive target - strong economic immunity' }
  ];
}

function getHFPOptions() {
  return [
    { value: 1, label: 'Over 50% fell for it', interpretation: 'Critical human vulnerability - primary attack vector' },
    { value: 2, label: '30-50% susceptible', interpretation: 'High risk - significant training needed' },
    { value: 3, label: '15-30% average rate', interpretation: 'Moderate awareness - room for improvement' },
    { value: 4, label: '5-15% good awareness', interpretation: 'Strong culture - above average immunity' },
    { value: 5, label: 'Under 5% excellent', interpretation: 'Exceptional security culture - human firewall' }
  ];
}

function getBRIOptions() {
  return [
    { value: 1, label: '80-100% accessible', interpretation: 'No containment - complete compromise likely' },
    { value: 2, label: '60-80% exposure', interpretation: 'Poor isolation - major breach potential' },
    { value: 3, label: '40-60% limited', interpretation: 'Moderate segmentation - some containment' },
    { value: 4, label: '20-40% well-isolated', interpretation: 'Good boundaries - effective containment' },
    { value: 5, label: 'Under 20% segmented', interpretation: 'Excellent isolation - breach immunity' }
  ];
}

function getRRGOptions() {
  return [
    { value: 1, label: 'Over 5x longer', interpretation: 'No real recovery - plans are theoretical' },
    { value: 2, label: '3-5x multiplier', interpretation: 'Major gap - unrealistic expectations' },
    { value: 3, label: '2-3x actual time', interpretation: 'Moderate gap - some planning issues' },
    { value: 4, label: '1.5-2x minor delays', interpretation: 'Minor gap - generally reliable' },
    { value: 5, label: 'Meets planned time', interpretation: 'Proven recovery - regenerative immunity' }
  ];
}

function getOptionsForDimension(dimension: DIIDimension) {
  switch (dimension) {
    case 'TRD': return getTRDOptions();
    case 'AER': return getAEROptions();
    case 'HFP': return getHFPOptions();
    case 'BRI': return getBRIOptions();
    case 'RRG': return getRRGOptions();
  }
}