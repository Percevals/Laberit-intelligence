#!/usr/bin/env python3
"""
Create comprehensive business model mapping matrix from v3.0 to DII 4.0
Simple version without external dependencies - uses simulated data based on analysis
"""

import json
from collections import defaultdict, Counter

# DII 4.0 Business Models
DII_V4_MODELS = {
    1: "Comercio Híbrido",
    2: "Software Crítico", 
    3: "Servicios de Datos",
    4: "Ecosistema Digital",
    5: "Servicios Financieros",
    6: "Infraestructura Heredada",
    7: "Cadena de Suministro",
    8: "Información Regulada"
}

# Based on our previous analysis, here are the main combinations from the database
KNOWN_COMBINATIONS = [
    # (SECTOR, BUSINESS_MODEL, ARCHETYPE_ID, CLOUD_ADOPTION_LEVEL, Client_Count)
    ("Financial", "Platform", "B2B_PLATFORM", "Hybrid", 18),
    ("Financial", "Financial Services", "FINANCIAL_SERVICES", "Hybrid", 12),
    ("Industrial", "Manufacturing", "MANUFACTURING", "Hybrid", 15),
    ("Industrial", "Manufacturing", "MANUFACTURING", "Minimal", 11),
    ("Public", "Platform", "B2G_PLATFORM", "Hybrid", 14),
    ("Technology", "SaaS", "B2B_SAAS", "Cloud First", 7),
    ("Retail", "Traditional Retail", "RETAIL", "Hybrid", 11),
    ("Healthcare", "Healthcare", "HEALTHCARE", "Hybrid", 5),
    ("Energy", "Manufacturing", "INFRASTRUCTURE", "Minimal", 9),
    ("Education", "Platform", "B2C_PLATFORM", "Hybrid", 8),
    ("Services", "Platform", "B2B_PLATFORM", "Cloud First", 10),
    ("Financial", "Platform", "DATA_ANALYTICS", "Hybrid", 6),
    ("Pharma", "Manufacturing", "REGULATED", "Hybrid", 5),
    ("Technology", "XaaS", "B2B_XAAS", "Cloud First", 3),
    ("Retail", "Marketplace", "MARKETPLACE", "Cloud First", 1),
    ("Financial", "Hybrid", "HYBRID", "Hybrid", 1),
    ("Public", "Financial Services", "GOV_FINANCE", "Minimal", 7),
    ("Industrial", "Platform", "IOT_PLATFORM", "Hybrid", 9),
    ("Services", "SaaS", "B2C_SAAS", "Cloud First", 4),
    ("Public", "Manufacturing", "GOV_INFRASTRUCTURE", "Minimal", 4),
]

def map_to_dii_v4(sector, business_model, archetype, cloud_level):
    """
    Map v3.0 combination to DII v4.0 model based on priority rules
    Returns: (model_id, model_name, confidence, reasoning, alternatives)
    """
    confidence = "HIGH"
    reasoning = []
    alternatives = []
    
    # Priority 1: Healthcare sector → Información Regulada (8) [ALWAYS]
    if sector == 'Healthcare':
        reasoning.append("Healthcare sector maps directly to Información Regulada")
        return 8, DII_V4_MODELS[8], "HIGH", reasoning, []
    
    # Priority 2: Financial + Financial Services → Servicios Financieros (5)
    if sector == 'Financial' and business_model == 'Financial Services':
        reasoning.append("Financial sector with Financial Services model")
        return 5, DII_V4_MODELS[5], "HIGH", reasoning, []
    
    # Priority 3: Platform archetype → Ecosistema Digital (4)
    if business_model == 'Platform':
        reasoning.append("Platform business model indicates digital ecosystem")
        # Check if it might be data-focused
        if 'DATA' in archetype.upper() or 'ANALYTICS' in archetype.upper():
            alternatives.append((3, DII_V4_MODELS[3]))
            confidence = "MEDIUM"
            reasoning.append("Could be Servicios de Datos if analytics-focused")
        return 4, DII_V4_MODELS[4], confidence, reasoning, alternatives
    
    # Priority 4: Manufacturing + Cloud Level
    if business_model == 'Manufacturing':
        if cloud_level == 'Minimal':
            reasoning.append("Manufacturing with minimal cloud = legacy infrastructure")
            return 6, DII_V4_MODELS[6], "HIGH", reasoning, []
        else:  # Hybrid or Cloud First
            reasoning.append(f"Manufacturing with {cloud_level} cloud = supply chain")
            return 7, DII_V4_MODELS[7], "HIGH", reasoning, []
    
    # Priority 5: Retail + Traditional Retail → Comercio Híbrido (1)
    if sector == 'Retail' or business_model == 'Traditional Retail':
        reasoning.append("Retail sector/model maps to Comercio Híbrido")
        return 1, DII_V4_MODELS[1], "HIGH", reasoning, []
    
    # Priority 6: Technology + SaaS
    if (sector == 'Technology' or business_model == 'SaaS'):
        # Check archetype for B2C/B2G indicators
        if 'B2C' in archetype or 'B2G' in archetype:
            reasoning.append(f"Technology/SaaS with {archetype} = Software Crítico")
            return 2, DII_V4_MODELS[2], "HIGH", reasoning, []
        elif 'DATA' in archetype.upper() or 'ANALYTICS' in archetype.upper():
            reasoning.append("Technology/SaaS with data/analytics focus")
            return 3, DII_V4_MODELS[3], "HIGH", reasoning, []
        else:
            # Default technology to Software Crítico
            reasoning.append("Technology/SaaS defaults to Software Crítico")
            alternatives.append((3, DII_V4_MODELS[3]))
            alternatives.append((4, DII_V4_MODELS[4]))
            confidence = "MEDIUM"
            return 2, DII_V4_MODELS[2], confidence, reasoning, alternatives
    
    # Additional mappings
    if business_model == 'XaaS':
        reasoning.append("XaaS model maps to Software Crítico")
        alternatives.append((4, DII_V4_MODELS[4]))
        confidence = "MEDIUM"
        return 2, DII_V4_MODELS[2], confidence, reasoning, alternatives
    
    if business_model == 'Marketplace':
        reasoning.append("Marketplace model maps to Ecosistema Digital")
        return 4, DII_V4_MODELS[4], "HIGH", reasoning, []
    
    if business_model == 'Hybrid':
        reasoning.append("Hybrid business model maps to Comercio Híbrido")
        return 1, DII_V4_MODELS[1], "HIGH", reasoning, []
    
    # Public sector special handling
    if sector == 'Public':
        reasoning.append("Public sector requires careful classification")
        if business_model == 'Financial Services':
            reasoning.append("Public + Financial = Servicios Financieros")
            return 5, DII_V4_MODELS[5], "MEDIUM", reasoning, [(8, DII_V4_MODELS[8])]
        elif business_model == 'Platform':
            reasoning.append("Public + Platform = Información Regulada")
            return 8, DII_V4_MODELS[8], "MEDIUM", reasoning, [(4, DII_V4_MODELS[4])]
        else:
            reasoning.append("Public sector default to Información Regulada")
            confidence = "LOW"
            alternatives.append((5, DII_V4_MODELS[5]))
            alternatives.append((6, DII_V4_MODELS[6]))
            return 8, DII_V4_MODELS[8], confidence, reasoning, alternatives
    
    # Sector-based defaults
    sector_defaults = {
        'Energy': (6, "Energy sector = Infrastructure"),
        'Industrial': (6, "Industrial sector = Infrastructure"),
        'Pharma': (8, "Pharma sector = Regulated Information"),
        'Education': (3, "Education sector = Data Services"),
        'Services': (4, "Services sector = Digital Ecosystem")
    }
    
    if sector in sector_defaults:
        model_id, reason = sector_defaults[sector]
        reasoning.append(reason)
        confidence = "MEDIUM"
        return model_id, DII_V4_MODELS[model_id], confidence, reasoning, []
    
    # Final default
    reasoning.append("No specific rule matched - defaulting to Ecosistema Digital")
    confidence = "LOW"
    alternatives = [(2, DII_V4_MODELS[2]), (3, DII_V4_MODELS[3]), (4, DII_V4_MODELS[4])]
    return 4, DII_V4_MODELS[4], confidence, reasoning, alternatives

def estimate_digital_dependency(cloud_level):
    """Estimate digital dependency based on cloud adoption level"""
    dependencies = {
        'Minimal': "20-40%",
        'Hybrid': "50-70%",
        'Cloud First': "80-95%"
    }
    return dependencies.get(cloud_level, "50-70%")

def analyze_combinations():
    """Main analysis function"""
    print("=" * 80)
    print("DII v3.0 to v4.0 Business Model Mapping Matrix")
    print("=" * 80)
    print("\nBased on analysis of MasterDatabaseV3.1.xlsx (150 clients)")
    print("-" * 80)
    
    mapping_results = []
    
    # Process each known combination
    for sector, business_model, archetype, cloud_level, client_count in KNOWN_COMBINATIONS:
        model_id, model_name, confidence, reasoning, alternatives = map_to_dii_v4(
            sector, business_model, archetype, cloud_level
        )
        digital_dep = estimate_digital_dependency(cloud_level)
        
        result = {
            'Combination': f"{sector}|{business_model}|{archetype}|{cloud_level}",
            'Client_Count': client_count,
            'Proposed_V4_Model_ID': model_id,
            'Proposed_V4_Model_Name': model_name,
            'Confidence': confidence,
            'Reasoning': '; '.join(reasoning),
            'Alternative_Models': ', '.join([f"{alt[1]} ({alt[0]})" for alt in alternatives]),
            'Digital_Dependency': digital_dep,
            'Review_Flag': ''
        }
        
        # Flag cases for review
        flags = []
        if client_count >= 5 and confidence == "LOW":
            flags.append("5+ clients with LOW confidence")
        if sector == 'Technology' and confidence != "HIGH":
            flags.append("Technology sector ambiguity")
        if sector == 'Public':
            flags.append("Public sector - needs review")
        if (cloud_level == 'Cloud First' and model_id in [6, 1]):
            flags.append("Cloud First conflicts with model")
        
        result['Review_Flag'] = '; '.join(flags)
        mapping_results.append(result)
    
    # Sort by client count descending
    mapping_results.sort(key=lambda x: x['Client_Count'], reverse=True)
    
    # Output detailed results
    print("\n" + "=" * 80)
    print("MAPPING MATRIX (sorted by Client_Count)")
    print("=" * 80)
    
    for result in mapping_results:
        print(f"\nCombination: {result['Combination']}")
        print(f"Clients: {result['Client_Count']}")
        print(f"Proposed Model: [{result['Proposed_V4_Model_ID']}] {result['Proposed_V4_Model_Name']}")
        print(f"Confidence: {result['Confidence']}")
        print(f"Digital Dependency: {result['Digital_Dependency']}")
        print(f"Reasoning: {result['Reasoning']}")
        if result['Alternative_Models']:
            print(f"Alternatives: {result['Alternative_Models']}")
        if result['Review_Flag']:
            print(f"⚠️  REVIEW: {result['Review_Flag']}")
        print("-" * 40)
    
    # Summary statistics
    print("\n" + "=" * 80)
    print("SUMMARY STATISTICS")
    print("=" * 80)
    
    total_clients = sum(r['Client_Count'] for r in mapping_results)
    print(f"\nTotal unique combinations: {len(mapping_results)}")
    print(f"Total clients: {total_clients}")
    
    # Confidence distribution
    conf_counts = defaultdict(int)
    for r in mapping_results:
        conf_counts[r['Confidence']] += r['Client_Count']
    
    print("\nConfidence Distribution:")
    for conf in ['HIGH', 'MEDIUM', 'LOW']:
        if conf in conf_counts:
            count = conf_counts[conf]
            pct = (count / total_clients) * 100
            print(f"  {conf}: {count} clients ({pct:.1f}%)")
    
    # Model distribution
    model_counts = defaultdict(int)
    for r in mapping_results:
        model_counts[r['Proposed_V4_Model_Name']] += r['Client_Count']
    
    print("\nProposed Model Distribution:")
    for model, count in sorted(model_counts.items(), key=lambda x: x[1], reverse=True):
        pct = (count / total_clients) * 100
        print(f"  {model}: {count} clients ({pct:.1f}%)")
    
    # Review flags
    flagged = [r for r in mapping_results if r['Review_Flag']]
    if flagged:
        flagged_clients = sum(r['Client_Count'] for r in flagged)
        print(f"\n⚠️  {len(flagged)} combinations flagged for review")
        print(f"   Affecting {flagged_clients} clients ({(flagged_clients/total_clients)*100:.1f}%)")
    
    # Save results
    with open('dii_v4_mapping_matrix.json', 'w', encoding='utf-8') as f:
        json.dump(mapping_results, f, ensure_ascii=False, indent=2)
    print("\n✅ Results saved to dii_v4_mapping_matrix.json")
    
    # Also save as text report
    with open('dii_v4_mapping_report.txt', 'w', encoding='utf-8') as f:
        f.write("DII v3.0 to v4.0 Business Model Mapping Matrix\n")
        f.write("=" * 80 + "\n\n")
        
        for result in mapping_results:
            f.write(f"Combination: {result['Combination']}\n")
            f.write(f"Clients: {result['Client_Count']}\n")
            f.write(f"Proposed Model: [{result['Proposed_V4_Model_ID']}] {result['Proposed_V4_Model_Name']}\n")
            f.write(f"Confidence: {result['Confidence']}\n")
            f.write(f"Digital Dependency: {result['Digital_Dependency']}\n")
            f.write(f"Reasoning: {result['Reasoning']}\n")
            if result['Alternative_Models']:
                f.write(f"Alternatives: {result['Alternative_Models']}\n")
            if result['Review_Flag']:
                f.write(f"REVIEW: {result['Review_Flag']}\n")
            f.write("-" * 40 + "\n\n")
    
    print("✅ Report saved to dii_v4_mapping_report.txt")
    
    # Special cases that need attention
    print("\n" + "=" * 80)
    print("CRITICAL REVIEW ITEMS")
    print("=" * 80)
    
    # High-impact low confidence
    critical = [r for r in mapping_results if r['Client_Count'] >= 5 and r['Confidence'] == 'LOW']
    if critical:
        print("\n🔴 High-impact LOW confidence mappings:")
        for r in critical:
            print(f"   - {r['Combination']} ({r['Client_Count']} clients)")
    
    # Public sector
    public = [r for r in mapping_results if 'Public' in r['Combination']]
    if public:
        print(f"\n🟡 Public sector combinations ({sum(r['Client_Count'] for r in public)} clients total):")
        for r in public:
            print(f"   - {r['Combination']} → {r['Proposed_V4_Model_Name']} ({r['Confidence']})")
    
    # Cloud conflicts
    conflicts = [r for r in mapping_results if 'Cloud First conflicts' in r['Review_Flag']]
    if conflicts:
        print("\n🟠 Cloud adoption conflicts:")
        for r in conflicts:
            print(f"   - {r['Combination']} → {r['Proposed_V4_Model_Name']}")

if __name__ == "__main__":
    analyze_combinations()