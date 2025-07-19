/**
 * IndexDisplay Component
 * Module 3: Zen-inspired index number display with supporting text
 * 
 * Key principles:
 * - Clean, minimalist design
 * - Supports 1-10 scale
 * - Two lines of supporting text
 * - Adaptable for different contexts (main DII or dimensions)
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface IndexDisplayProps {
  value: number;                    // Current value (1-10)
  primaryLabel: string;             // First line (e.g., "RESILIENTE")
  secondaryLabel: string;           // Second line (e.g., "Índice de Inmunidad" or "Radio de Explosión")
  centerX?: number;                 // Center X coordinate
  centerY?: number;                 // Center Y coordinate
  valueSize?: number;               // Font size for main value
  primarySize?: number;             // Font size for primary label
  secondarySize?: number;           // Font size for secondary label
  valueColor?: string;              // Color for the value (or 'auto' for stage-based)
  labelColor?: string;              // Color for labels
  fontFamily?: string;              // Font family for all text
  animate?: boolean;                // Enable animation
  animationDuration?: number;       // Animation duration in seconds
  className?: string;
}

export const IndexDisplay: React.FC<IndexDisplayProps> = ({
  value,
  primaryLabel,
  secondaryLabel,
  centerX = 200,
  centerY = 200,
  valueSize = 72,
  primarySize = 24,
  secondarySize = 16,
  valueColor = 'auto',
  labelColor = '#666666',
  fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  animate = true,
  animationDuration = 1,
  className = ''
}) => {
  // Get color based on value if auto
  const getColorForValue = (val: number): string => {
    if (val < 4) return '#ef4444';      // FRÁGIL - Red
    if (val < 6) return '#f59e0b';      // ROBUSTO - Orange
    if (val < 8) return '#10b981';      // RESILIENTE - Green
    return '#3b82f6';                    // ADAPTATIVO - Blue
  };
  
  // Get stage name for value
  const getStageForValue = (val: number): string => {
    if (val < 4) return 'FRÁGIL';
    if (val < 6) return 'ROBUSTO';
    if (val < 8) return 'RESILIENTE';
    return 'ADAPTATIVO';
  };
  
  const displayColor = valueColor === 'auto' ? getColorForValue(value) : valueColor;
  const displayValue = value.toFixed(1);
  
  // Calculate text positions with zen spacing
  const valueY = centerY - 10;
  const primaryY = centerY + primarySize + 5;
  const secondaryY = primaryY + secondarySize + 8;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationDuration,
        ease: "easeOut"
      }
    }
  };
  
  const valueVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: animationDuration,
        ease: "easeOut"
      }
    }
  };
  
  const content = (
    <>
      {/* Main value display */}
      <text
        x={centerX}
        y={valueY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={valueSize}
        fontWeight="300"
        fill={displayColor}
        fontFamily={fontFamily}
        style={{ letterSpacing: '-0.02em' }}
      >
        {displayValue}
      </text>
      
      {/* Primary label (maturity stage or custom) */}
      <text
        x={centerX}
        y={primaryY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={primarySize}
        fontWeight="500"
        fill={displayColor}
        fontFamily={fontFamily}
        style={{ letterSpacing: '0.05em' }}
      >
        {primaryLabel === 'auto' ? getStageForValue(value) : primaryLabel}
      </text>
      
      {/* Secondary label */}
      <text
        x={centerX}
        y={secondaryY}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={secondarySize}
        fontWeight="400"
        fill={labelColor}
        fontFamily={fontFamily}
        style={{ letterSpacing: '0.02em', opacity: 0.8 }}
      >
        {secondaryLabel}
      </text>
    </>
  );
  
  if (animate) {
    return (
      <motion.g
        className={`index-display ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.g variants={valueVariants}>
          {content}
        </motion.g>
      </motion.g>
    );
  }
  
  return (
    <g className={`index-display ${className}`}>
      {content}
    </g>
  );
};

// Dimension name mapping for convenience
export const DIMENSION_NAMES = {
  TRD: 'Tiempo hasta Degradación',
  AER: 'Ratio de Economía del Ataque',
  HFP: 'Probabilidad de Fallo Humano',
  BRI: 'Radio de Explosión',
  RRG: 'Brecha de Realidad en Recuperación'
} as const;

// Export type for dimension keys
export type DimensionKey = keyof typeof DIMENSION_NAMES;