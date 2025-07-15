# Laberit Intelligence - System Architecture

## Overview

Laberit Intelligence is a cloud-native, modular cyber risk assessment platform implementing the Digital Interdependence Index (DII) framework. This document outlines the system architecture, design decisions, and migration strategy toward modern, scalable infrastructure.

## Current Architecture Status

### ⚠️ Architecture Review Required

The current implementation uses SQLite for the assessment module, which conflicts with our cloud-native, modular goals:

- **Issue**: SQLite is file-based, not cloud-native
- **Impact**: Browser incompatibility, deployment complexity, scaling limitations
- **Resolution**: Migrate to shared database architecture (see Migration Strategy below)

## System Architecture Principles

### 1. Cloud-Native Design
- Stateless services
- Container-ready deployment
- Environment-agnostic configuration
- Scalable resource utilization

### 2. Modular Architecture
- Feature-based code organization
- Service isolation with clear APIs
- Plug-and-play component design
- Independent deployability

### 3. DevSecOps Integration
- Infrastructure as Code
- Automated security scanning
- Unified monitoring and logging
- Continuous deployment pipelines

### 4. Adaptive Intelligence
- AI-first data processing
- Real-time threat intelligence
- Machine learning model integration
- Dynamic risk assessment

## Current Technology Stack

### Frontend Layer
```
React 19 + TypeScript
├── Build Tool: Vite
├── State Management: Zustand
├── Styling: Tailwind CSS
├── Routing: React Router v6
└── I18n: react-i18next
```

### Data Layer (Current - Requires Migration)
```
SQLite (better-sqlite3)
├── Schema: 7 core tables
├── Access: TypeScript service layer
├── Location: Local file storage
└── Pattern: Embedded database
```

### Intelligence Layer
```
Python Intelligence Services
├── Threat Intelligence APIs (OTX, IntelX)
├── AI Integration (OpenAI, Mistral)
├── Data Collection & Analysis
└── Static Report Generation
```

### AI Services
```
Multi-Provider AI Integration
├── Primary: Mistral AI
├── Fallback: OpenAI GPT-4
├── Enhanced Mock Provider (Development)
└── Fuzzy Search (Levenshtein distance)
```

## Recommended Target Architecture

### Cloud-Native Database Strategy

#### Option 1: Shared PostgreSQL (Recommended)
```
PostgreSQL Cloud Instance
├── companies schema      # Company registry & classification
├── assessments schema    # DII assessments & results  
├── intelligence schema   # Threat intelligence data
├── users schema         # Authentication & authorization
└── analytics schema     # Business intelligence & reporting
```

**Benefits:**
- ✅ True cloud-native deployment
- ✅ ACID compliance & data integrity
- ✅ Horizontal scalability
- ✅ Enterprise-grade security
- ✅ Rich ecosystem (monitoring, backup, etc.)

#### Option 2: Microservices with Event-Driven Architecture
```
API Gateway
├── Company Service    → PostgreSQL (companies)
├── Assessment Service → PostgreSQL (assessments)
├── Intel Service     → PostgreSQL (intelligence)
└── Analytics Service → PostgreSQL (analytics)
    ↓
Event Bus (Redis/RabbitMQ)
├── Company Events
├── Assessment Events
└── Intelligence Events
```

### Backend API Layer (To Be Implemented)
```
Node.js/Express or Python/FastAPI
├── RESTful API endpoints
├── GraphQL federation (optional)
├── JWT authentication
├── Rate limiting & security
├── OpenAPI documentation
└── Health checks & monitoring
```

## Module Architecture: Company Search & Assessment

### Current Implementation
```
Frontend (React)
    ↓
State Management (Zustand)
    ↓
Database Service (TypeScript)
    ↓
SQLite (Local File) ← NEEDS MIGRATION
```

### Target Implementation
```
Frontend (React)
    ↓
API Client (Axios/Fetch)
    ↓
Backend API (Express/FastAPI)
    ↓
Database Service Layer
    ↓
PostgreSQL (Cloud) ← CLOUD-NATIVE
```

## Data Schema Design

### Core Entities

#### Companies Table
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    legal_name VARCHAR,
    domain VARCHAR UNIQUE,
    industry_traditional VARCHAR NOT NULL,
    dii_business_model DII_MODEL_ENUM NOT NULL,
    confidence_score DECIMAL(3,2),
    classification_reasoning TEXT,
    headquarters VARCHAR,
    country VARCHAR,
    region VARCHAR DEFAULT 'LATAM',
    employees INTEGER,
    revenue BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Assessments Table
```sql
CREATE TABLE assessments (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES companies(id),
    assessment_type ASSESSMENT_TYPE_ENUM,
    dii_raw_score DECIMAL(5,3),
    dii_final_score DECIMAL(5,3),
    confidence_level INTEGER CHECK (confidence_level BETWEEN 0 AND 100),
    assessed_at TIMESTAMP DEFAULT NOW(),
    assessed_by_user_id UUID,
    framework_version VARCHAR DEFAULT 'v4.0',
    calculation_inputs JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Business Logic: DII Framework

### 8 Business Model Classifications
1. **COMERCIO_HIBRIDO** - Hybrid Commerce (Physical + Digital)
2. **SOFTWARE_CRITICO** - Critical Software (SaaS, Cloud Platforms)
3. **SERVICIOS_DATOS** - Data Services (Analytics, Intelligence)
4. **ECOSISTEMA_DIGITAL** - Digital Ecosystem (Marketplaces, Platforms)
5. **SERVICIOS_FINANCIEROS** - Financial Services (Fintech, Banking)
6. **INFRAESTRUCTURA_HEREDADA** - Legacy Infrastructure (Traditional + Digital)
7. **CADENA_SUMINISTRO** - Supply Chain (Logistics, Distribution)
8. **INFORMACION_REGULADA** - Regulated Information (Healthcare, Government)

### DII Calculation Formula
```
DII Raw Score = (TRD × AER) / (HFP × BRI × RRG)
DII Final Score = (DII Raw / Model Base Average) × 10

Where:
- TRD: Time to Revenue Disruption (hours)
- AER: Attack Economic Ratio (cost ratio)
- HFP: Human Failure Probability (0-1)
- BRI: Blast Radius Index (0-1)
- RRG: Recovery Resource Gap (multiplier)
```

## Security Considerations

### Data Protection
- Encrypt sensitive data at rest
- Use TLS 1.3 for data in transit
- Implement field-level encryption for PII
- Regular security audits and penetration testing

### Access Control
- OAuth 2.0 / OpenID Connect authentication
- Role-based access control (RBAC)
- API rate limiting and throttling
- Request/response logging for audit trails

### Compliance
- SOC 2 Type II compliance preparation
- ISO 27001 security framework alignment
- GDPR/CCPA data protection compliance
- Industry-specific regulations (financial, healthcare)

## Migration Strategy

### Phase 1: Database Architecture Migration ✅ IN PROGRESS
- [x] Design PostgreSQL schema
- [x] Create migration scripts
- [ ] Set up cloud database instance
- [ ] Test data migration process

### Phase 2: API Layer Implementation
- [ ] Design REST API endpoints
- [ ] Implement authentication middleware
- [ ] Create database connection pooling
- [ ] Add comprehensive error handling

### Phase 3: Frontend Integration
- [ ] Replace direct database calls with API calls
- [ ] Implement API client with retry logic
- [ ] Add offline capability (optional)
- [ ] Update state management for async operations

### Phase 4: DevOps & Monitoring
- [ ] Container deployment (Docker)
- [ ] Infrastructure as Code (Terraform)
- [ ] CI/CD pipeline setup
- [ ] Monitoring and alerting (Prometheus/Grafana)

## Development Guidelines

### Code Organization
```
/apps/
├── assessment-v2/          # React frontend
├── api/                    # Backend API (to be created)
└── intelligence/           # Python intelligence services

/packages/
├── shared/                 # Shared utilities
├── ui/                     # UI component library
└── database/               # Database migrations & schemas

/infrastructure/
├── terraform/              # Infrastructure as Code
├── docker/                 # Container configurations
└── monitoring/             # Observability setup
```

### API Design Standards
- RESTful resource naming
- Consistent error response format
- Comprehensive OpenAPI documentation
- Semantic versioning for API changes
- Standardized pagination and filtering

### Database Standards
- Use UUID for all primary keys
- Implement soft deletes where appropriate
- Add created_at/updated_at to all tables
- Use database constraints for data integrity
- Implement proper indexing strategy

## Monitoring & Observability

### Metrics to Track
- API response times and error rates
- Database query performance
- AI service response times and costs
- User assessment completion rates
- System resource utilization

### Logging Strategy
- Structured JSON logging
- Centralized log aggregation
- Security event monitoring
- Performance bottleneck identification
- User behavior analytics

## Deployment Strategy

### Development Environment
- Local Docker Compose setup
- Hot reloading for rapid development
- Mock services for external dependencies
- Automated testing pipeline

### Production Environment
- Kubernetes cluster deployment
- Blue-green deployment strategy
- Automated database migrations
- Health checks and circuit breakers
- Disaster recovery procedures

## Next Steps

### Immediate Actions Required
1. **Set up cloud database** (PostgreSQL on AWS RDS/Azure/GCP)
2. **Create migration scripts** from SQLite schema to PostgreSQL
3. **Implement API layer** with Express.js or FastAPI
4. **Update frontend** to use API instead of direct database access

### Architecture Decisions Needed
1. **Cloud Provider**: AWS, Azure, or GCP?
2. **Backend Framework**: Node.js/Express or Python/FastAPI?
3. **Authentication Strategy**: Auth0, Firebase Auth, or custom?
4. **Deployment Platform**: Kubernetes, Serverless, or traditional VMs?

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Next Review**: Q1 2025  

This architecture supports Laberit Intelligence's mission to provide modern, scalable, and secure cyber risk assessment capabilities while maintaining the flexibility to adapt to evolving requirements and technologies.