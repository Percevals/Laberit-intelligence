import pandas as pd
import numpy as np
from datetime import datetime

def create_transition_mapping():
    """
    Creates transition_mapping.xlsx with mappings from Zero Trust to Immunity Framework
    """
    
    # 1. Attack Vector to BEI Component Mapping
    vector_to_bei_mapping = {
        'Attack_Vector': [
            'Cloud Misconfiguration',
            'Compromised Credentials', 
            'Malicious Insider',
            'Phishing | BEC',
            'Social Engineering',
            'Software Vulnerability'
        ],
        'BEI_Component': [
            'Digital_Dependency',
            'Industry_Vulnerability',
            'Decision_Speed',
            'Industry_Vulnerability',
            'Industry_Vulnerability',
            'Industry_Vulnerability'
        ],
        'BEI_Weight': [0.40, 0.25, 0.20, 0.25, 0.25, 0.25],
        'Immunity_Impact': [
            'Direct - High digital exposure',
            'Direct - Sector targeting',
            'Direct - Internal threat speed',
            'Direct - Human factor',
            'Direct - Human factor',
            'Direct - Technical debt'
        ]
    }
    
    # 2. CIS Control Maturity to RCI Mapping
    maturity_to_rci_mapping = {
        'Maturity_Level': [0, 1, 2, 3, 4],
        'Maturity_Name': ['None', 'Basic', 'Traditional', 'Advanced', 'Optimized'],
        'RCI_Recovery_Readiness': [0.1, 0.2, 0.4, 0.6, 1.0],
        'RCI_Process_Maturity': [0.1, 0.3, 0.5, 0.7, 1.0],
        'RCI_Investment_Adequacy': [0.1, 0.3, 0.5, 0.7, 1.0],
        'RCI_Adaptive_Learning': [0.1, 0.3, 0.5, 0.7, 1.0]
    }
    
    # 3. Score Normalization Rules
    normalization_rules = {
        'Metric_Type': [
            'Threat_Protection_Score',
            'Zero_Trust_Maturity',
            'Attack_Surface_Value',
            'Compliance_Percentage'
        ],
        'Original_Range': ['0-100', '0-4', '0-100', '0-100'],
        'Normalized_Range': ['0-1', '0-1', '0-1', '0-1'],
        'Formula': [
            'value / 100',
            'value / 4',
            '1 - (value / 100)',  # Inverted for risk
            'value / 100'
        ]
    }
    
    # 4. Business Model Classification (for Digital Dependency)
    business_model_mapping = {
        'Industry_Sector': [
            'Financial Services',
            'Healthcare',
            'Manufacturing',
            'Retail',
            'Government',
            'Technology',
            'Education'
        ],
        'Base_Digital_Dependency': [0.85, 0.65, 0.55, 0.70, 0.60, 0.95, 0.75],
        'Industry_Vulnerability': [0.95, 0.85, 0.65, 0.75, 0.90, 0.85, 0.70]
    }
    
    # 5. Final Calculation Template
    calculation_template = {
        'Step': [1, 2, 3, 4, 5],
        'Description': [
            'Calculate Base_Score',
            'Calculate BEI',
            'Calculate RCI',
            'Apply Immunity Formula',
            'Generate Risk Rating'
        ],
        'Formula': [
            'Base_Score = (ZT_Maturity × 2.5) × (Avg_Protection / 100)',
            'BEI = (Industry_Vuln × 0.25) + (Digital_Dep × 0.40) + (Decision_Speed × 0.20) + (Geo_Risk × 0.15)',
            'RCI = (Recovery × 0.35) + (Process × 0.30) + (Investment × 0.20) + (Learning × 0.15)',
            'Immunity = Base_Score × (1 - BEI) × RCI × 10',
            'If Immunity < 4: "Critical", 4-6: "Medium", 6-8: "Good", 8-10: "Resilient"'
        ]
    }
    
    # Create Excel writer
    with pd.ExcelWriter('transition_mapping.xlsx', engine='openpyxl') as writer:
        # Write each mapping to a separate sheet
        pd.DataFrame(vector_to_bei_mapping).to_excel(writer, sheet_name='Vector_to_BEI', index=False)
        pd.DataFrame(maturity_to_rci_mapping).to_excel(writer, sheet_name='Maturity_to_RCI', index=False)
        pd.DataFrame(normalization_rules).to_excel(writer, sheet_name='Normalization', index=False)
        pd.DataFrame(business_model_mapping).to_excel(writer, sheet_name='Business_Models', index=False)
        pd.DataFrame(calculation_template).to_excel(writer, sheet_name='Calculation_Steps', index=False)
        
        # Add a README sheet
        readme_data = {
            'Section': ['Purpose', 'Usage', 'Input Files', 'Output'],
            'Description': [
                'Maps Zero Trust assessment data to Immunity Framework 2.0',
                'Use with migration script to convert CLHZT2024.xlsx to Immunity scores',
                'Requires: CLHZT2024.xlsx (or similar ZT assessment)',
                'Generates: immunity_assessment_[client].xlsx with calculated Immunity Index'
            ]
        }
        pd.DataFrame(readme_data).to_excel(writer, sheet_name='README', index=False)
    
    print("✅ Created transition_mapping.xlsx")
    return True


def migrate_zt_to_immunity(zt_file_path, client_name='Client'):
    """
    Migrates Zero Trust assessment to Immunity Framework
    
    Args:
        zt_file_path: Path to Zero Trust Excel file (like CLHZT2024.xlsx)
        client_name: Client identifier for output file
    """
    
    # Load transition mappings
    mappings = pd.ExcelFile('transition_mapping.xlsx')
    vector_mapping = pd.read_excel(mappings, 'Vector_to_BEI')
    maturity_mapping = pd.read_excel(mappings, 'Maturity_to_RCI')
    
    # Load Zero Trust data
    zt_data = pd.ExcelFile(zt_file_path)
    protection_scores = pd.read_excel(zt_data, 'Protection_Scores')
    maturity_scores = pd.read_excel(zt_data, 'ZeroTrust_Maturity')
    
    # Step 1: Calculate average protection by vector
    vector_scores = {}
    for vector in protection_scores['Attack_Vector'].unique():
        vector_data = protection_scores[protection_scores['Attack_Vector'] == vector]
        valid_scores = vector_data[vector_data['Threat_Protection'] != 'No data']['Threat_Protection']
        if len(valid_scores) > 0:
            vector_scores[vector] = valid_scores.mean() / 100  # Normalize to 0-1
        else:
            vector_scores[vector] = 0.5  # Default if no data
    
    # Step 2: Calculate BEI components
    bei_components = {
        'Industry_Vulnerability': 0.85,  # Default, adjust based on client
        'Digital_Dependency': 0.75,      # Default, adjust based on client
        'Decision_Speed': 0.5,           # Default medium speed
        'Geographic_Risk': 0.5           # Default medium risk
    }
    
    # Map vector scores to BEI components
    for _, row in vector_mapping.iterrows():
        if row['Attack_Vector'] in vector_scores:
            component = row['BEI_Component']
            if component == 'Digital_Dependency':
                bei_components['Digital_Dependency'] = 1 - vector_scores[row['Attack_Vector']]
            elif component == 'Industry_Vulnerability':
                # Average all security-related vectors
                bei_components['Industry_Vulnerability'] = max(bei_components['Industry_Vulnerability'], 
                                                               1 - vector_scores[row['Attack_Vector']])
    
    # Calculate BEI
    bei = (bei_components['Industry_Vulnerability'] * 0.25 + 
           bei_components['Digital_Dependency'] * 0.40 + 
           bei_components['Decision_Speed'] * 0.20 + 
           bei_components['Geographic_Risk'] * 0.15)
    
    # Step 3: Calculate Zero Trust Maturity average
    zt_maturity_avg = maturity_scores['Eval'].mean() / 4  # Normalize to 0-1
    
    # Step 4: Calculate Base Score
    avg_protection = sum(vector_scores.values()) / len(vector_scores)
    base_score = (zt_maturity_avg * 2.5) * avg_protection
    
    # Step 5: Calculate RCI (using maturity as proxy)
    maturity_level = round(maturity_scores['Eval'].mean())
    rci_row = maturity_mapping[maturity_mapping['Maturity_Level'] == maturity_level].iloc[0]
    
    rci = (rci_row['RCI_Recovery_Readiness'] * 0.35 + 
           rci_row['RCI_Process_Maturity'] * 0.30 + 
           rci_row['RCI_Investment_Adequacy'] * 0.20 + 
           rci_row['RCI_Adaptive_Learning'] * 0.15)
    
    # Step 6: Calculate final Immunity Score
    immunity_score = base_score * (1 - bei) * rci * 10
    
    # Create output structure
    output_data = {
        'Assessment_Summary': {
            'Client': client_name,
            'Assessment_Date': datetime.now().strftime('%Y-%m-%d'),
            'Immunity_Score': round(immunity_score, 2),
            'Risk_Level': 'Critical' if immunity_score < 4 else 'Medium' if immunity_score < 6 else 'Good' if immunity_score < 8 else 'Resilient',
            'Base_Score': round(base_score, 3),
            'BEI': round(bei, 3),
            'RCI': round(rci, 3)
        },
        'Component_Scores': {
            'Protection_Effectiveness': round(avg_protection, 3),
            'Zero_Trust_Maturity': round(zt_maturity_avg, 3),
            'Industry_Vulnerability': round(bei_components['Industry_Vulnerability'], 3),
            'Digital_Dependency': round(bei_components['Digital_Dependency'], 3),
            'Decision_Speed': round(bei_components['Decision_Speed'], 3),
            'Geographic_Risk': round(bei_components['Geographic_Risk'], 3)
        },
        'Vector_Analysis': vector_scores,
        'Recommendations': generate_recommendations(immunity_score, vector_scores, bei_components)
    }
    
    # Save to Excel
    output_file = f'immunity_assessment_{client_name}_{datetime.now().strftime("%Y%m%d")}.xlsx'
    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        pd.DataFrame([output_data['Assessment_Summary']]).to_excel(writer, sheet_name='Summary', index=False)
        pd.DataFrame([output_data['Component_Scores']]).to_excel(writer, sheet_name='Components', index=False)
        pd.DataFrame(list(output_data['Vector_Analysis'].items()), 
                    columns=['Attack_Vector', 'Protection_Score']).to_excel(writer, sheet_name='Vectors', index=False)
        pd.DataFrame(output_data['Recommendations']).to_excel(writer, sheet_name='Recommendations', index=False)
    
    print(f"✅ Migration complete! Immunity Score: {immunity_score:.2f}")
    print(f"📄 Output saved to: {output_file}")
    
    return output_data


def generate_recommendations(immunity_score, vector_scores, bei_components):
    """Generate specific recommendations based on scores"""
    recommendations = []
    
    # Critical recommendations based on immunity score
    if immunity_score < 4:
        recommendations.append({
            'Priority': 'CRITICAL',
            'Area': 'Overall Resilience',
            'Recommendation': 'Implement emergency response plan - your immunity is critically low',
            'Impact': 'Reduce breach probability by 70%'
        })
    
    # Vector-specific recommendations
    for vector, score in vector_scores.items():
        if score < 0.6:  # Below 60% protection
            recommendations.append({
                'Priority': 'HIGH',
                'Area': vector,
                'Recommendation': f'Strengthen {vector} controls - current protection at {score*100:.0f}%',
                'Impact': f'Improve immunity by {(0.8-score)*2:.1f} points'
            })
    
    # BEI recommendations
    if bei_components['Digital_Dependency'] > 0.8:
        recommendations.append({
            'Priority': 'MEDIUM',
            'Area': 'Business Model',
            'Recommendation': 'Diversify operational channels - extremely high digital dependency',
            'Impact': 'Reduce single point of failure risk'
        })
    
    return recommendations


if __name__ == "__main__":
    # Create the transition mapping file
    create_transition_mapping()
    
    # Example migration (commented out - run when ready)
    # migrate_zt_to_immunity('CLHZT2024.xlsx', 'ClientName')