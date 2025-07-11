#!/usr/bin/env python3
"""
Create comprehensive business model mapping matrix from v3.0 to DII 4.0
"""

import pandas as pd
import numpy as np
from pathlib import Path
import json

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

def map_to_dii_v4(row):
    """
    Map v3.0 combination to DII v4.0 model based on priority rules
    Returns: (model_id, model_name, confidence, reasoning, alternatives)
    """
    sector = row['SECTOR']
    business_model = row['BUSINESS_MODEL']
    archetype = row.get('ARCHETYPE_ID', '')
    cloud_level = row.get('CLOUD_ADOPTION_LEVEL', 'Hybrid')
    
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
    
    # Additional mappings based on patterns
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
        # Try to determine based on other factors
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

def analyze_database():
    """Main analysis function"""
    file_path = Path("data/MasterDatabaseV3.1.xlsx")
    
    print("=" * 80)
    print("DII v3.0 to v4.0 Business Model Mapping Matrix")
    print("=" * 80)
    
    # Read the main clients sheet
    df = pd.read_excel(file_path, sheet_name='Dim_Clients')
    
    # Create combination column
    df['Combination'] = (df['SECTOR'] + '|' + 
                        df['BUSINESS_MODEL'] + '|' + 
                        df.get('ARCHETYPE_ID', '').fillna('N/A') + '|' + 
                        df.get('CLOUD_ADOPTION_LEVEL', 'Hybrid').fillna('Hybrid'))
    
    # Group by combination
    combination_counts = df.groupby(['SECTOR', 'BUSINESS_MODEL', 
                                    df.get('ARCHETYPE_ID', '').fillna('N/A'),
                                    df.get('CLOUD_ADOPTION_LEVEL', 'Hybrid').fillna('Hybrid')]).size().reset_index(name='Client_Count')
    
    # Rename columns for clarity
    combination_counts.columns = ['SECTOR', 'BUSINESS_MODEL', 'ARCHETYPE_ID', 'CLOUD_ADOPTION_LEVEL', 'Client_Count']
    
    # Sort by count descending
    combination_counts = combination_counts.sort_values('Client_Count', ascending=False)
    
    # Apply mapping logic
    mapping_results = []
    
    for idx, row in combination_counts.iterrows():
        model_id, model_name, confidence, reasoning, alternatives = map_to_dii_v4(row)
        digital_dep = estimate_digital_dependency(row['CLOUD_ADOPTION_LEVEL'])
        
        result = {
            'Combination': f"{row['SECTOR']}|{row['BUSINESS_MODEL']}|{row['ARCHETYPE_ID']}|{row['CLOUD_ADOPTION_LEVEL']}",
            'Client_Count': row['Client_Count'],
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
        if row['Client_Count'] >= 5 and confidence == "LOW":
            flags.append("5+ clients with LOW confidence")
        if row['SECTOR'] == 'Technology' and confidence != "HIGH":
            flags.append("Technology sector ambiguity")
        if row['SECTOR'] == 'Public':
            flags.append("Public sector - needs review")
        if (row['CLOUD_ADOPTION_LEVEL'] == 'Cloud First' and 
            model_id in [6, 1]):  # Legacy or Hybrid Commerce
            flags.append("Cloud First conflicts with model")
        
        result['Review_Flag'] = '; '.join(flags)
        mapping_results.append(result)
    
    # Create DataFrame
    mapping_df = pd.DataFrame(mapping_results)
    
    # Try to get Recovery Agility data
    try:
        # Check if Fact_ResponseReadiness exists
        excel = pd.ExcelFile(file_path)
        if 'Fact_ResponseReadiness' in excel.sheet_names:
            fact_df = pd.read_excel(file_path, sheet_name='Fact_ResponseReadiness')
            print("\nRecovery Agility Data Found:")
            print("-" * 40)
            
            # Look for ZT_MATURITY or similar columns
            if 'ID_SUBCTRL' in fact_df.columns:
                zt_data = fact_df[fact_df['ID_SUBCTRL'] == 27]
                if not zt_data.empty:
                    print(f"Found {len(zt_data)} ZT_MATURITY records")
                    # Calculate averages per client if ID_CLIENT exists
                    if 'ID_CLIENT' in zt_data.columns and 'SCORE' in zt_data.columns:
                        avg_zt = zt_data.groupby('ID_CLIENT')['SCORE'].mean()
                        print(f"Average ZT Maturity: {avg_zt.mean():.2f}")
            else:
                print("ID_SUBCTRL column not found in Fact_ResponseReadiness")
    except Exception as e:
        print(f"\nCould not analyze Recovery Agility: {e}")
    
    # Output results
    print("\n" + "=" * 80)
    print("MAPPING MATRIX (sorted by Client_Count)")
    print("=" * 80)
    
    # Print detailed results
    for _, row in mapping_df.iterrows():
        print(f"\nCombination: {row['Combination']}")
        print(f"Clients: {row['Client_Count']}")
        print(f"Proposed Model: [{row['Proposed_V4_Model_ID']}] {row['Proposed_V4_Model_Name']}")
        print(f"Confidence: {row['Confidence']}")
        print(f"Digital Dependency: {row['Digital_Dependency']}")
        print(f"Reasoning: {row['Reasoning']}")
        if row['Alternative_Models']:
            print(f"Alternatives: {row['Alternative_Models']}")
        if row['Review_Flag']:
            print(f"⚠️  REVIEW: {row['Review_Flag']}")
        print("-" * 40)
    
    # Summary statistics
    print("\n" + "=" * 80)
    print("SUMMARY STATISTICS")
    print("=" * 80)
    
    print(f"\nTotal unique combinations: {len(mapping_df)}")
    print(f"Total clients: {mapping_df['Client_Count'].sum()}")
    
    # Confidence distribution
    conf_dist = mapping_df.groupby('Confidence')['Client_Count'].sum()
    print("\nConfidence Distribution:")
    for conf, count in conf_dist.items():
        pct = (count / mapping_df['Client_Count'].sum()) * 100
        print(f"  {conf}: {count} clients ({pct:.1f}%)")
    
    # Model distribution
    model_dist = mapping_df.groupby('Proposed_V4_Model_Name')['Client_Count'].sum().sort_values(ascending=False)
    print("\nProposed Model Distribution:")
    for model, count in model_dist.items():
        pct = (count / mapping_df['Client_Count'].sum()) * 100
        print(f"  {model}: {count} clients ({pct:.1f}%)")
    
    # Review flags
    flagged = mapping_df[mapping_df['Review_Flag'] != '']
    if not flagged.empty:
        print(f"\n⚠️  {len(flagged)} combinations flagged for review")
        print(f"   Affecting {flagged['Client_Count'].sum()} clients")
    
    # Save results
    mapping_df.to_csv('dii_v4_mapping_matrix.csv', index=False)
    print("\n✅ Results saved to dii_v4_mapping_matrix.csv")
    
    # Also save as JSON for programmatic use
    with open('dii_v4_mapping_matrix.json', 'w', encoding='utf-8') as f:
        json.dump(mapping_results, f, ensure_ascii=False, indent=2)
    print("✅ Results saved to dii_v4_mapping_matrix.json")

if __name__ == "__main__":
    try:
        analyze_database()
    except Exception as e:
        print(f"\nError: {e}")
        print("\nPlease ensure:")
        print("1. pandas is installed: pip install pandas openpyxl")
        print("2. MasterDatabaseV3.1.xlsx exists in the data/ directory")