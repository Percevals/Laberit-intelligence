import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle,
  Info,
  Lightbulb,
  Calculator,
  ChevronRight,
  Eye,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useDIIDimensionsStore } from '@/store/dii-dimensions-store';
import { cn } from '@shared/utils/cn';

// Sample dimension values for demo
const demoScenarios = {
  strong: {
    name: 'Strong Cyber Immunity',
    values: {
      TRD: { raw: 4, metric: 48 }, // 48 hours
      AER: { raw: 4, metric: 40000 }, // $40K
      HFP: { raw: 4, metric: 10 }, // 10% failure
      BRI: { raw: 4, metric: 25 }, // 25% exposure
      RRG: { raw: 4, metric: 1.6 } // 1.6x multiplier
    }
  },
  moderate: {
    name: 'Moderate Immunity',
    values: {
      TRD: { raw: 3, metric: 12 }, // 12 hours
      AER: { raw: 3, metric: 150000 }, // $150K
      HFP: { raw: 3, metric: 20 }, // 20% failure
      BRI: { raw: 3, metric: 45 }, // 45% exposure
      RRG: { raw: 3, metric: 2.2 } // 2.2x multiplier
    }
  },
  weak: {
    name: 'Vulnerable Organization',
    values: {
      TRD: { raw: 2, metric: 4 }, // 4 hours
      AER: { raw: 2, metric: 500000 }, // $500K
      HFP: { raw: 2, metric: 35 }, // 35% failure
      BRI: { raw: 2, metric: 65 }, // 65% exposure
      RRG: { raw: 2, metric: 3.5 } // 3.5x multiplier
    }
  }
};

interface DIIGaugeProps {
  score: number;
  confidence: number;
  trend?: 'improving' | 'declining' | 'stable' | undefined;
  label?: string | undefined;
}

function DIIGauge({ score, confidence, trend = 'stable', label = 'DII Score' }: DIIGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={cn('transition-all duration-500', getColor(score))}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className={cn('text-3xl font-bold', getColor(score))}>
            {score}
          </div>
          <div className="text-xs text-gray-500">{label}</div>
          {confidence < 100 && (
            <div className="text-xs text-gray-400">{confidence}% confidence</div>
          )}
        </div>
      </div>
      {trend !== 'stable' && (
        <div className="absolute -top-2 -right-2">
          {trend === 'improving' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
      )}
    </div>
  );
}

interface DimensionCardProps {
  dimension: string;
  value?: number | undefined;
  metricValue?: number | undefined;
  label: string;
  unit: string;
  isActive: boolean;
  onSet: () => void;
}

function DimensionCard({ dimension, value, metricValue, label, unit, isActive, onSet }: DimensionCardProps) {
  const getIcon = () => {
    switch (dimension) {
      case 'TRD': return '⏱️';
      case 'AER': return '💰';
      case 'HFP': return '👥';
      case 'BRI': return '🛡️';
      case 'RRG': return '🔄';
      default: return '📊';
    }
  };

  const formatValue = () => {
    if (!metricValue) return '--';
    switch (dimension) {
      case 'TRD': return `${metricValue}h`;
      case 'AER': return `$${metricValue >= 1000000 ? `${(metricValue/1000000).toFixed(1)}M` : `${Math.round(metricValue/1000)}K`}`;
      case 'HFP': return `${metricValue}%`;
      case 'BRI': return `${metricValue}%`;
      case 'RRG': return `${metricValue}x`;
      default: return metricValue;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: isActive ? 1.02 : 1 }}
      whileTap={{ scale: isActive ? 0.98 : 1 }}
      onClick={isActive ? onSet : undefined}
      className={cn(
        'p-4 rounded-lg border transition-all cursor-pointer',
        value !== undefined 
          ? 'border-blue-200 bg-blue-50' 
          : isActive 
            ? 'border-gray-300 bg-white hover:border-blue-300'
            : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getIcon()}</span>
          <h4 className="font-semibold text-gray-900">{dimension}</h4>
        </div>
        {value !== undefined && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-blue-600"
          >
            {formatValue()}
          </motion.div>
        )}
      </div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xs text-gray-500 mt-1">{unit}</p>
      {isActive && value === undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-blue-600 flex items-center gap-1"
        >
          <ChevronRight className="w-3 h-3" />
          Click to assess
        </motion.div>
      )}
    </motion.div>
  );
}

export function DIIProgressiveDemo() {
  const {
    dimensions,
    currentDII,
    historicalDII,
    lastImpactAnalysis,
    setDimensionResponse,
    calculateConfidence,
    getCalculationTransparency,
    reset
  } = useDIIDimensionsStore();

  const [selectedScenario, setSelectedScenario] = useState<keyof typeof demoScenarios>('moderate');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showTransparency, setShowTransparency] = useState(false);
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);

  const dimensionOrder: Array<keyof typeof demoScenarios.moderate.values> = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'];
  const dimensionInfo = {
    TRD: { label: 'Time to Revenue Degradation', unit: 'Hours until 10% revenue loss' },
    AER: { label: 'Attack Economics Ratio', unit: 'Potential value extraction' },
    HFP: { label: 'Human Failure Probability', unit: 'Phishing susceptibility rate' },
    BRI: { label: 'Blast Radius Index', unit: 'System exposure percentage' },
    RRG: { label: 'Recovery Reality Gap', unit: 'Actual vs planned recovery' }
  };

  // Auto-play simulation
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setTimeout(() => {
      if (currentDimensionIndex < dimensionOrder.length) {
        const dimension = dimensionOrder[currentDimensionIndex];
        if (dimension) {
          const values = demoScenarios[selectedScenario].values[dimension];
          setDimensionResponse(dimension, values.raw, values.metric);
        }
        setCurrentDimensionIndex(currentDimensionIndex + 1);
      } else {
        setIsAutoPlaying(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentDimensionIndex, selectedScenario, setDimensionResponse]);

  const handleDimensionSet = (dimension: keyof typeof demoScenarios.moderate.values) => {
    const values = demoScenarios[selectedScenario].values[dimension];
    setDimensionResponse(dimension, values.raw, values.metric);
  };

  const handleReset = () => {
    reset();
    setCurrentDimensionIndex(0);
    setIsAutoPlaying(false);
  };

  const transparency = getCalculationTransparency();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          DII Progressive Calculation Demo
        </h1>
        <p className="text-gray-600">
          See how your Digital Immunity Index evolves as you assess each dimension
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Scenario:</label>
            <select
              value={selectedScenario}
              onChange={(e) => {
                setSelectedScenario(e.target.value as keyof typeof demoScenarios);
                handleReset();
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              {Object.entries(demoScenarios).map(([key, scenario]) => (
                <option key={key} value={key}>{scenario.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={cn(
                'px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors',
                isAutoPlaying 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              )}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Auto Play
                </>
              )}
            </button>

            <button
              onClick={() => setShowTransparency(!showTransparency)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2 text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              {showTransparency ? 'Hide' : 'Show'} Calculation
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2 text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DII Score Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Current DII */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Current DII Score
            </h3>
            <div className="flex justify-center">
              <DIIGauge
                score={currentDII?.score || 0}
                confidence={calculateConfidence()}
                trend={currentDII?.trend}
              />
            </div>
            
            {currentDII && currentDII.dimensionsAnswered > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Confidence Level</span>
                  <span className="font-medium">{currentDII.confidence}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Dimensions Assessed</span>
                  <span className="font-medium">{currentDII.dimensionsAnswered}/5</span>
                </div>
                {currentDII.percentile && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Industry Percentile</span>
                    <span className="font-medium">{currentDII.percentile}th</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Impact Analysis */}
          {lastImpactAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border p-4"
            >
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Latest Impact
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {lastImpactAnalysis.interpretation}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Change:</span>
                <span className={cn(
                  'font-medium',
                  lastImpactAnalysis.impact > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {lastImpactAnalysis.impact > 0 ? '+' : ''}{lastImpactAnalysis.impact.toFixed(1)}%
                </span>
              </div>
            </motion.div>
          )}

          {/* Score Evolution */}
          {historicalDII.length > 1 && (
            <div className="bg-white rounded-lg border p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Score Evolution</h4>
              <div className="space-y-2">
                {historicalDII.map((dii, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      After {index + 1} dimension{index > 0 ? 's' : ''}
                    </span>
                    <span className="font-medium">{dii.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dimensions Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Dimension Assessment Progress
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dimensionOrder.map((dimension, index) => (
                <DimensionCard
                  key={dimension}
                  dimension={dimension}
                  value={dimensions[dimension]?.rawValue}
                  metricValue={dimensions[dimension]?.metricValue}
                  label={dimensionInfo[dimension].label}
                  unit={dimensionInfo[dimension].unit}
                  isActive={!isAutoPlaying && index <= currentDimensionIndex}
                  onSet={() => handleDimensionSet(dimension)}
                />
              ))}
            </div>

            {/* Recommendations */}
            {lastImpactAnalysis && lastImpactAnalysis.recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-blue-50 rounded-lg"
              >
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Recommendations for {lastImpactAnalysis.dimension}
                </h4>
                <ul className="space-y-1">
                  {lastImpactAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Calculation Transparency */}
          {showTransparency && currentDII && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg border p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Calculation Transparency
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Formula</h4>
                  <code className="block p-3 bg-gray-100 rounded text-sm">
                    {transparency.formula}
                  </code>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Current Values</h4>
                  <code className="block p-3 bg-gray-100 rounded text-sm">
                    {currentDII.formula}
                  </code>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Calculation Steps</h4>
                  <div className="space-y-1">
                    {transparency.steps.map((step, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{step.step}:</span>
                        <span className="font-mono">{step.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {transparency.assumptions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Assumptions</h4>
                    <ul className="space-y-1">
                      {transparency.assumptions.map((assumption, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-yellow-500 mt-0.5" />
                          <span>{assumption}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Key Features Demonstrated</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <h4 className="font-medium text-blue-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Progressive Calculation
            </h4>
            <p className="text-sm text-blue-700">
              DII updates with each dimension assessed
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-blue-800 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Confidence Levels
            </h4>
            <p className="text-sm text-blue-700">
              Shows reliability based on data completeness
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-blue-800 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Impact Analysis
            </h4>
            <p className="text-sm text-blue-700">
              Real-time feedback on immunity changes
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-blue-800 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Full Transparency
            </h4>
            <p className="text-sm text-blue-700">
              See exactly how scores are calculated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}