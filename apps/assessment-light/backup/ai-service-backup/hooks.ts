/**
 * Modern AI Hooks
 * Type-safe React hooks for AI service integration
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { getAIService } from './AIService';
import type { 
  UseAIResult, 
  UseCompromiseAnalysisResult, 
  UseExecutiveInsightsResult,
  AIRequest,
  AIResponse,
  AIError,
  AIServiceState,
  AssessmentData,
  CompromiseAnalysisResponse,
  ExecutiveInsightsResponse
} from './types';

// Core AI service hook
export function useAI(): UseAIResult {
  const [state, setState] = useState<AIServiceState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AIError | null>(null);
  const serviceRef = useRef(getAIService());

  useEffect(() => {
    const service = serviceRef.current;
    let mounted = true;

    // Initialize service
    const initService = async () => {
      try {
        setIsLoading(true);
        await service.initialize();
        
        if (mounted) {
          setState(service.getState());
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as AIError);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Listen for service events
    const handleServiceEvent = () => {
      if (mounted) {
        setState(service.getState());
      }
    };

    service.addEventListener(handleServiceEvent);
    initService();

    return () => {
      mounted = false;
      service.removeEventListener(handleServiceEvent);
    };
  }, []);

  const request = useCallback(async (req: Omit<AIRequest, 'id'>): Promise<AIResponse> => {
    const service = serviceRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.request(req);
      
      if (!response.success && response.error) {
        setError(response.error);
      }
      
      return response;
    } catch (err) {
      const error = err as AIError;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    isAvailable: state?.isInitialized && serviceRef.current.isServiceAvailable(),
    provider: state?.currentProvider || 'unknown',
    error,
    request
  };
}

// Compromise analysis hook
export function useCompromiseAnalysis(
  assessmentData?: AssessmentData,
  options: { autoRun?: boolean; interval?: number } = {}
): UseCompromiseAnalysisResult {
  const { autoRun = false, interval } = options;
  const [analysis, setAnalysis] = useState<CompromiseAnalysisResponse | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<AIError | undefined>();
  const { request, isAvailable } = useAI();
  const abortControllerRef = useRef<AbortController | null>(null);

  const runAnalysis = useCallback(async (data?: AssessmentData) => {
    const targetData = data || assessmentData;
    
    if (!targetData || !isAvailable) {
      return;
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setIsAnalyzing(true);
    setError(undefined);

    try {
      const response = await request({
        type: 'compromise-analysis',
        data: targetData,
        options: {
          timeout: 30000,
          retries: 2,
          cache: true
        }
      });

      if (response.success && response.data) {
        setAnalysis(response.data as CompromiseAnalysisResponse);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err as AIError);
      }
    } finally {
      setIsAnalyzing(false);
      abortControllerRef.current = null;
    }
  }, [assessmentData, isAvailable, request]);

  const refresh = useCallback(() => {
    if (assessmentData) {
      runAnalysis(assessmentData);
    }
  }, [runAnalysis, assessmentData]);

  // Auto-run effect
  useEffect(() => {
    if (autoRun && assessmentData && isAvailable) {
      runAnalysis();
    }
  }, [autoRun, assessmentData, isAvailable, runAnalysis]);

  // Interval effect
  useEffect(() => {
    if (interval && interval > 0 && assessmentData && isAvailable) {
      const timer = setInterval(() => {
        runAnalysis();
      }, interval);

      return () => clearInterval(timer);
    }
  }, [interval, assessmentData, isAvailable, runAnalysis]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    analysis,
    isAnalyzing,
    error,
    refresh
  };
}

// Executive insights hook
export function useExecutiveInsights(
  assessmentData?: AssessmentData,
  options: { autoRun?: boolean } = {}
): UseExecutiveInsightsResult {
  const { autoRun = false } = options;
  const [insights, setInsights] = useState<ExecutiveInsightsResponse | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AIError | undefined>();
  const { request, isAvailable } = useAI();
  const abortControllerRef = useRef<AbortController | null>(null);

  const runAnalysis = useCallback(async (data?: AssessmentData) => {
    const targetData = data || assessmentData;
    
    if (!targetData || !isAvailable) {
      return;
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await request({
        type: 'executive-insights',
        data: targetData,
        options: {
          timeout: 45000,
          retries: 1,
          cache: true
        }
      });

      if (response.success && response.data) {
        setInsights(response.data as ExecutiveInsightsResponse);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err as AIError);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [assessmentData, isAvailable, request]);

  const refresh = useCallback(() => {
    if (assessmentData) {
      runAnalysis(assessmentData);
    }
  }, [runAnalysis, assessmentData]);

  // Auto-run effect
  useEffect(() => {
    if (autoRun && assessmentData && isAvailable) {
      runAnalysis();
    }
  }, [autoRun, assessmentData, isAvailable, runAnalysis]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    insights,
    isLoading,
    error,
    refresh
  };
}

// AI status hook (simplified version of useAI for status only)
export function useAIStatus() {
  const [state, setState] = useState({
    isLoading: true,
    isAvailable: false,
    provider: 'unknown',
    mode: 'offline' as 'online' | 'offline' | 'hybrid'
  });

  useEffect(() => {
    const service = getAIService();
    let mounted = true;

    const updateStatus = () => {
      if (!mounted) return;
      
      const serviceState = service.getState();
      const isAvailable = service.isServiceAvailable();
      
      setState({
        isLoading: false,
        isAvailable,
        provider: serviceState.currentProvider,
        mode: isAvailable ? 'online' : 'offline'
      });
    };

    // Initialize and set up listener
    service.initialize()
      .then(updateStatus)
      .catch(() => {
        if (mounted) {
          setState({
            isLoading: false,
            isAvailable: false,
            provider: 'offline',
            mode: 'offline'
          });
        }
      });

    service.addEventListener(updateStatus);

    return () => {
      mounted = false;
      service.removeEventListener(updateStatus);
    };
  }, []);

  return state;
}

// Utility hook for checking feature availability
export function useAIFeature(feature: keyof import('./types').FeatureFlags) {
  const [isEnabled, setIsEnabled] = useState(false);
  
  useEffect(() => {
    const service = getAIService();
    const state = service.getState();
    setIsEnabled(state.config.features[feature]);
    
    const handleConfigUpdate = () => {
      const newState = service.getState();
      setIsEnabled(newState.config.features[feature]);
    };
    
    service.addEventListener(handleConfigUpdate);
    
    return () => {
      service.removeEventListener(handleConfigUpdate);
    };
  }, [feature]);
  
  return isEnabled;
}