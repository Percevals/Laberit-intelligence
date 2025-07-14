/**
 * VisualizationDemo Component
 * Comprehensive demo showcasing all DII visualizations
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImmunityGauge } from './ImmunityGauge';
import { DimensionBalance } from './DimensionBalance';
import { RiskPositionMatrix } from './RiskPositionMatrix';
import { AttackEconomics } from './AttackEconomics';
import type { 
  DIIScore, 
  DimensionScore, 
  BusinessModelPosition, 
  AttackEconomics as AttackEconomicsData,
  PeerBenchmark,
  VisualizationProps 
} from '../types';
import { defaultTheme, mobileTheme } from '../themes/default';
import { mergeTheme } from '../utils/theme';
import { A11yPerformanceMonitor } from '../utils/accessibility';

export interface VisualizationDemoProps extends VisualizationProps {
  /** Demo scenario to display */
  scenario?: 'excellent' | 'good' | 'average' | 'poor';
  /** Show performance metrics */
  showPerformance?: boolean;
  /** Enable interactive mode */
  interactive?: boolean;
}

// Sample data scenarios
const DEMO_SCENARIOS = {
  excellent: {
    score: {
      current: 87,
      previous: 82,
      stage: 'ADAPTATIVO' as const,
      percentile: 92,
      confidence: 95
    },
    dimensions: [
      { dimension: 'TRD' as const, score: 8.5, rawValue: 2, isWeakest: false },
      { dimension: 'AER' as const, score: 9.0, rawValue: 1, isWeakest: false },
      { dimension: 'HFP' as const, score: 8.2, rawValue: 3, isWeakest: false },
      { dimension: 'BRI' as const, score: 7.8, rawValue: 4, isWeakest: true },
      { dimension: 'RRG' as const, score: 8.8, rawValue: 2, isWeakest: false }
    ],
    economics: {
      attackCost: 75,
      potentialGain: 45,
      immunityBonus: 25,
      isTooExpensive: true
    }
  },
  good: {
    score: {
      current: 68,
      previous: 63,
      stage: 'RESILIENTE' as const,
      percentile: 78,
      confidence: 90
    },
    dimensions: [
      { dimension: 'TRD' as const, score: 7.2, rawValue: 3, isWeakest: false },
      { dimension: 'AER' as const, score: 6.8, rawValue: 3, isWeakest: false },
      { dimension: 'HFP' as const, score: 6.5, rawValue: 4, isWeakest: true },
      { dimension: 'BRI' as const, score: 7.0, rawValue: 3, isWeakest: false },
      { dimension: 'RRG' as const, score: 6.9, rawValue: 3, isWeakest: false }
    ],
    economics: {
      attackCost: 60,
      potentialGain: 65,
      immunityBonus: 15,
      isTooExpensive: false
    }
  },
  average: {
    score: {
      current: 52,
      stage: 'ROBUSTO' as const,
      percentile: 55,
      confidence: 85
    },
    dimensions: [
      { dimension: 'TRD' as const, score: 5.5, rawValue: 4, isWeakest: false },
      { dimension: 'AER' as const, score: 5.2, rawValue: 4, isWeakest: false },
      { dimension: 'HFP' as const, score: 4.8, rawValue: 5, isWeakest: true },
      { dimension: 'BRI' as const, score: 5.0, rawValue: 4, isWeakest: false },
      { dimension: 'RRG' as const, score: 5.3, rawValue: 4, isWeakest: false }
    ],
    economics: {
      attackCost: 45,
      potentialGain: 70,
      immunityBonus: 10,
      isTooExpensive: false
    }
  },
  poor: {
    score: {
      current: 28,
      stage: 'FRAGIL' as const,
      percentile: 25,
      confidence: 80
    },
    dimensions: [
      { dimension: 'TRD' as const, score: 3.2, rawValue: 5, isWeakest: false },
      { dimension: 'AER' as const, score: 2.8, rawValue: 5, isWeakest: true },
      { dimension: 'HFP' as const, score: 3.5, rawValue: 5, isWeakest: false },
      { dimension: 'BRI' as const, score: 2.9, rawValue: 5, isWeakest: false },
      { dimension: 'RRG' as const, score: 3.1, rawValue: 5, isWeakest: false }
    ],
    economics: {
      attackCost: 30,
      potentialGain: 85,
      immunityBonus: 5,
      isTooExpensive: false
    }
  }
};

const BUSINESS_POSITIONS: BusinessModelPosition[] = [
  { id: 1, name: 'Hybrid Commerce', attackSurface: 70, impactSeverity: 65, isUser: true },
  { id: 2, name: 'Critical Software', attackSurface: 85, impactSeverity: 90 },
  { id: 3, name: 'Data Services', attackSurface: 75, impactSeverity: 80 },
  { id: 4, name: 'Digital Ecosystem', attackSurface: 90, impactSeverity: 75 },
  { id: 5, name: 'Financial Services', attackSurface: 60, impactSeverity: 95 },
  { id: 6, name: 'Legacy Infrastructure', attackSurface: 40, impactSeverity: 50, peerCount: 3 },
  { id: 7, name: 'Supply Chain', attackSurface: 65, impactSeverity: 70, peerCount: 2 },
  { id: 8, name: 'Regulated Information', attackSurface: 55, impactSeverity: 85 }
];

const PEER_BENCHMARK: PeerBenchmark = {
  percentile: 75,
  average: 58,
  sampleSize: 1247
};

export function VisualizationDemo({
  scenario = 'good',
  showPerformance = false,
  interactive = true,
  theme: themeOverride,
  className = '',
  staticMode = false
}: VisualizationDemoProps) {
  const [currentScenario, setCurrentScenario] = useState(scenario);
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    renderTime: number;
    memoryUsage: number | null;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const monitor = new A11yPerformanceMonitor();
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Monitor performance
  useEffect(() => {
    if (!showPerformance) return;
    
    monitor.startRender();
    
    // Measure after render
    const timer = setTimeout(() => {
      const renderTime = monitor.endRender();
      const memoryUsage = monitor.checkMemoryUsage();
      setPerformanceMetrics({ renderTime, memoryUsage });
    }, 0);
    
    return () => clearTimeout(timer);
  }, [currentScenario, showPerformance]);
  
  const theme = mergeTheme(
    defaultTheme,
    isMobile ? mobileTheme : {},
    themeOverride
  );
  
  const data = DEMO_SCENARIOS[currentScenario];
  
  return (
    <div 
      className={`dii-visualization-demo ${className}`}
      style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily,
        padding: theme.spacing.lg,
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <motion.div
        initial={staticMode ? false : { opacity: 0, y: -20 }}
        animate={staticMode ? false : { opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 
          style={{ 
            fontSize: theme.typography.sizes.large,
            fontWeight: theme.typography.weights.bold,
            marginBottom: theme.spacing.sm,
            color: theme.colors.text.primary
          }}
        >
          DII Visualization Suite
        </h1>
        <p 
          style={{ 
            fontSize: theme.typography.sizes.medium,
            color: theme.colors.text.secondary,
            marginBottom: theme.spacing.lg
          }}
        >
          Signature visualizations establishing unique DII identity
        </p>
        
        {/* Scenario Selector */}
        {interactive && (
          <div 
            style={{ 
              display: 'flex',
              gap: theme.spacing.sm,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            {Object.keys(DEMO_SCENARIOS).map((key) => (
              <button
                key={key}
                onClick={() => setCurrentScenario(key as keyof typeof DEMO_SCENARIOS)}
                style={{
                  padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
                  backgroundColor: currentScenario === key ? theme.colors.accent : theme.colors.surface,
                  color: currentScenario === key ? theme.colors.background : theme.colors.text.primary,
                  border: `1px solid ${theme.colors.accent}`,
                  borderRadius: '6px',
                  fontSize: theme.typography.sizes.small,
                  fontFamily: theme.typography.fontFamily,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease'
                }}
              >
                {key}
              </button>
            ))}
          </div>
        )}
        
        {/* Performance Metrics */}
        {showPerformance && performanceMetrics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: theme.spacing.md,
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.surface,
              borderRadius: '6px',
              fontSize: theme.typography.sizes.micro,
              color: theme.colors.text.muted
            }}
          >
            Render: {performanceMetrics.renderTime.toFixed(2)}ms
            {performanceMetrics.memoryUsage && 
              ` | Memory: ${performanceMetrics.memoryUsage.toFixed(2)}MB`
            }
          </motion.div>
        )}
      </motion.div>
      
      {/* Visualizations Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: theme.spacing.xl,
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        {/* ImmunityGauge */}
        <motion.div
          initial={staticMode ? false : { opacity: 0, scale: 0.9 }}
          animate={staticMode ? false : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '12px',
            padding: theme.spacing.lg,
            border: `1px solid ${theme.colors.text.muted}20`
          }}
        >
          <h3 
            style={{ 
              fontSize: theme.typography.sizes.medium,
              fontWeight: theme.typography.weights.medium,
              marginBottom: theme.spacing.md,
              textAlign: 'center',
              color: theme.colors.text.primary
            }}
          >
            Immunity Gauge
          </h3>
          <ImmunityGauge
            score={data.score}
            peerBenchmark={PEER_BENCHMARK}
            size={isMobile ? 'small' : 'medium'}
            theme={theme}
            staticMode={staticMode}
          />
        </motion.div>
        
        {/* DimensionBalance */}
        <motion.div
          initial={staticMode ? false : { opacity: 0, scale: 0.9 }}
          animate={staticMode ? false : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '12px',
            padding: theme.spacing.lg,
            border: `1px solid ${theme.colors.text.muted}20`
          }}
        >
          <h3 
            style={{ 
              fontSize: theme.typography.sizes.medium,
              fontWeight: theme.typography.weights.medium,
              marginBottom: theme.spacing.md,
              textAlign: 'center',
              color: theme.colors.text.primary
            }}
          >
            Dimension Balance
          </h3>
          <DimensionBalance
            dimensions={data.dimensions}
            size={isMobile ? 'small' : 'medium'}
            theme={theme}
            staticMode={staticMode}
          />
        </motion.div>
        
        {/* RiskPositionMatrix */}
        <motion.div
          initial={staticMode ? false : { opacity: 0, scale: 0.9 }}
          animate={staticMode ? false : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '12px',
            padding: theme.spacing.lg,
            border: `1px solid ${theme.colors.text.muted}20`
          }}
        >
          <h3 
            style={{ 
              fontSize: theme.typography.sizes.medium,
              fontWeight: theme.typography.weights.medium,
              marginBottom: theme.spacing.md,
              textAlign: 'center',
              color: theme.colors.text.primary
            }}
          >
            Risk Position Matrix
          </h3>
          <RiskPositionMatrix
            positions={BUSINESS_POSITIONS}
            size={isMobile ? 'small' : 'medium'}
            theme={theme}
            staticMode={staticMode}
          />
        </motion.div>
        
        {/* AttackEconomics */}
        <motion.div
          initial={staticMode ? false : { opacity: 0, scale: 0.9 }}
          animate={staticMode ? false : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: '12px',
            padding: theme.spacing.lg,
            border: `1px solid ${theme.colors.text.muted}20`,
            gridColumn: isMobile ? 'auto' : 'span 2'
          }}
        >
          <h3 
            style={{ 
              fontSize: theme.typography.sizes.medium,
              fontWeight: theme.typography.weights.medium,
              marginBottom: theme.spacing.md,
              textAlign: 'center',
              color: theme.colors.text.primary
            }}
          >
            Attack Economics
          </h3>
          <AttackEconomics
            economics={data.economics}
            size={isMobile ? 'small' : 'medium'}
            theme={theme}
            staticMode={staticMode}
          />
        </motion.div>
      </div>
      
      {/* Footer */}
      <motion.div
        initial={staticMode ? false : { opacity: 0 }}
        animate={staticMode ? false : { opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          textAlign: 'center',
          marginTop: theme.spacing.xxl,
          padding: theme.spacing.lg,
          borderTop: `1px solid ${theme.colors.text.muted}20`
        }}
      >
        <p 
          style={{
            fontSize: theme.typography.sizes.small,
            color: theme.colors.text.muted,
            marginBottom: theme.spacing.sm
          }}
        >
          DII Visualization Suite • Zen-inspired minimalism • Mobile-first responsive
        </p>
        <p 
          style={{
            fontSize: theme.typography.sizes.micro,
            color: theme.colors.text.muted
          }}
        >
          WCAG 2.1 AA Compliant • Performance Optimized • Static Export Ready
        </p>
      </motion.div>
    </div>
  );
}