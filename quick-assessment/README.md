# DII Quick Assessment Tool

Digital Immunity Index 4.0 Quick Assessment - Una herramienta de evaluación rápida para medir la inmunidad digital organizacional.

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js 14+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run start
```

La aplicación estará disponible en `http://localhost:3000`

## 📱 Características

- **Evaluación en 3 pasos**: Modelo de negocio → 5 dimensiones → Resultado
- **8 modelos de negocio**: Desde Comercio Híbrido hasta Información Regulada
- **Cálculo en tiempo real**: Usando la fórmula DII 4.0
- **Responsive**: Diseñado mobile-first con Tailwind CSS
- **Resultados interpretados**: Con recomendaciones ejecutivas

## 🏗️ Estructura del Proyecto

```
quick-assessment/
├── src/
│   ├── core/               # Módulos de cálculo DII
│   │   ├── dii-calculator.js
│   │   └── business-models.js
│   ├── components/         # Componentes React
│   │   ├── ModelSelector.jsx
│   │   ├── QuestionSlider.jsx
│   │   └── ResultDisplay.jsx
│   ├── App.jsx            # Componente principal
│   ├── index.jsx          # Punto de entrada
│   └── index.css          # Estilos con Tailwind
├── index.html
├── package.json
└── vite.config.js
```

## 🔧 Desarrollo

### Ejecutar tests
```bash
npm test
```

### Construir para producción
```bash
npm run build
```

### Vista previa de producción
```bash
npm run preview
```

## 📊 La Fórmula DII

```
DII Raw = (TRD × AER) / (HFP × BRI × RRG)
DII Score = (DII Raw / DII Base del Modelo) × 10
```

Donde:
- **TRD**: Time to Revenue Degradation
- **AER**: Attack Economics Ratio
- **HFP**: Human Failure Probability
- **BRI**: Blast Radius Index
- **RRG**: Recovery Reality Gap

## 🎯 Flujo de Usuario

1. **Selección de Modelo**: El usuario elige entre 8 modelos de negocio
2. **Evaluación de Dimensiones**: Responde 5 preguntas usando sliders (1-10)
3. **Resultado**: Obtiene su DII Score con interpretación y recomendaciones

## 🎨 Personalización

Los colores del tema están definidos en `tailwind.config.js`:
- Primary: `#2c3e50`
- Secondary: `#3498db`
- Success: `#2ecc71`
- Warning: `#f39c12`
- Danger: `#e74c3c`

## 📝 Licencia

© 2025 Lãberit Intelligence. Todos los derechos reservados.

## 🤝 Contribuir

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte o consultas sobre el DII 4.0, contacte a Lãberit Intelligence.