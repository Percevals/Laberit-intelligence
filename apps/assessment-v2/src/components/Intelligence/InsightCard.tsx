/**
 * Insight Card Component
 * Display individual personalized insights
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  BarChart3,
  Eye,
  Bookmark,
  X,
  ChevronRight,
  Shield,
  Clock,
  CheckCircle2
} from 'lucide-react';
import type { PersonalizedInsight } from '@/services/intelligence-engine';
import { useIntelligenceStore } from '@/store/intelligence-store';
import { cn } from '@shared/utils/cn';

interface InsightCardProps {
  insight: PersonalizedInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const { bookmarkInsight, dismissInsight, bookmarkedInsights } = useIntelligenceStore();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isBookmarked = bookmarkedInsights.includes(insight.id);
  
  const getIcon = () => {
    switch (insight.type) {
      case 'risk': return AlertTriangle;
      case 'opportunity': return Lightbulb;
      case 'trend': return TrendingUp;
      case 'benchmark': return BarChart3;
      case 'prediction': return Eye;
      default: return Shield;
    }
  };
  
  const getTypeColor = () => {
    switch (insight.type) {
      case 'risk': return 'text-red-500 bg-red-500/10';
      case 'opportunity': return 'text-green-500 bg-green-500/10';
      case 'trend': return 'text-blue-500 bg-blue-500/10';
      case 'benchmark': return 'text-purple-500 bg-purple-500/10';
      case 'prediction': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };
  
  const getConfidenceColor = () => {
    switch (insight.confidence) {
      case 'High': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };
  
  const getTimeHorizonIcon = () => {
    switch (insight.timeHorizon) {
      case 'Immediate': return '🔴';
      case 'Short-term': return '🟡';
      case 'Medium-term': return '🟢';
      case 'Long-term': return '🔵';
      default: return '⚪';
    }
  };
  
  const Icon = getIcon();
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden hover:border-primary-600/50 transition-colors"
    >
      {/* Header */}
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-lg", getTypeColor())}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-dark-text-secondary uppercase">
                {insight.type}
              </span>
              <span className="text-xs">{getTimeHorizonIcon()}</span>
              <span className={cn("text-xs", getConfidenceColor())}>
                {insight.confidence}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => bookmarkInsight(insight.id)}
              className={cn(
                "p-1 rounded transition-colors",
                isBookmarked 
                  ? "text-yellow-500 hover:text-yellow-600" 
                  : "text-dark-text-secondary hover:text-dark-text"
              )}
            >
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
            </button>
            
            <button
              onClick={() => dismissInsight(insight.id)}
              className="p-1 text-dark-text-secondary hover:text-red-500 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <h3 className="font-medium text-dark-text mb-1">{insight.title}</h3>
        <p className="text-sm text-dark-text-secondary line-clamp-2">
          {insight.description}
        </p>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Relevance */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-4 bg-primary-600 rounded-full" />
            <span className="text-xs font-medium text-dark-text">Why this matters</span>
          </div>
          <p className="text-sm text-dark-text-secondary">
            {insight.relevance}
          </p>
        </div>

        {/* Data Points */}
        {!isExpanded && insight.dataPoints.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-dark-text-secondary">
              {insight.dataPoints.length} data points
            </span>
            <button
              onClick={() => setIsExpanded(true)}
              className="text-xs text-primary-600 hover:text-primary-500 flex items-center gap-1"
            >
              View details
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Expanded Data Points */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-3"
          >
            <div className="bg-dark-bg rounded-lg p-3 space-y-2">
              {insight.dataPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-dark-text-secondary rounded-full mt-1.5" />
                  <span className="text-sm text-dark-text">{point}</span>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs text-dark-text-secondary hover:text-dark-text mt-2"
            >
              Show less
            </button>
          </motion.div>
        )}

        {/* Actions */}
        {insight.actionable && insight.suggestedActions && insight.suggestedActions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-dark-text">Suggested Actions</span>
            </div>
            
            <div className="space-y-1">
              {insight.suggestedActions.slice(0, 3).map((action, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-dark-bg rounded text-sm"
                >
                  <span className="text-primary-600 mt-0.5">•</span>
                  <span className="text-dark-text">{action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-dark-border">
          <div className="flex items-center gap-3 text-xs text-dark-text-secondary">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{insight.timeHorizon}</span>
            </div>
            
            {insight.relatedDimensions.length > 0 && (
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>{insight.relatedDimensions.join(', ')}</span>
              </div>
            )}
          </div>
          
          {insight.actionable && (
            <button className="text-xs text-primary-600 hover:text-primary-500 font-medium">
              Take Action →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}