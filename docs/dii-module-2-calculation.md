# Digital Immunity Index 4.0 - Módulo 2: Cálculo
## Motor Matemático para Resiliencia Digital

**Archivo**: `DII-4.0-Module-2-Calculation.md`  
**Versión**: 4.0  
**Última actualización**: Enero 2025  
**Dependencias**: `DII-4.0-Foundation.md`, `DII-4.0-Module-1-BusinessModels.md`

### Contexto del Framework DII 4.0

El Digital Immunity Index (DII) 4.0 es un framework modular que mide la capacidad de una organización para **mantener su valor de negocio mientras opera bajo ataque cibernético activo**.

**Evolución clave**: Ya no medimos solo continuidad operacional, sino el impacto holístico en el negocio - incluyendo pérdida de confianza, multas regulatorias, ventaja competitiva y capacidad operacional.

**Arquitectura Modular del DII 4.0**:
1. **Módulo de Modelos de Negocio** - Clasificación por arquetipos de valor
2. **Módulo de Cálculo** (este documento) - Motor matemático de las 5 dimensiones
3. **Módulo de Madurez** - Interpretación en 4 estadios (Frágil/Robusto/Resiliente/Adaptativo)
4. **Módulo de Benchmarking** - Comparación contextual por arquetipo y región

### Principio del Módulo de Cálculo

El Módulo de Cálculo es el motor matemático del DII 4.0. Transforma datos operacionales en un índice único que los ejecutivos pueden usar para decisiones estratégicas. Es agnóstico al contexto - la inteligencia interpretativa reside en otros módulos.

**Filosofía**: "Precisión matemática al servicio de la claridad ejecutiva"

---

## 1. La Fórmula Core

### 1.1 Ecuación Fundamental

```
DII Raw = (TRD × AER) / (HFP × BRI × RRG)

DII Index = (DII Raw / DII Base) × 10
```

### 1.2 Por Qué Esta Fórmula

**Para el C-Level**: 
Imaginen su negocio como un sistema inmunológico. Los factores del numerador (TRD × AER) representan su "fortaleza intrínseca" - qué tan difícil es dañarlos y cuánto aguantan antes de perder valor. Los del denominador (HFP × BRI × RRG) son sus "vulnerabilidades multiplicativas" - cada una amplifica el daño potencial.

**Racionalidad Matemática**:
- **Numerador**: Factores de RESILIENCIA - mejoran al aumentar
- **Denominador**: Factores de VULNERABILIDAD - empeoran al aumentar
- **Multiplicación**: Captura efectos compuestos
- **Normalización a 10**: Permite comparación universal

---

## 2. Las 5 Dimensiones Refinadas

### CATEGORÍA PREVENCIÓN (Denominador)
*Reduce la frecuencia e impacto inicial de los ataques*

#### 2.1 AER - Attack Economics Ratio (Ratio de Economía del Ataque)

**Definición C-Level**: 
"Por cada dólar que gasta un atacante, ¿cuántos dólares puede destruir en tu empresa?"

**Definición Técnica**:
Relación entre el costo estimado de ejecutar un ataque exitoso contra la organización y el valor total de impacto potencial para el negocio.

**Refinamiento v4.0**: Incluye TODO el valor en riesgo:
- Dinero extraíble directamente
- Multas regulatorias potenciales  
- Pérdida de clientes por daño reputacional
- Costos totales de recuperación y remediación

**Unidad de Medida**: Ratio decimal (rango típico: 0.01 - 50.0)

**Normalización a 0-10**:
```
AER_normalizado = 10 × (log(AER_raw) + 2) / 4
# Donde log(0.01)=-2 mapea a 0, y log(100)=2 mapea a 10
```

**Método de Cálculo**:
```
AER_raw = Costo_Ataque_Promedio / Valor_Total_en_Riesgo

Donde:
- Costo_Ataque = (Herramientas + Tiempo_Experto + Infraestructura) × Factor_Mercado
- Valor_en_Riesgo = Datos_Vendibles + Rescate_Potencial + Multas_Regulatorias + 
                    Pérdida_Clientes + Costo_Recuperación + Daño_Competitivo
```

**Fuentes de Datos Válidas**:
- Cotizaciones de red teams profesionales
- Valoración de datos por información clasificada
- Benchmarks de ransoms pagados en la industria
- Estimación de multas según regulación aplicable
- Análisis de churn histórico post-breach
- Costos de recuperación de incidentes similares

---

#### 2.2 HFP - Human Failure Probability (Ratio de Error Humano)

**Definición C-Level**: 
"¿Cuál es la probabilidad de que este mes al menos un empleado comprometa la seguridad?"

**Definición Técnica**:
Probabilidad mensual de que al menos un usuario autorizado ejecute una acción que resulte en compromiso de seguridad.

**Sin cambios en v4.0**: El factor humano sigue siendo el vector principal independientemente del tipo de impacto.

**Unidad de Medida**: Probabilidad 0-1 (rango típico: 0.15 - 0.95)

**Normalización a 0-10**:
```
HFP_normalizado = 10 × (1 - HFP_raw)
# Invierte la escala: 0% fallo = 10 puntos, 100% fallo = 0 puntos
```

**Método de Cálculo**:
```
HFP_raw = 1 - (1 - tasa_fallo_individual)^(empleados_activos × días_mes)

Ajustes:
- Si usuarios_privilegiados_fallan_más: HFP × 1.2
- Si tendencia_mejorando: HFP × 0.9
- Si sin_entrenamiento_6meses: HFP × 1.3
```

**Fuentes de Datos Válidas**:
- Resultados de campañas de phishing simulado
- Logs de violaciones de política detectadas
- Tickets de seguridad causados por error humano
- Métricas de plataforma de Security Awareness

---

#### 2.3 BRI - Blast Radius Index (Radio de Exposición)

**Definición C-Level**: 
"Si comprometen una computadora, ¿a qué porcentaje del valor del negocio pueden llegar?"

**Definición Técnica**:
Porcentaje promedio del valor total del negocio accesible desde un punto de compromiso típico en la red.

**Refinamiento v4.0**: De "sistemas alcanzables" a "valor de negocio expuesto":
- % de datos de clientes accesibles
- % de operaciones críticas interrumpibles
- % de propiedad intelectual expuesta
- % de sistemas regulados alcanzables

**Unidad de Medida**: Porcentaje 0-1 (rango típico: 0.20 - 0.95)

**Normalización a 0-10**:
```
BRI_normalizado = 10 × (1 - BRI_raw)
# Invierte: 0% alcance = 10 puntos, 100% alcance = 0 puntos
```

**Método de Cálculo**:
```
BRI_raw = (Valor_Alcanzable_Usuario × 0.4 + Valor_Alcanzable_Servidor × 0.3 + 
           Peor_Caso_Histórico × 0.2 + Factor_Controles × 0.1)

Donde:
- Valor_Alcanzable = % del valor total del negocio expuesto
- Factor_Controles = 1 - (Segmentación + ZeroTrust + PAM) / 3
```

**Fuentes de Datos Válidas**:
- Resultados de pruebas de penetración con enfoque en valor
- Análisis de BloodHound mapeado a activos críticos
- Inventario de datos y su valoración
- Arquitectura de red y controles de acceso

---

### CATEGORÍA RESILIENCIA (Numerador)
*Mantiene valor del negocio durante y después del ataque*

#### 2.4 TRD - Time to Revenue Disruption (Tiempo hasta Afectación de Ingresos)

**Definición C-Level**: 
"¿Cuántas horas pueden fallar sus sistemas antes de que empiece a perder valor significativo?"

**Definición Técnica**:
Tiempo en horas desde el inicio de un incidente de seguridad hasta que la organización experimenta una pérdida material de valor de negocio.

**Refinamiento v4.0**: Considera el impacto más rápido en cualquier dimensión:
- Pérdida de ventas (operacional)
- Multas por incumplimiento (compliance)
- Éxodo de clientes (confianza)
- Exposición de IP (estratégico)

**Unidad de Medida**: Horas (rango típico: 0.5 - 168)

**Normalización a 0-10**:
```
TRD_normalizado = 10 × log(TRD_raw + 1) / log(169)
# log(169) normaliza 168h a ~10 puntos
```

**Método de Cálculo**:
```
TRD_raw = MIN(
    Tiempo_pérdida_operacional_10%,
    Tiempo_activación_multas,
    Tiempo_detección_pública,
    Tiempo_exposición_datos_críticos
)
```

**Fuentes de Datos Válidas**:
- Business Impact Analysis (BIA) formal
- Cláusulas de SLA con penalizaciones
- Análisis de velocidad de propagación en redes sociales
- Umbrales regulatorios de notificación

---

#### 2.5 RRG - Recovery Reality Gap (Agilidad para Recuperación)

**Definición C-Level**: 
"Cuando dicen recuperar en 4 horas, ¿realmente cuánto tardan?"

**Definición Técnica**:
Factor multiplicador entre el tiempo documentado de recuperación (RTO) y el tiempo real histórico de recuperación completa del valor del negocio.

**Sin cambios en v4.0**: La agilidad de recuperación aplica igual para todos los tipos de impacto.

**Unidad de Medida**: Multiplicador ≥1.0 (rango típico: 1.0 - 10.0)

**Normalización a 0-10**:
```
RRG_normalizado = 10 / RRG_raw
# Invierte: 1x (cumple RTO) = 10 puntos, 10x = 1 punto
```

**Método de Cálculo**:
```
RRG_raw = Tiempo_Real_Promedio / RTO_Documentado

Ajustes:
- Si último_test > 12_meses: RRG × 1.5
- Si automatización < 20%: RRG × 1.3
- Si fallo_test > 50%: RRG × 1.4
- Mínimo RRG = 1.0
```

**Fuentes de Datos Válidas**:
- Reportes post-mortem de incidentes reales
- Resultados de pruebas DR con métricas
- Logs de recuperación con timestamps
- Análisis de automatización vs manual

---

## 3. Normalización y Cálculo Final

### 3.1 Proceso de Cálculo Completo

```python
def calcular_dii(dimensiones_raw, modelo_negocio):
    # 1. Normalizar cada dimensión a escala 0-10
    dimensiones_norm = {
        'aer': normalizar_aer(dimensiones_raw['aer']),
        'hfp': normalizar_hfp(dimensiones_raw['hfp']),
        'bri': normalizar_bri(dimensiones_raw['bri']),
        'trd': normalizar_trd(dimensiones_raw['trd']),
        'rrg': normalizar_rrg(dimensiones_raw['rrg'])
    }
    
    # 2. Calcular DII Raw con valores normalizados
    dii_raw = (dimensiones_norm['trd'] * dimensiones_norm['aer']) / 
              (dimensiones_norm['hfp'] * dimensiones_norm['bri'] * 
               dimensiones_norm['rrg'])
    
    # 3. Obtener DII Base según modelo de negocio
    dii_base = obtener_dii_base(modelo_negocio)
    
    # 4. Normalizar a escala 1-10
    dii_index = (dii_raw / dii_base) * 10
    
    # 5. Aplicar límites
    dii_final = max(1.0, min(10.0, dii_index))
    
    return {
        'dimensiones_raw': dimensiones_raw,
        'dimensiones_normalizadas': dimensiones_norm,
        'dii_raw': dii_raw,
        'dii_index': dii_final,
        'modelo_negocio': modelo_negocio
    }
```

### 3.2 DII Base por Modelo de Negocio

| Modelo | DII Base Min | DII Base Max | DII Base Promedio | Justificación |
|--------|--------------|--------------|-------------------|---------------|
| **1. Comercio Híbrido** | 1.5 | 2.0 | 1.75 | Redundancia natural física |
| **2. Software Crítico** | 0.8 | 1.2 | 1.00 | Balance riesgo-resiliencia |
| **3. Servicios de Datos** | 0.5 | 0.9 | 0.70 | Alta dependencia digital |
| **4. Ecosistema Digital** | 0.4 | 0.8 | 0.60 | Complejidad extrema |
| **5. Servicios Financieros** | 0.2 | 0.6 | 0.40 | Máxima exposición |
| **6. Infraestructura Heredada** | 0.2 | 0.5 | 0.35 | Deuda técnica crítica |
| **7. Cadena de Suministro** | 0.4 | 0.8 | 0.60 | Dependencias múltiples |
| **8. Información Regulada** | 0.4 | 0.7 | 0.55 | Compliance + ataques |

---

## 4. Validaciones y Control de Calidad

### 4.1 Rangos de Validación por Dimensión

| Dimensión | Crítico (0-3) | Esperado (3-7) | Óptimo (7-10) | Alerta |
|-----------|---------------|-----------------|---------------|---------|
| **AER** | Muy rentable atacar | Balance razonable | Costoso atacar | Si >9: Verificar honeypots |
| **HFP** | Alta probabilidad fallo | Gestión estándar | Cultura segura | Si <10%: Validar tamaño |
| **BRI** | Valor expuesto >70% | Exposición controlada | Mínima exposición | Si <20%: Auditar arquitectura |
| **TRD** | <6h impacto material | 6-48h tolerancia | >48h buffer | Si >7días: Confirmar con CFO |
| **RRG** | Recuperación 5x+ lenta | 2-5x realista | <2x ágil | Si =1: Verificar con incidentes |

### 4.2 Coherencia entre Dimensiones

```python
def validar_coherencia(dims_norm, modelo_negocio):
    alertas = []
    
    # Prevención vs Resiliencia
    prev_avg = (dims_norm['aer'] + dims_norm['hfp'] + dims_norm['bri']) / 3
    res_avg = (dims_norm['trd'] + dims_norm['rrg']) / 2
    
    if abs(prev_avg - res_avg) > 4:
        alertas.append("Desbalance significativo entre Prevención y Resiliencia")
    
    # Validaciones por modelo
    if modelo_negocio in [5, 8] and dims_norm['bri'] > 7:  # Custodios
        alertas.append("BRI muy alto para modelo con datos sensibles - validar")
        
    if modelo_negocio in [1, 6] and dims_norm['trd'] < 3:  # Redundantes
        alertas.append("TRD muy bajo para modelo con redundancia - verificar")
        
    return alertas
```

---

## 5. Interpretación de Resultados

### 5.1 Output del Módulo

```json
{
  "dii_index": 5.6,
  "categorias": {
    "prevencion": {
      "score_promedio": 4.2,
      "dimensiones": {
        "aer": {"raw": 0.15, "normalizado": 3.5, "interpretacion": "Atractivo para atacantes"},
        "hfp": {"raw": 0.68, "normalizado": 3.2, "interpretacion": "Cultura de seguridad débil"},
        "bri": {"raw": 0.75, "normalizado": 2.5, "interpretacion": "Alto valor expuesto"}
      }
    },
    "resiliencia": {
      "score_promedio": 6.8,
      "dimensiones": {
        "trd": {"raw": 24, "normalizado": 7.2, "interpretacion": "Buena tolerancia a fallas"},
        "rrg": {"raw": 1.8, "normalizado": 5.6, "interpretacion": "Recuperación cercana a lo planeado"}
      }
    }
  },
  "dimension_mas_debil": "bri",
  "dimension_mas_fuerte": "trd",
  "recomendacion_foco": "Reducir valor expuesto mediante segmentación"
}
```

### 5.2 Interpretación Ejecutiva

**DII < 4.0**: "Su organización pierde >70% de su valor durante incidentes"
**DII 4.0-6.0**: "Mantiene 30-60% del valor, pero con pérdidas significativas"
**DII 6.0-8.0**: "Protege 60-85% del valor, competitivo en su industria"
**DII > 8.0**: "Mantiene >85% del valor, convierte crisis en ventaja"

---

## 6. Integración con Otros Módulos

### Input del Módulo 1 (Modelos):
- Modelo de negocio para DII Base
- Perfil de impacto para contexto

### Output al Módulo 3 (Madurez):
- DII Index final
- Dimensiones normalizadas
- Categorías balanceadas

### Output al Módulo 4 (Benchmarking):
- Scores para comparación
- Datos para percentiles

---

## 7. Consideraciones de Implementación

### 7.1 Para Quick Assessment
- Usar valores medios de rangos
- Aplicar defaults conservadores
- Validación mínima

### 7.2 Para Assessment Formal
- Requerir evidencia por dimensión
- Múltiples fuentes de validación
- Análisis de sensibilidad

### 7.3 Para Servicios Gestionados
- Tracking mensual de evolución
- Alertas por cambios significativos
- Correlación con incidentes reales

---

## Conclusión

El Módulo de Cálculo del DII 4.0 transforma métricas operacionales en un índice ejecutivo que captura el impacto holístico al negocio. Las dimensiones refinadas (especialmente AER, BRI y TRD) ahora consideran pérdida de confianza, multas regulatorias y daño competitivo además del impacto operacional.

La fórmula se mantiene simple y elegante, pero su interpretación es más rica y relevante para la realidad del negocio digital.

---

*Digital Immunity Index 4.0 - Módulo 2: Cálculo*  
*Matemática simple para decisiones complejas*  
*"Misma fórmula, visión completa del impacto"*