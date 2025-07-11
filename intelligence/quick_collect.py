#!/usr/bin/env python3
"""
Quick RSS Feed Collector for LATAM Cybersecurity Intelligence
Created for immediate use - July 11, 2025 weekly report
"""

import json
import feedparser
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Any
import re
import time

# Configuration
RSS_FEEDS = [
    {"name": "SOC Radar", "url": "https://www.soc-radar.com/feed/"},
    {"name": "WeLiveSecurity ES", "url": "https://www.welivesecurity.com/es/feed/"},
    {"name": "InfoSecurity Magazine", "url": "https://www.infosecurity-magazine.com/rss/news/"},
    {"name": "Kaspersky LATAM", "url": "https://latam.kaspersky.com/blog/feed/"},
    {"name": "ZDNet Security", "url": "https://www.zdnet.com/topic/security/rss.xml"},
]

# Keywords for LATAM filtering
LATAM_KEYWORDS = [
    'latam', 'latin america', 'américa latina', 'latinoamérica',
    'mexico', 'méxico', 'brazil', 'brasil', 'colombia', 
    'argentina', 'chile', 'peru', 'perú', 'venezuela',
    'ecuador', 'bolivia', 'paraguay', 'uruguay',
    'español', 'espanol', 'portuguese', 'português', 'portugues',
    'spanish', 'spain', 'españa', 'espana'
]

# Cybersecurity keywords
CYBER_KEYWORDS = [
    'cyber', 'security', 'seguridad', 'hack', 'breach', 'brecha',
    'ransomware', 'malware', 'phishing', 'vulnerabilidad', 'vulnerability',
    'attack', 'ataque', 'threat', 'amenaza', 'incident', 'incidente',
    'data', 'datos', 'privacy', 'privacidad', 'ciberseguridad', 'cybersecurity'
]

# Business impact keywords
BUSINESS_IMPACT_KEYWORDS = [
    'financial', 'financiero', 'bank', 'banco', 'payment', 'pago',
    'healthcare', 'salud', 'hospital', 'medical', 'médico',
    'retail', 'comercio', 'e-commerce', 'online',
    'government', 'gobierno', 'public', 'público',
    'energy', 'energía', 'oil', 'petróleo', 'gas',
    'manufacturing', 'manufactura', 'industrial',
    'telecom', 'telecommunications', 'telecomunicaciones'
]

def is_within_date_range(entry_date: datetime) -> bool:
    """Check if entry is within last 7 days"""
    seven_days_ago = datetime.now() - timedelta(days=7)
    return entry_date >= seven_days_ago

def parse_entry_date(entry: Dict[str, Any]) -> datetime:
    """Parse various date formats from RSS entries"""
    date_fields = ['published_parsed', 'updated_parsed', 'created_parsed']
    
    for field in date_fields:
        if hasattr(entry, field) and getattr(entry, field):
            try:
                return datetime(*getattr(entry, field)[:6])
            except:
                continue
    
    # Fallback to current date if no date found
    return datetime.now()

def extract_text_content(entry: Dict[str, Any]) -> str:
    """Extract all text content from RSS entry"""
    text_parts = []
    
    # Title
    if hasattr(entry, 'title'):
        text_parts.append(entry.title)
    
    # Summary/Description
    if hasattr(entry, 'summary'):
        text_parts.append(entry.summary)
    elif hasattr(entry, 'description'):
        text_parts.append(entry.description)
    
    # Content
    if hasattr(entry, 'content'):
        for content in entry.content:
            if 'value' in content:
                text_parts.append(content['value'])
    
    # Clean HTML tags
    full_text = ' '.join(text_parts)
    clean_text = re.sub('<[^<]+?>', '', full_text)
    return clean_text.lower()

def is_latam_relevant(text: str) -> bool:
    """Check if content is LATAM/Spain relevant"""
    return any(keyword in text for keyword in LATAM_KEYWORDS)

def is_cyber_relevant(text: str) -> bool:
    """Check if content is cybersecurity relevant"""
    return any(keyword in text for keyword in CYBER_KEYWORDS)

def find_business_impacts(text: str) -> List[str]:
    """Find business impact keywords in text"""
    found_impacts = []
    for keyword in BUSINESS_IMPACT_KEYWORDS:
        if keyword in text:
            found_impacts.append(keyword)
    return list(set(found_impacts))  # Remove duplicates

def clean_summary(text: str, max_length: int = 300) -> str:
    """Clean and truncate summary text"""
    # Remove extra whitespace
    text = ' '.join(text.split())
    # Truncate
    if len(text) > max_length:
        text = text[:max_length] + '...'
    return text

def collect_feeds() -> List[Dict[str, Any]]:
    """Collect and filter RSS feeds"""
    all_incidents = []
    
    for feed_info in RSS_FEEDS:
        print(f"\nCollecting from {feed_info['name']}...")
        
        try:
            # Add timeout and headers to avoid blocking
            headers = {'User-Agent': 'Mozilla/5.0 (compatible; LabertIntelBot/1.0)'}
            response = requests.get(feed_info['url'], headers=headers, timeout=30)
            response.raise_for_status()
            
            # Parse feed
            feed = feedparser.parse(response.content)
            
            if not feed.entries:
                print(f"  No entries found in {feed_info['name']}")
                continue
            
            print(f"  Found {len(feed.entries)} total entries")
            
            relevant_count = 0
            for entry in feed.entries:
                # Parse date
                entry_date = parse_entry_date(entry)
                
                # Check date range
                if not is_within_date_range(entry_date):
                    continue
                
                # Extract all text
                full_text = extract_text_content(entry)
                
                # Check relevance
                if not (is_latam_relevant(full_text) and is_cyber_relevant(full_text)):
                    continue
                
                # Extract business impacts
                business_impacts = find_business_impacts(full_text)
                
                # Build incident record
                incident = {
                    'title': entry.get('title', 'No title'),
                    'url': entry.get('link', ''),
                    'date': entry_date.strftime('%Y-%m-%d %H:%M:%S'),
                    'source': feed_info['name'],
                    'summary': clean_summary(entry.get('summary', entry.get('description', 'No summary available'))),
                    'business_impacts': business_impacts,
                    'relevance_score': len(business_impacts) + (2 if is_latam_relevant(full_text) else 0)
                }
                
                all_incidents.append(incident)
                relevant_count += 1
            
            print(f"  Filtered to {relevant_count} LATAM-relevant incidents")
            
        except requests.RequestException as e:
            print(f"  ERROR accessing {feed_info['name']}: {str(e)}")
        except Exception as e:
            print(f"  ERROR parsing {feed_info['name']}: {str(e)}")
        
        # Small delay between feeds to be polite
        time.sleep(1)
    
    return all_incidents

def save_results(incidents: List[Dict[str, Any]], filename: str):
    """Save incidents to JSON file"""
    # Sort by relevance score and date
    incidents.sort(key=lambda x: (x['relevance_score'], x['date']), reverse=True)
    
    # Add metadata
    output = {
        'metadata': {
            'generated_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'total_incidents': len(incidents),
            'date_range': {
                'start': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'),
                'end': datetime.now().strftime('%Y-%m-%d')
            },
            'sources': [feed['name'] for feed in RSS_FEEDS]
        },
        'incidents': incidents
    }
    
    # Save to file
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"\nSaved {len(incidents)} incidents to {filename}")

def print_summary(incidents: List[Dict[str, Any]]):
    """Print summary of collected incidents"""
    print("\n" + "="*60)
    print("COLLECTION SUMMARY")
    print("="*60)
    
    # Count by source
    by_source = {}
    for incident in incidents:
        source = incident['source']
        by_source[source] = by_source.get(source, 0) + 1
    
    print("\nIncidents by source:")
    for source, count in sorted(by_source.items()):
        print(f"  {source}: {count}")
    
    # Top business impacts
    all_impacts = []
    for incident in incidents:
        all_impacts.extend(incident['business_impacts'])
    
    if all_impacts:
        print("\nTop business sectors affected:")
        impact_counts = {}
        for impact in all_impacts:
            impact_counts[impact] = impact_counts.get(impact, 0) + 1
        
        for impact, count in sorted(impact_counts.items(), key=lambda x: x[1], reverse=True)[:5]:
            print(f"  {impact}: {count} incidents")
    
    # Show top 5 incidents
    print("\nTop 5 most relevant incidents:")
    for i, incident in enumerate(incidents[:5], 1):
        print(f"\n{i}. {incident['title']}")
        print(f"   Source: {incident['source']} | Date: {incident['date']}")
        print(f"   Impacts: {', '.join(incident['business_impacts']) if incident['business_impacts'] else 'General'}")

def main():
    """Main execution"""
    print("LATAM Cybersecurity Intelligence Collector")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Collecting incidents from last 7 days...")
    
    # Collect incidents
    incidents = collect_feeds()
    
    if not incidents:
        print("\nWARNING: No incidents collected. Check your internet connection and feed URLs.")
        return
    
    # Save results
    output_file = 'intelligence/data/raw_incidents_2025-07-11.json'
    save_results(incidents, output_file)
    
    # Print summary
    print_summary(incidents)
    
    print("\n✅ Collection complete! Next steps:")
    print("1. Review the incidents in the JSON file")
    print("2. Run your dashboard generator with this data")
    print("3. Add any manual insights before publishing")

if __name__ == "__main__":
    main()