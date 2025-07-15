# Fundamentos de Clasificación de Modelos de Negocio - DII 4.0
## Guía de Enriquecimiento de Base de Datos Empresarial

### Introducción
Este documento establece los fundamentos para clasificar empresas según su modelo de negocio real, no su industria tradicional. La clasificación determina el "ADN del riesgo" de cada organización y su estrategia de resiliencia óptima.

---

## 1. COMERCIO HÍBRIDO
### Definición Core
Organizaciones que mantienen operaciones físicas significativas complementadas con canales digitales. La tecnología mejora pero no reemplaza el core del negocio.

### Características Identificadoras
- **Dependencia Digital**: 30-60%
- **Tolerancia a Interrupción**: 24-48 horas
- **Modelo de Ingresos**: Ventas físicas > 40% del total
- **Infraestructura Crítica**: Puntos de venta, inventario físico, logística última milla

### Señales de Clasificación
- Presencia de tiendas físicas o almacenes
- Sistema POS como tecnología principal
- E-commerce como canal complementario (no principal)
- Inventario físico significativo

### Ejemplos LATAM
- Falabella, Liverpool, Cencosud
- Farmacias con delivery (Farmacia Guadalajara, Cruz Verde)
- Retailers tradicionales con app móvil

### Riesgo DNA
- **Fortaleza**: Redundancia natural física
- **Vulnerabilidad**: Integración omnicanal crea puntos de falla
- **Impacto por hora**: $5K-$20K USD

---

## 2. SOFTWARE CRÍTICO
### Definición Core
Proveedores de software/SaaS donde la interrupción del servicio impacta directamente las operaciones de sus clientes empresariales.

### Características Identificadoras
- **Dependencia Digital**: 70-90%
- **Tolerancia a Interrupción**: 6-24 horas
- **Modelo de Ingresos**: Suscripciones recurrentes o licencias
- **Infraestructura Crítica**: Cloud computing, APIs, bases de datos multi-tenant

### Señales de Clasificación
- Modelo SaaS B2B
- Clientes empresariales dependientes
- SLAs contractuales < 99.9%
- Actualizaciones continuas de software

### Ejemplos LATAM
- Siigo, ContPAQi, Aspel (ERP/Contabilidad)
- Totvs, Softland, Defontana
- Plataformas verticales críticas (gestión médica, educativa)

### Riesgo DNA
- **Fortaleza**: Agilidad para parchear y actualizar
- **Vulnerabilidad**: Efecto cascada en múltiples clientes
- **Impacto por hora**: $15K-$50K USD

---

## 3. SERVICIOS DE DATOS
### Definición Core
Empresas cuyo valor principal radica en la recopilación, procesamiento y monetización de información.

### Características Identificadoras
- **Dependencia Digital**: 80-95%
- **Tolerancia a Interrupción**: 4-12 horas
- **Modelo de Ingresos**: Venta de insights, reportes o acceso a datos
- **Infraestructura Crítica**: Data lakes, pipelines de procesamiento, APIs de consulta

### Señales de Clasificación
- Datos como producto principal
- APIs de consulta masiva
- Modelos de pricing por volumen de consultas
- Actualización continua de datasets

### Ejemplos LATAM
- Bureaus de crédito (DataCrédito, Círculo de Crédito)
- Empresas de inteligencia de mercado
- Proveedores de datos geoespaciales o demográficos

### Riesgo DNA
- **Fortaleza**: Datos históricos mantienen valor
- **Vulnerabilidad**: Breach expone activo principal
- **Impacto por hora**: $25K-$75K USD

---

## 4. ECOSISTEMA DIGITAL
### Definición Core
Plataformas multi-actor donde el valor emerge de las interacciones entre participantes (marketplaces, redes).

### Características Identificadoras
- **Dependencia Digital**: 95-100%
- **Tolerancia a Interrupción**: 0-6 horas
- **Modelo de Ingresos**: Comisiones por transacción o publicidad
- **Infraestructura Crítica**: Plataforma central, sistemas de pago, matching algorithms

### Señales de Clasificación
- Modelo de negocio de dos o más lados
- Efectos de red evidentes
- Sin inventario propio
- Crecimiento exponencial con usuarios

### Ejemplos LATAM
- MercadoLibre, OLX, Rappi
- Uber, Didi, Beat (movilidad)
- Airbnb, Booking (localizado)

### Riesgo DNA
- **Fortaleza**: Resiliencia distribuida en la red
- **Vulnerabilidad**: Complejidad de actores multiplica vectores
- **Impacto por hora**: $50K-$200K USD

---

## 5. SERVICIOS FINANCIEROS
### Definición Core
Organizaciones cuyo core es el movimiento, custodia o gestión de dinero y activos financieros.

### Características Identificadoras
- **Dependencia Digital**: 95-100%
- **Tolerancia a Interrupción**: 0-2 horas
- **Modelo de Ingresos**: Intereses, comisiones, spreads
- **Infraestructura Crítica**: Core bancario, redes de pago, sistemas de cumplimiento

### Señales de Clasificación
- Licencia financiera regulada
- Procesamiento de pagos como core
- Conexión a redes bancarias (SPEI, ACH, SWIFT)
- Requerimientos PCI-DSS o similares

### Ejemplos LATAM
- Neobancos (Nubank, Ualá, RappiPay)
- Procesadores de pago (Clip, MercadoPago, PayU)
- Fintechs de crédito (Konfío, Creditas)

### Riesgo DNA
- **Fortaleza**: Alta inversión en seguridad por regulación
- **Vulnerabilidad**: Target prioritario + impacto regulatorio
- **Impacto por hora**: $100K-$500K USD

---

## 6. INFRAESTRUCTURA HEREDADA
### Definición Core
Organizaciones tradicionales con sistemas legacy críticos que han agregado capas digitales sin modernización fundamental.

### Características Identificadoras
- **Dependencia Digital**: 20-50%
- **Tolerancia a Interrupción**: 2-24 horas (variable por sistema)
- **Modelo de Ingresos**: Tradicional con componentes digitales
- **Infraestructura Crítica**: Mainframes, sistemas propietarios, SCADA/OT

### Señales de Clasificación
- Sistemas core > 10 años
- Múltiples capas de integración
- Dependencia de hardware específico
- Documentación técnica escasa

### Ejemplos LATAM
- Empresas estatales (CFE, Pemex, YPF)
- Gobierno (sistemas tributarios, registro civil)
- Utilities tradicionales con medición inteligente

### Riesgo DNA
- **Fortaleza**: Sistemas aislados por antigüedad
- **Vulnerabilidad**: Imposible parchear, costoso reemplazar
- **Impacto por hora**: $30K-$150K USD

---

## 7. CADENA DE SUMINISTRO
### Definición Core
Empresas cuya operación principal es mover bienes físicos con trazabilidad digital crítica.

### Características Identificadoras
- **Dependencia Digital**: 40-70%
- **Tolerancia a Interrupción**: 12-48 horas
- **Modelo de Ingresos**: Tarifas por envío/almacenamiento
- **Infraestructura Crítica**: WMS, TMS, tracking systems, IoT

### Señales de Clasificación
- Flota propia o control logístico
- Sistemas de tracking en tiempo real
- Integraciones EDI/API con clientes
- KPIs de entrega como métrica principal

### Ejemplos LATAM
- Operadores logísticos (DHL, Estafeta, Coordinadora)
- 3PLs regionales
- Empresas de última milla con tecnología

### Riesgo DNA
- **Fortaleza**: Operación física puede continuar manualmente
- **Vulnerabilidad**: Pérdida de visibilidad = pérdida de confianza
- **Impacto por hora**: $20K-$80K USD

---

## 8. INFORMACIÓN REGULADA
### Definición Core
Organizaciones que manejan datos altamente sensibles bajo estrictas normativas de cumplimiento.

### Características Identificadoras
- **Dependencia Digital**: 60-80%
- **Tolerancia a Interrupción**: 2-12 horas
- **Modelo de Ingresos**: Servicios basados en confianza/cumplimiento
- **Infraestructura Crítica**: Sistemas de gestión de datos, control de acceso, audit trails

### Señales de Clasificación
- Certificaciones obligatorias (HIPAA, ISO 27001)
- Auditorías regulatorias frecuentes
- Penalizaciones significativas por breach
- Datos personales sensibles como core

### Ejemplos LATAM
- Hospitales y clínicas privadas
- Aseguradoras de salud
- Laboratorios clínicos
- Instituciones educativas con datos de menores

### Riesgo DNA
- **Fortaleza**: Controles obligatorios por regulación
- **Vulnerabilidad**: Target valioso + multas millonarias
- **Impacto por hora**: $40K-$120K USD

---

## Matriz de Validación Cruzada

| Señal Digital | CH | SC | SD | ED | SF | IH | CS | IR |
|---------------|----|----|----|----|----|----|----|----|
| APIs públicas > 10 | ❌ | ✓ | ✓ | ✓ | ✓ | ❌ | ⚠️ | ⚠️ |
| Transacciones/día > 100K | ⚠️ | ⚠️ | ✓ | ✓ | ✓ | ❌ | ❌ | ⚠️ |
| Empleados tech > 30% | ❌ | ✓ | ✓ | ✓ | ✓ | ❌ | ⚠️ | ⚠️ |
| Cumplimiento mandatorio | ❌ | ❌ | ⚠️ | ⚠️ | ✓ | ⚠️ | ❌ | ✓ |
| Inventario físico > 20% | ✓ | ❌ | ❌ | ❌ | ❌ | ⚠️ | ✓ | ❌ |

**Leyenda**: ✓ Siempre | ⚠️ A veces | ❌ Rara vez

---

## Estrategia de Enriquecimiento por Fases

### Fase 1: Clasificación Manual (Mes 1)
1. Identificar 50 empresas paradigmáticas por modelo
2. Documentar señales específicas de cada una
3. Validar con método DII formal

### Fase 2: Semi-Automatización (Mes 2-3)
1. Desarrollar scoring basado en señales digitales
2. Usar fuentes públicas para validación
3. Crear confidence score por empresa

### Fase 3: Escalamiento (Mes 4-6)
1. APIs de enriquecimiento automático
2. Machine learning para clasificación
3. Validación continua con assessments reales

---

## Fuentes de Datos Prioritarias

### Nivel 1 - Gratuitas/Públicas
- **LinkedIn Company Pages**: Tamaño, industria, descripción
- **Registros mercantiles**: Razón social, actividad económica
- **Google Maps API**: Ubicaciones físicas (valida Comercio Híbrido)
- **Certificados SSL**: Subdominios indican complejidad digital

### Nivel 2 - Bajo Costo
- **Clearbit/FullContact**: Enriquecimiento automático
- **BuiltWith**: Stack tecnológico (valida Software Crítico)
- **SimilarWeb**: Tráfico y engagement (valida Ecosistema Digital)

### Nivel 3 - Premium
- **D&B Hoovers**: Data financiera completa
- **Bureau van Dijk**: Ownership y estructura
- **Regulatorios específicos**: Bancos centrales, superintendencias

---

## Métricas de Éxito

1. **Cobertura**: 80% de empresas objetivo clasificadas en 6 meses
2. **Precisión**: 90% de concordancia con assessment formal
3. **Actualización**: Revalidación trimestral de clasificaciones
4. **Confianza**: Score > 0.7 para 70% de la base

---

*Documento Base v1.0 - Fundamentos para Estrategia de Enriquecimiento DII 4.0*