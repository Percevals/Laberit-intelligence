/**
 * Quick Wins Panel
 * Display high-impact, low-effort improvements
 */

import { motion } from 'framer-motion';
import {
  Zap,
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  Plus,
  ArrowRight,
  Shield,
  Target
} from 'lucide-react';
import { useScenarioStore } from '@/store/scenario-store';
import type { ImprovementAction } from '@/services/scenario-engine';
import { cn } from '@shared/utils/cn';

interface QuickWinCardProps {
  action: ImprovementAction;
  onAddToScenario: (actionId: string) => void;
}

function QuickWinCard({ action, onAddToScenario }: QuickWinCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const roi = (action.annualRiskCost / action.implementationCost) * 100;

  const getDimensionColor = (dimension: string) => {
    const colors = {
      TRD: 'text-red-400 bg-red-400/10',
      AER: 'text-green-400 bg-green-400/10',
      HFP: 'text-blue-400 bg-blue-400/10',
      BRI: 'text-purple-400 bg-purple-400/10',
      RRG: 'text-orange-400 bg-orange-400/10'
    };
    return colors[dimension as keyof typeof colors] || 'text-gray-400 bg-gray-400/10';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="bg-dark-surface border border-dark-border rounded-lg p-4 hover:border-primary-600/50 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("px-2 py-1 text-xs rounded-full", getDimensionColor(action.dimension))}>
            {action.dimension}
          </span>
          <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded-full">
            Quick Win
          </span>
        </div>
        
        <button
          onClick={() => onAddToScenario(action.id)}
          className="p-1 text-primary-600 hover:text-primary-500 rounded transition-colors"
          title="Add to scenario"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Title and Description */}
      <div className="mb-4">
        <h4 className="font-medium text-dark-text mb-1 line-clamp-1">
          {action.title}
        </h4>
        <p className="text-sm text-dark-text-secondary line-clamp-2">
          {action.description}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-xs text-dark-text-secondary">Impact</span>
          </div>
          <div className="text-sm font-medium text-dark-text">
            +{action.scoreImprovement.toFixed(1)} pts
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-blue-500" />
            <span className="text-xs text-dark-text-secondary">ROI</span>
          </div>
          <div className="text-sm font-medium text-dark-text">
            {roi.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-green-500" />
            <span className="text-xs text-dark-text-secondary">Cost</span>
          </div>
          <div className="text-sm font-medium text-dark-text">
            {formatCurrency(action.implementationCost)}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-orange-500" />
            <span className="text-xs text-dark-text-secondary">Time</span>
          </div>
          <div className="text-sm font-medium text-dark-text">
            {action.timeToImplement} month{action.timeToImplement !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Business Justification */}
      <div className="mb-4">
        <p className="text-xs text-dark-text-secondary line-clamp-2">
          <span className="font-medium">Why:</span> {action.businessJustification}
        </p>
      </div>

      {/* Stakeholders */}
      <div className="flex items-center gap-2">
        <Users className="w-3 h-3 text-dark-text-secondary" />
        <div className="flex flex-wrap gap-1">
          {action.stakeholders.slice(0, 2).map((stakeholder) => (
            <span
              key={stakeholder}
              className="px-1 py-0.5 text-xs bg-dark-bg text-dark-text-secondary rounded"
            >
              {stakeholder}
            </span>
          ))}
          {action.stakeholders.length > 2 && (
            <span className="px-1 py-0.5 text-xs bg-dark-bg text-dark-text-secondary rounded">
              +{action.stakeholders.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function QuickWinsPanel() {
  const { quickWins, startScenarioBuilder, addActionToBuilder } = useScenarioStore();

  const handleAddToScenario = (actionId: string) => {
    addActionToBuilder(actionId);
    startScenarioBuilder();
  };

  const totalPotentialImpact = quickWins.reduce((sum, action) => sum + action.scoreImprovement, 0);
  const totalPotentialCost = quickWins.reduce((sum, action) => sum + action.implementationCost, 0);
  const avgROI = quickWins.length > 0 
    ? quickWins.reduce((sum, action) => sum + (action.annualRiskCost / action.implementationCost) * 100, 0) / quickWins.length
    : 0;

  if (quickWins.length === 0) {
    return (
      <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
        <div className="text-center">
          <Zap className="w-8 h-8 text-dark-text-secondary mx-auto mb-2" />
          <h3 className="font-medium text-dark-text mb-1">No Quick Wins Available</h3>
          <p className="text-sm text-dark-text-secondary">
            All available quick wins have been identified based on your current immunity profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-medium text-dark-text">Quick Wins</h3>
            <p className="text-sm text-dark-text-secondary">
              High-impact, low-effort improvements you can implement immediately
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            // Add all quick wins to scenario builder
            quickWins.forEach(action => addActionToBuilder(action.id));
            startScenarioBuilder();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Scenario
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-dark-text-secondary">Potential Impact</span>
          </div>
          <div className="text-lg font-bold text-dark-text">
            +{totalPotentialImpact.toFixed(1)}
          </div>
          <div className="text-xs text-dark-text-secondary">DII points</div>
        </div>

        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm text-dark-text-secondary">Total Investment</span>
          </div>
          <div className="text-lg font-bold text-dark-text">
            ${(totalPotentialCost / 1000).toFixed(0)}K
          </div>
          <div className="text-xs text-dark-text-secondary">One-time cost</div>
        </div>

        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-dark-text-secondary">Avg ROI</span>
          </div>
          <div className="text-lg font-bold text-dark-text">
            {avgROI.toFixed(0)}%
          </div>
          <div className="text-xs text-dark-text-secondary">Annual return</div>
        </div>

        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-dark-text-secondary">Quick Wins</span>
          </div>
          <div className="text-lg font-bold text-dark-text">
            {quickWins.length}
          </div>
          <div className="text-xs text-dark-text-secondary">Available now</div>
        </div>
      </div>

      {/* Quick Wins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickWins.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <QuickWinCard 
              action={action}
              onAddToScenario={handleAddToScenario}
            />
          </motion.div>
        ))}
      </div>

      {/* Action CTA */}
      <div className="mt-6 pt-6 border-t border-dark-border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-dark-text mb-1">Ready to get started?</h4>
            <p className="text-sm text-dark-text-secondary">
              Create a scenario with these quick wins to see the full impact on your DII score.
            </p>
          </div>
          
          <button
            onClick={() => {
              quickWins.forEach(action => addActionToBuilder(action.id));
              startScenarioBuilder();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-lg hover:from-primary-700 hover:to-blue-700 transition-all"
          >
            Build Scenario
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}