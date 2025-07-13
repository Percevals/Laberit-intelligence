# DII Assessment V2 - Architecture Reference Document

## Executive Summary

The DII Assessment V2 Platform represents a paradigm shift in cybersecurity assessments: from tedious form-filling to honest conversations about real cyber risk. By leveraging AI-powered company intelligence, modular architecture, and evidence-based insights, we create an assessment experience that respects executive time while delivering actionable truth.

**Core Innovation**: Start with "What's your company?" instead of 20 classification questions.

---

## Core Principles

### 1. **Modularity**
- Each component (Framework, Intelligence, Assessment) evolves independently
- Clear interfaces between modules
- Reusable visualization components
- Pluggable AI services

### 2. **Security by Design**
- No storage of company identifying data in assessment
- Client-side calculation where possible
- API keys never exposed to client
- Audit trail for all AI interactions

### 3. **Automation**
- AI pre-fills company data (revenue, employees, location)
- Intelligent question routing based on responses
- Automated report generation
- Continuous benchmark updates

### 4. **API-First**
- Every feature exposed via API
- Clear versioning strategy
- Self-documenting endpoints
- Rate limiting and usage tracking

### 5. **Cloud-Native**
- Containerized microservices
- Horizontal scaling capability
- Multi-region deployment ready
- Serverless functions for AI calls

---

## Three-Pillar Architecture

### Pillar 1: Framework (DII Core)
**Location**: `/apps/assessment-v2/src/core/`

- **Business Logic**: DII v4.0 calculation engine
- **Business Models**: 8 distinct models based on revenue generation
- **Dimensions**: 5 key measurements (TRD, AER, HFP, BRI, RRG)  
- **Maturity Stages**: 4 levels (Frágil → Adaptativo)

### Pillar 2: Intelligence Service
**Location**: `/intelligence/`

- **Breach Evidence**: Real incidents mapped to business models
- **Historical Data**: 150 company assessments for benchmarking
- **Weekly Updates**: Fresh threat intelligence from LATAM/Spain
- **Business Translation**: Technical → Executive language

### Pillar 3: Assessment Platform
**Location**: `/apps/assessment-v2/`

- **User Interface**: React 19 with TypeScript
- **State Management**: Zustand for assessment flow
- **Visualizations**: Shared component library
- **AI Integration**: Company search and enhancement

---

## The AI-Powered Assessment Flow

### 1. Company Search (NEW - Game Changer)
```typescript
// User types company name
Input: "Bancolombia"

// AI Service returns
{
  "company_name": "Bancolombia S.A.",
  "employees": 35000,
  "revenue_usd": 4500000000,
  "headquarters": "Medellín, Colombia",
  "industry": "Financial Services",
  "public_info": {
    "description": "Largest commercial bank in Colombia",
    "recent_news": ["Digital transformation initiative 2024"],
    "tech_stack": ["AWS", "Oracle", "SAP"]
  }
}
```

### 2. Smart Classification
Instead of asking 6 classification questions, we:
1. **Ask**: Company name
2. **AI Fills**: Revenue, employees, geography, industry
3. **Confirm**: User validates or adjusts
4. **Skip**: Critical infrastructure question (only if needed)

**Time Saved**: 3-5 minutes
**Accuracy Gained**: Real data vs. estimates

### 3. Business Model Determination
With company info, we can:
- Suggest likely business model
- Show why we think this
- Let user confirm or select different

### 4. Focused Conversation (5 Key Questions)
Now we have context for meaningful questions:
- "With 35,000 employees, how often do phishing attempts succeed?"
- "Given your AWS infrastructure, how quickly could you restore operations?"
- Questions feel relevant, not generic

### 5. Enhanced Results
Results enriched with:
- Peer comparison: "vs. other Colombian banks"
- Relevant breaches: "Banco X was hit last month"
- Specific recommendations: "For Oracle systems like yours..."

---

## Technical Architecture

### Frontend Components
```
/apps/assessment-v2/src/
├── features/
│   ├── company-search/
│   │   ├── CompanySearchInput.tsx
│   │   ├── CompanyInfoCard.tsx
│   │   └── useCompanySearch.ts
│   ├── classification/
│   │   ├── SmartClassification.tsx
│   │   └── ClassificationReview.tsx
│   ├── assessment-flow/
│   │   ├── DimensionQuestions.tsx
│   │   ├── ProgressTracker.tsx
│   │   └── useAssessmentFlow.ts
│   └── results/
│       ├── ResultsDashboard.tsx
│       ├── PeerComparison.tsx
│       └── BreachEvidence.tsx
├── services/
│   ├── ai/
│   │   ├── company-intelligence.ts
│   │   ├── ai-provider.ts
│   │   └── rate-limiter.ts
│   ├── api/
│   │   ├── assessment-api.ts
│   │   └── intelligence-api.ts
│   └── storage/
│       ├── assessment-store.ts
│       └── cache-manager.ts
```

### State Management Structure
```typescript
interface AssessmentState {
  // Company Information
  companySearch: {
    query: string;
    results: CompanyInfo | null;
    loading: boolean;
    confirmed: boolean;
  };
  
  // Classification
  classification: {
    businessModel: BusinessModel | null;
    revenue: number | null;
    employees: number | null;
    geography: string | null;
    industry: string | null;
    criticalInfra: boolean | null;
    aiEnhanced: boolean; // Track if AI-filled
  };
  
  // Assessment Progress
  assessment: {
    currentStep: AssessmentStep;
    answers: DimensionAnswers;
    startTime: Date;
    completionTime: Date | null;
  };
  
  // Results
  results: {
    diiScore: Score | null;
    maturityStage: MaturityStage | null;
    peerComparison: PeerData | null;
    breachMatches: BreachCase[];
    recommendations: Recommendation[];
  };
}
```

### AI Service Architecture
```typescript
interface AICompanyService {
  // Search for company information
  searchCompany(name: string): Promise<CompanyInfo>;
  
  // Enhance partial company data
  enhanceCompanyData(partial: Partial<CompanyInfo>): Promise<CompanyInfo>;
  
  // Suggest business model based on company
  suggestBusinessModel(company: CompanyInfo): Promise<{
    model: BusinessModel;
    confidence: number;
    reasoning: string;
  }>;
  
  // Generate contextual questions
  generateContextualQuestion(
    dimension: DimensionKey,
    company: CompanyInfo
  ): Promise<string>;
}

// Implementation with multiple providers
class CompanyIntelligenceService implements AICompanyService {
  constructor(
    private providers: AIProvider[],
    private cache: CacheManager,
    private rateLimiter: RateLimiter
  ) {}
  
  async searchCompany(name: string): Promise<CompanyInfo> {
    // Check cache first
    const cached = await this.cache.get(`company:${name}`);
    if (cached) return cached;
    
    // Try providers in order (OpenAI, Claude, fallback)
    for (const provider of this.providers) {
      try {
        await this.rateLimiter.checkLimit(provider.id);
        const result = await provider.searchCompany(name);
        await this.cache.set(`company:${name}`, result);
        return result;
      } catch (error) {
        continue; // Try next provider
      }
    }
    
    throw new Error('All AI providers failed');
  }
}
```

### API Endpoints
```yaml
# Company Intelligence
POST /api/v2/company/search
  body: { query: string }
  response: { companies: CompanyInfo[] }

POST /api/v2/company/enhance
  body: { partial: Partial<CompanyInfo> }
  response: { company: CompanyInfo }

# Assessment Flow
POST /api/v2/assessment/start
  body: { companyId: string, classification: Classification }
  response: { assessmentId: string, firstQuestion: Question }

POST /api/v2/assessment/{id}/answer
  body: { questionId: string, answer: any }
  response: { nextQuestion: Question | null, progress: number }

GET /api/v2/assessment/{id}/results
  response: { 
    score: DIIScore,
    comparison: PeerComparison,
    breaches: BreachCase[],
    recommendations: Recommendation[]
  }

# Intelligence Integration
GET /api/v2/intelligence/breaches
  query: { businessModel: string, region: string, limit: number }
  response: { breaches: BreachCase[] }

GET /api/v2/intelligence/benchmarks/{businessModel}
  response: { 
    averageScore: number,
    distribution: ScoreDistribution,
    trends: TrendData
  }
```

---

## Implementation Phases

### Phase 1: Smart Classification (Weeks 1-2)
- [ ] Company search UI component
- [ ] AI service integration (OpenAI/Claude)
- [ ] Company data validation/editing UI
- [ ] Business model suggestion logic
- [ ] Cache layer for company data

### Phase 2: Contextual Assessment (Weeks 3-4)
- [ ] Dynamic question generation based on company
- [ ] Question flow with context
- [ ] Progress tracking with time estimates
- [ ] Partial save/resume functionality

### Phase 3: Intelligent Results (Weeks 5-6)
- [ ] Peer comparison with similar companies
- [ ] Breach matching by model + size + region
- [ ] AI-generated executive summary
- [ ] Contextual recommendations

### Phase 4: API & Integration (Weeks 7-8)
- [ ] RESTful API implementation
- [ ] API authentication & rate limiting
- [ ] Webhook support for async operations
- [ ] Partner integration documentation

---

## Security Considerations

### Data Privacy
- Company search data cached but not permanently stored
- Assessment results anonymized for benchmarking
- No PII in intelligence matching
- Client-side encryption option

### AI Service Security
- API keys stored in secure vault
- Requests proxied through backend
- Rate limiting per user/IP
- Audit log of all AI calls

### Assessment Integrity
- Session tokens for assessment continuity
- Answer validation to prevent gaming
- Time tracking for realistic assessments
- Honeypot questions for bot detection

---

## Performance Targets

### User Experience
- Company search: <2 seconds
- Page transitions: <300ms
- Question load: <100ms
- Full assessment: <15 minutes

### Technical Metrics
- API response time: <200ms (p95)
- AI service fallback: <5 seconds
- Cache hit rate: >80%
- Concurrent users: 1000+

---

## Integration Points

### With Assessment Light
- Shared visualization components
- Common business model definitions
- Unified benchmark data
- Progressive enhancement path

### With Intelligence Service
- Real-time breach feed
- Weekly benchmark updates
- Attack pattern matching
- Cost estimation models

### With External Services
- Company databases (Crunchbase, etc.)
- Threat intelligence feeds
- AI providers (OpenAI, Claude)
- Analytics platforms

---

## Success Metrics

### Engagement
- Time to complete: <15 minutes (target: 12)
- Completion rate: >80%
- AI pre-fill accuracy: >90%
- User satisfaction: >4.5/5

### Business Value
- Qualified leads generated
- Conversion to premium assessment
- Recommendations implemented
- Breaches prevented (tracked)

---

## Development Guidelines

### Code Organization
- Feature-based folders
- Shared components library
- Type safety everywhere
- Test coverage >80%

### State Management
- Zustand for assessment flow
- React Query for API calls
- Local storage for progress
- Session storage for sensitive data

### AI Integration
- Provider abstraction layer
- Graceful fallbacks
- Cost tracking per call
- Response caching strategy

### Deployment
- Docker containers
- Kubernetes orchestration
- GitHub Actions CI/CD
- Blue-green deployments

---

## Future Enhancements

### Phase 5+
- Voice interface for assessment
- Real-time collaboration mode
- Mobile app development
- White-label platform
- Compliance module integration
- Automated penetration test ordering
- Insurance premium estimation
- Board-ready presentations

---

## Conclusion

The DII Assessment V2 Platform revolutionizes cybersecurity assessments by:
1. **Respecting executive time** with AI-powered pre-fill
2. **Providing contextual questions** based on real company data
3. **Showing relevant evidence** from actual breaches
4. **Delivering actionable insights** in business language

By combining smart classification, contextual assessment, and evidence-based recommendations, we transform a tedious compliance exercise into a valuable business conversation about real cyber risk.

---

**Remember**: Every feature should answer "Does this make the assessment faster, more accurate, or more actionable?" If not, it doesn't belong in V2.