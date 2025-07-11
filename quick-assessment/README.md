# DII Quick Assessment Tool

Digital Immunity Index 4.0 Quick Assessment - Una herramienta de evaluación rápida para medir la inmunidad digital organizacional con análisis de IA integrado.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://percevals.github.io/Laberit-intelligence/quick-assessment/)
[![DII Version](https://img.shields.io/badge/DII-4.0-blue.svg)](../README.md)
[![AI Powered](https://img.shields.io/badge/AI-powered-purple.svg)](./src/services/ai/README.md)

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 14+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

La aplicación estará disponible en `http://localhost:5173`

## 📱 Características Principales

### Evaluación Base
- **Evaluación en 3 pasos**: Modelo de negocio → 5 dimensiones → Resultado
- **8 modelos de negocio**: Desde Comercio Híbrido hasta Información Regulada
- **Cálculo en tiempo real**: Usando la fórmula DII 4.0
- **Responsive**: Diseñado mobile-first con Tailwind CSS
- **Resultados interpretados**: Con recomendaciones ejecutivas

### 🤖 Nuevas Capacidades con IA (Julio 2025)

#### 1. **Análisis de Compromiso Existente**
- Calcula probabilidad de que la organización ya esté comprometida
- Basado en indicadores operacionales y patrones de comportamiento
- Muestra comparación con promedio de la industria
- Estima tiempo de permanencia de atacantes (dwell time)

#### 2. **Análisis Económico Inteligente**
- Solicita contexto de ingresos antes de mostrar pérdidas genéricas
- Calcula impacto por hora basado en:
  - **0-6h**: Sin detección ($0)
  - **6-24h**: 10% degradación
  - **24-72h**: 40% degradación
  - **72h+**: 80% pérdida crítica
- Considera resiliencia natural del modelo de negocio
- Compara con incidentes reales: "Empresa similar de $5M enfrentó pérdidas de $47K"

#### 3. **Simulador What-If Interactivo**
- Ajusta parámetros en tiempo real:
  - Tiempo de detección (1-24h)
  - % Operaciones afectadas (10-100%)
  - Velocidad de recuperación (5x más rápido a 2x más lento)
- Paquetes de inversión con ROI:
  - Básico ($50K)
  - Avanzado ($200K)
  - Integral ($500K)
- Muestra ahorro proyectado y período de recuperación

### 🔧 Proveedores de IA Soportados
- **Claude (Anthropic)**: Para análisis sofisticados
- **OpenAI**: Próximamente
- **Offline**: Modo demo sin API keys (por defecto)

### 📊 Configuración

#### Variables de Entorno
```bash
# Opcional - funciona sin configuración
VITE_AI_PROVIDER=auto      # auto|claude|openai|offline
VITE_AI_MODE=demo          # demo|api|offline
VITE_CLAUDE_KEY=sk-...     # Solo para modo api
```

## 🏗️ Estructura del Proyecto

```
quick-assessment/
├── src/
│   ├── core/                    # Módulos de cálculo DII (NO MODIFICAR)
│   │   ├── dii-calculator.js   # Fórmula DII 4.0
│   │   └── business-models.js   # 8 modelos de negocio
│   │
│   ├── services/               # Servicios y lógica
│   │   ├── ai/                 # Servicio de IA
│   │   │   ├── AIService.js    # Servicio principal
│   │   │   ├── providers/      # Proveedores (Claude, Offline)
│   │   │   ├── hooks.js        # React hooks
│   │   │   └── README.md       # Documentación AI
│   │   └── config/
│   │       └── ai.config.js    # Configuración IA
│   │
│   ├── components/             # Componentes React
│   │   ├── ModelSelector.jsx   # Selector de modelo
│   │   ├── QuestionSlider.jsx  # Sliders de dimensiones
│   │   ├── ResultDisplay.jsx   # Resultados DII
│   │   ├── CompromiseScore.jsx # Análisis de compromiso
│   │   ├── EnhancedCompromiseScore.jsx # Con análisis económico
│   │   ├── RevenueContext.jsx  # Contexto de ingresos
│   │   ├── EconomicImpactCalculator.jsx # Cálculo económico
│   │   ├── ImpactWhatIfSimulator.jsx # Simulador interactivo
│   │   └── AIStatusBadge.jsx   # Indicador de proveedor IA
│   │
│   ├── App.jsx                 # Componente principal
│   ├── index.jsx               # Punto de entrada
│   └── index.css               # Estilos con Tailwind
│
├── docs/                       # Documentación
│   └── AI-INTEGRATION.md      # Guía de integración IA
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo local
npm run dev              # Inicia servidor de desarrollo en http://localhost:5173

# Producción
npm run build           # Construye la aplicación para producción
npm run preview         # Vista previa de la build de producción

# Testing (próximamente)
npm run test            # Ejecutar tests
```

### Flujo de Trabajo

1. **Usuario selecciona modelo de negocio** → Define contexto de resiliencia
2. **Evalúa 5 dimensiones** → TRD, AER, HFP, BRI, RRG
3. **Cálculo DII** → Resultado 0-10 con interpretación
4. **Análisis IA** → Probabilidad de compromiso + contexto
5. **Análisis económico** → Impacto personalizado basado en ingresos
6. **Simulación What-If** → ROI de mejoras propuestas

## 📊 Ejemplos de Uso

### Caso 1: Retailer Mediano (Comercio Híbrido)
- **Ingresos**: $500K/mes
- **DII Score**: 3.5 (Robusto)
- **Compromiso**: 45% probabilidad
- **Impacto 72h**: $35K
- **Con inversión $50K**: Reduce a $18K, ROI 9 meses

### Caso 2: Fintech (Servicios Financieros)
- **Ingresos**: $5M/mes
- **DII Score**: 1.8 (Frágil)
- **Compromiso**: 85% probabilidad
- **Impacto 72h**: $850K
- **Con inversión $200K**: Reduce a $425K, ROI 6 meses

### Caso 3: SaaS B2B (Software Crítico)
- **Ingresos**: $2M/mes
- **DII Score**: 4.2 (Robusto)
- **Compromiso**: 55% probabilidad
- **Impacto 72h**: $180K
- **Con inversión $500K**: Reduce a $65K, ROI 18 meses

## 🚀 Despliegue

La aplicación se despliega automáticamente en GitHub Pages mediante GitHub Actions:

1. Cada push a `main` activa el workflow
2. Build automático con Vite
3. Despliegue en: https://percevals.github.io/Laberit-intelligence/quick-assessment/

## 🔒 Seguridad

- **Sin almacenamiento de datos**: Todo el procesamiento es local
- **API Keys opcionales**: Funciona completamente sin claves
- **Sanitización de datos**: Limpieza antes de enviar a IA
- **HTTPS obligatorio**: En producción

## 📝 Licencia

Este proyecto es parte del Digital Immunity Index 4.0 Framework desarrollado por Lãberit Intelligence.

## 🤝 Contribuciones

1. Fork el repositorio
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/Percevals/Laberit-intelligence/issues)
- **Email**: soporte@laberit.com
- **Documentación**: [Wiki del proyecto](https://github.com/Percevals/Laberit-intelligence/wiki)

---

© 2025 Lãberit Intelligence. Todos los derechos reservados.