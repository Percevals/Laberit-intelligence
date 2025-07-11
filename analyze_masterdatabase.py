#!/usr/bin/env python3
"""
Analyze MasterDatabaseV3.1.xlsx to extract unique combinations and create DII 4.0 mapping.
"""

import pandas as pd
import numpy as np
from collections import Counter
import json
from datetime import datetime

# DII 4.0 Model Definitions
DII_4_MODELS = {
    "A-RC": "Recovery Optimized for All Threats",
    "C-RY": "Recovery Optimized for Cyber Threats",
    "A-RS": "Resilience Optimized for All Threats", 
    "C-RS": "Resilience Optimized for Cyber Threats",
    "A-RG": "Response Optimized for All Threats",
    "C-RG": "Response Optimized for Cyber Threats"
}

# Priority rules for mapping to DII 4.0
MAPPING_RULES = {
    "priority_1": {
        "description": "Direct archetype mapping based on recovery focus",
        "mappings": {
            "ARCHETYPE_01": {"model": "A-RC", "confidence": 0.95, "reason": "Pure recovery focus across all threats"},
            "ARCHETYPE_02": {"model": "C-RY", "confidence": 0.95, "reason": "Cyber-specific recovery optimization"},
            "ARCHETYPE_03": {"model": "A-RS", "confidence": 0.90, "reason": "Balanced resilience approach"},
            "ARCHETYPE_04": {"model": "C-RS", "confidence": 0.90, "reason": "Cyber resilience focus"},
            "ARCHETYPE_05": {"model": "A-RG", "confidence": 0.85, "reason": "Response-oriented approach"},
            "ARCHETYPE_06": {"model": "C-RG", "confidence": 0.85, "reason": "Cyber response specialization"}
        }
    },
    "priority_2": {
        "description": "Business model modifiers",
        "modifiers": {
            "B2B": {"confidence_boost": 0.05, "cyber_preference": 0.2},
            "B2C": {"confidence_boost": 0.03, "all_threats_preference": 0.1},
            "B2G": {"confidence_boost": 0.08, "resilience_preference": 0.15}
        }
    },
    "priority_3": {
        "description": "Cloud adoption level impact",
        "modifiers": {
            "HIGH": {"cyber_boost": 0.1, "recovery_boost": 0.05},
            "MEDIUM": {"resilience_boost": 0.05},
            "LOW": {"response_boost": 0.05, "all_threats_boost": 0.05}
        }
    },
    "priority_4": {
        "description": "Sector-specific adjustments",
        "sector_preferences": {
            "FINANCIAL": {"models": ["C-RS", "C-RY"], "boost": 0.1},
            "HEALTHCARE": {"models": ["A-RS", "A-RC"], "boost": 0.1},
            "RETAIL": {"models": ["C-RG", "A-RG"], "boost": 0.08},
            "TECHNOLOGY": {"models": ["C-RY", "C-RS"], "boost": 0.12},
            "MANUFACTURING": {"models": ["A-RC", "A-RS"], "boost": 0.08},
            "GOVERNMENT": {"models": ["A-RS", "C-RS"], "boost": 0.15}
        }
    }
}

def load_excel_data(file_path):
    """Load all sheets from the Excel file."""
    try:
        xl_file = pd.ExcelFile(file_path)
        data = {}
        for sheet_name in xl_file.sheet_names:
            print(f"Loading sheet: {sheet_name}")
            data[sheet_name] = pd.read_excel(xl_file, sheet_name=sheet_name)
        return data
    except Exception as e:
        print(f"Error loading Excel file: {e}")
        return None

def extract_unique_combinations(df):
    """Extract unique combinations from Dim_Clients sheet."""
    required_columns = ['SECTOR', 'BUSINESS_MODEL', 'ARCHETYPE_ID', 'CLOUD_ADOPTION_LEVEL']
    
    # Check if all required columns exist
    missing_cols = [col for col in required_columns if col not in df.columns]
    if missing_cols:
        print(f"Warning: Missing columns {missing_cols}")
        # Try case-insensitive search
        for col in missing_cols:
            for df_col in df.columns:
                if col.lower() in df_col.lower():
                    df[col] = df[df_col]
                    break
    
    # Filter to only required columns that exist
    available_cols = [col for col in required_columns if col in df.columns]
    if not available_cols:
        print("Error: No required columns found")
        return pd.DataFrame()
    
    # Group and count
    grouped = df[available_cols].groupby(available_cols).size().reset_index(name='CLIENT_COUNT')
    
    # Sort by count descending
    grouped = grouped.sort_values('CLIENT_COUNT', ascending=False)
    
    return grouped

def calculate_dii_mapping(row):
    """Calculate DII 4.0 mapping for a specific combination."""
    mapping_scores = {model: 0.0 for model in DII_4_MODELS.keys()}
    confidence_factors = []
    reasoning = []
    
    # Priority 1: Archetype-based mapping
    archetype = row.get('ARCHETYPE_ID', 'UNKNOWN')
    if archetype in MAPPING_RULES['priority_1']['mappings']:
        mapping_info = MAPPING_RULES['priority_1']['mappings'][archetype]
        primary_model = mapping_info['model']
        mapping_scores[primary_model] = mapping_info['confidence']
        confidence_factors.append(mapping_info['confidence'])
        reasoning.append(f"Archetype {archetype}: {mapping_info['reason']}")
    else:
        # Default mapping if archetype unknown
        mapping_scores['A-RS'] = 0.5  # Default to balanced resilience
        confidence_factors.append(0.5)
        reasoning.append("Unknown archetype - defaulting to balanced approach")
    
    # Priority 2: Business model modifier
    business_model = row.get('BUSINESS_MODEL', 'UNKNOWN')
    if business_model in MAPPING_RULES['priority_2']['modifiers']:
        modifier = MAPPING_RULES['priority_2']['modifiers'][business_model]
        
        # Apply cyber preference
        if 'cyber_preference' in modifier:
            for model in ['C-RY', 'C-RS', 'C-RG']:
                mapping_scores[model] *= (1 + modifier['cyber_preference'])
        
        # Apply all threats preference
        if 'all_threats_preference' in modifier:
            for model in ['A-RC', 'A-RS', 'A-RG']:
                mapping_scores[model] *= (1 + modifier['all_threats_preference'])
        
        # Apply resilience preference
        if 'resilience_preference' in modifier:
            for model in ['A-RS', 'C-RS']:
                mapping_scores[model] *= (1 + modifier['resilience_preference'])
        
        confidence_factors.append(modifier['confidence_boost'])
        reasoning.append(f"Business model {business_model} adjustments applied")
    
    # Priority 3: Cloud adoption impact
    cloud_level = row.get('CLOUD_ADOPTION_LEVEL', 'UNKNOWN')
    if cloud_level in MAPPING_RULES['priority_3']['modifiers']:
        modifier = MAPPING_RULES['priority_3']['modifiers'][cloud_level]
        
        if 'cyber_boost' in modifier:
            for model in ['C-RY', 'C-RS', 'C-RG']:
                mapping_scores[model] *= (1 + modifier['cyber_boost'])
        
        if 'recovery_boost' in modifier:
            for model in ['A-RC', 'C-RY']:
                mapping_scores[model] *= (1 + modifier['recovery_boost'])
        
        if 'resilience_boost' in modifier:
            for model in ['A-RS', 'C-RS']:
                mapping_scores[model] *= (1 + modifier['resilience_boost'])
        
        if 'response_boost' in modifier:
            for model in ['A-RG', 'C-RG']:
                mapping_scores[model] *= (1 + modifier['response_boost'])
        
        if 'all_threats_boost' in modifier:
            for model in ['A-RC', 'A-RS', 'A-RG']:
                mapping_scores[model] *= (1 + modifier['all_threats_boost'])
        
        reasoning.append(f"Cloud adoption level {cloud_level} impacts applied")
    
    # Priority 4: Sector-specific adjustments
    sector = row.get('SECTOR', 'UNKNOWN')
    if sector in MAPPING_RULES['priority_4']['sector_preferences']:
        pref = MAPPING_RULES['priority_4']['sector_preferences'][sector]
        for model in pref['models']:
            mapping_scores[model] *= (1 + pref['boost'])
        reasoning.append(f"Sector {sector} preferences applied")
    
    # Normalize scores
    total_score = sum(mapping_scores.values())
    if total_score > 0:
        for model in mapping_scores:
            mapping_scores[model] /= total_score
    
    # Determine primary recommendation
    primary_model = max(mapping_scores, key=mapping_scores.get)
    
    # Calculate overall confidence
    base_confidence = np.mean(confidence_factors) if confidence_factors else 0.5
    score_confidence = mapping_scores[primary_model]
    overall_confidence = (base_confidence + score_confidence) / 2
    
    return {
        'primary_model': primary_model,
        'model_description': DII_4_MODELS[primary_model],
        'confidence': round(overall_confidence, 3),
        'all_scores': {k: round(v, 3) for k, v in mapping_scores.items()},
        'reasoning': ' | '.join(reasoning)
    }

def extract_recovery_agility(data):
    """Extract Recovery Agility indicators from other sheets."""
    recovery_indicators = {}
    
    # Look for sheets that might contain recovery agility data
    potential_sheets = ['Recovery', 'Agility', 'Metrics', 'KPIs', 'Performance']
    
    for sheet_name in data.keys():
        if any(keyword.lower() in sheet_name.lower() for keyword in potential_sheets):
            df = data[sheet_name]
            print(f"\nAnalyzing sheet '{sheet_name}' for recovery indicators:")
            print(f"Columns: {list(df.columns)[:10]}...")  # Show first 10 columns
            
            # Look for recovery-related columns
            recovery_cols = [col for col in df.columns if any(
                keyword in col.upper() for keyword in ['RECOVERY', 'AGILITY', 'RTO', 'RPO', 'MTTR']
            )]
            
            if recovery_cols:
                recovery_indicators[sheet_name] = {
                    'columns': recovery_cols,
                    'sample_data': df[recovery_cols].head().to_dict()
                }
    
    return recovery_indicators

def create_mapping_matrix(grouped_df):
    """Create comprehensive mapping matrix."""
    results = []
    
    for _, row in grouped_df.iterrows():
        mapping = calculate_dii_mapping(row)
        
        result = {
            'combination': {
                'sector': row.get('SECTOR', 'N/A'),
                'business_model': row.get('BUSINESS_MODEL', 'N/A'),
                'archetype_id': row.get('ARCHETYPE_ID', 'N/A'),
                'cloud_adoption_level': row.get('CLOUD_ADOPTION_LEVEL', 'N/A')
            },
            'client_count': row.get('CLIENT_COUNT', 0),
            'dii_4_mapping': mapping
        }
        
        results.append(result)
    
    return results

def generate_report(mapping_matrix, recovery_indicators, output_file):
    """Generate comprehensive report."""
    report = {
        'metadata': {
            'generated_date': datetime.now().isoformat(),
            'total_combinations': len(mapping_matrix),
            'total_clients': sum(item['client_count'] for item in mapping_matrix)
        },
        'mapping_matrix': mapping_matrix,
        'recovery_indicators': recovery_indicators,
        'summary_statistics': calculate_summary_stats(mapping_matrix)
    }
    
    # Save as JSON
    with open(output_file + '.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    # Generate readable text report
    with open(output_file + '.txt', 'w') as f:
        f.write("DII 4.0 MAPPING ANALYSIS REPORT\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Generated: {report['metadata']['generated_date']}\n")
        f.write(f"Total Unique Combinations: {report['metadata']['total_combinations']}\n")
        f.write(f"Total Clients Analyzed: {report['metadata']['total_clients']}\n\n")
        
        f.write("MAPPING MATRIX\n")
        f.write("-" * 80 + "\n\n")
        
        for i, item in enumerate(mapping_matrix, 1):
            f.write(f"Combination #{i}\n")
            f.write(f"Sector: {item['combination']['sector']}\n")
            f.write(f"Business Model: {item['combination']['business_model']}\n")
            f.write(f"Archetype: {item['combination']['archetype_id']}\n")
            f.write(f"Cloud Adoption: {item['combination']['cloud_adoption_level']}\n")
            f.write(f"Client Count: {item['client_count']}\n")
            f.write(f"Recommended DII 4.0 Model: {item['dii_4_mapping']['primary_model']} - {item['dii_4_mapping']['model_description']}\n")
            f.write(f"Confidence: {item['dii_4_mapping']['confidence']:.1%}\n")
            f.write(f"Reasoning: {item['dii_4_mapping']['reasoning']}\n")
            f.write(f"All Model Scores: {item['dii_4_mapping']['all_scores']}\n")
            f.write("-" * 40 + "\n\n")
        
        f.write("\nSUMMARY STATISTICS\n")
        f.write("-" * 80 + "\n")
        for key, value in report['summary_statistics'].items():
            f.write(f"{key}: {value}\n")

def calculate_summary_stats(mapping_matrix):
    """Calculate summary statistics."""
    model_counts = Counter()
    confidence_levels = []
    sector_distribution = Counter()
    
    for item in mapping_matrix:
        model_counts[item['dii_4_mapping']['primary_model']] += item['client_count']
        confidence_levels.append(item['dii_4_mapping']['confidence'])
        sector_distribution[item['combination']['sector']] += item['client_count']
    
    return {
        'model_distribution': dict(model_counts),
        'average_confidence': round(np.mean(confidence_levels), 3),
        'confidence_std_dev': round(np.std(confidence_levels), 3),
        'top_sectors': dict(sector_distribution.most_common(5))
    }

def main():
    """Main execution function."""
    file_path = './data/MasterDatabaseV3.1.xlsx'
    
    print(f"Loading data from {file_path}...")
    data = load_excel_data(file_path)
    
    if data is None:
        print("Failed to load data.")
        return
    
    print(f"\nFound {len(data)} sheets in the workbook")
    print(f"Sheet names: {list(data.keys())}")
    
    # Find Dim_Clients sheet
    dim_clients_sheet = None
    for sheet_name in data.keys():
        if 'dim_clients' in sheet_name.lower() or 'clients' in sheet_name.lower():
            dim_clients_sheet = sheet_name
            break
    
    if dim_clients_sheet is None:
        print("Error: Could not find Dim_Clients sheet")
        return
    
    print(f"\nUsing sheet: {dim_clients_sheet}")
    dim_clients_df = data[dim_clients_sheet]
    print(f"Shape: {dim_clients_df.shape}")
    print(f"Columns: {list(dim_clients_df.columns)}")
    
    # Extract unique combinations
    print("\nExtracting unique combinations...")
    grouped_df = extract_unique_combinations(dim_clients_df)
    print(f"Found {len(grouped_df)} unique combinations")
    
    # Extract recovery agility indicators
    print("\nExtracting recovery agility indicators...")
    recovery_indicators = extract_recovery_agility(data)
    
    # Create mapping matrix
    print("\nCreating DII 4.0 mapping matrix...")
    mapping_matrix = create_mapping_matrix(grouped_df)
    
    # Generate report
    output_file = 'dii_4_mapping_analysis'
    print(f"\nGenerating report: {output_file}...")
    generate_report(mapping_matrix, recovery_indicators, output_file)
    
    print("\nAnalysis complete!")
    print(f"Results saved to:")
    print(f"  - {output_file}.json (detailed data)")
    print(f"  - {output_file}.txt (readable report)")

if __name__ == "__main__":
    main()