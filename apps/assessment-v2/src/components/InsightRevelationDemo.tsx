import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  ChevronRight,
  Building2,
  Clock,
  DollarSign,
  Users,
  Network,
  RefreshCw,
  Pause
} from 'lucide-react';
import { useDIIDimensionsStore, type DIIDimension } from '@/store/dii-dimensions-store';
import { 
  generateInsightRevelation, 
  generateCuriosityHook,
  type InsightRevelation 
} from '@/services/insight-revelation-service';
import { 
  InsightRevelationCard, 
  InsightProgressBar,
  InsightSummary 
} from './InsightRevelation';
import { cn } from '@shared/utils/cn';

// Demo scenarios with different patterns
const demoScenarios = {
  vulnerable: {
    name: '🚨 High-Risk Enterprise',
    description: 'Critical vulnerabilities across multiple dimensions',
    businessModel: 5 as const, // SERVICIOS_FINANCIEROS
    responses: {
      TRD: { order: 1, raw: 2, metric: 3, delay: 1000 },      // 3 hours - very fast revenue loss
      HFP: { order: 2, raw: 2, metric: 45, delay: 1500 },    // 45% - high human vulnerability  
      AER: { order: 3, raw: 2, metric: 1500000, delay: 2000 }, // $1.5M - high value target
      BRI: { order: 4, raw: 2, metric: 75, delay: 1500 },    // 75% - wide blast radius
      RRG: { order: 5, raw: 2, metric: 5.0, delay: 2000 }    // 5x - slow recovery
    }
  },
  improving: {
    name: '📈 Maturing Organization',
    description: 'Mixed profile with clear improvement areas',
    businessModel: 1 as const, // COMERCIO_HIBRIDO
    responses: {
      BRI: { order: 1, raw: 3, metric: 45, delay: 1000 },    // 45% - moderate isolation
      TRD: { order: 2, raw: 3, metric: 12, delay: 1500 },    // 12 hours - moderate speed
      RRG: { order: 3, raw: 4, metric: 2.0, delay: 1500 },   // 2x - good recovery
      HFP: { order: 4, raw: 3, metric: 25, delay: 2000 },    // 25% - average human risk
      AER: { order: 5, raw: 3, metric: 200000, delay: 1500 } // $200K - medium value
    }
  },
  resilient: {
    name: '💪 Security Leader',
    description: 'Strong immunity with minor gaps',
    businessModel: 2 as const, // SOFTWARE_CRITICO
    responses: {
      AER: { order: 1, raw: 4, metric: 80000, delay: 1000 },  // $80K - low value
      TRD: { order: 2, raw: 4, metric: 24, delay: 1500 },     // 24 hours - good buffer
      HFP: { order: 3, raw: 4, metric: 12, delay: 2000 },     // 12% - strong team
      RRG: { order: 4, raw: 4, metric: 1.8, delay: 1500 },    // 1.8x - excellent recovery
      BRI: { order: 5, raw: 3, metric: 35, delay: 2000 }      // 35% - one weakness
    }
  }
};

interface DimensionQuestionProps {
  dimension: DIIDimension;
  isActive: boolean;
  onAnswer: () => void;
}

function DimensionQuestion({ dimension, isActive, onAnswer }: DimensionQuestionProps) {
  const dimensionInfo = {
    TRD: { 
      icon: Clock, 
      question: 'How quickly would a cyber incident impact 10% of revenue?',
      color: 'text-red-500'
    },
    AER: { 
      icon: DollarSign, 
      question: 'What value could attackers potentially extract?',
      color: 'text-green-500'
    },
    HFP: { 
      icon: Users, 
      question: 'What percentage of employees fail phishing tests?',
      color: 'text-blue-500'
    },
    BRI: { 
      icon: Network, 
      question: 'What percentage of systems would a breach affect?',
      color: 'text-purple-500'
    },
    RRG: { 
      icon: RefreshCw, 
      question: 'How much longer than planned does recovery take?',
      color: 'text-orange-500'
    }
  };
  
  const info = dimensionInfo[dimension];
  const Icon = info.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "p-6 bg-white rounded-lg border transition-all",
        isActive ? "border-blue-400 shadow-md" : "border-gray-200 opacity-60"
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-lg bg-gray-50", info.color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{dimension}</h3>
          <p className="text-gray-600 mb-4">{info.question}</p>
          {isActive && (
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAnswer}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors flex items-center gap-2"
            >
              Submit Answer
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function InsightRevelationDemo() {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof demoScenarios>('vulnerable');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [insights, setInsights] = useState<InsightRevelation[]>([]);
  const [showingSummary, setShowingSummary] = useState(false);
  
  const {
    dimensions,
    currentDII,
    setBusinessModel,
    setDimensionResponse,
    reset
  } = useDIIDimensionsStore();
  
  const scenario = demoScenarios[selectedScenario];
  const orderedDimensions = Object.entries(scenario.responses)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([dim]) => dim as DIIDimension);
  
  // const currentDimension = orderedDimensions[currentStep];
  const answeredCount = Object.keys(dimensions).length;
  
  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || currentStep >= orderedDimensions.length) {
      if (currentStep >= orderedDimensions.length && isPlaying) {
        setIsPlaying(false);
        setShowingSummary(true);
      }
      return;
    }
    
    const dimension = orderedDimensions[currentStep];
    if (dimension) {
      const response = scenario.responses[dimension];
      const timer = setTimeout(() => {
        handleDimensionAnswer(dimension);
      }, response.delay);
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, orderedDimensions]);
  
  const handleDimensionAnswer = async (dimension: DIIDimension) => {
    const response = scenario.responses[dimension];
    await setDimensionResponse(dimension, response.raw, response.metric);
    
    // Generate insight
    const insight = generateInsightRevelation(
      dimension,
      {
        dimension,
        rawValue: response.raw,
        metricValue: response.metric,
        normalizedScore: response.raw * 2, // Simplified
        timestamp: new Date(),
        confidence: 90
      },
      scenario.businessModel,
      dimensions,
      currentDII || undefined
    );
    
    setInsights(prev => [...prev, insight]);
    setCurrentStep(prev => prev + 1);
  };
  
  const handleReset = () => {
    reset();
    setInsights([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setShowingSummary(false);
  };
  
  const handleScenarioChange = (newScenario: keyof typeof demoScenarios) => {
    handleReset();
    setSelectedScenario(newScenario);
    setBusinessModel(demoScenarios[newScenario].businessModel);
  };
  
  const handleNextDimension = (dimension: string) => {
    const index = orderedDimensions.indexOf(dimension as DIIDimension);
    if (index >= 0 && index === currentStep) {
      handleDimensionAnswer(dimension as DIIDimension);
    }
  };
  
  const curiosityMessage = generateCuriosityHook(answeredCount, 5, currentDII || undefined);
  
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Insight Revelation System Demo
        </h1>
        <p className="text-gray-600">
          Experience how contextual insights build curiosity and engagement
        </p>
      </div>
      
      {/* Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-gray-500" />
            <select
              value={selectedScenario}
              onChange={(e) => handleScenarioChange(e.target.value as keyof typeof demoScenarios)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
            >
              {Object.entries(demoScenarios).map(([key, scenario]) => (
                <option key={key} value={key}>
                  {scenario.name} - {scenario.description}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={currentStep >= orderedDimensions.length}
              className={cn(
                "px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors",
                isPlaying 
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200",
                currentStep >= orderedDimensions.length && "opacity-50 cursor-not-allowed"
              )}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause Demo
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  {currentStep === 0 ? 'Start Demo' : 'Resume Demo'}
                </>
              )}
            </button>
            
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 
                       flex items-center gap-2 text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <InsightProgressBar
        current={answeredCount}
        total={5}
        message={curiosityMessage}
      />
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Questions Panel */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Assessment Questions</h2>
          <div className="space-y-3">
            {orderedDimensions.map((dimension, index) => (
              <DimensionQuestion
                key={dimension}
                dimension={dimension}
                isActive={index === currentStep && !isPlaying}
                onAnswer={() => handleDimensionAnswer(dimension)}
              />
            ))}
          </div>
        </div>
        
        {/* Insights Panel */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Real-Time Insights</h2>
          
          <AnimatePresence mode="wait">
            {insights.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-50 rounded-lg p-8 text-center"
              >
                <p className="text-gray-500">
                  Start the assessment to see insights reveal themselves
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {/* Latest Insight */}
                {insights.length > 0 && insights[insights.length - 1] && (
                  <InsightRevelationCard
                    insight={insights[insights.length - 1]!}
                    onNextDimension={handleNextDimension}
                  />
                )}
                
                {/* Summary (when complete) */}
                {showingSummary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <InsightSummary 
                      insights={insights} 
                      currentDII={currentDII?.score}
                    />
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Feature Highlights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">
          Key Features Demonstrated
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <h4 className="font-medium text-blue-800">Immediate Impact</h4>
            <p className="text-sm text-blue-700">
              Business consequences in plain language
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-purple-800">Peer Comparison</h4>
            <p className="text-sm text-purple-700">
              Industry benchmarking builds urgency
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-indigo-800">Smart Correlations</h4>
            <p className="text-sm text-indigo-700">
              Reveals hidden connections between risks
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-pink-800">Curiosity Hooks</h4>
            <p className="text-sm text-pink-700">
              Each insight makes you want the next
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}