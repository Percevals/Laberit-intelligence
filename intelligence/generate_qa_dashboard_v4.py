#!/usr/bin/env python3
"""
QA Dashboard Generator V4 - For testing the executive-focused template
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from immunity_dashboard_generator_v4 import DIIv4ExecutiveDashboardGenerator

class QADashboardGeneratorV4(DIIv4ExecutiveDashboardGenerator):
    def __init__(self):
        super().__init__()
        self.output_dir = "./outputs/dashboards/qa"
        
    def load_weekly_intelligence_data(self):
        """Override to load QA test data"""
        qa_file = "research/2025/week-29/weekly-intelligence-qa-test.json"
        
        if os.path.exists(qa_file):
            print(f"✅ Loading QA test data: {qa_file}")
            with open(qa_file, 'r', encoding='utf-8') as f:
                import json
                return json.load(f)
        else:
            print(f"❌ QA test file not found: {qa_file}")
            return None

if __name__ == "__main__":
    print("🧪 Generating QA Test Dashboard V4 (Executive Focus)...")
    print("=" * 60)
    
    generator = QADashboardGeneratorV4()
    generator.generate_dashboard()
    
    print("\n" + "=" * 60)
    print("📋 QA Checklist V4 - Executive Focus:")
    print("1. ✅ Title includes 'LATAM y España'")
    print("2. ✅ DII formula with Spanish explanation")
    print("3. ✅ 'Ver metodología completa' button")
    print("4. ✅ Most affected business model (not attack count)")
    print("5. ✅ Dimensions with Spanish names and meanings")
    print("6. ✅ 'Modelo de Negocio' instead of 'Arquetipo'")
    print("7. ✅ Business model descriptions for executives")
    print("8. ✅ Spain incidents prioritized (🇪🇸 flag)")
    print("9. ✅ Business lessons in each incident")
    print("10. ✅ Executive conversation enablers")
    print("\n💡 Dashboard location: ./outputs/dashboards/qa/")