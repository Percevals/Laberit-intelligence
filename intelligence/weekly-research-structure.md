# Weekly Intelligence Research Structure

## Current Situation
- The file `perplexity-input-2025-07-17.json` was created today (July 17 at 10:48)
- This is the synthetic data I created earlier in our session for demonstration
- It contains example data but not real current week incidents

## Recommended Folder Structure

```
intelligence/
├── outputs/
│   ├── dashboards/          # Final HTML dashboards
│   └── reports/             # PDF/MD reports
├── research/                # NEW - Weekly research data
│   ├── 2025/
│   │   ├── week-28/        # July 15-21, 2025
│   │   │   ├── raw-research.json
│   │   │   ├── weekly-intelligence.json
│   │   │   └── notes.md
│   │   ├── week-29/
│   │   └── ...
│   └── templates/
│       └── research-template.json
├── data/                    # Automated collection (when APIs active)
│   ├── otx/
│   ├── intelx/
│   └── enriched/
└── archive/                 # Historical data
    └── 2025/
```

## Benefits of This Structure

1. **Clear Separation**: Research data vs automated data
2. **Week-based Organization**: Easy to find and reference
3. **Version Control**: Each week's research is preserved
4. **Audit Trail**: Can track how intelligence evolved
5. **Template Reuse**: Consistent structure across weeks

## Migration Plan

1. Create the new structure
2. Move the existing file to the proper location
3. Save Claude's new research there
4. Update dashboard generator to look in both locations

## File Naming Convention

- Research data: `research/2025/week-XX/raw-research.json`
- Dashboard input: `research/2025/week-XX/weekly-intelligence.json`
- Generated dashboard: `outputs/dashboards/immunity-dashboard-2025-MM-DD.html`

## Research Source Agnostic

The system now supports intelligence from any source:
- Claude AI research
- Perplexity research
- Manual threat hunting
- OSINT aggregation
- Combined sources

The `weekly-intelligence.json` format remains consistent regardless of source.