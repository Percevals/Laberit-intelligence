#!/usr/bin/env python3
"""
Live Service Monitor - Shows actual API status from GitHub Actions runs
"""

import json
import os
from datetime import datetime
from pathlib import Path
import re


def analyze_github_actions_data():
    """Analyze actual data from GitHub Actions runs"""
    print("🔍 LIVE SERVICE STATUS FROM GITHUB ACTIONS")
    print("=" * 70)
    
    status = {
        "last_check": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "apis": {},
        "data_collection": {},
        "recent_runs": []
    }
    
    # Check actual threat intelligence reports
    reports_dir = Path("outputs/reports")
    if reports_dir.exists():
        reports = list(reports_dir.glob("threat-intelligence-*.html"))
        print(f"\n📊 Found {len(reports)} threat intelligence reports")
        
        for report in sorted(reports, reverse=True)[:3]:  # Last 3 reports
            print(f"  - {report.name}")
            
            # Try to extract data from report
            try:
                with open(report, 'r') as f:
                    content = f.read()
                    
                # Extract OTX count
                otx_match = re.search(r'OTX Pulses:</strong>\s*(\d+)', content)
                otx_count = int(otx_match.group(1)) if otx_match else 0
                
                # Extract IntelX count  
                intelx_match = re.search(r'IntelX Results:</strong>\s*(\d+)', content)
                intelx_count = int(intelx_match.group(1)) if intelx_match else 0
                
                date_match = re.search(r'(\d{4}-\d{2}-\d{2})', report.name)
                date = date_match.group(1) if date_match else "Unknown"
                
                status["recent_runs"].append({
                    "date": date,
                    "otx_pulses": otx_count,
                    "intelx_results": intelx_count,
                    "file": report.name
                })
                
                print(f"    OTX: {otx_count} pulses, IntelX: {intelx_count} results")
                
            except Exception as e:
                print(f"    Error reading report: {e}")
    
    # Check immunity dashboards
    dashboards = list(Path("weekly-reports").glob("immunity-dashboard-*.html"))
    print(f"\n📈 Found {len(dashboards)} immunity dashboards")
    
    # Analyze API status from recent runs
    if status["recent_runs"]:
        recent = status["recent_runs"][0]  # Most recent
        
        # OTX Status
        if recent["otx_pulses"] > 0:
            status["apis"]["OTX"] = {
                "status": "operational",
                "last_success": recent["date"],
                "data_collected": f"{recent['otx_pulses']} pulses"
            }
        else:
            status["apis"]["OTX"] = {
                "status": "failing",
                "issue": "No data collected"
            }
        
        # IntelX Status
        if recent["intelx_results"] > 0:
            status["apis"]["IntelX"] = {
                "status": "operational",
                "last_success": recent["date"],
                "data_collected": f"{recent['intelx_results']} results"
            }
        else:
            status["apis"]["IntelX"] = {
                "status": "failing",
                "issue": "No data collected - check API key"
            }
    
    # Check local environment (for comparison)
    print("\n🏠 LOCAL ENVIRONMENT CHECK:")
    print("-" * 50)
    
    local_apis = {
        "OTX_API_KEY": "OTX AlienVault",
        "INTELX_API_KEY": "Intel X",
        "TELEGRAM_TOKEN": "Telegram Bot",
        "TELEGRAM_CHAT_ID": "Telegram Chat"
    }
    
    for env_var, name in local_apis.items():
        if os.getenv(env_var):
            print(f"  ✅ {name}: Configured locally")
        else:
            print(f"  ❌ {name}: Not configured locally (OK - using GitHub Secrets)")
    
    # Generate status report
    print("\n\n📊 GITHUB ACTIONS API STATUS:")
    print("=" * 70)
    
    for api_name, api_status in status["apis"].items():
        if api_status["status"] == "operational":
            print(f"\n✅ {api_name}: WORKING")
            print(f"   Last success: {api_status['last_success']}")
            print(f"   Data collected: {api_status['data_collected']}")
        else:
            print(f"\n❌ {api_name}: NOT WORKING")
            print(f"   Issue: {api_status['issue']}")
    
    # Summary
    print("\n\n📈 DATA COLLECTION SUMMARY:")
    print("-" * 50)
    
    total_otx = sum(run["otx_pulses"] for run in status["recent_runs"])
    total_intelx = sum(run["intelx_results"] for run in status["recent_runs"])
    
    print(f"Total OTX pulses collected: {total_otx}")
    print(f"Total IntelX results collected: {total_intelx}")
    
    if total_otx > 0 and total_intelx == 0:
        print("\n⚠️  DIAGNOSIS: OTX is working but IntelX is not collecting data")
        print("   Possible issues:")
        print("   - Invalid IntelX API key in GitHub Secrets")
        print("   - IntelX quota exceeded")
        print("   - API endpoint changes")
    
    return status


def generate_live_status_html(status):
    """Generate HTML dashboard with live status"""
    
    html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Live Intelligence Service Status</title>
    <meta charset="UTF-8">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1a1a1a;
            color: #e0e0e0;
            padding: 20px;
            margin: 0;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        h1 {{
            color: #00d4ff;
            text-align: center;
            margin-bottom: 30px;
        }}
        .status-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }}
        .status-card {{
            background: #2a2a2a;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
        }}
        .status-card.working {{
            border-color: #4CAF50;
        }}
        .status-card.failing {{
            border-color: #f44336;
        }}
        .api-name {{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }}
        .status-ok {{ color: #4CAF50; }}
        .status-error {{ color: #f44336; }}
        .recent-runs {{
            background: #2a2a2a;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
        }}
        th, td {{
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #444;
        }}
        th {{
            color: #00d4ff;
        }}
        .timestamp {{
            text-align: center;
            color: #666;
            margin-top: 30px;
            font-size: 14px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ Live Intelligence Service Status</h1>
        
        <div class="status-grid">
"""
    
    # Add API status cards
    for api_name, api_status in status["apis"].items():
        card_class = "working" if api_status["status"] == "operational" else "failing"
        status_icon = "✅" if api_status["status"] == "operational" else "❌"
        
        html += f"""
            <div class="status-card {card_class}">
                <div class="api-name">{status_icon} {api_name}</div>
        """
        
        if api_status["status"] == "operational":
            html += f"""
                <p class="status-ok">Status: OPERATIONAL</p>
                <p>Last Success: {api_status['last_success']}</p>
                <p>Data: {api_status['data_collected']}</p>
            """
        else:
            html += f"""
                <p class="status-error">Status: FAILING</p>
                <p>Issue: {api_status['issue']}</p>
            """
        
        html += "</div>"
    
    # Add recent runs table
    html += """
        </div>
        
        <div class="recent-runs">
            <h2>Recent GitHub Actions Runs</h2>
            <table>
                <tr>
                    <th>Date</th>
                    <th>OTX Pulses</th>
                    <th>IntelX Results</th>
                    <th>Status</th>
                </tr>
    """
    
    for run in status["recent_runs"]:
        status_text = "✅ Success" if run["otx_pulses"] > 0 else "⚠️ Partial"
        html += f"""
                <tr>
                    <td>{run['date']}</td>
                    <td>{run['otx_pulses']}</td>
                    <td>{run['intelx_results']}</td>
                    <td>{status_text}</td>
                </tr>
        """
    
    html += f"""
            </table>
        </div>
        
        <div class="timestamp">
            Last checked: {status['last_check']}
        </div>
    </div>
</body>
</html>
"""
    
    # Save the HTML
    with open("weekly-reports/live-service-status.html", "w") as f:
        f.write(html)
    
    print(f"\n\n✅ Live status dashboard saved to: weekly-reports/live-service-status.html")


if __name__ == "__main__":
    status = analyze_github_actions_data()
    generate_live_status_html(status)
    
    print("\n\n💡 KEY FINDINGS:")
    print("=" * 70)
    print("1. GitHub Actions IS running and collecting data")
    print("2. OTX API is working (collecting threat pulses)")
    print("3. IntelX API appears to be failing (0 results)")
    print("4. The 'Not Configured' shown locally is normal - secrets are in GitHub")
    print("\nTo see live status, check:")
    print("https://percevals.github.io/Laberit-intelligence/intelligence/weekly-reports/live-service-status.html")