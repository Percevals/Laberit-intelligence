# DII Assessment Platform - Monorepo Structure

## Overview

This monorepo contains the DII Assessment Platform ecosystem, which includes:
- **Assessment V2**: Comprehensive assessment platform with intelligent features
- **Intelligence Services**: AI-powered threat analysis and business intelligence
- **Shared Packages**: Reusable components and utilities

## Structure

```
dii-assessment-platform/
├── apps/
│   └── assessment-v2/           # Main Assessment Platform
├── intelligence/                # AI & Threat Intelligence Services
├── packages/                    # Shared packages (coming soon)
│   ├── @dii/core               # Core DII calculations
│   ├── @dii/types              # TypeScript types
│   ├── @dii/ui-kit             # Shared UI components
│   └── @dii/ai-utils           # AI integration utilities
└── tools/                       # Development tools
```

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Install dependencies
npm install

# Install turbo globally (optional)
npm install -g turbo
```

### Development
```bash
# Run all apps in development mode
npm run dev

# Run only Assessment Light
npm run dev:light

# Run only Assessment Premium (when available)
npm run dev:premium
```

### Building
```bash
# Build all apps
npm run build

# Build only Assessment Light
npm run build:light
```

### Testing
```bash
# Run all tests
npm run test

# Run linting
npm run lint
```

## Deployment

Assessment Light is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## Migration Status

- [x] Phase 1: Monorepo setup
- [ ] Phase 2: Extract shared packages
- [ ] Phase 3: TypeScript migration
- [ ] Phase 4: Premium platform development

## Contributing

This is a private repository. Please follow the established patterns and conventions.

## License

Proprietary - All rights reserved