# ImmunityGauge Migration Guide

## Important Update: ImmunityGauge V2 is now the definitive version

The original `ImmunityGauge` component has been removed and replaced with `ImmunityGaugeV2`, which is now exported as `ImmunityGauge`.

### What Changed

1. **Modular Architecture**: The new gauge uses three separate components internally:
   - `ArcGaugeFoundation` - The grey background arc with scale marks
   - `ProgressiveArc` - The colored value display with luminosity gradient
   - `IndexDisplay` - The centered text showing value and labels

2. **Improved Features**:
   - Perfect arc alignment (no more moon shape issues)
   - Zen-inspired luminosity gradient instead of harsh color transitions
   - Proper 170° rotation support
   - Better text positioning that counter-rotates when gauge is rotated
   - Consistent coordinate system (135° → 405°)

3. **API Changes**:
   - Added `secondaryLabel` prop for custom text (default: "Índice de Inmunidad")
   - `gaugeRotation` prop now works correctly
   - All other props remain the same

### Migration Steps

1. **No import changes needed** - The export name remains `ImmunityGauge`:
   ```typescript
   import { ImmunityGauge } from '@dii/visualizations';
   ```

2. **No prop changes required** - All existing props work the same:
   ```tsx
   <ImmunityGauge
     score={{
       current: 75,
       stage: 'RESILIENTE',
       trend: 'improving',
       confidence: 95,
       previous: 68
     }}
     size="medium"
     showDetails={true}
     gaugeRotation={170}  // Now works correctly!
   />
   ```

3. **New optional prop** - Customize the secondary label:
   ```tsx
   <ImmunityGauge
     score={score}
     secondaryLabel="Digital Immunity"  // Custom text
   />
   ```

### Visual Improvements

- The gauge no longer looks like a "moon" when rotated
- Smooth luminosity gradient creates depth without complexity
- Text remains readable at any rotation angle
- Scale marks are more visible and properly aligned
- Animation is smoother and more sophisticated

### For Dimension-Specific Usage

You can now use the gauge for individual dimensions:

```tsx
<ImmunityGauge
  score={dimensionScore}
  secondaryLabel="Ratio de Economía del Ataque"
  size="small"
/>
```

### Troubleshooting

If you see any issues:
1. Make sure you're using the latest version of `@dii/visualizations`
2. Clear your build cache
3. The component now requires React 18+ for `useId()` hook

The new implementation is more performant, visually superior, and easier to maintain.