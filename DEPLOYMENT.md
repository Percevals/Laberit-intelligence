# Deployment Guide for Laberit Intelligence

## Overview

This repository uses GitHub Pages with GitHub Actions for deployment. The site structure includes:

- **Main Site** (`/`) - DII 4.0 Framework landing page
- **Quick Assessment** (`/quick-assessment/`) - React-based assessment tool
- **Intelligence Reports** (`/intelligence/weekly-reports/`) - Static HTML reports

## Deployment Process

### Automatic Deployment

1. Every push to `main` branch triggers the deployment workflow
2. The workflow builds the Quick Assessment app and prepares all static files
3. GitHub Pages serves the site at: https://percevals.github.io/Laberit-intelligence/

### Manual Deployment

You can trigger a deployment manually:
1. Go to Actions tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## Site Structure

```
/ (root)
├── index.html                    # Main DII 4.0 Framework page
├── quick-assessment/             # React app (built from source)
│   ├── index.html
│   └── assets/
├── intelligence/
│   └── weekly-reports/          # Weekly intelligence reports
├── dashboards/                  # Dashboard files
├── framework/                   # Framework documentation
└── docs/                       # Additional documentation
```

## Adding New Sections

### Static Content
Simply add HTML files to the repository. They will be automatically deployed.

### React/Vue/Angular Apps
1. Create a new directory (e.g., `new-app/`)
2. Add build steps to `.github/workflows/deploy-pages.yml`
3. Ensure the app is configured with the correct base path

### Build Configuration

For apps deployed to subdirectories, configure the base path:

**Vite (React):**
```js
// vite.config.js
export default defineConfig({
  base: '/Laberit-intelligence/your-app-name/'
})
```

**Create React App:**
```json
// package.json
"homepage": "https://percevals.github.io/Laberit-intelligence/your-app-name"
```

## Troubleshooting

### Site not updating
1. Check Actions tab for workflow status
2. Clear browser cache
3. Wait 5-10 minutes for GitHub's CDN to update

### 404 errors
1. Verify file exists in the repository
2. Check file paths are correct (case-sensitive)
3. Ensure .nojekyll file exists (prevents Jekyll processing)

### Build failures
1. Check Actions logs for error messages
2. Verify all dependencies are in package.json
3. Test build locally with `npm run build`

## Local Testing

To test the deployment structure locally:

```bash
# Build all apps
cd quick-assessment && npm run build && cd ..

# Create test structure
mkdir -p test-site
cp -r index.html intelligence test-site/
cp -r quick-assessment/dist test-site/quick-assessment

# Serve locally
cd test-site && python3 -m http.server 8080
```

Visit http://localhost:8080 to test.

## Maintenance

- Keep dependencies updated: `npm update` in each app directory
- Monitor Actions for build times and optimize if needed
- Regular cleanup of old workflow runs to save storage