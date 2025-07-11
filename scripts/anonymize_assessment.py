#!/usr/bin/env python3
"""
Anonimizador de Assessments de Ciberseguridad
Elimina datos sensibles pero conserva métricas ejecutivas para análisis LATAM
"""

import pandas as pd
import numpy as np
from datetime import datetime
import hashlib
import argparse
import sys
from pathlib import Path
import json
import re

class AssessmentAnonymizer:
    def __init__(self):
        self.sensitive_columns = [
            'company_name', 'empresa', 'organization', 'organizacion',
            'contact_name', 'contacto', 'email', 'correo',
            'phone', 'telefono', 'address', 'direccion',
            'ip_address', 'ip', 'hostname', 'domain', 'dominio',
            'username', 'usuario', 'password', 'contraseña',
            'api_key', 'token', 'secret', 'credential'
        ]
        
        self.executive_metrics = [
            'risk_score', 'puntaje_riesgo', 'maturity_level', 'nivel_madurez',
            'compliance_percentage', 'porcentaje_cumplimiento',
            'vulnerabilities_critical', 'vulnerabilidades_criticas',
            'vulnerabilities_high', 'vulnerabilidades_altas',
            'incident_count', 'cantidad_incidentes',
            'mttr', 'tiempo_respuesta', 'investment', 'inversion',
            'sector', 'industry', 'industria', 'size', 'tamaño',
            'country', 'pais', 'region', 'control_score', 'puntaje_control'
        ]
        
        self.sectors_mapping = {
            'banca': 'Financial Services',
            'banco': 'Financial Services',
            'fintech': 'Financial Services',
            'retail': 'Retail',
            'comercio': 'Retail',
            'salud': 'Healthcare',
            'gobierno': 'Government',
            'telecomunicaciones': 'Telecommunications',
            'telco': 'Telecommunications',
            'manufactura': 'Manufacturing',
            'energia': 'Energy',
            'transporte': 'Transportation',
            'educacion': 'Education',
            'tecnologia': 'Technology'
        }

    def anonymize_company_name(self, name):
        """Genera un ID único pero consistente para cada empresa"""
        if pd.isna(name):
            return "COMPANY_NA"
        
        hash_obj = hashlib.md5(str(name).lower().encode())
        return f"COMPANY_{hash_obj.hexdigest()[:8].upper()}"

    def anonymize_email(self, email):
        """Anonimiza email manteniendo el dominio genérico"""
        if pd.isna(email) or '@' not in str(email):
            return "anonymous@example.com"
        
        domain = str(email).split('@')[1]
        if any(corp in domain.lower() for corp in ['gmail', 'hotmail', 'outlook', 'yahoo']):
            return "user@publicmail.com"
        else:
            return "user@corporate.com"

    def anonymize_ip(self, ip):
        """Anonimiza IPs manteniendo el rango de red"""
        if pd.isna(ip):
            return "0.0.0.0"
        
        ip_parts = str(ip).split('.')
        if len(ip_parts) == 4:
            return f"{ip_parts[0]}.{ip_parts[1]}.0.0"
        return "0.0.0.0"

    def normalize_sector(self, sector):
        """Normaliza sectores para análisis regional"""
        if pd.isna(sector):
            return "Other"
        
        sector_lower = str(sector).lower().strip()
        for key, value in self.sectors_mapping.items():
            if key in sector_lower:
                return value
        return str(sector).title()

    def calculate_risk_category(self, score):
        """Categoriza el riesgo para análisis ejecutivo"""
        if pd.isna(score):
            return "Unknown"
        
        try:
            score = float(score)
            if score >= 80:
                return "Critical"
            elif score >= 60:
                return "High"
            elif score >= 40:
                return "Medium"
            elif score >= 20:
                return "Low"
            else:
                return "Very Low"
        except:
            return "Unknown"

    def anonymize_dataframe(self, df):
        """Anonimiza el DataFrame completo"""
        df_anon = df.copy()
        
        # Identificar columnas sensibles
        for col in df_anon.columns:
            col_lower = col.lower()
            
            # Anonimizar columnas sensibles
            if any(sensitive in col_lower for sensitive in self.sensitive_columns):
                if 'company' in col_lower or 'empresa' in col_lower or 'organization' in col_lower:
                    df_anon[col] = df_anon[col].apply(self.anonymize_company_name)
                elif 'email' in col_lower or 'correo' in col_lower:
                    df_anon[col] = df_anon[col].apply(self.anonymize_email)
                elif 'ip' in col_lower:
                    df_anon[col] = df_anon[col].apply(self.anonymize_ip)
                elif any(term in col_lower for term in ['name', 'nombre', 'contact', 'contacto']):
                    df_anon[col] = df_anon[col].apply(lambda x: f"USER_{np.random.randint(1000, 9999)}" if pd.notna(x) else "USER_NA")
                else:
                    # Eliminar completamente otros datos sensibles
                    df_anon[col] = "REDACTED"
            
            # Normalizar sectores
            elif 'sector' in col_lower or 'industry' in col_lower or 'industria' in col_lower:
                df_anon[col] = df_anon[col].apply(self.normalize_sector)
            
            # Agregar categorías de riesgo
            elif 'risk_score' in col_lower or 'puntaje_riesgo' in col_lower:
                risk_cat_col = col + '_category'
                df_anon[risk_cat_col] = df_anon[col].apply(self.calculate_risk_category)
        
        return df_anon

    def add_executive_summary(self, df):
        """Agrega métricas ejecutivas al DataFrame"""
        summary = {}
        
        # Buscar columnas de métricas
        for col in df.columns:
            col_lower = col.lower()
            
            # Calcular estadísticas para métricas numéricas
            if any(metric in col_lower for metric in self.executive_metrics):
                if df[col].dtype in ['int64', 'float64']:
                    summary[f"{col}_mean"] = df[col].mean()
                    summary[f"{col}_median"] = df[col].median()
                    summary[f"{col}_std"] = df[col].std()
                    summary[f"{col}_min"] = df[col].min()
                    summary[f"{col}_max"] = df[col].max()
        
        # Análisis por sector si existe
        sector_cols = [col for col in df.columns if any(term in col.lower() for term in ['sector', 'industry', 'industria'])]
        if sector_cols:
            sector_col = sector_cols[0]
            risk_cols = [col for col in df.columns if 'risk' in col.lower() or 'riesgo' in col.lower()]
            
            if risk_cols and df[risk_cols[0]].dtype in ['int64', 'float64']:
                risk_col = risk_cols[0]
                sector_analysis = df.groupby(sector_col)[risk_col].agg(['mean', 'count']).to_dict()
                summary['sector_analysis'] = sector_analysis
        
        return summary

    def process_file(self, input_file, output_file):
        """Procesa el archivo XLSX"""
        try:
            # Leer todas las hojas
            excel_file = pd.ExcelFile(input_file)
            
            with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
                executive_summaries = {}
                
                for sheet_name in excel_file.sheet_names:
                    print(f"Procesando hoja: {sheet_name}")
                    df = pd.read_excel(excel_file, sheet_name=sheet_name)
                    
                    # Anonimizar datos
                    df_anon = self.anonymize_dataframe(df)
                    
                    # Generar resumen ejecutivo
                    summary = self.add_executive_summary(df_anon)
                    executive_summaries[sheet_name] = summary
                    
                    # Guardar hoja anonimizada
                    df_anon.to_excel(writer, sheet_name=sheet_name, index=False)
                
                # Agregar hoja de resumen ejecutivo
                summary_data = []
                for sheet, metrics in executive_summaries.items():
                    for metric, value in metrics.items():
                        if not isinstance(value, dict):
                            summary_data.append({
                                'Sheet': sheet,
                                'Metric': metric,
                                'Value': value
                            })
                
                if summary_data:
                    summary_df = pd.DataFrame(summary_data)
                    summary_df.to_excel(writer, sheet_name='Executive_Summary', index=False)
            
            # Guardar resumen en JSON
            json_output = output_file.replace('.xlsx', '_summary.json')
            with open(json_output, 'w', encoding='utf-8') as f:
                json.dump(executive_summaries, f, indent=2, default=str)
            
            print(f"\n✅ Archivo anonimizado guardado en: {output_file}")
            print(f"📊 Resumen ejecutivo guardado en: {json_output}")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Error procesando archivo: {str(e)}")
            return False

def main():
    parser = argparse.ArgumentParser(
        description='Anonimiza archivos XLSX de assessments de ciberseguridad'
    )
    parser.add_argument(
        'input_file',
        help='Archivo XLSX de entrada con datos de assessment'
    )
    parser.add_argument(
        '-o', '--output',
        help='Archivo de salida (por defecto: input_file_anonymized.xlsx)',
        default=None
    )
    
    args = parser.parse_args()
    
    # Validar archivo de entrada
    input_path = Path(args.input_file)
    if not input_path.exists():
        print(f"❌ Error: No se encuentra el archivo {args.input_file}")
        sys.exit(1)
    
    if not input_path.suffix.lower() == '.xlsx':
        print(f"❌ Error: El archivo debe ser formato XLSX")
        sys.exit(1)
    
    # Definir archivo de salida
    if args.output:
        output_path = Path(args.output)
    else:
        output_path = input_path.parent / f"{input_path.stem}_anonymized.xlsx"
    
    # Procesar archivo
    print(f"\n🔐 Anonimizando assessment: {input_path}")
    print(f"📁 Archivo de salida: {output_path}\n")
    
    anonymizer = AssessmentAnonymizer()
    success = anonymizer.process_file(str(input_path), str(output_path))
    
    if success:
        print("\n✨ Proceso completado exitosamente!")
        print("\nMétricas ejecutivas preservadas:")
        print("- Puntajes de riesgo y madurez")
        print("- Estadísticas de vulnerabilidades")
        print("- Análisis por sector/industria")
        print("- Tendencias regionales LATAM")
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()