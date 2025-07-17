# Docker Setup Guide for macOS

## Error: Docker daemon not running

You're seeing this error because Docker Desktop is not running on your Mac.

## Solution Options

### Option 1: Install/Start Docker Desktop (Recommended)

1. **Check if Docker Desktop is installed:**
   ```bash
   ls /Applications/ | grep Docker
   ```

2. **If not installed, download from:**
   - https://www.docker.com/products/docker-desktop/
   - Choose "Docker Desktop for Mac"
   - Install the .dmg file

3. **Start Docker Desktop:**
   - Open Docker Desktop from Applications
   - Wait for the Docker icon in menu bar to show "Docker Desktop is running"
   - The whale icon should be steady (not animated)

4. **Verify Docker is running:**
   ```bash
   docker --version
   docker ps
   ```

### Option 2: Use Local PostgreSQL (Alternative)

If you prefer not to use Docker, you can install PostgreSQL directly:

1. **Install via Homebrew:**
   ```bash
   brew install postgresql@15
   brew services start postgresql@15
   ```

2. **Create database and user:**
   ```bash
   createdb dii_dev
   psql -d dii_dev -c "CREATE USER dii_user WITH PASSWORD 'dii_secure_password';"
   psql -d dii_dev -c "GRANT ALL PRIVILEGES ON DATABASE dii_dev TO dii_user;"
   ```

3. **Update .env file:**
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=dii_dev
   DB_USER=dii_user
   DB_PASSWORD=dii_secure_password
   ```

### Option 3: Use PostgreSQL.app (GUI Alternative)

1. **Download from:** https://postgresapp.com/
2. **Install and start the app**
3. **Create database via GUI or terminal**

## After Docker is Running

Once Docker Desktop is running, retry:

```bash
# Remove version warning by updating docker-compose.yml
# Then run:
docker-compose up -d postgres

# Verify it's running:
docker ps

# Check logs if needed:
docker-compose logs postgres
```

## Quick Fix for Version Warning

The warning about `version` attribute can be fixed by removing it from docker-compose.yml.