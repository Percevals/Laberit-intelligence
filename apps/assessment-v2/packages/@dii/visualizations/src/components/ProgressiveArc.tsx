/**
 * ProgressiveArc Component
 * Module 2: Progressive arc that shows the actual value/score
 * 
 * Key principles:
 * - Uses same coordinate system as ArcGaugeFoundation
 * - Animates from 0 to target value
 * - Supports solid color (initial) and gradient (future)
 * - Reusable for any arc-based visualization
 */

import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressiveArcProps {
  value: number;           // Current value (1-10 for DII)
  minValue?: number;       // Minimum value (default: 1)
  maxValue?: number;       // Maximum value (default: 10)
  centerX?: number;        // Center X coordinate
  centerY?: number;        // Center Y coordinate
  radius?: number;         // Arc radius
  strokeWidth?: number;    // Stroke width
  startAngle?: number;     // Start angle in degrees (default: 135)
  endAngle?: number;       // End angle in degrees (default: 405)
  color?: string | 'auto' | 'gradient';  // Solid color, auto-detect, or gradient
  animate?: boolean;       // Enable animation
  animationDuration?: number; // Animation duration in seconds
  className?: string;
  gradientId?: string;     // Custom gradient ID to avoid conflicts
}

export const ProgressiveArc: React.FC<ProgressiveArcProps> = ({
  value,
  minValue = 1,
  maxValue = 10,
  centerX = 200,
  centerY = 200,
  radius = 160,
  strokeWidth = 24,
  startAngle = 135,
  endAngle = 405,
  color = 'auto',
  animate = true,
  animationDuration = 2,
  className = '',
  gradientId = 'progressive-arc-gradient'
}) => {
  // Calculate the sweep angle for the current value
  const totalSweep = endAngle - startAngle;
  const valueRange = maxValue - minValue;
  const normalizedValue = (value - minValue) / valueRange;
  const sweepAngle = normalizedValue * totalSweep;
  
  /**
   * Create SVG path for the progressive arc
   * This uses the same math as the foundation arc
   */
  const createProgressivePath = (sweep: number): string => {
    // Don't draw anything if sweep is 0
    if (sweep <= 0) return '';
    
    // Calculate start point (always at startAngle)
    const startRad = (startAngle * Math.PI) / 180;
    const startX = centerX + radius * Math.cos(startRad);
    const startY = centerY + radius * Math.sin(startRad);
    
    // Calculate end point based on sweep
    const endAngleForSweep = startAngle + sweep;
    const endRad = (endAngleForSweep * Math.PI) / 180;
    const endX = centerX + radius * Math.cos(endRad);
    const endY = centerY + radius * Math.sin(endRad);
    
    // Determine if we need a large arc (>180 degrees)
    const largeArcFlag = sweep > 180 ? 1 : 0;
    
    // Create the arc path
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };
  
  // Get the path for the current value
  const progressPath = createProgressivePath(sweepAngle);
  
  // For animation, we'll use path length animation
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: {
        pathLength: { 
          duration: animationDuration,
          ease: "easeInOut"
        },
        opacity: { duration: 0.3 }
      }
    }
  };
  
  // Determine color based on value (for solid color version)
  const getColorForValue = (val: number): string => {
    if (val < 4) return '#ef4444';      // FRÁGIL - Red
    if (val < 6) return '#f59e0b';      // ROBUSTO - Orange
    if (val < 8) return '#10b981';      // RESILIENTE - Green
    return '#3b82f6';                     // ADAPTATIVO - Blue
  };
  
  // Create luminosity gradient for zen aesthetic
  const createLuminosityGradient = (baseColor: string) => {
    // Convert hex to RGB for manipulation
    const hex2rgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const rgb = hex2rgb(baseColor);
    if (!rgb) return [{ offset: '0%', color: baseColor }, { offset: '100%', color: baseColor }];
    
    // Create subtle luminosity variation (darker to lighter)
    const darken = (color: {r: number, g: number, b: number}, factor: number) => {
      return `rgb(${Math.round(color.r * factor)}, ${Math.round(color.g * factor)}, ${Math.round(color.b * factor)})`;
    };
    
    const lighten = (color: {r: number, g: number, b: number}, factor: number) => {
      return `rgb(${Math.min(255, Math.round(color.r + (255 - color.r) * factor))}, ${Math.min(255, Math.round(color.g + (255 - color.g) * factor))}, ${Math.min(255, Math.round(color.b + (255 - color.b) * factor))})`;
    };
    
    return [
      { offset: '0%', color: darken(rgb, 0.85) },      // Slightly darker start
      { offset: '50%', color: baseColor },              // Original color in middle
      { offset: '100%', color: lighten(rgb, 0.15) }     // Slightly lighter end
    ];
  };
  
  // Determine stroke color or gradient
  let strokeUrl = '';
  let solidColor = '';
  
  if (color === 'gradient') {
    strokeUrl = `url(#${gradientId})`;
  } else if (color === 'auto') {
    solidColor = getColorForValue(value);
  } else {
    solidColor = color;
  }
  
  return (
    <g className={`progressive-arc ${className}`}>
      {/* Shadow/glow effect and gradient definitions */}
      <defs>
        <filter id="arc-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Gradient definition with luminosity for zen aesthetic */}
        {color === 'gradient' && (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {createLuminosityGradient(getColorForValue(value)).map((stop, index) => (
              <stop 
                key={index} 
                offset={stop.offset} 
                stopColor={stop.color}
                stopOpacity="1"
              />
            ))}
          </linearGradient>
        )}
      </defs>
      
      {/* The progressive arc */}
      {animate ? (
        <motion.path
          d={progressPath}
          fill="none"
          stroke={strokeUrl || solidColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#arc-glow)"
          initial="hidden"
          animate="visible"
          variants={pathVariants}
        />
      ) : (
        <path
          d={progressPath}
          fill="none"
          stroke={strokeUrl || solidColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter="url(#arc-glow)"
        />
      )}
      
      {/* Optional: End cap indicator */}
      {value > minValue && (
        <circle
          cx={centerX + radius * Math.cos((startAngle + sweepAngle) * Math.PI / 180)}
          cy={centerY + radius * Math.sin((startAngle + sweepAngle) * Math.PI / 180)}
          r={strokeWidth / 2}
          fill={color === 'gradient' ? getColorForValue(value) : solidColor}
          opacity="0"
        />
      )}
      
      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <g opacity="0.5">
          <text 
            x={centerX} 
            y={centerY + radius + strokeWidth + 20} 
            textAnchor="middle" 
            fontSize="11" 
            fill="#666"
          >
            Value: {value} | Sweep: {sweepAngle.toFixed(1)}°
          </text>
        </g>
      )}
    </g>
  );
};