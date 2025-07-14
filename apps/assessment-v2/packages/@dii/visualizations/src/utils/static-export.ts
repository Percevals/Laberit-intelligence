/**
 * Static Export Utilities
 * Generate static versions of visualizations for reports and presentations
 */

import React from 'react';
import type { StaticExportOptions } from '../types';

/**
 * Generate SVG string from React component
 */
export async function generateSVG(
  Component: React.ComponentType<any>,
  props: any,
  options: StaticExportOptions
): Promise<string> {
  // This would typically use a library like react-dom/server in a Node.js environment
  // For now, we'll provide the structure for static generation
  
  const { width, height, backgroundColor } = options;
  
  // Create static version of props
  const staticProps = {
    ...props,
    staticMode: true,
    theme: {
      ...props.theme,
      colors: {
        ...props.theme?.colors,
        background: backgroundColor || props.theme?.colors?.background || '#0F0F0F'
      }
    }
  };
  
  // In a real implementation, you would:
  // 1. Render the component to string using ReactDOMServer.renderToString()
  // 2. Extract the SVG content
  // 3. Add proper SVG wrapper with dimensions
  
  return `
    <svg 
      width="${width}" 
      height="${height}" 
      viewBox="0 0 ${width} ${height}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Component would be rendered here -->
      <rect width="100%" height="100%" fill="${backgroundColor || '#0F0F0F'}"/>
      <text x="50%" y="50%" text-anchor="middle" fill="white" font-family="Arial">
        ${Component.name} Visualization
      </text>
    </svg>
  `;
}

/**
 * Generate PNG from SVG (requires canvas in browser or node-canvas in Node.js)
 */
export async function generatePNG(
  svgString: string,
  options: StaticExportOptions
): Promise<Blob | Buffer> {
  const { width, height, scale = 1 } = options;
  
  if (typeof window !== 'undefined' && window.document) {
    // Browser environment
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate PNG'));
          }
        }, 'image/png');
      };
      
      img.onerror = () => reject(new Error('Failed to load SVG'));
      
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      img.src = URL.createObjectURL(svgBlob);
    });
  } else {
    // Node.js environment would use node-canvas or similar
    throw new Error('PNG generation not available in this environment');
  }
}

/**
 * Generate HTML wrapper for embedding
 */
export function generateHTML(
  svgString: string,
  options: StaticExportOptions & { 
    title?: string; 
    description?: string;
    responsive?: boolean;
  }
): string {
  const { width, height, backgroundColor, title, description, responsive = true } = options;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title || 'DII Visualization'}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: ${backgroundColor || '#0F0F0F'};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: white;
        }
        .visualization-container {
            max-width: ${responsive ? '100%' : width + 'px'};
            margin: 0 auto;
            text-align: center;
        }
        .visualization-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 8px;
            color: white;
        }
        .visualization-description {
            font-size: 0.875rem;
            color: #D1D5DB;
            margin-bottom: 24px;
        }
        svg {
            width: 100%;
            height: auto;
            max-width: ${width}px;
        }
        @media (max-width: 768px) {
            body { padding: 10px; }
            .visualization-title { font-size: 1.25rem; }
            .visualization-description { font-size: 0.8rem; }
        }
    </style>
</head>
<body>
    <div class="visualization-container">
        ${title ? `<h1 class="visualization-title">${title}</h1>` : ''}
        ${description ? `<p class="visualization-description">${description}</p>` : ''}
        ${svgString}
    </div>
</body>
</html>
  `;
}

/**
 * Export utility functions for each visualization type
 */
export const exportUtils = {
  /**
   * Export ImmunityGauge as various formats
   */
  async immunityGauge(
    score: any,
    peerBenchmark: any,
    options: StaticExportOptions & { size?: 'small' | 'medium' | 'large' }
  ) {
    const { ImmunityGauge } = await import('../components/ImmunityGauge');
    const props = { score, peerBenchmark, size: options.size || 'medium' };
    
    switch (options.format) {
      case 'svg':
        return generateSVG(ImmunityGauge, props, options);
      case 'png':
        const svg = await generateSVG(ImmunityGauge, props, options);
        return generatePNG(svg, options);
      case 'html':
        const svgHtml = await generateSVG(ImmunityGauge, props, options);
        return generateHTML(svgHtml, {
          ...options,
          title: `DII Score: ${score.current}`,
          description: `${score.stage} immunity level - Better than ${score.percentile}% of similar companies`
        });
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  },

  /**
   * Export DimensionBalance as various formats
   */
  async dimensionBalance(
    dimensions: any[],
    options: StaticExportOptions & { size?: 'small' | 'medium' | 'large' }
  ) {
    const { DimensionBalance } = await import('../components/DimensionBalance');
    const props = { dimensions, size: options.size || 'medium' };
    
    const weakest = dimensions.reduce((w, d) => d.score < w.score ? d : w);
    
    switch (options.format) {
      case 'svg':
        return generateSVG(DimensionBalance, props, options);
      case 'png':
        const svg = await generateSVG(DimensionBalance, props, options);
        return generatePNG(svg, options);
      case 'html':
        const svgHtml = await generateSVG(DimensionBalance, props, options);
        return generateHTML(svgHtml, {
          ...options,
          title: 'Dimension Balance Analysis',
          description: `Prevention vs Resilience balance - Weakest dimension: ${weakest.dimension}`
        });
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  },

  /**
   * Export RiskPositionMatrix as various formats
   */
  async riskPositionMatrix(
    positions: any[],
    options: StaticExportOptions & { size?: 'small' | 'medium' | 'large' }
  ) {
    const { RiskPositionMatrix } = await import('../components/RiskPositionMatrix');
    const props = { positions, size: options.size || 'medium' };
    
    const userPos = positions.find(p => p.isUser);
    
    switch (options.format) {
      case 'svg':
        return generateSVG(RiskPositionMatrix, props, options);
      case 'png':
        const svg = await generateSVG(RiskPositionMatrix, props, options);
        return generatePNG(svg, options);
      case 'html':
        const svgHtml = await generateSVG(RiskPositionMatrix, props, options);
        return generateHTML(svgHtml, {
          ...options,
          title: 'Risk Position Matrix',
          description: userPos ? `Your position: ${userPos.attackSurface}% attack surface, ${userPos.impactSeverity}% impact severity` : 'Business model risk positioning'
        });
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  },

  /**
   * Export AttackEconomics as various formats
   */
  async attackEconomics(
    economics: any,
    options: StaticExportOptions & { size?: 'small' | 'medium' | 'large' }
  ) {
    const { AttackEconomics } = await import('../components/AttackEconomics');
    const props = { economics, size: options.size || 'medium' };
    
    switch (options.format) {
      case 'svg':
        return generateSVG(AttackEconomics, props, options);
      case 'png':
        const svg = await generateSVG(AttackEconomics, props, options);
        return generatePNG(svg, options);
      case 'html':
        const svgHtml = await generateSVG(AttackEconomics, props, options);
        return generateHTML(svgHtml, {
          ...options,
          title: 'Attack Economics Analysis',
          description: economics.isTooExpensive ? 'Too expensive to attack - your immunity provides strong economic deterrent' : 'Economically viable target - consider strengthening defenses'
        });
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }
};

/**
 * Batch export multiple visualizations
 */
export async function exportVisualizationSuite(
  data: {
    score: any;
    peerBenchmark?: any;
    dimensions: any[];
    positions: any[];
    economics: any;
  },
  options: StaticExportOptions & {
    includeGauge?: boolean;
    includeBalance?: boolean;
    includeMatrix?: boolean;
    includeEconomics?: boolean;
  }
) {
  const results: Record<string, any> = {};
  
  if (options.includeGauge !== false) {
    results.immunityGauge = await exportUtils.immunityGauge(
      data.score,
      data.peerBenchmark,
      options
    );
  }
  
  if (options.includeBalance !== false) {
    results.dimensionBalance = await exportUtils.dimensionBalance(
      data.dimensions,
      options
    );
  }
  
  if (options.includeMatrix !== false) {
    results.riskPositionMatrix = await exportUtils.riskPositionMatrix(
      data.positions,
      options
    );
  }
  
  if (options.includeEconomics !== false) {
    results.attackEconomics = await exportUtils.attackEconomics(
      data.economics,
      options
    );
  }
  
  return results;
}