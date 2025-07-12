#!/bin/bash

echo "🚀 DII Assessment Platform - Installation Script"
echo "=============================================="

# Install root dependencies
echo "📦 Installing root dependencies..."
if [ -f "package-lock.json" ]; then
    rm package-lock.json
fi
npm install

# Install Assessment Light dependencies
echo "📦 Installing Assessment Light dependencies..."
cd apps/assessment-light
if [ -f "package-lock.json" ]; then
    rm package-lock.json
fi
npm install
cd ../..

echo "✅ Installation complete!"
echo ""
echo "To start development:"
echo "  npm run dev:light    # Run Assessment Light"
echo "  npm run build:light  # Build Assessment Light"