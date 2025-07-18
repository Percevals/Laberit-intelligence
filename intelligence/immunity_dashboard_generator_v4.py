#!/usr/bin/env python3
"""
DII 4.0 Immunity Dashboard Generator V4
Enhanced for executive conversations with Spain inclusion
"""

import json
import os
from datetime import datetime
from pathlib import Path
from collections import Counter

class DIIv4ExecutiveDashboardGenerator:
    def __init__(self):
        self.template_path = "../templates/immunity_dashboard_template_v4.html"
        self.output_dir = "./outputs/dashboards"
        self.week_date = datetime.now().strftime('%Y-%m-%d')
        
        # Business model descriptions for executives
        self.model_descriptions = {
            "SERVICIOS_FINANCIEROS": "Bancos y aseguradoras que custodian activos financieros críticos",
            "INFORMACION_REGULADA": "Hospitales y educación que protegen datos sensibles regulados",
            "ECOSISTEMA_DIGITAL": "Marketplaces y plataformas que conectan compradores y vendedores",
            "CADENA_SUMINISTRO": "Operadores logísticos que mueven productos físicos y digitales",
            "SOFTWARE_CRITICO": "Empresas SaaS cuyo producto principal es software",
            "SERVICIOS_DATOS": "Procesadores de datos y analytics como core del negocio",
            "COMERCIO_HIBRIDO": "Retailers con operaciones físicas y digitales integradas",
            "INFRAESTRUCTURA_HEREDADA": "Utilities y manufactura con sistemas legacy críticos"
        }
        
        # Dimension meanings for executives
        self.dimension_meanings = {
            "TRD": {
                "high": "Puede operar más de 24h sin pérdida significativa de ingresos",
                "medium": "Impacto en ingresos entre 4-24 horas",
                "low": "Pérdida de ingresos inmediata (menos de 4h)"
            },
            "AER": {
                "high": "Por cada €1 del atacante, puede perder más de €100",
                "medium": "Ratio de pérdida entre €20-€100 por €1 invertido",
                "low": "Pérdida limitada a menos de €20 por €1 de ataque"
            },
            "HFP": {
                "high": "Más del 70% de probabilidad de compromiso por empleado",
                "medium": "Entre 40-70% de riesgo humano mensual",
                "low": "Menos del 40% de probabilidad de error humano"
            },
            "BRI": {
                "high": "Un breach puede afectar más del 60% del valor del negocio",
                "medium": "Impacto contenido entre 30-60% del negocio",
                "low": "Daño limitado a menos del 30% de operaciones"
            },
            "RRG": {
                "high": "Recuperación real toma 3x+ más tiempo del planeado",
                "medium": "Demora de recuperación entre 1.5x-3x",
                "low": "Recuperación casi según lo planeado (menos de 1.5x)"
            }
        }

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
        """Create a template with Spain data requirements"""
        template_data = {
            "week_date": self.week_date,
            "week_summary": {
                "immunity_avg": "3.6",
                "attacks_week": "2,847",
                "top_threat_pct": "0%",
                "top_threat_type": "Por determinar",
                "victims_low_immunity_pct": "0%",
                "key_insight": "Incluir análisis de España y LATAM"
            },
            "dii_dimensions": {
                "TRD": {"value": "24", "trend": "stable"},
                "AER": {"value": "50", "trend": "stable"},
                "HFP": {"value": "65", "trend": "stable"},
                "BRI": {"value": "45", "trend": "stable"},
                "RRG": {"value": "3.2", "trend": "stable"}
            },
            "business_model_insights": {},
            "incidents": [
                {
                    "date": "2025-XX-XX",
                    "country": "España",
                    "sector": "Ejemplo",
                    "org_name": "Incluir incidentes de España",
                    "attack_type": "Tipo",
                    "business_model": "MODELO",
                    "impact": "Alto",
                    "summary": "Resumen del incidente",
                    "business_lesson": "Lección para ejecutivos"
                }
            ],
            "spain_specific": {
                "incidents_count": 0,
                "regulatory_updates": [],
                "spanish_companies_affected": []
            },
            "recommendations": []
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(template_data, f, ensure_ascii=False, indent=2)

    def get_most_affected_model(self, data):
        """Determine the most affected business model this week"""
        incidents = data.get('incidents', [])
        if not incidents:
            return "N/A", "Sin datos suficientes"
        
        # Count incidents by business model
        model_counts = Counter(inc.get('business_model', 'UNKNOWN') for inc in incidents)
        most_affected = model_counts.most_common(1)[0][0]
        
        # Get description
        description = self.model_descriptions.get(most_affected, "Modelo de negocio digital")
        
        return most_affected.replace('_', ' '), description

    def get_dimension_meaning(self, dimension, value):
        """Get executive-friendly meaning of dimension value"""
        meanings = self.dimension_meanings.get(dimension, {})
        
        # Determine level based on dimension and value
        if dimension == "TRD":
            level = "high" if float(value) > 24 else "medium" if float(value) > 4 else "low"
        elif dimension == "AER":
            level = "high" if float(value) > 100 else "medium" if float(value) > 20 else "low"
        elif dimension == "HFP":
            level = "high" if float(value) > 70 else "medium" if float(value) > 40 else "low"
        elif dimension == "BRI":
            level = "high" if float(value) > 60 else "medium" if float(value) > 30 else "low"
        elif dimension == "RRG":
            level = "high" if float(value) > 3 else "medium" if float(value) > 1.5 else "low"
        else:
            level = "medium"
        
        return meanings.get(level, "Valor en rango normal para el mercado")

    def format_business_model_card(self, model_name, model_data):
        """Format a business model card with executive context"""
        score = model_data.get('immunity_score', 0)
        trend = model_data.get('trend', 'stable')
        
        trend_icon = {
            "improving": "↑ Mejorando",
            "declining": "↓ Declinando", 
            "stable": "→ Estable"
        }.get(trend, "→ Estable")
        
        trend_class = {
            "improving": "trend-up",
            "declining": "trend-down",
            "stable": "trend-stable"
        }.get(trend, "trend-stable")
        
        dii_color = self.get_dii_color(score)
        description = self.model_descriptions.get(model_name, "")
        threats = model_data.get('key_threats', [])
        
        return f'''
        <div class="model-card">
            <div class="model-header">
                <div class="model-name">{model_name.replace('_', ' ')}</div>
                <div class="model-score">
                    <span class="dii-badge" style="background: {dii_color}; color: white;">
                        DII {score}
                    </span>
                    <span class="dimension-trend {trend_class}">{trend_icon}</span>
                </div>
            </div>
            <p class="model-description">{description}</p>
            <p class="model-threats">
                <strong>Amenazas principales:</strong> {', '.join(threats[:2]) if threats else 'Análisis en proceso'}
            </p>
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

    def translate_incident_description(self, description, attack_type):
        """Translate common incident descriptions to Spanish"""
        translations = {
            "Largest cybercrime in Brazil's history": "Mayor cibercrimen en la historia de Brasil",
            "Commercial refrigeration manufacturer hit by": "Fabricante de refrigeración comercial atacado por",
            "IT systems in Brazil and Mexico rendered unavailable": "Sistemas IT en Brasil y México quedaron inoperables",
            "systems isolated to prevent spread": "sistemas aislados para prevenir propagación",
            "No confirmed data leakage but operations disrupted": "Sin filtración de datos confirmada pero operaciones interrumpidas",
            "enabling theft of": "permitiendo el robo de",
            "via unauthorized PIX transactions": "mediante transacciones PIX no autorizadas",
            "Operations disrupted": "Operaciones interrumpidas",
            "hours": "horas",
            "arrest made": "arresto realizado",
            "frozen": "congelado"
        }
        
        # Apply translations
        result = description
        for eng, esp in translations.items():
            result = result.replace(eng, esp)
        
        return result

    def format_incident_card(self, incident):
        """Format incident with business lesson focus"""
        border_color = {
            "Crítico": "#ef4444",
            "Alto": "#f59e0b",
            "Medio": "#3b82f6",
            "Bajo": "#22c55e"
        }.get(incident.get('impact', 'Medio'), "#6b7280")
        
        # Determine region and severity for filtering
        country = incident.get('country', '')
        region = 'spain' if country == 'España' else 'latam'
        impact = incident.get('impact', 'Medio').lower()
        severity = 'critical' if impact in ['crítico', 'critical'] else 'high'
        
        # Highlight Spain incidents
        country_flag = "🇪🇸 " if country == "España" else ""
        
        # Translate attack type
        attack_type_translations = {
            "Ransomware": "Ransomware",
            "Insider Threat / Credential Compromise": "Amenaza Interna / Compromiso de Credenciales",
            "Data Breach": "Fuga de Datos",
            "API Attack": "Ataque API",
            "Supply Chain": "Cadena de Suministro"
        }
        attack_type = incident.get('attack_type', 'Ataque')
        attack_type_esp = attack_type_translations.get(attack_type, attack_type)
        
        # Translate description
        description = self.translate_incident_description(
            incident.get('summary', 'Sin descripción'),
            attack_type
        )
        
        return f'''
        <div class="incident-card" onclick="toggleIncident(this)" data-region="{region}" data-severity="{severity}" style="border-left-color: {border_color};">
            <div class="incident-header">
                <div>
                    <h3 style="font-size: 16px; margin-bottom: 8px;">
                        {country_flag}{incident.get('org_name', 'Organización')} - {incident.get('sector', 'Sector')}
                    </h3>
                    <div class="incident-meta">
                        <span>📍 {incident.get('country', 'País')}</span>
                        <span>📅 {incident.get('date', 'Fecha')}</span>
                        <span>🏢 {incident.get('business_model', 'Modelo').replace('_', ' ')}</span>
                    </div>
                </div>
                <span class="incident-impact impact-{incident.get('impact', 'medium').lower()}">
                    {incident.get('impact', 'Medio')}
                </span>
            </div>
            <p class="incident-description">
                <strong>{attack_type_esp}:</strong> {description}
            </p>
            <div class="incident-lesson">
                💡 <strong>Lección ejecutiva:</strong> {incident.get('business_lesson', 
                    'Las organizaciones con este modelo de negocio deben reforzar sus controles de seguridad.')}
            </div>
        </div>
        '''

    def format_recommendation_card(self, recommendation):
        """Format recommendation for executive conversations"""
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
        model_chips = ' '.join([f'<span class="model-chip">{m.replace("_", " ")}</span>' for m in models])
        
        return f'''
        <div class="recommendation-card {priority_class}">
            <div class="recommendation-icon">{priority_icon}</div>
            <div class="recommendation-content">
                <div class="recommendation-title">
                    {recommendation.get('recommendation', 'Recomendación')}
                </div>
                <div class="recommendation-models">
                    Aplica a: {model_chips if model_chips else '<span class="model-chip">Todos los modelos</span>'}
                </div>
                <div class="recommendation-impact">
                    <strong>Impacto esperado:</strong> {recommendation.get('expected_impact', 'Mejora significativa en resiliencia')}
                </div>
            </div>
        </div>
        '''

    def populate_template(self, data):
        """Populate template with executive-focused content"""
        with open(self.template_path, 'r', encoding='utf-8') as f:
            template = f.read()
        
        # Get most affected model
        most_affected_model, model_description = self.get_most_affected_model(data)
        
        # Basic replacements
        replacements = {
            "{{WEEK_DATE}}": data['week_date'],
            "{{IMMUNITY_AVG}}": data['week_summary']['immunity_avg'],
            "{{MOST_AFFECTED_MODEL}}": most_affected_model,
            "{{MODEL_DESCRIPTION}}": model_description,
            "{{TOP_THREAT_PCT}}": data['week_summary']['top_threat_pct'],
            "{{TOP_THREAT_TYPE}}": data['week_summary']['top_threat_type'],
            "{{VICTIMS_LOW_IMMUNITY_PCT}}": data['week_summary']['victims_low_immunity_pct'],
            "{{KEY_INSIGHT}}": data['week_summary']['key_insight']
        }
        
        # DII Dimensions with meanings
        dimensions = data.get('dii_dimensions', {})
        for dim in ['TRD', 'AER', 'HFP', 'BRI', 'RRG']:
            dim_data = dimensions.get(dim, {})
            value = dim_data.get('value', '0')
            trend = dim_data.get('trend', 'stable')
            
            replacements[f"{{{{{dim}_VALUE}}}}"] = value
            replacements[f"{{{{{dim}_MEANING}}}}"] = self.get_dimension_meaning(dim, value)
            
            trend_text = {
                "improving": "↑ Mejorando",
                "declining": "↓ Empeorando",
                "stable": "→ Estable"
            }.get(trend, "→ Estable")
            
            replacements[f"{{{{{dim}_TREND}}}}"] = trend_text
            replacements[f"{{{{{dim}_TREND_CLASS}}}}"] = f"trend-{trend.replace('improving', 'up').replace('declining', 'down')}"
        
        # Business Models
        business_models = data.get('business_model_insights', {})
        models_html = []
        
        # Ensure we show all 8 models
        all_models = [
            "SERVICIOS_FINANCIEROS", "INFORMACION_REGULADA",
            "ECOSISTEMA_DIGITAL", "CADENA_SUMINISTRO",
            "SOFTWARE_CRITICO", "SERVICIOS_DATOS",
            "COMERCIO_HIBRIDO", "INFRAESTRUCTURA_HEREDADA"
        ]
        
        for model in all_models:
            model_data = business_models.get(model, {
                "immunity_score": 0,
                "trend": "stable",
                "key_threats": []
            })
            models_html.append(self.format_business_model_card(model, model_data))
        
        replacements["{{BUSINESS_MODELS_CARDS}}"] = '\n'.join(models_html)
        
        # Immunity Matrix Quadrants
        immunity_chart = data.get('immunity_chart_data', {}).get('quadrants', {})
        
        def format_quadrant_models(models):
            return '\n'.join([f'<span class="model-chip">{m.replace("_", " ")}</span>' for m in models])
        
        replacements.update({
            "{{Q1_MODELS}}": format_quadrant_models(immunity_chart.get('high_immunity_low_exposure', [])),
            "{{Q2_MODELS}}": format_quadrant_models(immunity_chart.get('high_immunity_high_exposure', [])),
            "{{Q3_MODELS}}": format_quadrant_models(immunity_chart.get('low_immunity_low_exposure', [])),
            "{{Q4_MODELS}}": format_quadrant_models(immunity_chart.get('low_immunity_high_exposure', []))
        })
        
        # Incidents - Prioritize Spain
        incidents = data.get('incidents', [])
        spain_incidents = [inc for inc in incidents if inc.get('country') == 'España']
        other_incidents = [inc for inc in incidents if inc.get('country') != 'España']
        
        # Show Spain incidents first, then others
        sorted_incidents = spain_incidents + other_incidents
        incidents_html = [self.format_incident_card(inc) for inc in sorted_incidents[:8]]
        
        if not incidents_html:
            incidents_html = ['<p style="color: #A6BBC8; text-align: center;">No se reportaron incidentes críticos esta semana</p>']
        
        replacements["{{INCIDENTS_LIST}}"] = '\n'.join(incidents_html)
        
        # Recommendations
        recommendations = data.get('recommendations', [])
        recommendations_html = [self.format_recommendation_card(rec) for rec in recommendations[:4]]
        
        if not recommendations_html:
            recommendations_html = ['<p style="color: #A6BBC8;">Análisis de recomendaciones en proceso</p>']
        
        replacements["{{RECOMMENDATIONS_LIST}}"] = '\n'.join(recommendations_html)
        
        # Maturity stage indicators
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
        """Generate executive-focused dashboard"""
        print("🚀 Starting DII 4.0 Executive Dashboard generation...")
        print("📍 Including Spain + LATAM coverage")
        
        # Load data
        data = self.load_weekly_intelligence_data()
        if not data:
            return
        
        # Check for Spain data
        incidents = data.get('incidents', [])
        spain_incidents = [inc for inc in incidents if inc.get('country') == 'España']
        
        if not spain_incidents:
            print("⚠️  WARNING: No Spain incidents found!")
            print("💡 Use the Spain research addendum to gather Spanish intelligence")
        
        # Populate template
        dashboard_html = self.populate_template(data)
        
        # Ensure output directory exists
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)
        
        # Save dashboard
        output_file = os.path.join(self.output_dir, f"immunity-dashboard-{self.week_date}.html")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(dashboard_html)
        
        print(f"✅ Executive dashboard generated: {output_file}")
        
        # Print summary
        print(f"\n📊 Dashboard Summary:")
        print(f"   - Date: {self.week_date}")
        print(f"   - Coverage: LATAM + España")
        print(f"   - Spain incidents: {len(spain_incidents)}")
        print(f"   - Total incidents: {len(incidents)}")
        print(f"   - Focus: Executive conversations")
        
        print("\n💡 Ready for commercial team to engage C-levels!")

if __name__ == "__main__":
    generator = DIIv4ExecutiveDashboardGenerator()
    generator.generate_dashboard()