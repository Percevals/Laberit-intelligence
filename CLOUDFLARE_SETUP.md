# Cloudflare Platform Setup - Day 1

## Account Configuration Checklist

### 1. Essential Services to Enable

Log into your Cloudflare dashboard and enable these services:

- [ ] **Pages** - For web app hosting
- [ ] **Workers** - For edge computing
- [ ] **D1** - Serverless SQL database
- [ ] **R2** - Object storage (S3-compatible)
- [ ] **KV** - Key-value storage for caching

### 2. Install Wrangler CLI

```bash
# Install globally
npm install -g wrangler

# Or with pnpm (recommended)
pnpm add -g wrangler

# Authenticate with your account
wrangler login

# Verify authentication
wrangler whoami
```

### 3. Create Your First D1 Database

```bash
# Create production database
wrangler d1 create dii-platform-prod

# Create development database
wrangler d1 create dii-platform-dev

# Save the database IDs that are output!
```

### 4. Create R2 Buckets

```bash
# For assets and files
wrangler r2 bucket create dii-assets

# For customer documents
wrangler r2 bucket create dii-documents
```

### 5. Create KV Namespaces

```bash
# For caching
wrangler kv:namespace create CACHE

# For sessions
wrangler kv:namespace create SESSIONS

# Save the IDs that are output!
```

## Project Setup

### 1. Initialize the Platform Repository

```bash
# Clone current repo
cd /Users/expercy/Documents/GitHub/Laberit-intelligence

# Create platform branch
git checkout -b platform-foundation

# Install pnpm if not already installed
npm install -g pnpm
```

### 2. Initialize Monorepo

```bash
# Initialize pnpm workspace
pnpm init

# Install Turborepo
pnpm add -D turbo
```

### 3. Create Basic Structure

```bash
# Create directory structure
mkdir -p apps/portal
mkdir -p packages/@dii/core
mkdir -p packages/@dii/ui
mkdir -p packages/@dii/auth
mkdir -p workers/api
mkdir -p infrastructure/cloudflare
```

## Configuration Files

### 1. Root package.json
```json
{
  "name": "dii-platform",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "deploy": "turbo deploy",
    "typecheck": "turbo typecheck"
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "^5.3.0"
  },
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=18"
  }
}
```

### 2. pnpm-workspace.yaml
```yaml
packages:
  - 'apps/*'
  - 'packages/**'
  - 'workers/*'
```

### 3. turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "deploy": {
      "dependsOn": ["build"]
    }
  }
}
```

### 4. wrangler.toml (in workers/api/)
```toml
name = "dii-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# Add your D1 database binding
[[d1_databases]]
binding = "DB"
database_name = "dii-platform-prod"
database_id = "YOUR_D1_DATABASE_ID_HERE"

# Add your R2 bucket binding
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "dii-assets"

# Add your KV namespace binding
[[kv_namespaces]]
binding = "CACHE"
id = "YOUR_KV_NAMESPACE_ID_HERE"

# Environment variables
[vars]
ENVIRONMENT = "production"
```

## Next Commands to Run

1. **Set up the repository:**
```bash
cd /Users/expercy/Documents/GitHub/Laberit-intelligence
pnpm install
```

2. **Create your first worker:**
```bash
cd workers/api
pnpm init -y
pnpm add -D @cloudflare/workers-types wrangler typescript
```

3. **Create basic API worker:**
```bash
mkdir src
touch src/index.ts
```

## Quick Test

Create `workers/api/src/index.ts`:
```typescript
export interface Env {
  DB: D1Database;
  CACHE: KVNamespace;
  ASSETS: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return new Response(
      JSON.stringify({
        message: "DII Platform API",
        version: "1.0.0",
        status: "operational"
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
```

Deploy it:
```bash
cd workers/api
wrangler deploy
```

## Verify Everything Works

1. Your worker should be live at: `https://dii-api.YOUR-SUBDOMAIN.workers.dev`
2. Visit the URL and see the JSON response
3. Check Cloudflare dashboard for logs

## What You Should Have Now

✅ Cloudflare account configured
✅ Wrangler CLI authenticated
✅ D1 databases created
✅ R2 buckets ready
✅ KV namespaces set up
✅ Basic monorepo structure
✅ First worker deployed

## Troubleshooting

If `wrangler login` doesn't work:
```bash
# Use API token instead
wrangler login --api-key

# Or set environment variable
export CLOUDFLARE_API_TOKEN=your-token-here
```

If you get permission errors:
- Make sure you're logged into the right Cloudflare account
- Check that Workers is enabled in your account

## Ready for Tomorrow?

Once you have:
- [x] Worker responding at your URL
- [x] D1, R2, and KV IDs saved
- [x] Basic structure created

You're ready for Day 2: Building the core packages!

Need help with any step? Let me know what you see in your Cloudflare dashboard!