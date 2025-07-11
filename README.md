# Digital Immunity Index 4.0: Un Modelo de Resiliencia Operacional para la Era Digital

[![Deploy to GitHub Pages](https://github.com/Percevals/Laberit-intelligence/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Percevals/Laberit-intelligence/actions/workflows/deploy-pages.yml)
[![Security Audit](https://img.shields.io/badge/security-enabled-green.svg)](./SECURITY.md)
[![Live Site](https://img.shields.io/badge/live-site-blue.svg)](https://percevals.github.io/Laberit-intelligence/)

## Resumen Ejecutivo

El **Digital Immunity Index (DII) 4.0** mide la capacidad de una organización para mantener sus operaciones críticas de negocio mientras opera bajo ataque cibernético activo.

**Principio fundamental**: Asumimos que su modelo de negocio está comprometido y nos enfocamos en que funcione. En los sistemas biológicos, la inmunidad no previene infecciones - permite al organismo funcionar mientras está infectado.

**Filosofía operacional**: "¿Qué tan bien funciona mientras está bajo ataque?"

## La Ecuación de Inmunidad Digital 4.0

### Fórmula Transparente

```
DII = (TRD × AER) / (HFP × BRI × RRG)
```

**Donde**:
- **TRD**: Time to Revenue Degradation (Tiempo hasta degradación de ingresos)
- **AER**: Attack Economics Ratio (Ratio de economía del ataque)
- **HFP**: Human Failure Probability (Probabilidad de fallo humano)
- **BRI**: Blast Radius Index (Índice de radio de explosión)
- **RRG**: Recovery Reality Gap (Brecha de realidad en recuperación)

### Las 5 Dimensiones en 2 Categorías

#### CATEGORÍA A: PREVENCIÓN
1. **AER - Attack Economics Ratio**: Hace "costoso" atacar su negocio
2. **HFP - Human Failure Probability**: Barrera primaria con "porosidad" inherente
3. **BRI - Blast Radius Index**: Contiene y aísla el impacto operacional

#### CATEGORÍA B: RESILIENCIA
4. **TRD - Time to Revenue Degradation**: Velocidad de impacto en función crítica
5. **RRG - Recovery Reality Gap**: Capacidad real de restaurar función normal

## Los 8 Modelos de Negocio Digital (DII 4.0)

### Identificamos 8 arquetipos empresariales con niveles de resiliencia únicos:

1. **Servicios Financieros** - Banca, seguros, fintech (DII Base: 0.2-0.6)
2. **Información Regulada** - Salud, gobierno, datos sensibles (DII Base: 0.4-0.7)
3. **Ecosistema Digital** - Plataformas, marketplaces, APIs (DII Base: 0.4-0.8)
4. **Servicios de Datos** - Analytics, IA, procesamiento datos (DII Base: 0.5-0.9)
5. **Software Crítico** - Sistemas operativos, seguridad (DII Base: 0.8-1.2)
6. **Infraestructura Heredada** - Manufactura, logística, OT (DII Base: 0.2-0.5)
7. **Cadena de Suministro** - Distribución, aprovisionamiento (DII Base: 0.4-0.8)
8. **Comercio Híbrido** - Retail físico y digital (DII Base: 1.5-2.0)

## Novedades en la Versión 4.0

### 1. Fórmula Transparente y Validada
- Ecuación matemática clara: DII = (TRD × AER) / (HFP × BRI × RRG)
- Basada en 150+ evaluaciones reales en LATAM
- Escala 1-10 mantenida para compatibilidad con reportes semanales

### 2. De 6 a 8 Modelos de Negocio
- Mayor granularidad en la clasificación empresarial
- DII Base específico por modelo (no genérico)
- Multiplicadores de riesgo contextualizados

### 3. Foco en Capacidad Operacional
- No medimos "qué tan seguros están"
- Medimos "qué tan bien funcionan bajo ataque"
- Asumimos compromiso, evaluamos continuidad

### 4. Las 4 Etapas de Madurez
- **Frágil** (DII 0-2.5): Operaciones cesan bajo ataque
- **Robusto** (DII 2.5-5): Degradación significativa pero funcional
- **Resiliente** (DII 5-7.5): Mantiene operaciones esenciales
- **Adaptativo** (DII 7.5-10): Opera efectivamente durante ataques

### 5. Dashboard de Inteligencia Semanal Mejorado
- **Escala DII interactiva**: Visualización 0-10 con descripciones de madurez
- **8 Modelos de negocio**: Todos visibles con indicadores de incidentes
- **Contenido bilingüe**: Incidentes y análisis en español
- **Inteligencia interactiva**: Secciones de amenazas con detalles expandibles
- **Distribución visual**: Iconos y colores basados en riesgo para cada modelo

## Perspectiva Clave: Inmunidad Digital vs Seguridad Tradicional

**La inmunidad digital no es la ausencia de ataques - es la capacidad de prosperar durante ellos.**

Ejemplo práctico:
- **Enfoque tradicional**: "Necesitamos SIEM para cumplir normativa"
- **Enfoque DII**: "SIEM + SOAR mejora TRD de 24h a 6h, elevando DII 1.5 puntos = ROI en 8 meses"

## Interpretación del DII Score (escala 1-10)

| DII Score | Clasificación | Realidad Operacional | Distribución LATAM |
|-----------|---------------|---------------------|--------------------|
| > 8.0 | **Adaptativo** | Pérdida <15%, recuperación más rápida que competidores | <1% |
| 6.0-8.0 | **Resiliente** | Pérdida 15-40%, recuperación ±20% del plan | 10% |
| 4.0-6.0 | **Robusto** | Pérdida 40-70%, recuperación 2-3x más lenta | 30% |
| < 4.0 | **Frágil** | Pérdida 70%+, recuperación 5-10x más lenta | 59% |

## Metodología de Evaluación

### Quick Assessment (30 minutos)
- 5 preguntas clave (1 por dimensión)
- Clasificación de modelo de negocio
- DII estimado ±15% precisión
- 3 recomendaciones automáticas

### Assessment Formal (2-5 días)
- Análisis completo de 5 dimensiones
- Validación con data histórica
- Benchmark sectorial detallado
- Roadmap de mejora priorizado

### Evolución Continua
- Re-evaluación trimestral
- Tracking de mejoras
- Ajuste por cambios del negocio
- Inteligencia de amenazas contextualizada

## Estructura del Repositorio

```
/dashboards         # Visualizaciones listas para Power BI
/framework          # Documentación y metodología del framework
/assessments        # Herramientas de evaluación y migraciones
/docs              # Documentación adicional
/intelligence      # Sistema de inteligencia de amenazas semanal
  ├── data/        # Datos de incidentes y análisis
  ├── outputs/     # Dashboards generados
  └── templates/   # Plantillas HTML para dashboards
/weekly-reports    # Reportes semanales de inmunidad digital
```

## 🚀 Proceso de Inteligencia Semanal Automatizado

### Pipeline de Generación (Implementado Julio 2025)

1. **Recolección de Datos** (`quick_collect.py`)
   - Fuentes RSS de seguridad LATAM
   - Entrada manual de incidentes críticos
   - Formato JSON estructurado

2. **Enriquecimiento de Incidentes** (`enrich_incidents.py`)
   - Cálculo automático de DII por incidente
   - Mapeo a modelos de negocio DII 4.0
   - Estimación de impacto financiero
   - Clasificación de vectores de ataque

3. **Generación de Dashboard** (`dii_dashboard_generator.py`)
   - Template HTML responsivo
   - Visualizaciones interactivas
   - Análisis por modelo de negocio
   - Recomendaciones automáticas

### Características del Dashboard DII 4.0

- **Resumen Ejecutivo**: Impacto semanal en 30 segundos
- **Escala DII Visual**: Con modelos de madurez interactivos
- **8 Modelos de Negocio**: Distribución completa con contexto
- **Incidentes en Español**: Traducciones y análisis localizados
- **Inteligencia Interactiva**: Click para detalles expandidos
- **Métricas en Tiempo Real**: DII promedio, tendencias, sectores críticos

## 🔍 Integración de Inteligencia de Amenazas

Para mejorar el componente de **Exposición Estratégica** de la Fortaleza Empresarial y apoyar la **Agilidad**, ahora integramos inteligencia de amenazas en tiempo real de múltiples fuentes:

### Fuentes de Inteligencia por Categoría

#### 🌎 Inteligencia Regional LATAM

| Fuente | Descripción | Qué Extraer para Dashboard Semanal |
|--------|-------------|-----------------------------------|
| **Telegram API** | Monitoreo de canales de actores de amenazas enfocados en LATAM | • Nuevos grupos APT activos<br>• Sectores objetivo en la región<br>• TTPs emergentes<br>• Indicadores de campaña activa |
| **LATAM-CERT** | Feeds de CERTs regionales (MX-CERT, AR-CERT, BR-CERT) | • Alertas críticas regionales<br>• Vulnerabilidades explotadas localmente<br>• Tendencias de ataque por país |
| **IntelX.io (LATAM)** | Monitoreo de pastes con términos en español/portugués | • Filtraciones de credenciales corporativas<br>• Menciones de empresas objetivo<br>• Venta de accesos en foros |

#### 📊 Análisis de Tendencias

| Fuente | Descripción | Qué Extraer para Dashboard Semanal |
|--------|-------------|-----------------------------------|
| **OTX (AlienVault)** | Exchange global de amenazas con pulsos por industria | • Top 5 pulsos por arquetipo empresarial<br>• IoCs relevantes por sector<br>• Correlación geografía-industria |
| **MITRE ATT&CK** | Actualizaciones de técnicas y grupos | • Nuevas técnicas añadidas<br>• Cambios en perfiles de grupos<br>• Técnicas trending por región |
| **Threat Intelligence Platforms** | Plataformas comerciales agregadas | • Predicciones de amenazas emergentes<br>• Score de riesgo por industria<br>• Vectores de ataque predominantes |

#### 🚨 Vulnerabilidades Críticas

| Fuente | Descripción | Qué Extraer para Dashboard Semanal |
|--------|-------------|-----------------------------------|
| **NVD/CVE** | Base de datos nacional de vulnerabilidades | • CVEs críticos (CVSS >9.0)<br>• Vulnerabilidades con exploit público<br>• Parches prioritarios por arquetipo |
| **ExploitDB** | Base de datos de exploits públicos | • Nuevos exploits para software empresarial<br>• PoCs funcionales publicados<br>• Tendencia de publicación por tipo |
| **Have I Been Pwned** | Detección de brechas por dominio | • Nuevas brechas corporativas<br>• Volumen de cuentas comprometidas<br>• Sectores más afectados |

#### 🎯 Grupos APT

| Fuente | Descripción | Qué Extraer para Dashboard Semanal |
|--------|-------------|-----------------------------------|
| **APT Groups Tracker** | Seguimiento de grupos de amenaza persistente | • Grupos activos por región<br>• Cambios en TTPs<br>• Nuevas atribuciones<br>• Sectores objetivo |
| **Threat Actor Profiles** | Perfiles detallados de actores | • Actualizaciones de capacidades<br>• Nuevas herramientas identificadas<br>• Patrones de victimización |
| **OSINT APT Feeds** | Inteligencia de fuentes abiertas | • Campañas activas detectadas<br>• Infraestructura C2 nueva<br>• Correlaciones entre grupos |

### 💡 Mapeo Estratégico

Mapeamos estos hallazgos directamente en la fórmula del **Índice de Inmunidad**:

```
Fortaleza_Empresarial = Resiliencia_Modelo × (1 - Exposición_Estratégica × 0.5)
Índice_Inmunidad = (Protección × Fortaleza_Empresarial × Agilidad) / 20
```

Donde:
- **Exposición_Estratégica** aumenta con pulsos OTX y actividad en Telegram dirigida a su arquetipo
- **Agilidad** disminuye con filtraciones de credenciales detectadas en IntelX y HIBP

Esto permite la **recalibración semanal** de su postura de inmunidad basada en amenazas del mundo real.

### 📈 Actualizaciones Semanales de Inteligencia

Cada semana, actualizamos la carpeta `/intelligence` con inteligencia de amenazas fresca y publicamos dashboards enriquecidos en `/dashboards`. Estas actualizaciones le permiten:
- Rastrear tendencias de amenazas alineadas con su modelo de negocio
- Monitorear el progreso de reducción de exposición
- Mejorar la velocidad de decisión usando inteligencia en tiempo real
- Priorizar acciones basadas en amenazas específicas de su arquetipo

### 🎯 Uso del Dashboard Semanal

El dashboard semanal consolida la información extraída en:
1. **Vista Ejecutiva**: Cambios en el Índice de Inmunidad y drivers principales
2. **Mapa de Calor Regional**: Actividad de amenazas por geografía (foco LATAM)
3. **Matriz Arquetipo-Amenaza**: Riesgo específico por modelo de negocio
4. **Acciones Prioritarias**: Top 5 mitigaciones basadas en inteligencia actual

> La fortaleza más fuerte no es la que tiene los muros más altos, sino la que permanece en pie cuando los muros caen.

---

## La Conclusión

El Digital Immunity Index 4.0 reconoce tres verdades fundamentales:

1. **Todos están comprometidos** - La pregunta es qué tan bien funcionan
2. **El modelo de negocio importa** - No todas las organizaciones enfrentan el mismo riesgo
3. **La resiliencia vence a la prevención** - Mejor recuperarse rápido que pretender ser impenetrable

---

*Digital Immunity Index 4.0 - Última actualización: Julio 2025*  
*Basado en 150+ evaluaciones reales en LATAM*  
*"Asumimos que está comprometido y nos enfocamos en que funcione"*

## Aprenda Más

- [Detalles del Framework v4.0](immunity-framework.html)
- [Los 8 Modelos de Negocio Digital](immunity-framework.html#modelos)
- [Dashboard Ejecutivo](dashboards/immunity-MVP-CLH.html)
- [Migración desde v3.0](framework/immunity-framework-v3.md)# Forcing new deployment
