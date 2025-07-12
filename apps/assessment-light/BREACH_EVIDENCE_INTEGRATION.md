# Breach Evidence Integration Guide

## Overview

The breach evidence feature integrates real-world cyber incident data into the DII assessment app, providing users with contextual risk intelligence based on similar breaches that affected companies like theirs.

## Components

### 1. BreachEvidenceService (`src/services/intelligence/BreachEvidenceService.ts`)
- Singleton service that loads and queries breach data
- Caches data for performance
- Provides methods to find similar breaches based on:
  - Business model
  - Company size
  - Region
  - DII score

### 2. BreachEvidence Component (`src/components/intelligence/BreachEvidence.tsx`)
- React component with 3 display modes:
  - **inline**: Compact warning box
  - **summary**: Medium card with top breaches
  - **detailed**: Full analysis with all breach details
- Shows relevant metrics:
  - Financial losses
  - Downtime hours
  - Attack vectors
  - DII dimension impacts

### 3. Integration Points

#### In Assessment Results
The breach evidence is automatically shown after DII calculation:

```tsx
// In SimpleResultDisplay.tsx
<BreachEvidence
  businessModel={businessModelId}
  diiScore={result.diiScore}
  mode="summary"
/>
```

#### Standalone Page
A dedicated page for exploring breach insights:

```tsx
// Access at: /breach-insights
import { BreachInsights } from './pages/BreachInsights';
```

## Breach Data Structure

Breaches are stored in `public/intelligence/breach-evidence/catalog.json`:

```json
{
  "breach_id": "BR-2024-LATAM-001",
  "victim_profile": {
    "size_employees": "1000-5000",
    "region": "Latin America",
    "sector": "Logistics"
  },
  "business_model_match": {
    "primary_model": 3,
    "confidence": "high"
  },
  "attack": {
    "vector": "Ransomware",
    "method": "Phishing email"
  },
  "impact": {
    "financial_loss_usd": 2500000,
    "operational_impact": {
      "downtime_hours": 168
    }
  }
}
```

## Usage Examples

### Basic Integration
```tsx
import { BreachEvidence } from './components/intelligence/BreachEvidence';

// Show inline warning
<BreachEvidence 
  businessModel={5} 
  mode="inline" 
/>

// Show detailed analysis
<BreachEvidence 
  businessModel={5}
  companySize="1000-5000"
  region="Colombia"
  diiScore={3.5}
  mode="detailed"
/>
```

### Programmatic Access
```tsx
import { breachEvidenceService } from './services/intelligence/BreachEvidenceService';

// Get breaches for a business model
const breaches = await breachEvidenceService.getBreachesByModel(5);

// Find similar breaches
const similar = await breachEvidenceService.findSimilarBreaches({
  businessModel: 5,
  companySize: "1000-5000",
  region: "Colombia",
  diiScore: 3.5
});
```

## Adding New Breach Cases

1. Edit `public/intelligence/breach-evidence/catalog.json`
2. Follow the schema in `intelligence/breach-evidence/schemas/breach-case.schema.json`
3. Include all required fields:
   - breach_id (format: BR-YYYY-REGION-NNN)
   - victim_profile
   - business_model_match
   - attack details
   - impact metrics
   - dii_dimensions_impact

## Benefits

1. **Context**: Users see real incidents affecting similar companies
2. **Risk Awareness**: Understand potential financial and operational impacts
3. **Evidence-Based**: Decisions backed by actual breach data
4. **Actionable**: Learn from others' security failures

## Future Enhancements

1. **Weekly Updates**: Automate breach catalog updates from intelligence feeds
2. **AI Analysis**: Use Claude to analyze breach patterns and generate insights
3. **Predictive Risk**: Calculate probability of similar breaches
4. **Industry Benchmarks**: Compare DII scores with breach victims
5. **Threat Trends**: Show emerging attack patterns for each business model