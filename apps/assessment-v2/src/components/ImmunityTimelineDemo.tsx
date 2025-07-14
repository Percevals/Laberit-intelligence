import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImmunityTimelineNavigation, type DIIDimension, type ImmunityDimensionState } from './ImmunityTimelineNavigation';
import { Play } from 'lucide-react';

// Sample response options for each dimension
const responseOptions = {
  TRD: [
    { value: 1, label: 'Less than 2 hours', interpretation: 'Critical - Immediate revenue impact expected' },
    { value: 2, label: '2-6 hours', interpretation: 'Vulnerable - Revenue degradation likely within hours' },
    { value: 3, label: '6-24 hours', interpretation: 'Moderate - Can sustain short-term disruptions' },
    { value: 4, label: '1-3 days', interpretation: 'Resilient - Good tolerance for operational issues' },
    { value: 5, label: 'More than 3 days', interpretation: 'Exceptional - Can maintain revenue through extended disruptions' }
  ],
  AER: [
    { value: 1, label: 'Over $1M potential value', interpretation: 'Prime Target - Extremely attractive to attackers' },
    { value: 2, label: '$200K - $1M attack value', interpretation: 'High Value - Regular target for sophisticated attacks' },
    { value: 3, label: '$50K - $200K potential', interpretation: 'Moderate Target - Opportunistic attacks likely' },
    { value: 4, label: '$10K - $50K limited value', interpretation: 'Low Interest - Commodity attacks only' },
    { value: 5, label: 'Under $10K minimal value', interpretation: 'Unattractive - Not economically viable for most attackers' }
  ],
  HFP: [
    { value: 1, label: 'Over 50% failure rate', interpretation: 'Critical - Humans are primary vulnerability' },
    { value: 2, label: '30-50% susceptible', interpretation: 'Poor - Significant social engineering risk' },
    { value: 3, label: '15-30% average rate', interpretation: 'Average - Standard human factor risk' },
    { value: 4, label: '5-15% good awareness', interpretation: 'Good - Above average security awareness' },
    { value: 5, label: 'Under 5% excellent culture', interpretation: 'Excellent - Strong security culture established' }
  ],
  BRI: [
    { value: 1, label: '80-100% systems accessible', interpretation: 'No Isolation - Complete network compromise likely' },
    { value: 2, label: '60-80% lateral movement', interpretation: 'Poor Isolation - Major systems at risk from single breach' },
    { value: 3, label: '40-60% limited segmentation', interpretation: 'Limited Isolation - Moderate containment capability' },
    { value: 4, label: '20-40% good boundaries', interpretation: 'Good Isolation - Can limit blast radius effectively' },
    { value: 5, label: 'Under 20% well-segmented', interpretation: 'Well Segmented - Excellent breach containment' }
  ],
  RRG: [
    { value: 1, label: 'Over 5x longer than planned', interpretation: 'No Real Recovery - Plans are theoretical only' },
    { value: 2, label: '3-5x recovery multiplier', interpretation: 'Major Gap - Recovery takes much longer than planned' },
    { value: 3, label: '2-3x actual vs planned', interpretation: 'Moderate Gap - Some deviation from recovery plans' },
    { value: 4, label: '1.5-2x minor delays', interpretation: 'Minor Gap - Generally meets recovery objectives' },
    { value: 5, label: 'Meets planned timelines', interpretation: 'Meets Plan - Reliable and tested recovery capability' }
  ]
};

// Different demo scenarios
const demoScenarios = {
  empty: {
    name: 'Fresh Start',
    description: 'Beginning the immunity assessment journey',
    dimensions: [
      { 
        dimension: 'TRD' as DIIDimension, 
        status: 'active' as const, 
        question: 'If your core revenue-generating systems went down, how long before you lose 10% of expected revenue?',
        responseOptions: responseOptions.TRD
      },
      { dimension: 'AER' as DIIDimension, status: 'upcoming' as const },
      { dimension: 'HFP' as DIIDimension, status: 'upcoming' as const },
      { dimension: 'BRI' as DIIDimension, status: 'upcoming' as const },
      { dimension: 'RRG' as DIIDimension, status: 'upcoming' as const }
    ]
  },
  partial: {
    name: 'Mid-Journey',
    description: 'Building immunity understanding progressively',
    dimensions: [
      { 
        dimension: 'TRD' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '6 hours',
        capturedScore: 6.0
      },
      { 
        dimension: 'AER' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '$150K potential extraction',
        capturedScore: 5.0
      },
      { 
        dimension: 'HFP' as DIIDimension, 
        status: 'active' as const, 
        question: 'In your last phishing simulation, what percentage of employees fell for the attack?',
        responseOptions: responseOptions.HFP
      },
      { dimension: 'BRI' as DIIDimension, status: 'upcoming' as const },
      { dimension: 'RRG' as DIIDimension, status: 'upcoming' as const }
    ]
  },
  nearComplete: {
    name: 'Almost There',
    description: 'Nearly complete immunity profile',
    dimensions: [
      { 
        dimension: 'TRD' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '4 hours',
        capturedScore: 4.0
      },
      { 
        dimension: 'AER' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '$500K high-value target',
        capturedScore: 3.0
      },
      { 
        dimension: 'HFP' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '15% phishing susceptibility',
        capturedScore: 7.0
      },
      { 
        dimension: 'BRI' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '30% system exposure',
        capturedScore: 6.5
      },
      { 
        dimension: 'RRG' as DIIDimension, 
        status: 'active' as const, 
        question: 'When you last tested recovery procedures, how did actual time compare to your documented plans?',
        responseOptions: responseOptions.RRG
      }
    ]
  },
  complete: {
    name: 'Full Profile',
    description: 'Complete immunity assessment',
    dimensions: [
      { 
        dimension: 'TRD' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '8 hours',
        capturedScore: 8.0
      },
      { 
        dimension: 'AER' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '$75K moderate target',
        capturedScore: 7.0
      },
      { 
        dimension: 'HFP' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '8% excellent awareness',
        capturedScore: 8.5
      },
      { 
        dimension: 'BRI' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '25% well-contained',
        capturedScore: 8.0
      },
      { 
        dimension: 'RRG' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '1.3x meets plan',
        capturedScore: 9.0
      }
    ]
  },
  vulnerable: {
    name: 'High Risk Profile',
    description: 'Organization with significant vulnerabilities',
    dimensions: [
      { 
        dimension: 'TRD' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '1 hour',
        capturedScore: 2.0
      },
      { 
        dimension: 'AER' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '$2M prime target',
        capturedScore: 1.5
      },
      { 
        dimension: 'HFP' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '60% high susceptibility',
        capturedScore: 1.5
      },
      { 
        dimension: 'BRI' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '85% full exposure',
        capturedScore: 1.0
      },
      { 
        dimension: 'RRG' as DIIDimension, 
        status: 'completed' as const, 
        capturedValue: '8x theoretical plans',
        capturedScore: 1.5
      }
    ]
  }
};

export function ImmunityTimelineDemo() {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof demoScenarios>('empty');
  const [dimensions, setDimensions] = useState<ImmunityDimensionState[]>(
    demoScenarios.empty.dimensions.map(d => ({
      ...d,
      responseOptions: d.status === 'active' ? responseOptions[d.dimension] : undefined
    }))
  );

  const loadScenario = (scenarioKey: keyof typeof demoScenarios) => {
    setSelectedScenario(scenarioKey);
    const scenario = demoScenarios[scenarioKey];
    setDimensions(scenario.dimensions.map(d => ({
      ...d,
      responseOptions: d.status === 'active' ? responseOptions[d.dimension] : undefined
    })));
  };

  const handleDimensionSelect = (dimension: DIIDimension) => {
    setDimensions(prev => prev.map(d => {
      if (d.dimension === dimension && d.status === 'upcoming') {
        return {
          ...d,
          status: 'active' as const,
          question: getQuestionForDimension(dimension),
          responseOptions: responseOptions[dimension]
        };
      }
      return d;
    }));
  };

  const handleResponseSelect = (dimension: DIIDimension, value: number) => {
    const option = responseOptions[dimension].find(opt => opt.value === value);
    if (!option) return;

    setDimensions(prev => prev.map((d, index) => {
      if (d.dimension === dimension) {
        // Mark current as completed
        const completed: ImmunityDimensionState = {
          ...d,
          status: 'completed' as const,
          capturedValue: option.label,
          capturedScore: value * 2, // Simple scoring for demo
          question: undefined,
          responseOptions: undefined
        };

        // Activate next dimension if exists
        const nextIndex = index + 1;
        if (nextIndex < prev.length && prev[nextIndex]?.status === 'upcoming') {
          setTimeout(() => {
            setDimensions(current => current.map((dim, i) => {
              if (i === nextIndex) {
                return {
                  ...dim,
                  status: 'active' as const,
                  question: getQuestionForDimension(dim.dimension),
                  responseOptions: responseOptions[dim.dimension]
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
  };

  const getQuestionForDimension = (dimension: DIIDimension): string => {
    const questions = {
      TRD: 'If your core revenue-generating systems went down, how long before you lose 10% of expected revenue?',
      AER: 'What is the total potential value an attacker could extract from your systems and data?',
      HFP: 'In your last phishing simulation, what percentage of employees fell for the attack?',
      BRI: 'If an attacker compromises one system, what percentage of your other systems could they access?',
      RRG: 'When you last tested recovery procedures, how did actual time compare to your documented plans?'
    };
    return questions[dimension];
  };

  const currentScenario = demoScenarios[selectedScenario];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Demo Controls */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Immunity Timeline Navigation Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Experience how the journey metaphor transforms the assessment into an engaging discovery process.
          </p>

          {/* Scenario Selector */}
          <div className="bg-white rounded-lg border p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Demo Scenarios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(demoScenarios).map(([key, scenario]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => loadScenario(key as keyof typeof demoScenarios)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedScenario === key
                      ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {scenario.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {scenario.description}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Live Demo Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Play className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">
                  Interactive Demo
                </h4>
                <p className="text-blue-800 text-sm mt-1">
                  Currently showing: <strong>{currentScenario.name}</strong> - {currentScenario.description}
                </p>
                <p className="text-blue-700 text-sm mt-2">
                  Try clicking on upcoming dimensions or responding to active questions to see the journey progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Component */}
        <div className="flex justify-center">
          <ImmunityTimelineNavigation
            dimensions={dimensions}
            onDimensionSelect={handleDimensionSelect}
            onResponseSelect={handleResponseSelect}
            className="w-full max-w-3xl"
          />
        </div>

        {/* Demo Features Showcase */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Journey Metaphor
            </h3>
            <p className="text-gray-600 text-sm">
              Each dimension is framed as building immunity, not filling forms. 
              Users discover their cyber resilience progressively.
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Smart Transitions
            </h3>
            <p className="text-gray-600 text-sm">
              Smooth animations and auto-progression create flow. 
              Completed dimensions show captured insights, not just checkmarks.
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Insightful Teasers
            </h3>
            <p className="text-gray-600 text-sm">
              Upcoming dimensions show what insight they'll reveal, 
              creating natural curiosity to continue the journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImmunityTimelineDemo;