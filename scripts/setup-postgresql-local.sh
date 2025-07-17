#!/bin/bash

# Local PostgreSQL Setup Script (No Docker Required)
# For macOS users who prefer local PostgreSQL installation

set -e

echo "🚀 DII Local PostgreSQL Setup Script"
echo "===================================="

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew is not installed."
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "📦 Installing PostgreSQL 15..."
    brew install postgresql@15
    echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
    export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
else
    echo "✅ PostgreSQL is already installed"
fi

# Start PostgreSQL service
echo "🐘 Starting PostgreSQL service..."
brew services start postgresql@15

# Wait for PostgreSQL to start
sleep 3

# Create database and user
echo "📊 Setting up DII database..."

# Check if database exists
if psql -U $USER -lqt | cut -d \| -f 1 | grep -qw dii_dev; then
    echo "⚠️  Database 'dii_dev' already exists"
    read -p "Do you want to drop and recreate it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        psql -U $USER -c "DROP DATABASE IF EXISTS dii_dev;"
        psql -U $USER -c "CREATE DATABASE dii_dev;"
    fi
else
    psql -U $USER -c "CREATE DATABASE dii_dev;"
fi

# Create user and grant permissions
psql -U $USER -d postgres <<EOF
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'dii_user') THEN
        CREATE USER dii_user WITH PASSWORD 'dii_secure_password';
    END IF;
END
\$\$;

GRANT ALL PRIVILEGES ON DATABASE dii_dev TO dii_user;
EOF

# Run migrations
echo "📊 Running database migrations..."
cd "$(dirname "$0")"

# Update .env if it doesn't exist
if [ ! -f ../.env ]; then
    echo "📝 Creating .env file..."
    cp ../.env.example ../.env
fi

# Export environment variables
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=dii_dev
export DB_USER=$USER
export DB_PASSWORD=""

# Run migrations using current user (no password needed)
echo "Running migrations as user: $USER"
psql -U $USER -d dii_dev -f ../database/migrations/001_initial_postgresql_schema.sql
psql -U $USER -d dii_dev -f ../database/migrations/002_add_historical_fields.sql

echo ""
echo "✅ Local PostgreSQL setup complete!"
echo ""
echo "📋 Connection Details:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: dii_dev"
echo "   User: $USER (for migrations)"
echo "   User: dii_user (for application)"
echo "   Password: dii_secure_password"
echo ""
echo "🔧 Useful commands:"
echo "   Start PostgreSQL: brew services start postgresql@15"
echo "   Stop PostgreSQL: brew services stop postgresql@15"
echo "   PostgreSQL status: brew services list"
echo "   Access database: psql -U $USER -d dii_dev"
echo ""
echo "⚠️  Note: Update your .env file with these connection details"