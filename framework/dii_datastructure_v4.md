# Digital Immunity Index 4.0 - Estructura de Datos
## Modelo de Recolección para Quick Assessment y Assessment Formal

### Fórmula General del Modelo

#### 1. DII Raw (Cálculo Base)
```
DII Raw = (TRD × AER) / (HFP × BRI × RRG)
```

#### 2. DII Score (Normalizado 1-10)
```
DII Score = (DII Raw / DII Base del Modelo) × 10
```

#### 3. Interpretación
```
DII Score = Capacidad operacional relativa a su modelo de negocio
< 4.0 = Frágil (70%+ pérdida operacional en incidentes)
4.0-6.0 = Robusto (40-70% pérdida operacional)
6.0-8.0 = Resiliente (15-40% pérdida operacional)
> 8.0 = Adaptativo (<15% pérdida operacional)
```

---

## A. QUICK ASSESSMENT ONLINE (30 minutos)

### A.1 Datos de Clasificación (6 campos esenciales)

| Campo | Descripción | Cómo se pregunta | Validación |
|-------|-------------|------------------|------------|
| **business_model** | Modelo de negocio (1-8) | "¿Cuál describe mejor su modelo?" + 8 opciones | 1-8 |
| **digital_dependency** | % operaciones dependientes digitales | "¿Qué % de sus operaciones críticas requiere sistemas digitales?" | 0-100 |
| **employee_count** | Empleados con acceso sistemas | "¿Cuántos empleados tienen acceso a sistemas corporativos?" | > 0 |
| **annual_revenue_usd** | Ingresos anuales en USD | "Rango de ingresos anuales" (rangos predefinidos) | Lista |
| **industry_sector** | Sector industrial | Dropdown con 12 sectores principales | Lista |
| **country** | País de operación principal | Dropdown países LATAM + España + otros | ISO |

### A.2 Datos por Dimensión (1 pregunta clave por dimensión)

#### **CATEGORÍA PREVENCIÓN**

| Dimensión | Campo | Pregunta Directa | Opciones | Default por Modelo |
|-----------|-------|------------------|----------|-------------------|
| **AER** | attack_cost_ratio | "Si un atacante invierte $10K, ¿cuánto valor podría extraer?" | $1K / $10K / $50K / $100K / $500K+ | Según modelo |
| **HFP** | phishing_failure_rate | "En su última prueba de phishing, ¿qué % de empleados falló?" | 0-10% / 10-20% / 20-40% / 40%+ / No hemos probado | 25% |
| **BRI** | critical_reach_percent | "Si comprometen 1 PC de usuario, ¿a qué % de sistemas críticos podrían acceder?" | 0-20% / 20-50% / 50-80% / 80%+ | 70% |

#### **CATEGORÍA RESILIENCIA**

| Dimensión | Campo | Pregunta Directa | Opciones | Default por Modelo |
|-----------|-------|------------------|----------|-------------------|
| **TRD** | revenue_impact_hours | "Si sus sistemas principales fallan, ¿en cuántas HORAS pierde 10% de capacidad?" | <2h / 2-6h / 6-24h / 24-72h / >72h | Por modelo |
| **RRG** | recovery_multiplier | "Su plan dice recuperar en X horas. En la realidad, ¿cuánto más tarda?" | Igual / 2x / 3x / 5x+ / No tenemos plan | 3x |

### A.3 Cálculo Quick Assessment

```python
# 1. Determinar DII Base según modelo
dii_base_ranges = {
    1: (1.5, 2.0),  # Comercio Híbrido
    2: (0.8, 1.2),  # Software Crítico
    3: (0.5, 0.9),  # Servicios de Datos
    4: (0.4, 0.8),  # Ecosistema Digital
    5: (0.2, 0.6),  # Servicios Financieros
    6: (0.2, 0.5),  # Infraestructura Heredada
    7: (0.4, 0.8),  # Cadena de Suministro
    8: (0.4, 0.7),  # Información Regulada
}

# 2. Calcular DII Raw
dii_raw = (trd * aer) / (hfp * bri * rrg)

# 3. Normalizar a escala 1-10
dii_base_avg = sum(dii_base_ranges[model]) / 2
dii_score = (dii_raw / dii_base_avg) * 10

# 4. Aplicar límites
dii_score = max(1.0, min(10.0, dii_score))
```

### A.4 Output Quick Assessment

```json
{
  "assessment_type": "quick",
  "dii_score": 5.2,
  "maturity_stage": "Robusto",
  "percentile": 45,
  "weakest_category": "prevention",
  "top_3_actions": [
    "Implementar capacitación anti-phishing mensual",
    "Segmentar red para reducir blast radius",
    "Automatizar 50% del proceso de recuperación"
  ],
  "benchmark": {
    "model_average": 4.8,
    "industry_top_25": 6.0
  }
}
```

---

## B. ASSESSMENT FORMAL (2-5 días)

### B.1 Datos de Clasificación Extendidos

| Campo | Tipo | Descripción | Fuente Típica | Obligatorio |
|-------|------|-------------|---------------|-------------|
| **organization_name** | String | Razón social completa | Registro legal | Sí |
| **business_model** | Integer | Modelo (1-8) | Entrevista CEO/CFO | Sí |
| **digital_dependency** | Decimal | % exacto operaciones digitales | Mapeo procesos + CFO | Sí |
| **employee_count** | Integer | Total con acceso sistemas | RRHH + Active Directory | Sí |
| **annual_revenue_usd** | Decimal | Ingresos exactos último año | Estados financieros | Sí |
| **industry_sector** | String | Sector principal LATAM | Clasificación industrial | Sí |
| **sub_sector** | String | Sub-sector específico | Análisis detallado | No |
| **country** | String | País sede principal | Registro legal | Sí |
| **countries_operation** | Array | Todos los países con operación | Estructura corporativa | Sí |
| **critical_operations_count** | Integer | # procesos críticos identificados | BIA completo | Sí |
| **it_budget_percent** | Decimal | % ingresos en TI | CFO/Presupuesto | Sí |
| **security_budget_percent** | Decimal | % presupuesto TI en seguridad | CISO/Presupuesto | Sí |
| **compliance_requirements** | Array | Normativas aplicables | Legal/Compliance | Sí |

### B.2 Mediciones Detalladas por Dimensión

#### **B.2.1 Attack Economics Ratio (AER)**

| Campo | Descripción | Fuente de Datos | Validación |
|-------|-------------|-----------------|------------|
| **aer_attack_types** | Tipos de ataque más probables | Threat Intelligence | Lista enum |
| **aer_attack_cost_breakdown** | Desglose costos por tipo ataque | Red team quotes + benchmarks | JSON |
| **aer_accessible_data_value** | Valor datos accesibles | Clasificación datos + valuación | $USD |
| **aer_accessible_systems_value** | Valor disrupción sistemas | BIA + análisis financiero | $USD |
| **aer_reputation_value** | Valor reputacional en riesgo | Marketing + histórico sector | $USD |
| **aer_total_accessible_value** | Suma todos los valores | Cálculo automático | $USD |
| **aer_average_attack_cost** | Costo promedio ponderado | Análisis por tipo | $USD |
| **aer_ratio_calculated** | Ratio final | attack_cost / accessible_value | Decimal |

**Validaciones AER**:
- Ratio debe estar entre 0.01 y 50.0
- Si ratio > 10, requiere justificación (ej: honeypots, deception)
- Si ratio < 0.1, alerta de target atractivo

#### **B.2.2 Human Failure Probability (HFP)**

| Campo | Descripción | Fuente de Datos | Validación |
|-------|-------------|-----------------|------------|
| **hfp_phishing_campaigns** | Histórico campañas últimos 12m | Security Awareness platform | Array |
| **hfp_average_failure_rate** | Tasa promedio fallo | Promedio ponderado campañas | % |
| **hfp_improvement_trend** | Tendencia mejora/empeora | Análisis temporal | % cambio |
| **hfp_high_privilege_failure** | Tasa fallo usuarios privilegiados | Segmentación por rol | % |
| **hfp_department_breakdown** | Desglose por departamento | Análisis detallado | JSON |
| **hfp_training_frequency** | Frecuencia entrenamiento | Plan de capacitación | Enum |
| **hfp_simulated_attacks** | Ataques simulados realizados | Red team internos | Número |
| **hfp_monthly_probability** | Probabilidad mensual final | Fórmula compuesta | % |

**Fórmula HFP Detallada**:
```python
# Base calculation
base_hfp = 1 - (1 - daily_rate)^(employees * 30)

# Adjustments
if high_privilege_failure > average_failure:
    hfp *= 1.2  # 20% peor si privilegiados fallan más

if improvement_trend < -10:  # Mejorando
    hfp *= 0.9
elif improvement_trend > 10:  # Empeorando
    hfp *= 1.1
```

#### **B.2.3 Blast Radius Index (BRI)**

| Campo | Descripción | Fuente de Datos | Validación |
|-------|-------------|-----------------|------------|
| **bri_network_segmentation** | Nivel de segmentación | Arquitectura de red | Score 1-5 |
| **bri_identity_architecture** | Madurez Zero Trust | Assessment IAM | Score 1-5 |
| **bri_lateral_movement_paths** | Rutas de movimiento lateral | Pentest + BloodHound | Número |
| **bri_privileged_access_mgmt** | Madurez PAM | Evaluación controles | Score 1-5 |
| **bri_critical_systems_isolated** | % sistemas críticos aislados | Mapeo arquitectura | % |
| **bri_average_reach_from_user** | Alcance promedio desde usuario | Simulación/pentest | % |
| **bri_average_reach_from_server** | Alcance promedio desde servidor | Simulación/pentest | % |
| **bri_worst_case_reach** | Peor caso documentado | Histórico incidentes | % |
| **bri_index_calculated** | Índice final ponderado | Promedio ponderado | Decimal |

**Ponderación BRI**:
- Alcance desde usuario: 40%
- Alcance desde servidor: 30%
- Peor caso histórico: 20%
- Ajuste por controles: 10%

#### **B.2.4 Time to Revenue Degradation (TRD)**

| Campo | Descripción | Fuente de Datos | Validación |
|-------|-------------|-----------------|------------|
| **trd_critical_dependencies** | Dependencias críticas mapeadas | BIA + mapeo servicios | JSON |
| **trd_dependency_recovery_times** | Tiempo recuperación por dependencia | DR plans + SLAs | JSON |
| **trd_historical_incidents** | Incidentes históricos analizados | Incident reports | Array |
| **trd_simulated_scenarios** | Escenarios simulados | Tabletop exercises | Array |
| **trd_revenue_per_hour** | Ingresos por hora promedio | CFO/Finanzas | $USD |
| **trd_degradation_curve** | Curva de degradación | Análisis histórico | JSON |
| **trd_10_percent_impact_hours** | Horas hasta 10% impacto | Cálculo/simulación | Horas |
| **trd_confidence_level** | Nivel de confianza | Método usado | % |

**Niveles de Confianza TRD**:
- Basado en incidente real reciente: 90%
- Basado en simulación/tabletop: 70%
- Basado en estimación experta: 50%
- Sin data, usando benchmark: 30%

#### **B.2.5 Recovery Reality Gap (RRG)**

| Campo | Descripción | Fuente de Datos | Validación |
|-------|-------------|-----------------|------------|
| **rrg_documented_rto** | RTO documentado promedio | DR Plans | Horas |
| **rrg_last_test_date** | Fecha último test completo | DR test reports | Fecha |
| **rrg_test_success_rate** | Tasa éxito pruebas DR | Histórico pruebas | % |
| **rrg_partial_test_results** | Resultados pruebas parciales | Test reports | Array |
| **rrg_real_incident_history** | Historial incidentes reales | Incident database | Array |
| **rrg_average_real_recovery** | Promedio real de recuperación | Análisis histórico | Horas |
| **rrg_automation_level** | Nivel automatización recovery | Assessment técnico | Score 1-5 |
| **rrg_gap_calculated** | Gap calculado | real / documented | Factor |

**Ajustes RRG**:
```python
base_rrg = average_real / documented_rto

# Penalizaciones
if last_test_date > 365 days:
    rrg *= 1.5  # Sin pruebas recientes
    
if test_success_rate < 50%:
    rrg *= 1.3  # Pruebas fallan frecuentemente
    
if automation_level < 2:
    rrg *= 1.2  # Proceso manual

# Mínimo RRG = 1.0 (nunca mejor que documentado)
rrg = max(1.0, rrg)
```

### B.3 Datos de Contexto y Validación

| Campo | Descripción | Uso | Obligatorio |
|-------|-------------|-----|-------------|
| **last_major_incident_date** | Fecha último incidente mayor | Validar TRD/RRG | No |
| **last_major_incident_impact** | Impacto del incidente | Validar dimensiones | No |
| **insurance_cyber_coverage** | Cobertura seguro cyber | Contexto AER | Sí |
| **insurance_requirements** | Requisitos del seguro | Validar controles | No |
| **regulatory_penalties_risk** | Riesgo multas regulatorias | Ajustar AER | Sí |
| **business_continuity_maturity** | Madurez BCP | Validar TRD | Sí |
| **crisis_management_maturity** | Madurez gestión crisis | Ajustar RRG | Sí |
| **supply_chain_dependencies** | Dependencias cadena suministro | Contexto BRI | Sí |
| **cloud_adoption_level** | Nivel adopción cloud | Contexto general | Sí |
| **legacy_systems_percent** | % sistemas legacy | Ajustar todas | Sí |

### B.4 Tablas de Normalización y Benchmarks

#### **DII Base por Modelo de Negocio (Actualizado)**

| ID | Modelo | DII Base Min | DII Base Max | DII Base Avg | Justificación |
|----|--------|--------------|--------------|--------------|---------------|
| 1 | Comercio Híbrido | 1.5 | 2.0 | 1.75 | Redundancia natural física |
| 2 | Software Crítico | 0.8 | 1.2 | 1.00 | Balance riesgo-resiliencia |
| 3 | Servicios de Datos | 0.5 | 0.9 | 0.70 | Alta dependencia digital |
| 4 | Ecosistema Digital | 0.4 | 0.8 | 0.60 | Complejidad extrema |
| 5 | Servicios Financieros | 0.2 | 0.6 | 0.40 | Máxima exposición |
| 6 | Infraestructura Heredada | 0.2 | 0.5 | 0.35 | Deuda técnica crítica |
| 7 | Cadena de Suministro | 0.4 | 0.8 | 0.60 | Dependencias múltiples |
| 8 | Información Regulada | 0.4 | 0.7 | 0.55 | Compliance + ataques |

#### **Factores de Ajuste Sectorial**

| Sector | Factor | Razón | Aplicación |
|--------|--------|-------|------------|
| Gobierno | 0.8x | Alta exposición, recursos limitados | Multiplicar DII final |
| Salud | 0.85x | Crítico + legacy + regulación | Multiplicar DII final |
| Financiero | 0.9x | Regulación estricta pero recursos | Multiplicar DII final |
| Retail | 1.1x | Múltiples canales dan resiliencia | Multiplicar DII final |
| Manufactura | 1.15x | Sistemas OT proveen redundancia | Multiplicar DII final |
| Tecnología | 0.95x | Alta dependencia pero agilidad | Multiplicar DII final |
| Educación | 1.2x | Tolerancia a interrupciones | Multiplicar DII final |
| Energía/Utilities | 0.7x | Infraestructura crítica nacional | Multiplicar DII final |

### B.5 Cálculos Finales y Resultados

```python
# 1. Calcular cada dimensión con data detallada
aer = calculate_aer(attack_cost, accessible_value)
hfp = calculate_hfp(failure_rate, employees, adjustments)
bri = calculate_bri(reach_percentages, segmentation_scores)
trd = calculate_trd(dependency_times, historical_data)
rrg = calculate_rrg(documented_rto, real_recovery, test_history)

# 2. Calcular DII Raw
dii_raw = (trd * aer) / (hfp * bri * rrg)

# 3. Obtener DII Base para el modelo
dii_base = get_dii_base_average(business_model)

# 4. Normalizar a escala 1-10
dii_score = (dii_raw / dii_base) * 10

# 5. Aplicar factor sectorial
sector_factor = get_sector_factor(industry_sector)
dii_score_adjusted = dii_score * sector_factor

# 6. Aplicar límites
dii_final = max(1.0, min(10.0, dii_score_adjusted))

# 7. Calcular percentil
percentile = calculate_percentile(dii_final, business_model, country)
```

### B.6 Estructura de Output Assessment Formal

```json
{
  "assessment_id": "uuid",
  "assessment_type": "formal",
  "assessment_date": "2025-01-15",
  "organization": {
    "name": "Empresa XYZ S.A.",
    "model": "Servicios Financieros",
    "model_id": 5,
    "country": "CO",
    "sector": "Financiero"
  },
  "dii_scores": {
    "raw": 0.42,
    "normalized": 5.2,
    "adjusted": 4.7,
    "final": 4.7,
    "stage": "Robusto",
    "stage_id": 2
  },
  "dimensions": {
    "prevention": {
      "aer": {
        "value": 0.15,
        "percentile": 25,
        "benchmark": 0.35
      },
      "hfp": {
        "value": 0.68,
        "percentile": 40,
        "benchmark": 0.55
      },
      "bri": {
        "value": 0.75,
        "percentile": 30,
        "benchmark": 0.60
      }
    },
    "resilience": {
      "trd": {
        "value": 6.5,
        "percentile": 45,
        "benchmark": 12.0
      },
      "rrg": {
        "value": 3.2,
        "percentile": 50,
        "benchmark": 3.0
      }
    }
  },
  "weakest_factors": [
    {
      "dimension": "aer",
      "gap": -57.1,
      "impact": "Alta probabilidad de ser target"
    },
    {
      "dimension": "bri", 
      "gap": -25.0,
      "impact": "Compromiso se expande rápidamente"
    }
  ],
  "benchmarks": {
    "model_average": 3.5,
    "model_top_25": 4.8,
    "model_top_10": 6.0,
    "sector_average": 3.8,
    "regional_average": 4.2
  },
  "recommendations": {
    "immediate": [
      {
        "action": "Implementar micro-segmentación red",
        "impact": "+0.8 DII",
        "effort": "3 meses",
        "investment": "$150K"
      }
    ],
    "short_term": [...],
    "long_term": [...]
  },
  "risk_scenarios": [
    {
      "scenario": "Ransomware via phishing",
      "probability": "Muy Alta",
      "current_impact": "72h downtime, $2.5M pérdida",
      "post_improvement": "24h downtime, $800K pérdida"
    }
  ]
}
```

---

## C. Validaciones y Controles de Calidad

### C.1 Validaciones para Quick Assessment

| Validación | Regla | Acción si falla |
|------------|-------|-----------------|
| Coherencia modelo-digital | FinTech no puede tener <80% digital | Alertar y solicitar confirmación |
| Rangos esperados | TRD no puede ser >168h para FinTech | Usar máximo del modelo |
| Extremos sospechosos | DII >9.0 o <2.0 | Recomendar assessment formal |
| Consistencia lógica | Si no hay plan DR, RRG mínimo 5x | Auto-ajustar a 5x |

### C.2 Validaciones para Assessment Formal

| Validación | Regla | Acción si falla |
|------------|-------|-----------------|
| **Coherencia temporal** | RRG nunca menor a 1.0 | Forzar a 1.0 con warning |
| **Realismo HFP** | Entre 5% y 95% mensual | Solicitar evidencia adicional |
| **Lógica BRI** | Si Zero Trust completo, máximo 20% | Validar arquitectura |
| **Racionalidad AER** | Ratio entre 0.01 y 50 | Revisar cálculos con cliente |
| **Consistencia TRD** | Coherente con modelo negocio ±50% | Deep dive en dependencias |
| **Datos históricos** | Al menos 1 incidente o simulación | Requerir tabletop mínimo |

### C.3 Reglas de Negocio Críticas

1. **Evolución máxima por período**:
   - Quick Assessment: No aplica
   - Entre assessments formales: Máximo ±2.0 puntos DII

2. **Correlaciones esperadas**:
   - Si legacy_systems > 60%, entonces RRG > 2.5
   - Si cloud_adoption > 80%, entonces BRI debe mejorar
   - Si no hay CISO, entonces HFP peor que promedio

3. **Banderas rojas automáticas**:
   - Gobierno/Salud con DII < 3.0 → Alerta crítica
   - FinTech con BRI > 50% → Revisión arquitectura urgente
   - Cualquier modelo con RRG > 5x → Crisis de recuperación

---

## D. Estructura de Base de Datos

### D.1 Tabla Principal: dii_assessments

```sql
CREATE TABLE dii_assessments (
    -- Identificación
    assessment_id UUID PRIMARY KEY,
    assessment_type ENUM('quick', 'formal') NOT NULL,
    assessment_date DATE NOT NULL,
    assessment_version VARCHAR(10) DEFAULT '4.0',
    
    -- Organización
    organization_id UUID,
    organization_name VARCHAR(255),
    business_model_id INTEGER NOT NULL CHECK (business_model_id BETWEEN 1 AND 8),
    digital_dependency DECIMAL(5,2) NOT NULL CHECK (digital_dependency BETWEEN 0 AND 100),
    employee_count INTEGER NOT NULL CHECK (employee_count > 0),
    annual_revenue_usd DECIMAL(15,2),
    industry_sector VARCHAR(50) NOT NULL,
    country_code CHAR(2) NOT NULL,
    
    -- Dimensiones (valores finales calculados)
    aer_value DECIMAL(6,4) NOT NULL,
    hfp_value DECIMAL(4,3) NOT NULL CHECK (hfp_value BETWEEN 0 AND 1),
    bri_value DECIMAL(4,3) NOT NULL CHECK (bri_value BETWEEN 0 AND 1),
    trd_value DECIMAL(6,2) NOT NULL CHECK (trd_value > 0),
    rrg_value DECIMAL(4,2) NOT NULL CHECK (rrg_value >= 1),
    
    -- Resultados
    dii_raw DECIMAL(6,4) NOT NULL,
    dii_normalized DECIMAL(4,2) NOT NULL,
    dii_adjusted DECIMAL(4,2) NOT NULL,
    dii_final DECIMAL(3,1) NOT NULL CHECK (dii_final BETWEEN 1.0 AND 10.0),
    maturity_stage_id INTEGER NOT NULL CHECK (maturity_stage_id BETWEEN 1 AND 4),
    weakest_category ENUM('prevention', 'resilience') NOT NULL,
    
    -- Metadata
    confidence_level DECIMAL(3,0) CHECK (confidence_level BETWEEN 0 AND 100),
    assessor_id UUID,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_organization (organization_id),
    INDEX idx_date (assessment_date),
    INDEX idx_model (business_model_id),
    INDEX idx_country (country_code),
    INDEX idx_score (dii_final)
);
```

### D.2 Tabla de Detalle: dii_dimension_details

```sql
CREATE TABLE dii_dimension_details (
    detail_id UUID PRIMARY KEY,
    assessment_id UUID NOT NULL,
    dimension_code ENUM('AER','HFP','BRI','TRD','RRG') NOT NULL,
    
    -- Datos crudos recolectados
    raw_data JSON NOT NULL,
    
    -- Cálculos intermedios
    intermediate_calculations JSON,
    
    -- Factores de ajuste aplicados
    adjustments_applied JSON,
    
    -- Resultado final
    final_value DECIMAL(10,4) NOT NULL,
    confidence_level DECIMAL(3,0),
    
    -- Contexto
    data_sources TEXT,
    calculation_notes TEXT,
    
    FOREIGN KEY (assessment_id) REFERENCES dii_assessments(assessment_id),
    UNIQUE KEY unique_assessment_dimension (assessment_id, dimension_code)
);
```

### D.3 Tabla de Benchmarks: dii_benchmarks

```sql
CREATE TABLE dii_benchmarks (
    benchmark_id UUID PRIMARY KEY,
    business_model_id INTEGER NOT NULL,
    industry_sector VARCHAR(50),
    country_code CHAR(2),
    
    -- Estadísticas
    sample_size INTEGER NOT NULL,
    dii_min DECIMAL(3,1),
    dii_p10 DECIMAL(3,1),
    dii_p25 DECIMAL(3,1),
    dii_median DECIMAL(3,1),
    dii_p75 DECIMAL(3,1),
    dii_p90 DECIMAL(3,1),
    dii_max DECIMAL(3,1),
    dii_mean DECIMAL(3,1),
    dii_stddev DECIMAL(3,1),
    
    -- Por dimensión
    aer_median DECIMAL(6,4),
    hfp_median DECIMAL(4,3),
    bri_median DECIMAL(4,3),
    trd_median DECIMAL(6,2),
    rrg_median DECIMAL(4,2),
    
    -- Metadata
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_model_sector_country (business_model_id, industry_sector, country_code)
);
```

### D.4 Tabla de Modelos: dii_business_models

```sql
CREATE TABLE dii_business_models (
    model_id INTEGER PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    model_description TEXT,
    dii_base_min DECIMAL(3,2) NOT NULL,
    dii_base_max DECIMAL(3,2) NOT NULL,
    dii_base_avg DECIMAL(3,2) NOT NULL,
    risk_multiplier DECIMAL(3,1) NOT NULL,
    typical_digital_dependency_min INTEGER,
    typical_digital_dependency_max INTEGER,
    typical_tolerance_hours_min INTEGER,
    typical_tolerance_hours_max INTEGER,
    change_velocity ENUM('Baja','Media','Alta'),
    regulatory_impact ENUM('Bajo','Medio','Alto'),
    examples_latam TEXT
);

-- Datos iniciales
INSERT INTO dii_business_models VALUES
(1,'Comercio Híbrido','Operaciones físicas + canal digital',1.5,2.0,1.75,1.0,30,60,24,48,'Baja','Bajo','Falabella,Liverpool,Cencosud'),
(2,'Software Crítico','Soluciones cloud esenciales',0.8,1.2,1.0,1.5,70,90,6,24,'Media','Medio','Siigo,ContPAQi,Aspel'),
-- ... etc para los 8 modelos
```

---

## E. APIs y Endpoints

### E.1 Endpoints RESTful

```
# Assessment
POST   /api/v4/dii/assessments/quick          # Quick assessment (30 min)
POST   /api/v4/dii/assessments/formal         # Iniciar formal assessment
GET    /api/v4/dii/assessments/{id}           # Obtener resultado
PUT    /api/v4/dii/assessments/{id}           # Actualizar assessment formal

# Benchmarks
GET    /api/v4/dii/benchmarks                 # Listar todos los benchmarks
GET    /api/v4/dii/benchmarks/model/{id}      # Benchmark por modelo
GET    /api/v4/dii/benchmarks/compare         # Comparar con industria

# Recomendaciones
GET    /api/v4/dii/recommendations/{assessment_id}  # Recomendaciones personalizadas
POST   /api/v4/dii/recommendations/simulate         # Simular mejoras

# Reportes
GET    /api/v4/dii/reports/{assessment_id}/executive    # Reporte ejecutivo
GET    /api/v4/dii/reports/{assessment_id}/technical    # Reporte técnico
GET    /api/v4/dii/reports/{assessment_id}/roadmap      # Roadmap de mejora
```

### E.2 Ejemplo Request/Response Quick Assessment

**Request:**
```json
POST /api/v4/dii/assessments/quick
{
  "business_model": 5,
  "digital_dependency": 95,
  "employee_count": 500,
  "annual_revenue_range": "10M-50M",
  "industry_sector": "Financiero",
  "country": "CO",
  "dimensions": {
    "aer": {"attack_cost_ratio": "100K"},
    "hfp": {"phishing_failure_rate": "20-40%"},
    "bri": {"critical_reach_percent": "50-80%"},
    "trd": {"revenue_impact_hours": "2-6h"},
    "rrg": {"recovery_multiplier": "3x"}
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assessment_id": "550e8400-e29b-41d4-a716-446655440001",
    "dii_score": 4.7,
    "maturity_stage": "Robusto",
    "maturity_description": "Función parcialmente mantenida bajo ataque",
    "percentile": 42,
    "interpretation": {
      "executive": "Su organización mantiene 47% de capacidad operacional durante ataques, ligeramente mejor que el promedio del sector (45%)",
      "risk": "Vulnerabilidad principal en prevención: alta exposición económica para atacantes",
      "opportunity": "Mejorar a nivel Resiliente (DII 6.0+) reduciría pérdidas potenciales en $1.2M anuales"
    },
    "quick_wins": [
      {
        "action": "Implementar MFA resistente a phishing",
        "impact": "+0.5 DII",
        "time": "2 semanas",
        "cost": "$15K"
      },
      {
        "action": "Segmentar red de pagos",
        "impact": "+0.8 DII", 
        "time": "1 mes",
        "cost": "$50K"
      }
    ],
    "next_steps": {
      "immediate": "Agendar Assessment Formal para plan detallado",
      "url": "/api/v4/dii/assessments/formal/schedule"
    }
  }
}
```

### E.3 Webhooks y Notificaciones

```json
{
  "webhook_events": [
    "assessment.completed",
    "assessment.updated", 
    "benchmark.updated",
    "risk.threshold.exceeded"
  ],
  "notification_rules": [
    {
      "condition": "dii_score < 4.0",
      "severity": "critical",
      "recipients": ["ciso", "ceo"]
    },
    {
      "condition": "weakest_category == 'prevention' AND model IN (5,8)",
      "severity": "high",
      "recipients": ["ciso", "compliance"]
    }
  ]
}
```

---

## F. Guías de Implementación

### F.1 Para Quick Assessment (Web Form)

1. **Flujo de Usuario**:
   - Página 1: Clasificación (modelo, país, sector)
   - Página 2: 5 preguntas de dimensiones
   - Página 3: Resultado inmediato con score y top 3 acciones

2. **Validaciones Frontend**:
   - Consistencia modelo vs digital dependency
   - Rangos válidos por pregunta
   - Ayuda contextual por modelo de negocio

3. **Cálculo Backend**:
   - Usar valores medios de rangos seleccionados
   - Aplicar defaults del modelo si es necesario
   - Comparar con percentiles pre-calculados

### F.2 Para Assessment Formal (Consultoría)

1. **Fase 1: Recolección (1-2 días)**
   - Entrevistas con stakeholders clave
   - Revisión documentación (BIA, DR, Pentest)
   - Análisis data histórica

2. **Fase 2: Validación (1 día)**
   - Cruce de información
   - Resolución de inconsistencias
   - Confirmación de supuestos

3. **Fase 3: Análisis (1 día)**
   - Cálculo detallado por dimensión
   - Comparación con benchmarks
   - Generación de escenarios

4. **Fase 4: Reporte (1 día)**
   - Presentación ejecutiva
   - Roadmap priorizado
   - Business case para inversiones

### F.3 Mantenimiento de Benchmarks

```sql
-- Actualización mensual de benchmarks
INSERT INTO dii_benchmarks (
    business_model_id,
    industry_sector,
    country_code,
    sample_size,
    dii_median,
    -- ... otros campos
    period_start,
    period_end
)
SELECT 
    business_model_id,
    industry_sector,
    country_code,
    COUNT(*) as sample_size,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY dii_final) as dii_median,
    -- ... otros percentiles
    DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'),
    DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day'
FROM dii_assessments
WHERE assessment_date >= CURRENT_DATE - INTERVAL '12 months'
  AND assessment_type = 'formal'
  AND confidence_level >= 70
GROUP BY business_model_id, industry_sector, country_code
HAVING COUNT(*) >= 5;  -- Mínimo 5 muestras para benchmark válido
```

---

*Digital Immunity Index 4.0 - Estructura de Datos*  
*Diseñada para Quick Assessment (30 min) y Formal Assessment (2-5 días)*  
*Escala unificada 1-10 para continuidad con versión 3.0*