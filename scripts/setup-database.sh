#!/bin/bash

# Database Setup Script
# Sets up PostgreSQL for DII Assessment Platform

set -e

echo "🚀 DII Database Setup Script"
echo "=========================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your desired passwords!"
fi

# Start PostgreSQL
echo "🐘 Starting PostgreSQL..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if database is ready
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U dii_user -d dii_dev &> /dev/null; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    echo -n "."
    sleep 1
    attempt=$((attempt + 1))
done

if [ $attempt -eq $max_attempts ]; then
    echo "❌ PostgreSQL failed to start. Check docker-compose logs."
    exit 1
fi

# Run migrations
echo "📊 Running database migrations..."
cd scripts
npm run migrate

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with secure passwords"
echo "2. Run 'npm run test-connection' to verify connection"
echo "3. Access pgAdmin at http://localhost:5050 (optional)"
echo "4. Run the historical data migration"
echo ""
echo "🔧 Useful commands:"
echo "- Start database: docker-compose up -d postgres"
echo "- Stop database: docker-compose down"
echo "- View logs: docker-compose logs -f postgres"
echo "- Access PostgreSQL CLI: docker-compose exec postgres psql -U dii_user -d dii_dev"