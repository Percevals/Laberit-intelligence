/**
 * AttackEconomics Component
 * Innovative cost-benefit balance showing "hacking is a business" concept
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { AttackEconomics, VisualizationProps } from '../types';
import { defaultTheme } from '../themes/default';
import { mergeTheme } from '../utils/theme';

export interface AttackEconomicsProps extends VisualizationProps {
  /** Attack economics data */
  economics: AttackEconomics;
  /** Size of the visualization */
  size?: 'small' | 'medium' | 'large';
  /** Show detailed breakdown */
  showDetails?: boolean;
}

const ECONOMICS_SIZES = {
  small: { width: 300, height: 200 },
  medium: { width: 400, height: 250 },
  large: { width: 500, height: 300 }
};

export function AttackEconomics({
  economics,
  size = 'medium',
  showDetails = true,
  theme: themeOverride,
  className = '',
  staticMode = false,
  'aria-label': ariaLabel
}: AttackEconomicsProps) {
  const theme = mergeTheme(defaultTheme, themeOverride);
  const { width, height } = ECONOMICS_SIZES[size];
  
  const padding = 40;
  const svgWidth = width + padding * 2;
  const svgHeight = height + padding * 2;
  
  // Calculate balance point
  const totalWeight = economics.attackCost + economics.potentialGain + economics.immunityBonus;
  const leftWeight = economics.attackCost + economics.immunityBonus; // Cost + your immunity
  const rightWeight = economics.potentialGain; // Potential gain
  
  // Balance calculation (-1 to 1, where -1 is fully left, 1 is fully right)
  const balanceRatio = (rightWeight - leftWeight) / Math.max(totalWeight, 1);
  const balanceAngle = balanceRatio * 15; // Max 15 degrees tilt
  
  // Fulcrum position
  const fulcrumX = svgWidth / 2;
  const fulcrumY = svgHeight / 2 + 20;
  
  // Balance beam dimensions
  const beamLength = width * 0.7;
  const beamThickness = 8;
  const beamY = fulcrumY - 30;
  
  // Scale positions
  const leftScaleX = fulcrumX - beamLength / 3;
  const rightScaleX = fulcrumX + beamLength / 3;
  const scaleSize = 60;
  
  // Weight representations
  const maxWeight = Math.max(leftWeight, rightWeight);
  const leftHeight = (leftWeight / maxWeight) * 40 + 10;
  const rightHeight = (rightWeight / maxWeight) * 40 + 10;
  
  return (
    <div 
      className={`dii-attack-economics ${className}`}
      role="img"
      aria-label={ariaLabel || `Attack economics showing cost vs benefit balance`}
    >
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="cost-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.colors.status.adaptativo} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={theme.colors.status.adaptativo} stopOpacity="0.4"/>
          </linearGradient>
          
          <linearGradient id="gain-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.colors.status.fragil} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={theme.colors.status.fragil} stopOpacity="0.4"/>
          </linearGradient>
          
          <linearGradient id="immunity-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.colors.status.resiliente} stopOpacity="0.9"/>
            <stop offset="100%" stopColor={theme.colors.status.resiliente} stopOpacity="0.6"/>
          </linearGradient>
          
          {/* Shadow filter */}
          <filter id="economics-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Background business context */}
        <motion.g
          initial={staticMode ? false : { opacity: 0 }}
          animate={staticMode ? false : { opacity: 1 }}
          transition={staticMode ? undefined : { duration: theme.animation.duration.slow / 1000 }}
        >
          <text
            x={svgWidth / 2}
            y={padding}
            textAnchor="middle"
            fontSize={theme.typography.sizes.medium}
            fontWeight={theme.typography.weights.medium}
            fill={theme.colors.text.primary}
            fontFamily={theme.typography.fontFamily}
          >
            Hacking is a Business
          </text>
          <text
            x={svgWidth / 2}
            y={padding + 25}
            textAnchor="middle"
            fontSize={theme.typography.sizes.small}
            fill={theme.colors.text.secondary}
            fontFamily={theme.typography.fontFamily}
          >
            Your immunity tips the economic balance
          </text>
        </motion.g>
        
        {/* Fulcrum (triangle base) */}
        <motion.polygon
          points={`${fulcrumX},${fulcrumY} ${fulcrumX - 20},${fulcrumY + 25} ${fulcrumX + 20},${fulcrumY + 25}`}
          fill={theme.colors.surface}
          stroke={theme.colors.text.muted}
          strokeWidth="2"
          filter="url(#economics-shadow)"
          initial={staticMode ? false : { scale: 0, opacity: 0 }}
          animate={staticMode ? false : { scale: 1, opacity: 1 }}
          transition={staticMode ? undefined : { delay: 0.5, duration: theme.animation.duration.normal / 1000 }}
        />
        
        {/* Balance beam */}
        <motion.rect
          x={fulcrumX - beamLength / 2}
          y={beamY - beamThickness / 2}
          width={beamLength}
          height={beamThickness}
          rx={beamThickness / 2}
          fill={theme.colors.text.secondary}
          filter="url(#economics-shadow)"
          initial={staticMode ? false : { scale: 0, opacity: 0 }}
          animate={staticMode ? false : { 
            scale: 1, 
            opacity: 1,
            rotate: balanceAngle 
          }}
          transition={staticMode ? undefined : { 
            delay: 0.7, 
            duration: theme.animation.duration.slow / 1000,
            ease: theme.animation.easing.spring
          }}
          transformOrigin={`${fulcrumX} ${beamY}`}
        />
        
        {/* Left scale (Attack Cost + Your Immunity) */}
        <motion.g
          initial={staticMode ? false : { y: 20, opacity: 0 }}
          animate={staticMode ? false : { y: 0, opacity: 1 }}
          transition={staticMode ? undefined : { delay: 1, duration: theme.animation.duration.normal / 1000 }}
        >
          {/* Scale platform */}
          <rect
            x={leftScaleX - scaleSize / 2}
            y={beamY - 20}
            width={scaleSize}
            height={4}
            fill={theme.colors.surface}
            stroke={theme.colors.text.muted}
            strokeWidth="1"
          />
          
          {/* Connecting chain */}
          <line
            x1={leftScaleX}
            y1={beamY - 16}
            x2={leftScaleX}
            y2={beamY - 25}
            stroke={theme.colors.text.muted}
            strokeWidth="2"
          />
          
          {/* Attack cost weight */}
          <rect
            x={leftScaleX - scaleSize / 2 + 5}
            y={beamY - 20 - (leftHeight * 0.6)}
            width={scaleSize / 2 - 8}
            height={leftHeight * 0.6}
            fill="url(#cost-gradient)"
            rx="2"
          />
          
          {/* Immunity bonus weight (your defense adds cost) */}
          <rect
            x={leftScaleX + 3}
            y={beamY - 20 - (leftHeight * 0.4)}
            width={scaleSize / 2 - 8}
            height={leftHeight * 0.4}
            fill="url(#immunity-gradient)"
            rx="2"
          />
          
          {/* Left scale label */}
          <text
            x={leftScaleX}
            y={beamY + 20}
            textAnchor="middle"
            fontSize={theme.typography.sizes.small}
            fontWeight={theme.typography.weights.medium}
            fill={theme.colors.text.primary}
            fontFamily={theme.typography.fontFamily}
          >
            Attack Cost
          </text>
          <text
            x={leftScaleX}
            y={beamY + 35}
            textAnchor="middle"
            fontSize={theme.typography.sizes.micro}
            fill={theme.colors.text.secondary}
            fontFamily={theme.typography.fontFamily}
          >
            Effort + Your Immunity
          </text>
        </motion.g>
        
        {/* Right scale (Potential Gain) */}
        <motion.g
          initial={staticMode ? false : { y: 20, opacity: 0 }}
          animate={staticMode ? false : { y: 0, opacity: 1 }}
          transition={staticMode ? undefined : { delay: 1.2, duration: theme.animation.duration.normal / 1000 }}
        >
          {/* Scale platform */}
          <rect
            x={rightScaleX - scaleSize / 2}
            y={beamY - 20}
            width={scaleSize}
            height={4}
            fill={theme.colors.surface}
            stroke={theme.colors.text.muted}
            strokeWidth="1"
          />
          
          {/* Connecting chain */}
          <line
            x1={rightScaleX}
            y1={beamY - 16}
            x2={rightScaleX}
            y2={beamY - 25}
            stroke={theme.colors.text.muted}
            strokeWidth="2"
          />
          
          {/* Potential gain weight */}
          <rect
            x={rightScaleX - scaleSize / 2 + 5}
            y={beamY - 20 - rightHeight}
            width={scaleSize - 10}
            height={rightHeight}
            fill="url(#gain-gradient)"
            rx="2"
          />
          
          {/* Right scale label */}
          <text
            x={rightScaleX}
            y={beamY + 20}
            textAnchor="middle"
            fontSize={theme.typography.sizes.small}
            fontWeight={theme.typography.weights.medium}
            fill={theme.colors.text.primary}
            fontFamily={theme.typography.fontFamily}
          >
            Potential Gain
          </text>
          <text
            x={rightScaleX}
            y={beamY + 35}
            textAnchor="middle"
            fontSize={theme.typography.sizes.micro}
            fill={theme.colors.text.secondary}
            fontFamily={theme.typography.fontFamily}
          >
            What attackers could get
          </text>
        </motion.g>
        
        {/* Economic verdict */}
        <motion.g
          initial={staticMode ? false : { opacity: 0, scale: 0.8 }}
          animate={staticMode ? false : { opacity: 1, scale: 1 }}
          transition={staticMode ? undefined : { delay: 1.8, duration: theme.animation.duration.normal / 1000 }}
        >
          <rect
            x={svgWidth / 2 - 120}
            y={svgHeight - 70}
            width={240}
            height={50}
            rx="8"
            fill={economics.isTooExpensive ? theme.colors.status.resiliente : theme.colors.status.robusto}
            fillOpacity="0.1"
            stroke={economics.isTooExpensive ? theme.colors.status.resiliente : theme.colors.status.robusto}
            strokeWidth="1"
          />
          
          <text
            x={svgWidth / 2}
            y={svgHeight - 55}
            textAnchor="middle"
            fontSize={theme.typography.sizes.medium}
            fontWeight={theme.typography.weights.bold}
            fill={economics.isTooExpensive ? theme.colors.status.resiliente : theme.colors.status.robusto}
            fontFamily={theme.typography.fontFamily}
          >
            {economics.isTooExpensive ? "Too Expensive to Attack" : "Economically Viable Target"}
          </text>
          
          <text
            x={svgWidth / 2}
            y={svgHeight - 35}
            textAnchor="middle"
            fontSize={theme.typography.sizes.small}
            fill={theme.colors.text.secondary}
            fontFamily={theme.typography.fontFamily}
          >
            {economics.isTooExpensive 
              ? "Your immunity makes attacks unprofitable"
              : "Attackers see positive ROI potential"
            }
          </text>
        </motion.g>
        
        {/* Balance indicator arrow */}
        <motion.g
          initial={staticMode ? false : { opacity: 0, y: -10 }}
          animate={staticMode ? false : { opacity: 1, y: 0 }}
          transition={staticMode ? undefined : { delay: 1.5, duration: theme.animation.duration.normal / 1000 }}
        >
          <polygon
            points={`${fulcrumX + balanceRatio * 30},${fulcrumY - 60} ${fulcrumX + balanceRatio * 30 - 8},${fulcrumY - 45} ${fulcrumX + balanceRatio * 30 + 8},${fulcrumY - 45}`}
            fill={economics.isTooExpensive ? theme.colors.status.resiliente : theme.colors.status.fragil}
          />
          <text
            x={fulcrumX + balanceRatio * 30}
            y={fulcrumY - 70}
            textAnchor="middle"
            fontSize={theme.typography.sizes.micro}
            fill={theme.colors.text.secondary}
            fontFamily={theme.typography.fontFamily}
          >
            Balance Point
          </text>
        </motion.g>
      </svg>
      
      {/* Detailed breakdown */}
      {showDetails && (
        <motion.div
          className="grid grid-cols-3 gap-4 mt-6"
          initial={staticMode ? false : { opacity: 0, y: 20 }}
          animate={staticMode ? false : { opacity: 1, y: 0 }}
          transition={staticMode ? undefined : { delay: 2, duration: theme.animation.duration.normal / 1000 }}
        >
          <div className="text-center">
            <div 
              className="text-2xl font-bold mb-1"
              style={{ 
                color: theme.colors.status.adaptativo,
                fontFamily: theme.typography.fontFamily 
              }}
            >
              {economics.attackCost}
            </div>
            <div 
              className="text-sm mb-1"
              style={{ 
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily 
              }}
            >
              Attack Cost
            </div>
            <div 
              className="text-xs"
              style={{ 
                color: theme.colors.text.muted,
                fontFamily: theme.typography.fontFamily 
              }}
            >
              Time, tools, expertise required
            </div>
          </div>
          
          <div className="text-center">
            <div 
              className="text-2xl font-bold mb-1"
              style={{ 
                color: theme.colors.status.resiliente,
                fontFamily: theme.typography.fontFamily 
              }}
            >
              +{economics.immunityBonus}
            </div>
            <div 
              className="text-sm mb-1"
              style={{ 
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily 
              }}
            >
              Your Immunity
            </div>
            <div 
              className="text-xs"
              style={{ 
                color: theme.colors.text.muted,
                fontFamily: theme.typography.fontFamily 
              }}
            >
              Additional effort you force
            </div>
          </div>
          
          <div className="text-center">
            <div 
              className="text-2xl font-bold mb-1"
              style={{ 
                color: theme.colors.status.fragil,
                fontFamily: theme.typography.fontFamily 
              }}
            >
              {economics.potentialGain}
            </div>
            <div 
              className="text-sm mb-1"
              style={{ 
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily 
              }}
            >
              Potential Gain
            </div>
            <div 
              className="text-xs"
              style={{ 
                color: theme.colors.text.muted,
                fontFamily: theme.typography.fontFamily 
              }}
            >
              What attackers could extract
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}