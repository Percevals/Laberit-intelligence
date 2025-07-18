#!/usr/bin/env python3
"""
Test script for Business Model Mapper using existing OTX data

Tests the mapping of real threat intelligence to DII business models
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from translators.business_model_mapper import BusinessModelMapper


def load_latest_otx_data():
    """Load the most recent OTX data file"""
    data_dir = Path("data")
    otx_files = list(data_dir.glob("otx-pulses-*.json"))
    
    if not otx_files:
        print("No OTX data files found in data/")
        return None
    
    # Get the most recent file
    latest_file = max(otx_files, key=lambda x: x.stat().st_mtime)
    print(f"Loading OTX data from: {latest_file}")
    
    with open(latest_file, 'r') as f:
        return json.load(f)


def test_mapper_with_otx_data():
    """Test the business model mapper with real OTX data"""
    print("=== Business Model Mapper Test ===")
    print(f"Test Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Initialize mapper
    mapper = BusinessModelMapper()
    
    # Load OTX data
    otx_data = load_latest_otx_data()
    if not otx_data:
        # Create sample data if no OTX file exists
        print("Using sample threat data for testing...")
        otx_data = create_sample_otx_data()
    
    # Process pulses/threats
    results = []
    
    # Handle different OTX data formats
    if isinstance(otx_data, dict):
        pulses = otx_data.get("results", otx_data.get("pulses", []))
    elif isinstance(otx_data, list):
        pulses = otx_data
    else:
        pulses = []
    
    print(f"Processing {len(pulses)} threats...\n")
    
    # Analyze each pulse
    for i, pulse in enumerate(pulses[:10]):  # Limit to first 10 for testing
        print(f"\n--- Threat {i+1} ---")
        
        # Prepare threat data in expected format
        threat_data = {
            "name": pulse.get("name", "Unknown"),
            "description": pulse.get("description", ""),
            "tags": pulse.get("tags", []),
            "indicators": pulse.get("indicators", []),
            "malware_families": pulse.get("malware_families", []),
            "targeted_sectors": pulse.get("industries", [])
        }
        
        # Get analysis
        analysis = mapper.analyze_threat_context(threat_data)
        
        # Store results
        results.append({
            "threat_name": threat_data["name"],
            "analysis": analysis
        })
        
        # Print summary
        print(f"Threat: {threat_data['name'][:80]}...")
        print(f"Attack Type: {analysis['attack_type']}")
        print(f"Severity: {analysis['threat_classification']}")
        print(f"Affected Models: {analysis['affected_models']}")
        
        if analysis['primary_impact_models']:
            primary_names = [mapper.business_models[m] for m in analysis['primary_impact_models']]
            print(f"Primary Impact: {', '.join(primary_names)}")
        
        # Show model exposures
        print("\nModel Exposures:")
        for model_id, exposure in analysis['model_exposures'].items():
            impact = "**PRIMARY**" if exposure['is_primary_impact'] else ""
            print(f"  [{model_id}] {exposure['model_name']:25} - Exposure: {exposure['exposure_score']:.0%} {impact}")
    
    # Generate summary statistics
    print("\n\n=== SUMMARY STATISTICS ===")
    model_hit_count = {i: 0 for i in range(1, 9)}
    primary_hit_count = {i: 0 for i in range(1, 9)}
    
    for result in results:
        for model in result["analysis"]["affected_models"]:
            model_hit_count[model] += 1
        for model in result["analysis"]["primary_impact_models"]:
            primary_hit_count[model] += 1
    
    print("\nModel Impact Frequency:")
    for model_id in range(1, 9):
        model_name = mapper.business_models[model_id]
        hits = model_hit_count[model_id]
        primary = primary_hit_count[model_id]
        print(f"  [{model_id}] {model_name:30} - Affected: {hits:2d} times, Primary: {primary:2d} times")
    
    # Save detailed results
    output_file = f"data/business_model_mapping_{datetime.now().strftime('%Y-%m-%d')}.json"
    output_data = {
        "test_date": datetime.now().isoformat(),
        "threats_analyzed": len(results),
        "results": results,
        "statistics": {
            "model_hit_count": model_hit_count,
            "primary_hit_count": primary_hit_count
        }
    }
    
    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\n\nDetailed results saved to: {output_file}")


def create_sample_otx_data():
    """Create sample OTX-like data for testing"""
    return [
        {
            "name": "Ransomware Campaign Targeting LATAM Healthcare",
            "description": "LockBit ransomware targeting hospitals in Latin America",
            "tags": ["ransomware", "lockbit", "healthcare", "latam"],
            "indicators": [
                {"type": "FileHash-SHA256", "indicator": "abc123..."},
                {"type": "domain", "indicator": "malicious-health.com"}
            ],
            "industries": ["healthcare"]
        },
        {
            "name": "API Exploitation in E-commerce Platforms",
            "description": "Threat actors exploiting REST API endpoints in marketplace platforms",
            "tags": ["api", "exploitation", "ecommerce", "marketplace"],
            "indicators": [
                {"type": "URL", "indicator": "https://api.target.com/v1/users"},
                {"type": "IPv4", "indicator": "10.0.0.1"}
            ]
        },
        {
            "name": "Supply Chain Attack via Compromised Software Update",
            "description": "Malicious update distributed through software vendor",
            "tags": ["supply-chain", "trojan", "software"],
            "indicators": [
                {"type": "FileHash-MD5", "indicator": "d41d8cd98f00b204e9800998ecf8427e"},
                {"type": "domain", "indicator": "update-server.net"}
            ]
        },
        {
            "name": "Banking Trojan Campaign in Latin America",
            "description": "Sophisticated banking malware targeting financial institutions",
            "tags": ["banking", "trojan", "financial", "latam"],
            "indicators": [
                {"type": "email", "indicator": "phishing@bank.com"},
                {"type": "domain", "indicator": "fake-bank.com"}
            ],
            "malware_families": ["Emotet", "TrickBot"]
        },
        {
            "name": "Cobalt Strike Beacon Infrastructure",
            "description": "C2 infrastructure for Cobalt Strike operations",
            "tags": ["cobalt-strike", "c2", "apt"],
            "indicators": [
                {"type": "IPv4", "indicator": "192.168.1.1"},
                {"type": "domain", "indicator": "c2-server.net"}
            ]
        }
    ]


def test_specific_scenarios():
    """Test specific threat scenarios to validate mapping logic"""
    print("\n\n=== SPECIFIC SCENARIO TESTS ===")
    
    mapper = BusinessModelMapper()
    
    # Test scenarios
    scenarios = [
        {
            "name": "Ransomware hitting retail",
            "threat": {
                "name": "LockBit Ransomware",
                "description": "Ransomware targeting retail POS systems",
                "tags": ["ransomware", "retail", "pos"]
            },
            "expected_primary": [6],
            "expected_affected": [1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
            "name": "API attack on fintech",
            "threat": {
                "name": "Fintech API Exploitation",
                "description": "Authentication bypass in fintech platform APIs",
                "tags": ["api", "fintech", "authentication"]
            },
            "expected_primary": [4],
            "expected_affected": [2, 3, 4, 5]
        },
        {
            "name": "Healthcare data breach",
            "threat": {
                "name": "Hospital Database Breach",
                "description": "SQL injection exposing patient records",
                "tags": ["healthcare", "data breach", "sql injection"]
            },
            "expected_primary": [3],
            "expected_affected": [3, 5, 8]
        }
    ]
    
    for scenario in scenarios:
        print(f"\n[TEST] {scenario['name']}")
        result = mapper.analyze_threat_context(scenario['threat'])
        
        # Check expectations
        affected_match = set(result['affected_models']) == set(scenario['expected_affected'])
        primary_match = set(result['primary_impact_models']) == set(scenario['expected_primary'])
        
        print(f"  Expected affected: {scenario['expected_affected']}")
        print(f"  Actual affected:   {result['affected_models']} {'✓' if affected_match else '✗'}")
        print(f"  Expected primary:  {scenario['expected_primary']}")
        print(f"  Actual primary:    {result['primary_impact_models']} {'✓' if primary_match else '✗'}")


if __name__ == "__main__":
    # Create data directory if it doesn't exist
    os.makedirs("data", exist_ok=True)
    
    # Run tests
    test_mapper_with_otx_data()
    test_specific_scenarios()
    
    print("\n\nTest completed successfully!")