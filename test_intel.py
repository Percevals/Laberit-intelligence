import requests
import json
from telegram import Bot

# === YOUR API KEYS ===
OTX_API_KEY = "82f9d5555d472fb61adff3c28b61d4a7bc4b81f1fd4b60070e552c08c36be281"
INTELX_API_KEY = "65e4ca75-af14-417f-87f2-bd3f0ebdec90"
TELEGRAM_TOKEN = "7878874413:AAGMNlGF-3G51EP7pqqhfK0_Qo1tREC17Lg"
TELEGRAM_CHAT_ID = "percevals_bot"  # Optional
DOMAINS_TO_CHECK = ["laberit.com", "exypnos.co"]


# === UTILITY FUNCTIONS ===
def safe_write(data, filename):
    try:
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"✅ Saved {filename}")
    except Exception as e:
        print(f"❌ Failed to save {filename}: {e}")


# === 1. OTX Threat Intelligence ===
def fetch_otx():
    print("📡 Testing OTX...")
    url = "https://otx.alienvault.com/api/v1/pulses/subscribed?limit=1"
    headers = {"X-OTX-API-KEY": OTX_API_KEY}
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("✅ OTX: Success")
            safe_write(response.json(), "otx_result.json")
        else:
            print(f"❌ OTX: Error {response.status_code} - {response.text[:100]}...")
    except Exception as e:
        print(f"❌ OTX: Network error - {e}")


# === 2. IntelX Paste Monitoring ===
def fetch_intelx():
    print("📡 Testing IntelX...")
    url = " https://api.intelx.io/intelx.ping "
    headers = {"x-key": INTELX_API_KEY}
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("✅ IntelX: Success")
            safe_write(response.json(), "intelx_result.json")
        else:
            print(f"❌ IntelX: Error {response.status_code} - {response.text[:100]}...")
    except Exception as e:
        print(f"❌ IntelX: Network error - {e}")


# === 3. Telegram Channel Monitor ===
def fetch_telegram():
    print("📡 Testing Telegram...")
    if not TELEGRAM_TOKEN or TELEGRAM_TOKEN == "your_telegram_bot_token_here":
        print("⚠️ Telegram: No token provided - skipping")
        return
    try:
        bot = Bot(token=TELEGRAM_TOKEN)
        user_info = bot.get_me()
        print(f"✅ Telegram: Logged in as @{user_info.username}")
    except Exception as e:
        print(f"❌ Telegram: Auth failed - {e}")


# === 4. Have I Been Pwned (HIBP) ===
def fetch_hibp():
    print("📡 Testing Have I Been Pwned...")
    results = {}
    for domain in DOMAINS_TO_CHECK:
        url = f"https://haveibeenpwned.com/api/v3/breachedorganization/ {domain}"
        headers = {"User-Agent": "ImmunityFrameworkTestScript"}
        try:
            response = requests.get(url, headers=headers)
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

    safe_write(results, "hibp_result.json")


# === RUN ALL TESTS ===
if __name__ == "__main__":
    print("\n🚀 Starting Immunity Framework TI Test Script\n" + "-" * 40)
    fetch_otx()
    fetch_intelx()
    fetch_telegram()
    fetch_hibp()
    print("\n🏁 Test Complete")
