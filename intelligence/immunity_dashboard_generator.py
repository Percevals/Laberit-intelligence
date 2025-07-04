#!/usr/bin/env python3
"""
Immunity Dashboard Generator
Combines threat intelligence data with Perplexity research to create weekly dashboard
"""

import os
import re
import json
from datetime import datetime, timedelta
from pathlib import Path

class ImmunityDashboardGenerator:
    def __init__(self):
        self.template_path = "templates/immunity-dashboard-template.html"
        self.output_dir = "intelligence"
        self.week_date = datetime.now().strftime('%Y-%m-%d')
        
    def load_template(self):
        """Load the HTML template"""
        with open(self.template_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def process_threat_intelligence(self):
        """Extract data from latest threat intelligence report"""
        intel_files = list(Path(self.output_dir).glob("threat-intelligence-*.html"))
        if not intel_files:
            return None
            
        latest = max(intel_files, key=lambda p: p.stat().st_mtime)
        with open(latest, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract metrics and threats
        otx_match = re.search(r'OTX Pulses:</strong> (\d+)', content)
        intelx_match = re.search(r'IntelX Results:</strong> (\d+)', content)
        
        # Extract threat titles from OTX section
        threats = re.findall(r'<h3>(.*?)</h3>', content)
        
        return {
            'otx_pulses': int(otx_match.group(1)) if otx_match else 0,
            'intelx_results': int(intelx_match.group(1)) if intelx_match else 0,
            'threats': threats[:10],  # Top 10 threats
            'file': latest.name
        }
    
    def parse_perplexity_input(self):
        """Load Perplexity research from JSON input file"""
        input_file = Path(self.output_dir) / f"perplexity-input-{self.week_date}.json"
        
        # Default structure
        default_data = {
            "week_summary": {
                "immunity_avg": "3.8",
                "attacks_week": "2,569",
                "top_threat_pct": "51%",
                "top_threat_type": "Phishing en Brasil",
                "key_insight": "El 71% de víctimas tenían inmunidad < 4. La preparación marca la diferencia."
            },
            "incidents": [],
            "threat_actors": [],
            "statistics": {
                "attacks_vs_global": "40%",
                "main_vector": "Ataques Web/Email",
                "vector_pct": "64%"
            }
        }
        
        if input_file.exists():
            with open(input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Merge with defaults
                for key in default_data:
                    if key not in data:
                        data[key] = default_data[key]
                return data
        else:
            # Create template file for user
            with open(input_file, 'w', encoding='utf-8') as f:
                json.dump(default_data, f, indent=2, ensure_ascii=False)
            print(f"📝 Created template: {input_file}")
            print("   Please fill with Perplexity research before running again")
            return default_data
    
    def generate_chart_points(self, incidents):
        """Generate immunity chart points HTML"""
        # Business model positions and scores
        models = {
            "Gobierno": {"score": 1.5, "pos": "bottom: 15%; right: 10%;", "color": "#C10016"},
            "Salud": {"score": 2.0, "pos": "bottom: 25%; right: 25%;", "color": "#C10016"},
            "Fintech": {"score": 2.5, "pos": "bottom: 35%; right: 20%;", "color": "#C10016"},
            "B2B Ind": {"score": 2.5, "pos": "bottom: 45%; right: 40%;", "color": "#C10016"},
            "Platform": {"score": 3.5, "pos": "top: 35%; left: 35%;", "color": "#FFB84D"},
            "B2C Digital": {"score": 4.2, "pos": "top: 25%; left: 25%;", "color": "#FFB84D"}
        }
        
        html = ""
        for name, data in models.items():
            # Check if this model was affected this week
            affected = any(name.lower() in inc.get('sector', '').lower() for inc in incidents)
            opacity = "1" if affected else "0.7"
            
            html += f'''
            <div class="chart-point" style="{data['pos']} background: {data['color']}; opacity: {opacity}; color: white;"
                 data-info="{name}: Inmunidad {data['score']}/10. {'⚠️ Incidentes esta semana' if affected else 'Sin incidentes recientes'}">
                <span>{name}</span>
                <span style="font-size: 18px;">{data['score']}</span>
            </div>
            '''
        
        return html
    
    def generate_threat_cards(self, perplexity_data, threat_data):
        """Generate threat cards HTML"""
        # Threat Actors Card
        actors_html = '''
        <div class="threat-card">
            <div class="threat-header">
                <div class="threat-title">Grupos Más Activos</div>
            </div>
            <ul class="threat-list">
        '''
        
        for actor in perplexity_data.get('threat_actors', [])[:3]:
            actors_html += f'''
                <li>
                    <div class="threat-name">
                        <span>{actor.get('name', 'Unknown')}</span>
                        <span class="threat-value">Ataca < {actor.get('immunity_threshold', '?')}</span>
                    </div>
                </li>
            '''
        
        actors_html += '</ul></div>'
        
        # Business Impacts Card
        impacts_html = '''
        <div class="threat-card">
            <div class="threat-header">
                <div class="threat-title">Sectores Impactados</div>
            </div>
            <ul class="threat-list">
        '''
        
        for incident in perplexity_data.get('incidents', [])[:3]:
            impacts_html += f'''
                <li>
                    <div class="threat-name">
                        <span>{incident.get('sector', 'Unknown')}</span>
                        <span class="threat-value">Víctimas: {incident.get('immunity_score', '?')}</span>
                    </div>
                </li>
            '''
        
        impacts_html += '</ul></div>'
        
        # Attack Vectors Card
        vectors_html = '''
        <div class="threat-card">
            <div class="threat-header">
                <div class="threat-title">Vectores de Ataque</div>
            </div>
            <ul class="threat-list">
                <li>
                    <div class="threat-name">
                        <span>Phishing/Ingeniería Social</span>
                        <span class="threat-value">90% en < 3</span>
                    </div>
                </li>
                <li>
                    <div class="threat-name">
                        <span>Vulnerabilidades API</span>
                        <span class="threat-value">85% en < 3.5</span>
                    </div>
                </li>
                <li>
                    <div class="threat-name">
                        <span>Infiltración Terceros</span>
                        <span class="threat-value">75% en < 4</span>
                    </div>
                </li>
            </ul>
        </div>
        '''
        
        return actors_html, impacts_html, vectors_html
    
    def generate_action_cards(self):
        """Generate action cards HTML"""
        cards = [
            {
                "title": "Inmunidad Crítica",
                "score": "Score < 4",
                "actions": [
                    "Active respaldo offline inmediato",
                    "Implemente MFA resistente a phishing",
                    "Presupueste 3-5% ingresos en ciberseguridad",
                    "Teste recuperación mensualmente"
                ]
            },
            {
                "title": "Inmunidad Media",
                "score": "Score 4-7",
                "actions": [
                    "Audite APIs continuamente",
                    "Diversifique proveedores críticos",
                    "Entrene contra ingeniería social mensualmente",
                    "Monitoree anomalías en tiempo real"
                ]
            },
            {
                "title": "Inmunidad Resiliente",
                "score": "Score > 7",
                "actions": [
                    "Comparta inteligencia sectorial",
                    "Implemente AI para detección predictiva",
                    "Negocie seguros cyber preferenciales",
                    "Desarrolle capacidad de threat hunting"
                ]
            }
        ]
        
        html = ""
        for card in cards:
            html += f'''
            <div class="action-card">
                <div class="action-header">
                    <div class="action-title">{card['title']}</div>
                    <div class="action-score">{card['score']}</div>
                </div>
                <ul class="action-list">
            '''
            for action in card['actions']:
                html += f'<li>{action}</li>'
            html += '</ul></div>'
        
        return html
    
    def generate_dashboard(self):
        """Generate the complete dashboard"""
        print("🚀 Starting dashboard generation...")
        
        # Load template
        template = self.load_template()
        
        # Get data sources
        threat_data = self.process_threat_intelligence()
        perplexity_data = self.parse_perplexity_input()
        
        # Extract week summary
        summary = perplexity_data.get('week_summary', {})
        stats = perplexity_data.get('statistics', {})
        
        # Generate components
        actors_card, impacts_card, vectors_card = self.generate_threat_cards(perplexity_data, threat_data)
        
        # Determine traffic light colors
        immunity_score = float(summary.get('immunity_avg', '3.8'))
        immunity_color = 'green' if immunity_score > 7 else 'yellow' if immunity_score > 4 else 'red'
        govt_immunity = 1.5
        govt_color = 'red'
        
        # Create week label
        week_start = (datetime.now() - timedelta(days=datetime.now().weekday())).strftime('%d')
        week_end = (datetime.now() - timedelta(days=datetime.now().weekday()) + timedelta(days=6)).strftime('%d de %B')
        week_label = f"Semana {week_start}-{week_end}"
        
        # Replace all placeholders
        replacements = {
            '{{WEEK_DATE}}': self.week_date,
            '{{WEEK_LABEL}}': week_label,
            '{{IMMUNITY_AVG}}': summary.get('immunity_avg', '3.8'),
            '{{ATTACKS_WEEK}}': summary.get('attacks_week', '2,569'),
            '{{TOP_THREAT_PCT}}': summary.get('top_threat_pct', '51%'),
            '{{TOP_THREAT_TYPE}}': summary.get('top_threat_type', 'Phishing en Brasil'),
            '{{KEY_INSIGHT}}': summary.get('key_insight', 'La nueva realidad: Su modelo de negocio ES su primera línea de defensa.'),
            '{{IMMUNITY_SCORE}}': summary.get('immunity_avg', '3.8'),
            '{{IMMUNITY_COLOR}}': immunity_color,
            '{{IMMUNITY_CONTEXT}}': f"{threat_data['otx_pulses'] if threat_data else 0} amenazas detectadas",
            '{{ATTACKS_VS_GLOBAL}}': stats.get('attacks_vs_global', '40%'),
            '{{ATTACKS_CONTEXT}}': f"{summary.get('attacks_week', '2,569')} vs 1,848/semana",
            '{{GOVT_IMMUNITY}}': str(govt_immunity),
            '{{GOVT_COLOR}}': govt_color,
            '{{VECTOR_PCT}}': stats.get('vector_pct', '64%'),
            '{{MAIN_VECTOR}}': stats.get('main_vector', 'Ataques via Web/Email'),
            '{{IMMUNITY_CHART_POINTS}}': self.generate_chart_points(perplexity_data.get('incidents', [])),
            '{{THREAT_ACTORS_CARD}}': actors_card,
            '{{BUSINESS_IMPACTS_CARD}}': impacts_card,
            '{{ATTACK_VECTORS_CARD}}': vectors_card,
            '{{ACTION_CARDS}}': self.generate_action_cards(),
            '{{FOOTER_QUOTE}}': "Su modelo de negocio define su inmunidad digital más que cualquier tecnología",
            '{{FOOTER_TEXT}}': "Business Fortress: La nueva dimensión de la ciberseguridad ejecutiva | Lãberit"
        }
        
        dashboard = template
        for key, value in replacements.items():
            dashboard = dashboard.replace(key, str(value))
        
        # Save dashboard
        output_path = os.path.join(self.output_dir, f'immunity-dashboard-{self.week_date}.html')
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(dashboard)
        
        print(f"✅ Dashboard generated: {output_path}")
        print(f"📊 Metrics included:")
        print(f"   - OTX Pulses: {threat_data['otx_pulses'] if threat_data else 0}")
        print(f"   - Immunity Average: {summary.get('immunity_avg', '3.8')}")
        print(f"   - Weekly Attacks: {summary.get('attacks_week', '2,569')}")
        
        return output_path

if __name__ == "__main__":
    generator = ImmunityDashboardGenerator()
    dashboard_path = generator.generate_dashboard()
    
    print("\n💡 Next steps:")
    print("1. Review perplexity-input-{date}.json")
    print("2. Add your research findings")
    print("3. Run script again for updated dashboard")
    print("4. Share on LinkedIn/Instagram")
