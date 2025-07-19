# Intelligence Platform Deployment Strategy

## Vision
A modern, self-managed intelligence platform that enables meaningful commercial conversations through automated weekly reports with signature visualizations.

## Architecture

### 1. GitHub Pages Deployment
```
Domain: https://percevals.github.io/Laberit-intelligence/
├── /                     # Latest weekly dashboard
├── /archive/            # Historical dashboards
├── /2025/week-29/       # Specific week
├── /methodology/        # DII framework explanation
└── /demo/               # Interactive demo for sales
```

### 2. Data Flow
```
Threat Analyst
    ↓
Updates /intelligence/research/
    ↓
GitHub Action (weekly)
    ↓
Builds React App
    ↓
Deploys to GitHub Pages
    ↓
Customer accesses via URL
```

### 3. Key Features for Commercial Use

#### A. Executive Dashboard
- **Hero Visual**: ImmunityGauge showing overall score
- **Balance View**: DimensionBalance showing strengths/weaknesses
- **Peer Comparison**: "You vs Industry Average"
- **Trend Analysis**: "Your progress over time"

#### B. Conversation Starters
- **Red Flags**: "Your HFP score puts you at risk"
- **Quick Wins**: "Improve TRD by 2 points = 15% risk reduction"
- **ROI Calculator**: "Investment vs Risk Reduction"
- **Next Steps**: Clear action items

#### C. Sharing Features
- **Unique URL**: /reports/company-name/2025-week-29
- **PDF Export**: One-click executive summary
- **Email Template**: Pre-written follow-up
- **Calendar Link**: "Schedule improvement discussion"

### 4. Commercial Team Workflow

```yaml
Monday Morning:
  - New report available
  - Email notification to sales team
  - Customer alerts sent

Sales Call Prep:
  - Open customer dashboard
  - Review red flags
  - Prepare recommendations
  
During Meeting:
  - Screen share dashboard
  - Walk through visualizations
  - Use what-if calculator
  - Book follow-up

Post-Meeting:
  - Send PDF summary
  - Track engagement
  - Update CRM
```

### 5. Technical Implementation

#### GitHub Actions Workflow
```yaml
name: Weekly Intelligence Deploy

on:
  schedule:
    - cron: '0 8 * * 1'  # Every Monday 8 AM
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        
      - name: Install dependencies
        run: |
          cd apps/intelligence-app
          npm install
          
      - name: Build app
        run: |
          cd apps/intelligence-app
          npm run build
          
      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: apps/intelligence-app/dist
          branch: gh-pages
```

#### React Router Configuration
```typescript
// For GitHub Pages compatibility
<BrowserRouter basename="/Laberit-intelligence">
  <Routes>
    <Route path="/" element={<LatestDashboard />} />
    <Route path="/archive" element={<Archive />} />
    <Route path="/:year/week-:week" element={<WeeklyDashboard />} />
    <Route path="/demo" element={<InteractiveDemo />} />
  </Routes>
</BrowserRouter>
```

### 6. Customer Value Props

1. **Always Current**: "See your security posture as of this week"
2. **Benchmarked**: "Compare against 500+ companies"
3. **Actionable**: "Three things to do this month"
4. **Trackable**: "Watch your progress over time"
5. **Shareable**: "Brief your board with one link"

### 7. Success Metrics

- **Engagement**: Weekly views per customer
- **Conversion**: Dashboards → Meetings booked
- **Retention**: Customers checking weekly
- **Action**: Improvements implemented
- **NPS**: Customer satisfaction with insights

## Next Steps

1. Fix visualization package TypeScript errors
2. Set up GitHub Actions workflow
3. Configure GitHub Pages
4. Create demo content for sales team
5. Build email templates
6. Train commercial team

## Questions to Address

1. Should each customer have a unique URL path?
2. Do we need basic auth for sensitive customers?
3. How long to retain historical data?
4. What export formats are needed?
5. Integration with CRM/email tools?