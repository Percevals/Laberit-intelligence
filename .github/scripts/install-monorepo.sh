#!/bin/bash

echo "📦 Installing monorepo dependencies..."

# Install root dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "Installing root dependencies..."
    npm install || true
fi

# Install packages dependencies
for pkg in packages/*; do
    if [ -d "$pkg" ] && [ -f "$pkg/package.json" ]; then
        echo "Installing $(basename $pkg) dependencies..."
        (cd "$pkg" && npm install) || true
    fi
done

# Install apps dependencies
for app in apps/*; do
    if [ -d "$app" ] && [ -f "$app/package.json" ]; then
        echo "Installing $(basename $app) dependencies..."
        (cd "$app" && npm install --legacy-peer-deps) || true
    fi
done

echo "✅ Dependencies installed!"