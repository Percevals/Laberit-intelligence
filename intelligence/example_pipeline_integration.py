#!/usr/bin/env python3
"""
Example: Integrating Business Model Mapper with Weekly Intelligence Pipeline

This shows how to add business model mapping to existing pipeline
without disrupting current functionality
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Add src to path
sys.path.insert(0, 'src')

from translators.business_model_mapper import BusinessModelMapper
from translators.enhance_with_business_models import enhance_weekly_intelligence


def example_weekly_pipeline_integration():
    """
    Example of how to integrate business model mapping into weekly pipeline
    """
    print("=== Weekly Intelligence Pipeline with Business Model Mapping ===")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # Step 1: Normal weekly intelligence generation
    print("Step 1: Generate weekly intelligence (existing process)")
    weekly_intel_file = "data/weekly_intelligence_example.json"
    
    # Simulate existing weekly intelligence data
    weekly_data = {
        "metadata": {
            "generated_at": datetime.now().isoformat(),
            "week": "2025-W03"
        },
        "incidents": [
            {
                "title": "Ransomware Attack on Mexican Retail Chain",
                "date": "2025-07-10",
                "summary": "Major retail chain hit by ransomware, POS systems encrypted",
                "tags": ["ransomware", "retail", "mexico"],
                "sector": "Retail"
            },
            {
                "title": "API Breach at Colombian Fintech",
                "date": "2025-07-09", 
                "summary": "Authentication bypass in payment API exposed customer data",
                "tags": ["api", "fintech", "data-breach"],
                "sector": "Financial Services"
            }
        ]
    }
    
    # Save simulated data
    with open(weekly_intel_file, 'w') as f:
        json.dump(weekly_data, f, indent=2)
    print(f"  ✓ Weekly intelligence saved to: {weekly_intel_file}\n")
    
    # Step 2: Enhance with business model mapping
    print("Step 2: Enhance with business model mapping")
    enhanced_file = weekly_intel_file.replace('.json', '_enhanced.json')
    enhance_weekly_intelligence(weekly_intel_file, enhanced_file)
    
    # Step 3: Show the enhancement
    print("\nStep 3: Review enhanced data")
    with open(enhanced_file, 'r') as f:
        enhanced_data = json.load(f)
    
    print("\nEnhanced incidents with business model context:")
    for incident in enhanced_data["incidents"]:
        print(f"\n- {incident['title']}")
        bm_analysis = incident.get("business_model_analysis", {})
        if bm_analysis:
            affected = bm_analysis.get("affected_models", [])
            primary = bm_analysis.get("primary_impact_models", [])
            print(f"  Affected models: {affected}")
            print(f"  Primary impact: {primary}")
            print(f"  Attack type: {bm_analysis.get('attack_type', 'unknown')}")
    
    # Step 4: Show how to use in reporting
    print("\n\nStep 4: Generate business-focused insights")
    mapper = BusinessModelMapper()
    
    model_summary = {}
    for incident in enhanced_data["incidents"]:
        for model_id in incident["business_model_analysis"]["affected_models"]:
            model_name = mapper.business_models[model_id]
            if model_name not in model_summary:
                model_summary[model_name] = []
            model_summary[model_name].append(incident["title"])
    
    print("\nThreats by Business Model:")
    for model_name, incidents in sorted(model_summary.items()):
        print(f"\n{model_name}:")
        for incident in incidents:
            print(f"  - {incident}")
    
    # Clean up example files
    os.remove(weekly_intel_file)
    os.remove(enhanced_file)
    print("\n\n✅ Example complete - temporary files cleaned up")


def example_otx_integration():
    """
    Example of processing OTX data with business model mapping
    """
    print("\n\n=== OTX Data Processing with Business Models ===")
    
    mapper = BusinessModelMapper()
    
    # Example OTX pulse
    otx_pulse = {
        "name": "Qilin Ransomware Targeting Spanish Speaking Organizations",
        "description": "Qilin ransomware group actively targeting organizations in Spain and LATAM",
        "tags": ["ransomware", "qilin", "spain", "latam"],
        "indicators": [
            {"type": "domain", "indicator": "qilin-c2.example.com"},
            {"type": "FileHash-SHA256", "indicator": "abcd1234..."},
            {"type": "IPv4", "indicator": "10.0.0.1"}
        ],
        "targeted_countries": ["ES", "MX", "CO", "AR"]
    }
    
    # Process with mapper
    print(f"\nProcessing: {otx_pulse['name']}")
    analysis = mapper.analyze_threat_context(otx_pulse)
    
    # Generate report
    print(mapper.generate_model_report(otx_pulse))
    
    # Show business translation
    print("\n\nBusiness Translation:")
    print(f"This {analysis['attack_type']} campaign poses {analysis['threat_classification']} risk")
    print(f"Primary targets: {', '.join([mapper.business_models[m] for m in analysis['primary_impact_models']])}")
    print("\nRecommended actions:")
    print("- Focus ransomware defenses on affected models")
    print("- Prioritize backup testing for primary impact models")
    print("- Review incident response plans for these business units")


if __name__ == "__main__":
    # Run examples
    example_weekly_pipeline_integration()
    example_otx_integration()
    
    print("\n\n" + "="*60)
    print("Integration examples completed successfully!")
    print("The business model mapper can be integrated without")
    print("disrupting existing weekly intelligence workflows.")
    print("="*60)