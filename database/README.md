# DII Assessment Database

This directory contains the PostgreSQL database schema and migration system for the Laberit Intelligence DII Assessment platform.

## Prerequisites

- PostgreSQL 13+ (local or Docker)
- Node.js 16+
- npm or yarn

## Quick Start

### 1. Install Dependencies

First, install the PostgreSQL client library:

```bash
npm install pg
# or
yarn add pg
```

### 2. Database Setup

#### Using Docker (Recommended)

Create a `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: dii_postgres
    environment:
      POSTGRES_DB: dii_dev
      POSTGRES_USER: dii_user
      POSTGRES_PASSWORD: dii_dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start PostgreSQL:

```bash
docker-compose up -d postgres
```

#### Using Local PostgreSQL

Create the database and user:

```sql
CREATE DATABASE dii_dev;
CREATE USER dii_user WITH PASSWORD 'dii_dev_password';
GRANT ALL PRIVILEGES ON DATABASE dii_dev TO dii_user;
```

### 3. Test Database Connection

```bash
node scripts/test-db-connection.js
```

Expected output:
```
✅ Database connected successfully!
📊 PostgreSQL Version: ...
⚠️  No tables found. Have you run the migrations?
```

### 4. Run Migrations

```bash
node scripts/run-migrations.js
```

This will:
- Create all tables with proper types and constraints
- Set up indexes for performance
- Insert initial data (DII model profiles, classification rules, validation rules)
- Track which migrations have been executed

### 5. Verify Schema

After running migrations, test the connection again:

```bash
node scripts/test-db-connection.js
```

You should see all tables listed:
- companies
- assessments
- dimension_scores
- dii_model_profiles
- classification_rules
- benchmark_data
- validation_rules
- schema_migrations

## Environment Variables

Configure database connection using environment variables:

```bash
# Individual settings
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=dii_dev
export DB_USER=dii_user
export DB_PASSWORD=dii_dev_password

# Or use a connection string
export DATABASE_URL=postgresql://dii_user:dii_dev_password@localhost:5432/dii_dev
```

## Database Schema Overview

### Core Tables

1. **companies** - Company registry with DII business model classification
2. **assessments** - DII assessment results and scores
3. **dimension_scores** - Individual scores for the 5 DII dimensions (TRD, AER, HFP, BRI, RRG)
4. **dii_model_profiles** - Configuration for 8 DII business models
5. **classification_rules** - Rules for automatic business model classification
6. **benchmark_data** - Regional benchmark percentiles
7. **validation_rules** - Data quality validation rules

### Custom Types (ENUMs)

- `dii_business_model` - 8 DII business models
- `assessment_type` - Types of assessments (quick, comprehensive, etc.)
- `dii_dimension` - The 5 DII dimensions
- `data_source` - Sources of dimension data
- `validation_status` - Data validation states
- `revenue_model` - Company revenue models
- `operational_dependency` - Digital vs physical dependency
- `rule_severity` - Validation rule severity levels
- `rule_type` - Types of validation rules

## Migration System

### How It Works

1. Migration files are stored in `/database/migrations/`
2. Files are executed in alphabetical order (use numbered prefixes)
3. Each migration is tracked in the `schema_migrations` table
4. Migrations are idempotent - safe to run multiple times
5. Transactions ensure all-or-nothing execution

### Creating New Migrations

Create a new file in `/database/migrations/`:

```sql
-- database/migrations/002_add_new_feature.sql

-- Your SQL here
CREATE TABLE new_feature (...);

-- Record the migration
INSERT INTO schema_migrations (migration_name) 
VALUES ('002_add_new_feature.sql');
```

### Migration Commands

```bash
# Run all pending migrations
node scripts/run-migrations.js

# Check migration status
node scripts/run-migrations.js --status

# Show help
node scripts/run-migrations.js --help
```

## Troubleshooting

### Connection Refused

```bash
❌ Connection failed!
   Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Ensure PostgreSQL is running
- Docker: `docker-compose up -d postgres`
- Local: `sudo service postgresql start`

### Authentication Failed

```bash
❌ Connection failed!
   Error: password authentication failed for user "dii_user"
```

**Solution**: Check credentials in environment variables or create the user:
```sql
CREATE USER dii_user WITH PASSWORD 'dii_dev_password';
```

### Database Does Not Exist

```bash
❌ Connection failed!
   Error: database "dii_dev" does not exist
```

**Solution**: Create the database:
```sql
CREATE DATABASE dii_dev;
```

### Migration Already Exists

```bash
❌ Migration failed: relation "companies" already exists
```

**Solution**: The migration may have partially run. Either:
1. Drop the database and start fresh: `DROP DATABASE dii_dev; CREATE DATABASE dii_dev;`
2. Manually record the migration: `INSERT INTO schema_migrations VALUES ('001_initial_schema.sql');`

## Development Workflow

1. **Make Schema Changes**: Create a new migration file
2. **Test Locally**: Run migrations in development
3. **Verify**: Use `test-db-connection.js` to verify schema
4. **Commit**: Include migration file in git
5. **Deploy**: Run migrations in staging/production

## Production Considerations

For production deployments:

1. **Use Environment Variables**: Never hardcode credentials
2. **Enable SSL**: Add `?sslmode=require` to connection string
3. **Connection Pooling**: Use `pg-pool` for better performance
4. **Monitoring**: Set up query performance monitoring
5. **Backups**: Configure automated backups
6. **High Availability**: Consider read replicas for scaling

## Next Steps

After setting up the database:

1. **Backend API**: Implement REST API using Express.js
2. **Service Layer**: Create TypeScript services for database operations
3. **Testing**: Add integration tests for database operations
4. **Documentation**: Generate API documentation from schema

---

For questions or issues, please refer to the main project documentation or create an issue in the repository.