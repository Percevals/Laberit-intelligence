#!/usr/bin/env python3
"""
Quick test to visualize Business Model Mapper results
Shows exactly what you can do with the enhanced data
"""

import json
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, 'src')
from translators.business_model_mapper import BusinessModelMapper
from translators.enhance_with_business_models import enhance_weekly_intelligence


def quick_test():
    """Quick visual test of what the mapper does"""
    print("🚀 QUICK BUSINESS MODEL MAPPER TEST")
    print("=" * 60)
    
    # 1. First, let's enhance your existing data
    print("\n1️⃣ ENHANCING YOUR LATEST INTELLIGENCE DATA...")
    
    # Find your latest enriched incidents
    data_files = list(Path("data").glob("enriched_incidents_*.json"))
    if data_files:
        latest_file = max(data_files, key=lambda x: x.stat().st_mtime)
        print(f"   Found: {latest_file}")
        
        # Check if already enhanced
        enhanced_file = Path(str(latest_file).replace('.json', '_business_enhanced.json'))
        if not enhanced_file.exists():
            print("   Enhancing with business models...")
            enhance_weekly_intelligence(str(latest_file))
        else:
            print(f"   Already enhanced: {enhanced_file}")
        
        # Load and show results
        with open(enhanced_file, 'r') as f:
            data = json.load(f)
        
        print("\n2️⃣ WHAT YOU NOW HAVE:")
        print("-" * 60)
        
        # Show summary by business model
        model_impacts = {}
        mapper = BusinessModelMapper()
        
        for incident in data['incidents']:
            bm_analysis = incident.get('business_model_analysis', {})
            if bm_analysis:
                for model_id in bm_analysis['affected_models']:
                    model_name = mapper.business_models[model_id]
                    if model_name not in model_impacts:
                        model_impacts[model_name] = {
                            'count': 0,
                            'incidents': [],
                            'primary_count': 0
                        }
                    
                    model_impacts[model_name]['count'] += 1
                    model_impacts[model_name]['incidents'].append(incident['title'])
                    
                    if model_id in bm_analysis['primary_impact_models']:
                        model_impacts[model_name]['primary_count'] += 1
        
        print("\n📊 BUSINESS MODEL RISK DASHBOARD")
        print("-" * 60)
        for model_name, impact in sorted(model_impacts.items(), key=lambda x: x[1]['count'], reverse=True):
            risk_level = "🔴 CRITICAL" if impact['primary_count'] > 0 else "🟡 AFFECTED"
            print(f"\n{model_name} {risk_level}")
            print(f"   Incidents: {impact['count']} total ({impact['primary_count']} primary impact)")
            for incident in impact['incidents'][:2]:  # Show first 2
                print(f"   • {incident[:60]}...")
        
        print("\n\n3️⃣ ACTIONABLE INSIGHTS FOR YOUR DASHBOARD:")
        print("-" * 60)
        
        # Find most at-risk models
        critical_models = [name for name, impact in model_impacts.items() if impact['primary_count'] > 0]
        if critical_models:
            print(f"\n🎯 PRIMARY TARGETS: {', '.join(critical_models[:3])}")
            print("   → These business models are PRIMARY targets in recent attacks")
            print("   → Focus immediate security reviews here")
        
        # Attack type summary
        attack_types = {}
        for incident in data['incidents']:
            attack = incident.get('business_model_analysis', {}).get('attack_type', 'unknown')
            attack_types[attack] = attack_types.get(attack, 0) + 1
        
        print(f"\n⚡ TOP ATTACK VECTORS:")
        for attack, count in sorted(attack_types.items(), key=lambda x: x[1], reverse=True):
            print(f"   • {attack}: {count} incidents")
        
        # Financial impact by model
        print(f"\n💰 FINANCIAL EXPOSURE BY MODEL:")
        model_costs = {}
        for incident in data['incidents']:
            cost = incident.get('financial_impact', {}).get('estimated_cost_usd', 0)
            for model_id in incident.get('business_model_analysis', {}).get('affected_models', []):
                model_name = mapper.business_models[model_id]
                model_costs[model_name] = model_costs.get(model_name, 0) + cost
        
        for model, total_cost in sorted(model_costs.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"   • {model}: ${total_cost:,.0f} potential impact")
        
    else:
        print("   No enriched incidents found. Creating sample...")
        create_sample_and_test()
    
    print("\n\n4️⃣ WHAT YOU CAN DO WITH THIS:")
    print("-" * 60)
    print("✅ Add 'Business Model Risk' widget to dashboard")
    print("✅ Show which of your 8 models are under attack")
    print("✅ Prioritize security spend by PRIMARY impact models")
    print("✅ Create CEO-friendly view: 'Your e-commerce platform is at risk'")
    print("✅ Track trends: 'Ransomware shifting from retail to fintech'")
    
    print("\n\n5️⃣ DASHBOARD INTEGRATION IDEAS:")
    print("-" * 60)
    print("""
1. Risk Heat Map (8 boxes, one per model):
   [🔴 Servicios Financieros] [🟡 Comercio Híbrido] [🟢 Software Crítico]
   
2. Attack Pattern Trends:
   Week 1: API attacks → Ecosistema Digital
   Week 2: Ransomware → Infraestructura Heredada
   
3. C-Suite Summary:
   "3 attacks this week targeted companies like yours"
   "Primary risk: Your legacy infrastructure (Model 6)"
   "Estimated exposure: $1.8M based on similar incidents"
""")


def create_sample_and_test():
    """Create a sample to show functionality"""
    sample_data = {
        "metadata": {"generated_at": datetime.now().isoformat()},
        "incidents": [
            {
                "title": "Cobalt Strike hits LATAM banks",
                "summary": "Advanced threat targeting financial sector",
                "tags": ["cobalt-strike", "banking", "latam"]
            },
            {
                "title": "Ransomware encrypts retailer POS",
                "summary": "LockBit targeting retail chains",
                "tags": ["ransomware", "retail", "pos"]
            }
        ]
    }
    
    # Save and enhance
    sample_file = "data/sample_test.json"
    with open(sample_file, 'w') as f:
        json.dump(sample_data, f)
    
    enhance_weekly_intelligence(sample_file)
    
    # Show enhanced version
    with open(sample_file.replace('.json', '_business_enhanced.json'), 'r') as f:
        enhanced = json.load(f)
    
    print("\n📋 SAMPLE ENHANCEMENT:")
    for inc in enhanced['incidents']:
        print(f"\nOriginal: {inc['title']}")
        bm = inc['business_model_analysis']
        print(f"Enhanced: Affects models {bm['affected_models']}")
        print(f"          Primary impact on model {bm['primary_impact_models']}")


if __name__ == "__main__":
    quick_test()
    
    print("\n" + "="*60)
    print("💡 TIP: Run this after each weekly intelligence update")
    print("        to see business model impacts immediately!")
    print("="*60)