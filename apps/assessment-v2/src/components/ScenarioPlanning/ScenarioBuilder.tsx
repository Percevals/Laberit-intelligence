/**
 * Scenario Builder Component
 * Interactive tool for creating what-if scenarios
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Minus,
  TrendingUp,
  DollarSign,
  Clock,
  Target,
  Users,
  AlertCircle,
  CheckCircle2,
  Calculator,
  Save,
  Eye
} from 'lucide-react';
import { useScenarioStore } from '@/store/scenario-store';
import { useDIIDimensionsStore } from '@/store/dii-dimensions-store';
import type { ImprovementAction, DIIDimension } from '@/services/scenario-engine';
import { cn } from '@shared/utils/cn';

interface ActionSelectorProps {
  dimension: DIIDimension;
  actions: ImprovementAction[];
  selectedActions: string[];
  onToggleAction: (actionId: string) => void;
}

function ActionSelector({ dimension, actions, selectedActions, onToggleAction }: ActionSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const selectedCount = actions.filter(action => selectedActions.includes(action.id)).length;
  const totalImpact = actions
    .filter(action => selectedActions.includes(action.id))
    .reduce((sum, action) => sum + action.scoreImprovement, 0);

  const getDimensionInfo = (dim: DIIDimension) => {
    const info = {
      TRD: { name: 'Time to Revenue Damage', color: 'text-red-400 bg-red-400/10' },
      AER: { name: 'Attack Economic Reward', color: 'text-green-400 bg-green-400/10' },
      HFP: { name: 'Human Failure Probability', color: 'text-blue-400 bg-blue-400/10' },
      BRI: { name: 'Business Risk Impact', color: 'text-purple-400 bg-purple-400/10' },
      RRG: { name: 'Recovery Resource Gap', color: 'text-orange-400 bg-orange-400/10' }
    };
    return info[dim];
  };

  const dimInfo = getDimensionInfo(dimension);

  if (actions.length === 0) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <span className={cn("px-3 py-1 rounded-full text-sm", dimInfo.color)}>
            {dimension}
          </span>
          <div className="flex-1">
            <h4 className="font-medium text-dark-text">{dimInfo.name}</h4>
            <p className="text-sm text-dark-text-secondary">No improvements available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-dark-bg transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={cn("px-3 py-1 rounded-full text-sm", dimInfo.color)}>
            {dimension}
          </span>
          <div className="text-left">
            <h4 className="font-medium text-dark-text">{dimInfo.name}</h4>
            <p className="text-sm text-dark-text-secondary">
              {selectedCount} of {actions.length} selected
              {totalImpact > 0 && ` • +${totalImpact.toFixed(1)} pts`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-4 h-4 text-dark-text-secondary" />
          </motion.div>
        </div>
      </button>

      {/* Actions List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-dark-border"
          >
            <div className="p-4 space-y-3">
              {actions.map((action) => (
                <ActionCard
                  key={action.id}
                  action={action}
                  isSelected={selectedActions.includes(action.id)}
                  onToggle={() => onToggleAction(action.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ActionCardProps {
  action: ImprovementAction;
  isSelected: boolean;
  onToggle: () => void;
}

function ActionCard({ action, isSelected, onToggle }: ActionCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const roi = (action.annualRiskCost / action.implementationCost) * 100;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all",
        isSelected 
          ? "border-primary-600 bg-primary-600/10" 
          : "border-dark-border hover:border-primary-600/50"
      )}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
          />
        </div>
        
        <div className="flex-1 space-y-3">
          {/* Title and Description */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h5 className="font-medium text-dark-text">{action.title}</h5>
              {action.quickWins && (
                <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                  Quick Win
                </span>
              )}
            </div>
            <p className="text-sm text-dark-text-secondary line-clamp-2">
              {action.description}
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-dark-text-secondary">Impact</span>
              </div>
              <div className="text-sm font-medium text-dark-text">
                +{action.scoreImprovement.toFixed(1)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-blue-500" />
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
                {action.timeToImplement}mo
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3 text-purple-500" />
                <span className="text-xs text-dark-text-secondary">ROI</span>
              </div>
              <div className="text-sm font-medium text-dark-text">
                {roi.toFixed(0)}%
              </div>
            </div>
          </div>

          {/* Business Justification */}
          <div className="bg-dark-bg rounded-lg p-3">
            <p className="text-xs text-dark-text-secondary">
              <span className="font-medium text-dark-text">Business Impact:</span> {action.businessJustification}
            </p>
          </div>

          {/* Stakeholders */}
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-dark-text-secondary" />
            <div className="flex flex-wrap gap-1">
              {action.stakeholders.map((stakeholder) => (
                <span
                  key={stakeholder}
                  className="px-2 py-0.5 text-xs bg-dark-bg text-dark-text-secondary rounded"
                >
                  {stakeholder}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ScenarioBuilder() {
  const {
    availableImprovements,
    selectedActions,
    scenarioBuilder,
    setViewMode,
    updateScenarioBuilder,
    addActionToBuilder,
    removeActionFromBuilder,
    buildScenario,
    clearScenarioBuilder
  } = useScenarioStore();

  const { currentDII } = useDIIDimensionsStore();
  
  const [impact, setImpact] = useState({ newDII: 0, improvement: 0, dimensionChanges: {} });
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate scenario impact
  useEffect(() => {
    if (selectedActions.length > 0) {
      setIsCalculating(true);
      // Simulate calculation delay for better UX
      const timer = setTimeout(() => {
        // In a real app, this would call the scenario engine
        const mockImpact = {
          newDII: (currentDII?.score || 0) + selectedActions.length * 3.5,
          improvement: selectedActions.length * 3.5,
          dimensionChanges: {}
        };
        setImpact(mockImpact);
        setIsCalculating(false);
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setImpact({ newDII: currentDII?.score || 0, improvement: 0, dimensionChanges: {} });
    }
  }, [selectedActions, currentDII]);

  const handleToggleAction = (actionId: string) => {
    if (selectedActions.includes(actionId)) {
      removeActionFromBuilder(actionId);
    } else {
      addActionToBuilder(actionId);
    }
  };

  const handleSave = () => {
    if (!scenarioBuilder.name.trim()) {
      alert('Please enter a scenario name');
      return;
    }
    buildScenario();
  };

  const canSave = scenarioBuilder.name.trim() && selectedActions.length > 0;

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
            <h1 className="text-3xl font-light text-dark-text">Scenario Builder</h1>
            <p className="text-dark-text-secondary">
              Select improvements to create your what-if scenario
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={clearScenarioBuilder}
            className="px-4 py-2 text-dark-text-secondary hover:text-dark-text border border-dark-border rounded-lg transition-colors"
          >
            Clear All
          </button>
          
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-lg transition-colors",
              canSave
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-dark-border text-dark-text-secondary cursor-not-allowed"
            )}
          >
            <Save className="w-4 h-4" />
            Save Scenario
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Actions Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scenario Info */}
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
            <h3 className="font-medium text-dark-text mb-4">Scenario Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Scenario Name *
                </label>
                <input
                  type="text"
                  value={scenarioBuilder.name}
                  onChange={(e) => updateScenarioBuilder({ name: e.target.value })}
                  placeholder="e.g., Quick Security Wins, Strategic Transformation"
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-text-secondary focus:outline-none focus:border-primary-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Description
                </label>
                <textarea
                  value={scenarioBuilder.description}
                  onChange={(e) => updateScenarioBuilder({ description: e.target.value })}
                  placeholder="Describe the goal and context for this scenario..."
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-text-secondary focus:outline-none focus:border-primary-600 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Available Improvements by Dimension */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-dark-text">Available Improvements</h3>
            
            {Object.entries(availableImprovements).map(([dimension, actions]) => (
              <ActionSelector
                key={dimension}
                dimension={dimension as DIIDimension}
                actions={actions}
                selectedActions={selectedActions}
                onToggleAction={handleToggleAction}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Impact Analysis */}
        <div className="space-y-6">
          {/* Impact Summary */}
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-primary-600" />
              <h3 className="font-medium text-dark-text">Impact Analysis</h3>
            </div>

            {selectedActions.length === 0 ? (
              <div className="text-center py-6">
                <AlertCircle className="w-8 h-8 text-dark-text-secondary mx-auto mb-2" />
                <p className="text-sm text-dark-text-secondary">
                  Select improvements to see impact analysis
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* DII Impact */}
                <div className="bg-primary-600/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-text-secondary">DII Score</span>
                    {isCalculating && (
                      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-dark-text">
                      {Math.round(impact.newDII)}
                    </span>
                    <span className="text-sm text-primary-600">
                      +{impact.improvement.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-dark-text-secondary mt-1">
                    From {currentDII?.score || 0}
                  </div>
                </div>

                {/* Selected Actions Summary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-dark-text-secondary">Selected Actions</span>
                    <span className="text-sm font-medium text-dark-text">
                      {selectedActions.length}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedActions.slice(0, 3).map((actionId) => {
                      const action = Object.values(availableImprovements)
                        .flat()
                        .find(a => a.id === actionId);
                      
                      if (!action) return null;
                      
                      return (
                        <div
                          key={actionId}
                          className="flex items-center justify-between py-2 px-3 bg-dark-bg rounded text-sm"
                        >
                          <span className="text-dark-text truncate">{action.title}</span>
                          <button
                            onClick={() => removeActionFromBuilder(actionId)}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                    
                    {selectedActions.length > 3 && (
                      <div className="text-center py-1 text-xs text-dark-text-secondary">
                        +{selectedActions.length - 3} more actions
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Financial Summary */}
          {selectedActions.length > 0 && (
            <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
              <h4 className="font-medium text-dark-text mb-4">Financial Summary</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-dark-text-secondary">Total Investment</span>
                  <span className="text-sm font-medium text-dark-text">$245K</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-dark-text-secondary">Annual Savings</span>
                  <span className="text-sm font-medium text-green-500">$380K</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-dark-text-secondary">ROI</span>
                  <span className="text-sm font-medium text-green-500">155%</span>
                </div>
                
                <div className="flex justify-between pt-2 border-t border-dark-border">
                  <span className="text-sm text-dark-text-secondary">Payback Period</span>
                  <span className="text-sm font-medium text-dark-text">7.7 months</span>
                </div>
              </div>
            </div>
          )}

          {/* Preview Button */}
          {selectedActions.length > 0 && (
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-dark-border text-dark-text rounded-lg hover:bg-dark-bg transition-colors">
              <Eye className="w-4 h-4" />
              Preview Full Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}