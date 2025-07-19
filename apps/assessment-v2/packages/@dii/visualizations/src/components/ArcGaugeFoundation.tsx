/**
 * ArcGaugeFoundation Component
 * Module 1: Foundation arc with coordinate system for DII visualization
 * 
 * Key principles:
 * - Fixed arc angles (225° to 495°) - never modified
 * - Rotation handled purely by CSS transform
 * - Precise coordinate system for progressive arc overlay
 * - Scale 1-10 (not 0-10) per DII specification
 */

import React from 'react';

export interface Point {
  x: number;
  y: number;
}

export interface ArcGaugeFoundationProps {
  width?: number;
  height?: number;
  strokeWidth?: number;
  rotation?: number; // CSS rotation in degrees
  showTickMarks?: boolean;
  showStageMarkers?: boolean;
  className?: string;
}

export const ArcGaugeFoundation: React.FC<ArcGaugeFoundationProps> = ({
  width = 400,
  height = 400,
  strokeWidth = 24,
  rotation = 0,
  showTickMarks = true,
  showStageMarkers = true,
  className = ''
}) => {
  // Core arc parameters - NEVER CHANGE THESE
  const centerX = width / 2;
  const centerY = height / 2;
  // Arc radius should leave room for stroke and labels
  const radius = Math.min(width, height) / 2 - strokeWidth - 40;
  
  // Fixed angles for 270° arc with 90° gap at bottom
  const START_ANGLE = 135; // Bottom-left (SW quadrant)
  const END_ANGLE = 405;   // Bottom-right (SE quadrant, wraps to 45°)
  const TOTAL_ANGLE = 270;
  
  // DII scale parameters (1-10, not 0-10)
  const MIN_VALUE = 1;
  const MAX_VALUE = 10;
  const VALUE_RANGE = MAX_VALUE - MIN_VALUE;
  
  // Stage boundaries
  const STAGES = {
    FRAGIL: { max: 4.0, color: '#ef4444' },      // Red
    ROBUSTO: { min: 4.0, max: 6.0, color: '#f59e0b' },  // Orange
    RESILIENTE: { min: 6.0, max: 8.0, color: '#10b981' }, // Green
    ADAPTATIVO: { min: 8.0, color: '#3b82f6' }    // Blue
  };
  
  /**
   * Convert a value (1-10) to an angle on the arc
   */
  const valueToAngle = (value: number): number => {
    const normalizedValue = (value - MIN_VALUE) / VALUE_RANGE;
    return START_ANGLE + (normalizedValue * TOTAL_ANGLE);
  };
  
  /**
   * Get cartesian coordinates for a given angle
   */
  const angleToPoint = (angleDegrees: number, radiusOffset: number = 0): Point => {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    return {
      x: centerX + (radius + radiusOffset) * Math.cos(angleRadians),
      y: centerY + (radius + radiusOffset) * Math.sin(angleRadians)
    };
  };
  
  /**
   * Generate SVG path for the main arc
   */
  const generateArcPath = (): string => {
    const startPoint = angleToPoint(START_ANGLE);
    const endPoint = angleToPoint(END_ANGLE);
    
    // Large arc flag is 1 because we're drawing more than 180°
    const largeArcFlag = 1;
    const sweepFlag = 1; // Clockwise
    
    return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endPoint.x} ${endPoint.y}`;
  };
  
  /**
   * Generate tick marks for scale
   */
  const generateTickMarks = () => {
    const ticks = [];
    const tickLength = 5;
    
    for (let value = MIN_VALUE; value <= MAX_VALUE; value++) {
      const angle = valueToAngle(value);
      // Ticks should align with the stroke of the arc
      // Inner point: slightly inside the inner edge of the stroke
      const innerPoint = angleToPoint(angle, -(strokeWidth/2 + tickLength));
      // Outer point: slightly outside the outer edge of the stroke
      const outerPoint = angleToPoint(angle, strokeWidth/2 + tickLength);
      // Label position: further out for clarity
      const labelPoint = angleToPoint(angle, strokeWidth/2 + 25);
      
      // Stage colors for key values
      let tickColor = '#666';
      let tickStrokeWidth = 2;
      if (value === 4) {
        tickColor = STAGES.FRAGIL.color;
        tickStrokeWidth = 3;
      } else if (value === 6) {
        tickColor = STAGES.ROBUSTO.color;
        tickStrokeWidth = 3;
      } else if (value === 8) {
        tickColor = STAGES.RESILIENTE.color;
        tickStrokeWidth = 3;
      } else if (value === 10) {
        tickColor = STAGES.ADAPTATIVO.color;
        tickStrokeWidth = 3;
      }
      
      ticks.push(
        <g key={`tick-${value}`}>
          {/* Tick line */}
          <line
            x1={innerPoint.x}
            y1={innerPoint.y}
            x2={outerPoint.x}
            y2={outerPoint.y}
            stroke={tickColor}
            strokeWidth={tickStrokeWidth}
          />
          {/* Tick label - counter-rotated to stay upright */}
          <text
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fill={tickColor}
            fontWeight={tickStrokeWidth === 3 ? 'bold' : 'normal'}
            transform={rotation !== 0 ? `rotate(${-rotation} ${labelPoint.x} ${labelPoint.y})` : undefined}
          >
            {value}
          </text>
        </g>
      );
    }
    
    return ticks;
  };
  
  /**
   * Generate stage boundary markers
   */
  const generateStageMarkers = () => {
    const markers = [];
    
    // Stage boundaries: 4.0, 6.0, 8.0
    [4.0, 6.0, 8.0].forEach((value) => {
      const angle = valueToAngle(value);
      // Extend markers across the full stroke width
      const innerPoint = angleToPoint(angle, -strokeWidth);
      const outerPoint = angleToPoint(angle, strokeWidth);
      
      let markerColor = '#333';
      if (value === 4) markerColor = STAGES.FRAGIL.color;
      else if (value === 6) markerColor = STAGES.ROBUSTO.color;
      else if (value === 8) markerColor = STAGES.RESILIENTE.color;
      
      markers.push(
        <line
          key={`stage-${value}`}
          x1={innerPoint.x}
          y1={innerPoint.y}
          x2={outerPoint.x}
          y2={outerPoint.y}
          stroke={markerColor}
          strokeWidth="2"
          strokeDasharray="3,3"
          opacity="0.3"
        />
      );
    });
    
    return markers;
  };
  
  // SVG rotation style
  const svgStyle = rotation !== 0
    ? { transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }
    : {};
  
  return (
    <div className={`arc-gauge-foundation ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={svgStyle}
      >
        {/* Debug: Center point */}
        <circle cx={centerX} cy={centerY} r="2" fill="red" opacity="0.5" />
        
        {/* Main foundation arc */}
        <path
          d={generateArcPath()}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity="0.3"
        />
        
        {/* Tick marks */}
        {showTickMarks && generateTickMarks()}
        
        {/* Stage boundary markers */}
        {showStageMarkers && generateStageMarkers()}
        
        {/* Debug info */}
        <g transform={rotation !== 0 ? `rotate(${-rotation} ${centerX} ${centerY})` : undefined}>
          <text x={centerX} y={height - 20} textAnchor="middle" fontSize="12" fill="#999">
            Foundation Arc: {START_ANGLE}° → {END_ANGLE}° (270° sweep)
          </text>
        </g>
      </svg>
      
      {/* Coordinate system test points */}
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h4>Coordinate System Test:</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>Value 1 → Angle: {valueToAngle(1).toFixed(1)}° (Start)</li>
          <li>Value 4 → Angle: {valueToAngle(4).toFixed(1)}° (FRÁGIL/ROBUSTO boundary)</li>
          <li>Value 6 → Angle: {valueToAngle(6).toFixed(1)}° (ROBUSTO/RESILIENTE boundary)</li>
          <li>Value 8 → Angle: {valueToAngle(8).toFixed(1)}° (RESILIENTE/ADAPTATIVO boundary)</li>
          <li>Value 10 → Angle: {valueToAngle(10).toFixed(1)}° (End)</li>
        </ul>
      </div>
    </div>
  );
};