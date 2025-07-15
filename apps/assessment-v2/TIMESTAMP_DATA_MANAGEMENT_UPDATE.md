# Timestamp and Data Management Fields Update

## Summary

Added timestamp and data management fields to the companies database to track data freshness and enable intelligent data refresh through the hybrid search service.

## Changes Made

### 1. Database Schema Updates

#### New Fields Added to `companies` Table:
- `last_verified` (TIMESTAMP WITH TIME ZONE) - When the company data was last verified
- `verification_source` (VARCHAR) - Source of verification: 'ai_search', 'manual', or 'import'
- `data_freshness_days` (INTEGER) - Number of days before data is considered stale (default: 90)
- `is_prospect` (BOOLEAN) - Whether the company is a prospect (default: false)

#### New Indexes:
- `idx_companies_last_verified` - For efficient freshness checks
- `idx_companies_is_prospect` - For filtering prospects

### 2. TypeScript Type Updates

#### Updated `src/database/types.ts`:
- Added `VerificationSource` type: `'ai_search' | 'manual' | 'import'`
- Updated `Company` interface to include the new fields
- Updated `CompanyDatabaseService` interface with new methods:
  - `isCompanyDataStale(companyId: string): Promise<boolean>`
  - `updateCompanyVerification(companyId: string, source: VerificationSource): Promise<void>`
  - `getCompaniesNeedingVerification(limit?: number): Promise<Company[]>`

### 3. Service Implementation Updates

#### Mock Database Service (`mock-database.service.ts`):
- Updated all mock companies to include the new fields
- Updated `createCompany` method to set default values for new fields
- Added data freshness management methods:
  - `isCompanyDataStale` - Checks if company data exceeds freshness threshold
  - `updateCompanyVerification` - Updates verification timestamp and source
  - `getCompaniesNeedingVerification` - Returns companies needing data refresh

#### Company Database Service (`company-database.service.ts`):
- Updated `createCompany` INSERT statement to include new fields
- Updated `mapCompanyFromDB` to map new fields from database rows
- Added data freshness management methods with SQL queries

### 4. Hybrid Search Service Updates (`hybrid-search.service.ts`)

#### Enhanced Functionality:
- Added `checkDataFreshness` and `refreshStaleData` options to search
- Extended `HybridCompanyInfo` interface with freshness fields
- Automatically checks data freshness during database searches
- Uses AI search to refresh stale company data
- Updates verification timestamps when AI data is used
- Combines database and AI results intelligently based on freshness

#### New Search Logic:
1. Search database for companies
2. Check if each result's data is stale
3. Trigger AI search if data is stale or no good matches
4. When combining results, update verification timestamps for refreshed data
5. Return results with freshness indicators

### 5. Migration Files

Created migration files in `src/database/migrations/`:
- `001_add_timestamp_data_management_fields.sql` - Adds new fields and indexes
- `001_rollback_timestamp_data_management_fields.sql` - Rollback script
- `README.md` - Migration documentation

### 6. Documentation Updates

Updated database documentation:
- Added new fields to schema documentation
- Added data freshness management examples
- Updated service interface documentation
- Added migration instructions

## Usage Examples

### Checking Data Freshness
```typescript
const isStale = await databaseService.isCompanyDataStale(companyId);
if (isStale) {
  console.log('Company data needs refresh');
}
```

### Hybrid Search with Automatic Refresh
```typescript
const results = await hybridSearch.search('Banco Santander', {
  checkDataFreshness: true,
  refreshStaleData: true
});

// Results will include fresh data from AI if database data was stale
// Verification timestamps are automatically updated
```

### Getting Companies Needing Verification
```typescript
const staleCompanies = await databaseService.getCompaniesNeedingVerification(10);
for (const company of staleCompanies) {
  // Process stale companies (e.g., queue for AI refresh)
}
```

## Benefits

1. **Data Quality**: Ensures company information stays current
2. **Intelligent Refresh**: Only queries AI when data is stale
3. **Transparency**: Tracks where and when data was verified
4. **Performance**: Indexes ensure efficient freshness checks
5. **Flexibility**: Configurable freshness thresholds per company
6. **Prospect Management**: Can distinguish between verified companies and prospects

## Next Steps

1. Consider adding a background job to periodically refresh stale data
2. Add UI indicators for data freshness in company search results
3. Implement data quality metrics dashboard
4. Consider different freshness thresholds based on company type or industry