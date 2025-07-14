/**
 * Roadmap Planner Component
 * Timeline-based planning for achieving target DII scores
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Target,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  MapPin,
  Flag,
  ChevronRight,
  Download,
  Share
} from 'lucide-react';
import { useScenarioStore } from '@/store/scenario-store';
import { useDIIDimensionsStore } from '@/store/dii-dimensions-store';
import type { ImplementationPhase, ImprovementAction } from '@/services/scenario-engine';
import { cn } from '@shared/utils/cn';

interface PhaseCardProps {
  phase: ImplementationPhase;
  actions: ImprovementAction[];
  isActive: boolean;
  onToggle: () => void;
}

function PhaseCard({ phase, actions, isActive, onToggle }: PhaseCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const phaseActions = actions.filter(action => phase.actions.includes(action.id));

  return (
    <motion.div
      layout
      className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden"
    >
      {/* Phase Header */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-dark-bg transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-600 text-white rounded-full font-bold">
            {phase.phase}
          </div>
          
          <div className="text-left">
            <h3 className="text-lg font-medium text-dark-text">{phase.name}</h3>
            <p className="text-sm text-dark-text-secondary">
              {phase.duration} months • {formatCurrency(phase.cost)} • {phaseActions.length} actions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-dark-text">
              Target DII: {phase.expectedDII.toFixed(1)}
            </div>
            <div className="text-xs text-dark-text-secondary">
              {phaseActions.reduce((sum, action) => sum + action.scoreImprovement, 0).toFixed(1)} point improvement
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: isActive ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-dark-text-secondary" />
          </motion.div>
        </div>
      </button>

      {/* Phase Details */}
      {isActive && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-dark-border"
        >
          <div className="p-6 space-y-6">
            {/* Key Milestones */}
            <div>
              <h4 className="font-medium text-dark-text mb-3">Key Milestones</h4>
              <div className="space-y-2">
                {phase.keyMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Flag className="w-4 h-4 text-primary-600" />
                    <span className="text-sm text-dark-text">{milestone}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions in Phase */}
            <div>
              <h4 className="font-medium text-dark-text mb-3">
                Improvements ({phaseActions.length})
              </h4>
              <div className="space-y-3">
                {phaseActions.map((action) => (
                  <div
                    key={action.id}
                    className="bg-dark-bg rounded-lg p-4 border border-dark-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-dark-text">{action.title}</h5>
                          <span className="px-2 py-0.5 text-xs bg-primary-600/20 text-primary-400 rounded">
                            {action.dimension}
                          </span>
                          {action.quickWins && (
                            <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                              Quick Win
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-dark-text-secondary mb-3">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-dark-text">
                          +{action.scoreImprovement.toFixed(1)}
                        </div>
                        <div className="text-xs text-dark-text-secondary">Impact</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-dark-text">
                          {formatCurrency(action.implementationCost)}
                        </div>
                        <div className="text-xs text-dark-text-secondary">Cost</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-dark-text">
                          {action.timeToImplement}mo
                        </div>
                        <div className="text-xs text-dark-text-secondary">Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-dark-text">
                          {((action.annualRiskCost / action.implementationCost) * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-dark-text-secondary">ROI</div>
                      </div>
                    </div>

                    {/* Stakeholders */}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-dark-text-secondary" />
                      <div className="flex flex-wrap gap-1">
                        {action.stakeholders.map((stakeholder) => (
                          <span
                            key={stakeholder}
                            className="px-2 py-0.5 text-xs bg-dark-surface text-dark-text-secondary rounded border border-dark-border"
                          >
                            {stakeholder}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function RoadmapPlanner() {
  const {
    targetDII,
    roadmapAnalysis,
    setViewMode,
    availableImprovements
  } = useScenarioStore();

  const { currentDII } = useDIIDimensionsStore();
  
  const [activePhase, setActivePhase] = useState<number | null>(1);
  const [viewType, setViewType] = useState<'timeline' | 'gantt'>('timeline');

  if (!roadmapAnalysis || !targetDII) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setViewMode('list')}
            className="p-2 text-dark-text-secondary hover:text-dark-text rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-light text-dark-text">Roadmap Planner</h1>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-dark-text mb-2">No Roadmap Generated</h3>
          <p className="text-dark-text-secondary mb-6">
            Please set a target DII score and generate a roadmap from the dashboard.
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

  const allActions = Object.values(availableImprovements).flat();
  const currentScore = currentDII?.score || 0;
  const improvement = targetDII - currentScore;

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
            <h1 className="text-3xl font-light text-dark-text">Implementation Roadmap</h1>
            <p className="text-dark-text-secondary">
              Strategic path to achieve DII score of {targetDII}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-dark-surface border border-dark-border rounded-lg p-1">
            <button
              onClick={() => setViewType('timeline')}
              className={cn(
                "px-3 py-1 text-sm rounded transition-colors",
                viewType === 'timeline'
                  ? "bg-primary-600 text-white"
                  : "text-dark-text-secondary hover:text-dark-text"
              )}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewType('gantt')}
              className={cn(
                "px-3 py-1 text-sm rounded transition-colors",
                viewType === 'gantt'
                  ? "bg-primary-600 text-white"
                  : "text-dark-text-secondary hover:text-dark-text"
              )}
            >
              Gantt Chart
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-dark-surface border border-dark-border text-dark-text rounded-lg hover:bg-dark-bg transition-colors">
            <Share className="w-4 h-4" />
            Share
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-primary-600" />
            <span className="text-sm text-dark-text-secondary">Target Achievement</span>
          </div>
          <div className="text-2xl font-bold text-dark-text">
            {roadmapAnalysis.isAchievable ? 'Achievable' : 'Challenging'}
          </div>
          <div className="text-sm text-dark-text-secondary">
            {improvement > 0 ? `+${improvement.toFixed(1)} points needed` : 'Target already met'}
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-sm text-dark-text-secondary">Total Investment</span>
          </div>
          <div className="text-2xl font-bold text-dark-text">
            ${(roadmapAnalysis.estimatedCost / 1000).toFixed(0)}K
          </div>
          <div className="text-sm text-dark-text-secondary">
            {roadmapAnalysis.recommendedActions.length} improvements
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-dark-text-secondary">Timeline</span>
          </div>
          <div className="text-2xl font-bold text-dark-text">
            {roadmapAnalysis.estimatedTime}mo
          </div>
          <div className="text-sm text-dark-text-secondary">
            {roadmapAnalysis.phases.length} phases
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-dark-text-secondary">Expected ROI</span>
          </div>
          <div className="text-2xl font-bold text-dark-text">
            {roadmapAnalysis.recommendedActions.length > 0 
              ? Math.round(roadmapAnalysis.recommendedActions.reduce((sum, action) => sum + (action.annualRiskCost / action.implementationCost) * 100, 0) / roadmapAnalysis.recommendedActions.length)
              : 0}%
          </div>
          <div className="text-sm text-dark-text-secondary">
            Average annual return
          </div>
        </div>
      </div>

      {/* Feasibility Alert */}
      {!roadmapAnalysis.isAchievable && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-600 mb-1">Target May Be Challenging</h4>
              <p className="text-sm text-yellow-600/80">
                The target DII score of {targetDII} requires significant improvements across multiple dimensions. 
                Consider adjusting the target or extending the timeline for better feasibility.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Implementation Phases */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium text-dark-text">Implementation Phases</h3>
          <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>{roadmapAnalysis.phases.length} phases over {roadmapAnalysis.estimatedTime} months</span>
          </div>
        </div>

        <div className="space-y-4">
          {roadmapAnalysis.phases.map((phase) => (
            <PhaseCard
              key={phase.phase}
              phase={phase}
              actions={allActions}
              isActive={activePhase === phase.phase}
              onToggle={() => setActivePhase(activePhase === phase.phase ? null : phase.phase)}
            />
          ))}
        </div>
      </div>

      {/* Timeline Visualization */}
      {viewType === 'timeline' && (
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <h4 className="font-medium text-dark-text mb-6">Implementation Timeline</h4>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-dark-border"></div>
            
            {/* Timeline Points */}
            <div className="space-y-8">
              {/* Start Point */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-3 h-3 bg-dark-text-secondary rounded-full"></div>
                  <div className="absolute -left-1 -top-1 w-5 h-5 border-2 border-dark-text-secondary rounded-full"></div>
                </div>
                <div>
                  <div className="font-medium text-dark-text">Starting Point</div>
                  <div className="text-sm text-dark-text-secondary">
                    Current DII: {currentScore} • Month 0
                  </div>
                </div>
              </div>

              {/* Phase Milestones */}
              {roadmapAnalysis.phases.map((phase, index) => {
                const cumulativeMonths = roadmapAnalysis.phases
                  .slice(0, index + 1)
                  .reduce((sum, p) => sum + p.duration, 0);
                
                return (
                  <div key={phase.phase} className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                      <div className="absolute -left-1 -top-1 w-5 h-5 border-2 border-primary-600 rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium text-dark-text">
                        {phase.name} Complete
                      </div>
                      <div className="text-sm text-dark-text-secondary">
                        DII: {phase.expectedDII.toFixed(1)} • Month {cumulativeMonths}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* End Point */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="absolute -left-1 -top-1 w-5 h-5 border-2 border-green-500 rounded-full"></div>
                </div>
                <div>
                  <div className="font-medium text-green-500">Target Achieved</div>
                  <div className="text-sm text-dark-text-secondary">
                    DII: {targetDII} • Month {roadmapAnalysis.estimatedTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-primary-600/10 border border-primary-600/20 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-primary-600 mt-1" />
          <div className="flex-1">
            <h4 className="font-medium text-primary-600 mb-2">Ready to Start Implementation?</h4>
            <p className="text-sm text-primary-600/80 mb-4">
              This roadmap provides a strategic path to achieve your target DII score. 
              You can save this as a scenario for detailed tracking and execution planning.
            </p>
            
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Save as Scenario
              </button>
              <button className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600/10 transition-colors">
                Customize Roadmap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}