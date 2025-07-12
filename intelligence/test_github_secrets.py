#!/usr/bin/env python3
"""
Test and explain GitHub Secrets vs Local Environment
"""

import os
from datetime import datetime


def test_secrets():
    """Check where we're running and what's available"""
    print("🔍 GITHUB SECRETS vs LOCAL ENVIRONMENT TEST")
    print("=" * 60)
    
    # Check if running in GitHub Actions
    is_github_actions = os.getenv('GITHUB_ACTIONS') == 'true'
    
    print(f"\n📍 Running Environment: {'GitHub Actions' if is_github_actions else 'Local Machine'}")
    print(f"⏰ Time: {datetime.now()}")
    
    # Check each secret
    secrets = {
        'OTX_API_KEY': 'AlienVault OTX API',
        'INTELX_API_KEY': 'Intel X API',
        'TELEGRAM_TOKEN': 'Telegram Bot Token',
        'TELEGRAM_CHAT_ID': 'Telegram Chat ID'
    }
    
    print("\n🔐 API Keys Status:")
    print("-" * 40)
    
    available_count = 0
    for key, description in secrets.items():
        value = os.getenv(key)
        if value:
            # Show partial key for security
            masked = f"{value[:5]}...{value[-3:]}" if len(value) > 10 else "***"
            print(f"✅ {key:20} = {masked} ({description})")
            available_count += 1
        else:
            print(f"❌ {key:20} = Not Set ({description})")
    
    # Explain the situation
    print("\n\n📚 EXPLANATION:")
    print("=" * 60)
    
    if is_github_actions:
        print("✅ You're running in GitHub Actions!")
        print("   - Repository secrets are automatically available")
        print("   - The workflow can access all configured secrets")
        print("   - Data will be committed back to the repository")
    else:
        print("❌ You're running locally (not in GitHub Actions)")
        print("\n   GitHub Secrets are ONLY available in GitHub Actions workflows.")
        print("   They are NOT synchronized to your local machine for security.")
        
        print("\n\n🔧 HOW TO FIX:")
        print("-" * 40)
        
        print("\nOption 1: Run via GitHub Actions (Recommended)")
        print("  1. Go to: https://github.com/percevals/Laberit-intelligence/actions")
        print("  2. Click 'Weekly Threat Intelligence Collector'")
        print("  3. Click 'Run workflow' → 'Run workflow'")
        print("  4. Check results in the Actions tab")
        
        print("\nOption 2: Set Keys Locally (For Testing)")
        print("  1. Get your keys from where you originally obtained them")
        print("  2. Set them in your terminal:")
        for key in secrets:
            print(f"     export {key}='your-actual-key-here'")
        print("  3. Run: python3 threat_intel_collector.py")
        
        print("\nOption 3: Use .env file (Persistent)")
        print("  1. Copy .env.example to .env")
        print("  2. Add your actual API keys to .env")
        print("  3. Install python-dotenv: pip install python-dotenv")
        print("  4. The collector will auto-load from .env")
    
    print("\n\n💡 SECURITY NOTES:")
    print("=" * 60)
    print("• GitHub Secrets are secure and never exposed in logs")
    print("• Never commit .env files with real API keys")
    print("• Use .gitignore to exclude sensitive files")
    print("• Rotate keys periodically for security")
    
    return available_count


if __name__ == "__main__":
    available = test_secrets()
    
    print(f"\n\n📊 SUMMARY: {available}/4 secrets available")
    
    if available == 0:
        print("⚠️  No secrets found - you need to set them up!")
    elif available == 4:
        print("✅ All secrets configured - ready to collect intelligence!")
    else:
        print("⚠️  Some secrets missing - check configuration above")