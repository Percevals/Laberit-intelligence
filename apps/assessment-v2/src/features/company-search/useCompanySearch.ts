import { useState, useCallback, useRef, useEffect } from 'react';
import { AIService } from '@services/ai/ai-service';
import { getAIConfig, getConfigDebugInfo } from '@/config/ai-config';
import { getDatabaseService } from '@/database';
import { HybridSearchService } from '@/services/hybrid-search.service';
import type { HybridSearchResult } from '@/services/hybrid-search.service';

// Initialize services
const aiConfig = getAIConfig();
const aiService = new AIService({
  providers: {
    ...(aiConfig.openai && { openai: aiConfig.openai }),
    ...(aiConfig.mistral && { mistral: aiConfig.mistral })
  },
  useMockInDev: aiConfig.useMockInDev,
  cache: aiConfig.cache
});

// Initialize hybrid search service
let hybridSearchService: HybridSearchService | null = null;

// Initialize services asynchronously
const initializeServices = async () => {
  if (!hybridSearchService) {
    const dbService = await getDatabaseService();
    hybridSearchService = new HybridSearchService(dbService, aiService);
  }
  return hybridSearchService;
};

// Debug info in console
console.log('AI Configuration:', getConfigDebugInfo());

export function useCompanySearch() {
  const [results, setResults] = useState<HybridSearchResult>({
    companies: [],
    query: '',
    provider: '',
    searchTime: 0,
    databaseMatches: 0,
    aiMatches: 0,
    totalTime: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [searchMode, setSearchMode] = useState<'hybrid' | 'ai-only'>('hybrid');

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
        searchTime: 0,
        databaseMatches: 0,
        aiMatches: 0,
        totalTime: 0
      });
      return;
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    try {
      let searchResults: HybridSearchResult;
      
      if (searchMode === 'hybrid') {
        // Initialize hybrid search service if needed
        const service = await initializeServices();
        
        // Perform hybrid search
        searchResults = await service.search(query, {
          maxDatabaseResults: 20,
          maxAIResults: 10,
          fuzzyThreshold: 0.3,
          useAIFallback: true,
          combineResults: true
        });
      } else {
        // AI-only mode (fallback)
        const aiResults = await aiService.searchCompany(query);
        searchResults = {
          ...aiResults,
          companies: aiResults.companies.map(c => ({
            ...c,
            source: 'ai' as const,
            matchScore: 0.6,
            matchType: 'ai' as const
          })),
          databaseMatches: 0,
          aiMatches: aiResults.companies.length,
          totalTime: aiResults.searchTime
        };
      }
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setResults(searchResults);
      console.log(`Company search completed:`, {
        mode: searchMode,
        provider: searchResults.provider,
        totalTime: searchResults.totalTime,
        databaseMatches: searchResults.databaseMatches,
        aiMatches: searchResults.aiMatches
      });
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
        searchTime: 0,
        databaseMatches: 0,
        aiMatches: 0,
        totalTime: 0
      });
    } finally {
      setLoading(false);
    }
  }, [searchMode]);

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
    searchMode,
    setSearchMode,
    aiService // Expose for configuration if needed
  };
}