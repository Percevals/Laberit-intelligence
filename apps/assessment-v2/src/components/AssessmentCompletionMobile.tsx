import { motion } from 'framer-motion';
import { 
  Shield,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { BusinessModelId } from '@/store/dii-dimensions-store';

interface MobileCompletionProps {
  score: number;
  businessModel: BusinessModelId;
  topStrengths: Array<{ label: string; icon: string; percentile: number }>;
  criticalGaps: Array<{ label: string; icon: string; percentile: number }>;
  onShare?: () => void;
  onExplore?: () => void;
  className?: string;
}

const BUSINESS_MODEL_SHORT: Record<BusinessModelId, string> = {
  1: 'Hybrid Commerce',
  2: 'Critical Software',
  3: 'Data Services',
  4: 'Digital Ecosystem',
  5: 'Financial Services',
  6: 'Legacy Systems',
  7: 'Supply Chain',
  8: 'Regulated Info'
};

export function AssessmentCompletionMobile({
  score,
  businessModel,
  topStrengths,
  criticalGaps,
  onShare,
  onExplore,
  className
}: MobileCompletionProps) {
  const immunityLevel = score >= 70 ? 'Strong' : score >= 40 ? 'Moderate' : 'Critical';
  const immunityColor = score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500';
  const bgGradient = score >= 70 ? 'from-green-500 to-blue-500' : 
                     score >= 40 ? 'from-yellow-500 to-orange-500' : 
                     'from-red-500 to-orange-500';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl overflow-hidden", className)}
    >
      {/* Header with Score */}
      <div className={cn("relative p-6 text-white bg-gradient-to-br", bgGradient)}>
        <div className="absolute top-4 right-4">
          <button
            onClick={onShare}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full"
          >
            <div className="text-5xl font-bold">{score}</div>
          </motion.div>
          
          <div>
            <div className="text-lg font-semibold">Digital Immunity Index</div>
            <div className={cn("text-xl font-bold mt-1", immunityColor)}>
              {immunityLevel} Immunity
            </div>
            <div className="text-sm opacity-80 mt-1">
              {BUSINESS_MODEL_SHORT[businessModel]}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 space-y-3">
        {/* Strengths */}
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Top Strengths</span>
          </div>
          <div className="space-y-1">
            {topStrengths.map((strength, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span>{strength.icon}</span>
                  <span className="text-gray-700">{strength.label}</span>
                </div>
                <span className="text-green-600 font-medium">Top {100-strength.percentile}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gaps */}
        <div className="bg-red-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Critical Gaps</span>
          </div>
          <div className="space-y-1">
            {criticalGaps.map((gap, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span>{gap.icon}</span>
                  <span className="text-gray-700">{gap.label}</span>
                </div>
                <span className="text-red-600 font-medium">Bottom {gap.percentile}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insight */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <div className="text-xs font-medium text-blue-900 mb-1">Key Insight</div>
              <p className="text-xs text-gray-700">
                {score < 40 
                  ? "Multiple critical vulnerabilities are compounding your risk exponentially."
                  : score < 70
                  ? "You have a foundation to build on, but gaps need immediate attention."
                  : "Strong immunity overall. Focus on maintaining and optimizing weak points."
                }
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onExplore}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                   rounded-lg font-medium flex items-center justify-center gap-2"
        >
          See How to Improve
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Shareable Card Component (for social media)
export function ShareableImmunityCard({
  score,
  businessModel,
  dimensions,
  className
}: {
  score: number;
  businessModel: BusinessModelId;
  dimensions: Array<{ label: string; icon: string; percentile: number }>;
  className?: string;
}) {
  const bgGradient = score >= 70 ? 'from-green-500 to-blue-500' : 
                     score >= 40 ? 'from-yellow-500 to-orange-500' : 
                     'from-red-500 to-orange-500';

  return (
    <div className={cn(
      "w-full max-w-md mx-auto bg-gradient-to-br p-8 rounded-2xl text-white",
      bgGradient,
      className
    )}>
      {/* Logo/Brand */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6" />
          <span className="font-semibold">Digital Immunity Index</span>
        </div>
        <div className="text-sm opacity-80">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Score */}
      <div className="text-center mb-8">
        <div className="text-7xl font-bold mb-2">{score}</div>
        <div className="text-xl opacity-90">{BUSINESS_MODEL_SHORT[businessModel]}</div>
      </div>

      {/* Dimension Grid */}
      <div className="grid grid-cols-5 gap-2 mb-8">
        {dimensions.map((dim, i) => (
          <div key={i} className="text-center">
            <div className="text-2xl mb-1">{dim.icon}</div>
            <div className="text-xs opacity-80">{dim.percentile}%</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center space-y-2">
        <div className="text-sm opacity-80">
          How immune is your organization?
        </div>
        <div className="font-medium">
          Take the assessment → immunity.laberit.com
        </div>
      </div>
    </div>
  );
}