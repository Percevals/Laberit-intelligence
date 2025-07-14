# Business Archetype Reference Guide - Framework v3.0 
# DEPRECATED migrated to v4.0 (See DII V4.0)

## Quick Reference Table

| Archetype | Model_Resilience | Industry Examples | Key Characteristics |
|-----------|------------------|-------------------|---------------------|
| **B2C_DIGITAL** | **0.86** | • Netflix<br>• Spotify<br>• Revolut<br>• N26 | • 100% cloud-native<br>• No physical dependencies<br>• Automated recovery |
| **PLATFORM** | **0.76** | • Uber<br>• Airbnb<br>• Amazon Marketplace<br>• PayPal | • Network effects<br>• Distributed risk<br>• Light assets |
| **HEALTHCARE** | **0.70** | • Hospitals<br>• Telemedicine<br>• Pharma<br>• Med-Tech | • Critical services<br>• Regulatory backups<br>• Mixed digital/physical |
| **B2C_VOLUME** | **0.62** | • Walmart<br>• McDonald's<br>• Target<br>• Starbucks | • Multi-channel<br>• Supply chain dependent<br>• Physical + digital |
| **B2G** | **0.54** | • Defense contractors<br>• Gov IT services<br>• Infrastructure | • Rigid contracts<br>• Legacy systems<br>• Slow adaptation |
| **B2B_IND** | **0.48** | • Manufacturing<br>• Oil & Gas<br>• Mining<br>• Chemicals | • Physical production<br>• OT/IT convergence<br>• Cannot virtualize |

## How to Identify Your Archetype

### Step 1: Primary Revenue Model
- **Digital Services Only** → B2C_DIGITAL
- **Connecting Buyers/Sellers** → PLATFORM
- **Healthcare Services** → HEALTHCARE
- **Retail/High Volume** → B2C_VOLUME
- **Government Contracts** → B2G
- **Industrial/Manufacturing** → B2B_IND

### Step 2: Operational Dependencies
Rate each from 0-10:
- Physical Infrastructure Dependency
- Digital Channel Dependency
- Supply Chain Criticality
- Regulatory Constraints

### Step 3: Recovery Capabilities
- **Fully Automated** → Higher Model_Resilience
- **Manual Possible** → Medium Model_Resilience
- **Physical Only** → Lower Model_Resilience

## Model_Resilience Calculation

```
Model_Resilience = Base_Score × Adjustment_Factors
```

### Base Scores by Archetype:
- B2C_DIGITAL: 0.86
- PLATFORM: 0.76
- HEALTHCARE: 0.70
- B2C_VOLUME: 0.62
- B2G: 0.54
- B2B_IND: 0.48

### Adjustment Factors:
- **Channel Diversity**: +0.05 to +0.10
- **Geographic Distribution**: +0.03 to +0.08
- **Revenue Diversification**: +0.02 to +0.05
- **Manual Fallback Capability**: +0.05 to +0.15
- **Single Point of Failure**: -0.10 to -0.20

## Examples by Region

### North America
- **Amazon.com**: PLATFORM (0.76) - marketplace model
- **Amazon AWS**: B2C_DIGITAL (0.86) - cloud services
- **General Motors**: B2B_IND (0.48) - manufacturing

### Europe
- **Revolut**: B2C_DIGITAL (0.86) - digital banking
- **Carrefour**: B2C_VOLUME (0.62) - retail chain
- **Airbus**: B2B_IND (0.48) - aerospace manufacturing

### Latin America
- **MercadoLibre**: PLATFORM (0.76) - marketplace
- **Nubank**: B2C_DIGITAL (0.86) - digital banking
- **FEMSA**: B2C_VOLUME (0.62) - retail operations
- **Petrobras**: B2B_IND (0.48) - oil & gas

## Industry-Specific Considerations

### Financial Services
- **Traditional Banks**: Often B2C_VOLUME (0.62) due to branches
- **Digital Banks**: B2C_DIGITAL (0.86) but vulnerable to outages
- **Payment Processors**: PLATFORM (0.76) connecting merchants

### Technology
- **SaaS Companies**: B2C_DIGITAL (0.86) highest resilience
- **Hardware Manufacturers**: B2B_IND (0.48) physical constraints
- **Marketplaces**: PLATFORM (0.76) distributed model

### Retail
- **E-commerce Pure**: B2C_DIGITAL (0.86) if no inventory
- **Omnichannel**: B2C_VOLUME (0.62) balanced approach
- **Brick & Mortar**: Lower within B2C_VOLUME range

## Strategic Insights

### Why Traditional > Digital in Resilience?

1. **Multiple Channels**
   - Digital-only: Single point of failure
   - Traditional: Branches, phone, ATM, digital

2. **Human Fallback**
   - Digital-only: No manual alternative
   - Traditional: Paper forms, in-person service

3. **Revenue Diversity**
   - Digital-only: Often single product line
   - Traditional: Multiple revenue streams

### Improving Your Model_Resilience

#### For Low Resilience (B2G, B2B_IND):
- Develop digital channels
- Create redundant operations
- Implement crisis procedures
- Consider cyber insurance

#### For High Resilience (B2C_DIGITAL, PLATFORM):
- Focus on redundancy
- Multi-region deployment
- Automated failover
- Strong incident response

## Framework v3.0 Integration

In Framework v3.0, Model_Resilience directly impacts the Business Fortress calculation:

```
Business_Fortress = Model_Resilience × (1 - Strategic_Exposure × 0.5)
```

This means:
- Higher archetype score = stronger fortress foundation
- Strategic exposure (BEI) reduces fortress strength
- Business model choice is a strategic security decision

---

*Remember: Your business model is your first line of defense. Choose wisely.*