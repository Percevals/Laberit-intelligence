import { useEffect, useState } from 'react';
import { getConfigDebugInfo } from '@/config/ai-config';
import { useCompanySearch } from '@features/company-search/useCompanySearch';

export function ConfigDebugPage() {
  const [config] = useState(() => getConfigDebugInfo());
  const { aiService } = useCompanySearch();
  const [healthCheck, setHealthCheck] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check AI service health
    aiService.checkHealth().then(setHealthCheck);
  }, [aiService]);

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Configuration Debug</h1>
        
        <div className="grid gap-6">
          {/* Environment Info */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Environment</h2>
            <div className="space-y-2 font-mono">
              <div>Mode: <span className="text-primary-600">{config.env}</span></div>
              <div>Has Mistral: <span className={config.hasMistral ? 'text-green-500' : 'text-red-500'}>{config.hasMistral ? '✅' : '❌'}</span></div>
              <div>Has OpenAI: <span className={config.hasOpenAI ? 'text-green-500' : 'text-red-500'}>{config.hasOpenAI ? '✅' : '❌'}</span></div>
              <div>Use Mock: <span className={config.useMock ? 'text-yellow-500' : 'text-green-500'}>{config.useMock ? '⚠️' : '✅'}</span></div>
            </div>
          </div>

          {/* Provider Health */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Provider Health</h2>
            <div className="space-y-2">
              {Object.entries(healthCheck).map(([provider, healthy]) => (
                <div key={provider} className="flex items-center gap-2">
                  <span className={healthy ? 'text-green-500' : 'text-red-500'}>
                    {healthy ? '🟢' : '🔴'}
                  </span>
                  <span className="capitalize">{provider}</span>
                  <span className="text-sm text-dark-text-secondary">
                    {healthy ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Variables */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2 font-mono text-sm">
              <div>VITE_MISTRAL_API_KEY: <span className="text-primary-600">{import.meta.env.VITE_MISTRAL_API_KEY ? '***' + import.meta.env.VITE_MISTRAL_API_KEY.slice(-4) : 'Not set'}</span></div>
              <div>VITE_OPENAI_API_KEY: <span className="text-primary-600">{import.meta.env.VITE_OPENAI_API_KEY ? '***' + import.meta.env.VITE_OPENAI_API_KEY.slice(-4) : 'Not set'}</span></div>
              <div>NODE_ENV: <span className="text-primary-600">{import.meta.env.NODE_ENV}</span></div>
              <div>MODE: <span className="text-primary-600">{import.meta.env.MODE}</span></div>
            </div>
          </div>

          {/* Quick Test */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Test</h2>
            <p className="mb-4 text-dark-text-secondary">
              Try searching for a company to test the AI integration:
            </p>
            <button 
              onClick={() => window.location.href = '/assessment/company'}
              className="btn-primary"
            >
              Go to Company Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}