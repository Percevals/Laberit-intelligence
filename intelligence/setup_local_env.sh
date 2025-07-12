#!/bin/bash
# Setup local environment with API keys
# 
# IMPORTANT: Add your actual API keys here for local testing
# Do NOT commit this file with real keys!

echo "🔐 Setting up local environment variables..."

# Add your API keys here (get them from GitHub Secrets or original sources)
export OTX_API_KEY='your-otx-api-key-here'
export INTELX_API_KEY='your-intelx-api-key-here'
export TELEGRAM_TOKEN='your-telegram-bot-token-here'
export TELEGRAM_CHAT_ID='your-telegram-chat-id-here'

# Verify setup
echo ""
echo "✅ Environment variables set:"
echo "  OTX_API_KEY: ${OTX_API_KEY:0:10}..."
echo "  INTELX_API_KEY: ${INTELX_API_KEY:0:10}..."
echo "  TELEGRAM_TOKEN: ${TELEGRAM_TOKEN:0:10}..."
echo "  TELEGRAM_CHAT_ID: ${TELEGRAM_CHAT_ID}"

echo ""
echo "📝 Usage:"
echo "  1. Edit this file and add your actual API keys"
echo "  2. Run: source setup_local_env.sh"
echo "  3. Then: python3 threat_intel_collector.py"
echo ""
echo "⚠️  IMPORTANT: Do not commit this file with real keys!"