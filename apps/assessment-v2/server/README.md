# DII Assessment Backend API

Backend API server for the DII Assessment platform, providing PostgreSQL database connectivity.

## Setup

1. **Install dependencies:**
   ```bash
   cd apps/assessment-v2/server
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Azure PostgreSQL connection string:
   ```
   DATABASE_URL=postgresql://username:password@your-server.postgres.database.azure.com:5432/dii_assessment?sslmode=require
   ```

3. **Run migrations:**
   ```bash
   npm run migrate
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Companies

- `GET /api/companies` - List all companies (with filters)
- `GET /api/companies/:id` - Get single company
- `POST /api/companies` - Create new company
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company
- `POST /api/companies/bulk` - Bulk import companies
- `POST /api/companies/:id/verify` - Update verification status
- `GET /api/companies/status/stale` - Get companies needing verification

### Health Check

- `GET /health` - Server health status

## Frontend Configuration

To use the backend API in the frontend:

1. Edit `apps/assessment-v2/.env.local`:
   ```
   VITE_USE_API=true
   VITE_API_URL=http://localhost:3001/api
   ```

2. Restart the frontend dev server

The app will automatically use PostgreSQL instead of localStorage.

## Production Deployment

For production deployment:

1. Set up PostgreSQL database (Azure, AWS RDS, etc.)
2. Configure SSL certificates
3. Set environment variables
4. Deploy to cloud platform (Azure App Service, Heroku, etc.)

## Security Notes

- Never commit `.env` files
- Use strong passwords for database
- Enable SSL for production
- Configure CORS for your domain
- Use API keys for additional security