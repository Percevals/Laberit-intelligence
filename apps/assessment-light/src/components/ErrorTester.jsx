/**
 * Error Boundary Tester Component
 * For testing error boundary resilience (development only)
 */

import React, { useState } from 'react';

export function ErrorTester() {
  const [shouldError, setShouldError] = useState(false);
  const [errorType, setErrorType] = useState('render');

  // Only show in development
  if (process.env.NODE_ENV !== 'development' && window.location.hostname !== 'localhost') {
    return null;
  }

  if (shouldError) {
    switch (errorType) {
      case 'render':
        throw new Error('Test render error: Component intentionally failed during rendering');
      case 'network':
        throw new Error('Network error: Failed to fetch data from server');
      case 'calculation':
        throw new Error('Calculation error: Invalid input parameters');
      case 'memory':
        throw new Error('Memory error: Out of memory while processing');
      default:
        throw new Error('Generic test error');
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-50">
      <div className="text-xs font-medium mb-2">Error Boundary Test (Dev Only)</div>
      
      <div className="space-y-2">
        <select 
          value={errorType} 
          onChange={(e) => setErrorType(e.target.value)}
          className="text-xs bg-gray-700 text-white rounded px-2 py-1 w-full"
        >
          <option value="render">Render Error</option>
          <option value="network">Network Error</option>
          <option value="calculation">Calculation Error</option>
          <option value="memory">Memory Error</option>
        </select>
        
        <button
          onClick={() => setShouldError(true)}
          className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded w-full"
        >
          Trigger Error
        </button>
      </div>
    </div>
  );
}

export default ErrorTester;