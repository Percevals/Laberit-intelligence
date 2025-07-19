# DII Visualization System - Integration Guide

## Overview

The DII Visualization System consists of three modular components that work together to create a zen-inspired, sophisticated gauge visualization for the Digital Immunity Index.

## Components

### Module 1: ArcGaugeFoundation
**Purpose**: Provides the foundation arc with scale marks and coordinate system

**Key Features**:
- 270° arc spanning from 135° to 405° (traditional gauge orientation)
- Grey background arc (#222 or #333 depending on theme)
- Optional scale marks for reference
- Consistent coordinate system for all overlays

**Props**:
```typescript
interface ArcGaugeFoundationProps {
  centerX?: number;        // Default: 200
  centerY?: number;        // Default: 200
  radius?: number;         // Default: 160
  strokeWidth?: number;    // Default: 24
  showTicks?: boolean;     // Default: true
  tickInterval?: number;   // Default: 1
  className?: string;
}
```

### Module 2: ProgressiveArc
**Purpose**: Displays the actual value with a luminosity gradient

**Key Features**:
- Single color with subtle luminosity variation (darker → original → lighter)
- Supports solid colors or gradient mode
- Smooth animation from 0 to target value
- Automatically determines color based on DII stage if `color="auto"`

**Props**:
```typescript
interface ProgressiveArcProps {
  value: number;                          // 1-10 scale
  color?: string | 'auto' | 'gradient';  // Default: 'auto'
  centerX?: number;                       // Default: 200
  centerY?: number;                       // Default: 200
  radius?: number;                        // Default: 160
  strokeWidth?: number;                   // Default: 24
  animate?: boolean;                      // Default: true
  animationDuration?: number;             // Default: 2
  gradientId?: string;                    // Custom gradient ID
}
```

### Module 3: IndexDisplay
**Purpose**: Shows the numerical value and descriptive labels

**Key Features**:
- Large value display with one decimal place
- Primary label (maturity stage or custom text)
- Secondary label (context description)
- Automatic color coordination with the arc

**Props**:
```typescript
interface IndexDisplayProps {
  value: number;                    // 1-10 scale
  primaryLabel: string;             // e.g., "RESILIENTE" or 'auto'
  secondaryLabel: string;           // e.g., "Índice de Inmunidad"
  centerX?: number;                 // Default: 200
  centerY?: number;                 // Default: 200
  valueSize?: number;               // Default: 72
  primarySize?: number;             // Default: 24
  secondarySize?: number;           // Default: 16
  valueColor?: string;              // Default: 'auto'
  labelColor?: string;              // Default: '#666666'
}
```

## Integration Examples

### Basic DII Gauge
```tsx
import { ArcGaugeFoundation, ProgressiveArc, IndexDisplay } from '@dii/visualizations';

function DIIGauge({ value }: { value: number }) {
  return (
    <svg width="400" height="400" viewBox="0 0 400 400">
      <ArcGaugeFoundation />
      <ProgressiveArc value={value} color="gradient" />
      <IndexDisplay 
        value={value}
        primaryLabel="auto"
        secondaryLabel="Índice de Inmunidad"
      />
    </svg>
  );
}
```

### Dimension-Specific Gauge
```tsx
import { ArcGaugeFoundation, ProgressiveArc, IndexDisplay, DIMENSION_NAMES } from '@dii/visualizations';

function DimensionGauge({ dimension, value }: { dimension: string, value: number }) {
  return (
    <svg width="400" height="300" viewBox="0 0 400 300">
      <ArcGaugeFoundation 
        centerX={200}
        centerY={160}
        radius={90}
        strokeWidth={16}
      />
      <ProgressiveArc 
        value={value}
        centerX={200}
        centerY={160}
        radius={90}
        strokeWidth={16}
        color="gradient"
      />
      <IndexDisplay 
        value={value}
        primaryLabel="auto"
        secondaryLabel={DIMENSION_NAMES[dimension]}
        centerX={200}
        centerY={160}
        valueSize={48}
        primarySize={18}
        secondarySize={14}
      />
    </svg>
  );
}
```

### With 170° Rotation
```tsx
function RotatedGauge({ value }: { value: number }) {
  return (
    <svg 
      width="400" 
      height="400" 
      viewBox="0 0 400 400"
      style={{ transform: 'rotate(170deg)' }}
    >
      <ArcGaugeFoundation />
      <ProgressiveArc value={value} color="gradient" />
      <g style={{ transform: 'rotate(-170deg)', transformOrigin: '200px 200px' }}>
        <IndexDisplay 
          value={value}
          primaryLabel="auto"
          secondaryLabel="Índice de Inmunidad"
        />
      </g>
    </svg>
  );
}
```

## Design Principles

### Zen Aesthetic
- **Minimalist**: Clean lines, ample whitespace, no unnecessary decoration
- **Sophisticated**: Subtle luminosity gradients instead of harsh color transitions
- **Consistent**: All components use the same coordinate system and proportions

### Color Scheme
The system automatically assigns colors based on DII stages:
- **FRÁGIL (1-4)**: #ef4444 (Red)
- **ROBUSTO (4-6)**: #f59e0b (Orange)
- **RESILIENTE (6-8)**: #10b981 (Green)
- **ADAPTATIVO (8-10)**: #3b82f6 (Blue)

### Luminosity Gradient
The gradient creates depth without complexity:
- Start: 85% brightness of base color
- Middle: 100% base color
- End: 15% lighter than base color

## Best Practices

### 1. Consistent Sizing
Always use the same center point and radius for all three modules:
```tsx
const CENTER_X = 200;
const CENTER_Y = 200;
const RADIUS = 160;
const STROKE_WIDTH = 24;
```

### 2. Responsive Design
Wrap in a responsive container:
```tsx
<div style={{ width: '100%', maxWidth: '400px' }}>
  <svg viewBox="0 0 400 400" style={{ width: '100%', height: 'auto' }}>
    {/* Components */}
  </svg>
</div>
```

### 3. Animation Coordination
When using animations, coordinate timing:
```tsx
<ProgressiveArc value={value} animationDuration={2} />
<IndexDisplay value={value} animationDuration={1} />
```

### 4. Accessibility
Add ARIA labels for screen readers:
```tsx
<svg role="img" aria-label={`Immunity score: ${value} - ${stage}`}>
  {/* Components */}
</svg>
```

## Advanced Usage

### Custom Colors
Override automatic colors for specific use cases:
```tsx
<ProgressiveArc 
  value={value} 
  color="#6366f1"  // Custom purple
/>
```

### Multiple Gauges
Create a dashboard with multiple metrics:
```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
  {dimensions.map(dim => (
    <DimensionGauge 
      key={dim.key}
      dimension={dim.key}
      value={dim.value}
    />
  ))}
</div>
```

### Export as Static Image
For reports, render to canvas:
```tsx
import { exportUtils } from '@dii/visualizations';

const svgElement = document.getElementById('dii-gauge');
const pngDataUrl = await exportUtils.generatePNG(svgElement);
```

## Performance Considerations

1. **Reuse Gradient Definitions**: Define gradients once in a parent SVG
2. **Memoize Components**: Use React.memo for static gauges
3. **Batch Updates**: Update multiple gauges simultaneously
4. **Limit Animations**: Disable animations for large datasets

## Troubleshooting

### Arc Misalignment
Ensure all components use the same coordinate system:
- centerX, centerY, radius must match across all three modules

### Text Overlap
For long labels, adjust positioning:
```tsx
<IndexDisplay 
  secondaryLabel="Very Long Description Text"
  secondarySize={12}  // Smaller font
/>
```

### Gradient Not Showing
Check that gradientId is unique if using multiple gauges

## Future Enhancements

Planned features for upcoming releases:
- Radial gradient option following arc curvature
- Custom scale ranges (not just 1-10)
- Threshold indicators
- Historical trend overlay
- Export templates for different report formats