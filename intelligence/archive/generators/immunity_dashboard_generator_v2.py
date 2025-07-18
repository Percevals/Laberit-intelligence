#!/usr/bin/env python3
"""
DII 4.0 Immunity Dashboard Generator
Aligns with the modular framework for digital resilience
"""

import json
import os
from datetime import datetime
from pathlib import Path

class DIIv4DashboardGenerator:
    def __init__(self):
        self.template_path = "../templates/immunity_dashboard_template_v2.html"
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

    def load_weekly_intelligence_data(self):
        """Load the weekly intelligence data from multiple possible locations"""
        # Calculate week number
        week_num = datetime.now().isocalendar()[1]
        year = datetime.now().year
        
        # Try multiple locations in order of preference
        possible_files = [
            f"research/{year}/week-{week_num}/weekly-intelligence.json",
            f"research/{year}/week-{week_num}/intelligence-data.json",
            f"research/{year}/week-{week_num}/raw-research.json",
            # Legacy locations for backwards compatibility
            f"research/{year}/week-{week_num}/perplexity-input.json",
            f"perplexity-input-{self.week_date}.json"
        ]
        
        for file_path in possible_files:
            if os.path.exists(file_path):
                print(f"✅ Found intelligence data: {file_path}")
                with open(file_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
        
        # If no file found, create one in the new structure
        week_dir = f"research/{year}/week-{week_num}"
        os.makedirs(week_dir, exist_ok=True)
        
        template_file = f"{week_dir}/weekly-intelligence.json"
        print(f"⚠️  No intelligence data found in any location")
        print(f"💡 Creating template file: {template_file}")
        self.create_template_file(template_file)
        return None

    def create_template_file(self, filename):
        """Create a template perplexity-input file"""
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
                "TRD": {"value": "24", "trend": "stable"},
                "AER": {"value": "50", "trend": "improving"},
                "HFP": {"value": "65", "trend": "declining"},
                "BRI": {"value": "45", "trend": "stable"},
                "RRG": {"value": "3.2", "trend": "improving"}
            },
            "business_model_insights": {},
            "incidents": [],
            "benchmarking_stats": {},
            "recommendations": []
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(template_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Template created: {filename}")

    def format_business_model_card(self, model_name, model_data):
        """Format a single business model card"""
        trend_icon = {
            "improving": "↑",
            "declining": "↓", 
            "stable": "→"
        }.get(model_data.get('trend', 'stable'), "→")
        
        trend_class = {
            "improving": "trend-up",
            "declining": "trend-down",
            "stable": "trend-stable"
        }.get(model_data.get('trend', 'stable'), "trend-stable")
        
        score = model_data.get('immunity_score', 0)
        dii_color = self.get_dii_color(score)
        
        return f'''
        <div class="model-item">
            <div class="model-name">{model_name}</div>
            <div class="model-score">
                <span class="dii-badge" style="background: {dii_color}; color: white;">
                    DII {score}
                </span>
                <span class="trend-indicator {trend_class}">{trend_icon}</span>
            </div>
        </div>
        '''

    def get_dii_color(self, score):
        """Get color based on DII score"""
        if score < 4.0:
            return "rgba(239, 68, 68, 0.6)"  # Red - Frágil
        elif score < 6.0:
            return "rgba(251, 191, 36, 0.6)"  # Orange - Robusto
        elif score < 8.0:
            return "rgba(59, 130, 246, 0.6)"  # Blue - Resiliente
        else:
            return "rgba(34, 197, 94, 0.6)"   # Green - Adaptativo

    def format_incident_card(self, incident):
        """Format an incident card with DII context"""
        border_color = {
            "Crítico": "#ef4444",
            "Alto": "#f59e0b",
            "Medio": "#3b82f6",
            "Bajo": "#22c55e"
        }.get(incident.get('impact', 'Medio'), "#6b7280")
        
        return f'''
        <div class="incident-card" style="border-left-color: {border_color};">
            <div class="incident-header">
                <div>
                    <h3 style="font-size: 16px; margin-bottom: 8px;">
                        {incident.get('org_name', 'Organización')} - {incident.get('sector', 'Sector')}
                    </h3>
                    <div class="incident-meta">
                        <span>📍 {incident.get('country', 'País')}</span>
                        <span>📅 {incident.get('date', 'Fecha')}</span>
                        <span>🏢 {incident.get('business_model', 'Modelo')}</span>
                        <span>📊 DII: {incident.get('dii_score', 'N/A')}</span>
                    </div>
                </div>
                <span class="incident-impact impact-{incident.get('impact', 'medium').lower()}">
                    {incident.get('impact', 'Medio')}
                </span>
            </div>
            <p class="incident-description">
                <strong>{incident.get('attack_type', 'Ataque')}:</strong> {incident.get('summary', 'Sin descripción')}
            </p>
            <div class="incident-insights">
                💡 <strong>Lección clave:</strong> Este modelo de negocio ({incident.get('business_model', 'N/A')}) 
                muestra vulnerabilidad en dimensión {self.get_weak_dimension(incident)}.
            </div>
        </div>
        '''

    def get_weak_dimension(self, incident):
        """Determine weak dimension based on attack type"""
        attack_dimension_map = {
            "Ransomware": "RRG (Recovery Reality Gap)",
            "Supply Chain": "BRI (Blast Radius Index)",
            "Phishing": "HFP (Human Failure Probability)",
            "API Abuse": "AER (Attack Economics Ratio)",
            "Data Breach": "TRD (Time to Revenue Disruption)"
        }
        return attack_dimension_map.get(incident.get('attack_type'), "múltiples dimensiones")

    def format_recommendation_card(self, recommendation):
        """Format a recommendation card"""
        priority_icon = {
            "CRÍTICA": "🚨",
            "ALTA": "⚡",
            "MEDIA": "💡"
        }.get(recommendation.get('priority', 'MEDIA'), "💡")
        
        priority_class = {
            "CRÍTICA": "priority-critical",
            "ALTA": "priority-high",
            "MEDIA": "priority-medium"
        }.get(recommendation.get('priority', 'MEDIA'), "priority-medium")
        
        models = recommendation.get('business_models', [])
        model_chips = ' '.join([f'<span class="model-chip">{m}</span>' for m in models])
        
        return f'''
        <div class="recommendation-card {priority_class}">
            <div class="recommendation-icon">{priority_icon}</div>
            <div class="recommendation-content">
                <div class="recommendation-title">
                    {recommendation.get('recommendation', 'Recomendación')}
                </div>
                <div class="recommendation-models">
                    {model_chips}
                </div>
                <div class="recommendation-impact">
                    Impacto esperado: {recommendation.get('expected_impact', 'Por determinar')}
                </div>
            </div>
        </div>
        '''

    def populate_template(self, data):
        """Populate the template with data"""
        with open(self.template_path, 'r', encoding='utf-8') as f:
            template = f.read()
        
        # Basic replacements
        replacements = {
            "{{WEEK_DATE}}": data['week_date'],
            "{{IMMUNITY_AVG}}": data['week_summary']['immunity_avg'],
            "{{ATTACKS_WEEK}}": data['week_summary']['attacks_week'],
            "{{TOP_THREAT_PCT}}": data['week_summary']['top_threat_pct'],
            "{{TOP_THREAT_TYPE}}": data['week_summary']['top_threat_type'],
            "{{VICTIMS_LOW_IMMUNITY_PCT}}": data['week_summary']['victims_low_immunity_pct'],
            "{{KEY_INSIGHT}}": data['week_summary']['key_insight']
        }
        
        # DII Dimensions
        dimensions = data.get('dii_dimensions', {})
        replacements.update({
            "{{TRD_VALUE}}": dimensions.get('TRD', {}).get('value', '24'),
            "{{AER_VALUE}}": dimensions.get('AER', {}).get('value', '50'),
            "{{HFP_VALUE}}": dimensions.get('HFP', {}).get('value', '65'),
            "{{BRI_VALUE}}": dimensions.get('BRI', {}).get('value', '45'),
            "{{RRG_VALUE}}": dimensions.get('RRG', {}).get('value', '3.2')
        })
        
        # Business Models by Archetype
        business_models = data.get('business_model_insights', {})
        
        # Format models by archetype
        archetype_html = {
            "CUSTODIOS": [],
            "CONECTORES": [],
            "PROCESADORES": [],
            "REDUNDANTES": []
        }
        
        for model, model_data in business_models.items():
            archetype = self.model_to_archetype.get(model, "OTROS")
            if archetype in archetype_html:
                archetype_html[archetype].append(
                    self.format_business_model_card(model, model_data)
                )
        
        replacements.update({
            "{{CUSTODIOS_MODELS}}": '\n'.join(archetype_html["CUSTODIOS"]) or '<p style="color: #A6BBC8;">Sin datos esta semana</p>',
            "{{CONECTORES_MODELS}}": '\n'.join(archetype_html["CONECTORES"]) or '<p style="color: #A6BBC8;">Sin datos esta semana</p>',
            "{{PROCESADORES_MODELS}}": '\n'.join(archetype_html["PROCESADORES"]) or '<p style="color: #A6BBC8;">Sin datos esta semana</p>',
            "{{REDUNDANTES_MODELS}}": '\n'.join(archetype_html["REDUNDANTES"]) or '<p style="color: #A6BBC8;">Sin datos esta semana</p>'
        })
        
        # Immunity Matrix Quadrants
        immunity_chart = data.get('immunity_chart_data', {}).get('quadrants', {})
        
        def format_quadrant_models(models):
            return '\n'.join([f'<span class="model-chip">{m}</span>' for m in models])
        
        replacements.update({
            "{{Q1_MODELS}}": format_quadrant_models(immunity_chart.get('high_immunity_low_exposure', [])),
            "{{Q2_MODELS}}": format_quadrant_models(immunity_chart.get('high_immunity_high_exposure', [])),
            "{{Q3_MODELS}}": format_quadrant_models(immunity_chart.get('low_immunity_low_exposure', [])),
            "{{Q4_MODELS}}": format_quadrant_models(immunity_chart.get('low_immunity_high_exposure', []))
        })
        
        # Incidents
        incidents = data.get('incidents', [])
        incidents_html = [self.format_incident_card(inc) for inc in incidents[:6]]  # Top 6
        replacements["{{INCIDENTS_LIST}}"] = '\n'.join(incidents_html) or '<p style="color: #A6BBC8;">No se reportaron incidentes críticos esta semana</p>'
        
        # Benchmarking Stats
        stats = data.get('statistics', {})
        benchmarking_html = f'''
        <div style="background: rgba(13, 25, 41, 0.7); padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #B4B5DF;">{stats.get('total_incidents_tracked', 0)}</div>
            <div style="font-size: 12px; color: #A6BBC8;">Incidentes Rastreados</div>
        </div>
        <div style="background: rgba(13, 25, 41, 0.7); padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #B4B5DF;">{stats.get('average_detection_time_days', 0)} días</div>
            <div style="font-size: 12px; color: #A6BBC8;">Tiempo Promedio Detección</div>
        </div>
        <div style="background: rgba(13, 25, 41, 0.7); padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; font-weight: 700; color: #B4B5DF;">{stats.get('average_recovery_time_days', 0)} días</div>
            <div style="font-size: 12px; color: #A6BBC8;">Tiempo Promedio Recuperación</div>
        </div>
        '''
        replacements["{{BENCHMARKING_STATS}}"] = benchmarking_html
        
        # Recommendations
        recommendations = data.get('recommendations', [])
        recommendations_html = [self.format_recommendation_card(rec) for rec in recommendations[:4]]  # Top 4
        replacements["{{RECOMMENDATIONS_LIST}}"] = '\n'.join(recommendations_html) or '<p style="color: #A6BBC8;">Análisis en proceso</p>'
        
        # Maturity stage indicators (will be handled by JavaScript)
        replacements.update({
            "{{FRAGIL_ACTIVE}}": "",
            "{{ROBUSTO_ACTIVE}}": "",
            "{{RESILIENTE_ACTIVE}}": "",
            "{{ADAPTATIVO_ACTIVE}}": ""
        })
        
        # Apply all replacements
        for key, value in replacements.items():
            template = template.replace(key, str(value))
        
        return template

    def generate_dashboard(self):
        """Main method to generate the dashboard"""
        print("🚀 Starting DII 4.0 dashboard generation...")
        
        # Load data
        data = self.load_weekly_intelligence_data()
        if not data:
            return
        
        # Populate template
        dashboard_html = self.populate_template(data)
        
        # Ensure output directory exists
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)
        
        # Save dashboard
        output_file = os.path.join(self.output_dir, f"immunity-dashboard-{self.week_date}.html")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(dashboard_html)
        
        print(f"✅ Dashboard generated: {output_file}")
        
        # Print summary
        print(f"\n📊 Dashboard Metrics:")
        print(f"   - Date: {self.week_date}")
        print(f"   - Immunity Average: {data['week_summary']['immunity_avg']}")
        print(f"   - Weekly Attacks: {data['week_summary']['attacks_week']}")
        print(f"   - Business Models: {len(data.get('business_model_insights', {}))}")
        print(f"   - Incidents: {len(data.get('incidents', []))}")
        
        print("\n💡 Next steps:")
        print("1. Review the generated dashboard")
        print("2. Update with latest threat intelligence")
        print("3. Share with stakeholders")
        print("4. Archive for historical analysis")

if __name__ == "__main__":
    generator = DIIv4DashboardGenerator()
    generator.generate_dashboard()