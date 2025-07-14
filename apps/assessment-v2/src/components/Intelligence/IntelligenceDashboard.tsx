/**
 * Intelligence Dashboard
 * Main interface for contextual intelligence and insights
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Shield,
  AlertTriangle,
  TrendingUp,
  Target,
  Clock,
  Bookmark,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Info,
  Zap,
  AlertCircle
} from 'lucide-react';
import { useIntelligenceStore } from '@/store/intelligence-store';
import { useDIIDimensionsStore } from '@/store/dii-dimensions-store';
import { InsightCard } from './InsightCard';
import { VulnerabilityWindow } from './VulnerabilityWindow';
import { ImmunityPrescription } from './ImmunityPrescription';
import { ThreatLandscape } from './ThreatLandscape';
import { BenchmarkChart } from './BenchmarkChart';
import { cn } from '@shared/utils/cn';

export function IntelligenceDashboard() {
  const {
    currentReport,
    isGenerating,
    error,
    insightFilters,
    generateReport,
    refreshIntelligence,
    updateFilters,
    exportReport,
    hasNewIntelligence,
    acknowledgeIntelligence
  } = useIntelligenceStore();

  const { currentDII } = useDIIDimensionsStore();
  
  const [activeTab, setActiveTab] = useState<'insights' | 'threats' | 'prescription' | 'benchmark'>('insights');
  const [showFilters, setShowFilters] = useState(false);

  // Generate report on mount if not available
  useEffect(() => {
    if (!currentReport && !isGenerating) {
      generateReport();
    }
  }, [currentReport, isGenerating, generateReport]);

  // Check for new intelligence
  const hasNew = hasNewIntelligence();
  
  if (isGenerating && !currentReport) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary-600 animate-pulse mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-text mb-2">
            Generating Intelligence Report
          </h3>
          <p className="text-sm text-dark-text-secondary">
            Analyzing your context and generating personalized insights...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-text mb-2">
            Error Generating Report
          </h3>
          <p className="text-sm text-dark-text-secondary mb-4">{error}</p>
          <button
            onClick={generateReport}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentReport) {
    return null;
  }

  const filteredInsights = currentReport.insights.filter(insight => {
    if (!insightFilters.types.includes(insight.type)) return false;
    if (!insightFilters.timeHorizon.includes(insight.timeHorizon)) return false;
    
    const confidenceOrder = { Low: 1, Medium: 2, High: 3 };
    if (confidenceOrder[insight.confidence] < confidenceOrder[insightFilters.minConfidence]) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-dark-text">
            Intelligence & Insights
          </h1>
          <p className="text-dark-text-secondary mt-2">
            Contextual analysis for {currentReport.context.company} • {currentReport.context.industry}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {hasNew && (
            <button
              onClick={() => {
                acknowledgeIntelligence();
                setActiveTab('insights');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-600 rounded-lg hover:bg-yellow-500/30 transition-colors"
            >
              <Zap className="w-4 h-4" />
              New Intelligence
            </button>
          )}
          
          <button
            onClick={refreshIntelligence}
            className="p-2 text-dark-text-secondary hover:text-dark-text rounded-lg transition-colors"
          >
            <RefreshCw className={cn("w-5 h-5", isGenerating && "animate-spin")} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-surface text-dark-text border border-dark-border rounded-lg hover:bg-dark-bg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            
            {showFilters && (
              <FilterPanel 
                filters={insightFilters}
                onUpdate={updateFilters}
                onClose={() => setShowFilters(false)}
              />
            )}
          </div>
          
          <button
            onClick={() => exportReport('executive')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard
          icon={Shield}
          label="Current DII"
          value={currentDII?.score || 0}
          subValue={currentDII?.level || 'Unknown'}
          color="text-primary-600"
        />
        
        <MetricCard
          icon={AlertTriangle}
          label="Threat Level"
          value={currentReport.vulnerabilityAnalysis.exposureLevel}
          subValue={`${currentReport.vulnerabilityAnalysis.windows.length} vulnerabilities`}
          color="text-red-500"
        />
        
        <MetricCard
          icon={TrendingUp}
          label="Industry Position"
          value={currentReport.benchmarking.industryPosition}
          subValue={`+${currentReport.benchmarking.improvementPotential} potential`}
          color="text-green-500"
        />
        
        <MetricCard
          icon={Target}
          label="Quick Wins"
          value={currentReport.prescription.quickWins.length}
          subValue="Available"
          color="text-blue-500"
        />
        
        <MetricCard
          icon={Clock}
          label="Time to Risk"
          value={currentReport.vulnerabilityAnalysis.timeToExploitation}
          subValue="Estimated"
          color="text-orange-500"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-border">
        <div className="flex gap-6">
          {[
            { id: 'insights', label: 'Insights', count: filteredInsights.length },
            { id: 'threats', label: 'Threat Landscape', count: currentReport.threatLandscape.relevantPatterns.length },
            { id: 'prescription', label: 'Immunity Prescription', count: null },
            { id: 'benchmark', label: 'Benchmarking', count: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pb-3 px-1 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-primary-600"
                  : "text-dark-text-secondary hover:text-dark-text"
              )}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.count !== null && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    activeTab === tab.id
                      ? "bg-primary-600 text-white"
                      : "bg-dark-bg text-dark-text-secondary"
                  )}>
                    {tab.count}
                  </span>
                )}
              </span>
              
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Critical Vulnerabilities */}
            {currentReport.vulnerabilityAnalysis.windows.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-dark-text">
                  Critical Vulnerability Windows
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {currentReport.vulnerabilityAnalysis.windows
                    .filter(w => w.risk === 'Critical' || w.risk === 'High')
                    .slice(0, 4)
                    .map(window => (
                      <VulnerabilityWindow key={window.dimension} window={window} />
                    ))}
                </div>
              </div>
            )}

            {/* Personalized Insights */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-dark-text">
                  Personalized Insights ({filteredInsights.length})
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
                  <Info className="w-4 h-4" />
                  <span>Based on your industry, region, and profile</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredInsights.map(insight => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
              
              {filteredInsights.length === 0 && (
                <div className="text-center py-8 bg-dark-surface rounded-lg border border-dark-border">
                  <p className="text-dark-text-secondary">
                    No insights match your current filters. Try adjusting them.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'threats' && (
          <motion.div
            key="threats"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ThreatLandscape report={currentReport} />
          </motion.div>
        )}

        {activeTab === 'prescription' && (
          <motion.div
            key="prescription"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ImmunityPrescription prescription={currentReport.prescription} />
          </motion.div>
        )}

        {activeTab === 'benchmark' && (
          <motion.div
            key="benchmark"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <BenchmarkChart benchmarking={currentReport.benchmarking} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Intelligence Alert */}
      {currentReport.weeklyIntelligence && hasNew && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 max-w-sm bg-dark-surface border border-primary-600 rounded-lg shadow-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-dark-text mb-1">
                Weekly Intelligence Update
              </h4>
              <p className="text-sm text-dark-text-secondary mb-3">
                {currentReport.weeklyIntelligence.updates.length} new threats and {currentReport.weeklyIntelligence.alerts.length} alerts
              </p>
              <button
                onClick={() => {
                  acknowledgeIntelligence();
                  setActiveTab('insights');
                }}
                className="text-sm text-primary-600 hover:text-primary-500 flex items-center gap-1"
              >
                View Details
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  icon: React.ComponentType<{ className?: string | undefined }>;
  label: string;
  value: string | number;
  subValue: string;
  color: string;
}

function MetricCard({ icon: Icon, label, value, subValue, color }: MetricCardProps) {
  return (
    <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={cn("w-5 h-5", color)} />
        <span className="text-sm text-dark-text-secondary">{label}</span>
      </div>
      <div className="text-2xl font-bold text-dark-text">
        {value}
      </div>
      <div className="text-xs text-dark-text-secondary mt-1">
        {subValue}
      </div>
    </div>
  );
}

// Filter Panel Component
interface FilterPanelProps {
  filters: any;
  onUpdate: (filters: any) => void;
  onClose: () => void;
}

function FilterPanel({ filters, onUpdate, onClose }: FilterPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-full right-0 mt-2 w-80 bg-dark-surface border border-dark-border rounded-lg shadow-lg p-4 z-50"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-dark-text">Filter Insights</h4>
        <button
          onClick={onClose}
          className="text-dark-text-secondary hover:text-dark-text"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Insight Types */}
        <div>
          <label className="text-sm font-medium text-dark-text mb-2 block">
            Insight Types
          </label>
          <div className="space-y-2">
            {['risk', 'opportunity', 'trend', 'benchmark', 'prediction'].map(type => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...filters.types, type]
                      : filters.types.filter((t: string) => t !== type);
                    onUpdate({ types: newTypes });
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <span className="text-sm text-dark-text capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Confidence Level */}
        <div>
          <label className="text-sm font-medium text-dark-text mb-2 block">
            Minimum Confidence
          </label>
          <select
            value={filters.minConfidence}
            onChange={(e) => onUpdate({ minConfidence: e.target.value })}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Time Horizon */}
        <div>
          <label className="text-sm font-medium text-dark-text mb-2 block">
            Time Horizon
          </label>
          <div className="space-y-2">
            {['Immediate', 'Short-term', 'Medium-term', 'Long-term'].map(horizon => (
              <label key={horizon} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.timeHorizon.includes(horizon)}
                  onChange={(e) => {
                    const newHorizons = e.target.checked
                      ? [...filters.timeHorizon, horizon]
                      : filters.timeHorizon.filter((h: string) => h !== horizon);
                    onUpdate({ timeHorizon: newHorizons });
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <span className="text-sm text-dark-text">{horizon}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}