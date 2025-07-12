# AI Service for DII Quick Assessment

This AI service provides intelligent analysis capabilities for the Digital Immunity Index (DII) Quick Assessment tool. It's designed to work with multiple AI providers while gracefully degrading to offline mode when needed.

## Key Features

- **Provider Agnostic**: Supports Claude, OpenAI, Azure, Google, and offline modes
- **No API Keys Required**: Works in demo mode without any configuration
- **Graceful Degradation**: Falls back to intelligent offline analysis
- **React Integration**: Easy-to-use hooks for React components
- **Executive Ready**: Optimized for live presentations

## Quick Start

### 1. Basic Usage (Demo Mode)

```javascript
import { useCompromiseAnalysis } from '@/services/ai';

function MyComponent({ assessmentData }) {
  const { analysis, isAnalyzing } = useCompromiseAnalysis(assessmentData);
  
  if (isAnalyzing) return <div>Analyzing...</div>;
  
  return (
    <div>
      Compromise Score: {analysis?.compromiseScore || 'N/A'}
    </div>
  );
}
```

### 2. Available Hooks

#### `useAIService()`
Access the core AI service instance.

```javascript
const { aiService, isAvailable, provider } = useAIService();
```

#### `useCompromiseAnalysis(assessmentData)`
Analyze compromise probability based on assessment data.

```javascript
const { 
  analysis,      // { compromiseScore, confidence, indicators, ... }
  isAnalyzing,   // Loading state
  error,         // Error message if any
  reanalyze      // Function to trigger re-analysis
} = useCompromiseAnalysis(assessmentData);
```

#### `useExecutiveInsights(assessmentData)`
Generate executive-ready insights.

```javascript
const {
  insights,       // { executiveSummary, insights[], urgency }
  isGenerating,
  generateInsights
} = useExecutiveInsights(assessmentData);
```

#### `useThreatContext(businessModel, region)`
Get relevant threat intelligence.

```javascript
const {
  threatContext,  // { threatActors, recentIncidents, emergingVectors }
  isLoading
} = useThreatContext(businessModel, 'LATAM');
```

#### `useScenarioSimulation(baseAssessment)`
Simulate "what-if" scenarios.

```javascript
const {
  simulation,
  simulateScenario
} = useScenarioSimulation(baseAssessment);

// Simulate improvements
simulateScenario({
  trd: 'major_improvement',
  hfp: 'improvement'
});
```

## Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# Provider selection
VITE_AI_PROVIDER=auto    # auto | claude | openai | offline

# Mode
VITE_AI_MODE=demo        # demo | api | offline

# API Keys (only for api mode)
VITE_CLAUDE_KEY=sk-...   # Your Claude API key
VITE_OPENAI_KEY=sk-...   # Your OpenAI API key
```

### Programmatic Configuration

```javascript
import { aiConfig } from '@/services/ai';

// Check current configuration
console.log(aiConfig.provider);  // 'auto'
console.log(aiConfig.mode);      // 'demo'

// Feature flags
if (aiConfig.features.compromiseScore) {
  // Show compromise analysis
}
```

## Provider Details

### Claude Provider
- Best for: Executive conversations, nuanced analysis
- Requires: Claude API key (in api mode)
- Supports: Artifact environment (no key needed)

### Offline Provider
- Best for: Demos, fallback, no internet
- Requires: Nothing
- Features: Realistic responses based on DII logic

## Architecture

```
services/ai/
├── AIService.js          # Core service class
├── providers/
│   ├── BaseProvider.js   # Abstract base class
│   ├── ClaudeProvider.js # Claude implementation
│   └── OfflineProvider.js # Offline fallback
├── hooks.js              # React hooks
└── index.js              # Module exports
```

## Error Handling

The service automatically handles errors with fallback:

```javascript
try {
  // Try primary provider
  result = await provider.complete(request);
} catch (error) {
  // Fallback to offline
  result = await offlineProvider.complete(request);
}
```

## Security

- **Data Sanitization**: Removes PII before sending to AI
- **No Logging**: API requests are never logged in production
- **Local Processing**: Offline mode processes everything locally

## Performance

- **Response Caching**: Identical requests are cached
- **Batch Processing**: Multiple requests are batched when possible
- **Lazy Loading**: Providers are loaded only when needed

## Testing

```javascript
// Force offline mode for testing
import { resetAIService } from '@/services/ai';

beforeEach(() => {
  resetAIService();
  process.env.VITE_AI_MODE = 'offline';
});
```

## Extending

### Adding a New Provider

1. Create provider class extending `BaseProvider`:

```javascript
export class MyProvider extends BaseProvider {
  async complete(request) {
    // Implementation
  }
  
  isAvailable() {
    return true;
  }
}
```

2. Update `AIService.detectProvider()` to include your provider.

### Adding New Analysis Types

1. Add method to `AIService`:

```javascript
async analyzeNewType(data) {
  return this.provider.complete({
    type: 'new_analysis_type',
    data: this.sanitizeData(data)
  });
}
```

2. Create corresponding React hook.

## Troubleshooting

### "AI Service not available"
- Check environment variables
- Verify API keys (if in api mode)
- Check browser console for errors

### "Falling back to offline mode"
- This is normal when API is unavailable
- Offline mode provides good approximations

### Performance issues
- Enable caching in `ai.config.js`
- Use batch requests for multiple analyses
- Consider offline mode for demos