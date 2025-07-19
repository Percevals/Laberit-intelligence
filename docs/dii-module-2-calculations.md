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

El Módulo de Cálculo es el motor matemático del DII 4.0. Transforma datos operacionales en un índice único que los ejecutivos pueden usar para decisiones estratégicas. La clave está en la **normalización inteligente** que permite que cada dimensión contribuya correctamente a la fórmula.

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
Imaginen su negocio como un sistema inmunológico. Los factores del numerador (TRD × AER) representan sus "capacidades defensivas" - cuánto tiempo aguantan antes de perder valor y qué tan costoso hacen los ataques. Los del denominador (HFP × BRI × RRG) son sus "vulnerabilidades multiplicativas" - cada una amplifica el daño potencial.

**Racionalidad Matemática**:
- **Numerador**: Factores de RESILIENCIA - mejoran al aumentar
- **Denominador**: Factores de VULNERABILIDAD - empeoran al aumentar
- **Multiplicación**: Captura efectos compuestos
- **Normalización a 10**: Permite comparación universal

**Innovación v4.0**: El AER funciona en el numerador gracias a la normalización que lo transforma de "atractivo para atacar" a "economía de defensa".

---

## 2. Las 5 Dimensiones Refinadas

### CATEGORÍA RESILIENCIA (Numerador)
*Mantiene valor del negocio durante y después del ataque*

#### 2.1 TRD - Time to Revenue Disruption (Tiempo hasta Afectación de Ingresos)

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

**Normalización a 1-10**:
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

#### 2.2 AER - Attack Economics Ratio (Economía de Defensa)

**Definición C-Level**: 
"¿Qué tan caro le haces a un atacante obtener valor de tu empresa?"

**Definición Técnica**:
Relación entre el costo estimado de ejecutar un ataque exitoso contra la organización y el valor total extraíble. La normalización lo transforma en un indicador de economía defensiva.

**Refinamiento v4.0 - LA TRANSFORMACIÓN CLAVE**: 
El AER crudo mide cuán atractivo eres (bajo = atractivo). La normalización lo invierte conceptualmente a "Economía de Defensa" (alto = buenas defensas):

**Unidad de Medida**: 
- **Crudo**: Ratio decimal (rango típico: 0.01 - 50.0)
- **Normalizado**: Escala 1-10 (1 = fácil atacar, 10 = muy costoso atacar)

**Normalización a 1-10 (TRANSFORMACIÓN CRÍTICA)**:
```python
def normalizar_aer(aer_raw):
    """
    Transforma AER de 'atractivo para atacar' a 'economía de defensa'
    AER_raw = 0.01 (muy atractivo) → AER_norm = 1.0 (defensa débil)
    AER_raw = 50 (poco atractivo) → AER_norm = 9.2 (defensa fuerte)
    """
    # Aplicamos logaritmo para manejar el amplio rango
    aer_log = math.log10(aer_raw)
    
    # Escala logarítmica: log(0.01)=-2, log(50)=1.7
    # Normalizamos este rango a 1-10
    aer_normalizado = 1 + 9 * (aer_log + 2) / 3.7
    
    # Aseguramos límites 1-10
    return max(1.0, min(10.0, aer_normalizado))

# Ejemplos de transformación:
# AER_raw = 0.01 → AER_norm = 1.0 (blanco fácil)
# AER_raw = 0.1  → AER_norm = 2.6 (muy vulnerable)
# AER_raw = 1.0  → AER_norm = 4.9 (promedio)
# AER_raw = 10   → AER_norm = 7.1 (bien protegido)
# AER_raw = 50   → AER_norm = 9.2 (fortaleza)
```

**Método de Cálculo del AER Crudo**:
```
AER_raw = Valor_Total_en_Riesgo / Costo_Ataque_Promedio

Donde:
- Valor_en_Riesgo = Datos_Vendibles + Rescate_Potencial + Multas_Regulatorias + 
                    Pérdida_Clientes + Costo_Recuperación + Daño_Competitivo
- Costo_Ataque = (Herramientas + Tiempo_Experto + Infraestructura) × Factor_Mercado
```

**Interpretación Post-Normalización**:
- **AER_norm 1-3**: "Economía de defensa débil" - Muy rentable atacarte
- **AER_norm 4-6**: "Economía de defensa moderada" - ROI promedio para atacantes
- **AER_norm 7-10**: "Economía de defensa fuerte" - Atacarte es mal negocio

---

### CATEGORÍA VULNERABILIDAD (Denominador)
*Factores que amplifican el daño potencial*

#### 2.3 HFP - Human Failure Probability (Probabilidad de Fallo Humano)

**Definición C-Level**: 
"¿Cuál es la probabilidad de que este mes al menos un empleado comprometa la seguridad?"

**Definición Técnica**:
Probabilidad mensual de que al menos un usuario autorizado ejecute una acción que resulte en compromiso de seguridad.

**Sin cambios en v4.0**: El factor humano sigue siendo el vector principal independientemente del tipo de impacto.

**Unidad de Medida**: Probabilidad 0-1 (rango típico: 0.15 - 0.95)

**Normalización a 1-10**:
```python
def normalizar_hfp(hfp_raw):
    """
    Invierte la escala: alta probabilidad de fallo = baja puntuación
    HFP_raw = 0.0 → HFP_norm = 10 (perfección imposible)
    HFP_raw = 1.0 → HFP_norm = 1 (fallo garantizado)
    """
    hfp_normalizado = 10 * (1 - hfp_raw)
    return max(1.0, min(10.0, hfp_normalizado))
```

**Método de Cálculo**:
```
HFP_raw = 1 - (1 - tasa_fallo_individual)^(empleados_activos × días_mes)

Ajustes:
- Si usuarios_privilegiados_fallan_más: HFP × 1.2
- Si tendencia_mejorando: HFP × 0.9
- Si sin_entrenamiento_6meses: HFP × 1.3
```

---

#### 2.4 BRI - Blast Radius Index (Radio de Exposición)

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

**Normalización a 1-10**:
```python
def normalizar_bri(bri_raw):
    """
    Invierte: alto radio de exposición = baja puntuación
    BRI_raw = 0.0 → BRI_norm = 10 (sin exposición)
    BRI_raw = 1.0 → BRI_norm = 1 (todo expuesto)
    """
    bri_normalizado = 10 * (1 - bri_raw)
    return max(1.0, min(10.0, bri_normalizado))
```

---

#### 2.5 RRG - Recovery Reality Gap (Brecha de Recuperación Real)

**Definición C-Level**: 
"Cuando dicen recuperar en 4 horas, ¿realmente cuánto tardan?"

**Definición Técnica**:
Factor multiplicador entre el tiempo documentado de recuperación (RTO) y el tiempo real histórico de recuperación completa del valor del negocio.

**Sin cambios en v4.0**: La brecha de recuperación aplica igual para todos los tipos de impacto.

**Unidad de Medida**: Multiplicador ≥1.0 (rango típico: 1.0 - 10.0)

**Normalización a 1-10**:
```python
def normalizar_rrg(rrg_raw):
    """
    Invierte: alta brecha = baja puntuación
    RRG_raw = 1.0 → RRG_norm = 10 (cumple lo prometido)
    RRG_raw = 10.0 → RRG_norm = 1 (10x más lento)
    """
    # Usamos escala inversa con límite en 10x
    rrg_normalizado = 10 / rrg_raw
    return max(1.0, min(10.0, rrg_normalizado))
```

---

## 3. Normalización y Cálculo Final

### 3.1 Proceso de Cálculo Completo

```python
def calcular_dii(dimensiones_raw, modelo_negocio):
    """
    Calcula el DII Index aplicando normalización inteligente
    """
    # 1. Normalizar cada dimensión a escala 1-10
    dimensiones_norm = {
        'trd': normalizar_trd(dimensiones_raw['trd']),
        'aer': normalizar_aer(dimensiones_raw['aer']),  # TRANSFORMACIÓN CLAVE
        'hfp': normalizar_hfp(dimensiones_raw['hfp']),
        'bri': normalizar_bri(dimensiones_raw['bri']),
        'rrg': normalizar_rrg(dimensiones_raw['rrg'])
    }
    
    # 2. Calcular DII Raw con valores normalizados
    # Numerador: Factores de resiliencia (TRD × AER normalizado como defensa)
    # Denominador: Factores de vulnerabilidad
    dii_raw = (dimensiones_norm['trd'] * dimensiones_norm['aer']) / \
              (dimensiones_norm['hfp'] * dimensiones_norm['bri'] * \
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
        'modelo_negocio': modelo_negocio,
        'interpretacion_aer': interpretar_aer(dimensiones_norm['aer'])
    }

def interpretar_aer(aer_norm):
    """
    Interpreta el AER normalizado en términos de economía de defensa
    """
    if aer_norm < 3:
        return "Economía de defensa crítica - Muy rentable atacarte"
    elif aer_norm < 6:
        return "Economía de defensa moderada - ROI promedio para atacantes"
    else:
        return "Economía de defensa fuerte - Atacarte es mal negocio"
```

### 3.2 Tabla de Normalización Completa

| Dimensión | Valor Crudo Bajo | Normalizado | Valor Crudo Alto | Normalizado | Interpretación |
|-----------|------------------|-------------|------------------|-------------|----------------|
| **TRD** | 1 hora | 1.0 | 168 horas | 10.0 | Más horas = mejor |
| **AER** | 0.01 (atractivo) | 1.0 | 50 (costoso) | 9.2 | **Transformado**: Alto = defensas caras |
| **HFP** | 0.95 (95% fallo) | 0.5 | 0.05 (5% fallo) | 9.5 | Menos fallo = mejor |
| **BRI** | 0.95 (95% expuesto) | 0.5 | 0.05 (5% expuesto) | 9.5 | Menos exposición = mejor |
| **RRG** | 10x más lento | 1.0 | 1x (cumple RTO) | 10.0 | Menor brecha = mejor |

### 3.3 DII Base por Modelo de Negocio

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

### 4.1 Rangos de Validación por Dimensión (Post-Normalización)

| Dimensión | Crítico (1-3) | Esperado (4-7) | Óptimo (8-10) | Alerta |
|-----------|---------------|-----------------|---------------|---------|
| **TRD** | <6h impacto rápido | 6-48h tolerancia | >48h buffer amplio | Si >7días: Confirmar con CFO |
| **AER** | Blanco fácil y rentable | Costo-beneficio promedio | Muy caro atacar | Si >9: Verificar honeypots activos |
| **HFP** | >70% probabilidad fallo | 30-70% gestión estándar | <30% cultura segura | Si <10%: Validar tamaño empresa |
| **BRI** | >70% valor expuesto | 30-70% exposición controlada | <30% mínima exposición | Si <20%: Auditar arquitectura |
| **RRG** | Recuperación 5x+ lenta | 2-5x brecha realista | <2x muy ágil | Si =1: Verificar con incidentes reales |

### 4.2 Coherencia entre Dimensiones

```python
def validar_coherencia(dims_norm, modelo_negocio):
    alertas = []
    
    # Resiliencia vs Vulnerabilidad
    resiliencia_promedio = (dims_norm['trd'] + dims_norm['aer']) / 2
    vulnerabilidad_promedio = (dims_norm['hfp'] + dims_norm['bri'] + dims_norm['rrg']) / 3
    
    if abs(resiliencia_promedio - vulnerabilidad_promedio) > 4:
        alertas.append("Desbalance significativo entre Resiliencia y Vulnerabilidad")
    
    # Validación específica de AER transformado
    if dims_norm['aer'] > 8 and dims_norm['bri'] > 7:
        alertas.append("AER muy alto pero BRI también alto - verificar segmentación")
        
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
    "resiliencia": {
      "score_promedio": 6.8,
      "dimensiones": {
        "trd": {"raw": 24, "normalizado": 7.2, "interpretacion": "Buena tolerancia a fallas"},
        "aer": {"raw": 2.5, "normalizado": 6.4, "interpretacion": "Economía de defensa moderada - ROI promedio para atacantes"}
      }
    },
    "vulnerabilidad": {
      "score_promedio": 4.2,
      "dimensiones": {
        "hfp": {"raw": 0.68, "normalizado": 3.2, "interpretacion": "Cultura de seguridad débil"},
        "bri": {"raw": 0.75, "normalizado": 2.5, "interpretacion": "Alto valor expuesto"},
        "rrg": {"raw": 1.8, "normalizado": 5.6, "interpretacion": "Recuperación cercana a lo planeado"}
      }
    }
  },
  "dimension_mas_debil": "bri",
  "dimension_mas_fuerte": "trd",
  "recomendacion_foco": "Reducir valor expuesto mediante segmentación",
  "interpretacion_aer": "Con un AER de 6.4, has logrado que atacarte tenga un ROI promedio. Siguiente meta: hacerlo no rentable (AER > 7)"
}
```

### 5.2 Interpretación Ejecutiva

**DII < 4.0**: "Su organización pierde >70% de su valor durante incidentes"
**DII 4.0-6.0**: "Mantiene 30-60% del valor, pero con pérdidas significativas"
**DII 6.0-8.0**: "Protege 60-85% del valor, competitivo en su industria"
**DII > 8.0**: "Mantiene >85% del valor, convierte crisis en ventaja"

---

## 6. Casos de Ejemplo con Nueva Normalización

### Ejemplo 1: Fintech en Etapa Frágil
```
Valores Crudos:
- TRD: 4 horas
- AER: 0.05 (muy atractivo: $1 ataque → $20 valor)
- HFP: 0.75 (75% probabilidad fallo)
- BRI: 0.85 (85% valor expuesto)
- RRG: 4.0 (recuperan 4x más lento)

Normalizados:
- TRD: 3.2
- AER: 1.8 (economía de defensa muy débil)
- HFP: 2.5
- BRI: 1.5
- RRG: 2.5

DII Raw = (3.2 × 1.8) / (2.5 × 1.5 × 2.5) = 0.61
DII Index = (0.61 / 0.4) × 10 = 3.8 (FRÁGIL)
```

### Ejemplo 2: Software Crítico Resiliente
```
Valores Crudos:
- TRD: 48 horas
- AER: 15 (costoso: $1 ataque → $0.067 valor)
- HFP: 0.25 (25% probabilidad fallo)
- BRI: 0.35 (35% valor expuesto)
- RRG: 1.5 (recuperan 1.5x más lento)

Normalizados:
- TRD: 8.1
- AER: 7.5 (economía de defensa fuerte)
- HFP: 7.5
- BRI: 6.5
- RRG: 6.7

DII Raw = (8.1 × 7.5) / (7.5 × 6.5 × 6.7) = 0.19
DII Index = (0.19 / 1.0) × 10 = 7.2 (RESILIENTE)
```

---

## 7. Integración con Otros Módulos

### Input del Módulo 1 (Modelos):
- Modelo de negocio para DII Base
- Perfil de impacto para contexto

### Output al Módulo 3 (Madurez):
- DII Index final
- Dimensiones normalizadas
- **Interpretación específica de AER como economía de defensa**

### Output al Módulo 4 (Benchmarking):
- Scores para comparación
- Datos para percentiles
- **Contexto de economía de ataque por industria**

---

## 8. Consideraciones de Implementación

### 8.1 Para Quick Assessment
- Usar valores medios de rangos
- Aplicar defaults conservadores
- **Explicar AER en términos de "costo de atacarte"**

### 8.2 Para Assessment Formal
- Requerir evidencia por dimensión
- Múltiples fuentes de validación
- **Análisis detallado de economía de ataque**
- Comparación con incidentes reales del sector

### 8.3 Para Servicios Gestionados
- Tracking mensual de evolución
- **Monitoreo de cambios en economía de ataque**
- Alertas por degradación de cualquier dimensión
- Correlación con inteligencia de amenazas

---

## Conclusión

El Módulo de Cálculo del DII 4.0 transforma métricas operacionales en un índice ejecutivo que captura el impacto holístico al negocio. La **innovación clave** está en la normalización del AER que lo transforma de "atractivo para atacar" a "economía de defensa", permitiendo que funcione correctamente en el numerador de la fórmula.

Esta transformación matemática mantiene la simplicidad de la fórmula mientras asegura que cada dimensión contribuye en la dirección correcta: más resiliencia y menos vulnerabilidad = mejor inmunidad digital.

---

*Digital Immunity Index 4.0 - Módulo 2: Cálculo*  
*Matemática simple para decisiones complejas*  
*"La normalización inteligente revela la verdadera economía de la ciberdefensa"*