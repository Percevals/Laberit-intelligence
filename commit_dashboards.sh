#!/bin/bash
# Quick script to commit and push the new dashboards

echo "📊 Committing Intelligence Dashboards..."

# Add the new files
git add intelligence/index.html
git add intelligence/weekly-reports/service-monitor.html
git add intelligence/weekly-reports/business-model-dashboard.html
git add intelligence/service_status_dashboard.py
git add intelligence/diagnose_api_issues.py
git add intelligence/test_github_secrets.py
git add intelligence/.env.example
git add intelligence/setup_local_env.sh

# Commit
git commit -m "Add intelligence monitoring dashboards

- Service Monitor: Check API status and data freshness
- Business Model Dashboard: View risk by DII models
- Intelligence index page for easy navigation
- Diagnostic tools for API troubleshooting"

# Show status
echo ""
echo "✅ Files committed!"
echo ""
echo "To push to GitHub, run:"
echo "  git push"
echo ""
echo "After pushing, your dashboards will be available at:"
echo "  📊 https://percevals.github.io/Laberit-intelligence/intelligence/"
echo "  🛡️ https://percevals.github.io/Laberit-intelligence/intelligence/weekly-reports/service-monitor.html"
echo "  📈 https://percevals.github.io/Laberit-intelligence/intelligence/weekly-reports/business-model-dashboard.html"