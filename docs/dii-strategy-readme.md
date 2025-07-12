# DII Assessment Platform - Project Context

## 🎯 Project Overview

The **Digital Immunity Index (DII) Assessment Platform** is a dual-system application that measures organizations' ability to maintain operations during cyberattacks. It provides both quick assessments and comprehensive consultancy services for LATAM/Spain markets (200-5000 employees).

### Core Philosophy
> "We assume you're compromised and focus on making it work"

## 🎨 Strategic Vision

### The Journey
We're building a dual-system platform that transforms cybersecurity from a technical checkbox into a business resilience metric. The platform evolves from a simple assessment tool to a comprehensive cyber resilience ecosystem.

### End State Vision
```
┌─────────────────────────────────────────────────┐
│            DII Ecosystem Platform               │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Light]              [Premium]       [Market]  │
│  Quick Check   →    Deep Analysis  →  Trading  │
│    Free              Consultancy      Community │
│                                                 │
│  ┌─────────┐      ┌─────────┐     ┌─────────┐ │
│  │ 30 min  │      │ 2-5 days│     │ P2P Risk│ │
│  │ DII: 4.5│  →   │ Roadmap │  →  │ Exchange│ │
│  │ Top 3   │      │ $10-25K │     │ Future  │ │
│  └─────────┘      └─────────┘     └─────────┘ │
│                                                 │
│        Powered by AI + Real Intelligence        │
└─────────────────────────────────────────────────┘
```

### Value Creation Path
1. **Awareness** (Light): "I have a problem"
2. **Understanding** (Premium): "Here's how to fix it"
3. **Community** (Future): "Let's solve it together"

## 🏗️ Architecture Philosophy

### Core Principles
- **Business First**: Technology serves business outcomes
- **Progressive Disclosure**: Complexity hidden until needed
- **Intelligence Driven**: Real threats, real solutions
- **Community Powered**: Collective resilience

### Technical Strategy
- **Modular by Design**: Each piece can evolve independently
- **API-First**: Everything is a service
- **AI-Native**: Intelligence augments human decisions
- **Cloud-Agnostic**: Deploy anywhere

## 📁 Repository Structure

```
Laberit-intelligence/               # Main repository (this is the monorepo root)
├── apps/
│   ├── assessment-light/          # Current Quick Assessment (30 min, free)
│   └── assessment-premium/        # [PLANNED] Consultancy Platform (2-5 days, paid)
├── packages/
│   ├── @dii/core/                # [PENDING] DII calculations & business logic
│   ├── @dii/types/               # [PENDING] TypeScript definitions
│   ├── @dii/ui-kit/              # [PENDING] Shared components
│   └── @dii/ai-utils/            # [PLANNED] AI/Oracle utilities
├── docs/
│   ├── DII-DUAL-SYSTEM-STRATEGY.md   # Technical strategy document
│   └── prototypes/               # [PLANNED] Reference implementations
├── framework/                     # DII v4.0 framework documentation
├── intelligence/                  # Weekly intelligence reports
├── package.json                  # Workspace root
└── turbo.json                   # Turborepo configuration
```

## 🚀 Product Evolution Roadmap

### Phase 1: Foundation (Current)
**Goal**: Establish credibility with quick value
- Enhanced Light Assessment with basic AI
- Clear value proposition
- First 100 users validation

### Phase 2: Differentiation (Q1 2025)
**Goal**: Create clear Light/Premium tiers
- Premium platform launch
- Advanced Oracle capabilities
- First paying customers

### Phase 3: Intelligence (Q2 2025)
**Goal**: Become the trusted source
- Real-time threat integration
- Predictive analytics
- Industry partnerships

### Phase 4: Ecosystem (Q3 2025)
**Goal**: Build the community
- Risk trading marketplace
- Peer benchmarking
- Collective defense network

### Phase 5: Platform (Q4 2025)
**Goal**: Become the standard
- API ecosystem
- White-label options
- Regional expansion

## 💻 Technical Stack

### Current Implementation
- **Frontend**: React 18 + JavaScript (migrating to TypeScript)
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Build**: Vite + Turborepo
- **Deployment**: GitHub Pages (assessment-light)
- **Package Manager**: npm workspaces

### Planned Additions
- **TypeScript**: Full migration in progress
- **Testing**: Vitest + Playwright
- **AI**: Claude API integration
- **Backend**: [TBD - Node.js likely]
- **Database**: [TBD - PostgreSQL planned]

## 🎯 Key Features by Tier

### Assessment Light (Current Focus)
- 5-question quick assessment (30 min)
- DII Score calculation (1-10 scale)
- Basic Oracle (3 interactions max)
- PDF/WhatsApp export
- Free/Freemium model
- Static deployment

### Assessment Premium (Planned)
- Comprehensive evaluation (2-5 days)
- Advanced Oracle (unlimited)
- Project management
- Weekly Intelligence integration
- Custom simulations
- $5K-25K USD pricing

## 🤖 AI Strategy

### DII Oracle Integration
- **Prototype**: Exists in conversation history, needs integration
- **Light Version**: Template-based, 3 interactions max
- **Premium Version**: Full Claude API, unlimited interactions
- **Differentiation**: Clear value prop between tiers

## 📊 Business Context

### Target Market
- **Region**: LATAM + Spain
- **Company Size**: 200-5000 employees
- **Languages**: Spanish (primary), Portuguese, English
- **Problem**: Companies need practical cybersecurity resilience, not complex reports

### Unique Value Proposition
- **Business Model First**: Risk assessment based on business model, not industry
- **Operational Focus**: "How well do you function under attack?"
- **Clear Metrics**: Single DII Score that executives understand
- **Actionable**: ROI-focused recommendations

## 🔧 Development Guidelines

### Code Principles
1. **Modularity**: Everything should be reusable between Light/Premium
2. **Type Safety**: Strict TypeScript (migration in progress)
3. **Testing**: 80% coverage minimum
4. **Security**: DevSecOps from design
5. **Performance**: Light app must load in <2s

### Architecture Decisions
- **Monorepo**: Chosen for code sharing between apps
- **Static First**: Light remains static for simplicity
- **Progressive Enhancement**: Premium adds backend as needed
- **AI Gateway**: Centralized AI calls for cost control

## 📝 Important Documents

### Must Read
1. `/docs/DII-DUAL-SYSTEM-STRATEGY.md` - Complete technical strategy
2. `/framework/dii_framework_v4.md` - DII methodology
3. `/framework/dii_datastructure_v4.md` - Data structures and calculations

### Reference Materials
- `/intelligence/weekly-reports/` - Weekly threat intelligence
- `/docs/ARCHITECTURE-DECISION.md` - Monorepo decision rationale
- Prototype code in conversation history (Oracle implementation)

## 🎯 Strategic Differentiation

### Why DII Wins

#### vs. Traditional Security Assessments
| Traditional | DII Platform |
|------------|--------------|
| 200-page reports | 1 number + 3 actions |
| Technical jargon | Business language |
| Annual snapshots | Continuous monitoring |
| Generic frameworks | Business model specific |
| Fear-based selling | ROI-based value |

#### Unique Advantages
1. **Business Model DNA**: 8 models with specific risk profiles
2. **Operational Focus**: "Function under attack" not "prevent all attacks"
3. **LATAM Reality**: Built for regional constraints and culture
4. **AI + Human**: Augmented intelligence, not replacement

### Market Positioning
```
High Price │ Traditional Consultancies
          │ (Deloitte, PwC)
          │
          │         [Premium]
          │      DII Consultancy ← Sweet Spot
          │         
          │ [Light]  
          │ DII Quick ← Entry Point
          │
Low Price │ Generic Tools
          └─────────────────────
            Simple        Complex
```

## 🤝 Working with This Codebase

### For Claude/AI Assistants
- Always check `/docs/DII-DUAL-SYSTEM-STRATEGY.md` first
- Maintain backward compatibility with current deployment
- Test each change incrementally
- Respect the Light/Premium differentiation
- Keep business value as north star

### For Developers
- Run `npm install` from root
- Use `npm run dev` to start development
- Check `turbo.json` for available commands
- Follow TypeScript migration when adding new code
- Document decisions in `/docs/ARCHITECTURE-DECISION.md`

## 🌟 Success Metrics

### Platform Health
- **Adoption**: Light users converting to Premium (>5%)
- **Engagement**: Weekly active users in Intelligence
- **Satisfaction**: NPS > 50
- **Revenue**: MRR growth 20% monthly

### Impact Metrics
- **Resilience**: Average DII improvement +2 points/year
- **Prevention**: Incidents avoided (tracked via testimonials)
- **Community**: Active participants in risk trading
- **Recognition**: Industry citations and partnerships