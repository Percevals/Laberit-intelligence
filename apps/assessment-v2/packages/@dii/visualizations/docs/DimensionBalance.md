# DimensionBalance Component Documentation

## Overview

The `DimensionBalance` component is the signature visualization for the Digital Immunity Index (DII). It displays the 5 key dimensions in an inverted pentagon layout with a yin-yang inspired background, creating a distinctive and memorable visual representation of an organization's digital immunity.

## Key Features

- **Flexible dimension configuration**: Labels, descriptions, and colors can be customized per application
- **Maturity-based hover effects**: Dots change color based on their maturity stage when hovered
- **No connecting pentagon**: Due to opposite logic (Resilience ↑ = better, Vulnerability ↑ = worse)
- **Interactive guide lines**: Appear on hover for better visual connection
- **Zen-style aesthetics**: Clean, calm visual experience
- **Responsive sizes**: Small, medium, and large options
- **Internationalization ready**: Built-in support for multiple languages

## Design Principles

### 1. **Single Source of Truth**
The component uses standard dimension keys (`trd`, `aer`, `bri`, `hfp`, `rrg`) internally. Display names are provided by the consuming application.

### 2. **Configure, Don't Customize**
The component remains pure and reusable. Applications configure it through props rather than modifying the component itself.

### 3. **Context-Aware Flexibility**
Different applications can use different naming conventions:
- Assessment tools might use formal, complete names
- Dashboards might prefer abbreviated versions
- Executive reports might use business-friendly terms

## Usage Examples

### Basic Usage with Spanish Labels

```typescript
import { DimensionBalance } from '@dii/visualizations';
import { getDimensionConfig } from '@dii/visualizations/constants';

function MyComponent() {
  const dimensions = getDimensionConfig('es', 'simple');
  const values = {
    trd: 7.5,
    aer: 8.0,
    bri: 5.0,
    hfp: 6.0,
    rrg: 4.5
  };

  return (
    <DimensionBalance
      dimensions={dimensions}
      values={values}
      locale="es"
    />
  );
}
```

### Custom Configuration for Assessment

```typescript
<DimensionBalance
  dimensions={[
    { 
      key: 'trd', 
      label: 'Tiempo de Resistencia al Daño',
      description: 'Mide cuántas horas puede resistir tu operación'
    },
    { 
      key: 'aer', 
      label: 'Ratio de Economía del Ataque',
      description: 'Qué tan costoso haces un ataque exitoso'
    },
    { 
      key: 'bri', 
      label: 'Impacto del Riesgo de Negocio',
      description: 'Exposición financiera por incidentes'
    },
    { 
      key: 'hfp', 
      label: 'Probabilidad de Fallo Humano',
      description: 'Factor humano como vector de ataque'
    },
    { 
      key: 'rrg', 
      label: 'Brecha de Recursos de Recuperación',
      description: 'Capacidad de respuesta y recuperación'
    }
  ]}
  values={assessmentResults}
  size="large"
  showMaturityLegend={true}
  onHover={(dimension, stage) => {
    console.log(`${dimension} is in ${stage} stage`);
  }}
/>
```

### English Dashboard with Abbreviated Names

```typescript
<DimensionBalance
  dimensions={[
    { key: 'trd', label: 'TRD' },
    { key: 'aer', label: 'AER' },
    { key: 'bri', label: 'BRI' },
    { key: 'hfp', label: 'HFP' },
    { key: 'rrg', label: 'RRG' }
  ]}
  values={currentMetrics}
  locale="en"
  size="small"
  showMaturityLegend={false}
/>
```

### Executive Report with Business Terms

```typescript
import { DIMENSION_LABELS } from '@dii/visualizations/constants';

const executiveLabels = Object.entries(DIMENSION_LABELS.en.executive)
  .map(([key, label]) => ({
    key: key as 'trd' | 'aer' | 'bri' | 'hfp' | 'rrg',
    label
  }));

<DimensionBalance
  dimensions={executiveLabels}
  values={quarterlyResults}
  size="medium"
  className="executive-report"
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dimensions` | `DimensionConfig[]` | Required | Array of dimension configurations |
| `values` | `Record<string, number>` | Required | Current values for each dimension (1-10 scale) |
| `locale` | `'es' \| 'en' \| 'pt'` | `'es'` | Language locale for maturity stages |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size of the visualization |
| `onHover` | `(dimension: string, stage: string) => void` | - | Callback when hovering over a dimension |
| `className` | `string` | `''` | Additional CSS classes |
| `showMaturityLegend` | `boolean` | `true` | Show/hide the maturity legend |
| `ariaLabel` | `string` | `'Digital Immunity Index Visualization'` | Accessibility label |

## Dimension Configuration

Each dimension in the `dimensions` array should have:

```typescript
interface DimensionConfig {
  key: 'trd' | 'aer' | 'bri' | 'hfp' | 'rrg';
  label: string;        // Display name
  description?: string; // Optional tooltip text
  color?: string;      // Optional custom color (defaults to green for resilience, purple for vulnerability)
}
```

## Visual Design

### Pentagon Layout
- **TRD**: Top-left (324°) - Resilience dimension
- **AER**: Top-right (36°) - Resilience dimension  
- **RRG**: Right (108°) - Vulnerability dimension
- **HFP**: Bottom center (180°) - Vulnerability dimension (key human factor)
- **BRI**: Left (252°) - Vulnerability dimension

### Maturity Stages
- **FRÁGIL** (< 4.0): Red - Organization doesn't know it's compromised
- **ROBUSTO** (4.0-6.0): Orange - Finds out when it's too late
- **RESILIENTE** (6.0-8.0): Green - Detects quickly, limits damage
- **ADAPTATIVO** (> 8.0): Blue - Attacks make them stronger

### Color Scheme
- **Resilience dimensions** (TRD, AER): Green (#10b981)
- **Vulnerability dimensions** (BRI, HFP, RRG): Purple (#B4B5DF)
- **Background**: Yin-yang flowing wave effect
- **Hover**: Changes to maturity stage color

## Best Practices

1. **Choose appropriate labels for your context**
   - Use formal names for assessments
   - Use simple names for dashboards
   - Use technical names for IT teams
   - Use executive-friendly names for C-level reports

2. **Provide descriptions for better UX**
   - Add tooltips for complex dimensions
   - Help users understand what each dimension measures

3. **Consider your audience**
   - Show maturity legend for educational contexts
   - Hide it for expert users who know the stages
   - Use appropriate size for the display context

4. **Maintain consistency**
   - Use the same labeling scheme throughout your application
   - Consider creating a custom configuration hook for your app

## Integration with DII Platform

The component is designed to work seamlessly with the DII calculation engine:

```typescript
// Example integration
const diiResults = await calculateDII(organizationData);

const dimensionValues = {
  trd: diiResults.dimensions.trd.normalized,
  aer: diiResults.dimensions.aer.normalized,
  bri: diiResults.dimensions.bri.normalized,
  hfp: diiResults.dimensions.hfp.normalized,
  rrg: diiResults.dimensions.rrg.normalized
};

<DimensionBalance
  dimensions={getDimensionConfig('es', 'simple')}
  values={dimensionValues}
/>
```

## Future Enhancements

- Animation options for value changes
- Export functionality (PNG/SVG)
- Comparison mode (current vs target)
- Historical trend integration
- AR/VR visualization support