import requests
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

# === API KEYS ===
OTX_API_KEY = '82f9d5555d472fb61adff3c28b61d4a7bc4b81f1fd4b60070e552c08c36be281'
INTELX_API_KEY = '65e4ca75-af14-417f-87f2-bd3f0ebdec90'
TELEGRAM_TOKEN = '7878874413:AAGMNlGF-3G51EP7pqqhfK0_Qo1tREC17Lg'
TELEGRAM_CHAT_ID = 'percevals_bot'  # Optional if you want to send alerts

# === FUNCTIONS ===

# 1. OTX: Get pulses related to keywords like "LATAM", "B2C_DIGITAL", etc.
def fetch_otx_intel(query="LATAM"):
    url = f"https://otx.alienvault.com/api/v1/indicators/search/ {query}"
    headers = {"X-OTX-API-KEY": OTX_API_KEY}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print("Error fetching OTX ", response.text)
        return None

# 2. IntelX: Search pastes for keywords related to LATAM threats
def intelx_paste_search(query="password OR leaked"):
    url = "https://api.intelx.io/paste/search "
    headers = {
        "x-key": INTELX_API_KEY,
        "Content-Type": "application/json"
    }
    data = {"term": query}
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        return response.json()
    else:
        print("Error fetching IntelX ", response.text)
        return None

# 3. Telegram: Monitor public threat actor channels (requires bot access)
def monitor_telegram_channels(context: CallbackContext):
    # Example: Fetch messages from a public channel (bot must have access)
    chat_id = TELEGRAM_CHAT_ID
    try:
        updates = context.bot.get_updates()
        for update in updates:
            if update.channel_post:
                message = update.channel_post.text
                if any(keyword in message.lower() for keyword in ["latam", "breach", "leak"]):
                    print(f"New potential threat post: {message}")
                    # Map this to your Strategic Exposure or Agility pillar
    except Exception as e:
        print("Telegram error:", str(e))

# 4. Have I Been Pwned: Check if a domain has been pwned (e.g., customer domains)
def check_hibp(domain="example.com"):
    url = f"https://haveibeenpwned.com/api/v3/breachedorganization/ {domain}"
    headers = {"User-Agent": "PythonScript"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    elif response.status_code == 404:
        return []  # No breaches found
    else:
        print("HIBP Error:", response.text)
        return None

# === MAIN FUNCTION TO RUN THE WORKFLOW ===
def run_intel_gathering():
    print("Fetching OTX Intelligence...")
    otx_data = fetch_otx_intel("LATAM")
    if otx_
        print(f"Found {len(otx_data['results'])} OTX pulses related to LATAM.")

    print("\nSearching IntelX for pastes...")
    intelx_data = intelx_paste_search("credential OR password")
    if intelx_
        print(f"Found {len(intelx_data.get('records', []))} matching paste records.")

    print("\nChecking Have I Been Pwned for common domains...")
    domains_to_check = ["gmail.com", "yahoo.com", "customerdomain.com"]
    for domain in domains_to_check:
        breaches = check_hibp(domain)
        if breaches:
            print(f"{domain} has been involved in breaches: {len(breaches)}")

# === OPTIONAL: Telegram Monitoring Scheduler ===
def start_telegram_monitoring():
    updater = Updater(token=TELEGRAM_TOKEN, use_context=True)
    updater.start_polling()
    updater.job_queue.run_repeating(monitor_telegram_channels, interval=3600, first=0)

# Run the main function
if __name__ == "__main__":
    run_intel_gathering()

    # Optional: Start Telegram monitoring in background
    # start_telegram_monitoring()

import json

# Example: Save OTX results to file
with open('intelligence/otx_results.json', 'w') as f:
    json.dump(otx_data, f)

# Save IntelX results
with open('intelligence/intelx_results.json', 'w') as f:
    json.dump(intelx_data, f)

# Save HIBP results
hibp_output = {domain: check_hibp(domain) for domain in domains_to_check}
with open('intelligence/hibp_results.json', 'w') as f:
    json.dump(hibp_output, f)
