# Digital Immunity Index 4.0 - Módulo 1: Modelos de Negocio
## Clasificación por Arquetipos de Valor

**Archivo**: `DII-4.0-Module-1-BusinessModels.md`  
**Versión**: 4.0  
**Última actualización**: Enero 2025  
**Dependencias**: `DII-4.0-Foundation.md`

### Contexto del Framework DII 4.0

El Digital Immunity Index (DII) 4.0 es un framework modular que mide la capacidad de una organización para **mantener su valor de negocio mientras opera bajo ataque cibernético activo**.

**Evolución clave**: Ya no medimos solo continuidad operacional, sino el impacto holístico en el negocio - incluyendo pérdida de confianza, multas regulatorias, ventaja competitiva y capacidad operacional.

**Arquitectura Modular del DII 4.0**:
1. **Módulo de Modelos de Negocio** (este documento) - Clasificación de los 8 modelos
2. **Módulo de Cálculo** - Las 5 dimensiones refinadas para impacto total
3. **Módulo de Madurez** - Los 4 estadios de capacidad de proteger valor
4. **Módulo de Benchmarking** - Comparación contextual por modelo y región

### Estrategia de Agrupación por Arquetipos

Los **arquetipos son una herramienta de comprensión**, no una nueva clasificación. Los 8 modelos de negocio siguen siendo la base del DII 4.0, pero ahora entendemos que se agrupan naturalmente en 4 patrones de pérdida de valor:

**Qué se mantiene**:
- Los 8 modelos de negocio como clasificación primaria
- Rangos de DII Base por cada modelo
- Metodología de assessment
- Data histórica de 150+ evaluaciones

**Qué evoluciona**:
- Comprensión de patrones comunes entre modelos (arquetipos)
- Enfoque holístico en 4 tipos de impacto al negocio
- Reconocimiento de que cada modelo pierde valor diferente
- Refinamiento de las dimensiones para capturar impacto total

### Principio Fundamental

**"Tu modelo de negocio determina el ADN de tu riesgo digital"**

En la era digital, dos empresas del mismo sector pueden tener vulnerabilidades radicalmente diferentes. La diferencia no está en su industria, sino en cómo crean, capturan y pierden valor cuando sus sistemas fallan.

---

## Los 4 Arquetipos de Valor

### 1. CUSTODIOS 🏛️
**"Guardianes de activos críticos ajenos"**

**Definición**: Organizaciones a las que confías tus activos más valiosos (dinero, salud, datos personales). Su negocio es literalmente no perder lo que les confías.

**Pérdida típica**: $100K+/hora

**Vulnerabilidad clave**: Un breach no es solo pérdida económica - es pérdida de licencia para operar. La confianza institucional, una vez perdida, raramente se recupera.

**Modelos incluidos**:
- **Servicios Financieros**: Bancos, aseguradoras, administradoras de fondos
- **Información Regulada**: Hospitales, clínicas, instituciones educativas

**Indicadores de clasificación**:
- Regulación pesada específica del sector
- Marketing basado en "seguridad" y "confianza"
- Auditorías externas constantes
- Seguros de responsabilidad civil altísimos
- Penalizaciones regulatorias por incidentes

**DII Base**: 0.2-0.7 (alta exposición, alto impacto)

**Ejemplo LATAM**: 
"Cuando el sistema de salud chileno fue hackeado, no solo perdieron datos - perdieron la confianza de millones de ciudadanos por años."

---

### 2. CONECTORES 🌐
**"Facilitadores de transacciones entre desconocidos"**

**Definición**: Plataformas que monetizan la reducción de fricción y riesgo entre partes que no se conocen. No poseen inventario ni crean productos - su único activo es la confianza del ecosistema.

**Pérdida típica**: $50-100K/hora

**Vulnerabilidad clave**: Un fraude visible puede causar éxodo masivo. A diferencia de los Custodios (pierden licencia), los Conectores pierden usuarios - igualmente terminal pero más gradual.

**Modelos incluidos**:
- **Ecosistema Digital**: Marketplaces, plataformas de servicios, redes sociales
- **Cadena de Suministro**: Operadores logísticos con tracking digital, 3PLs tecnológicos

**Indicadores de clasificación**:
- No tocan el producto/servicio final
- Cobran comisión sobre transacciones ajenas
- Sistemas de ratings/reviews críticos
- Inversión en "Trust & Safety" > inversión en producto
- Efectos de red evidentes

**DII Base**: 0.4-1.0 (exposición variable, impacto medio)

**Ejemplo LATAM**: 
"Cuando Rappi tuvo problemas de seguridad en México, perdieron 20% de usuarios activos en 72 horas - no por falla técnica, sino por pérdida de confianza."

---

### 3. PROCESADORES ⚙️
**"Transformadores de información en decisiones"**

**Definición**: Empresas que toman inputs de menor valor y los transforman en outputs de mayor valor mediante procesos, algoritmos o conocimiento propietario difícil de replicar.

**Pérdida típica**: $20-50K/hora

**Vulnerabilidad clave**: Si alguien replica tu proceso o envenena tus datos, tu ventaja competitiva se evapora. La amenaza no es el downtime, es la commoditización.

**Modelos incluidos**:
- **Software Crítico**: ERPs, CRMs, sistemas de gestión empresarial
- **Servicios de Datos**: Analytics, scoring crediticio, inteligencia de mercado

**Indicadores de clasificación**:
- Algoritmos o procesos como diferenciador principal
- Pricing basado en valor del output, no costo del input
- Clientes pagan por ahorro de tiempo o mejor decisión
- Documentación del proceso es secreto comercial
- R&D representa >15% del presupuesto

**DII Base**: 0.5-1.5 (exposición técnica, impacto competitivo)

**Ejemplo LATAM**: 
"Cuando un competidor copió el algoritmo de scoring de Konfío, perdieron 40% de margen en 6 meses - no por hackeo, sino por ingeniería reversa."

---

### 4. REDUNDANTES 🛡️
**"Operadores con múltiples caminos al valor"**

**Definición**: Organizaciones que mantienen canales independientes de creación de valor. Cuando falla lo digital, lo físico continúa. Cuando falla lo moderno, lo legacy responde.

**Pérdida típica**: $5-20K/hora

**Vulnerabilidad clave**: Degradación gradual de eficiencia, no colapso. Pueden operar "a mano" indefinidamente, aunque sea costoso e ineficiente.

**Modelos incluidos**:
- **Comercio Híbrido**: Retailers con tiendas físicas y digitales
- **Infraestructura Heredada**: Utilities, gobierno, empresas con sistemas legacy

**Indicadores de clasificación**:
- Pueden procesar transacciones manualmente
- Clientes tienen múltiples formas de interactuar
- Sistemas legacy que "nunca se apagan"
- Procesos documentados en papel "por si acaso"
- Cultura de "el negocio debe continuar"

**DII Base**: 1.5-2.5 (baja exposición, bajo impacto)

**Ejemplo LATAM**: 
"Cuando Falabella sufrió ransomware, las tiendas físicas siguieron vendiendo con facturas manuales. Perdieron eficiencia, no el negocio."

---

## Matriz de Clasificación Rápida

| Pregunta Clave | Custodios | Conectores | Procesadores | Redundantes |
|----------------|-----------|------------|--------------|-------------|
| ¿Qué pierdes si fallas? | Licencia para operar | Usuarios del ecosistema | Ventaja competitiva | Eficiencia operacional |
| ¿Cuánto confían en ti? | Confianza institucional | Confianza comunitaria | Confianza en tu proceso | Confianza por cercanía |
| ¿Qué no puedes recuperar? | Reputación regulatoria | Masa crítica de usuarios | Secreto del algoritmo | Nada - todo es recuperable |
| ¿Tu peor pesadilla? | Breach de datos sensibles | Fraude viral público | Copia de tu proceso | Ineficiencia prolongada |
| ¿Backup natural? | No existe | Difícil de reconstruir | Reinventar proceso | Operación manual |

---

## Los 8 Modelos de Negocio y sus Arquetipos

**Nota importante**: Los arquetipos son patrones de comportamiento, no una nueva capa. Seguimos clasificando en 8 modelos, pero reconocemos 4 patrones de cómo pierden valor:

### Arquetipo CUSTODIOS 🏛️
**"Guardianes de activos críticos ajenos"**

Patrón común: La confianza institucional es su licencia para operar. Un breach puede terminar el negocio.

#### Modelo 5: Servicios Financieros
- **Ejemplos LATAM**: Nubank, Clip, Ualá, Bancos tradicionales
- **Pérdida típica**: $100K+/hora
- **DII Base**: 0.2-0.6
- **Impacto principal**: Compliance (40%) + Confianza (35%)

#### Modelo 8: Información Regulada
- **Ejemplos LATAM**: Hospitales, Universidades, Aseguradoras salud
- **Pérdida típica**: $100K+/hora
- **DII Base**: 0.4-0.7
- **Impacto principal**: Compliance (40%) + Confianza (30%)

---

### Arquetipo CONECTORES 🌐
**"Facilitadores de transacciones entre desconocidos"**

Patrón común: Su valor está en la red de usuarios. Perder confianza es perder el negocio gradualmente.

#### Modelo 4: Ecosistema Digital
- **Ejemplos LATAM**: MercadoLibre, Rappi, Didi
- **Pérdida típica**: $50-100K/hora
- **DII Base**: 0.4-0.8
- **Impacto principal**: Confianza (45%) + Operacional (35%)

#### Modelo 7: Cadena de Suministro
- **Ejemplos LATAM**: DHL, Estafeta, Coordinadora
- **Pérdida típica**: $50-100K/hora
- **DII Base**: 0.4-0.8
- **Impacto principal**: Operacional (45%) + Confianza (30%)

---

### Arquetipo PROCESADORES ⚙️
**"Transformadores de información en decisiones"**

Patrón común: Su diferencial está en el proceso/algoritmo. Perderlo es volverse commodity.

#### Modelo 2: Software Crítico
- **Ejemplos LATAM**: Siigo, ContPAQi, Aspel
- **Pérdida típica**: $20-50K/hora
- **DII Base**: 0.8-1.2
- **Impacto principal**: Operacional (40%) + Confianza (30%)

#### Modelo 3: Servicios de Datos
- **Ejemplos LATAM**: Experian, Serasa, DataCRM
- **Pérdida típica**: $20-50K/hora
- **DII Base**: 0.5-0.9
- **Impacto principal**: Estratégico (35%) + Operacional (25%)

---

### Arquetipo REDUNDANTES 🛡️
**"Operadores con múltiples caminos al valor"**

Patrón común: Tienen alternativas para operar. Pierden eficiencia, no el negocio completo.

#### Modelo 1: Comercio Híbrido
- **Ejemplos LATAM**: Falabella, Liverpool, Cencosud
- **Pérdida típica**: $5-20K/hora
- **DII Base**: 1.5-2.0
- **Impacto principal**: Operacional (60%) + Confianza (25%)

#### Modelo 6: Infraestructura Heredada
- **Ejemplos LATAM**: CFE, Pemex, Gobierno
- **Pérdida típica**: $5-20K/hora
- **DII Base**: 0.2-0.5
- **Impacto principal**: Operacional (50%) + Compliance (20%)

---

## Perfiles de Impacto Holístico por Arquetipo

El DII 4.0 reconoce que el impacto va más allá de lo operacional:

| Arquetipo | Operacional | Confianza | Compliance | Estratégico |
|-----------|-------------|-----------|------------|-------------|
| **Custodios** | 20% | 35% | 40% | 5% |
| **Conectores** | 35% | 40% | 15% | 10% |
| **Procesadores** | 35% | 25% | 15% | 25% |
| **Redundantes** | 55% | 25% | 15% | 5% |

---

## Implementación con Enfoque Holístico

### Quick Assessment (5 minutos):
1. **Identificar modelo de negocio**: 
   - Usar las preguntas guía por modelo
   - Confirmar con ejemplos del sector

2. **Validar con patrón de arquetipo**:
   - ¿Qué pierden primero? (confianza, usuarios, proceso, eficiencia)
   - ¿Cuánto pierden por hora?

3. **Asignar modelo final** (1 de los 8)

### Assessment Formal (2-5 días):
1. Mapeo completo de flujo de valor
2. Análisis de impacto en las 4 dimensiones (operacional, confianza, compliance, estratégico)
3. Cuantificación por tipo de impacto
4. Benchmarking dentro del arquetipo
5. Identificación de transiciones de modelo

---

## Evolución y Transiciones

### Señales de Cambio de Arquetipo:

**Redundante → Procesador**: 
- Cuando el diferencial competitivo se vuelve digital
- Ejemplo: Retail tradicional → Retail con IA personalizada

**Procesador → Conector**:
- Cuando agregan marketplace o red de usuarios
- Ejemplo: Software ERP → Plataforma con ecosistema

**Conector → Custodio**:
- Cuando obtienen licencias financieras o manejan datos regulados
- Ejemplo: Marketplace → Fintech con servicios bancarios

**Custodio → ?**:
- Raramente cambian (regulación los ancla)
- Pueden agregar características de otros arquetipos

---

## Integración con el Framework DII 4.0

### Con Módulo 2 (Cálculo):
El modelo de negocio (1-8) determina:
- DII Base específico para normalización
- Interpretación de cada dimensión según tipo de impacto
- Contexto para valores esperados

### Con Módulo 3 (Madurez):
- Síntomas específicos por cada modelo
- Velocidad esperada de evolución
- Capacidades críticas según patrón de pérdida

### Con Módulo 4 (Benchmarking):
- Comparación dentro del mismo modelo (1-8)
- Análisis de tendencias por arquetipo
- Mejores prácticas relevantes

---

## Conclusión

El Módulo de Modelos de Negocio v4.0 mantiene los 8 modelos de clasificación mientras evoluciona la comprensión de cómo cada uno pierde valor. Los arquetipos (Custodios, Conectores, Procesadores, Redundantes) son una herramienta conceptual que ayuda a entender patrones comunes, pero **la clasificación final siempre es en uno de los 8 modelos específicos**.

Esta evolución permite:

1. **Mantener continuidad**: Mismo sistema de 8 modelos
2. **Agregar profundidad**: Entender patrones de pérdida de valor
3. **Facilitar comunicación**: "Somos Software Crítico, perdemos como Procesador"
4. **Mejorar precisión**: Cada modelo con su perfil de impacto holístico

El cambio fundamental: Ya no medimos solo "¿puedes operar?" sino "¿cuánto valor de negocio proteges?"

---

*Digital Immunity Index 4.0 - Módulo 1: Modelos de Negocio*  
*8 modelos, 4 patrones, 1 visión holística*  
*"Tu modelo determina cómo pierdes valor, no solo operaciones"*