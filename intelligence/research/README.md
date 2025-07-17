# Weekly Intelligence Research

This directory contains manually researched threat intelligence data for the DII 4.0 weekly dashboards.

## Directory Structure

```
research/
├── 2025/
│   ├── week-29/         # July 15-21, 2025
│   │   ├── raw-research.json          # Original research output
│   │   ├── weekly-intelligence.json   # Formatted for dashboard generator
│   │   └── notes.md                   # Research notes and sources
│   └── ...
└── templates/
    └── weekly-research-template.json
```

## Week Numbering

- Week numbers follow ISO 8601 standard
- Week 1 is the first week with Thursday in the new year
- Example: Week 29 of 2025 = July 14-20, 2025

## Workflow

1. **Research Phase**
   - Use the Claude research prompt
   - Save raw output as `raw-research.json`
   - Document sources in `notes.md`

2. **Processing Phase**
   - Transform data to match template structure
   - Save as `weekly-intelligence.json`
   - Validate all business models are correctly mapped

3. **Generation Phase**
   - Run `immunity_dashboard_generator_v2.py`
   - Dashboard automatically finds the current week's data
   - Output goes to `/outputs/dashboards/`

## File Formats

### raw-research.json
- Direct output from Claude or manual research
- May include extra context and sources
- Preserves original structure for audit trail

### weekly-intelligence.json
- Standardized format for dashboard generator
- Must include all required fields
- Uses DII 4.0 business model classifications
- Source-agnostic (can be from Claude, Perplexity, manual research, etc.)

### notes.md
- Research methodology
- Sources consulted
- Decisions made during classification
- Any caveats or uncertainties

## Current Week

**Week 29 (July 15-21, 2025)**
- Status: Ready for research input
- Dashboard date: 2025-07-17

## Tips

1. Always verify business model classification using:
   - CUSTODIOS: Financial, Healthcare (regulated)
   - CONECTORES: Marketplaces, Supply Chain platforms
   - PROCESADORES: Software, Data services
   - REDUNDANTES: Hybrid retail, Legacy infrastructure

2. Prioritize incidents with clear business impact
3. Include both successful defenses and breaches
4. Note detection/recovery times when available