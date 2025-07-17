#!/bin/bash

# Initialize PostgreSQL in Docker
# Creates database and user for DII Assessment

set -e

echo "🚀 Initializing PostgreSQL in Docker..."
echo "===================================="

# First, let's check if the container is running
if ! docker ps | grep -q dii_postgres; then
    echo "❌ Container 'dii_postgres' is not running"
    echo "Run: docker-compose up -d postgres"
    exit 1
fi

echo "✅ Container 'dii_postgres' is running"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker exec dii_postgres pg_isready -U postgres &> /dev/null; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    echo -n "."
    sleep 1
    attempt=$((attempt + 1))
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ PostgreSQL failed to start"
    exit 1
fi

# Create database and user using postgres superuser
echo "📊 Creating database and user..."

# Create the dii_user if it doesn't exist
docker exec -i dii_postgres psql -U postgres <<EOF
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'dii_user') THEN
        CREATE USER dii_user WITH PASSWORD 'dii_secure_password';
    END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE dii_dev OWNER dii_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dii_dev')\gexec

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE dii_dev TO dii_user;
EOF

echo "✅ Database and user created"

# Now run the migrations
echo ""
echo "📊 Running migrations..."
cd "$(dirname "$0")"

# Export environment variables for the migration script
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=dii_dev
export DB_USER=dii_user
export DB_PASSWORD=dii_secure_password

# Run migrations
npm run migrate

echo ""
echo "✅ PostgreSQL initialization complete!"
echo ""
echo "📋 Connection details:"
echo "   Host: localhost:5432"
echo "   Database: dii_dev"
echo "   User: dii_user"
echo "   Password: dii_secure_password"
echo ""
echo "🔧 Next steps:"
echo "1. Test connection: npm run test-connection"
echo "2. Run historical migration: npm run migrate-historical-data"