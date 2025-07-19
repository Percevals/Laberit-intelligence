/**
 * DimensionBalance Component
 * Signature visualization for Digital Immunity Index
 * Shows the 5 dimensions in an inverted pentagon layout with yin-yang background
 * 
 * Features:
 * - Flexible dimension configuration (labels, descriptions, colors)
 * - Maturity-based hover effects
 * - No connecting pentagon (due to opposite logic for resilience vs vulnerability)
 * - Interactive guide lines on hover
 * - Zen-style clean aesthetics
 */

import React, { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// Types
export interface DimensionConfig {
  key: 'trd' | 'aer' | 'bri' | 'hfp' | 'rrg';
  label: string;
  description?: string;
  color?: string;
}

export interface DimensionBalanceProps {
  dimensions: DimensionConfig[];
  values: Record<string, number>;
  locale?: 'es' | 'en' | 'pt';
  size?: 'small' | 'medium' | 'large';
  onHover?: (dimension: string, maturityStage: string) => void;
  className?: string;
  showMaturityLegend?: boolean;
  ariaLabel?: string;
}

// Constants
const DIMENSION_ANGLES = {
  trd: 324,  // Top-left
  aer: 36,   // Top-right
  rrg: 108,  // Right
  hfp: 180,  // Bottom (center - key human factor)
  bri: 252   // Left
};

const MATURITY_STAGES = {
  fragil: { min: 0, max: 4, color: '#ef4444', label: 'FRÁGIL', emoji: '😰' },
  robusto: { min: 4, max: 6, color: '#f59e0b', label: 'ROBUSTO', emoji: '💪' },
  resiliente: { min: 6, max: 8, color: '#10b981', label: 'RESILIENTE', emoji: '🛡️' },
  adaptativo: { min: 8, max: 10, color: '#3b82f6', label: 'ADAPTATIVO', emoji: '🚀' }
};

const SIZE_CONFIG = {
  small: { width: 400, height: 400, center: 200, radius: 140, dotSize: 14, fontSize: 12 },
  medium: { width: 600, height: 600, center: 300, radius: 220, dotSize: 20, fontSize: 16 },
  large: { width: 800, height: 800, center: 400, radius: 300, dotSize: 26, fontSize: 20 }
};

// Default dimension groups for color assignment
const RESILIENCE_DIMENSIONS = ['trd', 'aer'];
const VULNERABILITY_DIMENSIONS = ['bri', 'hfp', 'rrg'];

// Helper functions
function getMaturityStage(value: number) {
  if (value < 4) return MATURITY_STAGES.fragil;
  if (value < 6) return MATURITY_STAGES.robusto;
  if (value < 8) return MATURITY_STAGES.resiliente;
  return MATURITY_STAGES.adaptativo;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

// Main component
export const DimensionBalance: React.FC<DimensionBalanceProps> = ({
  dimensions,
  values,
  locale = 'es',
  size = 'medium',
  onHover,
  className = '',
  showMaturityLegend = true,
  ariaLabel = 'Digital Immunity Index Visualization'
}) => {
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null);
  const config = SIZE_CONFIG[size];
  
  // Generate unique IDs for SVG elements
  const gradientIds = useMemo(() => ({
    greenGlow: `green-glow-${Math.random().toString(36).substr(2, 9)}`,
    purpleGlow: `purple-glow-${Math.random().toString(36).substr(2, 9)}`,
    fragilGlow: `fragil-glow-${Math.random().toString(36).substr(2, 9)}`,
    robustoGlow: `robusto-glow-${Math.random().toString(36).substr(2, 9)}`,
    resilienteGlow: `resiliente-glow-${Math.random().toString(36).substr(2, 9)}`,
    adaptativoGlow: `adaptativo-glow-${Math.random().toString(36).substr(2, 9)}`,
    circleClip: `circle-clip-${Math.random().toString(36).substr(2, 9)}`
  }), []);

  const handleDimensionHover = useCallback((key: string | null) => {
    setHoveredDimension(key);
    if (key && onHover) {
      const value = values[key] || 0;
      const stage = getMaturityStage(value);
      onHover(key, stage.label);
    }
  }, [values, onHover]);

  return (
    <div className={`dimension-balance ${className}`}>
      <svg 
        width={config.width} 
        height={config.height} 
        viewBox={`0 0 ${config.width} ${config.height}`}
        role="img"
        aria-label={ariaLabel}
        style={{ background: '#000', borderRadius: '16px' }}
      >
        <defs>
          <clipPath id={gradientIds.circleClip}>
            <circle cx={config.center} cy={config.center} r={config.radius + 50} />
          </clipPath>
          
          {/* Maturity gradients */}
          <radialGradient id={gradientIds.fragilGlow}>
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={gradientIds.robustoGlow}>
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={gradientIds.resilienteGlow}>
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={gradientIds.adaptativoGlow}>
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          
          {/* Default gradients */}
          <radialGradient id={gradientIds.greenGlow}>
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={gradientIds.purpleGlow}>
            <stop offset="0%" stopColor="#B4B5DF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#B4B5DF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#B4B5DF" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Flowing wave background */}
        <g clipPath={`url(#${gradientIds.circleClip})`}>
          <path 
            d={`M ${config.width * 0.05} ${config.center} 
                Q ${config.center - config.radius * 0.6} ${config.center - config.radius * 0.5}, ${config.center} ${config.center}
                T ${config.width * 0.95} ${config.center}
                L ${config.width * 0.95} ${config.width * 0.05}
                L ${config.width * 0.05} ${config.width * 0.05}
                Z`}
            fill="#10b98120" 
          />
          <path 
            d={`M ${config.width * 0.05} ${config.center} 
                Q ${config.center - config.radius * 0.6} ${config.center - config.radius * 0.5}, ${config.center} ${config.center}
                T ${config.width * 0.95} ${config.center}
                L ${config.width * 0.95} ${config.width * 0.95}
                L ${config.width * 0.05} ${config.width * 0.95}
                Z`}
            fill="#B4B5DF20" 
          />
        </g>
        
        {/* Circle border */}
        <circle 
          cx={config.center} 
          cy={config.center} 
          r={config.radius + 50} 
          fill="none" 
          stroke="#333" 
          strokeWidth="2" 
        />
        
        {/* Maturity rings */}
        <circle cx={config.center} cy={config.center} r={config.radius * 0.4} fill="none" stroke="#ef444420" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx={config.center} cy={config.center} r={config.radius * 0.6} fill="none" stroke="#f59e0b20" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx={config.center} cy={config.center} r={config.radius * 0.8} fill="none" stroke="#10b98120" strokeWidth="1" strokeDasharray="4,4" />
        
        {/* Dimensions */}
        {dimensions.map((dim) => {
          const value = values[dim.key] || 0;
          const radius = (value / 10) * config.radius;
          const angle = DIMENSION_ANGLES[dim.key];
          const point = polarToCartesian(config.center, config.center, radius, angle);
          const labelPoint = polarToCartesian(config.center, config.center, config.radius + 75, angle);
          const maturity = getMaturityStage(value);
          const isHovered = hoveredDimension === dim.key;
          
          // Determine default color based on dimension group
          const defaultColor = dim.color || (
            RESILIENCE_DIMENSIONS.includes(dim.key) ? '#10b981' : '#B4B5DF'
          );
          
          // Determine glow gradient
          const glowGradient = isHovered
            ? `url(#${gradientIds[`${Object.keys(MATURITY_STAGES).find(k => MATURITY_STAGES[k as keyof typeof MATURITY_STAGES] === maturity)}Glow` as keyof typeof gradientIds]})`
            : `url(#${RESILIENCE_DIMENSIONS.includes(dim.key) ? gradientIds.greenGlow : gradientIds.purpleGlow})`;
          
          return (
            <g key={dim.key}>
              {/* Guide line */}
              <motion.line
                x1={config.center}
                y1={config.center}
                x2={point.x}
                y2={point.y}
                stroke={defaultColor}
                strokeWidth="2"
                strokeDasharray="4,8"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 0.5 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Glow */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={config.dotSize * 2}
                fill={glowGradient}
                animate={{
                  fill: glowGradient
                }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Main dot */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={config.dotSize}
                fill={isHovered ? maturity.color : defaultColor}
                opacity={0.9}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => handleDimensionHover(dim.key)}
                onMouseLeave={() => handleDimensionHover(null)}
                transition={{ duration: 0.3 }}
              />
              
              {/* Value text */}
              <text
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={config.fontSize}
                fontWeight="bold"
                fill="#fff"
                style={{ pointerEvents: 'none' }}
              >
                {value.toFixed(1)}
              </text>
              
              {/* Label */}
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={config.fontSize}
                fill={defaultColor}
                fontWeight="500"
              >
                {dim.label}
              </text>
              
              {/* Tooltip on hover */}
              {isHovered && dim.description && (
                <g>
                  <rect
                    x={point.x - 100}
                    y={point.y - 40}
                    width="200"
                    height="30"
                    rx="4"
                    fill="#222"
                    opacity="0.9"
                  />
                  <text
                    x={point.x}
                    y={point.y - 25}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#fff"
                  >
                    {dim.description}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Maturity Legend */}
      {showMaturityLegend && (
        <div className="maturity-legend" style={{
          background: '#222',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          {Object.entries(MATURITY_STAGES).map(([key, stage]) => (
            <div key={key} style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {key === 'fragil' && '< 4.0'}
                {key === 'robusto' && '4.0 - 6.0'}
                {key === 'resiliente' && '6.0 - 8.0'}
                {key === 'adaptativo' && '> 8.0'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: stage.color, marginTop: '5px' }}>
                {stage.label} {stage.emoji}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};