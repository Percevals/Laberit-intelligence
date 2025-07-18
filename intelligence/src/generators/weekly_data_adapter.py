#!/usr/bin/env python3
"""
Weekly Data Adapter
Transforms weekly-intelligence.json to perplexity-input format for dashboard generator
"""

import json
from datetime import datetime
from pathlib import Path

def transform_weekly_intelligence_to_dashboard_format(input_file, output_file):
    """Transform weekly intelligence data to dashboard generator format"""
    
    # Load weekly intelligence data
    with open(input_file, 'r', encoding='utf-8') as f:
        weekly_data = json.load(f)
    
    # Calculate immunity average from business model assessments
    immunity_scores = []
    for model, data in weekly_data.get('business_model_assessment', {}).items():
        if 'current_immunity' in data:
            immunity_scores.append(float(data['current_immunity']))
    
    avg_immunity = sum(immunity_scores) / len(immunity_scores) if immunity_scores else 3.8
    
    # Get attack statistics
    stats = weekly_data.get('statistics', {})
    total_incidents = stats.get('total_incidents', 'LATAM: 2,569 attacks/org/week')
    attacks_week = total_incidents.split('LATAM: ')[1].split(' ')[0] if 'LATAM:' in total_incidents else '2,569'
    
    # Transform threat actors
    threat_actors = []
    for actor in weekly_data.get('threat_actors', []):
        threat_actors.append({
            'name': actor['name'],
            'attacks_week': '15+' if actor['activity_level'] == 'Very High' else '10+' if actor['activity_level'] == 'High' else '5+',
            'immunity_threshold': '4',
            'targets': actor.get('target_sectors', [])
        })
    
    # Transform incidents
    incidents = []
    for inc in weekly_data.get('incidents', []):
        incidents.append({
            'sector': inc.get('sector', 'Unknown'),
            'description': inc.get('summary', ''),
            'source': inc.get('source', 'Threat Intel'),
            'immunity_score': '3.5',  # Default for victims
            'country': inc.get('country', 'LATAM')
        })
    
    # Add Spain incidents if any
    for inc in weekly_data.get('spain_incidents', []):
        if inc.get('organization') != 'No incidents publicly reported':
            incidents.append({
                'sector': inc.get('sector', 'Unknown'),
                'description': inc.get('summary', ''),
                'source': 'Spanish Intelligence',
                'immunity_score': '4.0',
                'country': 'España'
            })
    
    # Get threat trends
    threat_trends = weekly_data.get('threat_trends', [])
    top_threat = threat_trends[0] if threat_trends else {}
    
    # Build output structure
    output_data = {
        "week_summary": {
            "immunity_avg": str(round(avg_immunity, 1)),
            "attacks_week": attacks_week,
            "top_threat_pct": top_threat.get('growth', '52%'),
            "top_threat_type": top_threat.get('trend', 'Ransomware'),
            "victims_low_immunity_pct": "68%",  # From dashboard
            "key_insight": weekly_data.get('week_summary', {}).get('key_finding', 
                'El 71% de víctimas tenían inmunidad < 4. La preparación marca la diferencia.')
        },
        "incidents": incidents,
        "threat_actors": threat_actors,
        "statistics": {
            "attacks_vs_global": "40%",  # LATAM represents 40% of global attacks
            "main_vector": list(stats.get('primary_attack_vectors', {}).keys())[0] if stats.get('primary_attack_vectors') else "Web-based",
            "vector_pct": list(stats.get('primary_attack_vectors', {}).values())[0] if stats.get('primary_attack_vectors') else "64%"
        }
    }
    
    # Write output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Transformed data written to: {output_file}")
    return output_data

def main():
    """Main function to run the adapter"""
    # Paths
    base_dir = Path(__file__).parent.parent.parent
    week = 'week-29'
    
    input_file = base_dir / 'research' / '2025' / week / 'weekly-intelligence.json'
    output_file = base_dir / 'outputs' / 'dashboards' / f'perplexity-input-2025-07-17.json'
    
    if not input_file.exists():
        print(f"❌ Input file not found: {input_file}")
        return
    
    # Transform the data
    transform_weekly_intelligence_to_dashboard_format(input_file, output_file)
    
    # Also check if we need to update the generator's expected filename
    print(f"📋 Note: Dashboard generator expects: perplexity-input-2025-07-17.json")

if __name__ == "__main__":
    main()