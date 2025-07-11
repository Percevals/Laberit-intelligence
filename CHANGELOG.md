# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [4.1.1] - 2025-07-11

### 📊 Datos Históricos DII v4.0

#### Migración de Base de Datos
- **150 assessments migrados** de v3.0 a DII v4.0
- **Integración de Recovery Agility**: 60% de clientes con datos ZT_MATURITY
- **Cobertura geográfica**: 18 países LATAM
- **Nuevos archivos de datos**:
  - `dii_v4_historical_data.json`: Registros completos de 150 empresas
  - `dii_v4_benchmarks.json`: Benchmarks por modelo y sector
  - `dii_v4_distribution.json`: Datos listos para visualización

#### Insights de la Migración
- **Distribución por etapa**: 
  - Frágil: 18.7% (requieren atención inmediata)
  - Robusto: 41.3% (protección básica)
  - Resiliente: 32.0% (capacidades sólidas)
  - Adaptativo: 8.0% (clase mundial)
- **Mejor modelo**: Servicios Financieros (promedio 5.82)
- **Mayor riesgo**: Infraestructura Heredada (promedio 2.18)
- **Correlación v3→v4**: 0.847 (preserva rankings relativos)

### 🔧 Cambios en Datos

- Nuevo índice de datos en `/data/index.json`
- Documentación de migración en `/docs/dii_v4_migration_notes.md`
- Scripts de generación de datos para actualizaciones futuras

### ⚠️ Breaking Changes

- Los dashboards que usan datos v3.0 deben actualizarse
- Nueva estructura de dimensiones (AER, HFP, BRI, TRD, RRG)
- Escala DII ahora es 1.0-10.0 (antes 0-7.4)

## [4.1.0] - 2025-07-11

### 🎉 Nuevas Características

#### AI-Powered Quick Assessment
- **Análisis de Compromiso con IA**: Calcula la probabilidad de que la organización ya esté comprometida
- **Análisis Económico Inteligente**: 
  - Solicita contexto de ingresos antes de mostrar pérdidas genéricas
  - Calcula impacto por fases (0h→10%→40%→80%)
  - Compara con empresas similares del sector
- **Simulador What-If Interactivo**:
  - Ajuste de tiempo de detección, operaciones afectadas y velocidad de recuperación
  - Paquetes de inversión con cálculo de ROI
  - Proyección de ahorro y período de recuperación

#### Mejoras en Dashboard de Inteligencia
- **Distribución por Modelo de Negocio Mejorada**:
  - Iconos y descripciones para cada modelo
  - Colores basados en nivel de riesgo
  - Indicador visual para modelos sin incidentes

### 🔧 Cambios Técnicos

#### Arquitectura AI Service
- Implementación de servicio AI provider-agnostic
- Soporte para Claude (Anthropic) y modo offline
- React hooks para fácil integración
- Sistema de fallback automático

#### Componentes Nuevos
- `EnhancedCompromiseScore`: Análisis de compromiso con tabs
- `RevenueContext`: Recolección de información de ingresos
- `EconomicImpactCalculator`: Cálculos económicos inteligentes
- `ImpactWhatIfSimulator`: Simulación interactiva de mejoras
- `AIStatusBadge`: Indicador de proveedor AI activo

### 🐛 Correcciones
- **Build Error Fix**: Resuelto problema de variable duplicada en OfflineProvider
- **Mapeo de Modelos**: Actualizado para usar correctamente DII 4.0
- **Traducciones**: Todo el contenido ahora en español

### 📚 Documentación
- Actualizado README principal con nuevas características
- Nuevo README para Quick Assessment con detalles de IA
- Documentación específica para AI Service
- Guías de análisis económico

## [4.0.0] - 2025-07-01

### ✨ Framework DII 4.0
- Nueva fórmula transparente: `DII = (TRD × AER) / (HFP × BRI × RRG)`
- Actualización de 6 a 8 modelos de negocio
- Nuevas escalas de madurez (0-10)
- Foco en capacidad operacional bajo ataque

### 🚀 Quick Assessment PWA
- Aplicación web progresiva completa
- 8 modelos de negocio con ejemplos LATAM
- Cálculo en tiempo real
- Diseño responsive con Tailwind CSS

### 📊 Dashboard de Inteligencia Semanal
- Pipeline automatizado de generación
- Enriquecimiento con cálculos DII
- Visualizaciones interactivas
- Contenido bilingüe

## [3.0.0] - 2024-12-01

### Versión Legacy
- 6 modelos de negocio
- Fórmula anterior del DII
- Dashboard estático
- Sin integración de IA

---

## Próximas Características (Roadmap)

### [4.2.0] - Planificado
- **Soporte OpenAI**: Integración con GPT-4
- **Export PDF**: Generación de reportes ejecutivos
- **Modo Presentación**: Vista optimizada para reuniones C-level
- **API REST**: Endpoints para integración empresarial

### [4.3.0] - Futuro
- **Análisis Histórico**: Tracking de mejoras en el tiempo
- **Benchmarking Sectorial**: Comparación detallada con industria
- **Integración SIEM**: Conexión con plataformas de seguridad
- **Multi-idioma**: Soporte para inglés y portugués