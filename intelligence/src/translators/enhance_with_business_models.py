#!/usr/bin/env python3
"""
Enhancement script to add business model mappings to existing intelligence data

This integrates with the weekly intelligence pipeline without disrupting it
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from translators.business_model_mapper import BusinessModelMapper


def enhance_weekly_intelligence(input_file: str, output_file: str = None):
    """
    Enhance weekly intelligence JSON with business model mappings
    
    Args:
        input_file: Path to existing weekly intelligence JSON
        output_file: Path for enhanced output (optional, defaults to _enhanced suffix)
    """
    print(f"Enhancing intelligence data with business model mappings...")
    print(f"Input: {input_file}")
    
    # Load existing intelligence data
    with open(input_file, 'r') as f:
        intel_data = json.load(f)
    
    # Initialize mapper
    mapper = BusinessModelMapper()
    
    # Process based on data structure
    if "incidents" in intel_data:
        # Process enriched incidents format
        enhanced_incidents = []
        
        for incident in intel_data["incidents"]:
            # Prepare threat data for mapper
            threat_data = {
                "name": incident.get("title", ""),
                "description": incident.get("summary", ""),
                "tags": incident.get("tags", []),
                "indicators": incident.get("indicators", []),
                "malware_families": incident.get("malware_families", []),
                "targeted_sectors": [incident.get("immunity_impact", {}).get("sector", "")]
            }
            
            # Get business model analysis
            analysis = mapper.analyze_threat_context(threat_data)
            
            # Add business model mapping to incident
            incident["business_model_analysis"] = {
                "affected_models": analysis["affected_models"],
                "primary_impact_models": analysis["primary_impact_models"],
                "model_names": {
                    model_id: mapper.business_models[model_id] 
                    for model_id in analysis["affected_models"]
                },
                "attack_type": analysis["attack_type"],
                "model_exposures": analysis["model_exposures"]
            }
            
            enhanced_incidents.append(incident)
        
        intel_data["incidents"] = enhanced_incidents
        
        # Update metadata
        if "metadata" not in intel_data:
            intel_data["metadata"] = {}
        
        intel_data["metadata"]["business_model_enhancement"] = {
            "enhanced_date": datetime.now().isoformat(),
            "mapper_version": "1.0.0",
            "total_incidents_mapped": len(enhanced_incidents)
        }
        
    elif "results" in intel_data or isinstance(intel_data, list):
        # Process OTX or similar format
        results = intel_data.get("results", intel_data) if isinstance(intel_data, dict) else intel_data
        enhanced_results = []
        
        for item in results:
            threat_data = {
                "name": item.get("name", ""),
                "description": item.get("description", ""),
                "tags": item.get("tags", []),
                "indicators": item.get("indicators", []),
                "malware_families": item.get("malware_families", [])
            }
            
            analysis = mapper.analyze_threat_context(threat_data)
            
            item["business_model_analysis"] = {
                "affected_models": analysis["affected_models"],
                "primary_impact_models": analysis["primary_impact_models"],
                "model_names": {
                    model_id: mapper.business_models[model_id] 
                    for model_id in analysis["affected_models"]
                },
                "attack_type": analysis["attack_type"],
                "threat_classification": analysis["threat_classification"]
            }
            
            enhanced_results.append(item)
        
        if isinstance(intel_data, dict):
            intel_data["results"] = enhanced_results
        else:
            intel_data = enhanced_results
    
    # Determine output file
    if not output_file:
        input_path = Path(input_file)
        output_file = str(input_path.parent / f"{input_path.stem}_business_enhanced{input_path.suffix}")
    
    # Save enhanced data
    with open(output_file, 'w') as f:
        json.dump(intel_data, f, indent=2, ensure_ascii=False)
    
    print(f"Output: {output_file}")
    print(f"Enhancement complete!")
    
    # Generate summary statistics
    print("\n=== Business Model Mapping Summary ===")
    model_counts = {i: 0 for i in range(1, 9)}
    
    if "incidents" in intel_data:
        for incident in intel_data["incidents"]:
            for model in incident["business_model_analysis"]["affected_models"]:
                model_counts[model] += 1
    
    for model_id, count in model_counts.items():
        if count > 0:
            print(f"[{model_id}] {mapper.business_models[model_id]:30} - {count} incidents")


def enhance_otx_data(otx_file: str):
    """
    Specifically enhance OTX pulse data with business model mappings
    
    Args:
        otx_file: Path to OTX JSON file
    """
    print(f"Enhancing OTX data: {otx_file}")
    
    with open(otx_file, 'r') as f:
        data = json.load(f)
    
    # Handle null data
    if data is None:
        print("OTX data is null, skipping enhancement")
        return
    
    # Create output filename
    output_file = otx_file.replace('.json', '_business_enhanced.json')
    
    enhance_weekly_intelligence(otx_file, output_file)


def main():
    """Main entry point for command line usage"""
    if len(sys.argv) < 2:
        print("Usage: python enhance_with_business_models.py <input_file> [output_file]")
        print("\nExample:")
        print("  python enhance_with_business_models.py data/enriched_incidents_2025-07-11.json")
        print("  python enhance_with_business_models.py data/raw/otx_result.json")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    if not os.path.exists(input_file):
        print(f"Error: Input file not found: {input_file}")
        sys.exit(1)
    
    enhance_weekly_intelligence(input_file, output_file)


if __name__ == "__main__":
    main()