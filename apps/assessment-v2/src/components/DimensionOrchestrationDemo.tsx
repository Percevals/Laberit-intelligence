import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play,
  Brain,
  Navigation,
  Info,
  SkipForward,
  Target,
  Clock,
  DollarSign,
  Users,
  Network,
  RefreshCw,
  Building2,
  Sparkles
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { 
  DimensionOrchestrator,
  type OrchestrationResult,
  type SkipRecommendation,
  type DimensionPriority
} from '@/services/dimension-orchestrator';
import type { DIIDimension, BusinessModelId, DimensionResponse } from '@/store/dii-dimensions-store';

// Business model display names
const BUSINESS_MODEL_NAMES: Record<BusinessModelId, { name: string; icon: string }> = {
  1: { name: 'Hybrid Commerce', icon: '🛍️' },
  2: { name: 'Critical Software', icon: '💻' },
  3: { name: 'Data Services', icon: '📊' },
  4: { name: 'Digital Ecosystem', icon: '🌐' },
  5: { name: 'Financial Services', icon: '💰' },
  6: { name: 'Legacy Infrastructure', icon: '🏗️' },
  7: { name: 'Supply Chain', icon: '📦' },
  8: { name: 'Regulated Information', icon: '🔒' }
};

// Dimension icons and colors
const DIMENSION_CONFIG = {
  TRD: { icon: Clock, color: 'text-red-500', bgColor: 'bg-red-50' },
  AER: { icon: DollarSign, color: 'text-green-500', bgColor: 'bg-green-50' },
  HFP: { icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  BRI: { icon: Network, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  RRG: { icon: RefreshCw, color: 'text-orange-500', bgColor: 'bg-orange-50' }
};

// Demo scenarios
const DEMO_SCENARIOS = {
  criticalTRD: {
    name: 'Fast Revenue Loss',
    description: 'Very short time to revenue impact triggers adaptive ordering',
    businessModel: 5 as BusinessModelId,
    responses: {
      TRD: { dimension: 'TRD', rawValue: 1, metricValue: 3, normalizedScore: 2, timestamp: new Date(), confidence: 90 }
    } as Partial<Record<DIIDimension, DimensionResponse>>
  },
  highValue: {
    name: 'High-Value Target',
    description: 'Valuable assets prioritize human defense assessment',
    businessModel: 2 as BusinessModelId,
    responses: {
      TRD: { dimension: 'TRD', rawValue: 3, metricValue: 24, normalizedScore: 6, timestamp: new Date(), confidence: 90 },
      AER: { dimension: 'AER', rawValue: 2, metricValue: 1500000, normalizedScore: 3, timestamp: new Date(), confidence: 90 }
    } as Partial<Record<DIIDimension, DimensionResponse>>
  },
  wideBlast: {
    name: 'Wide Blast Radius',
    description: 'Extensive system exposure affects recovery priority',
    businessModel: 4 as BusinessModelId,
    responses: {
      TRD: { dimension: 'TRD', rawValue: 3, metricValue: 12, normalizedScore: 5, timestamp: new Date(), confidence: 90 },
      BRI: { dimension: 'BRI', rawValue: 2, metricValue: 80, normalizedScore: 2, timestamp: new Date(), confidence: 90 }
    } as Partial<Record<DIIDimension, DimensionResponse>>
  },
  smartSkip: {
    name: 'Smart Skip Demo',
    description: 'Multiple answers enable intelligent predictions',
    businessModel: 1 as BusinessModelId,
    responses: {
      TRD: { dimension: 'TRD', rawValue: 2, metricValue: 6, normalizedScore: 4, timestamp: new Date(), confidence: 90 },
      BRI: { dimension: 'BRI', rawValue: 2, metricValue: 70, normalizedScore: 3, timestamp: new Date(), confidence: 90 },
      HFP: { dimension: 'HFP', rawValue: 2, metricValue: 40, normalizedScore: 3, timestamp: new Date(), confidence: 90 }
    } as Partial<Record<DIIDimension, DimensionResponse>>
  }
};

interface DimensionCardProps {
  priority: DimensionPriority;
  index: number;
  isAnswered: boolean;
  isActive: boolean;
  adaptiveChange?: 'moved-up' | 'moved-down' | undefined;
}

function DimensionCard({ priority, index, isAnswered, isActive, adaptiveChange }: DimensionCardProps) {
  const config = DIMENSION_CONFIG[priority.dimension];
  const Icon = config.icon;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative p-4 rounded-lg border-2 transition-all",
        isAnswered ? "border-green-400 bg-green-50" :
        isActive ? "border-blue-400 bg-blue-50 shadow-lg" :
        "border-gray-200 bg-white"
      )}
    >
      {adaptiveChange && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium rounded-full",
            adaptiveChange === 'moved-up' ? "bg-blue-500 text-white" : "bg-gray-500 text-white"
          )}
        >
          {adaptiveChange === 'moved-up' ? '↑' : '↓'}
        </motion.div>
      )}
      
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg", config.bgColor)}>
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{priority.dimension}</h4>
            <span className="text-xs text-gray-500">#{index + 1}</span>
            {isAnswered && <Sparkles className="w-4 h-4 text-green-500" />}
          </div>
          <p className="text-sm text-gray-600">{priority.rationale}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>~{priority.estimatedMinutes} min</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DimensionOrchestrationDemo() {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof DEMO_SCENARIOS>('criticalTRD');
  const [orchestration, setOrchestration] = useState<OrchestrationResult | null>(null);
  const [skipRecommendations, setSkipRecommendations] = useState<SkipRecommendation[]>([]);
  const [showAdaptive, setShowAdaptive] = useState(false);
  
  const scenario = DEMO_SCENARIOS[selectedScenario];
  const answeredDimensions = Object.keys(scenario.responses) as DIIDimension[];
  const remainingDimensions = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'].filter(
    d => !answeredDimensions.includes(d as DIIDimension)
  ) as DIIDimension[];
  
  const handleRunDemo = () => {
    // Get initial orchestration
    const initial = DimensionOrchestrator.getInitialOrder(scenario.businessModel);
    setOrchestration(initial);
    setShowAdaptive(false);
    
    // Show adaptive changes after delay
    setTimeout(() => {
      const adapted = DimensionOrchestrator.adaptOrder(
        initial.recommendedOrder,
        scenario.responses,
        scenario.businessModel
      );
      setOrchestration(adapted);
      setShowAdaptive(true);
      
      // Get skip recommendations
      const skips = DimensionOrchestrator.getSkipRecommendations(
        scenario.responses,
        remainingDimensions
      );
      setSkipRecommendations(skips);
    }, 1500);
  };
  
  const timeEstimate = DimensionOrchestrator.estimateRemainingTime(answeredDimensions);
  const correlationHints = DimensionOrchestrator.getCorrelationHints(scenario.responses);
  
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Intelligent Dimension Orchestration Demo
        </h1>
        <p className="text-gray-600">
          See how the assessment adapts based on business model and responses
        </p>
      </div>
      
      {/* Scenario Selection */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Select Demo Scenario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(DEMO_SCENARIOS).map(([key, scenario]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedScenario(key as keyof typeof DEMO_SCENARIOS);
                setOrchestration(null);
                setSkipRecommendations([]);
              }}
              className={cn(
                "p-4 rounded-lg border-2 transition-all text-left",
                selectedScenario === key
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {BUSINESS_MODEL_NAMES[scenario.businessModel].icon} {BUSINESS_MODEL_NAMES[scenario.businessModel].name}
                </span>
              </div>
              <h4 className="font-medium text-gray-900">{scenario.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                {Object.keys(scenario.responses).length} dimensions answered
              </div>
            </button>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <button
            onClick={handleRunDemo}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     transition-colors flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Run Orchestration Demo
          </button>
        </div>
      </div>
      
      {orchestration && (
        <>
          {/* Adaptive Message */}
          <AnimatePresence>
            {showAdaptive && orchestration.adaptiveReason && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-blue-50 rounded-lg p-4 flex items-start gap-3"
              >
                <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Adaptive Ordering Applied</h4>
                  <p className="text-sm text-blue-800 mt-1">{orchestration.adaptiveReason}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dimension Order */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    Optimized Assessment Order
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>~{timeEstimate.minutes} minutes remaining</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {orchestration.priorities.map((priority, index) => {
                    const isAnswered = answeredDimensions.includes(priority.dimension);
                    const isActive = !isAnswered && index === answeredDimensions.length;
                    
                    // Check if this dimension was moved
                    let adaptiveChange: 'moved-up' | 'moved-down' | undefined;
                    if (showAdaptive && orchestration.adaptiveReason) {
                      const initialOrder = DimensionOrchestrator.getInitialOrder(scenario.businessModel);
                      const initialIndex = initialOrder.recommendedOrder.indexOf(priority.dimension);
                      if (initialIndex > index) adaptiveChange = 'moved-up';
                      else if (initialIndex < index) adaptiveChange = 'moved-down';
                    }
                    
                    return (
                      <DimensionCard
                        key={priority.dimension}
                        priority={priority}
                        index={index}
                        isAnswered={isAnswered}
                        isActive={isActive}
                        adaptiveChange={adaptiveChange}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Side Panel */}
            <div className="space-y-6">
              {/* Correlation Hints */}
              {correlationHints.length > 0 && (
                <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                  <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Patterns Detected
                  </h4>
                  <ul className="space-y-1">
                    {correlationHints.map((hint, index) => (
                      <li key={index} className="text-sm text-yellow-800">{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Skip Recommendations */}
              {skipRecommendations.length > 0 && (
                <div className="bg-white rounded-lg border p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <SkipForward className="w-5 h-5 text-blue-600" />
                    Smart Skip Available
                  </h4>
                  <div className="space-y-2">
                    {skipRecommendations.slice(0, 3).map((rec) => (
                      <div key={rec.dimension} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{rec.dimension}</span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            rec.confidence >= 70 ? "bg-green-100 text-green-700" :
                            rec.confidence >= 50 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {rec.confidence}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{rec.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Key Features */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Features Demonstrated</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-blue-800">
                    <Target className="w-4 h-4 mt-0.5" />
                    <span>Business model specific priorities</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-800">
                    <Brain className="w-4 h-4 mt-0.5" />
                    <span>Adaptive ordering based on responses</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-800">
                    <SkipForward className="w-4 h-4 mt-0.5" />
                    <span>Intelligent skip recommendations</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-800">
                    <Clock className="w-4 h-4 mt-0.5" />
                    <span>Dynamic time estimates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}