import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
      isRecovering: false,
      fallbackMode: false
    };
    
    // Bind methods
    this.handleRetry = this.handleRetry.bind(this);
    this.handleFallback = this.handleFallback.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component error caught:', error, errorInfo);
    
    // Enhanced error logging with context
    const errorContext = {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      props: this.props.fallbackComponent ? 'Has fallback' : 'No fallback'
    };
    
    console.error('Enhanced error context:', errorContext);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Auto-retry logic for transient errors
    if (this.isTransientError(error) && this.state.retryCount < 2) {
      setTimeout(() => {
        if (this.state.hasError) {
          this.handleRetry();
        }
      }, 1000);
    }
  }

  // Detect if error might be transient (network, temporary state issues)
  isTransientError(error) {
    const transientPatterns = [
      /network/i,
      /fetch/i,
      /loading/i,
      /timeout/i,
      /temporarily unavailable/i
    ];
    
    return transientPatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.toString())
    );
  }

  async handleRetry() {
    this.setState({ isRecovering: true });
    
    try {
      // Clear any cached data that might be causing issues
      if (typeof localStorage !== 'undefined') {
        const cacheKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('dii-') || key.startsWith('assessment-')
        );
        cacheKeys.forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (e) {
            console.warn('Could not clear cache key:', key);
          }
        });
      }
      
      // Wait a moment for any async operations to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null,
        isRecovering: false,
        retryCount: this.state.retryCount + 1
      });
      
    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
      this.setState({ 
        isRecovering: false,
        fallbackMode: true 
      });
    }
  }

  handleFallback() {
    this.setState({ fallbackMode: true });
  }

  handleReset() {
    // Hard reset - clear all state and reload if necessary
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
      isRecovering: false,
      fallbackMode: false
    });
    
    // If still having issues, suggest page reload
    if (this.state.retryCount >= 3) {
      if (window.confirm('The app is having persistent issues. Would you like to reload the page?')) {
        window.location.reload();
      }
    }
  }

  render() {
    // Show fallback component if available and in fallback mode
    if (this.state.fallbackMode && this.props.fallbackComponent) {
      return (
        <div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-800 font-medium">
                Running in safe mode
              </span>
            </div>
          </div>
          {this.props.fallbackComponent}
        </div>
      );
    }

    if (this.state.hasError) {
      // Show recovery UI
      if (this.state.isRecovering) {
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 m-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div>
                <h2 className="text-lg font-semibold text-blue-800">Recovering...</h2>
                <p className="text-blue-600 text-sm">Attempting to restore functionality</p>
              </div>
            </div>
          </div>
        );
      }

      // Determine error severity and recovery options
      const isTransient = this.isTransientError(this.state.error);
      const canRetry = this.state.retryCount < 3;
      const hasFallback = !!this.props.fallbackComponent;

      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-800">
                {isTransient ? 'Temporary Issue Detected' : 'Component Error Occurred'}
              </h2>
              <p className="text-red-600 text-sm mt-1">
                {isTransient 
                  ? 'This appears to be a temporary issue that may resolve automatically.'
                  : 'An unexpected error prevented this component from rendering properly.'
                }
              </p>
              {this.state.retryCount > 0 && (
                <p className="text-red-500 text-xs mt-1">
                  Retry attempt: {this.state.retryCount}/3
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {canRetry && (
              <button
                onClick={this.handleRetry}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
              >
                {isTransient ? 'Retry Now' : 'Try Again'}
              </button>
            )}
            
            {hasFallback && (
              <button
                onClick={this.handleFallback}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium"
              >
                Use Safe Mode
              </button>
            )}
            
            <button
              onClick={this.handleReset}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm font-medium"
            >
              Reset Component
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-medium"
            >
              Reload Page
            </button>
          </div>

          {/* User-friendly suggestions */}
          <div className="bg-red-100 rounded-lg p-3 mb-4">
            <h3 className="text-sm font-medium text-red-800 mb-2">What you can try:</h3>
            <ul className="text-xs text-red-700 space-y-1">
              <li>• Wait a moment and try again (network issues often resolve quickly)</li>
              <li>• Check your internet connection</li>
              <li>• Clear your browser cache and reload</li>
              {hasFallback && <li>• Use safe mode for basic functionality</li>}
            </ul>
          </div>

          {/* Error Details (Collapsible) */}
          <details className="mb-4">
            <summary className="cursor-pointer text-red-700 font-medium text-sm hover:text-red-800">
              Show Technical Details
            </summary>
            <div className="mt-3 bg-red-100 rounded p-3">
              <div className="text-xs text-red-600 space-y-2">
                <div>
                  <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                </div>
                <div>
                  <strong>Location:</strong> {this.props.componentName || 'Unknown Component'}
                </div>
                <div>
                  <strong>Time:</strong> {new Date().toLocaleString()}
                </div>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">Component Stack</summary>
                    <pre className="mt-1 text-xs bg-red-200 p-2 rounded overflow-auto whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </details>

          {/* Contact Support */}
          <div className="text-xs text-red-600">
            <p>
              If this problem persists, please report it at{' '}
              <a 
                href="https://github.com/Percevals/Laberit-intelligence/issues" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-red-800"
              >
                GitHub Issues
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;