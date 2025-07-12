#!/usr/bin/env python3
"""
Service Status Dashboard - See what's actually working
Shows API status, data freshness, and service health
"""

import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple
try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False


def check_service_status():
    """Check status of all intelligence services and APIs"""
    print("🔍 INTELLIGENCE SERVICES STATUS CHECK")
    print("=" * 70)
    print(f"Check Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    services = {}
    
    # 1. Check Environment Variables / API Keys
    print("\n📋 API KEYS & CREDENTIALS:")
    print("-" * 50)
    
    api_configs = {
        "OTX AlienVault": "OTX_API_KEY",
        "Intel X": "INTELX_API_KEY", 
        "Telegram Bot": "TELEGRAM_TOKEN",
        "Telegram Chat": "TELEGRAM_CHAT_ID",
        "Shodan (Future)": "SHODAN_API_KEY",
        "OpenAI (Future)": "OPENAI_API_KEY"
    }
    
    for service, env_var in api_configs.items():
        if os.getenv(env_var):
            status = "✅ Configured"
            key_len = len(os.getenv(env_var))
            print(f"  {service:20} {status} (length: {key_len})")
            services[service] = {"configured": True, "key_length": key_len}
        else:
            status = "❌ Not configured"
            print(f"  {service:20} {status}")
            services[service] = {"configured": False}
    
    # 2. Check Data Sources
    print("\n\n📊 DATA SOURCES & FRESHNESS:")
    print("-" * 50)
    
    data_dir = Path("data")
    data_sources = {
        "OTX Pulses": "raw/otx_result.json",
        "Intel X": "raw/intelx_result.json",
        "HIBP": "raw/hibp_result.json",
        "Telegram": "raw/telegram_result.json",
        "Enriched Incidents": "enriched_incidents_*.json",
        "Weekly Intelligence": "weekly_intelligence_*.json"
    }
    
    for source, pattern in data_sources.items():
        if "*" in pattern:
            # Find latest file matching pattern
            files = list(data_dir.glob(pattern))
            if files:
                latest = max(files, key=lambda x: x.stat().st_mtime)
                check_file_status(source, latest, services)
            else:
                print(f"  {source:25} ❌ No files found")
                services[source] = {"status": "missing"}
        else:
            file_path = data_dir / pattern
            check_file_status(source, file_path, services)
    
    # 3. Check Service Endpoints (if possible)
    print("\n\n🌐 SERVICE AVAILABILITY:")
    print("-" * 50)
    
    endpoints = {
        "OTX API": {
            "url": "https://otx.alienvault.com/api/v1/pulses/subscribed",
            "requires_auth": True,
            "auth_header": "X-OTX-API-KEY"
        },
        "GitHub Pages": {
            "url": "https://percevals.github.io/Laberit-intelligence/",
            "requires_auth": False
        },
        "Assessment App": {
            "url": "https://percevals.github.io/Laberit-intelligence/apps/assessment-light/",
            "requires_auth": False
        }
    }
    
    for service, config in endpoints.items():
        check_endpoint(service, config, services)
    
    # 4. Check Processing Pipeline
    print("\n\n⚙️  PROCESSING PIPELINE:")
    print("-" * 50)
    
    pipeline_components = {
        "Threat Collector": check_script_exists("threat_intel_collector.py"),
        "PDF Parser": check_script_exists("parse_pdfs.py"),
        "Dashboard Generator": check_script_exists("immunity_dashboard_generator.py"),
        "Business Mapper": check_script_exists("src/translators/business_model_mapper.py"),
        "Enhancement Script": check_script_exists("src/translators/enhance_with_business_models.py")
    }
    
    for component, exists in pipeline_components.items():
        status = "✅ Available" if exists else "❌ Missing"
        print(f"  {component:25} {status}")
        services[f"pipeline_{component}"] = {"available": exists}
    
    # 5. Generate HTML Dashboard
    generate_html_dashboard(services)
    
    # 6. Show Summary
    print("\n\n📈 SUMMARY:")
    print("-" * 50)
    
    working_count = sum(1 for s in services.values() if s.get("status") != "error" and s.get("configured", True) and s.get("available", True))
    total_count = len(services)
    
    print(f"  Services Working: {working_count}/{total_count}")
    print(f"  Data Freshness: {get_overall_freshness(services)}")
    print(f"  Pipeline Status: {'Operational' if all(v.get('available', False) for k, v in services.items() if k.startswith('pipeline_')) else 'Degraded'}")
    
    return services


def check_file_status(name: str, file_path: Path, services: dict):
    """Check file existence and freshness"""
    if file_path.exists():
        # Get file stats
        stats = file_path.stat()
        size_mb = stats.st_size / (1024 * 1024)
        modified = datetime.fromtimestamp(stats.st_mtime)
        age = datetime.now() - modified
        
        # Check content
        try:
            with open(file_path, 'r') as f:
                content = f.read(100)
                is_null = content.strip() == "null"
                is_empty = len(content.strip()) == 0
        except:
            is_null = False
            is_empty = False
        
        # Determine status
        if is_null or is_empty:
            status = "⚠️  Empty/Null"
            freshness = "No data"
        elif age < timedelta(days=1):
            status = "✅ Fresh"
            freshness = f"{age.seconds//3600}h ago"
        elif age < timedelta(days=7):
            status = "🟡 Recent" 
            freshness = f"{age.days}d ago"
        else:
            status = "🟠 Stale"
            freshness = f"{age.days}d ago"
        
        print(f"  {name:25} {status} ({freshness}, {size_mb:.1f}MB)")
        services[name] = {
            "status": "ok" if "✅" in status else "warning",
            "freshness": freshness,
            "size_mb": size_mb,
            "age_hours": age.total_seconds() / 3600
        }
    else:
        print(f"  {name:25} ❌ Not found")
        services[name] = {"status": "missing"}


def check_endpoint(name: str, config: dict, services: dict):
    """Check if endpoint is reachable"""
    if not REQUESTS_AVAILABLE:
        print(f"  {name:25} ⚠️  requests module not available")
        services[name] = {"status": "no_requests_module"}
        return
        
    try:
        headers = {}
        if config.get("requires_auth"):
            api_key = os.getenv(config.get("auth_env", ""))
            if api_key:
                headers[config["auth_header"]] = api_key
            else:
                print(f"  {name:25} ⚠️  No API key")
                services[name] = {"status": "no_auth"}
                return
        
        # Quick timeout to avoid hanging
        response = requests.head(config["url"], headers=headers, timeout=5)
        
        if response.status_code < 400:
            print(f"  {name:25} ✅ Online ({response.status_code})")
            services[name] = {"status": "online", "code": response.status_code}
        else:
            print(f"  {name:25} ⚠️  Error ({response.status_code})")
            services[name] = {"status": "error", "code": response.status_code}
            
    except requests.exceptions.Timeout:
        print(f"  {name:25} 🔴 Timeout")
        services[name] = {"status": "timeout"}
    except Exception as e:
        print(f"  {name:25} ❌ Failed ({type(e).__name__})")
        services[name] = {"status": "failed", "error": str(e)}


def check_script_exists(script_name: str) -> bool:
    """Check if a script exists in the project"""
    return Path(script_name).exists()


def get_overall_freshness(services: dict) -> str:
    """Get overall data freshness status"""
    fresh_count = sum(1 for s in services.values() if isinstance(s.get("age_hours"), (int, float)) and s["age_hours"] < 24)
    recent_count = sum(1 for s in services.values() if isinstance(s.get("age_hours"), (int, float)) and 24 <= s["age_hours"] < 168)
    
    if fresh_count >= 3:
        return "🟢 Good - Recent data available"
    elif fresh_count + recent_count >= 3:
        return "🟡 Fair - Some recent data"
    else:
        return "🔴 Poor - Data is stale"


def generate_html_dashboard(services: dict):
    """Generate HTML status dashboard"""
    html = """<!DOCTYPE html>
<html>
<head>
    <title>Intelligence Services Status</title>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: -apple-system, monospace;
            background: #0a0a0a;
            color: #00ff00;
            padding: 20px;
            margin: 0;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: #00ff00;
            text-align: center;
            font-size: 24px;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        .service-card {
            background: #111;
            border: 1px solid #00ff00;
            padding: 15px;
            border-radius: 5px;
        }
        .service-name {
            font-weight: bold;
            margin-bottom: 10px;
            color: #00ff00;
        }
        .status-ok { color: #00ff00; }
        .status-warning { color: #ffff00; }
        .status-error { color: #ff0000; }
        .metric {
            font-size: 12px;
            margin: 5px 0;
            display: flex;
            justify-content: space-between;
        }
        .timestamp {
            text-align: center;
            color: #666;
            margin-top: 20px;
            font-size: 12px;
        }
        .section-title {
            color: #00ff00;
            margin: 20px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 1px solid #00ff00;
        }
        .terminal-effect {
            animation: flicker 2s infinite;
        }
        @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="terminal-effect">[ INTELLIGENCE SERVICES STATUS ]</h1>
        
        <h2 class="section-title">API SERVICES</h2>
        <div class="grid">
"""
    
    # Add API services
    for service, data in services.items():
        if "configured" in data or "status" in data:
            status_class = "status-ok" if data.get("configured") or data.get("status") == "online" else "status-error"
            html += f"""
            <div class="service-card">
                <div class="service-name">{service}</div>
                <div class="metric">
                    <span>Status:</span>
                    <span class="{status_class}">{data.get('status', 'configured' if data.get('configured') else 'not configured').upper()}</span>
                </div>
            """
            
            if "freshness" in data:
                html += f"""<div class="metric"><span>Last Update:</span><span>{data['freshness']}</span></div>"""
            if "size_mb" in data:
                html += f"""<div class="metric"><span>Size:</span><span>{data['size_mb']:.1f} MB</span></div>"""
            
            html += "</div>"
    
    html += f"""
        </div>
        <div class="timestamp">Last checked: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</div>
    </div>
</body>
</html>"""
    
    with open("service_status.html", "w") as f:
        f.write(html)
    
    print("\n📊 HTML dashboard saved to: service_status.html")


def generate_simple_visual():
    """Generate a simple ASCII visual of service status"""
    print("\n\n🎯 QUICK VISUAL STATUS:")
    print("=" * 70)
    
    # Check key services
    checks = {
        "OTX API": os.getenv("OTX_API_KEY") is not None,
        "Intel X": os.getenv("INTELX_API_KEY") is not None,
        "Data Files": Path("data").exists() and len(list(Path("data").glob("*.json"))) > 0,
        "Pipeline": Path("threat_intel_collector.py").exists(),
        "Business Mapper": Path("src/translators/business_model_mapper.py").exists()
    }
    
    print("\n  Intelligence Pipeline Flow:\n")
    print("  [APIs] ──→ [Collector] ──→ [Data Files] ──→ [Enrichment] ──→ [Dashboard]")
    print("     │           │              │                │                │")
    
    for service, working in checks.items():
        icon = "✅" if working else "❌"
        print(f"     {icon} {service}")
    
    print("\n" + "=" * 70)


if __name__ == "__main__":
    services = check_service_status()
    generate_simple_visual()
    
    print("\n💡 TIP: Set missing API keys as environment variables:")
    print("   export OTX_API_KEY='your-key-here'")
    print("   export SHODAN_API_KEY='your-key-here'")
    print("\nOpen service_status.html for detailed view!")