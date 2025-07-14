import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CompanyInfo } from '@services/ai/types';
import type { BusinessModel, ClassificationAnswers } from '@core/types/business-model.types';
import type { Score, MaturityStage } from '@core/types/dii.types';
import type { DIIDimension } from '@core/types/pain-scenario.types';

interface CompanySearchState {
  query: string;
  selectedCompany: CompanyInfo | null;
  isConfirmed: boolean;
  dataSource: 'ai' | 'manual' | 'mixed';
}

interface ClassificationState {
  businessModel: BusinessModel | null;
  answers: Partial<ClassificationAnswers>;
  
  // Extended classification fields from company data
  revenue: number | null;
  employees: number | null;
  geography: string | null;
  industry: string | null;
  criticalInfra: boolean | null;
  
  // Track what was AI-filled
  aiEnhanced: {
    revenue: boolean;
    employees: boolean;
    geography: boolean;
    industry: boolean;
  };
}

export interface ScenarioResponse {
  dimension: DIIDimension;
  question: string;
  response: number; // 1-5 scale
  metric?: {
    hours?: number;
    percentage?: number;
    ratio?: number;
    multiplier?: number;
  };
  timestamp: Date;
}

interface AssessmentProgress {
  currentStep: 'company-search' | 'classification' | 'questions' | 'results';
  startTime: Date | null;
  completionTime: Date | null;
  questionsAnswered: number;
  totalQuestions: number;
}

interface AssessmentResults {
  diiScore: Score | null;
  maturityStage: MaturityStage | null;
  percentile: number | null;
  timestamp: Date | null;
}

interface AssessmentState {
  // Company Search
  companySearch: CompanySearchState;
  
  // Classification
  classification: ClassificationState;
  
  // Scenario Responses
  scenarioResponses: ScenarioResponse[];
  
  // Assessment Progress
  progress: AssessmentProgress;
  
  // Results
  results: AssessmentResults;
  
  // Actions
  setCompanyQuery: (query: string) => void;
  selectCompany: (company: CompanyInfo) => void;
  confirmCompany: () => void;
  
  setBusinessModel: (model: BusinessModel) => void;
  setClassificationAnswer: (key: keyof ClassificationAnswers, value: any) => void;
  updateClassificationFromCompany: (company: CompanyInfo) => void;
  
  // Scenario Actions
  addScenarioResponse: (dimension: DIIDimension, question: string, response: number, metric?: any) => void;
  getScenarioResponse: (dimension: DIIDimension) => ScenarioResponse | undefined;
  
  startAssessment: () => void;
  completeAssessment: (score: Score, stage: MaturityStage, percentile: number) => void;
  updateProgress: (step: AssessmentProgress['currentStep']) => void;
  
  reset: () => void;
  
  // Computed values
  isCompanyInfoComplete: () => boolean;
  getClassificationCompletion: () => number;
}

const initialState = {
  companySearch: {
    query: '',
    selectedCompany: null,
    isConfirmed: false,
    dataSource: 'manual' as const
  },
  classification: {
    businessModel: null,
    answers: {},
    revenue: null,
    employees: null,
    geography: null,
    industry: null,
    criticalInfra: null,
    aiEnhanced: {
      revenue: false,
      employees: false,
      geography: false,
      industry: false
    }
  },
  scenarioResponses: [],
  progress: {
    currentStep: 'company-search' as const,
    startTime: null,
    completionTime: null,
    questionsAnswered: 0,
    totalQuestions: 11 // 6 classification + 5 dimension questions
  },
  results: {
    diiScore: null,
    maturityStage: null,
    percentile: null,
    timestamp: null
  }
};

export const useAssessmentStore = create<AssessmentState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Company Search Actions
        setCompanyQuery: (query) => set((state) => ({
          companySearch: { ...state.companySearch, query }
        })),

        selectCompany: (company) => set((state) => ({
          companySearch: {
            ...state.companySearch,
            selectedCompany: company,
            dataSource: company.dataSource
          }
        })),

        confirmCompany: () => set((state) => ({
          companySearch: { ...state.companySearch, isConfirmed: true }
        })),

        // Classification Actions
        setBusinessModel: (model) => set((state) => ({
          classification: { ...state.classification, businessModel: model }
        })),

        setClassificationAnswer: (key, value) => set((state) => ({
          classification: {
            ...state.classification,
            answers: { ...state.classification.answers, [key]: value }
          }
        })),

        updateClassificationFromCompany: (company) => set((state) => ({
          classification: {
            ...state.classification,
            revenue: company.revenue || state.classification.revenue,
            employees: company.employees || state.classification.employees,
            geography: company.country || state.classification.geography,
            industry: company.industry || state.classification.industry,
            aiEnhanced: {
              revenue: !!company.revenue,
              employees: !!company.employees,
              geography: !!company.country,
              industry: !!company.industry
            }
          }
        })),

        // Scenario Actions
        addScenarioResponse: (dimension, question, response, metric) => set((state) => ({
          scenarioResponses: [
            ...state.scenarioResponses.filter(r => r.dimension !== dimension),
            { dimension, question, response, metric, timestamp: new Date() }
          ],
          progress: {
            ...state.progress,
            questionsAnswered: state.progress.questionsAnswered + 1
          }
        })),

        getScenarioResponse: (dimension) => {
          const { scenarioResponses } = get();
          return scenarioResponses.find(r => r.dimension === dimension);
        },

        // Progress Actions
        startAssessment: () => set({
          progress: {
            ...initialState.progress,
            currentStep: 'classification',
            startTime: new Date()
          }
        }),

        completeAssessment: (score, stage, percentile) => set({
          progress: {
            ...get().progress,
            currentStep: 'results',
            completionTime: new Date()
          },
          results: {
            diiScore: score,
            maturityStage: stage,
            percentile,
            timestamp: new Date()
          }
        }),

        updateProgress: (step) => set((state) => ({
          progress: { ...state.progress, currentStep: step }
        })),

        // Reset
        reset: () => set(initialState),

        // Computed Values
        isCompanyInfoComplete: () => {
          const { classification, companySearch } = get();
          return !!(
            companySearch.isConfirmed &&
            classification.businessModel &&
            (classification.revenue || classification.employees) &&
            classification.geography
          );
        },

        getClassificationCompletion: () => {
          const { classification } = get();
          const fields = [
            classification.businessModel,
            classification.revenue,
            classification.employees,
            classification.geography,
            classification.industry,
            classification.criticalInfra
          ];
          const completed = fields.filter(f => f !== null).length;
          return (completed / fields.length) * 100;
        }
      }),
      {
        name: 'dii-assessment-v2',
        partialize: (state) => ({
          // Only persist certain parts
          companySearch: {
            selectedCompany: state.companySearch.selectedCompany,
            isConfirmed: state.companySearch.isConfirmed
          },
          classification: state.classification,
          scenarioResponses: state.scenarioResponses,
          progress: {
            currentStep: state.progress.currentStep,
            questionsAnswered: state.progress.questionsAnswered
          },
          results: state.results
        })
      }
    )
  )
);