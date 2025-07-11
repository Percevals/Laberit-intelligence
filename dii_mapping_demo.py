#!/usr/bin/env python3
"""
DII 4.0 Mapping Analysis - Demonstration
This script demonstrates the mapping logic and generates sample output
based on expected data structure from MasterDatabaseV3.1.xlsx
"""

import json
from datetime import datetime
from collections import Counter

# DII 4.0 Model Definitions
DII_4_MODELS = {
    "A-RC": "Recovery Optimized for All Threats",
    "C-RY": "Recovery Optimized for Cyber Threats",
    "A-RS": "Resilience Optimized for All Threats", 
    "C-RS": "Resilience Optimized for Cyber Threats",
    "A-RG": "Response Optimized for All Threats",
    "C-RG": "Response Optimized for Cyber Threats"
}

# Sample data representing typical combinations from MasterDatabaseV3.1.xlsx
SAMPLE_COMBINATIONS = [
    {"SECTOR": "FINANCIAL", "BUSINESS_MODEL": "B2B", "ARCHETYPE_ID": "ARCHETYPE_02", "CLOUD_ADOPTION_LEVEL": "HIGH", "CLIENT_COUNT": 45},
    {"SECTOR": "FINANCIAL", "BUSINESS_MODEL": "B2B", "ARCHETYPE_ID": "ARCHETYPE_04", "CLOUD_ADOPTION_LEVEL": "HIGH", "CLIENT_COUNT": 38},
    {"SECTOR": "HEALTHCARE", "BUSINESS_MODEL": "B2G", "ARCHETYPE_ID": "ARCHETYPE_03", "CLOUD_ADOPTION_LEVEL": "MEDIUM", "CLIENT_COUNT": 32},
    {"SECTOR": "RETAIL", "BUSINESS_MODEL": "B2C", "ARCHETYPE_ID": "ARCHETYPE_05", "CLOUD_ADOPTION_LEVEL": "HIGH", "CLIENT_COUNT": 28},
    {"SECTOR": "TECHNOLOGY", "BUSINESS_MODEL": "B2B", "ARCHETYPE_ID": "ARCHETYPE_02", "CLOUD_ADOPTION_LEVEL": "HIGH", "CLIENT_COUNT": 25},
    {"SECTOR": "MANUFACTURING", "BUSINESS_MODEL": "B2B", "ARCHETYPE_ID": "ARCHETYPE_01", "CLOUD_ADOPTION_LEVEL": "LOW", "CLIENT_COUNT": 22},
    {"SECTOR": "GOVERNMENT", "BUSINESS_MODEL": "B2G", "ARCHETYPE_ID": "ARCHETYPE_03", "CLOUD_ADOPTION_LEVEL": "MEDIUM", "CLIENT_COUNT": 20},
    {"SECTOR": "RETAIL", "BUSINESS_MODEL": "B2C", "ARCHETYPE_ID": "ARCHETYPE_06", "CLOUD_ADOPTION_LEVEL": "HIGH", "CLIENT_COUNT": 18},
    {"SECTOR": "HEALTHCARE", "BUSINESS_MODEL": "B2B", "ARCHETYPE_ID": "ARCHETYPE_01", "CLOUD_ADOPTION_LEVEL": "LOW", "CLIENT_COUNT": 15},
    {"SECTOR": "FINANCIAL", "BUSINESS_MODEL": "B2C", "ARCHETYPE_ID": "ARCHETYPE_04", "CLOUD_ADOPTION_LEVEL": "MEDIUM", "CLIENT_COUNT": 12}
]

# Priority rules for mapping
MAPPING_RULES = {
    "archetype_mappings": {
        "ARCHETYPE_01": {"model": "A-RC", "confidence": 0.95, "reason": "Pure recovery focus across all threats"},
        "ARCHETYPE_02": {"model": "C-RY", "confidence": 0.95, "reason": "Cyber-specific recovery optimization"},
        "ARCHETYPE_03": {"model": "A-RS", "confidence": 0.90, "reason": "Balanced resilience approach"},
        "ARCHETYPE_04": {"model": "C-RS", "confidence": 0.90, "reason": "Cyber resilience focus"},
        "ARCHETYPE_05": {"model": "A-RG", "confidence": 0.85, "reason": "Response-oriented approach"},
        "ARCHETYPE_06": {"model": "C-RG", "confidence": 0.85, "reason": "Cyber response specialization"}
    },
    "business_model_modifiers": {
        "B2B": {"confidence_boost": 0.05, "cyber_preference": 0.2},
        "B2C": {"confidence_boost": 0.03, "all_threats_preference": 0.1},
        "B2G": {"confidence_boost": 0.08, "resilience_preference": 0.15}
    },
    "cloud_adoption_modifiers": {
        "HIGH": {"cyber_boost": 0.1, "recovery_boost": 0.05},
        "MEDIUM": {"resilience_boost": 0.05},
        "LOW": {"response_boost": 0.05, "all_threats_boost": 0.05}
    },
    "sector_preferences": {
        "FINANCIAL": {"models": ["C-RS", "C-RY"], "boost": 0.1},
        "HEALTHCARE": {"models": ["A-RS", "A-RC"], "boost": 0.1},
        "RETAIL": {"models": ["C-RG", "A-RG"], "boost": 0.08},
        "TECHNOLOGY": {"models": ["C-RY", "C-RS"], "boost": 0.12},
        "MANUFACTURING": {"models": ["A-RC", "A-RS"], "boost": 0.08},
        "GOVERNMENT": {"models": ["A-RS", "C-RS"], "boost": 0.15}
    }
}

def calculate_mapping(combination):
    """Calculate DII 4.0 mapping for a specific combination."""
    scores = {model: 0.0 for model in DII_4_MODELS.keys()}
    confidence_factors = []
    reasoning = []
    
    # Step 1: Base archetype mapping
    archetype = combination['ARCHETYPE_ID']
    if archetype in MAPPING_RULES['archetype_mappings']:
        mapping = MAPPING_RULES['archetype_mappings'][archetype]
        scores[mapping['model']] = mapping['confidence']
        confidence_factors.append(mapping['confidence'])
        reasoning.append(f"Archetype {archetype}: {mapping['reason']}")
    
    # Step 2: Business model adjustments
    business_model = combination['BUSINESS_MODEL']
    if business_model in MAPPING_RULES['business_model_modifiers']:
        modifier = MAPPING_RULES['business_model_modifiers'][business_model]
        
        if 'cyber_preference' in modifier:
            for model in ['C-RY', 'C-RS', 'C-RG']:
                scores[model] *= (1 + modifier['cyber_preference'])
        
        if 'all_threats_preference' in modifier:
            for model in ['A-RC', 'A-RS', 'A-RG']:
                scores[model] *= (1 + modifier['all_threats_preference'])
        
        if 'resilience_preference' in modifier:
            for model in ['A-RS', 'C-RS']:
                scores[model] *= (1 + modifier['resilience_preference'])
        
        confidence_factors.append(modifier['confidence_boost'])
        reasoning.append(f"{business_model} business model adjustments")
    
    # Step 3: Cloud adoption impact
    cloud_level = combination['CLOUD_ADOPTION_LEVEL']
    if cloud_level in MAPPING_RULES['cloud_adoption_modifiers']:
        modifier = MAPPING_RULES['cloud_adoption_modifiers'][cloud_level]
        
        if 'cyber_boost' in modifier:
            for model in ['C-RY', 'C-RS', 'C-RG']:
                scores[model] *= (1 + modifier['cyber_boost'])
        
        if 'recovery_boost' in modifier:
            for model in ['A-RC', 'C-RY']:
                scores[model] *= (1 + modifier['recovery_boost'])
        
        if 'resilience_boost' in modifier:
            for model in ['A-RS', 'C-RS']:
                scores[model] *= (1 + modifier['resilience_boost'])
        
        if 'response_boost' in modifier:
            for model in ['A-RG', 'C-RG']:
                scores[model] *= (1 + modifier['response_boost'])
        
        if 'all_threats_boost' in modifier:
            for model in ['A-RC', 'A-RS', 'A-RG']:
                scores[model] *= (1 + modifier['all_threats_boost'])
        
        reasoning.append(f"{cloud_level} cloud adoption impact")
    
    # Step 4: Sector-specific preferences
    sector = combination['SECTOR']
    if sector in MAPPING_RULES['sector_preferences']:
        pref = MAPPING_RULES['sector_preferences'][sector]
        for model in pref['models']:
            scores[model] *= (1 + pref['boost'])
        reasoning.append(f"{sector} sector preferences")
    
    # Normalize scores
    total = sum(scores.values())
    if total > 0:
        for model in scores:
            scores[model] /= total
    
    # Find primary recommendation
    primary_model = max(scores, key=scores.get)
    
    # Calculate confidence
    avg_confidence = sum(confidence_factors) / len(confidence_factors) if confidence_factors else 0.5
    model_confidence = scores[primary_model]
    overall_confidence = (avg_confidence + model_confidence) / 2
    
    return {
        'primary_model': primary_model,
        'model_description': DII_4_MODELS[primary_model],
        'confidence': round(overall_confidence, 3),
        'all_scores': {k: round(v, 3) for k, v in scores.items()},
        'reasoning': ' | '.join(reasoning)
    }

def generate_mapping_analysis():
    """Generate complete mapping analysis."""
    mapping_results = []
    
    for combo in SAMPLE_COMBINATIONS:
        mapping = calculate_mapping(combo)
        
        result = {
            'combination': {
                'sector': combo['SECTOR'],
                'business_model': combo['BUSINESS_MODEL'],
                'archetype_id': combo['ARCHETYPE_ID'],
                'cloud_adoption_level': combo['CLOUD_ADOPTION_LEVEL']
            },
            'client_count': combo['CLIENT_COUNT'],
            'dii_4_mapping': mapping
        }
        
        mapping_results.append(result)
    
    return mapping_results

def calculate_statistics(mapping_results):
    """Calculate summary statistics."""
    model_counts = Counter()
    confidence_levels = []
    sector_distribution = Counter()
    
    for result in mapping_results:
        model = result['dii_4_mapping']['primary_model']
        count = result['client_count']
        
        model_counts[model] += count
        confidence_levels.append(result['dii_4_mapping']['confidence'])
        sector_distribution[result['combination']['sector']] += count
    
    return {
        'model_distribution': dict(model_counts),
        'average_confidence': round(sum(confidence_levels) / len(confidence_levels), 3),
        'top_sectors': dict(sector_distribution.most_common(5)),
        'total_clients': sum(result['client_count'] for result in mapping_results)
    }

def save_results(mapping_results):
    """Save analysis results to files."""
    stats = calculate_statistics(mapping_results)
    
    # Create full report
    report = {
        'metadata': {
            'generated_date': datetime.now().isoformat(),
            'total_combinations': len(mapping_results),
            'total_clients': stats['total_clients']
        },
        'mapping_matrix': mapping_results,
        'summary_statistics': stats,
        'dii_4_models': DII_4_MODELS
    }
    
    # Save JSON
    with open('dii_4_mapping_analysis.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    # Save readable report
    with open('dii_4_mapping_analysis.txt', 'w') as f:
        f.write("DII 4.0 MAPPING ANALYSIS REPORT\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Generated: {report['metadata']['generated_date']}\n")
        f.write(f"Total Unique Combinations: {report['metadata']['total_combinations']}\n")
        f.write(f"Total Clients Analyzed: {report['metadata']['total_clients']}\n\n")
        
        f.write("DII 4.0 MODEL DEFINITIONS\n")
        f.write("-" * 80 + "\n")
        for model, desc in DII_4_MODELS.items():
            f.write(f"{model}: {desc}\n")
        
        f.write("\n\nMAPPING PRIORITY RULES\n")
        f.write("-" * 80 + "\n")
        f.write("Priority 1: Archetype-based core mapping (highest weight)\n")
        f.write("Priority 2: Business model modifiers (B2B, B2C, B2G)\n")
        f.write("Priority 3: Cloud adoption level impact\n")
        f.write("Priority 4: Sector-specific preferences\n")
        
        f.write("\n\nDETAILED MAPPING MATRIX\n")
        f.write("-" * 80 + "\n\n")
        
        for i, result in enumerate(mapping_results, 1):
            combo = result['combination']
            mapping = result['dii_4_mapping']
            
            f.write(f"Combination #{i}\n")
            f.write(f"{'='*40}\n")
            f.write(f"Sector: {combo['sector']}\n")
            f.write(f"Business Model: {combo['business_model']}\n")
            f.write(f"Archetype: {combo['archetype_id']}\n")
            f.write(f"Cloud Adoption: {combo['cloud_adoption_level']}\n")
            f.write(f"Client Count: {result['client_count']}\n")
            f.write(f"\nRecommended Model: {mapping['primary_model']} - {mapping['model_description']}\n")
            f.write(f"Confidence Level: {mapping['confidence']:.1%}\n")
            f.write(f"Reasoning: {mapping['reasoning']}\n")
            f.write(f"\nAll Model Scores:\n")
            for model, score in sorted(mapping['all_scores'].items(), key=lambda x: x[1], reverse=True):
                f.write(f"  {model}: {score:.3f} ({score:.1%})\n")
            f.write("\n")
        
        f.write("\nSUMMARY STATISTICS\n")
        f.write("-" * 80 + "\n")
        f.write(f"Total Clients: {stats['total_clients']}\n")
        f.write(f"Average Confidence: {stats['average_confidence']:.1%}\n\n")
        
        f.write("Model Distribution (by client count):\n")
        for model, count in sorted(stats['model_distribution'].items(), key=lambda x: x[1], reverse=True):
            percentage = count / stats['total_clients'] * 100
            f.write(f"  {model} ({DII_4_MODELS[model]}): {count} clients ({percentage:.1f}%)\n")
        
        f.write("\nTop Sectors (by client count):\n")
        for sector, count in stats['top_sectors'].items():
            percentage = count / stats['total_clients'] * 100
            f.write(f"  {sector}: {count} clients ({percentage:.1f}%)\n")

def main():
    """Main execution."""
    print("DII 4.0 Mapping Analysis Demo")
    print("=" * 50)
    print("\nThis demonstration shows how the mapping algorithm works")
    print("using sample data representative of MasterDatabaseV3.1.xlsx\n")
    
    print("Generating mapping analysis...")
    mapping_results = generate_mapping_analysis()
    
    print("Calculating statistics...")
    stats = calculate_statistics(mapping_results)
    
    print("\nSummary:")
    print(f"- Analyzed {len(mapping_results)} unique combinations")
    print(f"- Total clients: {stats['total_clients']}")
    print(f"- Average confidence: {stats['average_confidence']:.1%}")
    
    print("\nModel distribution:")
    for model, count in sorted(stats['model_distribution'].items(), key=lambda x: x[1], reverse=True):
        print(f"  {model}: {count} clients")
    
    print("\nSaving results...")
    save_results(mapping_results)
    
    print("\nAnalysis complete! Results saved to:")
    print("  - dii_4_mapping_analysis.json (detailed data)")
    print("  - dii_4_mapping_analysis.txt (readable report)")

if __name__ == "__main__":
    main()