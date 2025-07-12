import React from 'react';
import { useAIStatus } from '../services/ai/hooks';

/**
 * AIStatusBadge Component
 * 
 * Shows the current AI provider status
 * Useful for debugging and user transparency
 */
export function AIStatusBadge({ className = '' }) {
  const { isLoading, isAvailable, provider, mode } = useAIStatus();

  if (isLoading) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 ${className}`}>
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
        Inicializando IA...
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-600 ${className}`}>
        <span className="mr-1">🔴</span>
        IA no disponible
      </div>
    );
  }

  const providerColors = {
    'ClaudeProvider': 'bg-purple-100 text-purple-700',
    'OfflineProvider': 'bg-blue-100 text-blue-700',
    'OpenAIProvider': 'bg-green-100 text-green-700'
  };

  const color = providerColors[provider] || 'bg-gray-100 text-gray-700';

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${color} ${className}`}>
      <span className="mr-1">🤖</span>
      {provider === 'OfflineProvider' ? 'Modo Demo' : provider.replace('Provider', '')}
      {mode !== 'demo' && <span className="ml-1 opacity-60">({mode})</span>}
    </div>
  );
}

export default AIStatusBadge;