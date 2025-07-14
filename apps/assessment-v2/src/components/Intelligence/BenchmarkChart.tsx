/**
 * Benchmark Chart Component
 * Industry and peer comparison visualization
 */

import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Trophy,
  Target,
  Users,
  Shield
} from 'lucide-react';
import type { IntelligenceReport } from '@/services/intelligence-engine';
import { cn } from '@shared/utils/cn';

interface BenchmarkChartProps {
  benchmarking: IntelligenceReport['benchmarking'];
}

export function BenchmarkChart({ benchmarking }: BenchmarkChartProps) {
  const getPositionColor = () => {
    switch (benchmarking.industryPosition) {
      case 'Leader': return 'text-green-500 bg-green-500/10';
      case 'Above Average': return 'text-blue-500 bg-blue-500/10';
      case 'Average': return 'text-yellow-500 bg-yellow-500/10';
      case 'Below Average': return 'text-orange-500 bg-orange-500/10';
      case 'Laggard': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getPositionIcon = () => {
    switch (benchmarking.industryPosition) {
      case 'Leader': return Trophy;
      case 'Above Average': return TrendingUp;
      default: return Target;
    }
  };

  const PositionIcon = getPositionIcon();

  const getDimensionName = (dimension: string) => {
    const names: Record<string, string> = {
      TRD: 'Time to Revenue Damage',
      AER: 'Attack Economic Reward',
      HFP: 'Human Failure Probability',
      BRI: 'Business Risk Impact',
      RRG: 'Recovery Resource Gap'
    };
    return names[dimension] || dimension;
  };

  const getDimensionColor = (dimension: string) => {
    const colors: Record<string, string> = {
      TRD: 'text-red-400',
      AER: 'text-green-400',
      HFP: 'text-blue-400',
      BRI: 'text-purple-400',
      RRG: 'text-orange-400'
    };
    return colors[dimension] || 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Industry Position */}
      <div className="bg-gradient-to-r from-primary-600/20 to-blue-600/20 border border-primary-600/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-dark-text">Industry Position</h3>
          <div className={cn("p-2 rounded-lg", getPositionColor())}>
            <PositionIcon className="w-5 h-5" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={cn("text-3xl font-bold mb-2", getPositionColor().split(' ')[0])}>
              {benchmarking.industryPosition}
            </div>
            <p className="text-sm text-dark-text-secondary">Your Standing</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-dark-text mb-2">
              +{benchmarking.improvementPotential}
            </div>
            <p className="text-sm text-dark-text-secondary">Points to Leader</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              Top {Math.round((1 - benchmarking.improvementPotential / 100) * 100)}%
            </div>
            <p className="text-sm text-dark-text-secondary">Industry Percentile</p>
          </div>
        </div>
      </div>

      {/* Dimension Comparison */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-dark-text mb-6">
          Dimension Benchmarking
        </h3>
        
        <div className="space-y-6">
          {benchmarking.peerComparison.map((comparison, index) => (
            <motion.div
              key={comparison.dimension}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className={cn("w-5 h-5", getDimensionColor(comparison.dimension))} />
                  <span className="font-medium text-dark-text">
                    {getDimensionName(comparison.dimension)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-dark-text-secondary">
                    Gap: {(comparison.industryAvg - comparison.yourScore).toFixed(1)}
                  </span>
                </div>
              </div>
              
              {/* Comparison Bar */}
              <div className="relative">
                <div className="h-8 bg-dark-bg rounded-lg overflow-hidden">
                  {/* Your Score */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(comparison.yourScore / 10) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="absolute top-0 left-0 h-full bg-primary-600/30 rounded-lg"
                  />
                  
                  {/* Industry Average Line */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-yellow-500"
                    style={{ left: `${(comparison.industryAvg / 10) * 100}%` }}
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-yellow-500 whitespace-nowrap">
                      Industry Avg
                    </div>
                  </div>
                  
                  {/* Top Quartile Line */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-green-500"
                    style={{ left: `${(comparison.topQuartile / 10) * 100}%` }}
                  >
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-green-500 whitespace-nowrap">
                      Top 25%
                    </div>
                  </div>
                </div>
                
                {/* Score Labels */}
                <div className="flex justify-between mt-8 text-xs text-dark-text-secondary">
                  <span>0</span>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-600 font-medium">
                      You: {comparison.yourScore.toFixed(1)}
                    </span>
                  </div>
                  <span>10</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Peer Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-green-500" />
            <h4 className="font-medium text-dark-text">Your Strengths</h4>
          </div>
          
          <div className="space-y-3">
            {benchmarking.peerComparison
              .filter(c => c.yourScore > c.industryAvg)
              .map(comparison => (
                <div key={comparison.dimension} className="flex items-center justify-between">
                  <span className="text-sm text-dark-text">
                    {getDimensionName(comparison.dimension)}
                  </span>
                  <span className="text-sm text-green-500">
                    +{(comparison.yourScore - comparison.industryAvg).toFixed(1)} above avg
                  </span>
                </div>
              ))}
            
            {benchmarking.peerComparison.filter(c => c.yourScore > c.industryAvg).length === 0 && (
              <p className="text-sm text-dark-text-secondary">
                No dimensions currently above industry average
              </p>
            )}
          </div>
        </div>

        {/* Improvement Areas */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-orange-500" />
            <h4 className="font-medium text-dark-text">Improvement Opportunities</h4>
          </div>
          
          <div className="space-y-3">
            {benchmarking.peerComparison
              .filter(c => c.yourScore < c.industryAvg)
              .sort((a, b) => (b.industryAvg - b.yourScore) - (a.industryAvg - a.yourScore))
              .slice(0, 3)
              .map(comparison => (
                <div key={comparison.dimension} className="flex items-center justify-between">
                  <span className="text-sm text-dark-text">
                    {getDimensionName(comparison.dimension)}
                  </span>
                  <span className="text-sm text-orange-500">
                    {(comparison.industryAvg - comparison.yourScore).toFixed(1)} to avg
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Industry Comparison Visual */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-dark-text">Performance Distribution</h4>
          <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
            <Users className="w-4 h-4" />
            <span>Industry Peers</span>
          </div>
        </div>
        
        <div className="relative h-32">
          {/* Distribution Curve */}
          <svg className="w-full h-full">
            <path
              d="M 0 100 Q 50 20, 100 40 T 200 50 T 300 60 T 400 80 L 400 100 Z"
              fill="url(#gradient)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(239 68 68)" />
                <stop offset="50%" stopColor="rgb(59 130 246)" />
                <stop offset="100%" stopColor="rgb(34 197 94)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Position Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${70}%` }} // Position based on percentile
          >
            <div className="relative">
              <div className="w-4 h-4 bg-primary-600 rounded-full animate-pulse" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-primary-600 font-medium whitespace-nowrap">
                You are here
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4 text-xs text-dark-text-secondary">
          <span>Bottom 25%</span>
          <span>Average</span>
          <span>Top 25%</span>
        </div>
      </div>
    </div>
  );
}