/**
 * DII Assessment Platform v2
 * Main Application Component
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DatabaseConnectionProvider } from './contexts/DatabaseConnectionContext';
import { DatabaseConnectionIndicator } from './components/DatabaseConnectionIndicator';
import { HomePage } from './pages/HomePage';
import { CompanySearchPage } from './pages/CompanySearchPage';
import { CompanyConfirmationPage } from './pages/CompanyConfirmationPage';
import { BusinessModelRevealPage } from './pages/BusinessModelRevealPage';
// import { SmartClassificationPage } from './pages/SmartClassificationPage'; // Removed - unused duplicate
import { ClassificationPage } from './pages/ClassificationPage';
// import { QuestionsPage } from './pages/QuestionsPage'; // Replaced by ScenarioQuestionsPage
// import { ScenarioQuestionsPage } from './pages/ScenarioQuestionsPage'; // Replaced by ImmunityBuildingPage
// import { ImmunityBuildingPage } from './pages/ImmunityBuildingPage'; // Replaced by AdaptiveImmunityBuildingPage
import { AdaptiveImmunityBuildingPage } from './pages/AdaptiveImmunityBuildingPage';
// import { ResultsPage } from './pages/ResultsPage'; // Replaced by EnhancedResultsPage
// import { EnhancedResultsPage } from './pages/EnhancedResultsPage'; // Replaced by ImmunityResultsPage
import { ImmunityResultsPage } from './pages/ImmunityResultsPage';
// Debug pages removed for production

// Core providers and setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading component
function LoadingScreen() {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        <p className="text-dark-text-secondary">{t('common.loading')}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <DatabaseConnectionProvider>
          <BrowserRouter basename="/Laberit-intelligence/apps/assessment-v2">
            <Suspense fallback={<LoadingScreen />}>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/assessment/company" element={<CompanySearchPage />} />
                  <Route path="/assessment/confirm" element={<CompanyConfirmationPage />} />
                  <Route path="/assessment/business-model" element={<BusinessModelRevealPage />} />
                  {/* <Route path="/assessment/smart-classify" element={<SmartClassificationPage />} /> Removed - unused duplicate */}
                  <Route path="/assessment/classify" element={<ClassificationPage />} />
                  <Route path="/assessment/questions" element={<AdaptiveImmunityBuildingPage />} />
                  <Route path="/assessment/results" element={<ImmunityResultsPage />} />
                  {/* Debug routes removed for production */}
                </Routes>
              </ErrorBoundary>
            </Suspense>
            <DatabaseConnectionIndicator />
          </BrowserRouter>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </DatabaseConnectionProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}