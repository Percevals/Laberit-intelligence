# DII AI Integration Context for Claude Code

## Business Context

**Project Owner**: Percys Delgado, Modernization & Strategic Risks Business Unit Director for LATAM at Lãberit  
**Purpose**: Enhance the DII Quick Assessment PWA with AI capabilities for live executive conversations  
**Key Scenario**: "Has your organization already been compromised?"

## Lãberit Intelligence Ecosystem Overview

The GitHub repository (Percevals/Laberit-intelligence) contains THREE interconnected components:

### 1. **DII Framework** (Core Business Logic)
- **Location**: `dii_framework_v4.md`
- **Purpose**: The intellectual property - formulas, business models, calculations
- **Key Formula**: `DII = (TRD × AER) / (HFP × BRI × RRG)`
- **Business Models**: 8 models from Hybrid Commerce to Regulated Information
- **Note**: This is the HEART of the business - don't modify, just consume

### 2. **Quick Assessment PWA** (Current Focus)
- **Location**: `/quick-assessment/`
- **Stack**: React + Vite + Tailwind CSS
- **Purpose**: 30-minute digital assessment tool
- **Current State**: 3-step flow (Model → Dimensions → Results)
- **Deployment**: GitHub Pages (https://percevals.github.io/Laberit-intelligence/)

### 3. **Intelligence Dashboard Service** (Not in scope for now)
- **Purpose**: Monthly threat intelligence for clients
- **Format**: PUSH (monthly reports) + PULL (API access)
- **Note**: Separate service, not part of this AI integration

## Development Requirements for Claude Code

### PRINCIPLE 1: Provider-Agnostic Architecture
The system MUST support multiple AI providers without code changes:
- Claude (Anthropic)
- OpenAI (GPT-4)
- Azure OpenAI
- Google Vertex AI
- Local/Offline fallback

### PRINCIPLE 2: Modular Development
Start small, build incrementally:
1. **Phase 1**: Basic AI integration structure
2. **Phase 2**: Compromise Score feature
3. **Phase 3**: Dynamic insights
4. **Phase 4**: Full executive conversation support

### PRINCIPLE 3: No Breaking Changes
- The PWA must work WITHOUT AI
- AI features are ENHANCEMENTS, not dependencies
- Graceful degradation is mandatory

## Recommended File Structure

```
quick-assessment/
├── src/
│   ├── core/                    # DON'T TOUCH - Business logic
│   │   ├── dii-calculator.js   # Sacred formulas
│   │   └── business-models.js   # Business model definitions
│   │
│   ├── services/               # NEW FOLDER - Add here
│   │   ├── ai/                 # AI abstraction layer
│   │   │   ├── AIService.js    # Main AI interface
│   │   │   ├── providers/      # Provider implementations
│   │   │   │   ├── BaseProvider.js
│   │   │   │   ├── ClaudeProvider.js
│   │   │   │   ├── OpenAIProvider.js
│   │   │   │   └── OfflineProvider.js
│   │   │   └── prompts/        # Prompt templates
│   │   │       ├── compromise-detection.js
│   │   │       └── executive-insights.js
│   │   │
│   │   └── config/             # Configuration
│   │       └── ai.config.js    # AI provider settings
│   │
│   ├── features/               # NEW FOLDER - Feature modules
│   │   ├── compromise-simulator/
│   │   ├── executive-insights/
│   │   └── threat-context/
│   │
│   ├── components/             # Existing UI components
│   ├── data/                   # Existing questions
│   └── App.jsx                 # Main app
```

## AI Service Implementation Pattern

```javascript
// src/services/ai/AIService.js
// This is the CORE abstraction - provider agnostic

export class AIService {
  constructor(provider = null) {
    this.provider = provider || this.detectProvider();
  }

  // Auto-detect available provider
  detectProvider() {
    if (typeof window !== 'undefined') {
      // In browser/artifact environment
      if (window.claude?.complete) return new ClaudeProvider();
      if (window.openai) return new OpenAIProvider();
    }
    
    // Check environment variables
    if (import.meta.env.VITE_OPENAI_KEY) return new OpenAIProvider();
    if (import.meta.env.VITE_CLAUDE_KEY) return new ClaudeProvider();
    
    // Fallback to offline
    return new OfflineProvider();
  }

  // Main method - provider agnostic
  async analyzeCompromiseRisk(assessmentData) {
    const sanitized = this.sanitizeData(assessmentData);
    return await this.provider.complete({
      type: 'compromise_analysis',
      data: sanitized
    });
  }

  // Always return something useful
  async getInsightWithFallback(data, insightType) {
    try {
      return await this.provider.getInsight(data, insightType);
    } catch (error) {
      console.warn('AI unavailable, using offline intelligence');
      return this.getOfflineInsight(data, insightType);
    }
  }
}
```

## Provider Interface (All providers must implement)

```javascript
// src/services/ai/providers/BaseProvider.js

export class BaseProvider {
  async complete(request) {
    throw new Error('Provider must implement complete()');
  }

  async getInsight(data, type) {
    throw new Error('Provider must implement getInsight()');
  }

  isAvailable() {
    return false;
  }
}
```

## First Feature: Compromise Score

```javascript
// src/features/compromise-simulator/CompromiseScore.jsx

import { useAIService } from '../../services/ai/hooks';

export const CompromiseScore = ({ assessmentData }) => {
  const ai = useAIService();
  const [score, setScore] = useState(null);
  
  useEffect(() => {
    const calculateScore = async () => {
      // Works with OR without AI
      const baseScore = calculateBaseCompromiseScore(assessmentData);
      setScore(baseScore);
      
      // Enhance with AI if available
      if (ai.isAvailable()) {
        const aiScore = await ai.analyzeCompromiseRisk(assessmentData);
        setScore(aiScore);
      }
    };
    
    calculateScore();
  }, [assessmentData]);
  
  return <CompromiseIndicator score={score} />;
};
```

## Configuration Approach

```javascript
// .env.development
VITE_AI_PROVIDER=claude     # or openai, azure, google
VITE_AI_MODE=demo          # demo, api, offline
VITE_AI_KEY=your-key-here  # Only for API mode

// src/services/config/ai.config.js
export const aiConfig = {
  provider: import.meta.env.VITE_AI_PROVIDER || 'auto',
  mode: import.meta.env.VITE_AI_MODE || 'demo',
  features: {
    compromiseScore: true,
    executiveInsights: true,
    threatContext: false,  // Coming later
    peerComparison: false  // Coming later
  }
};
```

## Integration Points with Existing PWA

1. **In App.jsx** - Add AI context provider
2. **In ResultDisplay.jsx** - Show compromise score
3. **In assessment flow** - Collect behavioral data
4. **New route** - Executive conversation mode

## Development Sequence for Claude Code

### Week 1: Foundation
1. Create `/services/ai/` structure
2. Implement base AIService class
3. Add ClaudeProvider and OfflineProvider
4. Test in artifact environment

### Week 2: First Feature
1. Build CompromiseScore component
2. Integrate into ResultDisplay
3. Add visual indicators
4. Test with real assessments

### Week 3: Executive Mode
1. Create presentation view
2. Add real-time calculations
3. Build "what-if" simulator
4. Polish for live demos

## Testing Without AI Keys

```javascript
// Offline provider returns realistic but static data
class OfflineProvider extends BaseProvider {
  async analyzeCompromiseRisk(data) {
    // Use business model to return realistic score
    const baseRisk = {
      1: 0.45,  // Hybrid Commerce
      2: 0.68,  // Critical Software
      3: 0.72,  // Data Services
      4: 0.85,  // Digital Ecosystem
      5: 0.92,  // Financial Services
      // ...
    };
    
    return {
      score: baseRisk[data.businessModel] || 0.65,
      confidence: 'estimated',
      factors: this.getOfflineFactors(data)
    };
  }
}
```

## Key Success Factors

1. **Provider Independence**: Never hardcode for specific AI
2. **Graceful Degradation**: Always work without AI
3. **Business Logic Purity**: Never modify core DII calculations
4. **Executive Ready**: Optimize for live presentations
5. **Mobile First**: But desktop optimized for presentations

## Questions for Claude Code Before Starting

1. Should AI providers be runtime configurable or build-time?
2. Do we need user consent for AI analysis?
3. Should we cache AI responses for offline use?
4. What's the deployment strategy for API keys?

This architecture ensures Lãberit can:
- Switch AI providers based on cost/performance
- Demo without internet connection
- Maintain control over the business logic
- Scale AI features incrementally