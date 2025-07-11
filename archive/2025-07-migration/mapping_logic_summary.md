# DII 4.0 Mapping Logic Summary

## Overview
This document summarizes the mapping logic used to transition from MasterDatabaseV3.1 client archetypes to DII 4.0 models.

## DII 4.0 Models

| Model | Description | Focus Area |
|-------|-------------|------------|
| A-RC | Recovery Optimized for All Threats | Comprehensive recovery capabilities |
| C-RY | Recovery Optimized for Cyber Threats | Cyber-specific recovery |
| A-RS | Resilience Optimized for All Threats | Balanced resilience approach |
| C-RS | Resilience Optimized for Cyber Threats | Cyber-focused resilience |
| A-RG | Response Optimized for All Threats | Response and mitigation |
| C-RG | Response Optimized for Cyber Threats | Cyber incident response |

## Mapping Priority Rules

### Priority 1: Archetype Mapping (Highest Weight)
Direct mapping based on the client's archetype:
- ARCHETYPE_01 → A-RC (95% confidence)
- ARCHETYPE_02 → C-RY (95% confidence)
- ARCHETYPE_03 → A-RS (90% confidence)
- ARCHETYPE_04 → C-RS (90% confidence)
- ARCHETYPE_05 → A-RG (85% confidence)
- ARCHETYPE_06 → C-RG (85% confidence)

### Priority 2: Business Model Modifiers
- **B2B**: +5% confidence, 20% cyber preference
- **B2C**: +3% confidence, 10% all-threats preference
- **B2G**: +8% confidence, 15% resilience preference

### Priority 3: Cloud Adoption Impact
- **HIGH**: 10% cyber boost, 5% recovery boost
- **MEDIUM**: 5% resilience boost
- **LOW**: 5% response boost, 5% all-threats boost

### Priority 4: Sector Preferences
- **FINANCIAL**: Prefers C-RS, C-RY (+10% boost)
- **HEALTHCARE**: Prefers A-RS, A-RC (+10% boost)
- **RETAIL**: Prefers C-RG, A-RG (+8% boost)
- **TECHNOLOGY**: Prefers C-RY, C-RS (+12% boost)
- **MANUFACTURING**: Prefers A-RC, A-RS (+8% boost)
- **GOVERNMENT**: Prefers A-RS, C-RS (+15% boost)

## Mapping Algorithm

1. Start with base archetype mapping
2. Apply business model modifiers
3. Adjust for cloud adoption level
4. Apply sector-specific preferences
5. Normalize scores and select highest scoring model
6. Calculate confidence based on all factors

## Key Insights from Analysis

Based on the demonstration data:
- **C-RY (Cyber Recovery)** is most common (27.5% of clients)
- **A-RS (All-threats Resilience)** serves 20.4% of clients
- **C-RS (Cyber Resilience)** covers 19.6% of clients
- Average mapping confidence: 74.0%
- Financial and Technology sectors tend toward cyber-focused models
- Healthcare and Government prefer balanced all-threats approaches

## Recovery Agility Indicators

The analysis also attempts to extract recovery agility metrics from additional sheets, looking for:
- RTO (Recovery Time Objective)
- RPO (Recovery Point Objective)
- MTTR (Mean Time To Recover)
- Agility scores
- Recovery performance metrics

These indicators, when available, can further refine the mapping confidence and recommendations.