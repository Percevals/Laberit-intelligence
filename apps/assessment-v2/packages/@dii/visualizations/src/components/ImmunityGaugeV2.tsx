/**
 * ImmunityGauge Component (V2 - Definitive Version)
 * 
 * This is the primary immunity gauge visualization using the modular architecture:
 * - ArcGaugeFoundation for the base
 * - ProgressiveArc for the value display
 * - IndexDisplay for the text
 * 
 * This replaces the original ImmunityGauge component.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { ArcGaugeFoundation } from './ArcGaugeFoundation';
import { ProgressiveArc } from './ProgressiveArc';
import { IndexDisplay } from './IndexDisplay';
import type { ImmunityScore } from '../types';

export interface ImmunityGaugeProps {
  score: ImmunityScore;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  peerBenchmark?: { average: number; label: string };
  className?: string;
  staticMode?: boolean;
  ariaLabel?: string;
  gaugeRotation?: number; // Rotation angle in degrees (default: 0)
  secondaryLabel?: string; // Custom secondary label (default: "Índice de Inmunidad")
}

const SIZES = {
  small: { 
    svgSize: 240, 
    centerX: 120, 
    centerY: 120, 
    radius: 80, 
    strokeWidth: 12, 
    valueSize: 36,
    primarySize: 16,
    secondarySize: 12
  },
  medium: { 
    svgSize: 400, 
    centerX: 200, 
    centerY: 200, 
    radius: 160, 
    strokeWidth: 24, 
    valueSize: 72,
    primarySize: 24,
    secondarySize: 16
  },
  large: { 
    svgSize: 600, 
    centerX: 300, 
    centerY: 300, 
    radius: 240, 
    strokeWidth: 36, 
    valueSize: 96,
    primarySize: 32,
    secondarySize: 20
  }
};

export const ImmunityGaugeV2: React.FC<ImmunityGaugeProps> = ({
  score,
  size = 'medium',
  showDetails = false,
  peerBenchmark,
  className = '',
  staticMode = false,
  ariaLabel,
  gaugeRotation = 0,
  secondaryLabel = 'Índice de Inmunidad'
}) => {
  const theme = useTheme();
  const config = SIZES[size];
  
  // Convert score from 0-100 to 1-10 scale for the components
  const scaledValue = (score.current / 100) * 9 + 1;
  const previousValue = score.previous ? (score.previous / 100) * 9 + 1 : null;
  
  // Stage names mapping
  const stageNames = {
    FRAGIL: 'FRÁGIL',
    ROBUSTO: 'ROBUSTO',
    RESILIENTE: 'RESILIENTE',
    ADAPTATIVO: 'ADAPTATIVO'
  };
  
  // Apply rotation to the gauge if specified
  const svgStyle: React.CSSProperties = gaugeRotation !== 0 
    ? { transform: `rotate(${gaugeRotation}deg)`, transformOrigin: 'center' }
    : {};
  
  // Counter-rotate text if gauge is rotated
  const textRotation = gaugeRotation !== 0 
    ? { transform: `rotate(${-gaugeRotation}deg)`, transformOrigin: `${config.centerX}px ${config.centerY}px` }
    : {};
  
  return (
    <div 
      className={`dii-immunity-gauge ${className}`}
      role="img"
      aria-label={ariaLabel || `Immunity score ${score.current} out of 100, ${stageNames[score.stage]} stage`}
    >
      <svg
        width={config.svgSize}
        height={config.svgSize}
        viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}
        className="w-full h-auto"
        style={svgStyle}
      >
        {/* Foundation Arc */}
        <ArcGaugeFoundation
          centerX={config.centerX}
          centerY={config.centerY}
          radius={config.radius}
          strokeWidth={config.strokeWidth}
          showTicks={true}
          tickInterval={1}
        />
        
        {/* Previous score ghost arc */}
        {previousValue && !staticMode && (
          <g opacity={0.4}>
            <ProgressiveArc
              value={previousValue}
              centerX={config.centerX}
              centerY={config.centerY}
              radius={config.radius}
              strokeWidth={config.strokeWidth * 0.6}
              color="#666666"
              animate={false}
            />
          </g>
        )}
        
        {/* Progressive Arc */}
        <ProgressiveArc
          value={scaledValue}
          centerX={config.centerX}
          centerY={config.centerY}
          radius={config.radius}
          strokeWidth={config.strokeWidth}
          color="auto"
          animate={!staticMode}
          animationDuration={2}
          gradientId={`immunity-gradient-${React.useId()}`}
        />
        
        {/* Peer benchmark marker */}
        {peerBenchmark && (
          <g>
            {(() => {
              const peerValue = (peerBenchmark.average / 100) * 9 + 1;
              const angle = 135 + ((peerValue - 1) / 9) * 270;
              const rad = (angle * Math.PI) / 180;
              const innerRadius = config.radius - config.strokeWidth / 2 - 6;
              const outerRadius = config.radius + config.strokeWidth / 2 + 6;
              
              const x1 = config.centerX + innerRadius * Math.cos(rad);
              const y1 = config.centerY + innerRadius * Math.sin(rad);
              const x2 = config.centerX + outerRadius * Math.cos(rad);
              const y2 = config.centerY + outerRadius * Math.sin(rad);
              
              return (
                <>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={theme.colors.text.muted}
                    strokeWidth="2"
                  />
                  <text
                    x={x2}
                    y={y2}
                    dx={angle > 270 ? -8 : 8}
                    dy={4}
                    textAnchor={angle > 270 ? 'end' : 'start'}
                    fontSize={theme.typography.sizes.micro}
                    fill={theme.colors.text.muted}
                    fontFamily={theme.typography.fontFamily}
                  >
                    {peerBenchmark.label}
                  </text>
                </>
              );
            })()}
          </g>
        )}
        
        {/* Index Display */}
        <g style={textRotation}>
          <IndexDisplay
            value={scaledValue}
            primaryLabel={stageNames[score.stage]}
            secondaryLabel={secondaryLabel}
            centerX={config.centerX}
            centerY={config.centerY}
            valueSize={config.valueSize}
            primarySize={config.primarySize}
            secondarySize={config.secondarySize}
            valueColor="auto"
            animate={!staticMode}
          />
        </g>
      </svg>
      
      {/* Additional details */}
      {showDetails && (
        <motion.div 
          className="gauge-details"
          initial={staticMode ? false : { opacity: 0, y: 20 }}
          animate={staticMode ? false : { opacity: 1, y: 0 }}
          transition={staticMode ? undefined : { 
            delay: 2,
            duration: 0.5 
          }}
        >
          <p className="text-sm text-muted text-center mt-4">
            {score.trend === 'improving' && '↑ Improving from last assessment'}
            {score.trend === 'declining' && '↓ Declining from last assessment'}
            {score.trend === 'stable' && '→ Stable compared to last assessment'}
          </p>
          
          {score.previous && (
            <p className="text-xs text-muted text-center mt-2">
              Previous score: {score.previous}
            </p>
          )}
          
          {score.confidence < 90 && (
            <p className="text-xs text-muted text-center mt-2">
              Confidence: {score.confidence}%
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};