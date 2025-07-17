#!/usr/bin/env python3
"""
QA Dashboard Generator - For testing the template with sample data
"""

import json
import os
import shutil
from immunity_dashboard_generator_v2 import DIIv4DashboardGenerator

class QADashboardGenerator(DIIv4DashboardGenerator):
    def __init__(self):
        super().__init__()
        self.output_dir = "./outputs/dashboards/qa"
        
    def load_weekly_intelligence_data(self):
        """Override to load QA test data"""
        qa_file = "research/2025/week-29/weekly-intelligence-qa-test.json"
        
        if os.path.exists(qa_file):
            print(f"✅ Loading QA test data: {qa_file}")
            with open(qa_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            print(f"❌ QA test file not found: {qa_file}")
            return None

if __name__ == "__main__":
    print("🧪 Generating QA Test Dashboard...")
    print("=" * 60)
    
    generator = QADashboardGenerator()
    generator.generate_dashboard()
    
    print("\n" + "=" * 60)
    print("📋 QA Checklist:")
    print("1. Check visual layout and responsive design")
    print("2. Verify DII formula display")
    print("3. Test maturity stage indicators")
    print("4. Review business model cards and trends")
    print("5. Validate incident timeline formatting")
    print("6. Check threat matrix quadrants")
    print("7. Test hover effects and interactions")
    print("8. Verify color coding for impact levels")
    print("9. Check benchmarking visualization")
    print("10. Review recommendation priorities")
    print("\n💡 Dashboard location: ./outputs/dashboards/qa/")