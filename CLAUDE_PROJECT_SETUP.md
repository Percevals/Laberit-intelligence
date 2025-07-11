# Claude Project Setup: LATAM CyberIntel Automation

## 🎯 Project Name Suggestions

### Primary Recommendation:
**"LATAM CyberIntel Weekly"**
- Clear focus on region and purpose
- Easy to reference in conversations
- Professional yet approachable

### Alternative Names:
1. **"DII Intelligence Automation"** - Emphasizes the immunity framework
2. **"Weekly LATAM Threat Pipeline"** - Technical focus
3. **"Lãberit Intel Reports"** - Brand-centric

## 📋 Project Instructions for Claude

### Project Context
```
You are helping automate weekly cybersecurity intelligence reports for LATAM and Spain regions. The project uses the Digital Immunity Index (DII) framework to assess organizational resilience while under cyber attack.

Repository: https://github.com/Percevals/Laberit-intelligence
Current manual process: 2+ hours/week
Goal: Reduce to 30 minutes through automation
```

### Key Collaborators
```
1. Product Lead: Human (strategy, decisions, reviews)
2. Claude Online: Architecture, planning, code review
3. Claude Code: Implementation, testing, deployment
```

### Project Structure
```
/intelligence/
├── src/           # Python modules (MVP development)
├── config/        # Configuration files
├── data/          # Raw and processed data
├── outputs/       # Generated reports
├── weekly-reports/# Legacy reports (preserve links)
└── docs/          # Documentation
```

### MVP Roadmap (6 weeks)
```
Phase 1 (Weeks 1-2): Basic Automation
- RSS feed aggregation
- AI-powered analysis
- Auto-JSON generation

Phase 2 (Weeks 3-4): Enhanced Intelligence
- Expand data sources
- Business impact scoring
- Trend analysis

Phase 3 (Weeks 5-6): Full Automation
- Anomaly detection
- Distribution automation
- Self-healing systems
```

### Technical Stack
```
- Python 3.9+
- GitHub Actions (automation)
- OpenAI API (analysis)
- GitHub Pages (publishing)
- RSS/APIs (data collection)
```

### Current State
```
- Manual workflow documented
- Basic automation exists (OTX, IntelX APIs)
- Infrastructure reorganized and ready
- Customer links preserved for 30 days
```

### Communication Patterns
```
Claude Online: "What should our architecture look like for X?"
Claude Code: "I'll implement X following the architecture"
Human: "Let's prioritize X because of business need Y"
```

### Success Metrics
```
- Time reduction: 75% (2hr → 30min)
- Incident coverage: 10+ per week
- Zero manual JSON editing
- Consistent Friday delivery
```

## 🚀 Quick Start Commands

### For Claude Online (Strategy):
```
"Review the MVP roadmap in /intelligence/weekly-reports/README.md and suggest architectural improvements"

"Analyze the current manual workflow and identify the highest-impact automation opportunities"

"Design the data pipeline architecture for Phase 1"
```

### For Claude Code (Development):
```
"Implement news_aggregator.py following the architecture in the README"

"Create unit tests for the RSS feed parser"

"Set up GitHub Actions workflow for weekly automation"
```

### For Human (Product):
```
"Which data sources are most valuable for our customers?"

"Should we prioritize speed or accuracy in the MVP?"

"What business sectors need special attention?"
```

## 📚 Key Documents to Include

1. `/intelligence/weekly-reports/README.md` - MVP roadmap
2. `/intelligence/MIGRATION_SUMMARY.md` - Current state
3. `/weekly_workflow_guide.md` - Manual process
4. `/framework/dii_framework_v4.md` - Immunity scoring
5. `/SECURITY.md` - Security practices

## 🎨 Project Custom Instructions

```markdown
# LATAM CyberIntel Weekly - Project Instructions

You are collaborating on an automated cybersecurity intelligence system for LATAM/Spain.

## Your Role
- Claude Online: System architect and strategist
- Claude Code: Developer and implementer
- Human: Product owner and decision maker

## Key Principles
1. Start with MVP - automate highest-impact tasks first
2. Preserve backward compatibility (customer links)
3. Focus on LATAM/Spain regional threats
4. Use Digital Immunity Index for scoring
5. Maintain security best practices

## Current Sprint
Working on Phase 1 MVP (Weeks 1-2):
- RSS feed aggregation
- Basic AI analysis
- Auto-JSON generation

## Communication Style
- Be specific about which component you're discussing
- Reference file paths when possible
- Suggest concrete next steps
- Flag blockers immediately

## Success Looks Like
Weekly reports generated with 30 minutes human review, covering 10+ regional incidents with business impact analysis.
```

## 🔄 Workflow Integration

### Weekly Collaboration Cycle

**Monday**:
- Claude Code: Run automated collection
- Claude Online: Review architecture gaps

**Tuesday**:
- Claude Online: Analyze data patterns
- Claude Code: Implement improvements

**Wednesday**:
- Human: Review generated report
- Claude Code: Apply feedback

**Thursday**:
- Claude Online: Strategic recommendations
- Human: Final approval

**Friday**:
- Automated: Publish report
- All: Sprint retrospective

## 🎯 First Tasks After Setup

1. **Claude Online**: Review current architecture and suggest optimizations for news aggregation
2. **Claude Code**: Create `news_aggregator.py` skeleton with RSS feed parsing
3. **Human**: Prioritize which RSS feeds to implement first
4. **All**: Align on Phase 1 deliverables and timeline

---

*Remember: The goal is to transform a manual 2-hour process into a 30-minute review through intelligent automation while maintaining high-quality LATAM/Spain threat intelligence.*