/**
 * DII Assessment Platform v2
 * Main Application Component
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomePage } from './pages/HomePage';
import { ClassificationPage } from './pages/ClassificationPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { ResultsPage } from './pages/ResultsPage';

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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/Laberit-intelligence/apps/assessment-v2">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/assessment/classify" element={<ClassificationPage />} />
            <Route path="/assessment/questions" element={<QuestionsPage />} />
            <Route path="/assessment/results" element={<ResultsPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}