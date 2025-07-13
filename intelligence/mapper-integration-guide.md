# Enhanced Business Model Mapper - Integration Guide

## Overview

This guide explains how to integrate the Enhanced Business Model Mapper (dual-language version) with your existing intelligence pipeline to provide richer context for the DII Assessment application.

## Architecture Flow

```
Weekly Intelligence Pipeline
           ↓
    Business Model Mapper (existing)
           ↓
    Enhanced Business Model Mapper (new)
           ↓
    Enriched Intelligence Data
           ↓
    DII Assessment App (consumes rich context)
```

## Integration Steps

### 1. File Structure

```
intelligence/
├── src/translators/
│   ├── business_model_mapper.py          # Existing (keep as-is)
│   ├── enhanced_business_model_mapper.py # New enhancement
│   └── enhance_with_business_models.py   # Update to use both
├── data/
│   ├── weekly_intelligence.json          # Raw intelligence
│   ├── business_enhanced.json            # After basic mapping
│   └── executive_enhanced.json           # After dual-language enhancement
```

### 2. Update the Enhancement Script

Modify `src/translators/enhance_with_business_models.py` to include both mappers:

```python
#!/usr/bin/env python3
"""
Enhances weekly intelligence with business models AND executive translations
"""

import json
from pathlib import Path
from business_model_mapper import BusinessModelMapper
from enhanced_business_model_mapper import EnhancedBusinessModelMapper

def enhance_weekly_intelligence(input_file, output_file=None):
    """
    Two-stage enhancement:
    1. Basic business model mapping (existing)
    2. Dual-language enrichment (new)
    """
    
    # Load intelligence data
    with open(input_file, 'r', encoding='utf-8') as f:
        intelligence_data = json.load(f)
    
    # Stage 1: Basic business model mapping (existing)
    basic_mapper = BusinessModelMapper()
    
    # Stage 2: Enhanced dual-language mapping
    enhanced_mapper = EnhancedBusinessModelMapper()
    
    # Process each threat/incident
    if 'incidents' in intelligence_data:
        for incident in intelligence_data['incidents']:
            # First: Basic business model analysis (existing)
            basic_analysis = basic_mapper.map_threat_to_models(
                incident.get('title', ''),
                incident.get('description', ''),
                incident.get('tags', []),
                incident.get('iocs', {})
            )
            
            # Add basic analysis
            incident['business_model_analysis'] = basic_analysis
            
            # Second: Enhanced analysis for assessment context
            enhanced_analysis = enhanced_mapper.analyze_threat(incident)
            
            # Add rich context for assessment app
            incident['assessment_context'] = {
                'executive_briefing': enhanced_analysis['executive_summary'],
                'pitch_points': enhanced_analysis['threat_analysis']['pitch_points'],
                'business_explanation': enhanced_analysis['threat_analysis']['business'],
                'recommendations': enhanced_analysis['recommendations'],
                'impact_narrative': enhanced_analysis['business_model_impact']['impact_narrative']
            }
    
    # Save enhanced data
    if not output_file:
        output_file = input_file.replace('.json', '_assessment_ready.json')
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(intelligence_data, f, indent=2, ensure_ascii=False)
    
    return output_file
```

### 3. Data Flow to Assessment App

The DII Assessment app can now consume this richer context:

```python
# In your assessment app
def load_intelligence_context(company_name, industry):
    """
    Loads relevant intelligence with business context
    """
    # Load the enhanced intelligence data
    with open('data/weekly_intelligence_assessment_ready.json', 'r') as f:
        intelligence = json.load(f)
    
    # Filter relevant threats for this company
    relevant_threats = []
    for incident in intelligence.get('incidents', []):
        # Match by industry, tags, or business model
        if matches_company_profile(incident, company_name, industry):
            relevant_threats.append({
                'threat': incident['title'],
                'business_impact': incident['assessment_context']['executive_briefing'],
                'your_risk': incident['assessment_context']['impact_narrative'],
                'key_question': incident['assessment_context']['business_explanation']['key_question'],
                'quick_actions': incident['assessment_context']['recommendations']['quick_win']
            })
    
    return relevant_threats[:3]  # Top 3 most relevant
```

### 4. Assessment App Integration Points

The assessment app can leverage this rich context at multiple points:

#### A. Company Search Results
```python
# When user searches for company
def enhance_company_search(company_name):
    context = load_intelligence_context(company_name, detected_industry)
    
    return {
        'company': company_name,
        'recent_threats': context,  # Rich, pre-analyzed threats
        'opening_message': generate_opening(context)
    }

def generate_opening(threat_context):
    if threat_context:
        top_threat = threat_context[0]
        return f"I see {top_threat['threat']} is affecting companies like yours. {top_threat['key_question']}"
    return "Let's check your cyber resilience level."
```

#### B. Dynamic Question Generation
```python
# Generate questions based on actual threats
def generate_assessment_questions(threat_context):
    questions = []
    
    for threat in threat_context:
        # Use the rich context to create relevant questions
        if 'ransomware' in threat['threat'].lower():
            questions.append({
                'question': threat['key_question'],
                'why_asking': threat['business_impact']['headline'],
                'if_yes_risk': threat['your_risk']
            })
    
    return questions
```

#### C. Results and Recommendations
```python
# Show results with real context
def generate_assessment_results(answers, threat_context):
    results = {
        'risk_level': calculate_risk(answers),
        'contextualized_risks': []
    }
    
    for threat in threat_context:
        if user_vulnerable_to(threat, answers):
            results['contextualized_risks'].append({
                'threat': threat['threat'],
                'your_exposure': threat['business_impact']['financial_exposure'],
                'why_vulnerable': threat['your_risk'],
                'immediate_action': threat['quick_actions'],
                'similar_companies': threat['business_impact']['similar_incidents']
            })
    
    return results
```

### 5. Weekly Pipeline Integration

Add to your weekly intelligence generation script:

```bash
#!/bin/bash
# weekly_intelligence_pipeline.sh

# Step 1: Generate base intelligence (existing)
python3 generate_weekly_intelligence.py

# Step 2: Basic business model mapping (existing)
python3 src/translators/enhance_with_business_models.py data/weekly_intelligence.json

# Step 3: Enhanced mapping for assessment (new)
python3 src/translators/enhanced_mapper_integration.py data/weekly_intelligence_business_enhanced.json

# Step 4: Prepare for assessment app
cp data/weekly_intelligence_assessment_ready.json ../assessment-app/data/
```

### 6. API Endpoint for Assessment App

If the assessment app needs real-time access:

```python
# Simple API endpoint
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/intelligence/context/<company_name>')
def get_company_context(company_name):
    """
    Returns rich intelligence context for assessment
    """
    # Load latest enhanced intelligence
    context = load_intelligence_context(
        company_name, 
        request.args.get('industry')
    )
    
    return jsonify({
        'company': company_name,
        'threats': context,
        'generated_date': get_latest_intelligence_date(),
        'assessment_guidance': {
            'opening_question': context[0]['key_question'] if context else None,
            'risk_indicators': extract_risk_indicators(context),
            'industry_comparison': get_industry_stats(context)
        }
    })
```

## Benefits for Assessment App

### 1. **Richer Opening Conversations**
Instead of: "Let's assess your security"
Now: "LockBit ransomware hit 3 retailers like you last week. Can you operate without computers for 10 days?"

### 2. **Contextual Questions**
Instead of: "Do you have backups?"
Now: "Company X couldn't restore for 15 days after similar attack. When did you last test a full restore?"

### 3. **Meaningful Comparisons**
Instead of: "Your score is 65/100"
Now: "Companies with your profile lost $2-5M to these attacks. You're exposed to 2 of the 3 trending threats."

### 4. **Actionable Results**
Instead of: "Improve your security"
Now: "Enable email banners (0 cost) - would have stopped the phishing that hit your competitor"

## Data Examples

### Input: Weekly Intelligence
```json
{
  "incidents": [{
    "title": "Ransomware Campaign Targeting LATAM Retail",
    "description": "LockBit group using invoice-themed phishing",
    "tags": ["ransomware", "retail", "lockbit"]
  }]
}
```

### Output: Assessment-Ready Context
```json
{
  "incidents": [{
    "title": "Ransomware Campaign Targeting LATAM Retail",
    "assessment_context": {
      "executive_briefing": {
        "headline": "Ransomware attacks cost $500K-$10M and Can't Operate",
        "key_question": "Can you operate without computers for 10 days?",
        "financial_exposure": "$500K-$10M depending on size"
      },
      "pitch_points": {
        "elevator_pitch": "Companies like ours are losing $500K-$10M to ransomware. Recovery takes 5-15 days. For 20:1 ROI, we can prevent this.",
        "urgency_driver": "3 competitors hit this quarter"
      },
      "recommendations": {
        "immediate_check": "Verify backups actually restore (test one now)",
        "quick_win": "Test restore 3 critical systems TODAY"
      }
    }
  }]
}
```

## Testing the Integration

```python
# test_integration.py
def test_assessment_context_generation():
    # Test with sample threat
    sample_threat = {
        "title": "Supply Chain Attack via IT Provider",
        "tags": ["supply_chain", "msp", "ransomware"]
    }
    
    # Run through both mappers
    enhanced = run_full_enhancement(sample_threat)
    
    # Verify assessment context
    assert 'assessment_context' in enhanced
    assert 'key_question' in enhanced['assessment_context']['executive_briefing']
    assert 'quick_win' in enhanced['assessment_context']['recommendations']
    
    print("✓ Assessment context properly generated")
    print(f"  Key Question: {enhanced['assessment_context']['executive_briefing']['key_question']}")
    print(f"  Quick Win: {enhanced['assessment_context']['recommendations']['quick_win']}")
```

## Next Steps

1. **Test with real intelligence data** from this week
2. **Validate context relevance** with a few company examples  
3. **Build assessment app endpoints** to consume this data
4. **Create feedback loop** - which contexts led to meaningful assessments?

The enhanced mapper is now a bridge between your intelligence service and assessment app, providing rich, business-relevant context that makes assessments more valuable and credible.