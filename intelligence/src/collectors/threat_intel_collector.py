import os
import json
import requests
from telegram import Bot
from urllib3.exceptions import NotOpenSSLWarning
import sys
from datetime import datetime, timedelta
import warnings

# Suppress SSL warnings
warnings.filterwarnings('ignore', category=NotOpenSSLWarning)

# Debug mode
DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'

def check_environment():
    """Check if all required environment variables are set"""
    required_vars = ['OTX_API_KEY', 'INTELX_API_KEY', 'TELEGRAM_TOKEN', 'TELEGRAM_CHAT_ID']
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if DEBUG:
        print("=== DEBUG MODE ===")
        for var in required_vars:
            if var in os.environ:
                status = "✓ Present"
                # For security, only show length, not actual value
                print(f"{var}: {status} (length: {len(os.getenv(var))})")
            else:
                status = "✗ Missing"
                print(f"{var}: {status}")
        print("==================\n")
    
    if missing:
        error_msg = f"ERROR: Missing required environment variables: {', '.join(missing)}"
        print(error_msg)
        
        # Try to send error to Telegram if token is available
        if os.getenv('TELEGRAM_TOKEN') and os.getenv('TELEGRAM_CHAT_ID'):
            try:
                send_telegram_message(f"🚨 Threat Intel Collector Error:\n{error_msg}")
            except:
                pass  # Don't fail if Telegram fails
        
        sys.exit(1)
    
    return True

def get_last_week_date():
    """Get date from one week ago"""
    return (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')

def send_telegram_message(message):
    """Send message to Telegram"""
    token = os.getenv('TELEGRAM_TOKEN')
    chat_id = os.getenv('TELEGRAM_CHAT_ID')
    
    if not token or not chat_id:
        print("WARNING: Telegram credentials not available")
        return False
    
    try:
        bot = Bot(token=token)
        bot.send_message(chat_id=chat_id, text=message, parse_mode='HTML')
        return True
    except Exception as e:
        print(f"ERROR sending Telegram message: {str(e)}")
        return False

def collect_otx_data(api_key):
    """Collect data from AlienVault OTX"""
    if not api_key:
        print("WARNING: OTX_API_KEY not provided, skipping OTX collection")
        return {}
    
    headers = {'X-OTX-API-KEY': api_key}
    base_url = "https://otx.alienvault.com/api/v1/pulses/subscribed"
    
    all_data = {}
    
    try:
        params = {'limit': 50, 'modified_since': get_last_week_date()}
        
        if DEBUG:
            print(f"OTX API Request: {base_url}")
            print(f"Parameters: {params}")
        
        response = requests.get(base_url, headers=headers, params=params, timeout=30)
        
        if DEBUG:
            print(f"OTX Response Status: {response.status_code}")
        
        response.raise_for_status()  # This will raise an error for bad status codes
        data = response.json()
        
        # Process results
        if 'results' in data:
            all_data = data
            print(f"✓ Collected {len(data['results'])} pulses from OTX")
        else:
            print("WARNING: No results found in OTX response")
            all_data = {'results': []}
            
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            print("ERROR: OTX API authentication failed - check your API key")
        else:
            print(f"ERROR: OTX HTTP error: {e}")
        if DEBUG:
            import traceback
            traceback.print_exc()
        return {}
    except requests.exceptions.Timeout:
        print("ERROR: OTX API request timed out")
        return {}
    except requests.exceptions.RequestException as e:
        print(f"ERROR in OTX collection: {str(e)}")
        if DEBUG:
            import traceback
            traceback.print_exc()
        return {}
    except Exception as e:
        print(f"UNEXPECTED ERROR in OTX: {str(e)}")
        if DEBUG:
            import traceback
            traceback.print_exc()
        return {}
    
    return all_data

def collect_intelx_data(api_key):
    """Collect data from IntelX"""
    if not api_key:
        print("WARNING: INTELX_API_KEY not provided, skipping IntelX collection")
        return []
    
    headers = {'x-key': api_key}
    search_url = "https://free.intelx.io/intelligent/search"
    
    all_results = []
    
    # Search terms focusing on Latin America
    search_terms = ["latam breach", "brazil ransomware", "mexico cyber", 
                   "colombia hack", "argentina breach"]
    
    try:
        for term in search_terms:
            if DEBUG:
                print(f"IntelX searching for: {term}")
            
            payload = {
                "term": term,
                "buckets": [],
                "lookplaces": [],
                "maxresults": 20,
                "timeout": 0,
                "datefrom": get_last_week_date(),
                "dateto": datetime.now().strftime('%Y-%m-%d'),
                "sort": 4,
                "media": 0,
                "terminate": []
            }
            
            try:
                response = requests.post(search_url, json=payload, headers=headers, timeout=30)
                
                if DEBUG:
                    print(f"IntelX Response Status for '{term}': {response.status_code}")
                
                if response.status_code == 402:
                    print("WARNING: IntelX API quota exceeded")
                    break
                elif response.status_code == 401:
                    print("ERROR: IntelX API authentication failed - check your API key")
                    break
                
                response.raise_for_status()
                data = response.json()
                
                if 'records' in data:
                    all_results.extend(data['records'])
                    print(f"✓ Found {len(data['records'])} results for '{term}'")
                
            except requests.exceptions.Timeout:
                print(f"WARNING: IntelX search for '{term}' timed out, skipping...")
                continue
            except Exception as e:
                print(f"WARNING: Error searching for '{term}': {str(e)}")
                continue
                
    except Exception as e:
        print(f"ERROR in IntelX collection: {str(e)}")
        if DEBUG:
            import traceback
            traceback.print_exc()
        return []
    
    print(f"✓ Total IntelX results collected: {len(all_results)}")
    return all_results

def generate_html_report(otx_data, intelx_data):
    """Generate HTML report from collected data"""
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    
    # Extract OTX pulses
    otx_pulses = otx_data.get('results', [])
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Threat Intelligence Report - {timestamp}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }}
            .container {{ max-width: 1200px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
            h1 {{ color: #333; text-align: center; }}
            h2 {{ color: #666; border-bottom: 2px solid #ddd; padding-bottom: 10px; }}
            .summary {{ background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin-bottom: 20px; }}
            .threat-item {{ background-color: #f9f9f9; margin: 10px 0; padding: 15px; border-left: 4px solid #3498db; }}
            .high-severity {{ border-left-color: #e74c3c; }}
            .medium-severity {{ border-left-color: #f39c12; }}
            .tag {{ display: inline-block; background-color: #3498db; color: white; padding: 3px 8px; margin: 2px; border-radius: 3px; font-size: 12px; }}
            .date {{ color: #999; font-size: 14px; }}
            .source {{ font-weight: bold; color: #2c3e50; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 Weekly Threat Intelligence Report</h1>
            <div class="summary">
                <p><strong>Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                <p><strong>Period:</strong> {get_last_week_date()} to {datetime.now().strftime('%Y-%m-%d')}</p>
                <p><strong>OTX Pulses:</strong> {len(otx_pulses)}</p>
                <p><strong>IntelX Results:</strong> {len(intelx_data)}</p>
            </div>
    """
    
    # Add OTX data
    if otx_pulses:
        html_content += "<h2>🛡️ AlienVault OTX Threats</h2>"
        for pulse in otx_pulses[:20]:  # Limit to 20 most recent
            severity_class = "high-severity" if pulse.get('adversary', '') else "medium-severity"
            html_content += f"""
            <div class="threat-item {severity_class}">
                <h3>{pulse.get('name', 'Unnamed Threat')}</h3>
                <p class="date">Modified: {pulse.get('modified', 'Unknown')}</p>
                <p>{pulse.get('description', 'No description available')[:300]}...</p>
                <div>
            """
            for tag in pulse.get('tags', [])[:5]:
                html_content += f'<span class="tag">{tag}</span>'
            html_content += "</div></div>"
    
    # Add IntelX data
    if intelx_data:
        html_content += "<h2>🔎 Intelligence X Findings</h2>"
        for item in intelx_data[:20]:  # Limit to 20 most recent
            html_content += f"""
            <div class="threat-item">
                <h3>{item.get('name', 'Unnamed Finding')}</h3>
                <p class="source">Source: {item.get('source', 'Unknown')}</p>
                <p class="date">Date: {item.get('date', 'Unknown')}</p>
                <p>{item.get('description', item.get('name', 'No description'))[:300]}...</p>
            </div>
            """
    
    html_content += """
        </div>
    </body>
    </html>
    """
    
    # Save HTML file
    filename = f"intelligence/threat-intelligence-{timestamp}.html"
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"✓ HTML report generated: {filename}")
        return filename
    except Exception as e:
        print(f"ERROR generating HTML report: {str(e)}")
        return None

if __name__ == "__main__":
    try:
        # Check environment first
        check_environment()
        
        print("Starting threat intelligence collection...")
        print(f"Collection period: {get_last_week_date()} to {datetime.now().strftime('%Y-%m-%d')}")
        
        # Get API keys
        otx_key = os.getenv('OTX_API_KEY')
        intelx_key = os.getenv('INTELX_API_KEY')
        
        # Collect data (will handle missing keys gracefully)
        otx_data = collect_otx_data(otx_key)
        intelx_data = collect_intelx_data(intelx_key)
        
        # Check if we got any data
        if not otx_data and not intelx_data:
            error_msg = "No data collected from any source!"
            print(f"ERROR: {error_msg}")
            send_telegram_message(f"🚨 Threat Intel Collection Failed:\n{error_msg}")
            sys.exit(1)
        
        # Generate report
        print("\nGenerating HTML report...")
        html_file = generate_html_report(otx_data, intelx_data)
        
        if not html_file:
            error_msg = "Failed to generate HTML report!"
            print(f"ERROR: {error_msg}")
            send_telegram_message(f"🚨 {error_msg}")
            sys.exit(1)
        
        # Send notification
        message = f"""
🔍 <b>Weekly Threat Intelligence Report</b>
📅 Date: {datetime.now().strftime('%Y-%m-%d')}
📊 OTX Pulses: {len(otx_data.get('results', []))}
🔎 IntelX Results: {len(intelx_data)}
📄 Report: {html_file}
✅ Collection completed successfully!
        """
        send_telegram_message(message)
        
        print("\n✅ Report generated successfully!")
        print(f"📄 File: {html_file}")
        
    except KeyboardInterrupt:
        print("\n⚠️  Process interrupted by user")
        sys.exit(0)
    except Exception as e:
        error_msg = f"Critical error in threat collector: {str(e)}"
        print(f"\n❌ {error_msg}")
        if DEBUG:
            import traceback
            traceback.print_exc()
        
        # Try to notify via Telegram
        try:
            send_telegram_message(f"🚨 {error_msg}")
        except:
            pass
        
        sys.exit(1)
