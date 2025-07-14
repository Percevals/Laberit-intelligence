/**
 * ImmunityGauge Component
 * 270° circular arc gauge with peer benchmarks and ghost arc
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { DIIScore, PeerBenchmark, VisualizationProps } from '../types';
import { defaultTheme } from '../themes/default';
import { mergeTheme, getStageColor, getGradientStop } from '../utils/theme';

export interface ImmunityGaugeProps extends VisualizationProps {
  /** DII score data */
  score: DIIScore;
  /** Peer benchmark data */
  peerBenchmark?: PeerBenchmark;
  /** Size of the gauge */
  size?: 'small' | 'medium' | 'large';
  /** Show detailed labels */
  showDetails?: boolean;
}

const GAUGE_SIZES = {
  small: { radius: 80, strokeWidth: 8, fontSize: '2rem' },
  medium: { radius: 120, strokeWidth: 12, fontSize: '3rem' },
  large: { radius: 160, strokeWidth: 16, fontSize: '4rem' }
};

export function ImmunityGauge({
  score,
  peerBenchmark,
  size = 'medium',
  showDetails = true,
  theme: themeOverride,
  className = '',
  staticMode = false,
  'aria-label': ariaLabel
}: ImmunityGaugeProps) {
  const theme = mergeTheme(defaultTheme, themeOverride);
  const { radius, strokeWidth, fontSize } = GAUGE_SIZES[size];
  
  // SVG dimensions with padding
  const padding = 40;
  const svgSize = (radius + strokeWidth) * 2 + padding * 2;
  const center = svgSize / 2;
  
  // Arc calculations (270° gauge)
  const startAngle = 135; // Start at bottom-left
  const endAngle = 45;    // End at bottom-right
  const totalAngle = 270;
  
  // Convert score to angle
  const scoreAngle = (score.current / 100) * totalAngle;
  const previousAngle = score.previous ? (score.previous / 100) * totalAngle : 0;
  
  // Peer benchmark angle
  const peerAngle = peerBenchmark ? (peerBenchmark.average / 100) * totalAngle : 0;
  
  // Create path for arc
  const createArcPath = (angle: number) => {
    const radians = (startAngle + angle) * (Math.PI / 180);
    const x = center + Math.cos(radians) * radius;
    const y = center + Math.sin(radians) * radius;
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    const startX = center + Math.cos(startAngle * (Math.PI / 180)) * radius;
    const startY = center + Math.sin(startAngle * (Math.PI / 180)) * radius;
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y}`;
  };
  
  // Create full background arc
  const backgroundPath = createArcPath(270);
  
  // Gradient for the immunity arc
  const gradientId = `immunity-gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  // Stage display
  const stageNames = {
    FRAGIL: 'FRÁGIL',
    ROBUSTO: 'ROBUSTO', 
    RESILIENTE: 'RESILIENTE',
    ADAPTATIVO: 'ADAPTATIVO'
  };
  
  const stageColor = getStageColor(score.stage, theme);
  
  return (
    <div 
      className={`dii-immunity-gauge ${className}`}
      role="img"
      aria-label={ariaLabel || `Immunity score ${score.current} out of 100, ${score.stage} stage`}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="w-full h-auto"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {theme.colors.gradient.immunity.map((color, index) => (
              <stop
                key={index}
                offset={`${(index / (theme.colors.gradient.immunity.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </linearGradient>
          
          {/* Shadow filter for depth */}
          <filter id="gauge-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Background track */}
        <path
          d={backgroundPath}
          fill="none"
          stroke={theme.colors.surface}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Ghost arc (previous score) */}
        {score.previous && !staticMode && (
          <motion.path
            d={createArcPath(previousAngle)}
            fill="none"
            stroke={theme.colors.text.muted}
            strokeWidth={strokeWidth * 0.6}
            strokeLinecap="round"
            strokeDasharray="4 4"
            opacity={0.4}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: theme.animation.duration.slow / 1000, delay: 0.2 }}
          />
        )}
        
        {/* Main immunity arc */}
        <motion.path
          d={createArcPath(scoreAngle)}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#gauge-shadow)"
          initial={staticMode ? false : { pathLength: 0 }}
          animate={staticMode ? false : { pathLength: 1 }}
          transition={staticMode ? undefined : { 
            duration: theme.animation.duration.slow / 1000 * 2,
            ease: theme.animation.easing.spring 
          }}
        />
        
        {/* Peer benchmark tick */}
        {peerBenchmark && (
          <g>
            {(() => {
              const tickAngle = startAngle + peerAngle;
              const tickRadians = tickAngle * (Math.PI / 180);
              const innerRadius = radius - strokeWidth / 2 - 6;
              const outerRadius = radius + strokeWidth / 2 + 6;
              const x1 = center + Math.cos(tickRadians) * innerRadius;
              const y1 = center + Math.sin(tickRadians) * innerRadius;
              const x2 = center + Math.cos(tickRadians) * outerRadius;
              const y2 = center + Math.sin(tickRadians) * outerRadius;
              
              return (
                <motion.line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={theme.colors.text.secondary}
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={staticMode ? false : { opacity: 0, scale: 0 }}
                  animate={staticMode ? false : { opacity: 1, scale: 1 }}
                  transition={staticMode ? undefined : { delay: 1.5, duration: theme.animation.duration.normal / 1000 }}
                />
              );
            })()}
          </g>
        )}
        
        {/* Central score display */}
        <g transform={`translate(${center}, ${center})`}>
          {/* Main score number */}
          <motion.text
            textAnchor="middle"
            dominantBaseline="central"
            y={-8}
            fontSize={fontSize}
            fontWeight={theme.typography.weights.bold}
            fill={theme.colors.text.primary}
            fontFamily={theme.typography.fontFamily}
            initial={staticMode ? false : { opacity: 0, scale: 0.5 }}
            animate={staticMode ? false : { opacity: 1, scale: 1 }}
            transition={staticMode ? undefined : { delay: 1, duration: theme.animation.duration.normal / 1000 }}
          >
            {score.current}
          </motion.text>
          
          {/* Stage name */}
          <motion.text
            textAnchor="middle"
            dominantBaseline="central"
            y={28}
            fontSize={theme.typography.sizes.small}
            fontWeight={theme.typography.weights.medium}
            fill={stageColor}
            fontFamily={theme.typography.fontFamily}
            initial={staticMode ? false : { opacity: 0, y: 40 }}
            animate={staticMode ? false : { opacity: 1, y: 28 }}
            transition={staticMode ? undefined : { delay: 1.2, duration: theme.animation.duration.normal / 1000 }}
          >
            {stageNames[score.stage]}
          </motion.text>
          
          {/* Confidence indicator */}
          {score.confidence < 90 && showDetails && (
            <motion.text
              textAnchor="middle"
              dominantBaseline="central"
              y={44}
              fontSize={theme.typography.sizes.micro}
              fill={theme.colors.text.muted}
              fontFamily={theme.typography.fontFamily}
              initial={staticMode ? false : { opacity: 0 }}
              animate={staticMode ? false : { opacity: 1 }}
              transition={staticMode ? undefined : { delay: 1.4, duration: theme.animation.duration.normal / 1000 }}
            >
              {score.confidence}% confidence
            </motion.text>
          )}
        </g>
      </svg>
      
      {/* Peer comparison text */}
      {peerBenchmark && showDetails && (
        <motion.div
          className="text-center mt-4"
          initial={staticMode ? false : { opacity: 0, y: 10 }}
          animate={staticMode ? false : { opacity: 1, y: 0 }}
          transition={staticMode ? undefined : { delay: 1.6, duration: theme.animation.duration.normal / 1000 }}
        >
          <p 
            style={{ 
              fontSize: theme.typography.sizes.small,
              color: theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily,
              margin: 0
            }}
          >
            Better than <span style={{ color: theme.colors.text.primary, fontWeight: theme.typography.weights.medium }}>
              {score.percentile}%
            </span> of similar companies
          </p>
          {peerBenchmark.sampleSize && (
            <p 
              style={{ 
                fontSize: theme.typography.sizes.micro,
                color: theme.colors.text.muted,
                fontFamily: theme.typography.fontFamily,
                margin: '4px 0 0 0'
              }}
            >
              Based on {peerBenchmark.sampleSize.toLocaleString()} assessments
            </p>
          )}
        </motion.div>
      )}
      
      {/* Previous score context */}
      {score.previous && showDetails && (
        <motion.div
          className="text-center mt-2"
          initial={staticMode ? false : { opacity: 0 }}
          animate={staticMode ? false : { opacity: 1 }}
          transition={staticMode ? undefined : { delay: 1.8, duration: theme.animation.duration.normal / 1000 }}
        >
          <p 
            style={{ 
              fontSize: theme.typography.sizes.micro,
              color: theme.colors.text.muted,
              fontFamily: theme.typography.fontFamily,
              margin: 0
            }}
          >
            Previous: {score.previous} ({score.current > score.previous ? '+' : ''}{score.current - score.previous})
          </p>
        </motion.div>
      )}
    </div>
  );
}