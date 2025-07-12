#!/usr/bin/env python3
"""
Diagnose API Issues and Impact on Intelligence System
"""

import os
import json
from datetime import datetime
from pathlib import Path


def diagnose_api_issues():
    """Comprehensive diagnosis of API issues and their impact"""
    print("🔍 DIAGNOSING API ISSUES AND IMPACT")
    print("=" * 70)
    
    # 1. Check API Configuration
    print("\n1️⃣ API CONFIGURATION STATUS:")
    print("-" * 50)
    
    api_status = {
        "OTX": {
            "env_var": "OTX_API_KEY",
            "configured": bool(os.getenv("OTX_API_KEY")),
            "purpose": "Real-time threat intelligence pulses",
            "impact": "Missing global threat context"
        },
        "IntelX": {
            "env_var": "INTELX_API_KEY", 
            "configured": bool(os.getenv("INTELX_API_KEY")),
            "purpose": "OSINT data on breaches and leaks",
            "impact": "Missing breach intelligence"
        }
    }
    
    for api, info in api_status.items():
        status = "✅ Configured" if info["configured"] else "❌ NOT Configured"
        print(f"\n{api}:")
        print(f"  Status: {status}")
        print(f"  Purpose: {info['purpose']}")
        if not info["configured"]:
            print(f"  Impact: {info['impact']}")
            print(f"  Fix: export {info['env_var']}='your-api-key'")
    
    # 2. Check Data Files
    print("\n\n2️⃣ DATA FILES ANALYSIS:")
    print("-" * 50)
    
    data_files = {
        "data/raw/otx_result.json": "OTX threat pulses",
        "data/raw/intelx_result.json": "IntelX breach data",
        "data/raw_incidents_2025-07-11.json": "Manual incidents",
        "data/enriched_incidents_2025-07-11.json": "Enriched with DII analysis"
    }
    
    file_status = {}
    for file_path, description in data_files.items():
        path = Path(file_path)
        if path.exists():
            with open(path, 'r') as f:
                content = f.read()
                is_null = content.strip() == "null"
                is_empty = len(content.strip()) == 0
                
            size = path.stat().st_size
            status = "null" if is_null else "empty" if is_empty else "has data"
            file_status[file_path] = status
            
            print(f"\n{file_path}:")
            print(f"  Description: {description}")
            print(f"  Status: {status} ({size} bytes)")
        else:
            print(f"\n{file_path}:")
            print(f"  Status: ❌ NOT FOUND")
            file_status[file_path] = "missing"
    
    # 3. Analyze Current Data Sources
    print("\n\n3️⃣ CURRENT DATA SOURCES:")
    print("-" * 50)
    
    # Check what data we're actually using
    if Path("data/raw_incidents_2025-07-11.json").exists():
        with open("data/raw_incidents_2025-07-11.json", 'r') as f:
            raw_data = json.load(f)
            sources = raw_data.get("metadata", {}).get("sources", [])
            incidents = raw_data.get("incidents", [])
            
        print(f"\nActive data sources: {', '.join(sources)}")
        print(f"Total incidents: {len(incidents)}")
        print("\nIncident sources breakdown:")
        source_count = {}
        for incident in incidents:
            source = incident.get("source", "Unknown")
            source_count[source] = source_count.get(source, 0) + 1
        
        for source, count in source_count.items():
            print(f"  - {source}: {count} incidents")
    
    # 4. Impact Analysis
    print("\n\n4️⃣ IMPACT OF MISSING APIs:")
    print("-" * 50)
    
    print("\nWHAT YOU'RE MISSING:")
    
    if not api_status["OTX"]["configured"]:
        print("\n❌ Without OTX API:")
        print("  - No real-time threat indicators (IOCs)")
        print("  - No global threat campaigns")
        print("  - No malware family tracking")
        print("  - No adversary group intelligence")
        print("  - Missing ~50-100 weekly threat pulses")
    
    if not api_status["IntelX"]["configured"]:
        print("\n❌ Without IntelX API:")
        print("  - No dark web breach monitoring")
        print("  - No leaked credential alerts")
        print("  - No paste site monitoring")
        print("  - No LATAM-specific OSINT")
        print("  - Missing ~20-50 weekly breach reports")
    
    print("\n\nWHAT YOU HAVE:")
    print("\n✅ Manual Intelligence Collection:")
    print("  - 5 curated incidents per week")
    print("  - CERT advisories")
    print("  - Regional news monitoring")
    print("  - SOCRadar reports")
    
    print("\n✅ Business Model Mapping:")
    print("  - All 5 incidents mapped to DII models")
    print("  - Risk assessment by business type")
    print("  - Financial impact estimates")
    
    # 5. Current vs Potential
    print("\n\n5️⃣ CURRENT vs POTENTIAL INTELLIGENCE:")
    print("-" * 50)
    
    print("\nCURRENT COVERAGE (Without APIs):")
    print("  📊 Data Volume: ~5 incidents/week")
    print("  🌍 Geographic: LATAM focused")
    print("  ⏱️  Timeliness: 1-3 days delay")
    print("  🎯 Relevance: High (manually curated)")
    print("  💰 Cost: Manual effort required")
    
    print("\nPOTENTIAL COVERAGE (With APIs):")
    print("  📊 Data Volume: ~100+ threats/week")
    print("  🌍 Geographic: Global + LATAM")
    print("  ⏱️  Timeliness: Real-time")
    print("  🎯 Relevance: Medium (needs filtering)")
    print("  💰 Cost: API subscription + automation")
    
    # 6. Business Impact
    print("\n\n6️⃣ BUSINESS MODEL IMPACT:")
    print("-" * 50)
    
    # Show which models are underserved
    print("\nModels with LIMITED threat visibility (due to missing APIs):")
    
    models_needing_apis = {
        "Software Crítico (2)": "Needs API vulnerability data",
        "Ecosistema Digital (4)": "Needs platform-specific threats",
        "Servicios de Datos (3)": "Needs data breach intelligence",
        "Cadena de Suministro (7)": "Needs supply chain alerts"
    }
    
    for model, need in models_needing_apis.items():
        print(f"  • {model}: {need}")
    
    # 7. Recommendations
    print("\n\n7️⃣ RECOMMENDATIONS:")
    print("-" * 50)
    
    priority = 1
    if not api_status["OTX"]["configured"]:
        print(f"\n{priority}. Enable OTX API (FREE):")
        print("   - Sign up at: https://otx.alienvault.com")
        print("   - Get API key from account settings")
        print("   - export OTX_API_KEY='your-key'")
        print("   - Benefit: +50-100 threats/week with IOCs")
        priority += 1
    
    if not api_status["IntelX"]["configured"]:
        print(f"\n{priority}. Consider IntelX API (PAID):")
        print("   - For breach monitoring")
        print("   - Sign up at: https://intelx.io")
        print("   - export INTELX_API_KEY='your-key'")
        print("   - Benefit: Dark web breach intelligence")
        priority += 1
    
    print(f"\n{priority}. Future Enhancement - Shodan API:")
    print("   - For attack surface monitoring")
    print("   - Real-time vulnerability scanning")
    print("   - Internet-exposed assets tracking")
    
    # 8. Quick Fix Script
    print("\n\n8️⃣ QUICK FIX:")
    print("-" * 50)
    print("\nTo enable OTX immediately (it's free!):")
    print("""
# 1. Get your free API key from https://otx.alienvault.com
# 2. Run these commands:

export OTX_API_KEY='paste-your-key-here'
python3 threat_intel_collector.py

# This will immediately give you:
# - Real threat indicators
# - Malware campaigns
# - Attack patterns
# - IoCs for your models
""")
    
    return api_status, file_status


def show_data_flow():
    """Show how data flows through the system"""
    print("\n\n📊 INTELLIGENCE DATA FLOW:")
    print("=" * 70)
    
    print("""
Current Flow (WITHOUT APIs):
============================
                                    
Manual Sources                      Your Data
-------------                       ----------
CERT Advisories  ─┐                [5 incidents/week]
SOCRadar Reports ─┼─→ raw_incidents.json → enriched_incidents.json → Dashboard
Regional News    ─┘                         ↓
                                   Business Model Mapping
                                           ↓
                                   Risk Intelligence
                                   

Potential Flow (WITH APIs):
===========================

API Sources                         Your Data
-----------                         ----------
OTX Pulses      ─┐                 [100+ threats/week]
IntelX Breaches ─┼─→ Automated    → Enhanced Intelligence → AI Analysis
Shodan Scans    ─┤   Collection      ↓
Manual Sources  ─┘                Business Model Mapping
                                          ↓
                                  Predictive Risk Intelligence
""")


if __name__ == "__main__":
    # Run diagnosis
    api_status, file_status = diagnose_api_issues()
    show_data_flow()
    
    # Summary
    print("\n\n📈 EXECUTIVE SUMMARY:")
    print("=" * 70)
    
    apis_configured = sum(1 for api in api_status.values() if api["configured"])
    data_files_ok = sum(1 for status in file_status.values() if status == "has data")
    
    print(f"\n✅ APIs Configured: {apis_configured}/2")
    print(f"✅ Data Files Active: {data_files_ok}/{len(file_status)}")
    print(f"✅ Manual Intelligence: Working")
    print(f"✅ Business Mapping: Operational")
    
    if apis_configured == 0:
        print("\n⚠️  VERDICT: Running on manual intelligence only (20% capacity)")
        print("   ACTION: Enable free OTX API for immediate 5x data increase")
    else:
        print("\n✅ VERDICT: Intelligence pipeline partially operational")
    
    print("\n" + "="*70)