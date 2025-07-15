# Database Integration - PostgreSQL Migration

## Overview

The DII Assessment v2 application has been updated to use PostgreSQL instead of SQLite, while maintaining full backward compatibility and graceful degradation.

## Key Changes

### 1. Database Service Layer
- **File**: `src/database/company-database.service.v2.ts`
- Replaced SQLite direct calls with PostgreSQL repositories from `@dii/core`
- Maintains exact same public API - no changes needed in consuming code
- Includes automatic fallback to mock data if database is unavailable

### 2. Database Connection Management
- **File**: `src/main.tsx`
- Non-blocking database initialization on app startup
- App continues to function even if database connection fails

### 3. Connection Status Monitoring
- **Component**: `DatabaseConnectionIndicator`
- **Context**: `DatabaseConnectionContext`
- Visual indicator in bottom-right corner:
  - 🟢 Green: Connected to database
  - 🟡 Yellow: Connecting...
  - 🔴 Red: Database offline (with retry option)

## Graceful Degradation

The application handles database failures gracefully:

1. **Company Search**: Returns empty results if database is down
2. **Company Creation**: Creates mock company objects locally
3. **Assessments**: Uses in-memory storage as fallback
4. **Business Model Classification**: Falls back to pattern matching

## Testing Checklist

✅ **App loads even if database is down**
- Stop PostgreSQL and verify app still loads

✅ **Search returns empty results if database fails**
- Search functionality continues without errors

✅ **No white screen of death on errors**
- All database errors are caught and handled

✅ **Console shows clear error messages**
- Check browser console for connection status

## Database Requirements

### Local Development
```bash
# PostgreSQL connection details
Host: localhost
Port: 5432
Database: dii_dev
Username: dii_user
Password: dii_dev_password
```

### Environment Variables (Optional)
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=dii_dev
export DB_USER=dii_user
export DB_PASSWORD=dii_dev_password
```

## How It Works

1. **Initialization**: Database connection attempts on app start (non-blocking)
2. **Service Layer**: `CompanyDatabaseService` uses PostgreSQL repositories internally
3. **Error Handling**: All database calls wrapped in try-catch with fallbacks
4. **Status Monitoring**: Real-time connection status with retry capability

## Migration Path

### Phase 1 ✅ (Current)
- Database abstraction layer implemented
- App continues to work with or without database
- Connection status indicator

### Phase 2 (Future)
- Add API layer for true client-server architecture
- Implement caching for offline capability
- Add data synchronization

## Troubleshooting

### Database Connection Failed
1. Check PostgreSQL is running: `docker ps`
2. Verify credentials in environment
3. Check network connectivity
4. Use retry button in connection indicator

### Performance Issues
- Database queries are optimized with indexes
- Connection pooling enabled (10 connections)
- Consider adding Redis cache layer

### Data Inconsistency
- Mock data used when database unavailable
- Real data takes precedence when available
- No data loss - just temporary local storage

## Developer Notes

- Database service is a singleton - initialized once
- All methods maintain original signatures
- TypeScript types remain unchanged
- No breaking changes to existing code

The integration is designed to be transparent to the rest of the application while providing robust database connectivity with proper error handling.