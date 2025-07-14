/**
 * Scenario Planning Dashboard
 * Main interface for what-if scenario exploration
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Target,
  Plus,
  BarChart3,
  Lightbulb,
  Download,
  Settings,
  Star,
  Shield,
  Columns
} from 'lucide-react';
import { useScenarioStore } from '@/store/scenario-store';
import { useDIIDimensionsStore } from '@/store/dii-dimensions-store';
import { useAssessmentStore } from '@/store/assessment-store';
import { ScenarioBuilder } from './ScenarioBuilder';
import { ScenarioComparison } from './ScenarioComparison';
import { RoadmapPlanner } from './RoadmapPlanner';
import { QuickWinsPanel } from './QuickWinsPanel';
import { ScenarioCard } from './ScenarioCard';
import { cn } from '@shared/utils/cn';

export function ScenarioDashboard() {
  const {
    scenarios,
    quickWins,
    viewMode,
    showQuickWins,
    initializeEngine,
    startScenarioBuilder,
    compareScenarios,
    generateRoadmapToTarget,
    toggleQuickWins
  } = useScenarioStore();

  const { 
    dimensions, 
    currentDII
  } = useDIIDimensionsStore();

  const { classification } = useAssessmentStore();
  
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [targetDII, setTargetDII] = useState<number>(75);

  // Initialize scenario engine when component mounts
  useEffect(() => {
    if (classification?.businessModel && dimensions && currentDII) {
      // Map business model string to numeric ID
      const businessModelMap: Record<string, number> = {
        'COMERCIO_HIBRIDO': 1,
        'SOFTWARE_CRITICO': 2,
        'SERVICIOS_DATOS': 3,
        'ECOSISTEMA_DIGITAL': 4,
        'SERVICIOS_FINANCIEROS': 5,
        'INFRAESTRUCTURA_HEREDADA': 6,
        'CADENA_SUMINISTRO': 7,
        'INFORMACION_REGULADA': 8
      };
      
      const businessModelId = businessModelMap[classification.businessModel];
      if (businessModelId && Object.keys(dimensions).length === 5) {
        initializeEngine(businessModelId as any, dimensions as any, currentDII.score);
      }
    }
  }, [classification?.businessModel, dimensions, currentDII, initializeEngine]);

  const bookmarkedScenarios = scenarios.filter(s => s.isBookmarked);
  const hasScenarios = scenarios.length > 0;

  const handleCompareSelected = () => {
    if (selectedScenarios.length >= 2) {
      compareScenarios(selectedScenarios);
    }
  };

  const handleGenerateRoadmap = () => {
    generateRoadmapToTarget(targetDII);
  };

  const handleScenarioSelect = (scenarioId: string, selected: boolean) => {
    if (selected) {
      setSelectedScenarios(prev => [...prev, scenarioId]);
    } else {
      setSelectedScenarios(prev => prev.filter(id => id !== scenarioId));
    }
  };

  if (viewMode === 'builder') {
    return <ScenarioBuilder />;
  }

  if (viewMode === 'comparison') {
    return <ScenarioComparison />;
  }

  if (viewMode === 'roadmap') {
    return <RoadmapPlanner />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-dark-text">
            What-If Scenario Planning
          </h1>
          <p className="text-dark-text-secondary mt-2">
            Explore how improving specific dimensions would impact your overall immunity
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleQuickWins}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              showQuickWins 
                ? "bg-primary-600 text-white" 
                : "bg-dark-surface text-dark-text border border-dark-border"
            )}
          >
            <Lightbulb className="w-4 h-4" />
            Quick Wins
          </button>
          
          <button
            onClick={startScenarioBuilder}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Scenario
          </button>
        </div>
      </div>

      {/* Current State Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-primary-600" />
            <span className="text-sm text-dark-text-secondary">Current DII</span>
          </div>
          <div className="text-2xl font-bold text-dark-text">
            {currentDII?.score || 0}
          </div>
          <div className="text-xs text-dark-text-secondary mt-1">
            {(currentDII?.score || 0) >= 76 ? 'ADAPTATIVO' :
             (currentDII?.score || 0) >= 51 ? 'RESILIENTE' :
             (currentDII?.score || 0) >= 26 ? 'ROBUSTO' : 'FRAGIL'} Level
          </div>
        </div>

        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-dark-text-secondary">Scenarios</span>
          </div>
          <div className="text-2xl font-bold text-dark-text">
            {scenarios.length}
          </div>
          <div className="text-xs text-dark-text-secondary mt-1">
            {bookmarkedScenarios.length} bookmarked
          </div>
        </div>

        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-dark-text-secondary">Quick Wins</span>
          </div>
          <div className="text-2xl font-bold text-dark-text">
            {quickWins.length}
          </div>
          <div className="text-xs text-dark-text-secondary mt-1">
            Available improvements
          </div>
        </div>

        <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-dark-text-secondary">Target DII</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={targetDII}
              onChange={(e) => setTargetDII(Number(e.target.value))}
              className="w-16 px-2 py-1 text-lg font-bold bg-transparent text-dark-text border-b border-primary-600 focus:outline-none"
              min="0"
              max="100"
            />
            <button
              onClick={handleGenerateRoadmap}
              className="text-xs px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Plan
            </button>
          </div>
        </div>
      </div>

      {/* Quick Wins Panel */}
      <AnimatePresence>
        {showQuickWins && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <QuickWinsPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      {hasScenarios && (
        <div className="flex items-center justify-between bg-dark-surface rounded-lg p-4 border border-dark-border">
          <div className="flex items-center gap-4">
            <span className="text-sm text-dark-text-secondary">
              {selectedScenarios.length} scenario{selectedScenarios.length !== 1 ? 's' : ''} selected
            </span>
            
            {selectedScenarios.length >= 2 && (
              <button
                onClick={handleCompareSelected}
                className="flex items-center gap-2 px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors"
              >
                <Columns className="w-4 h-4" />
                Compare
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-dark-text-secondary hover:text-dark-text rounded transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-2 text-dark-text-secondary hover:text-dark-text rounded transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Scenarios Grid */}
      {hasScenarios ? (
        <div className="space-y-4">
          {/* Bookmarked Scenarios */}
          {bookmarkedScenarios.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <h3 className="text-lg font-medium text-dark-text">Bookmarked Scenarios</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {bookmarkedScenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    isSelected={selectedScenarios.includes(scenario.id)}
                    onSelect={handleScenarioSelect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Scenarios */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-dark-text">
                All Scenarios ({scenarios.length})
              </h3>
              
              <div className="flex items-center gap-2">
                <select className="px-3 py-1 bg-dark-surface border border-dark-border rounded text-sm text-dark-text">
                  <option>Sort by Created</option>
                  <option>Sort by ROI</option>
                  <option>Sort by Cost</option>
                  <option>Sort by Impact</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  isSelected={selectedScenarios.includes(scenario.id)}
                  onSelect={handleScenarioSelect}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="bg-dark-surface rounded-lg p-8 border border-dark-border">
            <Brain className="w-12 h-12 text-dark-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-medium text-dark-text mb-2">
              Start Your Strategic Planning
            </h3>
            <p className="text-dark-text-secondary mb-6 max-w-md mx-auto">
              Create your first what-if scenario to explore how specific improvements would impact your DII score and business resilience.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={startScenarioBuilder}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto"
              >
                <Plus className="w-5 h-5" />
                Create First Scenario
              </button>
              
              {quickWins.length > 0 && (
                <p className="text-sm text-dark-text-secondary">
                  Or explore {quickWins.length} quick wins to get started
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}