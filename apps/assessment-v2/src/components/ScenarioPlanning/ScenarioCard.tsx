/**
 * Scenario Card Component
 * Individual scenario display with metrics and actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  MoreVertical,
  Copy,
  Trash2,
  Download,
  Eye,
  CheckCircle2
} from 'lucide-react';
import type { ScenarioAnalysis } from '@/services/scenario-engine';
import { useScenarioStore } from '@/store/scenario-store';
import { cn } from '@shared/utils/cn';

interface ScenarioCardProps {
  scenario: ScenarioAnalysis;
  isSelected: boolean;
  onSelect: (scenarioId: string, selected: boolean) => void;
}

export function ScenarioCard({ 
  scenario, 
  isSelected, 
  onSelect 
}: ScenarioCardProps) {
  const {
    setActiveScenario,
    bookmarkScenario,
    duplicateScenario,
    deleteScenario,
    exportScenario
  } = useScenarioStore();

  const [showActions, setShowActions] = React.useState(false);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatDuration = (months: number) => {
    if (months >= 12) {
      return `${(months / 12).toFixed(1)}y`;
    }
    return `${months}mo`;
  };

  const getImpactColor = (improvement: number) => {
    if (improvement >= 20) return 'text-green-500';
    if (improvement >= 10) return 'text-blue-500';
    if (improvement >= 5) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'text-green-500';
    if (roi >= 100) return 'text-blue-500';
    if (roi >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleCardClick = () => {
    setActiveScenario(scenario.id);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(scenario.id, e.target.checked);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    bookmarkScenario(scenario.id);
  };

  const handleDuplicate = () => {
    duplicateScenario(scenario.id);
    setShowActions(false);
  };

  const handleDelete = () => {
    deleteScenario(scenario.id);
    setShowActions(false);
  };

  const handleExport = (format: 'json' | 'csv') => {
    exportScenario(scenario.id, format);
    setShowActions(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        "bg-dark-surface border border-dark-border rounded-lg p-6 cursor-pointer transition-all relative",
        isSelected && "border-primary-600 bg-primary-600/10",
        "hover:border-primary-600/50"
      )}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelectChange}
            className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-dark-text line-clamp-1">
                {scenario.name}
              </h3>
              
              <button
                onClick={handleBookmark}
                className={cn(
                  "p-1 rounded transition-colors",
                  scenario.isBookmarked 
                    ? "text-yellow-500 hover:text-yellow-600" 
                    : "text-dark-text-secondary hover:text-yellow-500"
                )}
              >
                <Star className={cn("w-4 h-4", scenario.isBookmarked && "fill-current")} />
              </button>
            </div>
            
            {scenario.description && (
              <p className="text-sm text-dark-text-secondary line-clamp-2">
                {scenario.description}
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-1 text-dark-text-secondary hover:text-dark-text rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-6 bg-dark-surface border border-dark-border rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
              <button
                onClick={(e) => { e.stopPropagation(); handleCardClick(); setShowActions(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dark-text hover:bg-dark-bg transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDuplicate(); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dark-text hover:bg-dark-bg transition-colors"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <div className="border-t border-dark-border my-1" />
              <button
                onClick={(e) => { e.stopPropagation(); handleExport('json'); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dark-text hover:bg-dark-bg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleExport('csv'); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-dark-text hover:bg-dark-bg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <div className="border-t border-dark-border my-1" />
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className={cn("w-4 h-4", getImpactColor(scenario.improvement))} />
            <span className="text-xs text-dark-text-secondary">DII Impact</span>
          </div>
          <div className="text-lg font-bold text-dark-text">
            +{scenario.improvement.toFixed(1)}
          </div>
          <div className="text-xs text-dark-text-secondary">
            {scenario.currentDII} → {scenario.targetDII.toFixed(1)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className={cn("w-4 h-4", getROIColor(scenario.roi))} />
            <span className="text-xs text-dark-text-secondary">ROI</span>
          </div>
          <div className="text-lg font-bold text-dark-text">
            {scenario.roi.toFixed(0)}%
          </div>
          <div className="text-xs text-dark-text-secondary">
            {scenario.paybackMonths < 999 ? `${scenario.paybackMonths.toFixed(1)}mo payback` : 'No payback'}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-xs text-dark-text-secondary">Investment</span>
          </div>
          <div className="text-sm font-medium text-dark-text">
            {formatCurrency(scenario.totalCost)}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-dark-text-secondary">Timeline</span>
          </div>
          <div className="text-sm font-medium text-dark-text">
            {formatDuration(scenario.totalTimeMonths)}
          </div>
        </div>
      </div>

      {/* Actions Preview */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary-600" />
          <span className="text-xs text-dark-text-secondary">
            {scenario.actions.length} action{scenario.actions.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {scenario.actions.slice(0, 3).map((action) => (
            <span
              key={action.id}
              className="px-2 py-1 text-xs bg-primary-600/20 text-primary-400 rounded"
            >
              {action.dimension}
            </span>
          ))}
          {scenario.actions.length > 3 && (
            <span className="px-2 py-1 text-xs bg-dark-bg text-dark-text-secondary rounded">
              +{scenario.actions.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Business Impact */}
      <div className="mt-4 pt-4 border-t border-dark-border">
        <p className="text-xs text-dark-text-secondary line-clamp-2">
          {scenario.businessImpact}
        </p>
      </div>

      {/* Quick Win Badge */}
      {scenario.actions.some(a => a.quickWins) && (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
            Quick Win
          </span>
        </div>
      )}
    </motion.div>
  );
}