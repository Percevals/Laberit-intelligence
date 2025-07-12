import React from 'react';

/**
 * AIStatusBadge Component
 * 
 * Shows the current AI provider status
 * Useful for debugging and user transparency
 * 
 * @param {Object} props
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isAvailable - AI availability
 * @param {string} props.provider - AI provider name
 * @param {string} props.mode - Operation mode
 * @param {string} props.className - Additional CSS classes
 */
export function AIStatusBadge({ 
  isLoading = false,
  isAvailable = true,
  provider = 'Unknown',
  mode = 'demo',
  className = '' 
}) {
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
    'OpenAIProvider': 'bg-green-100 text-green-700',
    'claude': 'bg-purple-100 text-purple-700',
    'offline': 'bg-blue-100 text-blue-700',
    'openai': 'bg-green-100 text-green-700'
  };

  const color = providerColors[provider] || 'bg-gray-100 text-gray-700';
  const displayName = provider === 'OfflineProvider' || provider === 'offline' 
    ? 'Modo Demo' 
    : provider.replace('Provider', '');

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${color} ${className}`}>
      <span className="mr-1">🤖</span>
      {displayName}
      {mode !== 'demo' && <span className="ml-1 opacity-60">({mode})</span>}
    </div>
  );
}

export default AIStatusBadge;