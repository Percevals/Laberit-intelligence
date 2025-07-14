/**
 * Scenario Store
 * State management for what-if scenarios and improvement planning
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  ScenarioAnalysis, 
  ImprovementAction, 
  ScenarioComparison
} from '@/services/scenario-engine';
import { ScenarioEngine } from '@/services/scenario-engine';
import type { DIIDimension, BusinessModelId, DimensionResponse } from './dii-dimensions-store';

interface ScenarioState {
  // Current scenarios
  scenarios: ScenarioAnalysis[];
  activeScenarioId: string | null;
  
  // Available improvements
  availableImprovements: Record<DIIDimension, ImprovementAction[]>;
  quickWins: ImprovementAction[];
  
  // Scenario building
  selectedActions: string[];
  scenarioBuilder: {
    name: string;
    description: string;
    isBuilding: boolean;
  };
  
  // Comparison and analysis
  comparisonResult: ScenarioComparison | null;
  targetDII: number | null;
  roadmapAnalysis: any | null;
  
  // UI state
  viewMode: 'list' | 'comparison' | 'builder' | 'roadmap';
  showQuickWins: boolean;
  
  // Actions
  initializeEngine: (
    businessModel: BusinessModelId,
    dimensions: Record<DIIDimension, DimensionResponse>,
    currentDII: number
  ) => void;
  
  // Scenario management
  createScenario: (name: string, description: string, actionIds: string[]) => void;
  deleteScenario: (scenarioId: string) => void;
  duplicateScenario: (scenarioId: string) => void;
  bookmarkScenario: (scenarioId: string) => void;
  setActiveScenario: (scenarioId: string | null) => void;
  
  // Scenario building
  startScenarioBuilder: () => void;
  updateScenarioBuilder: (updates: Partial<ScenarioState['scenarioBuilder']>) => void;
  addActionToBuilder: (actionId: string) => void;
  removeActionFromBuilder: (actionId: string) => void;
  clearScenarioBuilder: () => void;
  buildScenario: () => void;
  
  // Analysis
  compareScenarios: (scenarioIds: string[]) => void;
  generateRoadmapToTarget: (targetDII: number) => void;
  
  // UI controls
  setViewMode: (mode: ScenarioState['viewMode']) => void;
  toggleQuickWins: () => void;
  
  // Export
  exportScenario: (scenarioId: string, format: 'json' | 'pdf' | 'csv') => Promise<void>;
}

let scenarioEngine: ScenarioEngine | null = null;

export const useScenarioStore = create<ScenarioState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      scenarios: [],
      activeScenarioId: null,
      availableImprovements: {} as Record<DIIDimension, ImprovementAction[]>,
      quickWins: [],
      selectedActions: [],
      scenarioBuilder: {
        name: '',
        description: '',
        isBuilding: false
      },
      comparisonResult: null,
      targetDII: null,
      roadmapAnalysis: null,
      viewMode: 'list',
      showQuickWins: true,

      // Initialize scenario engine
      initializeEngine: (businessModel, dimensions, currentDII) => {
        scenarioEngine = new ScenarioEngine(businessModel, dimensions, currentDII);
        
        set((state) => {
          state.availableImprovements = scenarioEngine!.getAvailableImprovements();
          state.quickWins = scenarioEngine!.getQuickWins();
        });
      },

      // Scenario management
      createScenario: (name, description, actionIds) => {
        if (!scenarioEngine) return;
        
        const scenario = scenarioEngine.createScenario(name, description, actionIds);
        
        set((state) => {
          state.scenarios.push(scenario);
          state.activeScenarioId = scenario.id;
        });
      },

      deleteScenario: (scenarioId) => {
        set((state) => {
          state.scenarios = state.scenarios.filter(s => s.id !== scenarioId);
          if (state.activeScenarioId === scenarioId) {
            state.activeScenarioId = null;
          }
        });
      },

      duplicateScenario: (scenarioId) => {
        if (!scenarioEngine) return;
        
        const scenario = get().scenarios.find(s => s.id === scenarioId);
        if (!scenario) return;
        
        const actionIds = scenario.actions.map(a => a.id);
        const newScenario = scenarioEngine.createScenario(
          `${scenario.name} (Copy)`,
          scenario.description,
          actionIds
        );
        
        set((state) => {
          state.scenarios.push(newScenario);
        });
      },

      bookmarkScenario: (scenarioId) => {
        set((state) => {
          const scenario = state.scenarios.find(s => s.id === scenarioId);
          if (scenario) {
            scenario.isBookmarked = !scenario.isBookmarked;
            scenario.lastModified = new Date();
          }
        });
      },

      setActiveScenario: (scenarioId) => {
        set((state) => {
          state.activeScenarioId = scenarioId;
        });
      },

      // Scenario building
      startScenarioBuilder: () => {
        set((state) => {
          state.scenarioBuilder = {
            name: '',
            description: '',
            isBuilding: true
          };
          state.selectedActions = [];
          state.viewMode = 'builder';
        });
      },

      updateScenarioBuilder: (updates) => {
        set((state) => {
          Object.assign(state.scenarioBuilder, updates);
        });
      },

      addActionToBuilder: (actionId) => {
        set((state) => {
          if (!state.selectedActions.includes(actionId)) {
            state.selectedActions.push(actionId);
          }
        });
      },

      removeActionFromBuilder: (actionId) => {
        set((state) => {
          state.selectedActions = state.selectedActions.filter(id => id !== actionId);
        });
      },

      clearScenarioBuilder: () => {
        set((state) => {
          state.scenarioBuilder = {
            name: '',
            description: '',
            isBuilding: false
          };
          state.selectedActions = [];
        });
      },

      buildScenario: () => {
        const { scenarioBuilder, selectedActions } = get();
        
        if (!scenarioBuilder.name || selectedActions.length === 0) return;
        
        get().createScenario(
          scenarioBuilder.name,
          scenarioBuilder.description,
          selectedActions
        );
        
        get().clearScenarioBuilder();
        set((state) => {
          state.viewMode = 'list';
        });
      },

      // Analysis
      compareScenarios: (scenarioIds) => {
        if (!scenarioEngine) return;
        
        const scenarios = get().scenarios.filter(s => scenarioIds.includes(s.id));
        const comparison = scenarioEngine.compareScenarios(scenarios);
        
        set((state) => {
          state.comparisonResult = comparison;
          state.viewMode = 'comparison';
        });
      },

      generateRoadmapToTarget: (targetDII) => {
        if (!scenarioEngine) return;
        
        const roadmap = scenarioEngine.generateRoadmapToTarget(targetDII);
        
        set((state) => {
          state.targetDII = targetDII;
          state.roadmapAnalysis = roadmap;
          state.viewMode = 'roadmap';
        });
      },

      // UI controls
      setViewMode: (mode) => {
        set((state) => {
          state.viewMode = mode;
        });
      },

      toggleQuickWins: () => {
        set((state) => {
          state.showQuickWins = !state.showQuickWins;
        });
      },

      // Export functionality
      exportScenario: async (scenarioId, format) => {
        const scenario = get().scenarios.find(s => s.id === scenarioId);
        if (!scenario) return;

        switch (format) {
          case 'json':
            const dataStr = JSON.stringify(scenario, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `scenario-${scenario.name.replace(/\s+/g, '-')}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            break;
            
          case 'csv':
            const csvData = scenario.actions.map(action => ({
              Action: action.title,
              Dimension: action.dimension,
              Cost: action.implementationCost,
              'Time (Months)': action.timeToImplement,
              'Score Improvement': action.scoreImprovement,
              'Effort Level': action.effortLevel,
              'Strategic Value': action.strategicValue
            }));
            
            if (csvData.length === 0) return;
            
            const csvStr = [
              Object.keys(csvData[0]).join(','),
              ...csvData.map(row => Object.values(row).join(','))
            ].join('\n');
            
            const csvUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvStr);
            const csvLink = document.createElement('a');
            csvLink.setAttribute('href', csvUri);
            csvLink.setAttribute('download', `scenario-${scenario.name.replace(/\s+/g, '-')}.csv`);
            csvLink.click();
            break;
            
          case 'pdf':
            // This would typically integrate with a PDF generation library
            console.log('PDF export not implemented yet');
            break;
        }
      }
    })),
    {
      name: 'dii-scenario-store',
      partialize: (state) => ({
        scenarios: state.scenarios,
        viewMode: state.viewMode,
        showQuickWins: state.showQuickWins
      })
    }
  )
);