/**
 * DII Assessment Platform v2
 * Main Application Component
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { cn } from '@shared/utils/cn';

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
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        <p className="text-dark-text-secondary">Initializing DII Assessment...</p>
      </div>
    </div>
  );
}

// Temporary home component - will be replaced with assessment flow
function Home() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-surface/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700" />
              <div>
                <h1 className="text-xl font-bold">DII Assessment Platform</h1>
                <p className="text-sm text-dark-text-secondary">Business Model Reality Check</p>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-dark-text-secondary hover:text-dark-text-primary transition-colors">
                About
              </a>
              <a href="#" className="text-dark-text-secondary hover:text-dark-text-primary transition-colors">
                Intelligence
              </a>
              <button className="btn-primary">
                Start Assessment
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-transparent" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-5xl font-light">
              Your <span className="font-bold text-gradient">Digital Immunity</span> Score
              <br />
              in 30 Minutes
            </h2>
            <p className="mb-8 text-xl text-dark-text-secondary">
              Based on 150+ real breach assessments. No fluff, just truth about your cyber resilience.
            </p>
            
            {/* Key metrics */}
            <div className="mb-12 grid grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="mb-2 text-3xl font-bold text-primary-600">8</div>
                <p className="text-sm text-dark-text-secondary">Business Models</p>
              </div>
              <div className="card text-center">
                <div className="mb-2 text-3xl font-bold text-primary-600">150+</div>
                <p className="text-sm text-dark-text-secondary">Validated Assessments</p>
              </div>
              <div className="card text-center">
                <div className="mb-2 text-3xl font-bold text-primary-600">95%</div>
                <p className="text-sm text-dark-text-secondary">Prediction Accuracy</p>
              </div>
            </div>
            
            {/* CTA */}
            <button className="btn-primary text-lg px-8 py-4">
              Begin Free Assessment →
            </button>
          </div>
        </div>
      </section>

      {/* Business Models Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="mb-8 text-center text-3xl font-light">
            Which Business Model Are You?
          </h3>
          
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: 'Subscription Based', color: 'text-primary-600' },
              { name: 'Transaction Based', color: 'text-primary-500' },
              { name: 'Asset Light', color: 'text-primary-400' },
              { name: 'Asset Heavy', color: 'text-primary-700' },
              { name: 'Data Driven', color: 'text-primary-600' },
              { name: 'Platform Ecosystem', color: 'text-primary-500' },
              { name: 'Direct to Consumer', color: 'text-primary-400' },
              { name: 'B2B Enterprise', color: 'text-primary-700' },
            ].map((model, i) => (
              <div
                key={i}
                className={cn(
                  'card-interactive text-center',
                  'hover:border-primary-600/50'
                )}
              >
                <div className={cn('mb-2 text-2xl font-bold', model.color)}>
                  {i + 1}
                </div>
                <p className="text-sm">{model.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maturity Stages */}
      <section className="border-t border-dark-border py-16">
        <div className="container mx-auto px-4">
          <h3 className="mb-8 text-center text-3xl font-light">
            Four Stages of Digital Immunity
          </h3>
          
          <div className="grid gap-6 md:grid-cols-4">
            <div className="card border-fragil/30">
              <h4 className="mb-2 text-xl font-bold text-fragil">FRAGIL</h4>
              <p className="text-sm text-dark-text-secondary">
                High risk, minimal resilience. Immediate action required.
              </p>
            </div>
            <div className="card border-robusto/30">
              <h4 className="mb-2 text-xl font-bold text-robusto">ROBUSTO</h4>
              <p className="text-sm text-dark-text-secondary">
                Basic defenses, but vulnerable. Significant gaps remain.
              </p>
            </div>
            <div className="card border-resiliente/30">
              <h4 className="mb-2 text-xl font-bold text-resiliente">RESILIENTE</h4>
              <p className="text-sm text-dark-text-secondary">
                Good recovery capability. Can handle most attacks.
              </p>
            </div>
            <div className="card border-adaptativo/30">
              <h4 className="mb-2 text-xl font-bold text-adaptativo">ADAPTATIVO</h4>
              <p className="text-sm text-dark-text-secondary">
                Excellent resilience. Learns and adapts from threats.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingScreen />}>
        <Home />
      </Suspense>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}