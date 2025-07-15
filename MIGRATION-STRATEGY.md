# Database Migration Strategy: SQLite to Cloud-Native Architecture

## Overview

This document outlines the technical migration from the current SQLite-based architecture to a modern, cloud-native database solution for the Laberit Intelligence platform.

## Current State Analysis

### Issues with Current SQLite Implementation
- ❌ **Browser Incompatibility**: SQLite requires Node.js filesystem access
- ❌ **Not Cloud-Native**: File-based storage doesn't scale
- ❌ **Single Point of Failure**: No redundancy or backup strategy
- ❌ **Limited Concurrency**: SQLite has write concurrency limitations
- ❌ **DevOps Challenges**: Difficult to monitor, backup, and secure

### What We've Built (Good Foundation)
- ✅ **Solid Schema Design**: 7 well-designed tables with proper relationships
- ✅ **TypeScript Service Layer**: `CompanyDatabaseService` with comprehensive operations
- ✅ **Business Logic**: DII calculation engine and validation rules
- ✅ **Data Seeding**: Initial data and classification rules
- ✅ **Frontend Integration Points**: Prepared for API integration

## Migration Strategy

### Phase 1: Database Infrastructure Setup

#### 1.1 Choose Cloud Database Provider

**Recommended: PostgreSQL on Cloud**
```bash
# Option A: AWS RDS PostgreSQL
# Option B: Google Cloud SQL PostgreSQL  
# Option C: Azure Database for PostgreSQL
# Option D: Digital Ocean Managed PostgreSQL (cost-effective)
```

#### 1.2 Create PostgreSQL Schema
```sql
-- Convert SQLite schema to PostgreSQL
-- File: /database/migrations/001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE dii_business_model AS ENUM (
    'COMERCIO_HIBRIDO',
    'SOFTWARE_CRITICO', 
    'SERVICIOS_DATOS',
    'ECOSISTEMA_DIGITAL',
    'SERVICIOS_FINANCIEROS',
    'INFRAESTRUCTURA_HEREDADA',
    'CADENA_SUMINISTRO',
    'INFORMACION_REGULADA'
);

CREATE TYPE assessment_type AS ENUM (
    'quick_30min',
    'formal_comprehensive',
    'benchmark_update',
    'follow_up'
);

-- Companies table (PostgreSQL version)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    domain VARCHAR(255) UNIQUE,
    
    -- Classification
    industry_traditional VARCHAR(255) NOT NULL,
    dii_business_model dii_business_model NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
    classification_reasoning TEXT,
    
    -- Company Details
    headquarters VARCHAR(255),
    country VARCHAR(100),
    region VARCHAR(50) DEFAULT 'LATAM',
    employees INTEGER,
    revenue BIGINT, -- Annual revenue in USD
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_companies_industry ON companies(industry_traditional);
CREATE INDEX idx_companies_dii_model ON companies(dii_business_model);
CREATE INDEX idx_companies_country ON companies(country);
CREATE INDEX idx_companies_created_at ON companies(created_at);
```

### Phase 2: Backend API Implementation

#### 2.1 Create Backend Service Structure
```
/apps/api/
├── src/
│   ├── controllers/
│   │   ├── companies.controller.ts
│   │   ├── assessments.controller.ts
│   │   └── benchmarks.controller.ts
│   ├── services/
│   │   ├── database.service.ts
│   │   ├── classification.service.ts
│   │   └── dii-calculation.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   └── app.config.ts
│   └── app.ts
├── package.json
└── Dockerfile
```

#### 2.2 Database Connection with Connection Pooling
```typescript
// /apps/api/src/config/database.config.ts
import { Pool } from 'pg';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  maxConnections: number;
}

export const createDatabasePool = (config: DatabaseConfig): Pool => {
  return new Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
    ssl: config.ssl ? { rejectUnauthorized: false } : false,
    max: config.maxConnections,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
};
```

#### 2.3 API Endpoints Design
```typescript
// /apps/api/src/controllers/companies.controller.ts
import { Router } from 'express';
import { CompanyService } from '../services/company.service';

const router = Router();

// POST /api/companies - Create company
router.post('/', async (req, res, next) => {
  try {
    const company = await CompanyService.create(req.body);
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
});

// GET /api/companies/search?q={query} - Search companies
router.get('/search', async (req, res, next) => {
  try {
    const { q: query } = req.query;
    const companies = await CompanyService.search(query as string);
    res.json({ success: true, data: companies });
  } catch (error) {
    next(error);
  }
});

// GET /api/companies/:id - Get company by ID
router.get('/:id', async (req, res, next) => {
  try {
    const company = await CompanyService.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }
    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
});

export { router as companiesRouter };
```

### Phase 3: Frontend Migration

#### 3.1 Create API Client Service
```typescript
// /apps/assessment-v2/src/services/api/api-client.ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.VITE_API_URL || 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<T> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }

    return result.data!;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    const result: ApiResponse<T> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }

    return result.data!;
  }
}

export const apiClient = new ApiClient();
```

#### 3.2 Update Company Service to Use API
```typescript
// /apps/assessment-v2/src/services/api/company-api.service.ts
import { apiClient } from './api-client';
import type { Company } from '../database/types';

export class CompanyApiService {
  async createCompany(data: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    return apiClient.post<Company>('/companies', data);
  }

  async searchCompanies(query: string): Promise<Company[]> {
    return apiClient.get<Company[]>(`/companies/search?q=${encodeURIComponent(query)}`);
  }

  async getCompany(id: string): Promise<Company | null> {
    try {
      return await apiClient.get<Company>(`/companies/${id}`);
    } catch (error) {
      if (error.message.includes('not found')) {
        return null;
      }
      throw error;
    }
  }
}

export const companyApiService = new CompanyApiService();
```

### Phase 4: Migration Execution Plan

#### 4.1 Pre-Migration Checklist
- [ ] Set up cloud PostgreSQL instance
- [ ] Configure database connection pooling
- [ ] Create database migrations
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Test API endpoints with Postman/Insomnia

#### 4.2 Data Migration Process
```bash
# 1. Export existing SQLite data
node scripts/export-sqlite-data.js > data-export.json

# 2. Run PostgreSQL migrations
npm run migrate:up

# 3. Import data to PostgreSQL
node scripts/import-to-postgres.js < data-export.json

# 4. Verify data integrity
npm run test:data-integrity
```

#### 4.3 Deployment Strategy
```yaml
# docker-compose.yml for development
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: laberit_intelligence
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: development
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/migrations:/docker-entrypoint-initdb.d

  api:
    build: ./apps/api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgres://postgres:development@postgres:5432/laberit_intelligence
    depends_on:
      - postgres

  frontend:
    build: ./apps/assessment-v2
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: http://localhost:3001/api
    depends_on:
      - api

volumes:
  postgres_data:
```

### Phase 5: Testing & Validation

#### 5.1 Integration Testing
```typescript
// /apps/api/tests/integration/companies.test.ts
import request from 'supertest';
import { app } from '../src/app';

describe('Companies API', () => {
  it('should create a company', async () => {
    const companyData = {
      name: 'Test Company',
      industry_traditional: 'Technology',
      region: 'LATAM'
    };

    const response = await request(app)
      .post('/api/companies')
      .send(companyData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Test Company');
  });

  it('should search companies', async () => {
    const response = await request(app)
      .get('/api/companies/search?q=test')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

#### 5.2 Load Testing
```bash
# Using Artillery.js for load testing
npm install -g artillery

# Load test the API
artillery run load-test-config.yml
```

### Phase 6: Production Deployment

#### 6.1 Infrastructure as Code (Terraform)
```hcl
# /infrastructure/terraform/main.tf
resource "aws_db_instance" "postgres" {
  identifier     = "laberit-intelligence-db"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true
  
  db_name  = "laberit_intelligence"
  username = var.db_username
  password = var.db_password
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "laberit-intelligence-final-snapshot"
  
  tags = {
    Name = "Laberit Intelligence Database"
    Environment = var.environment
  }
}
```

## Rollback Strategy

### Emergency Rollback Plan
1. **Database Rollback**: Keep SQLite files as backup for 30 days
2. **Application Rollback**: Use blue-green deployment for instant rollback
3. **Data Recovery**: Automated daily PostgreSQL backups
4. **Monitoring**: Real-time alerts for performance degradation

### Success Metrics
- [ ] API response times < 200ms (95th percentile)
- [ ] Database connection pool < 80% utilization
- [ ] Zero data loss during migration
- [ ] 99.9% uptime post-migration
- [ ] All existing functionality preserved

## Timeline Estimate

- **Week 1**: Database setup and schema migration
- **Week 2**: Backend API implementation
- **Week 3**: Frontend integration and testing
- **Week 4**: Production deployment and monitoring setup

## Cost Considerations

### Development Environment
- Local Docker containers: Free
- Development PostgreSQL: ~$20/month (Digital Ocean)

### Production Environment
- PostgreSQL (managed): ~$50-200/month (depending on provider)
- API hosting: ~$20-50/month (containerized deployment)
- Monitoring/logging: ~$30/month (DataDog/NewRelic)

**Total estimated monthly cost: $100-280 vs Current: $0**

The investment in proper infrastructure will pay dividends in:
- Reduced maintenance overhead
- Improved scalability and reliability
- Better security and compliance
- Enhanced developer productivity

---

**Next Action**: Choose cloud provider and create PostgreSQL instance to begin Phase 1.