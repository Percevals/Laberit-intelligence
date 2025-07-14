# DII Assessment Platform - Current State
*Last Updated: 2025-01-14*

## 🚀 What's Implemented

### Core Features
- **Company Search & AI Enhancement** ✓
  - AI-powered company data retrieval (OpenAI/Anthropic)
  - Manual data entry fallback
  - Company confirmation with edit capability
  
- **Business Model Classification** ✓
  - 8 business models defined with detailed profiles
  - 2-question classification system (revenue model + operational dependency)
  - Smart classification using industry heuristics
  - Confidence scoring for classifications
  
- **8x5 Pain Discovery Matrix** ✓
  - Complete scenario matrix (8 models × 5 dimensions)
  - Type-safe scenario retrieval service
  - v2.0.0 with measurement questions (not satisfaction)
  
- **Personalized Questions** ✓
  - Dynamic adaptation based on company context
  - Measurement questions with actual metrics
  - Response options show hours/percentages/ratios
  - Context help text per business model
  
- **DII Calculation Engine** ✓
  - Formula: (TRD × AER) / (HFP × BRI × RRG)
  - Business model-specific normalization
  - Percentile calculation within model cohort
  - Maturity stage determination

### Assessment Flow
1. Company Search → 2. Confirmation → 3. Business Model Reveal → 4. Scenario Questions (TRD only) → 5. Results

## 📋 What's Planned but Not Implemented

### Missing Features
- **Full 5-Dimension Assessment**
  - Currently only TRD dimension implemented
  - Need AER, HFP, BRI, RRG questions
  - Navigation between dimension questions
  
- **Premium vs Light Toggle**
  - Infrastructure exists but no UI toggle
  - Premium would ask all 5 dimensions
  
- **Results Enhancements**
  - Dimension breakdown visualization
  - PDF export functionality
  - Historical tracking
  - Benchmarking against industry

## 🧮 Current Calculation Logic

### Business Model Detection
```
Revenue Model + Operational Dependency → Business Model
Example: "recurring_subscriptions" + "purely_digital" → SUBSCRIPTION_BASED (95% confidence)
```

### DII Score Calculation
```
1. Raw responses (1-5) → Metric values (hours, %, ratios)
2. Metric values → Base DII dimension scores (1-10)
3. Apply adjustments:
   - Business model adjustment (±0.5 to ±1)
   - Company size adjustment (±0.5)
   - Critical infrastructure penalty (-0.5 to -1)
4. Calculate DII: (TRD × AER) / (HFP × BRI × RRG)
5. Normalize by business model cohort
6. Determine percentile and maturity stage
```

### Metric Interpretation (v2.0.0)
- **TRD**: Hours until 10% revenue loss (2h=1.5, 4h=3.5, 8h=5.5, 24h=7.5, >24h=9.5)
- **AER**: Value extraction ratio (10:1=2, 5:1=4, 2:1=6, 1:1=8, <1:1=10)
- **HFP**: Failure percentage (80%=9, 60%=7, 40%=5, 20%=3, <20%=1)
- **BRI**: Blast radius percentage (80%=8.5, 60%=6.5, 40%=4.5, 20%=2.5, <20%=1)
- **RRG**: Recovery multiplier (10x=8, 5x=6, 3x=4, 2x=2, <2x=1)

## 🤔 Open Decisions

### Technical Decisions
1. **Dimension Order**: Should questions follow risk priority or formula order?
2. **Default Values**: How to handle missing dimensions intelligently?
3. **Confidence Thresholds**: When to show uncertainty in results?

### Business Decisions
1. **Free vs Premium Split**: Which features in each tier?
2. **Industry Benchmarks**: Build or buy benchmark data?
3. **Compliance Integration**: Add framework mappings (ISO, NIST)?

### UX Decisions
1. **Question Navigation**: Linear or allow jumping between dimensions?
2. **Progress Saving**: Auto-save or explicit save points?
3. **Results Sharing**: Public URLs or authenticated only?

## 🔄 Recent Changes (Last 7 Days)

### 2025-01-14
- **Measurement Questions Update (v2.0.0)**
  - Replaced satisfaction questions with quantifiable metrics
  - Added response_options with specific values
  - Implemented context_for_user help text
  - Updated ResponseInterpreter for metric-based scoring
  
- **TypeScript Fixes**
  - Fixed ResponseOption interface structure
  - Added proper type assertions for JSON data
  - Made premium_questions optional

- **DII-Specific Business Models**
  - Replaced generic models with 8 DII-specific models
  - Added industry-based classification shortcuts
  - Updated all mappings and adjustments
  - Maintained backwards compatibility

### Key Behavioral Changes
- Questions now ask for measurable values (hours, percentages)
- Responses directly map to operational metrics
- Business model context affects question wording
- DII scores based on actual metrics, not generic scales

## ⚠️ Known Issues

### Technical Debt
1. Business model mapping duplicated in 3 files
2. "DII score" text redundancy in results
3. No unit tests for ResponseInterpreter
4. Hardcoded business model to scenario ID mapping

### Bugs
1. Assessment store persists incomplete data on refresh
2. No back navigation from dimension questions
3. AI health indicator sometimes shows wrong status

## 📁 Key File Locations

### Core Logic
- Business Model Classifier: `/src/core/business-model/classifier.ts`
- DII Calculator: `/src/core/dii-engine/calculator.ts`
- Response Interpreter: `/src/services/assessment/response-interpreter.ts`
- Assessment Calculator: `/src/services/assessment/assessment-calculator.ts`

### Data
- Scenario Matrix: `/data/business-model-scenarios.json` (v2.0.0)
- Business Model Profiles: `/src/core/business-model/model-profiles.ts`

### UI Pages
- Classification: `/src/pages/ClassificationPage.tsx`
- Smart Classification: `/src/pages/SmartClassificationPage.tsx`
- Scenario Questions: `/src/pages/ScenarioQuestionsPage.tsx`
- Results: `/src/pages/EnhancedResultsPage.tsx`

### State
- Assessment Store: `/src/store/assessment-store.ts`

## 🎯 Immediate Priorities

1. **Expand to all 5 dimensions** - Currently biggest gap
2. **Fix assessment persistence** - Data loss on refresh
3. **Add dimension navigation** - Better UX for multiple questions
4. **Implement benchmarking** - Context for scores