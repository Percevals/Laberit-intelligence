/**
 * Threat Landscape Component
 * Display contextual threat intelligence
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  TrendingUp,
  Shield,
  Info,
  MapPin,
  Activity,
  Zap
} from 'lucide-react';
import type { IntelligenceReport, ThreatPattern } from '@/services/intelligence-engine';
import { cn } from '@shared/utils/cn';

interface ThreatLandscapeProps {
  report: IntelligenceReport;
}

export function ThreatLandscape({ report }: ThreatLandscapeProps) {
  const [selectedPattern, setSelectedPattern] = useState<ThreatPattern | null>(null);
  const [activeTab, setActiveTab] = useState<'patterns' | 'regional' | 'emerging'>('patterns');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-500 bg-red-500/10';
      case 'High': return 'text-orange-500 bg-orange-500/10';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'Low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Accelerating': return '📈';
      case 'Growing': return '↗️';
      case 'Stable': return '→';
      case 'Declining': return '↘️';
      default: return '•';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-dark-text-secondary">Active Threats</span>
          </div>
          <div className="text-2xl font-bold text-dark-text">
            {report.threatLandscape.relevantPatterns.length}
          </div>
          <div className="text-xs text-dark-text-secondary mt-1">
            Affecting your profile
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-dark-text-secondary">Emerging Risks</span>
          </div>
          <div className="text-2xl font-bold text-dark-text">
            {report.threatLandscape.emergingThreats.length}
          </div>
          <div className="text-xs text-dark-text-secondary mt-1">
            New threats detected
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-dark-text-secondary">Regional Risks</span>
          </div>
          <div className="text-2xl font-bold text-dark-text">
            {report.threatLandscape.regionalFactors.specificThreats.length}
          </div>
          <div className="text-xs text-dark-text-secondary mt-1">
            LATAM specific
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm text-dark-text-secondary">Industry Trends</span>
          </div>
          <div className="text-2xl font-bold text-dark-text">
            {report.threatLandscape.industryTrends.length}
          </div>
          <div className="text-xs text-dark-text-secondary mt-1">
            Sector patterns
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-dark-border">
        <div className="flex gap-6">
          {[
            { id: 'patterns', label: 'Threat Patterns' },
            { id: 'regional', label: 'Regional Analysis' },
            { id: 'emerging', label: 'Emerging Threats' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pb-3 px-1 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-primary-600"
                  : "text-dark-text-secondary hover:text-dark-text"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="threatTab"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'patterns' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pattern List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-dark-text">
                Active Threat Patterns
              </h3>
              
              <div className="space-y-3">
                {report.threatLandscape.relevantPatterns.map(pattern => (
                  <motion.div
                    key={pattern.id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedPattern(pattern)}
                    className={cn(
                      "bg-dark-surface border rounded-lg p-4 cursor-pointer transition-all",
                      selectedPattern?.id === pattern.id
                        ? "border-primary-600"
                        : "border-dark-border hover:border-primary-600/50"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-dark-text">{pattern.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-0.5 text-xs rounded", getSeverityColor(pattern.severity))}>
                          {pattern.severity}
                        </span>
                        <span className="text-sm">{getTrendIcon(pattern.trend)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-dark-text-secondary mb-3 line-clamp-2">
                      {pattern.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-dark-text-secondary">
                      <span>Frequency: {pattern.frequency}</span>
                      <span>•</span>
                      <span>Updated: {new Date(pattern.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pattern Details */}
            {selectedPattern ? (
              <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
                <h4 className="text-lg font-medium text-dark-text mb-4">
                  {selectedPattern.name}
                </h4>
                
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <h5 className="text-sm font-medium text-dark-text mb-2">Overview</h5>
                    <p className="text-sm text-dark-text-secondary">
                      {selectedPattern.description}
                    </p>
                  </div>

                  {/* Indicators */}
                  <div>
                    <h5 className="text-sm font-medium text-dark-text mb-2">Key Indicators</h5>
                    <div className="space-y-1">
                      {selectedPattern.indicators.map((indicator, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5" />
                          <span className="text-sm text-dark-text-secondary">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mitigations */}
                  <div>
                    <h5 className="text-sm font-medium text-dark-text mb-2">Recommended Mitigations</h5>
                    <div className="space-y-1">
                      {selectedPattern.mitigations.map((mitigation, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Shield className="w-3 h-3 text-green-500 mt-0.5" />
                          <span className="text-sm text-dark-text-secondary">{mitigation}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Affected */}
                  <div>
                    <h5 className="text-sm font-medium text-dark-text mb-2">Affects</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedPattern.industries.map(industry => (
                        <span key={industry} className="px-2 py-1 text-xs bg-dark-bg text-dark-text-secondary rounded">
                          {industry}
                        </span>
                      ))}
                      {selectedPattern.regions.map(region => (
                        <span key={region} className="px-2 py-1 text-xs bg-primary-600/20 text-primary-400 rounded">
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-dark-surface border border-dark-border rounded-lg p-6 flex items-center justify-center h-96">
                <div className="text-center">
                  <Info className="w-8 h-8 text-dark-text-secondary mx-auto mb-3" />
                  <p className="text-dark-text-secondary">
                    Select a threat pattern to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'regional' && (
          <div className="space-y-6">
            {/* Regional Risk Factors */}
            <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
              <h3 className="text-lg font-medium text-dark-text mb-4">
                LATAM Regional Risk Profile
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(report.threatLandscape.regionalFactors.factors).map(([factor, score]) => (
                  <div key={factor} className="text-center">
                    <div className="text-sm text-dark-text-secondary mb-2">
                      {factor.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="relative w-20 h-20 mx-auto">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-dark-bg"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(score / 10) * 226} 226`}
                          className={cn(
                            score >= 7 ? "text-red-500" :
                            score >= 5 ? "text-yellow-500" :
                            "text-green-500"
                          )}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-dark-text">{score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Specific Threats */}
                <div>
                  <h4 className="font-medium text-dark-text mb-3">Regional Specific Threats</h4>
                  <div className="space-y-2">
                    {report.threatLandscape.regionalFactors.specificThreats.map((threat, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span className="text-sm text-dark-text-secondary">{threat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emerging Risks */}
                <div>
                  <h4 className="font-medium text-dark-text mb-3">Regional Emerging Risks</h4>
                  <div className="space-y-2">
                    {report.threatLandscape.regionalFactors.emergingRisks.map((risk, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-sm text-dark-text-secondary">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emerging' && (
          <div className="space-y-6">
            {/* Emerging Threats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {report.threatLandscape.emergingThreats.map((threat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-dark-surface border border-dark-border rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Zap className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-dark-text mb-2">{threat}</h4>
                      <div className="flex items-center gap-2 text-xs text-dark-text-secondary">
                        <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-600 rounded">
                          Emerging
                        </span>
                        <span>First detected this quarter</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Industry Trends */}
            <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
              <h3 className="text-lg font-medium text-dark-text mb-4">
                Industry Trends
              </h3>
              
              <div className="space-y-3">
                {report.threatLandscape.industryTrends.map((trend, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-dark-text">{trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}