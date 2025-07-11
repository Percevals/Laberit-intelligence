# Repository Structure

Last updated: 2025-07-11

## Overview

The Laberit Intelligence repository follows industry best practices for Python and Node.js projects, with clear separation of concerns and purpose-driven organization.

```
Laberit-intelligence/
├── .github/                    # GitHub-specific configuration
│   └── workflows/              # GitHub Actions CI/CD
│       └── deploy.yml          # Automated deployment workflow
├── archive/                    # Historical artifacts
│   └── 2025-07-migration/      # v3.0 to v4.0 migration files
├── data/                       # Data files and datasets
│   ├── cache/                  # Temporary data (gitignored)
│   ├── *.json                  # Production data files
│   └── generate_*.py           # Data generation scripts
├── docs/                       # Documentation
│   ├── AI-INTEGRATION.md       # AI service documentation
│   ├── dii_v4_migration_notes.md # Migration methodology
│   └── REPOSITORY_STRUCTURE.md # This file
├── intelligence/               # Intelligence generation system
│   ├── dii_dashboard_generator.py # Dashboard generator
│   ├── enrich_incidents.py     # Data enrichment
│   ├── templates/              # Report templates
│   └── weekly-reports/         # Generated weekly dashboards
├── quick-assessment/           # Progressive Web App
│   ├── src/                    # React source code
│   ├── public/                 # Static assets
│   ├── package.json            # Node.js dependencies
│   └── vite.config.js          # Build configuration
├── scripts/                    # Utility scripts
│   ├── analysis/               # Data analysis tools
│   ├── migration/              # Framework migration tools
│   └── utils/                  # General utilities
├── templates/                  # Document templates
│   └── dii_v4_migration_notice.md # Client notifications
├── tests/                      # Test suites
│   ├── unit/                   # Unit tests
│   └── integration/            # Integration tests
├── .gitignore                  # Git ignore patterns
├── CHANGELOG.md                # Version history
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
├── README.md                   # Main documentation
├── SECURITY.md                 # Security policies
├── immunity-framework.html     # DII 4.0 Framework documentation
├── index.html                  # Main landing page
├── pyproject.toml              # Python project config
└── requirements.txt            # Python dependencies
```

## Key Directories

### `/data`
Production data files including:
- `dii_v4_historical_data.json` - 150 migrated assessments
- `dii_v4_benchmarks.json` - Aggregated statistics
- `dii_v4_distribution.json` - Visualization data
- `index.json` - Dataset registry

### `/intelligence`
Core intelligence generation system:
- Dashboard generators
- Data enrichment pipelines
- HTML/JSON templates

### `/quick-assessment`
DII 4.0 Quick Assessment PWA:
- React-based SPA
- Tailwind CSS styling
- GitHub Pages deployment

### `/scripts`
Organized utility scripts:
- `analysis/` - Data exploration tools
- `migration/` - v3.0 to v4.0 migration
- `utils/` - Helper scripts

## Development Workflow

1. **Setup Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Run Analysis**
   ```bash
   python scripts/analysis/analyze_master_database.py
   ```

3. **Generate Reports**
   ```bash
   python intelligence/dii_dashboard_generator.py
   ```

4. **Development Server**
   ```bash
   cd quick-assessment
   npm install
   npm run dev
   ```

## Best Practices

- Scripts in `/scripts` with clear subdirectories
- Generated files in `/data/cache` (gitignored)
- Documentation in `/docs`
- Tests in `/tests`
- Keep root directory clean
- Use `.gitignore` extensively

## CI/CD

- GitHub Actions for deployment
- Automated to GitHub Pages
- Tests run on pull requests

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.