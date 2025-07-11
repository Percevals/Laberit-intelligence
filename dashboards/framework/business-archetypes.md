# Business Archetypes and Model Resilience Scores

## Overview

The Model Resilience score reflects a business model's inherent ability to maintain operations during cyber incidents. This metric is **independent of security maturity** and depends solely on the business architecture's structural characteristics.

## The 6 Business Archetypes

### 1. B2C_DIGITAL (Model Resilience: 0.86)
**Highest Resilience**

#### Characteristics:
- Fully digital native operations
- Cloud-first infrastructure
- Automated customer interactions
- Minimal physical dependencies
- Rapid deployment and rollback capabilities

#### Examples:
- **Streaming Services**: Netflix, Spotify, Disney+
- **Digital Banks**: Revolut, N26, Chime
- **SaaS Platforms**: Zoom, Slack, Notion
- **Online Gaming**: Steam, Epic Games

#### Why High Resilience:
- Can operate from anywhere with internet
- Built-in redundancy and failover
- Automated recovery processes
- No physical supply chain dependencies

---

### 2. PLATFORM (Model Resilience: 0.76)
**High Resilience**

#### Characteristics:
- Marketplace or aggregator model
- Network effects drive value
- Light asset model
- Digital-first but may have physical components

#### Examples:
- **Marketplaces**: Amazon Marketplace, eBay, Etsy
- **Gig Economy**: Uber, DoorDash, Airbnb
- **Social Platforms**: LinkedIn, Twitter, Instagram
- **Payment Platforms**: PayPal, Stripe

#### Why High Resilience:
- Distributed risk across multiple vendors/providers
- Core platform can operate while individual participants fail
- Usually have multiple revenue streams
- Strong digital infrastructure

---

### 3. HEALTHCARE (Model Resilience: 0.70)
**Moderate-High Resilience**

#### Characteristics:
- Mix of digital and physical operations
- Critical service requirements
- Regulatory compliance needs
- Life-critical systems with built-in redundancies

#### Examples:
- **Hospitals**: Mayo Clinic, Cleveland Clinic
- **Telemedicine**: Teladoc, Amwell
- **Health Tech**: Epic Systems, Cerner
- **Pharmaceutical**: Pfizer, Johnson & Johnson

#### Why Moderate-High Resilience:
- Essential services must continue
- Often have manual backup procedures
- Regulatory requirements ensure continuity planning
- Mix of digital and physical provides flexibility

---

### 4. B2C_VOLUME (Model Resilience: 0.62)
**Moderate Resilience**

#### Characteristics:
- High transaction volume retail
- Physical and digital presence
- Inventory management critical
- Supply chain dependencies

#### Examples:
- **Retail Chains**: Walmart, Target, Home Depot
- **Fast Food**: McDonald's, Starbucks
- **E-commerce**: Traditional retailers with online presence
- **Grocery**: Kroger, Tesco, Carrefour

#### Why Moderate Resilience:
- Can shift between channels (online/offline)
- Physical stores can operate independently
- But supply chain disruptions impact heavily
- Inventory systems critical for operations

---

### 5. B2G (Model Resilience: 0.54)
**Lower-Moderate Resilience**

#### Characteristics:
- Government contracts primary revenue
- Long sales cycles
- Heavy compliance requirements
- Often legacy system integration

#### Examples:
- **Defense Contractors**: Lockheed Martin, Raytheon
- **IT Services**: Booz Allen, SAIC
- **Infrastructure**: Construction firms, utilities contractors
- **Consulting**: Deloitte Government, Accenture Federal

#### Why Lower-Moderate Resilience:
- Rigid contract requirements
- Cannot easily pivot operations
- Legacy system dependencies
- Slow decision-making processes

---

### 6. B2B_IND (Model Resilience: 0.48)
**Lowest Resilience**

#### Characteristics:
- Industrial/manufacturing focus
- Physical production facilities
- Just-in-time supply chains
- OT/IT convergence challenges

#### Examples:
- **Manufacturing**: General Motors, Boeing, Caterpillar
- **Oil & Gas**: ExxonMobil, Shell, BP
- **Chemicals**: BASF, Dow Chemical
- **Steel/Mining**: ArcelorMittal, Rio Tinto

#### Why Lowest Resilience:
- Physical production cannot be virtualized
- Supply chain disruptions halt operations
- OT systems difficult to patch/update
- Safety systems prevent rapid changes

---

## Key Insight: Why Traditional > Fintech?

### The Paradox Explained

**Traditional businesses often score higher than fintechs because:**

1. **Multiple Operating Channels**
   - Traditional banks: Branches, ATMs, phone, online
   - Fintech: Often 100% digital dependent

2. **Manual Fallback Procedures**
   - Traditional: Paper forms, manual processing possible
   - Fintech: No alternative when systems fail

3. **Diverse Revenue Streams**
   - Traditional: Multiple products, services, fees
   - Fintech: Often single product dependent

4. **Established Relationships**
   - Traditional: Direct relationships, multiple touchpoints
   - Fintech: App-only relationships vulnerable to outages

### Example: Traditional Bank vs Digital Bank

**Traditional Bank (Model Resilience: 0.65)**
- Cyber incident impacts online banking
- Customers can still:
  - Visit branches
  - Use ATMs
  - Call phone banking
  - Process transactions manually

**Digital Bank (Model Resilience: 0.45)**
- Cyber incident impacts systems
- Customers cannot:
  - Access any services
  - Withdraw money
  - Make payments
  - Contact support (if digital-only)

---

## Calculating Model Resilience

Model Resilience is calculated based on:

1. **Channel Diversity** (30%)
   - Number of independent operating channels
   - Physical vs digital mix

2. **Revenue Resilience** (25%)
   - Diversity of revenue streams
   - Subscription vs transaction based

3. **Operational Flexibility** (25%)
   - Ability to operate manually
   - Geographic distribution

4. **Critical Dependencies** (20%)
   - Single points of failure
   - Third-party dependencies

---

## Implications for Immunity Framework

The Model Resilience score directly impacts the overall Immunity Index through the Resilience component:

```
Resilience = Model_Resilience × Cyber_Resilience × (1 - BEI × 0.5)
```

This means:
- A fintech with perfect security may still have low immunity
- A traditional business with moderate security might score higher
- Business model transformation affects cyber resilience
- Digital transformation must consider resilience trade-offs

---

## Best Practices by Archetype

### High Digital Dependency (B2C_DIGITAL, PLATFORM)
- Invest heavily in redundancy
- Multi-region deployments
- Automated failover systems
- Strong incident response

### Mixed Models (HEALTHCARE, B2C_VOLUME)
- Maintain manual procedures
- Cross-train staff on multiple channels
- Regular failover testing
- Balance digital innovation with resilience

### Physical Operations (B2G, B2B_IND)
- Focus on OT security
- Implement air-gapped backups
- Develop crisis management plans
- Consider cyber insurance heavily

---

*Note: These scores are baselined from industry analysis and should be adjusted based on specific organizational characteristics.*