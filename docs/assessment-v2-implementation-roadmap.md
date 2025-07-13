# DII Assessment V2 - Implementation Roadmap

## Quick Start: Next 48 Hours

### Immediate Actions
1. **Add AI Company Search Component**
   ```typescript
   // /src/features/company-search/CompanySearchInput.tsx
   - Search input with debounce
   - Loading states
   - Result cards with company info
   - "Not found? Enter manually" option
   ```

2. **Create AI Service Abstraction**
   ```typescript
   // /src/services/ai/ai-provider.ts
   interface AIProvider {
     searchCompany(query: string): Promise<CompanyInfo>;
     isAvailable(): Promise<boolean>;
   }
   ```

3. **Update Assessment State**
   - Add `companySearch` slice to Zustand store
   - Track AI-enhanced vs manual entry
   - Cache company data in session

4. **Modify Classification Flow**
   - Skip questions that AI pre-filled
   - Show "Confirm this information" step
   - Allow manual override

---

## Week 1-2: Smart Classification

### Day 1-3: Company Search UI
- [ ] Search input component with autocomplete
- [ ] Company result cards with key info display
- [ ] Manual entry form as fallback
- [ ] Loading and error states

### Day 4-6: AI Integration
- [ ] OpenAI API integration
- [ ] Response parsing and validation
- [ ] Rate limiting implementation
- [ ] Cost tracking setup

### Day 7-10: Classification Flow
- [ ] Smart form that skips pre-filled fields
- [ ] Business model suggestion based on company
- [ ] Confirmation/edit screen
- [ ] Progress indicator updates

### Day 11-14: Testing & Polish
- [ ] Error handling for AI failures
- [ ] Cache implementation
- [ ] Analytics tracking
- [ ] Performance optimization

---

## Week 3-4: Assessment Enhancement

### Core Question Implementation
Based on DII v4.0 structure - 5 key questions:

1. **TRD Question** (Time to Revenue Degradation)
   ```
   "If your main systems went down today, how long before 
   ${company.name} starts losing significant revenue?"
   
   Options:
   - Less than 1 hour (Score: 1)
   - 1-4 hours (Score: 3)
   - 4-24 hours (Score: 5)
   - 1-3 days (Score: 7)
   - More than 3 days (Score: 9)
   ```

2. **AER Question** (Attack Economics)
   ```
   "What percentage of ${company.revenue} is invested in 
   cybersecurity annually?"
   
   Dynamic calculation showing:
   - Industry average for ${company.industry}
   - Recommended for ${company.size}
   ```

3. **HFP Question** (Human Failure)
   ```
   "In the last year, how many security incidents at 
   ${company.name} started with human error?"
   
   Context: "Companies like yours average 3-5 per year"
   ```

4. **BRI Question** (Blast Radius)
   ```
   "If ransomware hit your ${company.primary_system}, 
   what percentage of operations would stop?"
   
   Visual selector with business impact preview
   ```

5. **RRG Question** (Recovery Gap)
   ```
   "Your recovery plan promises ${X} hours. When did 
   you last test it with real conditions?"
   
   Follow-up: "How long did recovery actually take?"
   ```

### Contextual Enhancements
- [ ] Questions reference company specifics
- [ ] Industry benchmarks shown inline
- [ ] Recent breaches for context
- [ ] Time estimate per question

---

## Week 5-6: Intelligent Results

### Results Dashboard Components
1. **Executive Summary**
   - AI-generated 3-paragraph summary
   - Specific to ${company.name} and ${businessModel}
   - Focus on business impact, not technical details

2. **Peer Comparison**
   ```typescript
   // Use historical data from 150 assessments
   const peers = historicalData.filter(c => 
     c.businessModel === company.businessModel &&
     c.size === company.sizeCategory &&
     c.region === company.region
   );
   ```

3. **Breach Evidence**
   - "3 ${company.industry} companies hit this month"
   - Actual costs and downtime
   - "Would your score have prevented this?"

4. **Smart Recommendations**
   - Prioritized by ROI
   - Specific to company size/budget
   - "Quick wins" vs "Strategic investments"

### Implementation Tasks
- [ ] Results page layout with all components
- [ ] Peer comparison algorithm
- [ ] Breach matching logic
- [ ] AI summary generation
- [ ] Export functionality (PDF/PPT)

---

## Week 7-8: API & Production

### API Development
- [ ] FastAPI backend setup
- [ ] Endpoint implementation
- [ ] Authentication system
- [ ] Rate limiting
- [ ] API documentation

### Production Readiness
- [ ] Environment configuration
- [ ] Secrets management
- [ ] Error tracking (Sentry)
- [ ] Analytics (Mixpanel/GA)
- [ ] Performance monitoring

### Deployment
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Staging environment
- [ ] Production deployment
- [ ] Monitoring setup

---

## Technical Decisions Needed

### 1. AI Provider Strategy
**Option A**: OpenAI Primary
- Pros: Best for company data, wide knowledge
- Cons: Cost, potential downtime
- Implementation: API key in env vars

**Option B**: Multi-Provider
- Primary: OpenAI
- Fallback: Claude/Gemini
- Local: Basic fuzzy search

**Recommendation**: Start with Option A, prepare for B

### 2. Company Data Source
**Option A**: AI-Only
- Simple implementation
- Relies on training data
- May have gaps

**Option B**: AI + APIs
- Crunchbase/LinkedIn APIs
- Better accuracy
- More complex, costly

**Recommendation**: Start with A, enhance with B later

### 3. State Management
**Already Decided**: Zustand
- Perfect for assessment flow
- Easy AI state integration
- Persist/resume capable

### 4. Caching Strategy
**Client-Side**:
- SessionStorage for assessment
- LocalStorage for company cache
- 24-hour expiry

**Server-Side**:
- Redis for API responses
- 7-day company data cache
- Invalidation on updates

---

## MVP Definition (2 Weeks)

### Must Have
- [x] Business model classification (DONE)
- [ ] Company search with AI
- [ ] 5 dimension questions
- [x] DII calculation (DONE)
- [x] Basic results display (DONE)
- [ ] One-click assessment start

### Should Have
- [ ] Peer comparison
- [ ] Spanish/English support
- [ ] Progress save/resume
- [ ] Basic recommendations

### Nice to Have
- [ ] Breach evidence display
- [ ] AI-generated summary
- [ ] Export to PDF
- [ ] Email results

### Won't Have (v1)
- Premium features
- Team collaboration
- API access
- White labeling

---

## Risk Mitigation

### Technical Risks
1. **AI Service Downtime**
   - Mitigation: Fallback to manual entry
   - Implementation: Try/catch with graceful degradation

2. **Rate Limiting**
   - Mitigation: Client-side caching
   - Implementation: Cache company searches 24h

3. **Cost Overrun**
   - Mitigation: Daily spend limits
   - Implementation: Usage tracking dashboard

### Business Risks
1. **Data Accuracy**
   - Mitigation: User confirmation step
   - Implementation: "Is this correct?" screen

2. **Completion Rate**
   - Mitigation: Show progress, save state
   - Implementation: localStorage persistence

---

## Success Criteria

### Week 2 Checkpoint
- [ ] Company search working with real AI
- [ ] Classification completes in <2 minutes
- [ ] Assessment completes in <12 minutes
- [ ] Results show meaningful insights

### Launch Criteria
- [ ] 95% completion rate in testing
- [ ] <15 minute average time
- [ ] AI pre-fill >80% accurate
- [ ] Positive user feedback

---

## Development Checklist

### Today
- [ ] Create company search UI component
- [ ] Set up OpenAI API integration
- [ ] Add company state to Zustand
- [ ] Update classification flow

### This Week
- [ ] Complete smart classification
- [ ] Test with 10 real companies
- [ ] Implement caching layer
- [ ] Add error handling

### Next Week
- [ ] Build contextual questions
- [ ] Integrate peer comparison
- [ ] Create results dashboard
- [ ] Add export functionality

---

## Code Examples to Start

### Company Search Component
```typescript
// /src/features/company-search/CompanySearchInput.tsx
export function CompanySearchInput() {
  const { search, results, loading } = useCompanySearch();
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useMemo(
    () => debounce((q: string) => search(q), 500),
    [search]
  );
  
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Ingrese el nombre de su empresa..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debouncedSearch(e.target.value);
        }}
        className="w-full px-4 py-3 ..."
      />
      {loading && <LoadingSpinner />}
      {results && <CompanyResults companies={results} />}
    </div>
  );
}
```

### AI Service
```typescript
// /src/services/ai/openai-provider.ts
export class OpenAIProvider implements AIProvider {
  async searchCompany(query: string): Promise<CompanyInfo> {
    const prompt = `Find company information for "${query}".
    Return: name, employees, revenue (USD), headquarters, 
    industry, description. Format as JSON.`;
    
    const response = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });
    
    return this.parseCompanyInfo(response);
  }
}
```

---

## Remember

The goal is to make assessment so easy that executives actually complete it. Every feature should reduce friction, not add it. The AI company search is our secret weapon - it shows we respect their time from the very first interaction.