# Azure PostgreSQL Setup

## Connection Details

- **Host**: dii-platform-db.postgres.database.azure.com
- **Port**: 5432
- **Database**: dii_dev
- **Username**: diiadmin
- **Password**: PerPlatform2024!
- **SSL**: Required (handled automatically by configuration)

## Connection String

```
postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require
```

## Important Notes

### Security Requirements
- **SSL is mandatory** for Azure PostgreSQL connections
- The application automatically detects Azure hosts and applies proper SSL configuration
- Uses `rejectUnauthorized: false` for Azure's self-signed certificates
- **Firewall rules** must allow your IP address in Azure Portal

### Azure Limitations
- Cannot use PostgreSQL extensions (uuid-ossp, pg_trgm)
- Built-in functions are used instead:
  - `gen_random_uuid()` for UUID generation
  - Standard `LIKE` queries for text search

### Performance Considerations
- Connection might be slower than local (it's remote)
- Consider implementing connection pooling for production
- Monitor query performance, especially for complex joins

## Environment Configuration

### Development (.env.development)
```env
NODE_ENV=development
DATABASE_URL=postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require
```

### Production (.env.production)
```env
NODE_ENV=production
DATABASE_URL=postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require
```

## Database Operations

### Test Connection
```bash
export DATABASE_URL="postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require"
node scripts/test-db-connection.js
```

### Run Migrations
```bash
export DATABASE_URL="postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require"
node scripts/run-migrations.js
```

### Seed Database
```bash
export DATABASE_URL="postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require"
node scripts/db-seed.js
```

### Clear Database
```bash
export DATABASE_URL="postgresql://diiadmin:PerPlatform2024!@dii-platform-db.postgres.database.azure.com:5432/dii_dev?sslmode=require"
node scripts/db-clear.js
```

## Troubleshooting

### Connection Timeout
- **Issue**: Cannot connect to Azure PostgreSQL
- **Solution**: 
  1. Check firewall rules in Azure Portal
  2. Ensure your IP address is allowed
  3. Verify the database server is running

### SSL Error
- **Issue**: SSL connection required but not configured
- **Solution**: 
  1. Ensure `sslmode=require` is in connection string
  2. Configuration automatically handles SSL for Azure hosts
  3. Check that `DATABASE_URL` environment variable is set correctly

### Permission Denied
- **Issue**: Authentication failed
- **Solution**: 
  1. Verify username and password are correct
  2. Check user permissions in Azure Portal
  3. Ensure the user has access to the `dii_dev` database

### Extension Not Allowed
- **Issue**: Cannot create PostgreSQL extensions
- **Solution**: 
  1. Azure doesn't allow most extensions for security
  2. Use built-in functions instead:
     - `gen_random_uuid()` instead of `uuid_generate_v4()`
     - Standard SQL instead of specialized extensions

### Numeric Field Overflow
- **Issue**: DII calculations exceed DECIMAL(8,5) limits
- **Solution**: 
  1. Cap values at 999.99999
  2. Review calculation formulas
  3. Consider using DECIMAL with larger precision

## Migration from Local to Azure

1. **Export local data** (if needed):
   ```bash
   pg_dump -h localhost -U dii_user -d dii_dev > backup.sql
   ```

2. **Update environment variables** to point to Azure

3. **Run migrations** on Azure database

4. **Import data** (if needed):
   ```bash
   psql $DATABASE_URL < backup.sql
   ```

## Best Practices

1. **Always use environment variables** for connection strings
2. **Never commit credentials** to version control
3. **Use connection pooling** in production
4. **Monitor performance** and optimize queries as needed
5. **Set up automated backups** in Azure Portal
6. **Implement retry logic** for transient connection failures

## Application Integration

The application automatically detects Azure PostgreSQL connections and:
- Applies proper SSL configuration
- Handles connection pooling through @dii/core
- Provides graceful fallbacks for connection failures
- Shows connection status in the UI (bottom-right indicator)

## Development Workflow

1. Set `DATABASE_URL` environment variable
2. Run `npm run dev` to start the application
3. The app will connect to Azure PostgreSQL automatically
4. Connection status indicator shows real-time status
5. If connection fails, app continues with cached/mock data