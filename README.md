# The Immunity Framework 3.0: Edición Fortaleza Empresarial

## Resumen Ejecutivo

Las evaluaciones tradicionales de ciberseguridad se centran en la tecnología mientras ignoran la verdad fundamental: **Su modelo de negocio determina su capacidad de supervivencia más que su stack de seguridad.** Un banco tradicional con sucursales puede sobrevivir a un ciberataque mejor que una fintech con seguridad perfecta, porque la arquitectura empresarial importa más que la arquitectura tecnológica.

El Immunity Framework 3.0 introduce el concepto de Fortaleza Empresarial, midiendo la resiliencia a través de tres pilares críticos—**La Trinidad de Inmunidad**:

## La Trinidad de Inmunidad

### 1. Efectividad de Protección (Su Escudo)
- **Qué Es**: Las defensas preventivas de su organización
- **Cómo Medimos**: 
  - Preparación de Protección × Rendimiento de Protección
- **Valor C-Level**: "¿Es efectiva nuestra inversión en seguridad?"

### 2. Fortaleza Empresarial (Su Fundación) 🆕
- **Qué Es**: La capacidad inherente de su modelo de negocio para resistir y operar durante incidentes cibernéticos
- **Innovación Clave**: Reconoce que una cadena minorista (0.62) tiene resiliencia inherente diferente a una plataforma cloud (0.86)
- **Cómo Medimos**:
  ```
  Fortaleza_Empresarial = Resiliencia_Modelo × (1 - Exposición_Estratégica × 0.5)
  ```
- **Valor C-Level**: "¿Puede sobrevivir nuestro modelo de negocio cuando falla la tecnología?"

### 3. Agilidad de Detección y Respuesta (Sus Reflejos)
- **Qué Es**: Su capacidad para detectar y neutralizar amenazas activas
- **Cómo Medimos**: 
  - Preparación de Respuesta × Rendimiento de Respuesta
- **Valor C-Level**: "¿Qué tan rápido podemos recuperarnos?"

## La Fórmula: Modelo de Negocio Primero

**Framework 3.0 reconoce que la resiliencia comienza con la arquitectura, no con la tecnología.**

```
Índice de Inmunidad = (Protección × Fortaleza_Empresarial × Agilidad) / 20
```

Resultado: Una puntuación de 0-10 que refleja la verdadera resiliencia empresarial, no solo la madurez técnica.

## Novedades en la Versión 3.0

### 1. Puntuación por Arquetipo Empresarial
Seis arquetipos con puntuaciones de resiliencia inherente:
- **B2C_DIGITAL** (0.86): Netflix, Spotify, Bancos Digitales
- **PLATAFORMA** (0.76): Uber, Airbnb, Marketplaces
- **SALUD** (0.70): Hospitales, Telemedicina
- **B2C_VOLUMEN** (0.62): Walmart, McDonald's
- **B2G** (0.54): Contratistas gubernamentales
- **B2B_IND** (0.48): Manufactura, Petróleo y Gas

### 2. Integración de Exposición Estratégica
Los componentes BEI ahora reducen directamente la fortaleza:
- Vulnerabilidad Industrial (25%)
- Dependencia Digital (40%)
- Velocidad de Decisión (20%)
- Riesgo Geográfico (15%)

### 3. Filosofía de Arquitectura sobre Inversión
- Negocio tradicional con seguridad moderada > Digital-only con seguridad perfecta
- Canales múltiples > Canal digital único
- Respaldos manuales > Automatización completa

## Perspectiva Clave: La Paradoja de la Transformación Digital

**Volverse 100% digital puede reducir su resiliencia cibernética.** 

Ejemplo:
- **Banco Tradicional**: Sucursales + Cajeros + Teléfono + Digital = Múltiples rutas de supervivencia
- **Banco Digital**: Solo App = Punto único de falla catastrófica

## Niveles de Puntuación de Rendimiento

| Puntuación de Inmunidad | Clasificación | Impacto Empresarial |
|------------------------|---------------|---------------------|
| 8.0 - 10.0 | **Elite** | Los ataques se convierten en ventajas competitivas |
| 6.0 - 7.9 | **Resiliente** | Recuperación rápida, impacto mínimo |
| 4.0 - 5.9 | **Vulnerable** | Disrupción significativa probable |
| 0.0 - 3.9 | **Crítico** | Amenaza existencial por ataques |

## Guía de Implementación

### 1. Identifique Su Arquetipo
Use nuestra [Referencia de Arquetipos Empresariales](framework/business-archetype-reference.md) para determinar su puntuación de Resiliencia_Modelo.

### 2. Calcule la Exposición Estratégica
Evalúe sus componentes BEI para entender la reducción de exposición.

### 3. Equilibre Su Trinidad
Recuerde: La multiplicación significa que su eslabón más débil determina la inmunidad general.

## Estructura del Repositorio

```
/dashboards         # Visualizaciones listas para Power BI
/framework          # Documentación y metodología del framework
/assessments        # Herramientas de evaluación y migraciones
/docs              # Documentación adicional
/intelligence      # Integración de inteligencia de amenazas
```

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

Framework 3.0 hace una pregunta simple: **Cuando la tecnología falla, ¿sobrevive su negocio?**

La fortaleza más fuerte no es la que tiene los muros más altos, sino la que permanece en pie cuando los muros caen.

---

*Framework 3.0: Porque en resiliencia cibernética, el modelo de negocio supera al stack tecnológico.*

## Aprenda Más

- [Detalles del Framework v3.0](framework/immunity-framework-v3.md)
- [Referencia de Arquetipos Empresariales](framework/business-archetype-reference.md)
- [Dashboard Ejecutivo](dashboards/immunity-MVP-CLH.html)
- [Migración desde v2.0](framework/immunity-framework-v2.md)