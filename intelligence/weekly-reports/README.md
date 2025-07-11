# Weekly Intelligence Reports - Automated Pipeline

## Overview

Automated weekly cybersecurity intelligence reports focusing on LATAM and Spain regions, delivering actionable insights through the Digital Immunity Index framework.

## 🎯 MVP Scope (Sprint 1 - 2 weeks)

### Goal
Transform the current 2+ hour manual process into a 30-minute review process by automating data collection and initial analysis.

### MVP Features
1. **Automated News Aggregation** - RSS feeds from 5 key LATAM sources
2. **Basic AI Analysis** - Auto-summarize top 10 incidents
3. **Auto-JSON Generation** - Eliminate manual file creation
4. **Enhanced Dashboard** - Add automation status indicators

### Success Metrics
- ✅ Reduce manual effort by 60% (2 hours → 45 minutes)
- ✅ Zero manual JSON editing required
- ✅ Consistent weekly delivery every Friday
- ✅ Cover minimum 10 regional incidents per week

## 📋 Implementation Roadmap

### Phase 1: MVP Foundation (Weeks 1-2)
**Objective**: Basic automation with human review

#### Week 1: Data Collection Infrastructure
- [ ] Set up RSS feed aggregator for LATAM sources
- [ ] Create `news_aggregator.py` with basic filtering
- [ ] Implement data deduplication
- [ ] Add to GitHub Actions workflow

#### Week 2: AI Integration & Generation
- [ ] Integrate OpenAI/Claude API for summaries
- [ ] Create `auto_json_generator.py`
- [ ] Update dashboard generator for new data format
- [ ] Implement basic quality checks

**Deliverable**: Automated pipeline requiring 45min human review

### Phase 2: Enhanced Intelligence (Weeks 3-4)
**Objective**: Smarter analysis and broader coverage

- [ ] Add 5 more regional data sources
- [ ] Implement business impact scoring algorithm
- [ ] Create trend analysis module
- [ ] Add Spanish/Portuguese language processing
- [ ] Enhance dashboard visualizations

**Deliverable**: 80% automated pipeline with rich insights

### Phase 3: Full Automation (Weeks 5-6)
**Objective**: Near-zero manual intervention

- [ ] Implement anomaly detection
- [ ] Add predictive analytics
- [ ] Create executive summary generator
- [ ] Build distribution automation
- [ ] Add self-healing error handling

**Deliverable**: 15-minute review process, daily capability

## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────┐
│         GitHub Actions (Weekly)          │
└────────────────┬────────────────────────┘
                 │
    ┌────────────▼────────────┐
    │   news_aggregator.py    │
    │  ├─ RSS Feed Parser     │
    │  ├─ Deduplication       │
    │  └─ LATAM Filter        │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │    ai_analyzer.py       │
    │  ├─ Incident Summary    │
    │  ├─ Impact Assessment   │
    │  └─ Immunity Scoring    │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │ auto_json_generator.py  │
    │  ├─ Data Validation     │
    │  ├─ Format Conversion   │
    │  └─ Quality Checks      │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │ dashboard_generator.py  │
    │    (existing, enhanced)  │
    └────────────┬────────────┘
                 │
         ┌───────▼────────┐
         │  GitHub Pages  │
         └────────────────┘
```

## 🚀 Quick Start (MVP)

### Prerequisites
```bash
# Required API keys (add to GitHub Secrets)
OPENAI_API_KEY=your_key_here
OTX_API_KEY=existing_key
INTELX_API_KEY=existing_key
```

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Test news aggregation
python news_aggregator.py --test

# Generate test report
python generate_weekly_report.py --date 2025-07-11
```

### Configuration
Create `config/sources.yaml`:
```yaml
rss_feeds:
  - url: https://www.soc-radar.com/feed/
    region: LATAM
    language: es
  - url: https://www.welivesecurity.com/es/feed/
    region: LATAM
    language: es
  # Add more feeds here
```

## 📊 Data Sources

### MVP Sources (Phase 1)
1. **SOCRadar LATAM** - Regional threat intelligence
2. **WeLiveSecurity ES** - ESET Spanish reports  
3. **CERT Colombia** - National CERT alerts
4. **Fluid Attacks Blog** - LATAM security research
5. **INCIBE** - Spanish cybersecurity institute

### Future Sources (Phase 2+)
- CERT Brazil, Argentina, Mexico
- Regional security vendors
- Telegram channels
- Twitter/X monitoring
- Dark web forums (automated)

## 🔄 Workflow

### Automated Pipeline (MVP)
```mermaid
graph LR
    A[Monday 00:00 UTC] -->|GitHub Action| B[Collect News]
    B --> C[AI Analysis]
    C --> D[Generate JSON]
    D --> E[Create Dashboard]
    E --> F[Deploy to Pages]
    F --> G[Human Review]
    G --> H[Publish/Share]
```

### Human Tasks (MVP)
1. **Review** generated insights (15 min)
2. **Enhance** executive summary (15 min)
3. **Approve** and distribute (15 min)

## 📈 Success Metrics

### MVP Metrics
- **Time Saved**: 75% reduction (target: 30 min/week)
- **Coverage**: 10+ incidents per week
- **Accuracy**: 90% relevant incidents
- **Delivery**: 100% on-time (Fridays)

### Long-term Metrics
- **Automation Rate**: 95%
- **Source Coverage**: 20+ feeds
- **Languages**: Spanish, Portuguese, English
- **Delivery Frequency**: Daily capability

## 🛠️ Development Guidelines

### Code Standards
- Python 3.9+
- Type hints required
- 90% test coverage
- Documented functions

### AI Integration
- Use OpenAI GPT-4 for analysis
- Implement rate limiting
- Cache API responses
- Fallback to manual on errors

### Security
- API keys in environment only
- No sensitive data in logs
- Validate all external input
- Regular dependency updates

## 🗓️ Sprint Planning

### Sprint 1 (MVP)
- **Duration**: 2 weeks
- **Goal**: Basic automation
- **Stories**:
  - Setup RSS aggregation (8 pts)
  - Integrate AI analysis (13 pts)
  - Auto-generate JSON (8 pts)
  - Update dashboard (5 pts)

### Sprint 2 (Enhancement)
- **Duration**: 2 weeks
- **Goal**: Smarter analysis
- **Stories**:
  - Add 5 sources (8 pts)
  - Business scoring (13 pts)
  - Trend analysis (8 pts)
  - Visualizations (8 pts)

### Sprint 3 (Automation)
- **Duration**: 2 weeks  
- **Goal**: Full automation
- **Stories**:
  - Anomaly detection (13 pts)
  - Distribution automation (8 pts)
  - Self-healing (13 pts)
  - Documentation (5 pts)

## 📚 Resources

### Documentation
- [Weekly Workflow Guide](../../weekly_workflow_guide.md) - Current manual process
- [DII Framework](../../framework/dii_framework_v4.md) - Immunity scoring
- [Deployment Guide](../../docs/DEPLOYMENT-GUIDE.md) - CI/CD setup

### APIs
- [OpenAI API](https://platform.openai.com/docs)
- [AlienVault OTX](https://otx.alienvault.com/api)
- [RSS Parser](https://pythonhosted.org/feedparser/)

## 🤝 Contributing

1. Follow sprint planning
2. Create feature branches
3. Add tests for new code
4. Update documentation
5. Request reviews

## 📞 Support

- **Technical Issues**: Create GitHub issue
- **Security Concerns**: security@laberit.com
- **Feature Requests**: Use discussions

---

**Next Step**: Start Sprint 1 by implementing `news_aggregator.py` with basic RSS feed collection for LATAM security news.