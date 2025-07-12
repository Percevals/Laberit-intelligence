/**
 * Simple Fallback Component
 * Provides basic functionality when main components fail
 */

import React from 'react';

export function AssessmentFallback() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Safe Mode Active</h2>
        <p className="text-gray-600 mb-6">
          The assessment is running in safe mode with basic functionality.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Quick DII Estimate</h3>
          <p className="text-sm text-blue-800">
            Based on typical organizational patterns, most companies score between 4-6 on the DII scale.
            For a detailed assessment, please try reloading the page or contact support.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 font-medium"
          >
            Try Full Assessment Again
          </button>
          
          <a
            href="https://laberit.com/contacto"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 font-medium inline-block text-center"
          >
            Schedule Professional Assessment
          </a>
        </div>
      </div>
    </div>
  );
}

export function CalculationFallback() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h3 className="font-semibold text-yellow-900 mb-1">Calculation Service Unavailable</h3>
          <p className="text-yellow-800 text-sm mb-3">
            The DII calculation engine is temporarily unavailable. Your responses have been saved.
          </p>
          
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700"
            >
              Retry Calculation
            </button>
            
            <p className="text-xs text-yellow-700">
              Or contact us for a manual assessment: <a href="mailto:info@laberit.com" className="underline">info@laberit.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UIFallback({ componentName }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-900 mb-1">Component Unavailable</h3>
        <p className="text-sm text-gray-600 mb-3">
          {componentName ? `${componentName} is temporarily unavailable` : 'This feature is temporarily unavailable'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default AssessmentFallback;