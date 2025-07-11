#!/usr/bin/env python3
"""
Calculate DII 4.0 scores with Recovery Agility data
Complete migration from v3.0 to DII 4.0
"""

import pandas as pd
import numpy as np
from pathlib import Path
import json
import warnings
warnings.filterwarnings('ignore')

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

# Business model to v4 mapping (from our analysis)
V3_TO_V4_MAPPING = {
    ('Financial', 'Platform'): 4,
    ('Financial', 'Financial Services'): 5,
    ('Industrial', 'Manufacturing'): 7,  # Default to supply chain
    ('Public', 'Platform'): 4,
    ('Retail', 'Traditional Retail'): 1,
    ('Healthcare', 'Healthcare'): 8,
    ('Technology', 'SaaS'): 2,
    ('Energy', 'Manufacturing'): 6,
    ('Education', 'Platform'): 4,
    ('Services', 'Platform'): 4,
    ('Pharma', 'Manufacturing'): 8,
    ('Technology', 'XaaS'): 2,
    ('Retail', 'Marketplace'): 4,
    ('Financial', 'Hybrid'): 1,
    ('Public', 'Financial Services'): 5,
    ('Industrial', 'Platform'): 4,
    ('Services', 'SaaS'): 2,
    ('Public', 'Manufacturing'): 6
}

# Base TRD values by business model
BASE_TRD_VALUES = {
    1: 48,  # Comercio Híbrido
    2: 12,  # Software Crítico
    3: 24,  # Servicios de Datos
    4: 6,   # Ecosistema Digital
    5: 8,   # Servicios Financieros
    6: 72,  # Infraestructura Heredada
    7: 36,  # Cadena de Suministro
    8: 16   # Información Regulada
}

# Sector AER defaults
SECTOR_AER = {
    'Financial': 4.5,
    'Healthcare': 3.8,
    'Retail': 3.2,
    'Technology': 4.0,
    'Industrial': 2.8,
    'Energy': 3.5,
    'Public': 3.0,
    'Education': 2.5,
    'Services': 3.0,
    'Pharma': 3.5
}

# DII stages
def get_dii_stage(score):
    if score < 2.5:
        return "Frágil"
    elif score < 5.0:
        return "Robusto"
    elif score < 7.5:
        return "Resiliente"
    else:
        return "Adaptativo"

def map_business_model(row):
    """Map v3 business model to v4"""
    # First check special cases
    if row['SECTOR'] == 'Healthcare':
        return 8
    
    # Check manufacturing with cloud level
    if row['BUSINESS_MODEL'] == 'Manufacturing':
        if row.get('CLOUD_ADOPTION_LEVEL', 'Hybrid') == 'Minimal':
            return 6
        else:
            return 7
    
    # Use mapping dictionary
    key = (row['SECTOR'], row['BUSINESS_MODEL'])
    if key in V3_TO_V4_MAPPING:
        return V3_TO_V4_MAPPING[key]
    
    # Defaults by business model
    model_defaults = {
        'Platform': 4,
        'SaaS': 2,
        'XaaS': 2,
        'Marketplace': 4,
        'Traditional Retail': 1,
        'Financial Services': 5,
        'Hybrid': 1,
        'Healthcare': 8,
        'Manufacturing': 7
    }
    
    return model_defaults.get(row['BUSINESS_MODEL'], 4)

def calculate_dii_dimensions(row, zt_maturity=None):
    """Calculate all 5 DII dimensions for a client"""
    
    # 1. Get v4 business model
    v4_model_id = map_business_model(row)
    
    # 2. AER - Attack Economics Ratio (from sector)
    aer = SECTOR_AER.get(row['SECTOR'], 3.0)
    
    # 3. HFP - Human Failure Probability
    # Formula: 0.2 + (0.8 * (1 - Protection_Readiness/5))
    protection_readiness = row.get('Protection_Readiness', 2.5)
    hfp = 0.2 + (0.8 * (1 - protection_readiness/5))
    
    # 4. BRI - Blast Radius Index
    # Formula: 0.2 + (0.8 * (1 - Protection_Performance/100))
    protection_performance = row.get('Protection_Performance', 50)
    bri = 0.2 + (0.8 * (1 - protection_performance/100))
    
    # 5. TRD - Time to Revenue Degradation
    base_trd = BASE_TRD_VALUES[v4_model_id]
    
    # Adjust by recovery maturity
    if zt_maturity is not None:
        maturity_adjustments = {
            5: 0.7,   # 30% better
            4: 0.85,  # 15% better
            3: 1.0,   # baseline
            2: 1.3,   # 30% worse
            1: 1.6    # 60% worse
        }
        trd_adjustment = maturity_adjustments.get(int(zt_maturity), 1.0)
    else:
        trd_adjustment = 1.0
    
    # Cloud adoption factor
    cloud_factors = {
        'Minimal': 1.3,      # Slower degradation
        'Hybrid': 1.0,       # Baseline
        'Cloud First': 0.7   # Faster degradation
    }
    cloud_factor = cloud_factors.get(row.get('CLOUD_ADOPTION_LEVEL', 'Hybrid'), 1.0)
    
    trd = base_trd * trd_adjustment * cloud_factor
    
    # 6. RRG - Recovery Reality Gap
    response_agility = row.get('Response_Agility', 3.0)
    
    if zt_maturity is not None and response_agility:
        # Both available
        rrg = 3.0 / (response_agility * (zt_maturity/3))
    elif response_agility:
        # Only Response_Agility available
        rrg = 3.0 / response_agility
    else:
        # Neither available - use default
        rrg = 1.5
    
    # Cap RRG between 1.0 and 5.0
    rrg = max(1.0, min(5.0, rrg))
    
    return {
        'v4_model_id': v4_model_id,
        'v4_model_name': DII_V4_MODELS[v4_model_id],
        'TRD': round(trd, 2),
        'AER': round(aer, 2),
        'HFP': round(hfp, 3),
        'BRI': round(bri, 3),
        'RRG': round(rrg, 2),
        'has_zt_maturity': zt_maturity is not None
    }

def calculate_dii_score(dimensions):
    """Calculate final DII score from dimensions"""
    # DII Raw = (TRD × AER) / (HFP × BRI × RRG)
    dii_raw = (dimensions['TRD'] * dimensions['AER']) / (dimensions['HFP'] * dimensions['BRI'] * dimensions['RRG'])
    
    # Base value for normalization (using median values)
    dii_base = (24 * 3.0) / (0.5 * 0.5 * 1.5)  # ~192
    
    # DII Score = (DII Raw / DII Base) × 10
    dii_score = (dii_raw / dii_base) * 10
    
    # Apply limits: 1.0 ≤ DII Score ≤ 10.0
    dii_score = max(1.0, min(10.0, dii_score))
    
    return round(dii_score, 2)

def main():
    """Main analysis function"""
    file_path = Path("data/MasterDatabaseV3.1.xlsx")
    
    print("=" * 80)
    print("DII 4.0 Migration with Recovery Agility Analysis")
    print("=" * 80)
    
    try:
        # Read all necessary sheets
        excel_file = pd.ExcelFile(file_path)
        
        # Main clients data
        df_clients = pd.read_excel(file_path, sheet_name='Dim_Clients')
        print(f"\n✓ Loaded {len(df_clients)} clients from Dim_Clients")
        
        # Try to get Recovery Agility data
        zt_maturity_data = {}
        
        if 'Fact_ResponseReadiness' in excel_file.sheet_names:
            print("\n1. EXTRACTING RECOVERY AGILITY SCORES")
            print("-" * 40)
            
            fact_response = pd.read_excel(file_path, sheet_name='Fact_ResponseReadiness')
            
            # Check if we have the right columns
            if 'ID_SUBCTRL' in fact_response.columns and 'ID_CLIENT' in fact_response.columns:
                # Filter for ID_SUBCTRL=27
                zt_data = fact_response[fact_response['ID_SUBCTRL'] == 27]
                
                if not zt_data.empty:
                    # Find the score column
                    score_col = None
                    for col in ['SCORE', 'MATURITY', 'VALUE', 'ZT_MATURITY']:
                        if col in zt_data.columns:
                            score_col = col
                            break
                    
                    if score_col:
                        # Group by client and average
                        zt_maturity_by_client = zt_data.groupby('ID_CLIENT')[score_col].mean()
                        zt_maturity_data = zt_maturity_by_client.to_dict()
                        
                        print(f"Found ZT_MATURITY scores for {len(zt_maturity_data)} clients")
                        
                        # Show distribution
                        maturity_dist = pd.Series(list(zt_maturity_data.values())).value_counts().sort_index()
                        print("\nZT Maturity Distribution:")
                        for level, count in maturity_dist.items():
                            print(f"  Level {int(level)}: {count} clients")
                    else:
                        print("Could not find score column in Fact_ResponseReadiness")
                else:
                    print("No data found for ID_SUBCTRL=27")
            else:
                print("Required columns not found in Fact_ResponseReadiness")
        else:
            print("\n⚠️  Fact_ResponseReadiness sheet not found - using Response_Agility only")
        
        # Calculate dimensions and DII scores
        print("\n2. CALCULATING DII DIMENSIONS AND SCORES")
        print("-" * 40)
        
        results = []
        missing_zt_count = 0
        
        for idx, row in df_clients.iterrows():
            client_id = row['ID_CLIENT']
            zt_maturity = zt_maturity_data.get(client_id)
            
            if zt_maturity is None:
                missing_zt_count += 1
            
            # Calculate dimensions
            dimensions = calculate_dii_dimensions(row, zt_maturity)
            
            # Calculate DII score
            dii_score = calculate_dii_score(dimensions)
            
            # Create result record
            result = {
                'ID_CLIENT': client_id,
                'CompanyName': row['CompanyName'],
                'SECTOR': row['SECTOR'],
                'v3_MODEL': row['BUSINESS_MODEL'],
                'v4_MODEL_ID': dimensions['v4_model_id'],
                'v4_MODEL': dimensions['v4_model_name'],
                'TRD': dimensions['TRD'],
                'AER': dimensions['AER'],
                'HFP': dimensions['HFP'],
                'BRI': dimensions['BRI'],
                'RRG': dimensions['RRG'],
                'OLD_IMMUNITY': row['IMMUNITY_INDEX'],
                'NEW_DII': dii_score,
                'DII_STAGE': get_dii_stage(dii_score),
                'HAS_ZT_DATA': dimensions['has_zt_maturity'],
                'CLOUD_LEVEL': row.get('CLOUD_ADOPTION_LEVEL', 'Hybrid')
            }
            
            results.append(result)
        
        # Create results DataFrame
        results_df = pd.DataFrame(results)
        
        # Show first 20 records
        print("\n3. SAMPLE RESULTS (First 20 records)")
        print("-" * 80)
        
        for i, row in results_df.head(20).iterrows():
            print(f"\n{row['CompanyName']} ({row['SECTOR']})")
            print(f"  Model: {row['v3_MODEL']} → {row['v4_MODEL']}")
            print(f"  Dimensions: TRD={row['TRD']}, AER={row['AER']}, HFP={row['HFP']:.3f}, BRI={row['BRI']:.3f}, RRG={row['RRG']}")
            print(f"  Score: {row['OLD_IMMUNITY']:.2f} → {row['NEW_DII']:.2f} ({row['DII_STAGE']})")
            if not row['HAS_ZT_DATA']:
                print(f"  ⚠️  No ZT maturity data - using Response_Agility only")
        
        # Summary statistics
        print("\n\n4. SUMMARY STATISTICS")
        print("=" * 80)
        
        # Average DII by business model
        print("\nAverage DII by Business Model:")
        avg_by_model = results_df.groupby('v4_MODEL')['NEW_DII'].agg(['mean', 'count']).sort_values('mean', ascending=False)
        for model, row in avg_by_model.iterrows():
            print(f"  {model}: {row['mean']:.2f} (n={int(row['count'])})")
        
        # Correlation
        correlation = results_df['OLD_IMMUNITY'].corr(results_df['NEW_DII'])
        print(f"\nCorrelation between old and new scores: {correlation:.3f}")
        
        # DII stage distribution
        print("\nClients by DII Stage:")
        stage_dist = results_df['DII_STAGE'].value_counts()
        for stage in ['Frágil', 'Robusto', 'Resiliente', 'Adaptativo']:
            if stage in stage_dist.index:
                count = stage_dist[stage]
                pct = (count / len(results_df)) * 100
                print(f"  {stage}: {count} ({pct:.1f}%)")
        
        # Data quality
        print(f"\nData Quality:")
        print(f"  Clients with ZT maturity data: {len(results_df[results_df['HAS_ZT_DATA']])} ({len(results_df[results_df['HAS_ZT_DATA']])/len(results_df)*100:.1f}%)")
        print(f"  Clients missing ZT maturity: {missing_zt_count} ({missing_zt_count/len(results_df)*100:.1f}%)")
        
        # Quality checks
        print("\n\n5. QUALITY CHECKS")
        print("=" * 80)
        
        # Unrealistic scores
        unrealistic_low = results_df[results_df['NEW_DII'] < 2]
        unrealistic_high = results_df[results_df['NEW_DII'] > 8]
        
        if not unrealistic_low.empty:
            print(f"\n⚠️  {len(unrealistic_low)} clients with DII < 2:")
            for _, row in unrealistic_low.iterrows():
                print(f"  - {row['CompanyName']}: {row['NEW_DII']:.2f}")
        
        if not unrealistic_high.empty:
            print(f"\n⚠️  {len(unrealistic_high)} clients with DII > 8:")
            for _, row in unrealistic_high.iterrows():
                print(f"  - {row['CompanyName']}: {row['NEW_DII']:.2f}")
        
        # Large score differences
        results_df['score_diff_pct'] = abs(results_df['NEW_DII'] - results_df['OLD_IMMUNITY']) / results_df['OLD_IMMUNITY'] * 100
        large_diff = results_df[results_df['score_diff_pct'] > 50]
        
        if not large_diff.empty:
            print(f"\n⚠️  {len(large_diff)} clients with >50% score difference:")
            for _, row in large_diff.head(10).iterrows():
                print(f"  - {row['CompanyName']}: {row['OLD_IMMUNITY']:.2f} → {row['NEW_DII']:.2f} ({row['score_diff_pct']:.1f}% change)")
        
        # Save results
        results_df.to_csv('dii_migration_results.csv', index=False)
        print("\n\n✅ Full results saved to dii_migration_results.csv")
        
        # Save summary JSON
        summary = {
            'total_clients': len(results_df),
            'avg_old_score': float(results_df['OLD_IMMUNITY'].mean()),
            'avg_new_score': float(results_df['NEW_DII'].mean()),
            'correlation': float(correlation),
            'clients_with_zt_data': len(results_df[results_df['HAS_ZT_DATA']]),
            'stage_distribution': stage_dist.to_dict(),
            'model_averages': avg_by_model['mean'].to_dict()
        }
        
        with open('dii_migration_summary.json', 'w') as f:
            json.dump(summary, f, indent=2)
        print("✅ Summary saved to dii_migration_summary.json")
        
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()