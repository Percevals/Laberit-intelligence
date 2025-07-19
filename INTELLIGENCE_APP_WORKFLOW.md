# Intelligence Platform Workflow Guide

## Architecture Overview

The Intelligence Platform now uses a **hybrid architecture** that separates:
- **Application code** (React app) in `/apps/intelligence-app/`
- **Intelligence data** (research & outputs) in `/intelligence/`

This separation ensures:
- ✅ Security: Different access permissions for code vs data
- ✅ Collaboration: Threat analysts work only with data files
- ✅ Modularity: React components shared across multiple apps

## Directory Structure

```
/Laberit-intelligence/
├── apps/
│   ├── assessment-v2/
│   │   └── packages/
│   │       └── @dii/visualizations/    # Shared signature visuals
│   └── intelligence-app/               # React application (developers only)
│       ├── src/
│       ├── public/
│       │   └── intel-data/            # Symlink to /intelligence/
│       └── package.json
│
└── intelligence/                       # Data directory (analysts + developers)
    ├── research/                       # Threat analyst workspace
    │   └── 2025/
    │       └── week-29/
    │           ├── raw-research.json
    │           └── weekly-intelligence.json
    ├── scripts/                        # Python data processors
    └── outputs/                        # Generated reports
```

## Workflows

### For Threat Analysts

1. **Research & Data Collection**
   ```bash
   cd /intelligence/research/2025/week-30/
   # Add your research data files
   ```

2. **Process Data**
   ```bash
   python3 /intelligence/scripts/process_weekly_data.py
   # This generates weekly-intelligence.json
   ```

3. **Verify Output**
   - Check `/intelligence/research/2025/week-30/weekly-intelligence.json`
   - Ensure all required fields are populated
   - No need to access React app or understand code

### For Developers

1. **Run Intelligence App**
   ```bash
   cd /apps/intelligence-app/
   npm run dev
   # App automatically reads latest data from /intelligence/
   ```

2. **View Dashboard**
   - Open http://localhost:5173
   - Dashboard shows signature visualizations:
     - ImmunityGauge (arc gauge)
     - DimensionBalance (yin-yang visual)

3. **Deploy Updates**
   ```bash
   npm run build
   # Deploy dist/ folder to hosting service
   ```

## Data Flow

```
[Threat Analyst Research]
         ↓
[/intelligence/research/]
         ↓
[Python Processing Scripts]
         ↓
[/intelligence/research/.../weekly-intelligence.json]
         ↓
[React App reads via symlink]
         ↓
[Dashboard with Signature Visuals]
```

## Key Features

### Signature Visualizations
1. **ImmunityGauge**: Shows overall DII score (1-10 scale)
   - Auto-colored based on maturity stage
   - FRÁGIL (red), ROBUSTO (orange), RESILIENTE (blue), ADAPTATIVO (green)

2. **DimensionBalance**: Shows 5 dimensions in yin-yang design
   - TRD & AER (Resilience - top/green)
   - HFP, BRI & RRG (Vulnerability - bottom/purple)

### Data Requirements
The `weekly-intelligence.json` must include:
- `week_summary`: Overall metrics and key insight
- `dii_dimensions`: Values for TRD, AER, HFP, BRI, RRG
- `business_model_insights`: Analysis per business model
- `incidents`: Recent security incidents
- `recommendations`: Prioritized actions

## Development vs Production

### Development
- App reads from local files via symlink
- Hot reload on data changes
- No authentication required

### Production Options
1. **Static Build**: Include data in build process
2. **API Server**: Serve data via REST endpoints
3. **CDN**: Host JSON files on CDN

## Troubleshooting

### "No data available" error
- Check symlink: `/apps/intelligence-app/public/intel-data/`
- Verify data exists: `/intelligence/research/2025/week-XX/weekly-intelligence.json`

### Visualization not showing
- Ensure `immunity_avg` is between 1-10
- Check dimension values are normalized (1-10 scale)

### Build fails
- Run `npm install` in `/apps/intelligence-app/`
- Check `@dii/visualizations` package is linked correctly

## Next Steps

1. **For Analysts**: Continue using existing workflow in `/intelligence/`
2. **For Developers**: 
   - Add authentication if needed
   - Set up automated deployment
   - Create historical views
   - Add export functionality

## Contact

- **Threat Intelligence**: Work in `/intelligence/` directory
- **App Development**: Work in `/apps/intelligence-app/`
- **Visualizations**: Shared components in `/apps/assessment-v2/packages/@dii/visualizations/`