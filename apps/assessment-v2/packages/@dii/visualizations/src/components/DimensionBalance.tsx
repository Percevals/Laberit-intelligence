/**
 * DimensionBalance Component
 * Yin-yang inspired visualization showing prevention vs resilience balance
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { DimensionScore, VisualizationProps } from '../types';
import { defaultTheme } from '../themes/default';
import { mergeTheme } from '../utils/theme';

export interface DimensionBalanceProps extends VisualizationProps {
  /** Dimension scores */
  dimensions: DimensionScore[];
  /** Size of the visualization */
  size?: 'small' | 'medium' | 'large';
  /** Show dimension labels */
  showLabels?: boolean;
}

const BALANCE_SIZES = {
  small: { radius: 60, pointRadius: 4 },
  medium: { radius: 100, pointRadius: 6 },
  large: { radius: 140, pointRadius: 8 }
};

const DIMENSION_POSITIONS = {
  // Positions around the circle for each dimension (in degrees)
  TRD: 0,     // Top
  AER: 72,    // Top-right
  BRI: 144,   // Bottom-right
  RRG: 216,   // Bottom-left
  HFP: 288    // Top-left
};

const DIMENSION_LABELS = {
  TRD: 'Time to Revenue Damage',
  AER: 'Attack Economic Reward',
  HFP: 'Human Failure Probability',
  BRI: 'Business Risk Impact',
  RRG: 'Recovery Resource Gap'
};

export function DimensionBalance({
  dimensions,
  size = 'medium',
  showLabels = true,
  theme: themeOverride,
  className = '',
  staticMode = false,
  'aria-label': ariaLabel
}: DimensionBalanceProps) {
  const theme = mergeTheme(defaultTheme, themeOverride);
  const { radius, pointRadius } = BALANCE_SIZES[size];
  
  // SVG dimensions with padding
  const padding = 60;
  const svgSize = radius * 2 + padding * 2;
  const center = svgSize / 2;
  
  // Find weakest dimension for creating the "dent"
  const weakestDimension = dimensions.reduce((weakest, current) => 
    current.score < weakest.score ? current : weakest
  );
  
  // Categorize dimensions into prevention and resilience
  const preventionDimensions = ['TRD', 'AER', 'HFP']; // What prevents attacks
  const resilienceDimensions = ['BRI', 'RRG'];        // How well you recover
  
  const preventionScore = dimensions
    .filter(d => preventionDimensions.includes(d.dimension))
    .reduce((sum, d) => sum + d.score, 0) / preventionDimensions.length;
    
  const resilienceScore = dimensions
    .filter(d => resilienceDimensions.includes(d.dimension))
    .reduce((sum, d) => sum + d.score, 0) / resilienceDimensions.length;
  
  // Create the organic inner shape based on dimension scores
  const createInnerPath = () => {
    const points: string[] = [];
    
    Object.entries(DIMENSION_POSITIONS).forEach(([dimension, angle]) => {
      const dimensionData = dimensions.find(d => d.dimension === dimension);
      if (!dimensionData) return;
      
      // Create "dent" effect for weaker scores
      const scoreRatio = dimensionData.score / 10; // Normalize to 0-1
      const adjustedRadius = radius * 0.3 + (radius * 0.4 * scoreRatio); // 30-70% of radius
      
      // Extra dent for the weakest dimension
      const dentFactor = dimensionData.dimension === weakestDimension.dimension ? 0.7 : 1;
      const finalRadius = adjustedRadius * dentFactor;
      
      const angleRad = (angle - 90) * Math.PI / 180; // -90 to start from top
      const x = center + Math.cos(angleRad) * finalRadius;
      const y = center + Math.sin(angleRad) * finalRadius;
      
      if (points.length === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        // Use quadratic curves for organic feel
        const prevAngleRad = ((angle - 72 - 90) * Math.PI / 180);
        const prevX = center + Math.cos(prevAngleRad) * finalRadius;
        const prevY = center + Math.sin(prevAngleRad) * finalRadius;
        
        // Control point for smooth curve
        const controlAngle = ((angle - 36 - 90) * Math.PI / 180);
        const controlRadius = finalRadius * 0.9;
        const controlX = center + Math.cos(controlAngle) * controlRadius;
        const controlY = center + Math.sin(controlAngle) * controlRadius;
        
        points.push(`Q ${controlX} ${controlY} ${x} ${y}`);
      }
    });
    
    points.push('Z'); // Close path
    return points.join(' ');
  };
  
  // Create yin-yang style division
  const createDivisionPath = () => {
    // Simplified S-curve division inspired by yin-yang
    const quarterRadius = radius * 0.25;
    return `
      M ${center} ${center - radius}
      Q ${center + quarterRadius} ${center - quarterRadius} ${center} ${center}
      Q ${center - quarterRadius} ${center + quarterRadius} ${center} ${center + radius}
    `;
  };
  
  return (
    <div 
      className={`dii-dimension-balance ${className}`}
      role="img"
      aria-label={ariaLabel || `Dimension balance showing prevention vs resilience strengths`}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="w-full h-auto"
      >
        <defs>
          {/* Gradients for prevention and resilience sides */}
          <radialGradient id="prevention-gradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor={theme.colors.gradient.balance[0]} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={theme.colors.gradient.balance[0]} stopOpacity="0.4"/>
          </radialGradient>
          
          <radialGradient id="resilience-gradient" cx="70%" cy="70%">
            <stop offset="0%" stopColor={theme.colors.gradient.balance[1]} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={theme.colors.gradient.balance[1]} stopOpacity="0.4"/>
          </radialGradient>
          
          {/* Shadow filter */}
          <filter id="balance-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2"/>
          </filter>
        </defs>
        
        {/* Perfect circle outline (the goal) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={theme.colors.text.muted}
          strokeWidth="1"
          strokeDasharray="4 2"
          opacity="0.3"
        />
        
        {/* Prevention side (dark) */}
        <motion.path
          d={`M ${center} ${center - radius} A ${radius} ${radius} 0 0 1 ${center} ${center + radius} ${createDivisionPath()} Z`}
          fill="url(#prevention-gradient)"
          stroke={theme.colors.surface}
          strokeWidth="1"
          filter="url(#balance-shadow)"
          initial={staticMode ? false : { scale: 0, opacity: 0 }}
          animate={staticMode ? false : { scale: 1, opacity: 1 }}
          transition={staticMode ? undefined : { duration: theme.animation.duration.slow / 1000, delay: 0.2 }}
        />
        
        {/* Resilience side (light) */}
        <motion.path
          d={`M ${center} ${center - radius} A ${radius} ${radius} 0 0 0 ${center} ${center + radius} ${createDivisionPath()} Z`}
          fill="url(#resilience-gradient)"
          stroke={theme.colors.surface}
          strokeWidth="1"
          filter="url(#balance-shadow)"
          initial={staticMode ? false : { scale: 0, opacity: 0 }}
          animate={staticMode ? false : { scale: 1, opacity: 1 }}
          transition={staticMode ? undefined : { duration: theme.animation.duration.slow / 1000, delay: 0.4 }}
        />
        
        {/* Organic inner shape representing actual immunity profile */}
        <motion.path
          d={createInnerPath()}
          fill={theme.colors.primary}
          fillOpacity="0.1"
          stroke={theme.colors.primary}
          strokeWidth="2"
          filter="url(#balance-shadow)"
          initial={staticMode ? false : { scale: 0, opacity: 0 }}
          animate={staticMode ? false : { scale: 1, opacity: 1 }}
          transition={staticMode ? undefined : { 
            duration: theme.animation.duration.slow / 1000, 
            delay: 0.8,
            ease: theme.animation.easing.spring 
          }}
        />
        
        {/* Dimension points */}
        {dimensions.map((dimension, index) => {
          const angle = DIMENSION_POSITIONS[dimension.dimension as keyof typeof DIMENSION_POSITIONS];
          const angleRad = (angle - 90) * Math.PI / 180;
          const pointDistance = radius * 0.85;
          const x = center + Math.cos(angleRad) * pointDistance;
          const y = center + Math.sin(angleRad) * pointDistance;
          
          const isWeakest = dimension.dimension === weakestDimension.dimension;
          const color = isWeakest ? theme.colors.status.fragil : 
                       dimension.score >= 7 ? theme.colors.status.adaptativo :
                       dimension.score >= 5 ? theme.colors.status.resiliente :
                       dimension.score >= 3 ? theme.colors.status.robusto :
                       theme.colors.status.fragil;
          
          return (
            <g key={dimension.dimension}>
              {/* Dimension point */}
              <motion.circle
                cx={x}
                cy={y}
                r={isWeakest ? pointRadius * 1.5 : pointRadius}
                fill={color}
                stroke={theme.colors.background}
                strokeWidth="2"
                initial={staticMode ? false : { scale: 0, opacity: 0 }}
                animate={staticMode ? false : { scale: 1, opacity: 1 }}
                transition={staticMode ? undefined : { 
                  duration: theme.animation.duration.normal / 1000,
                  delay: 1 + index * 0.1 
                }}
              />
              
              {/* Dimension label */}
              {showLabels && (
                <motion.g
                  initial={staticMode ? false : { opacity: 0 }}
                  animate={staticMode ? false : { opacity: 1 }}
                  transition={staticMode ? undefined : { delay: 1.5 + index * 0.1 }}
                >
                  <text
                    x={x + (Math.cos(angleRad) * (pointRadius + 16))}
                    y={y + (Math.sin(angleRad) * (pointRadius + 16))}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={theme.typography.sizes.micro}
                    fill={theme.colors.text.secondary}
                    fontFamily={theme.typography.fontFamily}
                    fontWeight={theme.typography.weights.medium}
                  >
                    {dimension.dimension}
                  </text>
                  <text
                    x={x + (Math.cos(angleRad) * (pointRadius + 28))}
                    y={y + (Math.sin(angleRad) * (pointRadius + 28))}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={theme.typography.sizes.micro}
                    fill={color}
                    fontFamily={theme.typography.fontFamily}
                    fontWeight={theme.typography.weights.bold}
                  >
                    {dimension.score.toFixed(1)}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}
        
        {/* Center scores */}
        <motion.g
          transform={`translate(${center}, ${center})`}
          initial={staticMode ? false : { opacity: 0, scale: 0.5 }}
          animate={staticMode ? false : { opacity: 1, scale: 1 }}
          transition={staticMode ? undefined : { delay: 1.2, duration: theme.animation.duration.normal / 1000 }}
        >
          {/* Prevention score */}
          <text
            x={-radius * 0.3}
            y={-8}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={theme.typography.sizes.medium}
            fill={theme.colors.text.primary}
            fontFamily={theme.typography.fontFamily}
            fontWeight={theme.typography.weights.bold}
          >
            {preventionScore.toFixed(1)}
          </text>
          <text
            x={-radius * 0.3}
            y={8}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={theme.typography.sizes.micro}
            fill={theme.colors.text.secondary}
            fontFamily={theme.typography.fontFamily}
          >
            Prevention
          </text>
          
          {/* Resilience score */}
          <text
            x={radius * 0.3}
            y={-8}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={theme.typography.sizes.medium}
            fill={theme.colors.text.primary}
            fontFamily={theme.typography.fontFamily}
            fontWeight={theme.typography.weights.bold}
          >
            {resilienceScore.toFixed(1)}
          </text>
          <text
            x={radius * 0.3}
            y={8}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={theme.typography.sizes.micro}
            fill={theme.colors.text.secondary}
            fontFamily={theme.typography.fontFamily}
          >
            Resilience
          </text>
        </motion.g>
      </svg>
      
      {/* Weakness callout */}
      {showLabels && (
        <motion.div
          className="text-center mt-4"
          initial={staticMode ? false : { opacity: 0, y: 10 }}
          animate={staticMode ? false : { opacity: 1, y: 0 }}
          transition={staticMode ? undefined : { delay: 2, duration: theme.animation.duration.normal / 1000 }}
        >
          <p 
            style={{ 
              fontSize: theme.typography.sizes.small,
              color: theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily,
              margin: 0
            }}
          >
            Weakest: <span style={{ 
              color: theme.colors.status.fragil, 
              fontWeight: theme.typography.weights.medium 
            }}>
              {weakestDimension.dimension}
            </span> ({weakestDimension.score.toFixed(1)}/10)
          </p>
          <p 
            style={{ 
              fontSize: theme.typography.sizes.micro,
              color: theme.colors.text.muted,
              fontFamily: theme.typography.fontFamily,
              margin: '4px 0 0 0'
            }}
          >
            Perfect circle = perfect immunity balance
          </p>
        </motion.div>
      )}
    </div>
  );
}