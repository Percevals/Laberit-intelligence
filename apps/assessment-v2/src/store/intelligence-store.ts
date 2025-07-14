/**
 * Intelligence Store
 * State management for contextual intelligence and insights
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  IntelligenceReport
} from '@/services/intelligence-engine';
import { IntelligenceEngine } from '@/services/intelligence-engine';
import { useDIIDimensionsStore } from './dii-dimensions-store';
import { useAssessmentStore } from './assessment-store';

interface IntelligenceState {
  // Current intelligence report
  currentReport: IntelligenceReport | null;
  
  // Loading and error states
  isGenerating: boolean;
  error: string | null;
  
  // Report history
  reportHistory: {
    id: string;
    date: Date;
    diiScore: number;
    summary: string;
  }[];
  
  // User interactions
  dismissedInsights: string[];
  bookmarkedInsights: string[];
  completedActions: string[];
  
  // Filters and preferences
  insightFilters: {
    types: string[];
    dimensions: string[];
    timeHorizon: string[];
    minConfidence: 'Low' | 'Medium' | 'High';
  };
  
  // Actions
  generateReport: () => Promise<void>;
  refreshIntelligence: () => Promise<void>;
  
  // Insight management
  dismissInsight: (insightId: string) => void;
  bookmarkInsight: (insightId: string) => void;
  markActionComplete: (actionId: string) => void;
  
  // Filter management
  updateFilters: (filters: Partial<IntelligenceState['insightFilters']>) => void;
  resetFilters: () => void;
  
  // Export functionality
  exportReport: (format: 'pdf' | 'json' | 'executive') => Promise<void>;
  
  // Weekly intelligence
  hasNewIntelligence: () => boolean;
  acknowledgeIntelligence: () => void;
}

const defaultFilters: IntelligenceState['insightFilters'] = {
  types: ['risk', 'opportunity', 'trend', 'benchmark', 'prediction'],
  dimensions: ['TRD', 'AER', 'HFP', 'BRI', 'RRG'],
  timeHorizon: ['Immediate', 'Short-term', 'Medium-term', 'Long-term'],
  minConfidence: 'Low'
};

export const useIntelligenceStore = create<IntelligenceState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      currentReport: null,
      isGenerating: false,
      error: null,
      reportHistory: [],
      dismissedInsights: [],
      bookmarkedInsights: [],
      completedActions: [],
      insightFilters: defaultFilters,

      // Generate intelligence report
      generateReport: async () => {
        set((state) => {
          state.isGenerating = true;
          state.error = null;
        });

        try {
          // Get current context
          const { dimensions, currentDII } = useDIIDimensionsStore.getState();
          const { classification, companySearch } = useAssessmentStore.getState();

          if (!classification || !dimensions || !currentDII) {
            throw new Error('Assessment data not available');
          }

          // Check if all dimensions are present
          const requiredDimensions: Array<keyof typeof dimensions> = ['TRD', 'AER', 'HFP', 'BRI', 'RRG'];
          const hasAllDimensions = requiredDimensions.every(dim => dim in dimensions);
          
          if (!hasAllDimensions) {
            throw new Error('All dimensions must be assessed before generating intelligence report');
          }

          // Create classification result from assessment data
          const classificationResult = {
            company: companySearch.selectedCompany?.name || 'Unknown',
            industry: classification.industry || 'Unknown',
            businessModel: classification.businessModel || 'Unknown',
            companySize: classification.employees 
              ? classification.employees < 50 ? 'Small'
              : classification.employees < 250 ? 'Medium'
              : 'Large'
              : 'Unknown',
            region: classification.geography || 'LATAM'
          };

          // Create intelligence engine
          const engine = new IntelligenceEngine({
            classification: classificationResult,
            dimensions: dimensions as Record<string, any>,
            currentDII: currentDII.score,
            assessmentDate: new Date()
          });

          // Generate report
          const report = await engine.generateReport();

          // Filter out dismissed insights
          const dismissedIds = get().dismissedInsights;
          report.insights = report.insights.filter(
            insight => !dismissedIds.includes(insight.id)
          );

          set((state) => {
            state.currentReport = report;
            state.isGenerating = false;
            
            // Add to history
            state.reportHistory.unshift({
              id: `report-${Date.now()}`,
              date: new Date(),
              diiScore: currentDII.score,
              summary: `${report.insights.length} insights, ${report.vulnerabilityAnalysis.windows.length} vulnerabilities`
            });
            
            // Keep only last 10 reports
            state.reportHistory = state.reportHistory.slice(0, 10);
          });
        } catch (error) {
          set((state) => {
            state.isGenerating = false;
            state.error = error instanceof Error ? error.message : 'Failed to generate report';
          });
        }
      },

      // Refresh intelligence (check for updates)
      refreshIntelligence: async () => {
        const currentReport = get().currentReport;
        if (!currentReport) {
          return get().generateReport();
        }

        // In production, this would check for new threat intelligence
        // For now, just regenerate if report is older than 7 days
        const reportAge = Date.now() - currentReport.context.assessmentDate.getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (reportAge > sevenDays) {
          return get().generateReport();
        }
      },

      // Insight management
      dismissInsight: (insightId) => {
        set((state) => {
          if (!state.dismissedInsights.includes(insightId)) {
            state.dismissedInsights.push(insightId);
          }
          
          // Remove from current report
          if (state.currentReport) {
            state.currentReport.insights = state.currentReport.insights.filter(
              insight => insight.id !== insightId
            );
          }
        });
      },

      bookmarkInsight: (insightId) => {
        set((state) => {
          const isBookmarked = state.bookmarkedInsights.includes(insightId);
          
          if (isBookmarked) {
            state.bookmarkedInsights = state.bookmarkedInsights.filter(
              id => id !== insightId
            );
          } else {
            state.bookmarkedInsights.push(insightId);
          }
        });
      },

      markActionComplete: (actionId) => {
        set((state) => {
          if (!state.completedActions.includes(actionId)) {
            state.completedActions.push(actionId);
          }
        });
      },

      // Filter management
      updateFilters: (filters) => {
        set((state) => {
          state.insightFilters = { ...state.insightFilters, ...filters };
        });
      },

      resetFilters: () => {
        set((state) => {
          state.insightFilters = defaultFilters;
        });
      },

      // Export functionality
      exportReport: async (format) => {
        const report = get().currentReport;
        if (!report) return;

        switch (format) {
          case 'json':
            const jsonStr = JSON.stringify(report, null, 2);
            const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
            const jsonUrl = URL.createObjectURL(jsonBlob);
            const jsonLink = document.createElement('a');
            jsonLink.href = jsonUrl;
            jsonLink.download = `intelligence-report-${Date.now()}.json`;
            jsonLink.click();
            URL.revokeObjectURL(jsonUrl);
            break;

          case 'executive':
            // Generate executive summary
            const summary = generateExecutiveSummary(report);
            const summaryBlob = new Blob([summary], { type: 'text/markdown' });
            const summaryUrl = URL.createObjectURL(summaryBlob);
            const summaryLink = document.createElement('a');
            summaryLink.href = summaryUrl;
            summaryLink.download = `executive-summary-${Date.now()}.md`;
            summaryLink.click();
            URL.revokeObjectURL(summaryUrl);
            break;

          case 'pdf':
            // In production, would use a PDF generation library
            console.log('PDF export not implemented yet');
            break;
        }
      },

      // Weekly intelligence
      hasNewIntelligence: () => {
        const report = get().currentReport;
        if (!report?.weeklyIntelligence) return false;

        const lastChecked = localStorage.getItem('lastIntelligenceCheck');
        if (!lastChecked) return true;

        return new Date(report.weeklyIntelligence.lastUpdated) > new Date(lastChecked);
      },

      acknowledgeIntelligence: () => {
        localStorage.setItem('lastIntelligenceCheck', new Date().toISOString());
      }
    })),
    {
      name: 'dii-intelligence-store',
      partialize: (state) => ({
        reportHistory: state.reportHistory,
        dismissedInsights: state.dismissedInsights,
        bookmarkedInsights: state.bookmarkedInsights,
        completedActions: state.completedActions,
        insightFilters: state.insightFilters
      })
    }
  )
);

// Helper function to generate executive summary
function generateExecutiveSummary(report: IntelligenceReport): string {
  const critical = report.insights.filter(i => i.confidence === 'High' && i.timeHorizon === 'Immediate');
  const highRiskWindows = report.vulnerabilityAnalysis.windows.filter(w => w.risk === 'Critical' || w.risk === 'High');
  
  return `# Digital Immunity Intelligence Report
## Executive Summary

**Date:** ${report.context.assessmentDate.toLocaleDateString()}
**Company:** ${report.context.company}
**Industry:** ${report.context.industry}
**Current DII Score:** ${report.context.assessmentDate}

### Key Findings

1. **Threat Landscape**
   - ${report.threatLandscape.relevantPatterns.length} active threat patterns affecting your industry
   - ${report.threatLandscape.emergingThreats.length} emerging threats identified
   - Regional risk factors: ${report.threatLandscape.regionalFactors.specificThreats.length} LATAM-specific threats

2. **Critical Vulnerabilities**
   - ${highRiskWindows.length} high-risk vulnerability windows identified
   - Exposure Level: ${report.vulnerabilityAnalysis.exposureLevel}
   - Time to Exploitation: ${report.vulnerabilityAnalysis.timeToExploitation}

3. **Top Insights** (${critical.length} critical)
${critical.slice(0, 3).map(i => `   - ${i.title}: ${i.description}`).join('\n')}

4. **Recommended Actions**
   - **Quick Wins:** ${report.prescription.quickWins.length} actions (0-3 months)
   - **Strategic:** ${report.prescription.strategic.length} initiatives (3-12 months)
   - **Critical:** ${report.prescription.critical.length} urgent actions

5. **Expected Outcomes**
   - Target DII: ${report.prescription.expectedOutcome.newDII}
   - Risk Reduction: ${report.prescription.expectedOutcome.riskReduction}%
   - Investment Required: $${report.prescription.expectedOutcome.investment.toLocaleString()}
   - Timeline: ${report.prescription.expectedOutcome.timeframe} months

### Industry Position
- Current Standing: ${report.benchmarking.industryPosition}
- Improvement Potential: ${report.benchmarking.improvementPotential} points

### Next Steps
1. Address ${report.prescription.critical.length} critical actions immediately
2. Implement ${report.prescription.quickWins.length} quick wins within 90 days
3. Plan for strategic transformation over next 12-18 months

---
*This report contains sensitive security information. Please handle accordingly.*`;
}