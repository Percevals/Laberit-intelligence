/**
 * Plantilla de Datos Semanales para Dashboard de Inmunidad Digital
 * 
 * Este archivo define la estructura de datos que debe completarse cada semana
 * para generar el dashboard actualizado. Todos los campos son requeridos.
 * 
 * Fecha de creación: Template v1.0
 * Framework: Immunity Framework 3.0 con Business Fortress
 */

const weeklyData = {
  // Información temporal básica
  fecha: {
    rango_semana: "21-28 de Junio 2025", // Formato: "DD-DD de Mes YYYY"
    fecha_publicacion: "28 de Junio 2025", // Fecha de publicación del dashboard
    semana_numero: 26, // Número de semana del año
    trimestre: "Q2 2025" // Trimestre correspondiente
  },

  // Incidentes principales de la semana (mínimo 3, máximo 5)
  incidentes_principales: [
    {
      id: "INC001",
      pais: "Brasil",
      organizacion: "Banco do Brasil",
      fecha_incidente: "12 junio",
      tipo: "Exposición de Datos",
      impacto: "5 millones de clientes móviles expuestos",
      vector: "API vulnerable",
      fortaleza_estimada: 2.5,
      descripcion_completa: "Vulnerabilidad en app móvil permitió ver saldos ajenos por 1 hora. Sin pérdidas financieras pero riesgo reputacional masivo.",
      lecciones: "APIs son el nuevo perímetro, requieren auditoría continua",
      fuente: "Bitdefender"
    },
    {
      id: "INC002",
      pais: "Brasil",
      organizacion: "Prefeitura Porto Nacional",
      fecha_incidente: "24 junio",
      tipo: "Ransomware",
      impacto: "Gobierno local paralizado",
      vector: "Phishing",
      fortaleza_estimada: 1.5,
      descripcion_completa: "Gobierno local sin presupuesto de ciberseguridad sufre parálisis total por 48 horas",
      lecciones: "Sin presupuesto cyber adecuado, el colapso es inevitable",
      fuente: "Reuters"
    },
    {
      id: "INC003",
      pais: "Global",
      organizacion: "UNFI",
      fecha_incidente: "junio 2025",
      tipo: "Interrupción Operacional",
      impacto: "Cadena de suministro interrumpida",
      vector: "Supply Chain Attack",
      fortaleza_estimada: 2.5,
      descripcion_completa: "250,000 productos afectados. Distribuidor B2B forzado a shutdown completo por sistemas legacy comprometidos",
      lecciones: "Single points of failure en supply chain = vulnerabilidad crítica",
      fuente: "CyberSecurityDive"
    }
  ],

  // Menciones en Dark Web por región/sector
  dark_web_mentions: {
    por_pais: {
      brasil: {
        porcentaje: 31,
        tendencia: "aumentando", // "aumentando", "estable", "disminuyendo"
        tipos_principales: ["credenciales bancarias", "accesos corporativos", "datos PII"],
        precio_promedio_acceso: "$2,500 USD"
      },
      mexico: {
        porcentaje: 18,
        tendencia: "estable",
        tipos_principales: ["accesos RDP", "bases de datos retail", "credenciales gobierno"],
        precio_promedio_acceso: "$1,800 USD"
      },
      argentina: {
        porcentaje: 15,
        tendencia: "aumentando",
        tipos_principales: ["datos financieros", "accesos VPN", "información fiscal"],
        precio_promedio_acceso: "$1,200 USD"
      },
      colombia: {
        porcentaje: 12,
        tendencia: "estable",
        tipos_principales: ["accesos bancarios", "datos healthcare", "credenciales enterprise"],
        precio_promedio_acceso: "$1,500 USD"
      },
      otros_latam: {
        porcentaje: 24,
        tendencia: "disminuyendo",
        tipos_principales: ["mixed", "accesos diversos", "datos variados"],
        precio_promedio_acceso: "$800 USD"
      }
    },
    por_sector: {
      financiero: {
        menciones: 2847,
        variacion_semanal: "+15%",
        actores_principales: ["RansomHub", "BlackCat", "LockBit"],
        precio_datos: "$50-500 por registro"
      },
      gobierno: {
        menciones: 1523,
        variacion_semanal: "+28%",
        actores_principales: ["Blind Eagle", "APT28", "Lazarus"],
        precio_datos: "No comercial - espionaje"
      },
      salud: {
        menciones: 1102,
        variacion_semanal: "+8%",
        actores_principales: ["RansomHub", "Hive", "BlackMatter"],
        precio_datos: "$100-1000 por historia clínica"
      },
      retail: {
        menciones: 892,
        variacion_semanal: "-5%",
        actores_principales: ["Magecart", "FIN7", "Carbanak"],
        precio_datos: "$1-10 por tarjeta"
      }
    },
    foros_activos: [
      {
        nombre: "BreachForums",
        actividad: "Alta",
        focus_regional: "Global con sección LATAM",
        tipo_contenido: "Venta de accesos y datos"
      },
      {
        nombre: "XSS.is",
        actividad: "Media",
        focus_regional: "Rusia/CIS con interés en LATAM",
        tipo_contenido: "Exploits y herramientas"
      },
      {
        nombre: "Telegram Channels",
        actividad: "Muy Alta",
        focus_regional: "LATAM específico",
        tipo_contenido: "Coordinación de ataques y venta rápida"
      }
    ]
  },

  // Alertas específicas para clientes (personalizable por sector)
  client_alerts: {
    alertas_criticas: [
      {
        nivel: "CRITICO",
        titulo: "Campaña activa contra sector financiero brasileño",
        descripcion: "RansomHub targeting banks con inmunidad < 3.0",
        accion_requerida: "Revisar accesos privilegiados y MFA inmediatamente",
        sectores_afectados: ["Financiero", "Fintech"],
        iocs: ["185.220.101.45", "evil-domain.com", "hash:a1b2c3d4"],
        ttps: ["T1566.001", "T1059.001", "T1486"]
      },
      {
        nivel: "ALTO",
        titulo: "Vulnerabilidad crítica en APIs móviles",
        descripcion: "Similar a caso Banco do Brasil afectando apps financieras",
        accion_requerida: "Auditoría urgente de endpoints API móviles",
        sectores_afectados: ["Financiero", "E-commerce", "Fintech"],
        cve: ["CVE-2025-12345"],
        cvss: 9.8
      }
    ],
    alertas_preventivas: [
      {
        nivel: "MEDIO",
        titulo: "Aumento de phishing post-vacaciones",
        descripcion: "Patrón histórico muestra 40% aumento en julio",
        accion_requerida: "Reforzar training anti-phishing",
        metricas_esperadas: {
          aumento_esperado: "40%",
          vectores_principales: ["email", "SMS", "WhatsApp"],
          temas_comunes: ["vacaciones", "bonos", "actualización datos"]
        }
      }
    ],
    inteligencia_predictiva: {
      proximas_campanas: [
        {
          actor: "Scattered Spider",
          probabilidad: "85%",
          sectores_objetivo: ["Aviación", "Hospitalidad", "Gaming"],
          timeframe: "Próximas 2 semanas",
          indicadores: ["Aumento de reconnaissance", "Registro dominios similares"]
        }
      ],
      tendencias_emergentes: [
        {
          tendencia: "Ataques a infraestructura cloud",
          crecimiento: "+125% QoQ",
          sectores_riesgo: ["SaaS", "Fintech", "E-commerce"],
          mitigaciones_clave: ["Cloud Security Posture Management", "Zero Trust Architecture"]
        }
      ]
    }
  },

  // Métricas semanales del framework
  metricas_semanales: {
    inmunidad_regional: {
      promedio_general: 3.8,
      cambio_semanal: -0.2,
      interpretacion: "Deterioro por incidentes en Brasil y falta de inversión",
      por_arquetipo: {
        b2c_digital: { score: 3.5, cambio: -0.3 },
        plataforma: { score: 3.5, cambio: -0.1 },
        salud: { score: 2.0, cambio: -0.5 },
        b2c_volumen: { score: 3.2, cambio: 0.0 },
        b2g: { score: 1.5, cambio: -0.4 },
        b2b_industrial: { score: 2.5, cambio: -0.2 }
      }
    },
    ataques_detectados: {
      total_latam: 2569,
      cambio_porcentual: "+12%",
      comparacion_global: {
        latam: 2569,
        global: 1848,
        diferencia_porcentual: "+40%"
      },
      por_vector: {
        phishing_web_email: { cantidad: 1644, porcentaje: 64 },
        vulnerabilidades_api: { cantidad: 385, porcentaje: 15 },
        supply_chain: { cantidad: 282, porcentaje: 11 },
        ransomware: { cantidad: 180, porcentaje: 7 },
        otros: { cantidad: 78, porcentaje: 3 }
      }
    },
    efectividad_ataques: {
      // Tasa de éxito según nivel de inmunidad
      inmunidad_baja: { // < 4
        tasa_exito_phishing: 90,
        tasa_exito_ransomware: 85,
        tasa_exito_api: 85,
        tiempo_deteccion_promedio: "45 días"
      },
      inmunidad_media: { // 4-7
        tasa_exito_phishing: 45,
        tasa_exito_ransomware: 35,
        tasa_exito_api: 40,
        tiempo_deteccion_promedio: "7 días"
      },
      inmunidad_alta: { // > 7
        tasa_exito_phishing: 20,
        tasa_exito_ransomware: 10,
        tasa_exito_api: 15,
        tiempo_deteccion_promedio: "4 horas"
      }
    },
    grupos_apt_activos: [
      {
        nombre: "Scattered Spider",
        actividad: "MUY ALTA",
        sectores_objetivo: ["Aviación", "Gaming", "Hospitalidad"],
        inmunidad_objetivo: "< 4",
        ttps_principales: ["Social Engineering", "Help Desk Manipulation"],
        origen: "Internacional"
      },
      {
        nombre: "RansomHub",
        actividad: "ALTA",
        sectores_objetivo: ["Gobierno", "Salud", "Manufactura"],
        inmunidad_objetivo: "< 3",
        ttps_principales: ["Double Extortion", "RaaS Operations"],
        origen: "RaaS Platform"
      },
      {
        nombre: "Blind Eagle",
        actividad: "MEDIA",
        sectores_objetivo: ["Gobierno", "Infraestructura Crítica"],
        inmunidad_objetivo: "< 2.5",
        ttps_principales: ["Spear Phishing", "RATs customizados"],
        origen: "Regional LATAM"
      }
    ]
  },

  // Configuración del widget personalizable del cliente
  client_widget: {
    titulo: "Panel Ejecutivo - [NOMBRE_CLIENTE]",
    mensaje_principal: "Su organización está en el percentil [X] de su sector",
    metricas_destacadas: [
      {
        metrica: "Su Inmunidad",
        valor: "[SCORE_CLIENTE]",
        benchmark: "vs 3.8 promedio",
        tendencia: "mejorando" // "mejorando", "estable", "deteriorando"
      },
      {
        metrica: "Amenazas Relevantes",
        valor: "[NUM_AMENAZAS]",
        detalle: "dirigidas a su sector",
        prioridad: "alta"
      }
    ],
    acciones_prioritarias: [
      "Implementar MFA resistente a phishing",
      "Auditar APIs expuestas",
      "Actualizar plan de respuesta"
    ]
  },

  // Patrón confirmado de la semana (insight principal)
  patron_confirmado: "Modelos de negocio débiles = blancos fáciles. La tecnología no compensa una arquitectura empresarial vulnerable.",

  // Fuentes utilizadas
  fuentes: [
    "Reuters",
    "Bitdefender", 
    "CyberSecurityDive",
    "SocRadar",
    "Check Point Research",
    "Perplexity Analysis",
    "LATAM-CERT Network",
    "Dark Web Intelligence Feeds"
  ]
};

// Exportar para uso en generador de dashboards
module.exports = weeklyData;

// Función de validación de datos (opcional)
function validateWeeklyData(data) {
  const requiredFields = [
    'fecha',
    'incidentes_principales',
    'dark_web_mentions',
    'client_alerts',
    'metricas_semanales'
  ];
  
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    console.error('Campos faltantes:', missingFields);
    return false;
  }
  
  // Validar que hay al menos 3 incidentes
  if (data.incidentes_principales.length < 3) {
    console.error('Se requieren al menos 3 incidentes principales');
    return false;
  }
  
  console.log('✓ Datos semanales válidos');
  return true;
}

// Ejemplo de uso
// validateWeeklyData(weeklyData);