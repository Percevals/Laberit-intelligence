/**
 * Immunity Prescription Component
 * Display personalized action plan
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Zap,
  Rocket,
  AlertCircle,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Users
} from 'lucide-react';
import type { ImmunityPrescription as PrescriptionType, PrescriptionAction } from '@/services/intelligence-engine';
import { useIntelligenceStore } from '@/store/intelligence-store';
import { cn } from '@shared/utils/cn';

interface ImmunityPrescriptionProps {
  prescription: PrescriptionType;
}

export function ImmunityPrescription({ prescription }: ImmunityPrescriptionProps) {
  const { markActionComplete, completedActions } = useIntelligenceStore();
  const [selectedPhase, setSelectedPhase] = useState<'quickWins' | 'strategic' | 'critical'>('quickWins');
  const [expandedAction, setExpandedAction] = useState<string | null>(null);

  const getPhaseInfo = () => {
    switch (selectedPhase) {
      case 'quickWins':
        return {
          title: 'Quick Wins',
          subtitle: 'Low effort, high impact improvements',
          icon: Zap,
          color: 'text-green-500 bg-green-500/10',
          actions: prescription.quickWins
        };
      case 'strategic':
        return {
          title: 'Strategic Initiatives',
          subtitle: 'Medium to long-term transformations',
          icon: Rocket,
          color: 'text-blue-500 bg-blue-500/10',
          actions: prescription.strategic
        };
      case 'critical':
        return {
          title: 'Critical Actions',
          subtitle: 'Urgent improvements required',
          icon: AlertCircle,
          color: 'text-red-500 bg-red-500/10',
          actions: prescription.critical
        };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className="space-y-6">
      {/* Expected Outcomes */}
      <div className="bg-gradient-to-r from-primary-600/20 to-blue-600/20 border border-primary-600/30 rounded-lg p-6">
        <h3 className="text-lg font-medium text-dark-text mb-4">Expected Outcomes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-dark-surface/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-dark-text-secondary">Target DII</span>
            </div>
            <div className="text-2xl font-bold text-dark-text">
              {prescription.expectedOutcome.newDII}
            </div>
            <div className="text-xs text-green-500 mt-1">
              +{prescription.expectedOutcome.newDII - 50} points
            </div>
          </div>

          <div className="bg-dark-surface/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-dark-text-secondary">Risk Reduction</span>
            </div>
            <div className="text-2xl font-bold text-dark-text">
              {prescription.expectedOutcome.riskReduction}%
            </div>
            <div className="text-xs text-dark-text-secondary mt-1">
              Lower exposure
            </div>
          </div>

          <div className="bg-dark-surface/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-dark-text-secondary">Investment</span>
            </div>
            <div className="text-2xl font-bold text-dark-text">
              ${(prescription.expectedOutcome.investment / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-dark-text-secondary mt-1">
              Total budget
            </div>
          </div>

          <div className="bg-dark-surface/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-dark-text-secondary">Timeline</span>
            </div>
            <div className="text-2xl font-bold text-dark-text">
              {prescription.expectedOutcome.timeframe}
            </div>
            <div className="text-xs text-dark-text-secondary mt-1">
              Months
            </div>
          </div>
        </div>
      </div>

      {/* Phase Selector */}
      <div className="flex gap-4">
        {[
          { key: 'quickWins', label: 'Quick Wins', icon: Zap, count: prescription.quickWins.length },
          { key: 'strategic', label: 'Strategic', icon: Rocket, count: prescription.strategic.length },
          { key: 'critical', label: 'Critical', icon: AlertCircle, count: prescription.critical.length }
        ].map(phase => (
          <button
            key={phase.key}
            onClick={() => setSelectedPhase(phase.key as any)}
            className={cn(
              "flex-1 p-4 rounded-lg border transition-all",
              selectedPhase === phase.key
                ? "bg-primary-600/10 border-primary-600 text-primary-600"
                : "bg-dark-surface border-dark-border text-dark-text hover:border-primary-600/50"
            )}
          >
            <phase.icon className="w-5 h-5 mx-auto mb-2" />
            <div className="font-medium">{phase.label}</div>
            <div className="text-sm opacity-75">{phase.count} actions</div>
          </button>
        ))}
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", phaseInfo.color)}>
            <phaseInfo.icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-dark-text">{phaseInfo.title}</h3>
            <p className="text-sm text-dark-text-secondary">{phaseInfo.subtitle}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {phaseInfo.actions.map((action) => (
              <ActionItem
                key={action.id}
                action={action}
                isCompleted={completedActions.includes(action.id)}
                isExpanded={expandedAction === action.id}
                onToggle={() => setExpandedAction(expandedAction === action.id ? null : action.id)}
                onComplete={() => markActionComplete(action.id)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Implementation Timeline */}
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-dark-text mb-4">Implementation Timeline</h3>
        
        <div className="space-y-4">
          {Object.entries(prescription.timeline).map(([phase, data], index) => (
            <div key={phase} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                  index === 0 ? "bg-primary-600 text-white" : "bg-dark-bg text-dark-text"
                )}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className="w-0.5 h-16 bg-dark-border mt-2" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-dark-text mb-1">{data.name}</h4>
                <p className="text-sm text-dark-text-secondary mb-2">{data.focus}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-dark-text-secondary">
                    {data.actions.length} actions
                  </span>
                  <span className="text-green-500">
                    +{data.expectedImprovement} DII points
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-dark-text">
                  {phase === 'phase1' ? '0-3' : phase === 'phase2' ? '3-9' : '9-18'} months
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Action Item Component
interface ActionItemProps {
  action: PrescriptionAction;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onComplete: () => void;
}

function ActionItem({ action, isCompleted, isExpanded, onToggle, onComplete }: ActionItemProps) {
  const getPriorityColor = () => {
    switch (action.priority) {
      case 'Critical': return 'text-red-500 bg-red-500/10';
      case 'High': return 'text-orange-500 bg-orange-500/10';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'Low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getEffortIndicator = () => {
    switch (action.effort) {
      case 'Low': return '●○○';
      case 'Medium': return '●●○';
      case 'High': return '●●●';
      default: return '○○○';
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        "bg-dark-surface border rounded-lg overflow-hidden transition-all",
        isCompleted ? "border-green-500/30" : "border-dark-border hover:border-primary-600/50"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h4 className={cn(
                "font-medium",
                isCompleted ? "text-dark-text-secondary line-through" : "text-dark-text"
              )}>
                {action.title}
              </h4>
              
              <div className="flex items-center gap-2">
                <span className={cn("px-2 py-0.5 text-xs rounded", getPriorityColor())}>
                  {action.priority}
                </span>
                <ChevronRight className={cn(
                  "w-4 h-4 text-dark-text-secondary transition-transform",
                  isExpanded && "rotate-90"
                )} />
              </div>
            </div>
            
            <p className="text-sm text-dark-text-secondary mb-3">
              {action.description}
            </p>
            
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-dark-text-secondary" />
                <span className="text-dark-text-secondary">{action.timeframe}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-dark-text-secondary">Effort:</span>
                <span className="text-primary-600">{getEffortIndicator()}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-dark-text-secondary">Impact:</span>
                <span className="text-green-500">{action.impact}</span>
              </div>
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-dark-border"
          >
            <div className="p-4 space-y-3">
              {/* Rationale */}
              <div>
                <h5 className="text-sm font-medium text-dark-text mb-1">Why this matters for you</h5>
                <p className="text-sm text-dark-text-secondary">{action.rationale}</p>
              </div>
              
              {/* Specific Context */}
              <div>
                <h5 className="text-sm font-medium text-dark-text mb-1">Specific to your context</h5>
                <div className="flex flex-wrap gap-1">
                  {action.specificTo.map((context, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-dark-bg text-dark-text-secondary rounded"
                    >
                      {context}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Dependencies */}
              {action.dependencies.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-dark-text mb-1">Dependencies</h5>
                  <div className="space-y-1">
                    {action.dependencies.map((dep, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-dark-text-secondary">
                        <div className="w-1 h-1 bg-dark-text-secondary rounded-full" />
                        {dep}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Button */}
              <div className="pt-3 flex items-center gap-3">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm">
                  Start Planning
                </button>
                
                <button className="px-4 py-2 text-primary-600 hover:text-primary-500 text-sm">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}