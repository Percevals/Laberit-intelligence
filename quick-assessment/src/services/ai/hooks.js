/**
 * React hooks for AI service integration
 * 
 * Provides easy access to AI capabilities in React components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getAIService } from './AIService.js';
import { aiConfig } from '../config/ai.config.js';

/**
 * Main hook for accessing AI service
 */
export function useAIService() {
  const [aiService, setAIService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAI = async () => {
      try {
        setIsLoading(true);
        const service = getAIService();
        await service.ensureInitialized();
        setAIService(service);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize AI service:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAI();
  }, []);

  return {
    aiService,
    isLoading,
    error,
    isAvailable: aiService?.isAvailable() || false,
    provider: aiService?.getProviderName() || 'Unknown'
  };
}

/**
 * Hook for compromise analysis
 */
export function useCompromiseAnalysis(assessmentData) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const { aiService, isAvailable } = useAIService();
  const abortControllerRef = useRef(null);

  const analyzeCompromise = useCallback(async (data = assessmentData) => {
    if (!aiService || !isAvailable || !data) return;

    // Cancel any pending analysis
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setIsAnalyzing(true);
      setError(null);
      
      const result = await aiService.analyzeCompromiseRisk(data);
      
      if (!abortControllerRef.current.signal.aborted) {
        setAnalysis(result);
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        console.error('Compromise analysis failed:', err);
        setError(err.message);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setIsAnalyzing(false);
      }
    }
  }, [aiService, isAvailable, assessmentData]);

  // Auto-analyze when data changes
  useEffect(() => {
    if (assessmentData && aiConfig.features.compromiseScore) {
      analyzeCompromise(assessmentData);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [assessmentData, analyzeCompromise]);

  return {
    analysis,
    isAnalyzing,
    error,
    reanalyze: analyzeCompromise
  };
}

/**
 * Hook for executive insights
 */
export function useExecutiveInsights(assessmentData) {
  const [insights, setInsights] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const { aiService, isAvailable } = useAIService();

  const generateInsights = useCallback(async (data = assessmentData) => {
    if (!aiService || !isAvailable || !data) return;

    try {
      setIsGenerating(true);
      setError(null);
      
      const result = await aiService.generateExecutiveInsights(data);
      setInsights(result);
    } catch (err) {
      console.error('Executive insights generation failed:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  }, [aiService, isAvailable, assessmentData]);

  return {
    insights,
    isGenerating,
    error,
    generateInsights
  };
}

/**
 * Hook for threat context
 */
export function useThreatContext(businessModel, region = 'LATAM') {
  const [threatContext, setThreatContext] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { aiService, isAvailable } = useAIService();

  useEffect(() => {
    if (!aiService || !isAvailable || !businessModel) return;

    const fetchThreatContext = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await aiService.getThreatContext(businessModel, region);
        setThreatContext(result);
      } catch (err) {
        console.error('Threat context retrieval failed:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (aiConfig.features.threatContext) {
      fetchThreatContext();
    }
  }, [aiService, isAvailable, businessModel, region]);

  return {
    threatContext,
    isLoading,
    error
  };
}

/**
 * Hook for scenario simulation
 */
export function useScenarioSimulation(baseAssessment) {
  const [simulation, setSimulation] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState(null);
  const { aiService, isAvailable } = useAIService();

  const simulateScenario = useCallback(async (changes) => {
    if (!aiService || !isAvailable || !baseAssessment || !changes) return;

    try {
      setIsSimulating(true);
      setError(null);
      
      const result = await aiService.simulateScenario(baseAssessment, changes);
      setSimulation(result);
    } catch (err) {
      console.error('Scenario simulation failed:', err);
      setError(err.message);
    } finally {
      setIsSimulating(false);
    }
  }, [aiService, isAvailable, baseAssessment]);

  const reset = useCallback(() => {
    setSimulation(null);
    setError(null);
  }, []);

  return {
    simulation,
    isSimulating,
    error,
    simulateScenario,
    reset
  };
}

/**
 * Hook for AI-powered insights with caching
 */
export function useAIInsight(data, insightType, options = {}) {
  const [insight, setInsight] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { aiService, isAvailable } = useAIService();
  const cacheRef = useRef(new Map());

  const {
    enableCache = aiConfig.performance.cacheResponses,
    cacheDuration = aiConfig.performance.cacheDuration,
    autoFetch = true
  } = options;

  const fetchInsight = useCallback(async () => {
    if (!aiService || !isAvailable || !data || !insightType) return;

    // Check cache
    const cacheKey = JSON.stringify({ data, insightType });
    if (enableCache && cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      if (Date.now() - cached.timestamp < cacheDuration) {
        setInsight(cached.data);
        return;
      }
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await aiService.getInsightWithFallback(data, insightType);
      setInsight(result);
      
      // Cache the result
      if (enableCache) {
        cacheRef.current.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }
    } catch (err) {
      console.error('AI insight fetch failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [aiService, isAvailable, data, insightType, enableCache, cacheDuration]);

  useEffect(() => {
    if (autoFetch) {
      fetchInsight();
    }
  }, [fetchInsight, autoFetch]);

  return {
    insight,
    isLoading,
    error,
    refetch: fetchInsight
  };
}

/**
 * Hook for AI provider status
 */
export function useAIStatus() {
  const { aiService, isLoading, error, isAvailable, provider } = useAIService();
  const [capabilities, setCapabilities] = useState(null);

  useEffect(() => {
    if (aiService && isAvailable) {
      setCapabilities(aiService.provider.getCapabilities());
    }
  }, [aiService, isAvailable]);

  return {
    isLoading,
    error,
    isAvailable,
    provider,
    capabilities,
    mode: aiConfig.mode,
    features: aiConfig.features
  };
}