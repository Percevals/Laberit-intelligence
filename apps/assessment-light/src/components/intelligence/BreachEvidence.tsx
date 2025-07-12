/**
 * Breach Evidence Component
 * Shows relevant breach cases based on assessment context
 */

import React, { useState, useEffect } from 'react';
import { breachEvidenceService } from '../../services/intelligence/BreachEvidenceService';

interface BreachEvidenceProps {
  businessModel: number;
  companySize?: string;
  region?: string;
  diiScore?: number;
  dimension?: string;
  mode?: 'inline' | 'detailed' | 'summary';
}

export function BreachEvidence({ 
  businessModel, 
  companySize, 
  region, 
  diiScore,
  dimension,
  mode = 'inline' 
}: BreachEvidenceProps) {
  const [breaches, setBreaches] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBreachData();
  }, [businessModel, companySize, region, diiScore]);

  const loadBreachData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await breachEvidenceService.findSimilarBreaches({
        businessModel,
        companySize,
        region,
        diiScore,
        limit: mode === 'detailed' ? 10 : 3
      });

      setBreaches([...result.exact_matches, ...result.similar_matches]);
      setInsights(result.risk_insights);
      
    } catch (err) {
      console.error('Error loading breach evidence:', err);
      setError('Unable to load breach evidence');
    } finally {
      setLoading(false);
    }
  };

  // Format financial values
  const formatMoney = (amount: number): string => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toFixed(0)}`;
  };

  // Format time duration
  const formatDuration = (hours: number): string => {
    if (hours >= 24) return `${Math.round(hours / 24)} days`;
    return `${hours} hours`;
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || breaches.length === 0) {
    return null; // Fail silently in inline mode
  }

  // Inline mode - compact display
  if (mode === 'inline') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3l-8.928-15.464c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-900">
              {breaches.length} similar companies breached recently
            </p>
            <p className="text-red-700 mt-1">
              Average loss: {formatMoney(insights.average_loss)} • 
              Downtime: {formatDuration(insights.average_downtime)}
            </p>
            {insights.common_vectors.length > 0 && (
              <p className="text-red-600 text-xs mt-1">
                Common attacks: {insights.common_vectors.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Summary mode - medium display
  if (mode === 'summary') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3l-8.928-15.464c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Recent Breaches in Your Sector
        </h4>
        
        <div className="space-y-3">
          {breaches.slice(0, 3).map((breach, index) => (
            <div key={breach.breach_id} className="border-l-2 border-red-300 pl-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {breach.victim_profile.sector} • {breach.victim_profile.size_employees} employees
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    {breach.attack.vector}: {breach.attack.method}
                  </p>
                </div>
                <div className="text-right ml-3">
                  <p className="font-semibold text-red-600 text-sm">
                    {formatMoney(breach.impact.financial_loss_usd)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatDuration(breach.impact.operational_impact.downtime_hours)} down
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {insights && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              <strong>Your Risk Context:</strong> {insights.peer_comparison}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Detailed mode - full display
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Evidence-Based Risk Analysis
      </h3>
      
      {/* Risk Overview */}
      {insights && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-red-900 mb-2">Risk Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-red-600">Average Loss</p>
              <p className="font-semibold text-red-900">{formatMoney(insights.average_loss)}</p>
            </div>
            <div>
              <p className="text-red-600">Avg Downtime</p>
              <p className="font-semibold text-red-900">{formatDuration(insights.average_downtime)}</p>
            </div>
            <div>
              <p className="text-red-600">Similar Breaches</p>
              <p className="font-semibold text-red-900">{breaches.length} cases</p>
            </div>
            <div>
              <p className="text-red-600">Top Threat</p>
              <p className="font-semibold text-red-900">{insights.common_vectors[0] || 'Various'}</p>
            </div>
          </div>
          <p className="text-sm text-red-700 mt-3">{insights.peer_comparison}</p>
        </div>
      )}
      
      {/* Breach Cases */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Recent Breach Cases</h4>
        {breaches.map((breach) => (
          <div key={breach.breach_id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-900">
                  {breach.victim_profile.sector} Company
                </p>
                <p className="text-sm text-gray-600">
                  {breach.victim_profile.region} • {breach.victim_profile.size_employees} employees
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">
                  {formatMoney(breach.impact.financial_loss_usd)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(breach.date_discovered).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded p-3 text-sm">
              <p className="text-gray-700">
                <strong>Attack:</strong> {breach.attack.vector} - {breach.attack.method}
              </p>
              <p className="text-gray-700 mt-1">
                <strong>Impact:</strong> {formatDuration(breach.impact.operational_impact.downtime_hours)} downtime, 
                {formatDuration(breach.impact.operational_impact.recovery_time_hours)} to recover
              </p>
              
              {/* DII Dimension Impacts */}
              {breach.dii_dimensions_impact && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-1">DII Dimensions Affected:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(breach.dii_dimensions_impact).map(([dim, impact]) => (
                      <span key={dim} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        {dim}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BreachEvidence;