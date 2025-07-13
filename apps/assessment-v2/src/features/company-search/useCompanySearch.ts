import { useState, useCallback, useRef, useEffect } from 'react';
import { AIService } from '@services/ai/ai-service';
import type { CompanySearchResult } from '@services/ai/types';

// Initialize AI service - in production, this would use environment variables
const aiService = new AIService({
  providers: {
    openai: { 
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      model: 'gpt-3.5-turbo'
    },
    mistral: {
      apiKey: import.meta.env.VITE_MISTRAL_API_KEY || ''
    }
  },
  useMockInDev: true,
  cache: {
    enabled: true,
    ttl: 3600 // 1 hour
  }
});

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
      const searchResults = await aiService.searchCompany(query);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setResults(searchResults);
      
      // Log provider used (for debugging)
      console.log(`Company search completed using ${searchResults.provider} in ${searchResults.searchTime}ms`);
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