import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play,
  CheckCircle,
  Loader2,
  Sparkles,
  TrendingUp,
  Shield,
  Rocket,
  Building2,
  RotateCcw
} from 'lucide-react';
import { useDIIDimensionsStore, type DIIDimension, type BusinessModelId } from '@/store/dii-dimensions-store';
import { AssessmentCompletion } from './AssessmentCompletion';
import { cn } from '@shared/utils/cn';

// Sample profiles for demonstration
const SAMPLE_PROFILES = {
  critical: {
    name: '🚨 Critical Risk Organization',
    description: 'Financial services with severe vulnerabilities',
    businessModel: 5 as BusinessModelId,
    score: 18,
    dimensions: {
      TRD: { raw: 1, metric: 2, normalized: 2.0 },     // 2 hours - critical
      AER: { raw: 2, metric: 1800000, normalized: 2.5 }, // $1.8M - very high
      HFP: { raw: 2, metric: 45, normalized: 2.0 },    // 45% - very weak
      BRI: { raw: 2, metric: 85, normalized: 1.5 },    // 85% - terrible
      RRG: { raw: 2, metric: 6.0, normalized: 1.5 }    // 6x - very slow
    }
  },
  vulnerable: {
    name: '⚠️ Vulnerable Enterprise',
    description: 'E-commerce with significant gaps',
    businessModel: 1 as BusinessModelId,
    score: 35,
    dimensions: {
      TRD: { raw: 2, metric: 6, normalized: 4.0 },     // 6 hours
      AER: { raw: 3, metric: 400000, normalized: 4.5 }, // $400K
      HFP: { raw: 2, metric: 35, normalized: 3.0 },    // 35%
      BRI: { raw: 3, metric: 60, normalized: 3.5 },    // 60%
      RRG: { raw: 3, metric: 3.5, normalized: 3.0 }    // 3.5x
    }
  },
  moderate: {
    name: '📊 Moderate Immunity',
    description: 'Data services with balanced profile',
    businessModel: 3 as BusinessModelId,
    score: 52,
    dimensions: {
      TRD: { raw: 3, metric: 18, normalized: 5.5 },    // 18 hours
      AER: { raw: 3, metric: 250000, normalized: 5.0 }, // $250K
      HFP: { raw: 3, metric: 20, normalized: 5.5 },    // 20%
      BRI: { raw: 3, metric: 45, normalized: 5.0 },    // 45%
      RRG: { raw: 3, metric: 2.5, normalized: 5.0 }    // 2.5x
    }
  },
  strong: {
    name: '💪 Strong Security Posture',
    description: 'Critical software with mature defenses',
    businessModel: 2 as BusinessModelId,
    score: 71,
    dimensions: {
      TRD: { raw: 4, metric: 24, normalized: 7.0 },    // 24 hours
      AER: { raw: 4, metric: 100000, normalized: 7.5 }, // $100K
      HFP: { raw: 4, metric: 12, normalized: 7.0 },    // 12%
      BRI: { raw: 4, metric: 30, normalized: 7.0 },    // 30%
      RRG: { raw: 4, metric: 1.8, normalized: 7.5 }    // 1.8x
    }
  },
  excellent: {
    name: '🏆 Industry Leader',
    description: 'Supply chain with exceptional immunity',
    businessModel: 7 as BusinessModelId,
    score: 86,
    dimensions: {
      TRD: { raw: 5, metric: 48, normalized: 8.5 },    // 48 hours
      AER: { raw: 5, metric: 50000, normalized: 9.0 },  // $50K
      HFP: { raw: 5, metric: 8, normalized: 8.5 },     // 8%
      BRI: { raw: 4, metric: 25, normalized: 7.5 },    // 25%
      RRG: { raw: 5, metric: 1.4, normalized: 9.0 }    // 1.4x
    }
  }
};

type FlowStep = 'intro' | 'final-answer' | 'calculating' | 'results';

interface AssessmentCompletionFlowProps {
  className?: string;
}

export function AssessmentCompletionFlow({ className }: AssessmentCompletionFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('intro');
  const [selectedProfile, setSelectedProfile] = useState<keyof typeof SAMPLE_PROFILES>('moderate');
  const [_isAnimating, setIsAnimating] = useState(false);
  
  const {
    setBusinessModel,
    setDimensionResponse,
    reset
  } = useDIIDimensionsStore();

  const profile = SAMPLE_PROFILES[selectedProfile];

  const handleStartFlow = async () => {
    setIsAnimating(true);
    setCurrentStep('final-answer');
    
    // Reset and set up profile
    reset();
    setBusinessModel(profile.businessModel);
    
    // Set all dimensions except the last one
    const dimensions: DIIDimension[] = ['TRD', 'AER', 'HFP', 'BRI'];
    for (const dim of dimensions) {
      const data = profile.dimensions[dim];
      await setDimensionResponse(dim, data.raw, data.metric);
    }
  };

  const handleFinalAnswer = async () => {
    setCurrentStep('calculating');
    
    // Set the final dimension
    const data = profile.dimensions.RRG;
    await setDimensionResponse('RRG', data.raw, data.metric);
    
    // Simulate calculation time
    setTimeout(() => {
      setCurrentStep('results');
    }, 2000);
  };

  const handleReset = () => {
    reset();
    setCurrentStep('intro');
    setIsAnimating(false);
  };

  const handleExploreScenarios = () => {
    console.log('Navigate to scenarios explorer');
  };

  const handleGetDetailedAnalysis = () => {
    console.log('Navigate to detailed analysis');
  };

  return (
    <div className={cn("max-w-6xl mx-auto p-6", className)}>
      <AnimatePresence mode="wait">
        {/* Intro Step */}
        {currentStep === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Assessment Completion Experience Demo
              </h1>
              <p className="text-gray-600">
                See how the immunity profile is revealed after completing all 5 dimensions
              </p>
            </div>

            {/* Profile Selection */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Select a Sample Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(SAMPLE_PROFILES).map(([key, profile]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedProfile(key as keyof typeof SAMPLE_PROFILES)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left",
                      selectedProfile === key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="font-medium text-gray-900">{profile.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{profile.description}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className={cn(
                        "text-2xl font-bold",
                        profile.score >= 70 ? "text-green-600" :
                        profile.score >= 40 ? "text-yellow-600" :
                        profile.score >= 20 ? "text-orange-600" :
                        "text-red-600"
                      )}>
                        {profile.score}
                      </div>
                      <div className="text-sm text-gray-500">DII Score</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center">
              <button
                onClick={handleStartFlow}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium
                         hover:bg-blue-700 transition-colors flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                Start Completion Flow
              </button>
            </div>
          </motion.div>
        )}

        {/* Final Answer Step */}
        {currentStep === 'final-answer' && (
          <motion.div
            key="final-answer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 
                         rounded-full mb-4"
              >
                <span className="text-3xl">🔄</span>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900">
                Final Dimension: Recovery Reality Gap
              </h2>
              <p className="text-gray-600">
                How much longer than planned does recovery actually take?
              </p>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Your Answer</div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">
                      {profile.dimensions.RRG.metric}x longer
                    </div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>This is your 5th and final dimension</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span>Your complete immunity profile is ready</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center">
              <button
                onClick={handleFinalAnswer}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                         rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-3"
              >
                <Shield className="w-5 h-5" />
                Reveal My Immunity Profile
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Calculating Step */}
        {currentStep === 'calculating' && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-[600px]"
          >
            <div className="text-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br 
                         from-blue-500 to-purple-500 rounded-full"
              >
                <Shield className="w-12 h-12 text-white" />
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Calculating Your Digital Immunity
                </h2>
                <p className="text-gray-600">
                  Analyzing all 5 dimensions to reveal your complete profile...
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-sm text-gray-500">Processing correlations and insights</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Step */}
        {currentStep === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Another Profile
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Rocket className="w-4 h-4" />
                Results ready to share
              </div>
            </div>
            
            <AssessmentCompletion
              onExploreScenarios={handleExploreScenarios}
              onGetDetailedAnalysis={handleGetDetailedAnalysis}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}