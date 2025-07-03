import os
import json
import requests
from telegram import Bot
from urllib3.exceptions import NotOpenSSLWarning
import sys

# Debug mode
DEBUG = os.getenv('DEBUG', 'false').lower() == 'true'

def check_environment():
    """Check if all required environment variables are set"""
    required_vars = ['OTX_API_KEY', 'INTELX_API_KEY', 'TELEGRAM_TOKEN', 'TELEGRAM_CHAT_ID']
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if DEBUG:
        print("=== DEBUG MODE ===")
        for var in required_vars:
            status = "✓ Present" if var in os.environ else "✗ Missing"
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

# Call this right after imports and before any API usage
if __name__ == "__main__":
    check_environment()
    # ... rest of your existing code END OF DEBUG

# Suppress LibreSSL warning (macOS only)
try:
    import warnings
    warnings.simplefilter("ignore", NotOpenSSLWarning)
except Exception as e:
    pass  # Fail gracefully if not applicable

# === CONFIGURATION ===
OTX_API_KEY = os.getenv("OTX_API_KEY")             # Set via GitHub Secrets
INTELX_API_KEY = os.getenv("INTELX_API_KEY")
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")       # Set via GitHub Secrets
TELEGRAM_CHAT_ID = "percevals_bot"                              # Optional

DOMAINS_TO_CHECK = [
    "losheroes.cl",
    "megalabs.com",
    "megalabs.app"
]  # Add customer domains here

# === HELPER FUNCTION ===
def safe_write(data, filename):
    try:
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"✅ Saved {filename}")
    except Exception as e:
        print(f"❌ Failed to save {filename}: {e}")

# === 1. OTX Threat Intelligence ===
def fetch_otx():
    if not OTX_API_KEY:
        print("⚠️ OTX: Skipped (no key provided)")
        return None
    print("📡 Fetching OTX intelligence...")
    try:
        url = "https://otx.alienvault.com/api/v1/pulses/subscribed?limit=1"
        headers = {"X-OTX-API-KEY": OTX_API_KEY}
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            print("✅ OTX: Success")
            return response.json()
        else:
            print(f"❌ OTX: Error {response.status_code} - {response.text[:100]}...")
            return None
    except Exception as e:
        print(f"❌ OTX: Network error - {e}")
        return None

# === 2. IntelX Paste Monitoring ===
def fetch_intelx():
    if not INTELX_API_KEY:
        print("⚠️ IntelX: Skipped (no key provided)")
        return None
    print("📡 Fetching IntelX paste monitoring...")
    try:
        url = " https://api.intelx.io/intelx.ping "
        headers = {"x-key": INTELX_API_KEY}
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            print("✅ IntelX: Success")
            return response.json()
        else:
            print(f"❌ IntelX: Error {response.status_code} - {response.text[:100]}...")
            return None
    except Exception as e:
        print(f"❌ IntelX: Network error - {e}")
        return None

# === 3. Telegram Channel Monitor ===
def fetch_telegram():
    if not TELEGRAM_TOKEN:
        print("⚠️ Telegram: Skipped (no token provided)")
        return None
    print("📡 Testing Telegram bot connection...")
    try:
        bot = Bot(token=TELEGRAM_TOKEN)
        user_info = bot.get_me()
        print(f"✅ Telegram: Logged in as @{user_info.username}")
        return {"username": user_info.username, "active": True}
    except Exception as e:
        print(f"❌ Telegram: Auth failed - {e}")
        return None

# === 4. Have I Been Pwned (HIBP) ===
def fetch_hibp():
    results = {}
    print("📡 Checking Have I Been Pwned for breaches...")
    for domain in DOMAINS_TO_CHECK:
        try:
            url = f" https://haveibeenpwned.com/api/v3/breachedorganization/ {domain}"
            headers = {"User-Agent": "ImmunityFrameworkScript"}
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                breaches = response.json()
                results[domain] = [b["Name"] for b in breaches]
                print(f"✅ HIBP: {domain} has {len(breaches)} breaches")
            elif response.status_code == 404:
                results[domain] = []
                print(f"✅ HIBP: {domain} has no known breaches")
            else:
                print(f"❌ HIBP: Error {response.status_code} for {domain}")
                results[domain] = f"Error {response.status_code}"
        except Exception as e:
            print(f"❌ HIBP: Network error for {domain} - {e}")
            results[domain] = "Network error"

    return results

# === RUN ALL MODULES SAFELY ===
if __name__ == "__main__":
    print("\n🚀 Starting Immunity Framework TI Collector\n" + "-" * 40)

    otx_data = fetch_otx()
    intelx_data = fetch_intelx()
    telegram_data = fetch_telegram()
    hibp_data = fetch_hibp()

    print("\n💾 Saving results...\n" + "-" * 40)

    safe_write(otx_data, "intelligence/otx_result.json")
    safe_write(intelx_data, "intelligence/intelx_result.json")
    safe_write(telegram_data, "intelligence/telegram_result.json")
    safe_write(hibp_data, "intelligence/hibp_result.json")

    print("\n🏁 Collection complete.")
