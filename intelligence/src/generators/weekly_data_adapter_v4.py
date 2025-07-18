#!/usr/bin/env python3
"""
Weekly Data Adapter V4
Transforms weekly-intelligence.json to V4 dashboard generator format
Includes Spain-specific data and executive-friendly structure
"""

import json
from datetime import datetime
from pathlib import Path
from collections import Counter

def transform_to_v4_format(input_file, output_file):
    """Transform weekly intelligence data to V4 dashboard generator format"""
    
    # Load weekly intelligence data
    with open(input_file, 'r', encoding='utf-8') as f:
        weekly_data = json.load(f)
    
    # Extract week date - use research_date if available
    week_date = weekly_data.get('research_date', datetime.now().strftime('%Y-%m-%d'))
    
    # Add week_date to the original data structure for compatibility
    weekly_data['week_date'] = week_date
    
    # Calculate immunity average from business model assessments
    immunity_scores = []
    business_model_insights = {}
    
    for model, data in weekly_data.get('business_model_assessment', {}).items():
        immunity_score = float(data.get('current_immunity', 0))
        immunity_scores.append(immunity_score)
        
        # Map trend terminology
        trend_map = {
            'declining': 'declining',
            'critical': 'declining',
            'stable': 'stable',
            'improving': 'improving'
        }
        
        # Extract key threats from vulnerability description
        vulnerability = data.get('key_vulnerability', '')
        threats = []
        if 'ransomware' in vulnerability.lower():
            threats.append('Ransomware')
        if 'phishing' in vulnerability.lower():
            threats.append('Phishing')
        if 'api' in vulnerability.lower():
            threats.append('API attacks')
        if 'insider' in vulnerability.lower():
            threats.append('Insider threats')
        if 'supply chain' in vulnerability.lower():
            threats.append('Supply chain attacks')
        if not threats:
            threats = ['Multiple threats']
        
        business_model_insights[model] = {
            'immunity_score': immunity_score,
            'trend': trend_map.get(data.get('trend', 'stable'), 'stable'),
            'key_threats': threats[:2],  # Top 2 threats
            'vulnerability': vulnerability,
            'recommendation': data.get('recommendation', '')
        }
    
    avg_immunity = sum(immunity_scores) / len(immunity_scores) if immunity_scores else 3.8
    
    # Extract dimension values and trends
    # Since the weekly data doesn't have specific dimension values, we'll calculate them
    # based on the average immunity and business model data
    dii_dimensions = calculate_dimensions_from_immunity(avg_immunity, weekly_data)
    
    # Process incidents - separate Spain from others
    all_incidents = []
    
    # Process LATAM incidents
    for inc in weekly_data.get('incidents', []):
        all_incidents.append({
            'date': inc.get('date', '2025-07-XX'),
            'country': inc.get('country', 'LATAM'),
            'sector': inc.get('sector', 'Unknown'),
            'org_name': inc.get('organization', 'Organización no divulgada'),
            'attack_type': inc.get('attack_type', 'Cyberattack'),
            'business_model': inc.get('business_model', 'UNKNOWN'),
            'impact': inc.get('impact_level', 'High'),
            'summary': inc.get('summary', ''),
            'business_lesson': extract_business_lesson(inc)
        })
    
    # Process Spain incidents
    for inc in weekly_data.get('spain_incidents', []):
        if inc.get('organization') != 'No incidents publicly reported':
            all_incidents.append({
                'date': inc.get('date', '2025-07-XX'),
                'country': 'España',
                'sector': inc.get('sector', 'Multiple'),
                'org_name': inc.get('organization', 'Empresa española'),
                'attack_type': inc.get('attack_type', 'N/A'),
                'business_model': inc.get('business_model', 'N/A'),
                'impact': inc.get('impact_level', 'N/A'),
                'summary': inc.get('summary', ''),
                'business_lesson': inc.get('business_lesson', 'Mantener vigilancia constante es crítico')
            })
    
    # Get most affected model
    if all_incidents:
        model_counts = Counter(inc['business_model'] for inc in all_incidents if inc['business_model'] != 'N/A')
        most_affected = model_counts.most_common(1)[0][0] if model_counts else 'SERVICIOS_FINANCIEROS'
    else:
        most_affected = 'SERVICIOS_FINANCIEROS'
    
    # Extract threat statistics
    stats = weekly_data.get('statistics', {})
    threat_trends = weekly_data.get('threat_trends', [])
    top_threat = threat_trends[0] if threat_trends else {}
    
    # Calculate victims with low immunity
    victims_low_immunity = calculate_victims_percentage(all_incidents, business_model_insights)
    
    # Generate recommendations based on insights
    recommendations = generate_v4_recommendations(business_model_insights, threat_trends)
    
    # Create immunity chart quadrant data
    immunity_chart_data = distribute_models_to_quadrants(business_model_insights)
    
    # Build V4 output structure
    output_data = {
        'week_date': week_date,
        'week_summary': {
            'immunity_avg': str(round(avg_immunity, 1)),
            'attacks_week': extract_attacks_per_week(stats),
            'top_threat_pct': top_threat.get('growth', '52%'),
            'top_threat_type': top_threat.get('trend', 'Ransomware'),
            'victims_low_immunity_pct': victims_low_immunity,
            'key_insight': weekly_data.get('week_summary', {}).get('key_finding', 
                'La inmunidad digital determina quién sobrevive y quién cae ante los ciberataques')
        },
        'dii_dimensions': dii_dimensions,
        'business_model_insights': business_model_insights,
        'incidents': all_incidents,
        'spain_specific': {
            'incidents_count': len([i for i in all_incidents if i['country'] == 'España']),
            'regulatory_updates': extract_spain_regulatory_updates(weekly_data),
            'spanish_companies_affected': [i['org_name'] for i in all_incidents if i['country'] == 'España']
        },
        'recommendations': recommendations,
        'immunity_chart_data': immunity_chart_data
    }
    
    # Write output file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ V4-formatted data written to: {output_file}")
    return output_data

def calculate_dimensions_from_immunity(avg_immunity, weekly_data):
    """Calculate dimension values based on immunity score and data"""
    
    # Base values for average immunity
    base_values = {
        3.0: {'TRD': 12, 'AER': 75, 'HFP': 72, 'BRI': 65, 'RRG': 3.8},
        4.0: {'TRD': 18, 'AER': 50, 'HFP': 65, 'BRI': 55, 'RRG': 3.2},
        5.0: {'TRD': 24, 'AER': 35, 'HFP': 55, 'BRI': 45, 'RRG': 2.5},
        6.0: {'TRD': 48, 'AER': 25, 'HFP': 45, 'BRI': 35, 'RRG': 2.0}
    }
    
    # Find closest base
    closest_base = min(base_values.keys(), key=lambda x: abs(x - avg_immunity))
    values = base_values[closest_base].copy()
    
    # Adjust based on actual data insights
    threat_trends = weekly_data.get('threat_trends', [])
    
    # Determine trends based on threat landscape
    dimensions = {}
    for dim in ['TRD', 'AER', 'HFP', 'BRI', 'RRG']:
        trend = 'stable'
        
        # Analyze trends
        if dim == 'HFP' and any('phishing' in t.get('trend', '').lower() for t in threat_trends):
            trend = 'declining'
        elif dim == 'AER' and any('AI' in t.get('trend', '') for t in threat_trends):
            trend = 'declining'
        elif dim == 'TRD' and avg_immunity < 4:
            trend = 'declining'
        elif dim == 'BRI' and 'Zero Trust' in str(weekly_data):
            trend = 'improving'
        
        dimensions[dim] = {
            'value': str(values[dim]),
            'trend': trend
        }
    
    return dimensions

def extract_business_lesson(incident):
    """Extract or generate business lesson from incident"""
    
    # Check if business_lesson already exists
    if 'business_lesson' in incident:
        return incident['business_lesson']
    
    # Generate based on incident characteristics
    attack_type = incident.get('attack_type', '').lower()
    impact = incident.get('impact_level', '').lower()
    summary = incident.get('summary', '').lower()
    
    if 'ransomware' in attack_type:
        if 'backup' in summary:
            return "La inversión en backups inmutables demostró ROI directo al evitar pago de rescate"
        else:
            return "Sin backups verificados, el ransomware paraliza operaciones por días o semanas"
    
    if 'insider' in attack_type:
        return "El mayor riesgo viene de adentro - controles de acceso privilegiado son críticos"
    
    if 'supply chain' in attack_type:
        return "La seguridad es tan fuerte como el eslabón más débil de la cadena"
    
    if impact == 'critical':
        return "La falta de segmentación convirtió un incidente menor en crisis empresarial"
    
    return "La preparación marca la diferencia entre incidente y catástrofe"

def extract_attacks_per_week(stats):
    """Extract attacks per week from statistics"""
    total_incidents = stats.get('total_incidents', '')
    
    # Try to extract LATAM number
    if 'LATAM:' in total_incidents:
        attacks = total_incidents.split('LATAM: ')[1].split(' ')[0]
        return attacks.replace('attacks/org/week', '')
    
    # Default
    return '2,569'

def calculate_victims_percentage(incidents, model_insights):
    """Calculate percentage of victims with low immunity"""
    if not incidents:
        return '68%'
    
    # Count incidents affecting models with immunity < 4
    low_immunity_incidents = 0
    for inc in incidents:
        model = inc.get('business_model')
        if model in model_insights:
            if model_insights[model]['immunity_score'] < 4.0:
                low_immunity_incidents += 1
    
    if len(incidents) > 0:
        percentage = (low_immunity_incidents / len(incidents)) * 100
        return f"{int(percentage)}%"
    
    return '68%'

def generate_v4_recommendations(model_insights, threat_trends):
    """Generate executive recommendations based on insights"""
    recommendations = []
    
    # Find critical models (immunity < 4)
    critical_models = [m for m, d in model_insights.items() if d['immunity_score'] < 4.0]
    
    if critical_models:
        recommendations.append({
            'priority': 'CRÍTICA',
            'business_models': critical_models[:3],
            'recommendation': 'Implementar Zero Trust y segmentación de red urgentemente',
            'expected_impact': 'Reducir radio de impacto 60% en 90 días'
        })
    
    # Check for ransomware trend
    if any('ransomware' in t.get('trend', '').lower() for t in threat_trends):
        affected_models = [m for m, d in model_insights.items() 
                          if 'Ransomware' in d.get('key_threats', [])]
        if affected_models:
            recommendations.append({
                'priority': 'CRÍTICA',
                'business_models': affected_models[:3],
                'recommendation': 'Actualizar arquitectura de backups a inmutable',
                'expected_impact': 'Reducir tiempo de recuperación de 21 a 3 días'
            })
    
    # API security for digital models
    api_models = ['ECOSISTEMA_DIGITAL', 'SERVICIOS_FINANCIEROS', 'SOFTWARE_CRITICO']
    if any(m in model_insights for m in api_models):
        recommendations.append({
            'priority': 'ALTA',
            'business_models': [m for m in api_models if m in model_insights],
            'recommendation': 'Implementar testing de seguridad API y rate limiting',
            'expected_impact': 'Reducir ataques API 60% en 30 días'
        })
    
    # Generic but important
    recommendations.append({
        'priority': 'ALTA',
        'business_models': [],  # All models
        'recommendation': 'Actualizar programa de concientización contra IA-phishing',
        'expected_impact': 'Reducir clicks en phishing 40% en 60 días'
    })
    
    return recommendations[:4]  # Top 4 recommendations

def distribute_models_to_quadrants(model_insights):
    """Distribute business models into immunity/exposure quadrants"""
    
    quadrants = {
        'high_immunity_low_exposure': [],
        'high_immunity_high_exposure': [],
        'low_immunity_low_exposure': [],
        'low_immunity_high_exposure': []
    }
    
    # Define exposure levels by model type
    high_exposure_models = ['SERVICIOS_FINANCIEROS', 'ECOSISTEMA_DIGITAL', 'SERVICIOS_DATOS', 'INFORMACION_REGULADA']
    
    for model, data in model_insights.items():
        immunity = data['immunity_score']
        is_high_exposure = model in high_exposure_models
        
        if immunity >= 6.0:
            if is_high_exposure:
                quadrants['high_immunity_high_exposure'].append(model)
            else:
                quadrants['high_immunity_low_exposure'].append(model)
        else:
            if is_high_exposure:
                quadrants['low_immunity_high_exposure'].append(model)
            else:
                quadrants['low_immunity_low_exposure'].append(model)
    
    return {'quadrants': quadrants}

def extract_spain_regulatory_updates(weekly_data):
    """Extract Spain-specific regulatory updates"""
    updates = []
    
    spain_context = weekly_data.get('spain_context', {})
    
    # Critical updates
    for update in spain_context.get('critical_updates', []):
        updates.append({
            'date': update.get('date'),
            'type': update.get('type'),
            'severity': update.get('severity'),
            'impact': update.get('business_impact', '')
        })
    
    # Regulatory updates
    reg_updates = spain_context.get('regulatory_updates', {})
    if reg_updates:
        if reg_updates.get('nis2_status'):
            updates.append({
                'date': '2025-07',
                'type': 'NIS2 Compliance',
                'severity': 'Critical',
                'impact': reg_updates.get('nis2_status')
            })
    
    return updates[:3]  # Top 3 updates

def main():
    """Main function to run the V4 adapter"""
    # Paths
    base_dir = Path(__file__).parent.parent.parent
    week = 'week-29'
    year = '2025'
    
    input_file = base_dir / 'research' / year / week / 'weekly-intelligence.json'
    
    # V4 generator will look in research directory
    output_dir = base_dir / 'research' / year / week
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / 'intelligence-data.json'
    
    if not input_file.exists():
        print(f"❌ Input file not found: {input_file}")
        return
    
    # Transform the data
    transform_to_v4_format(input_file, output_file)
    
    print(f"📋 V4 generator will find data at: {output_file}")

if __name__ == "__main__":
    main()