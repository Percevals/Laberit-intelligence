#!/usr/bin/env python3
"""
DII 4.0 Dashboard Generator
Generates immunity dashboard aligned with Digital Immunity Index 4.0 framework
"""

import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

class DIIDashboardGenerator:
    def __init__(self):
        self.template_path = "../templates/immunity_dashboard_template_dii4.html"
        self.output_dir = "."
        self.week_date = datetime.now().strftime('%Y-%m-%d')
        
    def load_template(self):
        """Load the HTML template"""
        template_file = Path(__file__).parent / self.template_path
        if not template_file.exists():
            raise FileNotFoundError(f"Template not found: {template_file}")
        
        with open(template_file, 'r', encoding='utf-8') as f:
            return f.read()
    
    def load_enriched_data(self):
        """Load enriched incidents data with DII 4.0 calculations"""
        enriched_file = Path(self.output_dir) / f"data/enriched_incidents_2025-07-11.json"
        perplexity_file = Path(self.output_dir) / f"data/perplexity-input-2025-07-11.json"
        
        # Load enriched data
        if enriched_file.exists():
            with open(enriched_file, 'r', encoding='utf-8') as f:
                enriched_data = json.load(f)
        else:
            raise FileNotFoundError(f"Enriched data not found: {enriched_file}")
        
        # Load perplexity format (for compatibility)
        if perplexity_file.exists():
            with open(perplexity_file, 'r', encoding='utf-8') as f:
                perplexity_data = json.load(f)
        else:
            perplexity_data = {}
        
        return enriched_data, perplexity_data
    
    def prepare_dashboard_data(self, enriched_data: Dict, perplexity_data: Dict) -> Dict:
        """Prepare data for dashboard template"""
        
        # Calculate summary statistics
        incidents = enriched_data['incidents']
        total_impact = enriched_data['metadata']['enrichment_metrics']['total_estimated_cost_usd']
        avg_dii = enriched_data['metadata']['enrichment_metrics']['average_dii_score']
        
        # Get critical incidents (DII < 1)
        critical_incidents = [inc for inc in incidents if inc['dii_analysis']['dii_score'] < 1]
        
        # Business model distribution
        model_counts = {}
        for incident in incidents:
            model = incident['business_model']['primary_model_name']
            model_counts[model] = model_counts.get(model, 0) + 1
        
        # Calculate average components
        avg_components = self.calculate_average_components(incidents)
        
        # Find worst sector
        sector_dii = {}
        for inc in incidents:
            sector = inc['immunity_impact']['sector']
            if sector not in sector_dii:
                sector_dii[sector] = []
            sector_dii[sector].append(inc['dii_analysis']['dii_score'])
        
        worst_sector = min(sector_dii.items(), key=lambda x: sum(x[1])/len(x[1]))
        best_sector = max(sector_dii.items(), key=lambda x: sum(x[1])/len(x[1]))
        
        # Get primary attack vector
        vector_counts = {}
        for inc in incidents:
            vector = inc['attack_vector']['type']
            vector_counts[vector] = vector_counts.get(vector, 0) + 1
        primary_vector = max(vector_counts.items(), key=lambda x: x[1])
        
        # Prepare dashboard data
        dashboard_data = {
            # Header info
            'WEEK_DATE': self.week_date,
            
            # Executive Summary
            'DII_AVG': f"{avg_dii:.1f}",
            'ATTACKS_WEEK': str(len(incidents)),
            'CRITICAL_PCT': f"{(len(critical_incidents)/len(incidents)*100):.0f}%",
            'TOP_SECTOR': worst_sector[0],
            'KEY_INSIGHT': f"{(len(critical_incidents)/len(incidents)*100):.0f}% de incidentes muestran inmunidad crítica (DII < 1). Sectores regulados requieren fortalecimiento urgente.",
            
            # DII Analysis
            'DII_POINTER_POSITION': min(100, (avg_dii / 10) * 100),  # Position on scale for 0-10 range
            'AVG_TRD': f"{avg_components['trd']:.0f}",
            'AVG_AER': f"{avg_components['aer']:.2f}",
            'AVG_HFP': f"{avg_components['hfp']:.2f}",
            'AVG_BRI': f"{avg_components['bri']:.1f}",
            'AVG_RRG': f"{avg_components['rrg']:.1f}",
            'DII_INTERPRETATION': self.get_dii_interpretation(avg_dii),
            'DII_COLOR': self.get_dii_color(avg_dii),
            
            # Metrics
            'TREND_DIRECTION': '↓ Decreciente' if avg_dii < 3 else '→ Estable',
            'TREND_COLOR': 'red' if avg_dii < 3 else 'yellow',
            'TREND_CONTEXT': 'Requiere acción inmediata' if avg_dii < 3 else 'Monitorear evolución',
            'WORST_SECTOR': worst_sector[0],
            'WORST_SECTOR_DII': f"{sum(worst_sector[1])/len(worst_sector[1]):.1f}",
            'SECTOR_COLOR': 'red',
            'SECTOR_GAPS': 'Sistemas legacy, procesos manuales, capacitación limitada',
            'PRIMARY_VECTOR': primary_vector[0].replace('_', ' ').title(),
            'VECTOR_INCIDENTS': str(primary_vector[1]),
            
            # Business Model Distribution
            'BUSINESS_MODEL_DISTRIBUTION': self.format_model_distribution(model_counts),
            
            # Charts and visuals
            'DII_CHART_POINTS': self.format_chart_points(incidents),
            'INCIDENTS_HTML': self.format_incidents_html(incidents),
            
            # Threat Intelligence
            'THREAT_ACTORS_CARD': self.format_threat_actors(perplexity_data),
            'ATTACK_VECTORS_CARD': self.format_attack_vectors(vector_counts),
            'AFFECTED_SECTORS_CARD': self.format_affected_sectors(sector_dii),
            
            # Action Cards
            'ACTION_CARDS': self.format_action_cards(),
            
            # News ticker
            'TICKER_NEWS': incidents[0]['title'] if incidents else 'Sin incidentes reportados',
            'TICKER_SOURCE': f"DII: {incidents[0]['dii_analysis']['dii_score']}" if incidents else '',
            'NEWS_DATA': json.dumps([{
                'title': inc['title'],
                'description': inc['summary'],
                'dii': inc['dii_analysis']['dii_score'],
                'model': inc['business_model']['primary_model_name'],
                'vector': inc['attack_vector']['type']
            } for inc in incidents]),
            
            # Footer
            'REPORT_METADATA': f'Generado: {datetime.now().strftime("%Y-%m-%d %H:%M")} | Fuente: Análisis DII 4.0 | <a href="https://laberit.com">Lãberit Intelligence</a>'
        }
        
        return dashboard_data
    
    def format_threats_list(self, incidents: List[Dict]) -> str:
        """Format threats for quick summary"""
        threats = []
        for inc in incidents[:3]:  # Top 3
            threat = f"<li>{inc['title']} - DII: {inc['dii_analysis']['dii_score']}</li>"
            threats.append(threat)
        return '\n'.join(threats)
    
    def format_incidents_html(self, incidents: List[Dict]) -> str:
        """Format incidents as HTML cards"""
        html_cards = []
        
        # Translation map for attack vectors
        vector_translations = {
            'ransomware': 'Ransomware',
            'data_breach': 'Fuga de Datos',
            'ddos': 'DDoS',
            'supply_chain': 'Cadena de Suministro',
            'ics_attack': 'Ataque ICS/OT'
        }
        
        for incident in incidents:
            severity_class = 'critical' if incident['dii_analysis']['dii_score'] < 1 else 'high'
            
            # Translate the summary to Spanish (simplified translation for demo)
            spanish_summary = self.translate_incident_summary(incident['summary'])
            vector_spanish = vector_translations.get(incident['attack_vector']['type'], incident['attack_vector']['type'])
            
            card = f'''
            <div class="incident-card">
                <div class="incident-header">
                    <h3>{self.translate_incident_title(incident['title'])}</h3>
                    <span class="severity-badge {severity_class}">DII: {incident['dii_analysis']['dii_score']}</span>
                </div>
                <p class="incident-date">{incident['date']} | {incident['source']}</p>
                <p>{spanish_summary}</p>
                <div class="incident-metrics">
                    <span>💰 Impacto: ${incident['financial_impact']['estimated_cost_usd']:,}</span>
                    <span>🏢 Modelo: {incident['business_model']['primary_model_name']}</span>
                    <span>⚡ Vector: {vector_spanish}</span>
                </div>
                <div class="dii-breakdown">
                    <small>TRD: {incident['dii_analysis']['components']['trd_hours']}h | 
                    AER: {incident['dii_analysis']['components']['aer_ratio']} | 
                    HFP: {incident['dii_analysis']['components']['hfp_probability']} | 
                    BRI: {incident['dii_analysis']['components']['bri_index']} | 
                    RRG: {incident['dii_analysis']['components']['rrg_grade']}</small>
                </div>
            </div>
            '''
            html_cards.append(card)
        
        return '\n'.join(html_cards)
    
    def translate_incident_title(self, title: str) -> str:
        """Simple translation of incident titles"""
        translations = {
            'Major Ransomware Attack on Brazilian Healthcare Network': 'Ataque Masivo de Ransomware a Red Hospitalaria Brasileña',
            'Data Breach at Mexican Financial Institution Exposes 2M Records': 'Fuga de Datos en Institución Financiera Mexicana Expone 2M de Registros',
            'Colombian Government Websites Hit by DDoS Campaign': 'Sitios Web del Gobierno Colombiano Afectados por Campaña DDoS',
            'Supply Chain Attack Targets LATAM E-commerce Platforms': 'Ataque a Cadena de Suministro Afecta Plataformas E-commerce de LATAM',
            'Argentine Energy Company Targeted by Industrial Cyber Attack': 'Empresa Energética Argentina Víctima de Ciberataque Industrial'
        }
        return translations.get(title, title)
    
    def translate_incident_summary(self, summary: str) -> str:
        """Simple translation of incident summaries"""
        # For demo purposes, providing direct translations
        translations = {
            "A sophisticated ransomware group targeted Brazil's second-largest healthcare network, affecting 15 hospitals and encrypting patient records. The attack disrupted emergency services across São Paulo state for 48 hours.": 
            "Un sofisticado grupo de ransomware atacó la segunda red hospitalaria más grande de Brasil, afectando 15 hospitales y cifrando registros de pacientes. El ataque interrumpió servicios de emergencia en el estado de São Paulo durante 48 horas.",
            
            "A major Mexican bank suffered a data breach exposing personal and financial information of over 2 million customers. The breach was attributed to an unpatched vulnerability in their online banking platform.":
            "Un importante banco mexicano sufrió una fuga de datos exponiendo información personal y financiera de más de 2 millones de clientes. La brecha se atribuyó a una vulnerabilidad sin parchear en su plataforma de banca en línea.",
            
            "Multiple Colombian government websites were taken offline by a coordinated DDoS attack. The attack lasted 6 hours and affected citizen services including tax payments and document processing.":
            "Múltiples sitios web del gobierno colombiano fueron desconectados por un ataque DDoS coordinado. El ataque duró 6 horas y afectó servicios ciudadanos incluyendo pagos de impuestos y procesamiento de documentos.",
            
            "A supply chain attack targeting a popular payment processing library affected multiple e-commerce platforms across Latin America. The malware was designed to steal credit card information during checkout.":
            "Un ataque a la cadena de suministro dirigido a una popular librería de procesamiento de pagos afectó múltiples plataformas de comercio electrónico en América Latina. El malware fue diseñado para robar información de tarjetas de crédito durante el proceso de pago.",
            
            "An Argentine energy distribution company reported a cyber attack on their industrial control systems. The attack attempted to disrupt power distribution but was contained before causing outages.":
            "Una empresa de distribución de energía argentina reportó un ciberataque a sus sistemas de control industrial. El ataque intentó interrumpir la distribución de energía pero fue contenido antes de causar apagones."
        }
        return translations.get(summary, summary)
    
    def format_actors_html(self, perplexity_data: Dict) -> str:
        """Format threat actors information"""
        # Use data from perplexity format or create default
        actors_html = '''
        <div class="actor-profile">
            <h4>Grupos Ransomware Activos</h4>
            <p>Qilin/Phantom Mantis targeting Spanish-speaking entities</p>
            <p>RansomHub affecting government services</p>
            <p>Scattered Spider using social engineering</p>
        </div>
        '''
        return actors_html
    
    def format_dii_analysis(self, incidents: List[Dict]) -> str:
        """Format DII analysis section"""
        analysis_html = f'''
        <div class="dii-analysis">
            <h3>Análisis DII 4.0</h3>
            <div class="dii-summary">
                <p><strong>Promedio Regional DII:</strong> {sum(i['dii_analysis']['dii_score'] for i in incidents)/len(incidents):.2f}</p>
                <p><strong>Incidentes Críticos (DII < 1):</strong> {len([i for i in incidents if i['dii_analysis']['dii_score'] < 1])}</p>
                <p><strong>Mejor Inmunidad:</strong> {max(incidents, key=lambda x: x['dii_analysis']['dii_score'])['immunity_impact']['sector']} (DII: {max(i['dii_analysis']['dii_score'] for i in incidents)})</p>
                <p><strong>Peor Inmunidad:</strong> {min(incidents, key=lambda x: x['dii_analysis']['dii_score'])['immunity_impact']['sector']} (DII: {min(i['dii_analysis']['dii_score'] for i in incidents):.2f})</p>
            </div>
            <div class="interpretation">
                <h4>Interpretación:</h4>
                <p>La región muestra vulnerabilidad crítica en sectores regulados (Salud, Finanzas) con DII < 1, 
                indicando que cesarán operaciones bajo ataque. Gobierno muestra resiliencia excepcional (DII > 10) 
                ante ataques DDoS. Urgente fortalecer inmunidad en infraestructura crítica.</p>
            </div>
        </div>
        '''
        return analysis_html
    
    def calculate_average_components(self, incidents: List[Dict]) -> Dict:
        """Calculate average DII components"""
        components = {
            'trd': sum(inc['dii_analysis']['components']['trd_hours'] for inc in incidents) / len(incidents),
            'aer': sum(inc['dii_analysis']['components']['aer_ratio'] for inc in incidents) / len(incidents),
            'hfp': sum(inc['dii_analysis']['components']['hfp_probability'] for inc in incidents) / len(incidents),
            'bri': sum(inc['dii_analysis']['components']['bri_index'] for inc in incidents) / len(incidents),
            'rrg': sum(inc['dii_analysis']['components']['rrg_grade'] for inc in incidents) / len(incidents)
        }
        return components
    
    def get_dii_interpretation(self, dii: float) -> str:
        """Get interpretation text for DII value"""
        if dii >= 10:
            return "Excelente capacidad de resiliencia operacional"
        elif dii >= 5:
            return "Buena inmunidad con degradación limitada"
        elif dii >= 2:
            return "Inmunidad regular, requiere fortalecimiento"
        elif dii >= 1:
            return "Inmunidad deficiente, alta vulnerabilidad"
        else:
            return "Crítico: operaciones cesarán bajo ataque"
    
    def get_dii_color(self, dii: float) -> str:
        """Get color class for DII value"""
        if dii >= 10:
            return "green"
        elif dii >= 5:
            return "yellow"
        else:
            return "red"
    
    def format_model_distribution(self, model_counts: Dict) -> str:
        """Format business model distribution for grid"""
        # All 8 business models
        all_models = [
            'Servicios Básicos',
            'Retail/Punto de Venta', 
            'Servicios Profesionales',
            'Suscripción Digital',
            'Servicios Financieros',
            'Infraestructura Heredada',
            'Cadena de Suministro',
            'Información Regulada'
        ]
        
        html = ""
        for model in all_models:
            count = model_counts.get(model, 0)
            highlight_class = "model-item-highlight" if count > 0 else "model-item-empty"
            html += f'''
            <div class="model-item {highlight_class}">
                <div class="model-count">{count}</div>
                <div class="model-name">{model}</div>
            </div>
            '''
        return html
    
    def format_chart_points(self, incidents: List[Dict]) -> str:
        """Format chart points for DII visualization"""
        points_html = ""
        
        # Group by sector for positioning
        sector_positions = {
            'Healthcare': {'x': 75, 'y': 20},
            'Financial Services': {'x': 70, 'y': 25},
            'Government': {'x': 30, 'y': 80},
            'Retail': {'x': 60, 'y': 40},
            'Energy': {'x': 65, 'y': 30}
        }
        
        for sector, positions in sector_positions.items():
            sector_incidents = [inc for inc in incidents if inc['immunity_impact']['sector'] == sector]
            if sector_incidents:
                avg_dii = sum(inc['dii_analysis']['dii_score'] for inc in sector_incidents) / len(sector_incidents)
                color = self.get_point_color(avg_dii)
                
                points_html += f'''
                <div class="chart-point" 
                     style="left: {positions['x']}%; bottom: {positions['y']}%; background: {color};"
                     data-info="DII: {avg_dii:.1f} | {len(sector_incidents)} incidentes">
                    <div>{sector}</div>
                    <div class="dii-value">{avg_dii:.1f}</div>
                </div>
                '''
        
        return points_html
    
    def get_point_color(self, dii: float) -> str:
        """Get color for chart point based on DII"""
        if dii >= 10:
            return "#4CAF50"
        elif dii >= 5:
            return "#FFB84D"
        elif dii >= 2:
            return "#FF6B6B"
        else:
            return "#C10016"
    
    def format_threat_actors(self, perplexity_data: Dict) -> str:
        """Format threat actors card"""
        return '''
        <div class="threat-card">
            <div class="threat-header">
                <span class="threat-title">🎯 Grupos Activos</span>
            </div>
            <ul class="threat-list">
                <li>
                    <div class="threat-name">
                        <span>Ransomware Groups</span>
                        <span class="threat-value">3 activos</span>
                    </div>
                    <div class="threat-source">Qilin, RansomHub, Scattered Spider</div>
                </li>
                <li>
                    <div class="threat-name">
                        <span>Supply Chain Actors</span>
                        <span class="threat-value">2 campañas</span>
                    </div>
                    <div class="threat-source">Targeting payment processors</div>
                </li>
            </ul>
        </div>
        '''
    
    def format_attack_vectors(self, vector_counts: Dict) -> str:
        """Format attack vectors card"""
        html = '''
        <div class="threat-card">
            <div class="threat-header">
                <span class="threat-title">⚡ Vectores de Ataque</span>
            </div>
            <ul class="threat-list">
        '''
        
        for vector, count in sorted(vector_counts.items(), key=lambda x: x[1], reverse=True):
            vector_name = vector.replace('_', ' ').title()
            html += f'''
                <li>
                    <div class="threat-name">
                        <span>{vector_name}</span>
                        <span class="threat-value">{count} casos</span>
                    </div>
                </li>
            '''
        
        html += '''
            </ul>
        </div>
        '''
        return html
    
    def format_affected_sectors(self, sector_dii: Dict) -> str:
        """Format affected sectors card"""
        html = '''
        <div class="threat-card">
            <div class="threat-header">
                <span class="threat-title">🏢 Sectores Afectados</span>
            </div>
            <ul class="threat-list">
        '''
        
        for sector, dii_scores in sorted(sector_dii.items(), key=lambda x: sum(x[1])/len(x[1])):
            avg_dii = sum(dii_scores) / len(dii_scores)
            html += f'''
                <li>
                    <div class="threat-name">
                        <span>{sector}</span>
                        <span class="threat-value">DII: {avg_dii:.1f}</span>
                    </div>
                    <div class="threat-source">{len(dii_scores)} incidentes reportados</div>
                </li>
            '''
        
        html += '''
            </ul>
        </div>
        '''
        return html
    
    def format_action_cards(self) -> str:
        """Format action recommendation cards"""
        return '''
        <div class="action-card">
            <div class="action-header">
                <div class="action-title">🛡️ Para DII < 2 (Crítico)</div>
                <div class="action-dii-range">Healthcare, Financial</div>
            </div>
            <ul class="action-list">
                <li>Implementar respuesta a incidentes 24/7</li>
                <li>Backup offline con pruebas semanales</li>
                <li>Segmentación de red urgente</li>
                <li>Capacitación anti-phishing inmediata</li>
            </ul>
        </div>
        <div class="action-card">
            <div class="action-header">
                <div class="action-title">⚠️ Para DII 2-5 (Vulnerable)</div>
                <div class="action-dii-range">Retail, Energy</div>
            </div>
            <ul class="action-list">
                <li>Fortalecer monitoreo de endpoints</li>
                <li>Implementar MFA en sistemas críticos</li>
                <li>Revisar accesos de terceros</li>
                <li>Actualizar planes de continuidad</li>
            </ul>
        </div>
        <div class="action-card">
            <div class="action-header">
                <div class="action-title">✓ Para DII > 10 (Resiliente)</div>
                <div class="action-dii-range">Government</div>
            </div>
            <ul class="action-list">
                <li>Mantener ejercicios de simulación</li>
                <li>Compartir mejores prácticas</li>
                <li>Evolucionar con nuevas amenazas</li>
                <li>Certificar madurez operacional</li>
            </ul>
        </div>
        '''
    
    def prepare_chart_data(self, incidents: List[Dict]) -> List[Dict]:
        """Prepare data for immunity chart visualization"""
        chart_data = []
        for incident in incidents:
            chart_data.append({
                'name': incident['immunity_impact']['sector'],
                'dii': incident['dii_analysis']['dii_score'],
                'impact': incident['financial_impact']['estimated_cost_usd'],
                'model': incident['business_model']['primary_model_name']
            })
        return chart_data
    
    def generate_dashboard(self):
        """Generate the complete dashboard"""
        print("🚀 Generating DII 4.0 Aligned Dashboard")
        print("=" * 50)
        
        # Load data
        enriched_data, perplexity_data = self.load_enriched_data()
        print(f"📊 Loaded {len(enriched_data['incidents'])} enriched incidents")
        
        # Load template
        template = self.load_template()
        print("📄 Template loaded")
        
        # Prepare dashboard data
        dashboard_data = self.prepare_dashboard_data(enriched_data, perplexity_data)
        print("🔧 Dashboard data prepared")
        
        # Replace placeholders
        dashboard = template
        for key, value in dashboard_data.items():
            placeholder = f"{{{{{key}}}}}"
            dashboard = dashboard.replace(placeholder, str(value))
        
        # Save dashboard
        output_path = Path(self.output_dir) / f'weekly-reports/immunity-dashboard-{self.week_date}.html'
        output_path.parent.mkdir(exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(dashboard)
        
        # Also save to new structure
        new_path = Path(self.output_dir) / f'outputs/dashboards/immunity-dashboard-{self.week_date}.html'
        new_path.parent.mkdir(exist_ok=True)
        with open(new_path, 'w', encoding='utf-8') as f:
            f.write(dashboard)
        
        print(f"\n✅ Dashboard generated successfully!")
        print(f"📍 Locations:")
        print(f"   - Customer URL: weekly-reports/immunity-dashboard-{self.week_date}.html")
        print(f"   - New structure: outputs/dashboards/immunity-dashboard-{self.week_date}.html")
        print(f"\n📈 Key Metrics:")
        print(f"   - Average DII Index: {dashboard_data['DII_AVG']}")
        print(f"   - Critical Incidents: {dashboard_data['CRITICAL_PCT']}")
        print(f"   - Worst Sector: {dashboard_data['WORST_SECTOR']} (DII: {dashboard_data['WORST_SECTOR_DII']})")
        
        return output_path

if __name__ == "__main__":
    generator = DIIDashboardGenerator()
    generator.generate_dashboard()