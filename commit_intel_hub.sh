#!/bin/bash
# Quick commit for Intelligence Hub

echo "📊 Committing Intelligence Hub..."

git add intelligence/weekly-reports/intel-hub.html
git add intelligence/weekly-reports/live-service-status.html
git add intelligence/live_service_monitor.py
git add intelligence/index.html

git commit -m "Add unified Intelligence Hub for easy navigation

- Single landing page for all intelligence services
- Live API status from GitHub Actions
- Quick access to all monitoring tools
- Clean navigation for internal use"

echo ""
echo "✅ Intelligence Hub ready!"
echo ""
echo "To deploy:"
echo "  git push"
echo ""
echo "Then access at:"
echo "  🌐 https://percevals.github.io/Laberit-intelligence/intelligence/"
echo ""
echo "Direct link:"
echo "  📊 https://percevals.github.io/Laberit-intelligence/intelligence/weekly-reports/intel-hub.html"