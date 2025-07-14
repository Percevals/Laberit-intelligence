/**
 * Scenario Comparison Component
 * Side-by-side analysis of multiple scenarios
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Crown,
  Trophy,
  Medal,
  Star,
  BarChart3
} from 'lucide-react';
import { useScenarioStore } from '@/store/scenario-store';
import type { ScenarioAnalysis } from '@/services/scenario-engine';
import { cn } from '@shared/utils/cn';

interface MetricComparisonProps {
  scenarios: ScenarioAnalysis[];
  metric: 'improvement' | 'cost' | 'roi' | 'time';
  title: string;
  icon: React.ComponentType<{ className?: string | undefined }>;
  formatter: (value: number) => string;
  colorClass: string;
}

function MetricComparison({ 
  scenarios, 
  metric, 
  title, 
  icon: Icon, 
  formatter, 
  colorClass 
}: MetricComparisonProps) {
  const getValue = (scenario: ScenarioAnalysis) => {
    switch (metric) {
      case 'improvement': return scenario.improvement;
      case 'cost': return scenario.totalCost;
      case 'roi': return scenario.roi;
      case 'time': return scenario.totalTimeMonths;
      default: return 0;
    }
  };

  const maxValue = Math.max(...scenarios.map(getValue));
  
  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={cn("w-5 h-5", colorClass)} />
        <h4 className="font-medium text-dark-text">{title}</h4>
      </div>
      
      <div className="space-y-4">
        {scenarios.map((scenario, index) => {
          const value = getValue(scenario);
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const isMax = value === maxValue && maxValue > 0;
          
          return (
            <div key={scenario.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-dark-text">
                    {scenario.name}
                  </span>
                  {isMax && <Crown className="w-4 h-4 text-yellow-500" />}
                </div>
                <span className={cn("text-sm font-bold", colorClass)}>
                  {formatter(value)}
                </span>
              </div>
              
              <div className="w-full bg-dark-bg rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className={cn("h-2 rounded-full", colorClass.replace('text-', 'bg-'))}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ScenarioDetailsProps {
  scenario: ScenarioAnalysis;
  rank: number;
}

function ScenarioDetails({ scenario, rank }: ScenarioDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-orange-500" />;
      default: return <Star className="w-5 h-5 text-dark-text-secondary" />;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {getRankIcon(rank)}
            <h3 className="text-lg font-medium text-dark-text">{scenario.name}</h3>
          </div>
          
          {scenario.isBookmarked && (
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
          )}
        </div>
        
        {scenario.description && (
          <p className="text-sm text-dark-text-secondary">{scenario.description}</p>
        )}
      </div>

      {/* Key Metrics */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-dark-bg rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              +{scenario.improvement.toFixed(1)}
            </div>
            <div className="text-xs text-dark-text-secondary">DII Improvement</div>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">
              {scenario.roi.toFixed(0)}%
            </div>
            <div className="text-xs text-dark-text-secondary">ROI</div>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">
              {formatCurrency(scenario.totalCost)}
            </div>
            <div className="text-xs text-dark-text-secondary">Investment</div>
          </div>
          
          <div className="bg-dark-bg rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-500 mb-1">
              {scenario.totalTimeMonths}mo
            </div>
            <div className="text-xs text-dark-text-secondary">Timeline</div>
          </div>
        </div>

        {/* Actions Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-dark-text">
              {scenario.actions.length} Improvements
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-primary-600 hover:text-primary-500"
            >
              {isExpanded ? 'Show Less' : 'Show Details'}
            </button>
          </div>
          
          {isExpanded ? (
            <div className="space-y-2">
              {scenario.actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between py-2 px-3 bg-dark-bg rounded text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs bg-primary-600/20 text-primary-400 rounded">
                      {action.dimension}
                    </span>
                    <span className="text-dark-text">{action.title}</span>
                  </div>
                  <span className="text-dark-text-secondary">
                    +{action.scoreImprovement.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {scenario.actions.slice(0, 5).map((action) => (
                <span
                  key={action.id}
                  className="px-2 py-1 text-xs bg-primary-600/20 text-primary-400 rounded"
                >
                  {action.dimension}
                </span>
              ))}
              {scenario.actions.length > 5 && (
                <span className="px-2 py-1 text-xs bg-dark-bg text-dark-text-secondary rounded">
                  +{scenario.actions.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ScenarioComparison() {
  const { comparisonResult, setViewMode } = useScenarioStore();
  
  if (!comparisonResult) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setViewMode('list')}
            className="p-2 text-dark-text-secondary hover:text-dark-text rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-light text-dark-text">Scenario Comparison</h1>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
          <BarChart3 className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-medium text-dark-text mb-2">No Scenarios to Compare</h3>
          <p className="text-dark-text-secondary mb-6">
            Select 2 or more scenarios from the dashboard to see a detailed comparison.
          </p>
          <button
            onClick={() => setViewMode('list')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { scenarios, recommendations } = comparisonResult;
  
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setViewMode('list')}
            className="p-2 text-dark-text-secondary hover:text-dark-text rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-3xl font-light text-dark-text">Scenario Comparison</h1>
            <p className="text-dark-text-secondary">
              Comparing {scenarios.length} scenarios to find the best approach
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations Banner */}
      <div className="bg-gradient-to-r from-primary-600/20 to-blue-600/20 border border-primary-600/30 rounded-lg p-6">
        <h3 className="font-medium text-dark-text mb-4">AI Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-dark-surface/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-dark-text-secondary">Most Impactful</span>
            </div>
            <div className="font-medium text-dark-text">
              {scenarios.find(s => s.id === recommendations.mostImpactful)?.name || 'N/A'}
            </div>
          </div>

          <div className="bg-dark-surface/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-sm text-dark-text-secondary">Best ROI</span>
            </div>
            <div className="font-medium text-dark-text">
              {scenarios.find(s => s.id === recommendations.bestROI)?.name || 'N/A'}
            </div>
          </div>

          <div className="bg-dark-surface/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-dark-text-secondary">Fastest</span>
            </div>
            <div className="font-medium text-dark-text">
              {scenarios.find(s => s.id === recommendations.fastest)?.name || 'N/A'}
            </div>
          </div>

          <div className="bg-dark-surface/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-dark-text-secondary">Most Affordable</span>
            </div>
            <div className="font-medium text-dark-text">
              {scenarios.find(s => s.id === recommendations.cheapest)?.name || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Metric Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricComparison
          scenarios={scenarios}
          metric="improvement"
          title="DII Score Improvement"
          icon={TrendingUp}
          formatter={(value) => `+${value.toFixed(1)}`}
          colorClass="text-primary-600"
        />

        <MetricComparison
          scenarios={scenarios}
          metric="roi"
          title="Return on Investment"
          icon={Target}
          formatter={(value) => `${value.toFixed(0)}%`}
          colorClass="text-green-500"
        />

        <MetricComparison
          scenarios={scenarios}
          metric="cost"
          title="Total Investment"
          icon={DollarSign}
          formatter={formatCurrency}
          colorClass="text-blue-500"
        />

        <MetricComparison
          scenarios={scenarios}
          metric="time"
          title="Implementation Time"
          icon={Clock}
          formatter={(value) => `${value} months`}
          colorClass="text-orange-500"
        />
      </div>

      {/* Detailed Scenario Cards */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium text-dark-text">Detailed Analysis</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {scenarios
            .sort((a, b) => b.improvement - a.improvement) // Sort by impact
            .map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ScenarioDetails scenario={scenario} rank={index + 1} />
              </motion.div>
            ))}
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-dark-border">
          <h3 className="font-medium text-dark-text">Comparison Summary</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-bg">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-dark-text-secondary">Scenario</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-dark-text-secondary">DII Impact</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-dark-text-secondary">Investment</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-dark-text-secondary">Timeline</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-dark-text-secondary">ROI</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-dark-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario, index) => (
                <tr key={scenario.id} className={index % 2 === 0 ? 'bg-dark-surface' : 'bg-dark-bg'}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-dark-text">{scenario.name}</span>
                      {scenario.isBookmarked && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="font-medium text-primary-600">
                      +{scenario.improvement.toFixed(1)}
                    </span>
                  </td>
                  <td className="text-center py-4 px-4 text-dark-text">
                    {formatCurrency(scenario.totalCost)}
                  </td>
                  <td className="text-center py-4 px-4 text-dark-text">
                    {scenario.totalTimeMonths}mo
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="font-medium text-green-500">
                      {scenario.roi.toFixed(0)}%
                    </span>
                  </td>
                  <td className="text-center py-4 px-4 text-dark-text">
                    {scenario.actions.length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}