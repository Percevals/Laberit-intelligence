# @dii/visualizations

DII signature visualization components with unique visual identity that establish immediate recognition of Digital Immunity Index assessments.

## ✨ Features

- **Zen-inspired minimalism** with generous whitespace and thick lines
- **Dark backgrounds** with high contrast elements for premium feel
- **Bold numbers** as focal points with subtle, meaningful animations
- **Mobile-first responsive** design that scales beautifully to desktop
- **Accessibility compliant** (WCAG 2.1 AA) with screen reader support
- **Performance optimized** (<100ms render, <50MB memory)
- **Static export** capabilities for reports and presentations
- **Theme system** for future white-label customization

## 🎯 Core Visualizations

### 1. ImmunityGauge
270° circular arc gauge showing DII score with peer benchmarks.

```tsx
import { ImmunityGauge } from '@dii/visualizations';

<ImmunityGauge
  score={{
    current: 87,
    previous: 82,
    stage: 'ADAPTATIVO',
    percentile: 92,
    confidence: 95
  }}
  peerBenchmark={{
    percentile: 75,
    average: 58,
    sampleSize: 1247
  }}
  size="medium"
/>
```

### 2. DimensionBalance
Yin-yang inspired visualization showing prevention vs resilience balance.

```tsx
import { DimensionBalance } from '@dii/visualizations';

<DimensionBalance
  dimensions={[
    { dimension: 'TRD', score: 8.5, rawValue: 2 },
    { dimension: 'AER', score: 9.0, rawValue: 1 },
    { dimension: 'HFP', score: 8.2, rawValue: 3 },
    { dimension: 'BRI', score: 7.8, rawValue: 4, isWeakest: true },
    { dimension: 'RRG', score: 8.8, rawValue: 2 }
  ]}
  size="medium"
/>
```

### 3. RiskPositionMatrix
Clean 2x2 quadrant showing business models by attack surface vs impact severity.

```tsx
import { RiskPositionMatrix } from '@dii/visualizations';

<RiskPositionMatrix
  positions={[
    { 
      id: 1, 
      name: 'Hybrid Commerce', 
      attackSurface: 70, 
      impactSeverity: 65, 
      isUser: true 
    },
    // ... other business models
  ]}
  size="medium"
/>
```

### 4. AttackEconomics
Innovative cost-benefit balance showing "hacking is a business" concept.

```tsx
import { AttackEconomics } from '@dii/visualizations';

<AttackEconomics
  economics={{
    attackCost: 75,
    potentialGain: 45,
    immunityBonus: 25,
    isTooExpensive: true
  }}
  size="medium"
/>
```

## 🚀 Quick Start

```bash
npm install @dii/visualizations
```

```tsx
import { 
  ImmunityGauge, 
  DimensionBalance, 
  RiskPositionMatrix, 
  AttackEconomics,
  VisualizationDemo 
} from '@dii/visualizations';

// Use individual components
<ImmunityGauge score={score} />

// Or showcase all with demo
<VisualizationDemo scenario="excellent" />
```

## 🎨 Theming

All components support theme customization:

```tsx
import { defaultTheme, mergeTheme } from '@dii/visualizations';

const customTheme = mergeTheme(defaultTheme, {
  colors: {
    primary: '#3B82F6',
    accent: '#10B981'
  }
});

<ImmunityGauge 
  score={score} 
  theme={customTheme} 
/>
```

### Available Themes

- `defaultTheme` - Dark zen-inspired (default)
- `whiteLabelTheme` - Light theme for customization
- `mobileTheme` - Mobile-optimized adjustments

## 📊 Static Export

Generate static versions for reports and presentations:

```tsx
import { exportUtils } from '@dii/visualizations';

// Export as SVG
const svg = await exportUtils.immunityGauge(score, peerBenchmark, {
  format: 'svg',
  width: 400,
  height: 400
});

// Export as PNG
const png = await exportUtils.immunityGauge(score, peerBenchmark, {
  format: 'png',
  width: 800,
  height: 800,
  scale: 2
});

// Export as HTML
const html = await exportUtils.immunityGauge(score, peerBenchmark, {
  format: 'html',
  width: 400,
  height: 400,
  title: 'DII Assessment Results'
});
```

## ♿ Accessibility

Built-in accessibility features:

```tsx
import { 
  generateAccessibleDescription,
  validateContrast,
  A11yPerformanceMonitor 
} from '@dii/visualizations';

// Generate screen reader descriptions
const description = generateAccessibleDescription('gauge', { score });

// Validate color contrast
const contrast = validateContrast('#FFFFFF', '#0F0F0F');

// Monitor performance
const monitor = new A11yPerformanceMonitor();
monitor.startRender();
// ... render component
monitor.endRender();
```

## 📱 Responsive Design

Components automatically adapt to container size:

```tsx
// Responsive sizing
<ImmunityGauge 
  score={score} 
  size="medium" // 'small' | 'medium' | 'large'
/>

// Custom breakpoint handling
<div className="lg:w-96 md:w-80 w-64">
  <ImmunityGauge score={score} />
</div>
```

## 🔧 Advanced Usage

### Performance Monitoring

```tsx
import { VisualizationDemo } from '@dii/visualizations';

<VisualizationDemo 
  scenario="excellent"
  showPerformance={true}
  interactive={true}
/>
```

### Reduced Motion Support

Components automatically respect `prefers-reduced-motion`:

```tsx
<ImmunityGauge 
  score={score}
  staticMode={true} // Disable animations manually
/>
```

### Batch Export

```tsx
import { exportVisualizationSuite } from '@dii/visualizations';

const exports = await exportVisualizationSuite({
  score,
  dimensions,
  positions,
  economics
}, {
  format: 'png',
  width: 800,
  height: 600
});
```

## 🎯 Design Philosophy

These visualizations are designed to be:

1. **Screenshot-worthy** - Every visualization should look great when shared
2. **Immediately recognizable** - Establish DII visual identity
3. **Business-focused** - Make cyber risk tangible through economics
4. **Accessible** - Work for everyone, regardless of abilities
5. **Performance-conscious** - Fast and lightweight

## 📋 Component Props

### Common Props

All components accept these common props:

```tsx
interface VisualizationProps {
  theme?: Partial<VisualizationTheme>;
  className?: string;
  'aria-label'?: string;
  staticMode?: boolean; // Disable animations
}
```

### Size Options

All components support three sizes:
- `small` - Compact for dashboards
- `medium` - Default balanced size  
- `large` - Prominent display

## 🔄 Integration Examples

### Assessment App Integration

```tsx
import { ImmunityGauge } from '@dii/visualizations';
import { useDIIDimensionsStore } from '@/store';

function AssessmentResults() {
  const { currentDII } = useDIIDimensionsStore();
  
  return (
    <ImmunityGauge
      score={{
        current: currentDII.score,
        stage: currentDII.stage,
        percentile: currentDII.percentile,
        confidence: currentDII.confidence
      }}
    />
  );
}
```

### Weekly Report Integration

```tsx
import { exportVisualizationSuite } from '@dii/visualizations';

async function generateWeeklyReport(data) {
  const exports = await exportVisualizationSuite(data, {
    format: 'png',
    width: 1200,
    height: 800,
    backgroundColor: '#FFFFFF'
  });
  
  // Include in PDF report
  return exports;
}
```

## 🚀 Performance

- **Render time**: <100ms target
- **Memory usage**: <50MB target  
- **Bundle size**: Optimized for tree-shaking
- **Animation**: 60fps smooth animations
- **Responsive**: Instant layout adaptation

## 📄 License

MIT License - See LICENSE file for details.

---

**Made with ❤️ for the DII ecosystem**