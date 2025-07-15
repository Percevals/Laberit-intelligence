# Company Database Enrichment Strategy - Research Request

## Context
We're building a DII (Digital Immunity Index) Assessment Platform that needs to classify companies into 8 specific business models for cybersecurity risk assessment. We have a working PostgreSQL database with the following structure:

### Current Database Schema
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    domain VARCHAR(255) UNIQUE,
    industry_traditional VARCHAR(255) NOT NULL,
    dii_business_model dii_business_model NOT NULL,
    confidence_score DECIMAL(3,2),
    classification_reasoning TEXT,
    headquarters VARCHAR(255),
    country VARCHAR(100),
    region VARCHAR(50) NOT NULL,
    employees INTEGER,
    revenue BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### DII Business Models (8 Types)
1. **COMERCIO_HIBRIDO** - Hybrid retail/commerce operations
2. **SOFTWARE_CRITICO** - Critical software/SaaS platforms
3. **SERVICIOS_DATOS** - Data services and analytics
4. **ECOSISTEMA_DIGITAL** - Digital ecosystems/marketplaces
5. **SERVICIOS_FINANCIEROS** - Financial services
6. **INFRAESTRUCTURA_HEREDADA** - Legacy infrastructure
7. **CADENA_SUMINISTRO** - Supply chain operations
8. **INFORMACION_REGULADA** - Regulated information/healthcare

### Current Challenge
- Our AI-powered search (using OpenAI/Mistral) only recognizes well-known companies
- We need to populate our database with companies, especially from LATAM region
- Each company needs accurate business model classification
- We want to enable users to find any company, not just Fortune 500

## Research Questions

### 1. Data Sources Strategy
Please research and recommend the best approach for obtaining company data:

**A) Public Data Sources**
- Which public APIs or datasets provide company information (name, industry, size, location)?
- Consider: OpenCorporates, Crunchbase, LinkedIn, government registries
- What are the limitations (rate limits, coverage, costs)?

**B) Regional Focus - LATAM**
- What specific sources exist for Latin American companies?
- Government business registries by country?
- Regional business databases?

**C) Data Quality & Coverage**
- How to ensure data completeness for our needs?
- Strategies for handling missing data fields?

### 2. Business Model Classification at Scale

**A) Automated Classification Approaches**
- How can we automatically classify companies into our 8 DII business models?
- What signals/data points are most reliable (industry codes, descriptions, websites)?
- Should we use ML models, rule-based systems, or hybrid approaches?

**B) Confidence Scoring**
- How to calculate confidence scores for automated classifications?
- When should human review be triggered?

**C) Classification Data Points**
Consider using:
- Industry codes (NAICS, SIC, ISIC)
- Company descriptions
- Website content analysis
- Revenue model indicators
- Technology stack (for software companies)

### 3. Implementation Architecture

**A) Data Pipeline Design**
- Batch processing vs real-time enrichment?
- How to handle rate limits and API quotas?
- Caching and update strategies?

**B) Hybrid Search Architecture**
```
User Query → Local Database (fast)
          ↓ (if not found)
          → External APIs (enrichment)
          ↓
          → AI Classification
          ↓
          → Store in Database
```

**C) Progressive Enhancement**
- Start with basic company info
- Gradually enrich with more data
- Update classifications over time

### 4. Specific Implementation Questions

1. **Initial Data Load**
   - Should we pre-populate with common companies?
   - Focus on specific industries/regions first?
   - How many companies for MVP?

2. **Real-time Enrichment**
   - When user searches for unknown company:
     * Search external sources?
     * Auto-classify and store?
     * Request user input?

3. **Data Freshness**
   - How often to update company information?
   - Track changes in business models?
   - Handle mergers/acquisitions?

4. **Legal/Compliance**
   - Data usage rights for different sources?
   - GDPR/privacy considerations?
   - Terms of service for APIs?

### 5. Cost-Benefit Analysis

Please provide recommendations considering:
- Free vs paid data sources
- Build vs buy decisions
- Open source alternatives
- Most cost-effective approach for a startup

### 6. Technical Implementation Path

Recommend a phased approach:
1. **Phase 1**: Basic implementation (MVP)
2. **Phase 2**: Enhanced features
3. **Phase 3**: Advanced capabilities

## Deliverables Requested

1. **Recommended Data Sources Matrix**
   - Source name, coverage, cost, API availability, data quality

2. **Classification Strategy**
   - Recommended approach for auto-classification
   - Confidence scoring methodology

3. **Implementation Roadmap**
   - Prioritized list of data sources to integrate
   - Architecture recommendations
   - Estimated effort/complexity

4. **Sample Implementation**
   - Pseudo-code or architecture diagram
   - API integration examples
   - Classification algorithm outline

## Additional Context

- **Tech Stack**: PostgreSQL, Node.js/TypeScript, React
- **Current Scale**: Startup/MVP phase
- **Target Users**: LATAM businesses needing cybersecurity assessments
- **Budget**: Limited (prefer free/low-cost solutions initially)
- **Timeline**: Need working solution in 2-4 weeks

Please provide practical, actionable recommendations that we can implement quickly while maintaining room for future growth.