#!/bin/bash

echo "🚀 DII Assessment Platform - Installation Script"
echo "=============================================="

# Install root dependencies
echo "📦 Installing root dependencies..."
if [ -f "package-lock.json" ]; then
    rm package-lock.json
fi
npm install

# Install Assessment V2 dependencies
echo "📦 Installing Assessment V2 dependencies..."
cd apps/assessment-v2
if [ -f "package-lock.json" ]; then
    rm package-lock.json
fi
npm install
cd ../..

echo "✅ Installation complete!"
echo ""
echo "To start development:"
echo "  npm run dev:v2    # Run Assessment V2"
echo "  npm run build:v2  # Build Assessment V2"