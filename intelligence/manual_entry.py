#!/usr/bin/env python3
"""
Manual Entry Tool for Weekly Intelligence Report
Quick solution for July 11, 2025 report
"""

import json
from datetime import datetime

# Sample template based on previous reports
incidents_template = {
    "metadata": {
        "generated_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "total_incidents": 0,
        "date_range": {
            "start": "2025-07-05",
            "end": "2025-07-11"
        },
        "sources": ["Manual Research", "SOCRadar", "CERT Advisories", "News Sources"]
    },
    "incidents": []
}

# Example incidents structure for manual entry
example_incidents = [
    {
        "title": "Major Ransomware Attack on Brazilian Healthcare Network",
        "url": "https://example.com/incident1",
        "date": "2025-07-08 14:30:00",
        "source": "Manual Research",
        "summary": "A sophisticated ransomware group targeted Brazil's second-largest healthcare network, affecting 15 hospitals and encrypting patient records. The attack disrupted emergency services across São Paulo.",
        "business_impacts": ["healthcare", "hospital", "medical"],
        "relevance_score": 5,
        "immunity_impact": {
            "sector": "Healthcare",
            "severity": "Critical",
            "business_functions_affected": ["Patient Care", "Emergency Services", "Medical Records"],
            "estimated_recovery_time": "7-14 days"
        }
    },
    {
        "title": "Data Breach at Mexican Financial Institution Exposes 2M Records",
        "url": "https://example.com/incident2",
        "date": "2025-07-07 09:15:00",
        "source": "CERT Mexico",
        "summary": "A major Mexican bank suffered a data breach exposing personal and financial information of over 2 million customers. The breach was attributed to an unpatched vulnerability in their online banking platform.",
        "business_impacts": ["financial", "bank", "payment"],
        "relevance_score": 5,
        "immunity_impact": {
            "sector": "Financial Services",
            "severity": "High",
            "business_functions_affected": ["Online Banking", "Customer Trust", "Regulatory Compliance"],
            "estimated_recovery_time": "30-45 days"
        }
    },
    {
        "title": "Colombian Government Websites Hit by DDoS Campaign",
        "url": "https://example.com/incident3",
        "date": "2025-07-06 16:45:00",
        "source": "CERT Colombia",
        "summary": "Multiple Colombian government websites were taken offline by a coordinated DDoS attack. The attack lasted 6 hours and affected citizen services including tax payments and document processing.",
        "business_impacts": ["government", "public"],
        "relevance_score": 4,
        "immunity_impact": {
            "sector": "Government",
            "severity": "Medium",
            "business_functions_affected": ["Citizen Services", "Online Payments", "Document Processing"],
            "estimated_recovery_time": "1-2 days"
        }
    },
    {
        "title": "Supply Chain Attack Targets LATAM E-commerce Platforms",
        "url": "https://example.com/incident4",
        "date": "2025-07-09 11:00:00",
        "source": "SOCRadar",
        "summary": "A supply chain attack targeting a popular payment processing library affected multiple e-commerce platforms across Latin America. The malware was designed to steal credit card information during checkout.",
        "business_impacts": ["retail", "e-commerce", "payment"],
        "relevance_score": 5,
        "immunity_impact": {
            "sector": "Retail",
            "severity": "High",
            "business_functions_affected": ["Payment Processing", "Customer Data", "Sales Operations"],
            "estimated_recovery_time": "3-5 days"
        }
    },
    {
        "title": "Argentine Energy Company Targeted by Industrial Cyber Attack",
        "url": "https://example.com/incident5",
        "date": "2025-07-10 08:30:00",
        "source": "Manual Research",
        "summary": "An Argentine energy distribution company reported a cyber attack on their industrial control systems. The attack attempted to disrupt power distribution but was contained before causing outages.",
        "business_impacts": ["energy", "industrial"],
        "relevance_score": 4,
        "immunity_impact": {
            "sector": "Energy",
            "severity": "High",
            "business_functions_affected": ["Power Distribution", "SCADA Systems", "Grid Management"],
            "estimated_recovery_time": "2-3 days"
        }
    }
]

def create_manual_report():
    """Create a manual report with example data"""
    report = incidents_template.copy()
    
    print("Manual Entry Tool for Weekly Intelligence Report")
    print("=" * 50)
    print("\nThis tool helps you quickly create the weekly report data.")
    print("Example incidents have been pre-loaded. You can:")
    print("1. Use the example data as-is")
    print("2. Modify the examples")
    print("3. Add your own incidents")
    
    choice = input("\nUse example incidents? (y/n): ").lower().strip()
    
    if choice == 'y':
        report['incidents'] = example_incidents
        report['metadata']['total_incidents'] = len(example_incidents)
        
        print(f"\nAdded {len(example_incidents)} example incidents:")
        for i, incident in enumerate(example_incidents, 1):
            print(f"{i}. {incident['title']}")
            print(f"   Sector: {incident['immunity_impact']['sector']} | Severity: {incident['immunity_impact']['severity']}")
        
        # Save the report
        output_file = 'data/raw_incidents_2025-07-11.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ Report saved to: {output_file}")
        print("\nNext steps:")
        print("1. Review and edit the JSON file if needed")
        print("2. Run immunity_dashboard_generator.py to create the HTML report")
        print("3. Review the generated dashboard before publishing")
        
    else:
        print("\nTo add custom incidents, edit the generated JSON file directly.")
        print("Template structure has been shown above.")
        
        # Save empty template
        output_file = 'data/raw_incidents_2025-07-11.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"\n✅ Empty template saved to: {output_file}")

def show_perplexity_format():
    """Show the format needed for the dashboard generator"""
    print("\n" + "="*50)
    print("Format for immunity_dashboard_generator.py:")
    print("="*50)
    
    perplexity_format = {
        "incidents": [
            {
                "title": "Incident Title",
                "description": "Detailed description of the incident",
                "date": "2025-07-08",
                "source": "Source Name",
                "url": "https://source.url",
                "tags": ["ransomware", "healthcare", "brazil"],
                "affectedSector": "Healthcare",
                "impactScore": 85,
                "immunity": {
                    "financialServices": 0,
                    "healthcare": 85,
                    "retail": 0,
                    "government": 0,
                    "energy": 0
                }
            }
        ],
        "analysis": {
            "trends": ["Increased ransomware targeting healthcare", "Supply chain attacks rising"],
            "recommendations": ["Implement zero-trust architecture", "Enhanced monitoring of third-party integrations"],
            "sectorRisks": {
                "Healthcare": "Critical",
                "Financial Services": "High",
                "Retail": "Medium",
                "Government": "Medium",
                "Energy": "High"
            }
        }
    }
    
    print(json.dumps(perplexity_format, indent=2))
    
    # Convert and save
    output_file = 'data/perplexity-input-2025-07-11.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(perplexity_format, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Dashboard template saved to: {output_file}")

if __name__ == "__main__":
    create_manual_report()
    show_perplexity_format()