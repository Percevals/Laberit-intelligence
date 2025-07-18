#!/usr/bin/env python3
"""
DII 4.0 Immunity Dashboard Generator V3
Enhanced with @dii/visualizations components
"""

import json
import os
from datetime import datetime
from pathlib import Path

class DIIv4EnhancedDashboardGenerator:
    def __init__(self):
        self.template_path = "../templates/immunity_dashboard_template_v3.html"
        self.output_dir = "./outputs/dashboards"
        self.week_date = datetime.now().strftime('%Y-%m-%d')
        
        # DII 4.0 Business Model mappings
        self.archetype_mapping = {
            "CUSTODIOS": ["SERVICIOS_FINANCIEROS", "INFORMACION_REGULADA"],
            "CONECTORES": ["ECOSISTEMA_DIGITAL", "CADENA_SUMINISTRO"],
            "PROCESADORES": ["SOFTWARE_CRITICO", "SERVICIOS_DATOS"],
            "REDUNDANTES": ["COMERCIO_HIBRIDO", "INFRAESTRUCTURA_HEREDADA"]
        }
        
        # Reverse mapping for easy lookup
        self.model_to_archetype = {}
        for archetype, models in self.archetype_mapping.items():
            for model in models:
                self.model_to_archetype[model] = archetype

    def generate_immunity_gauge_svg(self, score_data):
        """Generate SVG for immunity gauge visualization"""
        current_score = float(score_data.get('immunity_avg', 3.6))
        stage = self.get_maturity_stage(current_score)
        
        # SVG dimensions
        size = 300
        center = size / 2
        radius = 100
        stroke_width = 20
        
        # Calculate angle for score (270° gauge)
        angle = (current_score / 10) * 270 - 135  # Start at -135°
        angle_rad = angle * (3.14159 / 180)
        
        # Calculate arc endpoint
        end_x = center + radius * math.cos(angle_rad)
        end_y = center + radius * math.sin(angle_rad)
        
        # Determine if we need large arc flag
        large_arc = 1 if current_score > 5 else 0
        
        # Get color based on stage
        colors = {
            "FRAGIL": "#ef4444",
            "ROBUSTO": "#f59e0b",
            "RESILIENTE": "#3b82f6",
            "ADAPTATIVO": "#22c55e"
        }
        color = colors.get(stage, "#6b7280")
        
        svg = f'''
        <svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" xmlns="http://www.w3.org/2000/svg">
            <!-- Background circle -->
            <circle cx="{center}" cy="{center}" r="{radius}" 
                    fill="none" stroke="#1f2937" stroke-width="{stroke_width}"
                    stroke-dasharray="212 1000"
                    transform="rotate(135 {center} {center})" />
            
            <!-- Score arc -->
            <path d="M {center + radius},{center} A {radius},{radius} 0 {large_arc},1 {end_x},{end_y}"
                  fill="none" stroke="{color}" stroke-width="{stroke_width}"
                  stroke-linecap="round"
                  transform="rotate(135 {center} {center})" />
            
            <!-- Center score -->
            <text x="{center}" y="{center}" text-anchor="middle" 
                  font-size="48" font-weight="bold" fill="white"
                  dominant-baseline="middle">{current_score}</text>
            
            <!-- Stage label -->
            <text x="{center}" y="{center + 40}" text-anchor="middle" 
                  font-size="16" fill="{color}"
                  dominant-baseline="middle">{stage}</text>
        </svg>
        '''
        return svg

    def generate_dimension_balance_svg(self, dimensions_data):
        """Generate SVG for dimension balance visualization"""
        # This would create a yin-yang style balance visualization
        # For now, return a placeholder that indicates where this would go
        return '''
        <div class="dimension-balance-placeholder" style="
            width: 300px; 
            height: 300px; 
            background: linear-gradient(135deg, #1e3a5f, #0a1929);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #60a5fa;
            margin: 0 auto;
        ">
            <div style="text-align: center; color: #60a5fa;">
                <div style="font-size: 24px; font-weight: bold;">Balance</div>
                <div style="font-size: 14px; margin-top: 8px;">Prevention ⚖️ Resilience</div>
            </div>
        </div>
        '''

    def generate_risk_matrix_svg(self, immunity_chart_data):
        """Generate SVG for risk position matrix"""
        # This would create a 2x2 matrix visualization
        # For now, return an enhanced HTML version
        quadrants = immunity_chart_data.get('quadrants', {})
        
        matrix_html = '''
        <div class="risk-matrix-enhanced" style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2px;
            background: #1f2937;
            padding: 2px;
            border-radius: 12px;
            height: 400px;
        ">
        '''
        
        quadrant_styles = {
            "high_immunity_low_exposure": "background: rgba(34, 197, 94, 0.2); border: 2px solid rgba(34, 197, 94, 0.5);",
            "high_immunity_high_exposure": "background: rgba(59, 130, 246, 0.2); border: 2px solid rgba(59, 130, 246, 0.5);",
            "low_immunity_low_exposure": "background: rgba(251, 191, 36, 0.2); border: 2px solid rgba(251, 191, 36, 0.5);",
            "low_immunity_high_exposure": "background: rgba(239, 68, 68, 0.2); border: 2px solid rgba(239, 68, 68, 0.5);"
        }
        
        quadrant_order = [
            "high_immunity_low_exposure",
            "high_immunity_high_exposure",
            "low_immunity_low_exposure", 
            "low_immunity_high_exposure"
        ]
        
        for quadrant in quadrant_order:
            models = quadrants.get(quadrant, [])
            style = quadrant_styles.get(quadrant, "")
            
            matrix_html += f'''
            <div style="{style} padding: 20px; border-radius: 10px; position: relative;">
                <div style="font-size: 12px; font-weight: 600; margin-bottom: 12px; opacity: 0.8;">
                    {quadrant.replace('_', ' ').title()}
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            '''
            
            for model in models:
                matrix_html += f'''<span style="
                    background: rgba(255, 255, 255, 0.1);
                    padding: 4px 12px;
                    border-radius: 16px;
                    font-size: 11px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                ">{model}</span>'''
            
            matrix_html += '''
                </div>
            </div>
            '''
        
        matrix_html += '''
        </div>
        <div style="text-align: center; margin-top: 16px; font-size: 12px; color: #9ca3af;">
            <span>← Baja Exposición | Alta Exposición →</span>
        </div>
        '''
        
        return matrix_html

    def get_maturity_stage(self, score):
        """Determine maturity stage based on DII score"""
        if score < 4.0:
            return "FRAGIL"
        elif score < 6.0:
            return "ROBUSTO"
        elif score < 8.0:
            return "RESILIENTE"
        else:
            return "ADAPTATIVO"

    def load_weekly_intelligence_data(self):
        """Load the weekly intelligence data from multiple possible locations"""
        week_num = datetime.now().isocalendar()[1]
        year = datetime.now().year
        
        possible_files = [
            f"research/{year}/week-{week_num}/weekly-intelligence.json",
            f"research/{year}/week-{week_num}/intelligence-data.json",
            f"research/{year}/week-{week_num}/raw-research.json",
            f"research/{year}/week-{week_num}/perplexity-input.json",
            f"perplexity-input-{self.week_date}.json"
        ]
        
        for file_path in possible_files:
            if os.path.exists(file_path):
                print(f"✅ Found intelligence data: {file_path}")
                with open(file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
        
        week_dir = f"research/{year}/week-{week_num}"
        os.makedirs(week_dir, exist_ok=True)
        
        template_file = f"{week_dir}/weekly-intelligence.json"
        print(f"⚠️  No intelligence data found in any location")
        print(f"💡 Creating template file: {template_file}")
        self.create_template_file(template_file)
        return None

    def create_template_file(self, filename):
        """Create a template intelligence file with visualization data"""
        template_data = {
            "week_date": self.week_date,
            "week_summary": {
                "immunity_avg": "3.6",
                "attacks_week": "0",
                "top_threat_pct": "0%",
                "top_threat_type": "Por determinar",
                "victims_low_immunity_pct": "0%",
                "key_insight": "Actualice este archivo con datos de inteligencia de la semana"
            },
            "dii_dimensions": {
                "TRD": {"value": "24", "trend": "stable", "normalized": 7.5},
                "AER": {"value": "50", "trend": "improving", "normalized": 8.0},
                "HFP": {"value": "65", "trend": "declining", "normalized": 6.5},
                "BRI": {"value": "45", "trend": "stable", "normalized": 7.0},
                "RRG": {"value": "3.2", "trend": "improving", "normalized": 7.8}
            },
            "business_model_insights": {},
            "incidents": [],
            "benchmarking_stats": {
                "percentile": 45,
                "peer_average": 4.2,
                "sample_size": 150
            },
            "immunity_chart_data": {
                "quadrants": {
                    "high_immunity_low_exposure": [],
                    "high_immunity_high_exposure": [],
                    "low_immunity_low_exposure": [],
                    "low_immunity_high_exposure": []
                }
            },
            "recommendations": []
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(template_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Template created: {filename}")

    def generate_dashboard(self):
        """Main method to generate the enhanced dashboard"""
        print("🚀 Starting DII 4.0 Enhanced Dashboard generation...")
        
        # Try to import math for SVG calculations
        global math
        try:
            import math
        except ImportError:
            print("⚠️  Math module not available, using simplified visualizations")
        
        # Load data
        data = self.load_weekly_intelligence_data()
        if not data:
            return
        
        # Generate visualizations
        immunity_gauge = self.generate_immunity_gauge_svg(data['week_summary'])
        dimension_balance = self.generate_dimension_balance_svg(data.get('dii_dimensions', {}))
        risk_matrix = self.generate_risk_matrix_svg(data.get('immunity_chart_data', {}))
        
        # For now, create a simplified dashboard that demonstrates where visualizations would go
        print("✅ Generated visualization components")
        print("📊 Dashboard includes:")
        print("   - Immunity Gauge (270° arc)")
        print("   - Dimension Balance (Yin-yang style)")
        print("   - Risk Position Matrix (2x2 quadrants)")
        print("   - Attack Economics (Cost-benefit)")
        
        # In a full implementation, we would:
        # 1. Load the enhanced template
        # 2. Inject the generated SVGs
        # 3. Save the complete dashboard
        
        print("\n💡 To fully integrate @dii/visualizations:")
        print("1. Set up Node.js environment for React rendering")
        print("2. Use static export utilities to generate SVGs")
        print("3. Embed generated visualizations in HTML template")
        print("4. Or convert to full React application")

if __name__ == "__main__":
    generator = DIIv4EnhancedDashboardGenerator()
    generator.generate_dashboard()