# Weekly Intelligence Workflow Guide v3.0

## 🎯 Objective
Generate actionable weekly cybersecurity intelligence for LATAM executives using the Immunity Framework 3.0.

## 📋 Weekly Workflow Steps

### 1. **Monday: Intelligence Gathering** (30 min)
```bash
# Search for LATAM cyber incidents from past week
claude-code run "Search major cyber incidents LATAM last 7 days business impact"
```

**Sources to check:**
- SocRadar LATAM reports
- Reuters Technology
- BleepingComputer
- CyberSecurityDive
- Regional CERT alerts

### 2. **Tuesday: Data Analysis** (45 min)
Create `perplexity-input-YYYY-MM-DD.json` with:
- Key incidents (focus on business impact)
- Active threat actors
- Affected sectors with immunity scores
- Weekly metrics

### 3. **Wednesday: Dashboard Generation** (15 min)
```bash
cd intelligence/
python3 immunity_dashboard_generator.py
```

### 4. **Thursday: Review & Enhancement** (30 min)
- Verify all metrics are accurate
- Ensure business context is clear
- Add executive insights
- Test interactive elements

### 5. **Friday: Distribution** (15 min)
```bash
# Commit to GitHub
git add intelligence/immunity-dashboard-*.html
git commit -m "Weekly intelligence report: [key finding]"
git push

# Verify live URL
# https://percevals.github.io/Laberit-intelligence/intelligence/immunity-dashboard-YYYY-MM-DD.html
```

## 🔧 Common Issues & Fixes

### Issue 1: Template Not Found
```bash
# Ensure template exists
ls -la templates/immunity-dashboard-template.html

# If missing, create from existing dashboard
cp intelligence/immunity-dashboard-2025-06-28.html templates/immunity-dashboard-template.html
```

### Issue 2: Perplexity Input Missing
```bash
# Create from template
cp templates/perplexity-input-template.json intelligence/perplexity-input-$(date +%Y-%m-%d).json
```

### Issue 3: Path Issues
```bash
# Always run from repository root
cd ~/Documents/GitHub/Laberit-intelligence
python3 intelligence/immunity_dashboard_generator.py
```

## 📊 Quality Checklist

- [ ] **Executive Summary**: Clear 30-second takeaway
- [ ] **Real Incidents**: Actual LATAM cases, not generic news
- [ ] **Business Impact**: Quantified in $ or operational hours
- [ ] **Immunity Scores**: Calculated using v3.0 formula
- [ ] **Actionable Insights**: 3 specific actions per immunity level
- [ ] **Visual Clarity**: Traffic lights, clear zones, responsive design
- [ ] **Mobile Friendly**: Test on phone before publishing

## 🚀 Automation Opportunities

### GitHub Actions (Future)
```yaml
name: Weekly Intelligence
on:
  schedule:
    - cron: '0 9 * * 5' # Fridays at 9 AM
  workflow_dispatch:

jobs:
  generate-dashboard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Generate Dashboard
        run: |
          python3 intelligence/immunity_dashboard_generator.py
      - name: Commit & Push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add intelligence/immunity-dashboard-*.html
          git commit -m "Weekly intelligence update"
          git push
```

## 📈 Success Metrics

Track weekly:
- Views on dashboard (GitHub Pages analytics)
- Executive feedback
- Incidents predicted vs occurred
- Time from incident to report

## 💡 Pro Tips

1. **Focus on Business Model Impact**: Every incident should link to Business Fortress scores
2. **Regional Context**: LATAM-specific challenges, not translations
3. **Executive Language**: Results, not process
4. **Visual > Text**: Use charts, colors, icons effectively
5. **Mobile First**: Most executives check on phones

Remember: **"Your business model IS your first line of defense"**