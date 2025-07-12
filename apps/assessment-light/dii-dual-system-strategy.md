# DII Assessment Platform - Dual System Strategy
## Technical Reference Document

### Executive Summary

This document outlines the evolution strategy from a single Quick Assessment application to a dual-system platform offering both Light (quick, free/freemium) and Premium (comprehensive, paid) assessment services. The architecture maintains our core principles of modularity, security, and AI integration while enabling clear value differentiation.

---

## 1. System Overview

### 1.1 Current State
- Single Quick Assessment application (30-minute evaluation)
- Basic AI integration for calculations and recommendations
- Static deployment on GitHub Pages
- DII v4.0 framework implementation

### 1.2 Target State
Two distinct applications sharing core components:
- **DII Light**: Enhanced Quick Assessment (30 min, free/freemium)
- **DII Premium**: Comprehensive Consultancy Platform (2-5 days, paid)

### 1.3 Key Principles
```yaml
Architecture:
  - Modular: Reusable packages and components
  - Open: API-first, standard protocols
  - Modern: Cloud-native, containerizable
  - Secure: DevSecOps integrated from design

AI Integration:
  - Native: AI features in both tiers
  - Differentiated: Basic vs Advanced capabilities
  - Scalable: Gateway pattern for rate limiting
  - Cost-effective: Caching and optimization
```

---

## 2. Technical Architecture

### 2.1 Monorepo Structure
```
dii-assessment-platform/
├── packages/                    # Shared packages (npm/yarn workspace)
│   ├── @dii/core               # Core DII calculations & business logic
│   │   ├── calculations/       # DII formula implementation
│   │   ├── models/            # 8 business models
│   │   └── constants/         # Shared constants
│   │
│   ├── @dii/types              # TypeScript types & interfaces
│   │   ├── assessment.types.ts
│   │   ├── business-model.types.ts
│   │   └── api.types.ts
│   │
│   ├── @dii/ui-kit             # Shared UI components
│   │   ├── components/        # React components
│   │   ├── hooks/            # Shared hooks
│   │   └── styles/           # Tailwind presets
│   │
│   └── @dii/ai-utils           # AI integration utilities
│       ├── oracle/           # Oracle base implementation
│       ├── prompts/          # Prompt templates
│       └── gateway/          # AI Gateway client
│
├── apps/
│   ├── assessment-light/        # Quick Assessment Application
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── assessment-premium/      # Consultancy Platform
│       ├── src/
│       ├── public/
│       └── package.json
│
├── services/                    # Backend microservices (Premium only)
│   ├── api-gateway/            # Main API entry point
│   ├── calculation-service/    # DII calculation engine
│   ├── intelligence-service/   # Weekly intelligence integration
│   └── ai-service/            # Claude API integration
│
├── infrastructure/             # Infrastructure as Code
│   ├── terraform/             # Cloud resources
│   ├── kubernetes/            # K8s manifests
│   └── docker/               # Dockerfiles
│
└── tools/                      # Development tools
    ├── scripts/               # Build & deployment scripts
    └── config/               # Shared configurations
```

### 2.2 Component Architecture

#### Shared Components (`packages/`)
```typescript
// @dii/core - Business logic shared by both apps
export interface DIICalculator {
  calculateScore(inputs: AssessmentInputs): DIIScore;
  getBusinessModel(id: number): BusinessModel;
  getBenchmarks(model: BusinessModel, country: string): Benchmarks;
}

// @dii/types - Type definitions
export interface AssessmentInputs {
  businessModel: BusinessModelType;
  dimensions: {
    aer: AttackEconomicsRatio;
    hfp: HumanFailureProbability;
    bri: BlastRadiusIndex;
    trd: TimeToRevenueDegradation;
    rrg: RecoveryRealityGap;
  };
}

// @dii/ui-kit - Reusable UI components
export const SharedComponents = {
  DIIScoreDisplay,
  BusinessModelSelector,
  DimensionInput,
  ResultsVisualization,
  ExportButton
};
```

#### App-Specific Features

**Light Assessment Features:**
- 5-question flow
- Basic Oracle (3 interactions max)
- PDF/Image export
- Anonymous usage option
- Static deployment ready

**Premium Platform Features:**
- Multi-step assessment wizard
- Advanced Oracle (unlimited)
- Project management
- Team collaboration
- API integrations
- Audit trails

---

## 3. AI Integration Strategy

### 3.1 Differentiated AI Features

#### Light Tier - Basic AI
```typescript
interface LightAIConfig {
  oracle: {
    enabled: true;
    maxInteractions: 3;
    responseType: 'template-based';
    personalization: 'by-business-model';
    learning: false;
    history: 'session-only';
  };
  
  insights: {
    type: 'pre-calculated';
    customization: 'minimal';
    recommendations: 3; // Fixed number
  };
}
```

#### Premium Tier - Advanced AI
```typescript
interface PremiumAIConfig {
  oracle: {
    enabled: true;
    maxInteractions: Infinity;
    responseType: 'dynamic';
    personalization: 'company-specific';
    learning: true;
    history: 'persistent';
    features: [
      'threat-analysis',
      'what-if-scenarios',
      'custom-simulations',
      'trend-predictions'
    ];
  };
  
  insights: {
    type: 'ai-generated';
    customization: 'full';
    recommendations: 'dynamic'; // Based on context
    integration: 'weekly-intelligence';
  };
}
```

### 3.2 AI Gateway Architecture
```yaml
AI Gateway Service:
  Purpose: Centralize AI interactions and manage costs
  
  Features:
    - Rate limiting by tier (Light: 10/day, Premium: unlimited)
    - Response caching for common queries
    - Prompt optimization and A/B testing
    - Cost tracking and budgeting
    - Fallback mechanisms
    - Audit logging
    
  Implementation:
    - Express/Fastify server
    - Redis for caching
    - PostgreSQL for audit logs
    - Prometheus metrics
```

---

## 4. Data Architecture

### 4.1 Data Strategy by Tier

#### Light Assessment
```yaml
Storage:
  - Session-based (no persistence by default)
  - Optional email for report delivery
  - Anonymous analytics (aggregated)
  
Privacy:
  - No PII collection required
  - Cookie-less tracking
  - GDPR compliant by design
```

#### Premium Platform
```yaml
Storage:
  - PostgreSQL: Relational data
  - TimescaleDB: Time-series metrics
  - S3/MinIO: Document storage
  - Redis: Session & cache
  
Features:
  - Full audit trail
  - Data retention policies
  - Backup & recovery
  - Multi-tenant isolation
```

### 4.2 Database Schema Strategy
```sql
-- Shared schemas (read-only for Light)
CREATE SCHEMA dii_core;
CREATE SCHEMA dii_benchmarks;
CREATE SCHEMA dii_intelligence;

-- Light-specific (minimal)
CREATE SCHEMA light_analytics;

-- Premium-specific
CREATE SCHEMA premium_assessments;
CREATE SCHEMA premium_projects;
CREATE SCHEMA premium_organizations;
CREATE SCHEMA premium_users;
```

---

## 5. Security Architecture (DevSecOps)

### 5.1 Security by Design
```yaml
Principles:
  - Zero Trust Architecture
  - Least Privilege Access
  - Defense in Depth
  - Continuous Security Testing
  
Implementation:
  Authentication:
    Light: Optional (anonymous allowed)
    Premium: Required (OAuth 2.0/OIDC)
    
  Authorization:
    Light: Simple token-based
    Premium: Full RBAC with teams
    
  Encryption:
    At Rest: AES-256
    In Transit: TLS 1.3
    Secrets: HashiCorp Vault / AWS KMS
```

### 5.2 CI/CD Security Pipeline
```yaml
stages:
  - static-analysis:
      - ESLint security rules
      - Semgrep SAST scan
      - License compliance
      
  - dependency-scan:
      - npm audit
      - Snyk vulnerability scan
      - OWASP dependency check
      
  - build:
      - Unit tests (min 80% coverage)
      - Integration tests
      - Container scan
      
  - dynamic-analysis:
      - OWASP ZAP scan
      - API security tests
      - Performance tests
      
  - deployment:
      - Environment validation
      - Health checks
      - Rollback capability
```

---

## 6. Deployment Strategy

### 6.1 Light Assessment
```yaml
Deployment:
  - Static site (GitHub Pages compatible)
  - CDN distribution (CloudFlare)
  - No backend required
  - Serverless functions for PDF generation
  
Infrastructure:
  - Cost: ~$0-50/month
  - Complexity: Low
  - Maintenance: Minimal
```

### 6.2 Premium Platform
```yaml
Deployment:
  - Kubernetes cluster (EKS/GKE)
  - Multi-region support
  - Auto-scaling enabled
  - Blue-green deployments
  
Infrastructure:
  - Cost: ~$500-2000/month
  - Complexity: Medium-High
  - Maintenance: Managed services preferred
```

---

## 7. Development Workflow

### 7.1 Local Development
```bash
# Root package.json scripts
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:light": "turbo run dev --filter=assessment-light",
    "dev:premium": "turbo run dev --filter=assessment-premium",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  }
}
```

### 7.2 Branch Strategy
```yaml
Branches:
  main: Production-ready code
  develop: Integration branch
  feature/*: New features
  fix/*: Bug fixes
  release/*: Release preparation
  
Protected Branches:
  - main (requires PR + 2 approvals)
  - develop (requires PR + 1 approval)
```

---

## 8. Migration Strategy

### 8.1 Phase 1: Preparation (Week 1-2)
- [ ] Set up monorepo structure
- [ ] Extract shared components to packages
- [ ] Create @dii/core package
- [ ] Set up CI/CD pipeline

### 8.2 Phase 2: Light Enhancement (Week 3-4)
- [ ] Migrate current app to monorepo
- [ ] Implement limited Oracle
- [ ] Add new export options
- [ ] Deploy and test

### 8.3 Phase 3: Premium Development (Week 5-8)
- [ ] Create Premium app structure
- [ ] Implement advanced features
- [ ] Set up backend services
- [ ] Integration testing

### 8.4 Phase 4: Launch (Week 9-10)
- [ ] User acceptance testing
- [ ] Performance optimization
- [ ] Documentation
- [ ] Go-live

---

## 9. Success Metrics

### 9.1 Technical KPIs
```yaml
Light Assessment:
  - Page Load Time: <2s
  - Time to Complete: <30min
  - Conversion Rate: >40%
  - Error Rate: <0.1%
  
Premium Platform:
  - Availability: 99.9%
  - API Response Time: <500ms
  - User Satisfaction: >4.5/5
  - Feature Adoption: >60%
```

### 9.2 Business KPIs
```yaml
Conversion Metrics:
  - Light to Premium: >5%
  - Premium Retention: >80%
  - Monthly Active Users: >1000
  - Revenue per User: Track trend
```

---

## 10. Technical Decisions Log

### 10.1 Decided
- Monorepo approach using Turborepo/Nx
- TypeScript for type safety
- React for both applications
- Tailwind CSS for styling
- PostgreSQL for Premium data
- Claude API for AI features

### 10.2 To Be Decided
- Exact monorepo tool (Turborepo vs Nx vs Lerna)
- Premium backend framework (Express vs Fastify vs NestJS)
- Deployment platform for Premium (AWS vs GCP vs Azure)
- Monitoring solution (Datadog vs New Relic vs self-hosted)
- Payment processor for Premium subscriptions

---

## Appendix A: Integration Points

### Weekly Intelligence Integration
```typescript
interface IntelligenceIntegration {
  source: 'weekly-reports';
  updateFrequency: 'weekly';
  dataPoints: [
    'current-threats',
    'affected-sectors',
    'attack-patterns',
    'mitigation-updates'
  ];
  availability: {
    light: 'summary-only';
    premium: 'full-access';
  };
}
```

### External Integrations (Premium Only)
- SSO providers (Okta, Auth0, Azure AD)
- Cloud security tools (AWS Security Hub, etc.)
- Ticketing systems (Jira, ServiceNow)
- Communication (Slack, Teams)
- Business Intelligence (Tableau, PowerBI)

---

## Appendix B: Compliance Requirements

### Regional Compliance
- GDPR (Europe)
- LGPD (Brazil)
- Privacy Laws (Mexico, Colombia, Argentina)
- SOC 2 Type II (planned for Premium)
- ISO 27001 (roadmap consideration)

---

*Last Updated: January 2025*
*Version: 1.0*
*Status: Draft for Implementation*