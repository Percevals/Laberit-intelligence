#!/bin/bash
# Generate Weekly Intelligence Report
# Date: July 11, 2025

echo "🚀 Generating Weekly Intelligence Report for July 11, 2025"
echo "========================================================"

# Set date
DATE="2025-07-11"

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Copy dashboard generator to use new data
echo "📊 Running dashboard generator..."
python immunity_dashboard_generator.py

# Check if output was created
if [ -f "immunity-dashboard-${DATE}.html" ]; then
    echo "✅ Dashboard generated successfully!"
    
    # Move to weekly-reports for backward compatibility
    mv "immunity-dashboard-${DATE}.html" "weekly-reports/"
    
    echo "📁 Report saved to: weekly-reports/immunity-dashboard-${DATE}.html"
    echo ""
    echo "🔗 The report will be available at:"
    echo "   https://percevals.github.io/Laberit-intelligence/intelligence/weekly-reports/immunity-dashboard-${DATE}.html"
    echo ""
    echo "Next steps:"
    echo "1. Review the generated dashboard"
    echo "2. Add any executive insights if needed"
    echo "3. Commit and push to publish"
else
    echo "❌ Error: Dashboard generation failed"
    echo "Check the error messages above"
fi