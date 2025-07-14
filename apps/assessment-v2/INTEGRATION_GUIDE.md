# Integration Guide for New Assessment Components

This guide explains how to integrate the new assessment components into your existing app.

## Components Overview

### 1. **ImmunityTimelineNavigation**
Vertical timeline navigation for the assessment journey
```tsx
import { ImmunityTimelineNavigation } from '@/components';

// Use in your assessment flow
<ImmunityTimelineNavigation
  dimensions={dimensionStates}
  currentDimension="TRD"
  onDimensionClick={(dimension) => navigateToDimension(dimension)}
/>
```

### 2. **DIIProgressiveDemo** 
Shows how DII score evolves as dimensions are answered
```tsx
import { DIIProgressiveDemo } from '@/components';

// Standalone demo page
<DIIProgressiveDemo />
```

### 3. **InsightRevelationDemo**
Demonstrates contextual insights after each answer
```tsx
import { InsightRevelationDemo } from '@/components';

// Standalone demo page
<InsightRevelationDemo />
```

### 4. **AssessmentCompletionFlow**
Complete flow from final answer to results display
```tsx
import { AssessmentCompletionFlow } from '@/components';

// Demo page showing the complete experience
<AssessmentCompletionFlow />
```

### 5. **AssessmentCompletion**
The actual completion component to use in production
```tsx
import { AssessmentCompletion } from '@/components';
import { useDIIDimensionsStore } from '@/store/dii-dimensions-store';

// In your assessment completion handler
function AssessmentComplete() {
  const handleExploreScenarios = () => {
    // Navigate to scenarios explorer
    router.push('/scenarios');
  };

  const handleGetDetailedAnalysis = () => {
    // Navigate to premium features
    router.push('/analysis');
  };

  return (
    <AssessmentCompletion
      onExploreScenarios={handleExploreScenarios}
      onGetDetailedAnalysis={handleGetDetailedAnalysis}
    />
  );
}
```

## State Management

All components use the `useDIIDimensionsStore` for state:

```tsx
import { useDIIDimensionsStore } from '@/store/dii-dimensions-store';

function YourComponent() {
  const {
    dimensions,
    currentDII,
    setDimensionResponse,
    calculateConfidence,
    createScenario,
    // ... other methods
  } = useDIIDimensionsStore();
}
```

## Integration Steps

### 1. Add Demo Routes (Optional)
```tsx
// In your router configuration
const routes = [
  // ... existing routes
  { path: '/demo/timeline', component: ImmunityTimelineDemo },
  { path: '/demo/progressive', component: DIIProgressiveDemo },
  { path: '/demo/insights', component: InsightRevelationDemo },
  { path: '/demo/completion', component: AssessmentCompletionFlow },
];
```

### 2. Update Assessment Flow
Replace your existing assessment flow with:

```tsx
import { useState } from 'react';
import { 
  ImmunityTimelineNavigation,
  InsightRevelationCard,
  AssessmentCompletion 
} from '@/components';
import { generateInsightRevelation } from '@/services';
import { useDIIDimensionsStore } from '@/store/dii-dimensions-store';

function AssessmentFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [insights, setInsights] = useState([]);
  
  const {
    dimensions,
    currentDII,
    setDimensionResponse,
    businessModelId
  } = useDIIDimensionsStore();

  const handleAnswer = async (dimension, rawValue, metricValue) => {
    // Set the response
    const impact = await setDimensionResponse(dimension, rawValue, metricValue);
    
    // Generate insight
    const insight = generateInsightRevelation(
      dimension,
      dimensions[dimension],
      businessModelId,
      dimensions,
      currentDII
    );
    
    setInsights([...insights, insight]);
    
    // Move to next dimension or completion
    if (Object.keys(dimensions).length === 5) {
      setCurrentStep('complete');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  if (currentStep === 'complete') {
    return <AssessmentCompletion />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Timeline Navigation */}
      <div className="lg:col-span-1">
        <ImmunityTimelineNavigation
          dimensions={dimensionStates}
          currentDimension={currentDimension}
          onDimensionClick={(dim) => {/* handle navigation */}}
        />
      </div>
      
      {/* Question Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Your question component */}
        
        {/* Show latest insight after answer */}
        {insights.length > 0 && (
          <InsightRevelationCard
            insight={insights[insights.length - 1]}
            onNextDimension={(dim) => {/* handle next */}}
          />
        )}
      </div>
    </div>
  );
}
```

### 3. Mobile Support
Use the mobile-optimized completion view:

```tsx
import { AssessmentCompletionMobile } from '@/components';

// Detect mobile and render appropriate view
const isMobile = useMediaQuery('(max-width: 640px)');

if (isMobile) {
  return (
    <AssessmentCompletionMobile
      score={currentDII.score}
      businessModel={businessModelId}
      topStrengths={topStrengths}
      criticalGaps={criticalGaps}
      onShare={handleShare}
      onExplore={handleExplore}
    />
  );
}
```

### 4. What-If Scenarios
Add the scenario explorer after completion:

```tsx
import { DIIWhatIfScenarios } from '@/components';

function ScenariosPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Explore Improvement Scenarios
      </h1>
      <DIIWhatIfScenarios />
    </div>
  );
}
```

## Styling Notes

All components use:
- Tailwind CSS for styling
- Framer Motion for animations
- `cn()` utility for conditional classes
- Responsive design with mobile-first approach

## Next Steps

1. **Test the demo components** to understand the flow
2. **Integrate state management** into your existing assessment logic
3. **Add the timeline navigation** to your assessment pages
4. **Implement the insight revelation** after each answer
5. **Replace your completion page** with AssessmentCompletion
6. **Add routes** for scenarios and detailed analysis

## Support

The components are designed to be drop-in replacements for your existing assessment UI. They handle all the state management and calculations internally through the Zustand store.