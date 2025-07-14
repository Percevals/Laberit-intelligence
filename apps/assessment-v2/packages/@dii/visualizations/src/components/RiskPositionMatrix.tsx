/**
 * RiskPositionMatrix Component
 * Clean 2x2 business model quadrant showing attack surface vs impact severity
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { BusinessModelPosition, VisualizationProps } from '../types';
import { defaultTheme } from '../themes/default';
import { mergeTheme } from '../utils/theme';

export interface RiskPositionMatrixProps extends VisualizationProps {
  /** Business model positions */
  positions: BusinessModelPosition[];
  /** Size of the matrix */
  size?: 'small' | 'medium' | 'large';
  /** Show quadrant labels */
  showQuadrantLabels?: boolean;
  /** Show business model names */
  showModelNames?: boolean;
}

const MATRIX_SIZES = {
  small: { width: 300, height: 300, dotSize: 6 },
  medium: { width: 400, height: 400, dotSize: 8 },
  large: { width: 500, height: 500, dotSize: 10 }
};

const BUSINESS_MODEL_NAMES = {
  1: 'Hybrid Commerce',
  2: 'Critical Software', 
  3: 'Data Services',
  4: 'Digital Ecosystem',
  5: 'Financial Services',
  6: 'Legacy Infrastructure',
  7: 'Supply Chain',
  8: 'Regulated Information'
};

const QUADRANT_LABELS = {
  topLeft: { title: 'High Impact\nLow Surface', description: 'Valuable but Protected' },
  topRight: { title: 'High Impact\nHigh Surface', description: 'Prime Targets' },
  bottomLeft: { title: 'Low Impact\nLow Surface', description: 'Low Priority' },
  bottomRight: { title: 'Low Impact\nHigh Surface', description: 'Easy but Unprofitable' }
};

export function RiskPositionMatrix({
  positions,
  size = 'medium',
  showQuadrantLabels = true,
  showModelNames = true,
  theme: themeOverride,
  className = '',
  staticMode = false,
  'aria-label': ariaLabel
}: RiskPositionMatrixProps) {
  const theme = mergeTheme(defaultTheme, themeOverride);
  const { width, height, dotSize } = MATRIX_SIZES[size];
  
  const padding = 60;
  const svgWidth = width + padding * 2;
  const svgHeight = height + padding * 2;
  const matrixLeft = padding;
  const matrixTop = padding;
  
  // User position for highlighting
  const userPosition = positions.find(p => p.isUser);
  
  // Convert percentage coordinates to SVG coordinates
  const positionToCoords = (position: BusinessModelPosition) => ({
    x: matrixLeft + (position.attackSurface / 100) * width,
    y: matrixTop + height - (position.impactSeverity / 100) * height // Flip Y for SVG
  });
  
  return (
    <div 
      className={`dii-risk-position-matrix ${className}`}
      role="img"
      aria-label={ariaLabel || `Risk position matrix showing business models by attack surface and impact severity`}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto"
      >
        <defs>
          {/* Gradient for risk zones */}
          <radialGradient id="risk-gradient" cx="100%" cy="0%">
            <stop offset="0%" stopColor={theme.colors.status.fragil} stopOpacity="0.1"/>
            <stop offset="70%" stopColor={theme.colors.status.robusto} stopOpacity="0.05"/>
            <stop offset="100%" stopColor={theme.colors.status.resiliente} stopOpacity="0.02"/>
          </radialGradient>
          
          {/* User position pulse animation */}
          <circle id="pulse-circle" r={dotSize * 2} fill={theme.colors.accent} fillOpacity="0.3"/>
        </defs>
        
        {/* Background risk gradient */}
        <motion.rect
          x={matrixLeft}
          y={matrixTop}
          width={width}
          height={height}
          fill="url(#risk-gradient)"
          initial={staticMode ? false : { opacity: 0 }}
          animate={staticMode ? false : { opacity: 1 }}
          transition={staticMode ? undefined : { duration: theme.animation.duration.slow / 1000 }}
        />
        
        {/* Matrix border */}
        <rect
          x={matrixLeft}
          y={matrixTop}
          width={width}
          height={height}
          fill="none"
          stroke={theme.colors.text.muted}
          strokeWidth="1"
          opacity="0.3"
        />
        
        {/* Quadrant dividers */}
        <g stroke={theme.colors.text.muted} strokeWidth="1" opacity="0.2" strokeDasharray="2 2">
          {/* Vertical center line */}
          <line
            x1={matrixLeft + width / 2}
            y1={matrixTop}
            x2={matrixLeft + width / 2}
            y2={matrixTop + height}
          />
          {/* Horizontal center line */}
          <line
            x1={matrixLeft}
            y1={matrixTop + height / 2}
            x2={matrixLeft + width}
            y2={matrixTop + height / 2}
          />
        </g>
        
        {/* Axis labels */}
        <g fill={theme.colors.text.secondary} fontSize={theme.typography.sizes.small} fontFamily={theme.typography.fontFamily}>
          {/* X-axis label */}
          <text
            x={matrixLeft + width / 2}
            y={svgHeight - 20}
            textAnchor="middle"
            dominantBaseline="central"
          >
            Digital Attack Surface
          </text>
          
          {/* Y-axis label */}
          <text
            x={20}
            y={matrixTop + height / 2}
            textAnchor="middle"
            dominantBaseline="central"
            transform={`rotate(-90, 20, ${matrixTop + height / 2})`}
          >
            Operational Impact Severity
          </text>
          
          {/* Axis value labels */}
          <g fontSize={theme.typography.sizes.micro} fill={theme.colors.text.muted}>
            <text x={matrixLeft} y={matrixTop + height + 15} textAnchor="start">Low</text>
            <text x={matrixLeft + width} y={matrixTop + height + 15} textAnchor="end">High</text>
            <text x={matrixLeft - 10} y={matrixTop + height} textAnchor="end" dominantBaseline="central">Low</text>
            <text x={matrixLeft - 10} y={matrixTop} textAnchor="end" dominantBaseline="central">High</text>
          </g>
        </g>
        
        {/* Quadrant labels */}
        {showQuadrantLabels && (
          <motion.g
            initial={staticMode ? false : { opacity: 0 }}
            animate={staticMode ? false : { opacity: 1 }}
            transition={staticMode ? undefined : { delay: 0.5, duration: theme.animation.duration.normal / 1000 }}
          >
            {/* Top-left quadrant */}
            <g transform={`translate(${matrixLeft + width * 0.25}, ${matrixTop + height * 0.25})`}>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={theme.typography.sizes.small}
                fontWeight={theme.typography.weights.medium}
                fill={theme.colors.text.primary}
                fontFamily={theme.typography.fontFamily}
              >
                {QUADRANT_LABELS.topLeft.title}
              </text>
              <text
                y={20}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={theme.typography.sizes.micro}
                fill={theme.colors.text.muted}
                fontFamily={theme.typography.fontFamily}
              >
                {QUADRANT_LABELS.topLeft.description}
              </text>
            </g>
            
            {/* Top-right quadrant */}
            <g transform={`translate(${matrixLeft + width * 0.75}, ${matrixTop + height * 0.25})`}>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={theme.typography.sizes.small}
                fontWeight={theme.typography.weights.medium}
                fill={theme.colors.status.fragil}
                fontFamily={theme.typography.fontFamily}
              >
                {QUADRANT_LABELS.topRight.title}
              </text>
              <text
                y={20}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={theme.typography.sizes.micro}
                fill={theme.colors.text.muted}
                fontFamily={theme.typography.fontFamily}
              >
                {QUADRANT_LABELS.topRight.description}
              </text>
            </g>
            
            {/* Bottom-left quadrant */}
            <g transform={`translate(${matrixLeft + width * 0.25}, ${matrixTop + height * 0.75})`}>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={theme.typography.sizes.small}
                fontWeight={theme.typography.weights.medium}
                fill={theme.colors.status.resiliente}
                fontFamily={theme.typography.fontFamily}
              >
                {QUADRANT_LABELS.bottomLeft.title}
              </text>
              <text
                y={20}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={theme.typography.sizes.micro}
                fill={theme.colors.text.muted}
                fontFamily={theme.typography.fontFamily}
              >
                {QUADRANT_LABELS.bottomLeft.description}
              </text>
            </g>
            
            {/* Bottom-right quadrant */}
            <g transform={`translate(${matrixLeft + width * 0.75}, ${matrixTop + height * 0.75})`}>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={theme.typography.sizes.small}
                fontWeight={theme.typography.weights.medium}
                fill={theme.colors.status.robusto}
                fontFamily={theme.typography.fontFamily}
              >
                {QUADRANT_LABELS.bottomRight.title}
              </text>
              <text
                y={20}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={theme.typography.sizes.micro}
                fill={theme.colors.text.muted}
                fontFamily={theme.typography.fontFamily}
              >
                {QUADRANT_LABELS.bottomRight.description}
              </text>
            </g>
          </motion.g>
        )}
        
        {/* Business model positions */}
        {positions.map((position, index) => {
          const coords = positionToCoords(position);
          const isUser = position.isUser;
          const hasPeers = position.peerCount && position.peerCount > 1;
          
          return (
            <g key={position.id}>
              {/* Peer cluster background */}
              {hasPeers && !isUser && (
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r={dotSize * 2}
                  fill={theme.colors.text.muted}
                  fillOpacity="0.1"
                  initial={staticMode ? false : { scale: 0, opacity: 0 }}
                  animate={staticMode ? false : { scale: 1, opacity: 1 }}
                  transition={staticMode ? undefined : { 
                    delay: 0.8 + index * 0.1, 
                    duration: theme.animation.duration.normal / 1000 
                  }}
                />
              )}
              
              {/* User position pulse */}
              {isUser && !staticMode && (
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r={dotSize * 2}
                  fill={theme.colors.accent}
                  fillOpacity="0.2"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.1, 0.2] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              )}
              
              {/* Main position dot */}
              <motion.circle
                cx={coords.x}
                cy={coords.y}
                r={isUser ? dotSize * 1.2 : dotSize}
                fill={isUser ? theme.colors.accent : theme.colors.text.secondary}
                stroke={isUser ? theme.colors.background : 'none'}
                strokeWidth={isUser ? 2 : 0}
                initial={staticMode ? false : { scale: 0, opacity: 0 }}
                animate={staticMode ? false : { scale: 1, opacity: 1 }}
                transition={staticMode ? undefined : { 
                  delay: 1 + index * 0.1, 
                  duration: theme.animation.duration.normal / 1000,
                  ease: theme.animation.easing.spring
                }}
              />
              
              {/* Business model label */}
              {showModelNames && (
                <motion.g
                  initial={staticMode ? false : { opacity: 0, y: 5 }}
                  animate={staticMode ? false : { opacity: 1, y: 0 }}
                  transition={staticMode ? undefined : { delay: 1.5 + index * 0.1 }}
                >
                  <text
                    x={coords.x}
                    y={coords.y + (isUser ? dotSize * 2.5 : dotSize * 2)}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    fontSize={theme.typography.sizes.micro}
                    fontWeight={isUser ? theme.typography.weights.medium : theme.typography.weights.normal}
                    fill={isUser ? theme.colors.accent : theme.colors.text.muted}
                    fontFamily={theme.typography.fontFamily}
                  >
                    {BUSINESS_MODEL_NAMES[position.id as keyof typeof BUSINESS_MODEL_NAMES]}
                  </text>
                  
                  {/* Peer count */}
                  {hasPeers && !isUser && (
                    <text
                      x={coords.x}
                      y={coords.y + dotSize * 3.5}
                      textAnchor="middle"
                      dominantBaseline="hanging"
                      fontSize={theme.typography.sizes.micro}
                      fill={theme.colors.text.muted}
                      fontFamily={theme.typography.fontFamily}
                    >
                      {position.peerCount} companies
                    </text>
                  )}
                </motion.g>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      {userPosition && (
        <motion.div
          className="flex items-center justify-center gap-4 mt-4"
          initial={staticMode ? false : { opacity: 0, y: 10 }}
          animate={staticMode ? false : { opacity: 1, y: 0 }}
          transition={staticMode ? undefined : { delay: 2, duration: theme.animation.duration.normal / 1000 }}
        >
          <div className="flex items-center gap-2">
            <div 
              style={{
                width: dotSize * 1.2,
                height: dotSize * 1.2,
                borderRadius: '50%',
                backgroundColor: theme.colors.accent,
                border: `2px solid ${theme.colors.background}`
              }}
            />
            <span 
              style={{ 
                fontSize: theme.typography.sizes.small,
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily
              }}
            >
              Your Position
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: theme.colors.text.secondary
              }}
            />
            <span 
              style={{ 
                fontSize: theme.typography.sizes.small,
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily
              }}
            >
              Other Models
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}