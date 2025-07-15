import { useState, useCallback, useRef, useEffect } from 'react';
import { AIService } from '@services/ai/ai-service';
import { getAIConfig, getConfigDebugInfo } from '@/config/ai-config';
// import { getDatabaseService } from '@/database'; // TODO: Move to server-side API
import type { CompanySearchResult } from '@services/ai/types';

// Initialize AI service with robust configuration
const aiConfig = getAIConfig();
const aiService = new AIService({
  providers: {
    ...(aiConfig.openai && { openai: aiConfig.openai }),
    ...(aiConfig.mistral && { mistral: aiConfig.mistral })
  },
  useMockInDev: aiConfig.useMockInDev,
  cache: aiConfig.cache
});

// Debug info in console
console.log('AI Configuration:', getConfigDebugInfo());

export function useCompanySearch() {
  const [results, setResults] = useState<CompanySearchResult>({
    companies: [],
    query: '',
    provider: '',
    searchTime: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string) => {
    // Cancel previous search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query || query.length < 2) {
      setResults({
        companies: [],
        query: '',
        provider: '',
        searchTime: 0
      });
      return;
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    try {
      // First try AI service search
      const aiResults = await aiService.searchCompany(query);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      // TODO: Add database search integration via server-side API
      // For now, use only AI results
      setResults(aiResults);
      console.log(`Company search completed using ${aiResults.provider} in ${aiResults.searchTime}ms`);
    } catch (err) {
      // Ignore aborted requests
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      console.error('Company search error:', err);
      setError(err instanceof Error ? err.message : 'Error al buscar empresa');
      setResults({
        companies: [],
        query,
        provider: 'error',
        searchTime: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    search,
    results,
    loading,
    error,
    aiService // Expose for configuration if needed
  };
}