# Intelligence Platform - React App

Modern, cloud-based intelligence dashboard for commercial team engagement.

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Automatically deploys to GitHub Pages every Monday at 8 AM UTC.

Manual deployment:
```bash
git push origin main
```

## Architecture

```
/apps/intelligence-app/
├── src/
│   ├── components/     # Dashboard components
│   ├── hooks/         # Data fetching hooks
│   ├── pages/         # Route pages
│   └── config/        # Configuration
├── public/
│   └── intel-data/    # Symlink to /intelligence/data/
└── dist/              # Production build
```

## Features

- **Weekly Intelligence Reports**: Automated updates every Monday
- **Signature Visualizations**: ImmunityGauge and DimensionBalance
- **Commercial Demo**: Interactive demo for sales conversations
- **GitHub Pages**: Cloud deployment for customer access

## Data Flow

1. Threat analysts update `/intelligence/research/`
2. GitHub Action builds React app
3. Deploys to `https://percevals.github.io/Laberit-intelligence/`
4. Commercial team shares with customers

## URLs

- Production: https://percevals.github.io/Laberit-intelligence/
- Demo: https://percevals.github.io/Laberit-intelligence/#/demo
- Archive: https://percevals.github.io/Laberit-intelligence/#/archive