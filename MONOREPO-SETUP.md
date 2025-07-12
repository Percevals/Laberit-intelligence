# Configuración del Monorepo - Estado Actual

## 🚨 Estado Actual

Los packages del monorepo están creados pero **NO están activos** en producción para evitar errores en GitHub Actions.

### Packages Creados:
- `@dii/core` - Lógica de cálculo DII y modelos de negocio
- `@dii/types` - Definiciones TypeScript
- `@dii/ui-kit` - Componentes UI compartidos

### ¿Por qué no están activos?

GitHub Actions no puede resolver las dependencias locales del workspace sin configuración adicional. Para mantener el deployment funcionando, la app sigue usando imports locales.

## 🔧 Para Activar el Monorepo Localmente

1. **Instalar dependencias del monorepo**:
```bash
# En la raíz del proyecto
npm install

# Esto instalará Turborepo
```

2. **Crear symlinks de los packages**:
```bash
# Opción 1: Usar npm workspaces (recomendado)
npm install --workspaces

# Opción 2: Crear links manualmente
cd packages/core && npm link
cd ../types && npm link  
cd ../ui-kit && npm link

cd ../../apps/assessment-light
npm link @dii/core @dii/types @dii/ui-kit
```

3. **Actualizar los imports en App.jsx**:
```javascript
// Cambiar de:
import { calculateDII } from './core/dii-calculator.js';
import { businessModels } from './core/business-models.js';

// A:
import { calculateDII, businessModels } from '@dii/core';
```

4. **Ejecutar con Turborepo**:
```bash
npm run dev:light
```

## 📦 Para Deployment en Producción

Opciones para hacer que funcione en GitHub Actions:

### Opción 1: Publicar packages en npm (Recomendado para producción)
```bash
# Publicar en npm registry
cd packages/core && npm publish
cd ../types && npm publish
cd ../ui-kit && npm publish
```

### Opción 2: Usar GitHub Packages
Configurar npm para usar GitHub Packages y publicar ahí los packages privados.

### Opción 3: Build monolítico (Actual)
Mantener los imports locales hasta tener una solución de CI/CD más robusta.

## 🚀 Próximos Pasos

1. **Desarrollo Local**: Usa los packages del monorepo
2. **Producción**: Mantén imports locales hasta resolver CI/CD
3. **Futuro**: Migrar a Vercel/Netlify que soportan monorepos nativamente

## 📝 Scripts Útiles

```bash
# Desarrollo con monorepo
npm run dev                 # Todos los apps
npm run dev:light          # Solo assessment-light
npm run build:light        # Build assessment-light

# Testing
npm run test               # Todos los tests
npm run lint               # Linting
```