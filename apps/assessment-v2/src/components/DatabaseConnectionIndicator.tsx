/**
 * Database Connection Indicator
 * Shows the current database connection status
 */

import { useEffect, useState } from 'react';
import { Database, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { useDatabaseConnection } from '../contexts/DatabaseConnectionContext';
import { cn } from '@shared/utils/cn';

export function DatabaseConnectionIndicator() {
  const { isConnected, isConnecting, error, retryConnection } = useDatabaseConnection();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Auto-hide success state after 3 seconds
  useEffect(() => {
    if (isConnected && !error) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, error]);

  // Show indicator when there's an error or connecting
  useEffect(() => {
    if ((error || isConnecting) && !isConnected) {
      setIsExpanded(true);
    }
  }, [error, isConnecting, isConnected]);

  const handleRetry = async () => {
    await retryConnection();
  };

  // Determine status color and icon
  const getStatusDetails = () => {
    if (isConnecting) {
      return {
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        icon: <RefreshCw className="w-4 h-4 animate-spin" />,
        text: 'Connecting to database...'
      };
    }
    
    if (isConnected) {
      return {
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        icon: <Database className="w-4 h-4" />,
        text: 'Database connected'
      };
    }
    
    return {
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      icon: <WifiOff className="w-4 h-4" />,
      text: 'Database offline'
    };
  };

  const status = getStatusDetails();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          isExpanded ? 'w-auto' : 'w-10'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm',
            'bg-dark-surface/90 cursor-pointer select-none',
            status.bgColor,
            status.borderColor,
            'hover:opacity-90 transition-opacity'
          )}
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className={cn('flex items-center justify-center', status.color)}>
            {status.icon}
          </div>
          
          {isExpanded && (
            <div className="flex items-center gap-3">
              <span className="text-sm whitespace-nowrap">
                {status.text}
              </span>
              
              {error && !isConnecting && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetry();
                  }}
                  className="text-xs px-2 py-1 rounded bg-primary-600/20 hover:bg-primary-600/30 transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tooltip when collapsed */}
        {!isExpanded && showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 pointer-events-none">
            <div className="bg-dark-surface border border-dark-border rounded px-2 py-1 text-xs whitespace-nowrap">
              {status.text}
              {error && (
                <div className="flex items-center gap-1 mt-1 text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>Click to retry</span>
                </div>
              )}
            </div>
            <div className="absolute top-full right-2 w-2 h-2 bg-dark-surface border-r border-b border-dark-border transform rotate-45 -translate-y-1" />
          </div>
        )}
      </div>

      {/* Error details (optional) */}
      {error && isExpanded && (
        <div className="mt-2 p-3 bg-dark-surface/90 border border-red-500/30 rounded-lg max-w-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-red-400 font-medium">Connection Error</p>
              <p className="text-xs text-dark-text-secondary mt-1">
                {error === 'Connection refused' 
                  ? 'Database server is not running. Please start PostgreSQL.'
                  : error === 'Authentication failed'
                  ? 'Invalid database credentials. Check your configuration.'
                  : 'Unable to connect to the database. The app will use cached data.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}