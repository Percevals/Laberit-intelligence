#!/bin/bash

echo "🔄 Actualizando dependencias de forma segura..."
echo "============================================"

# Actualizar assessment-light
echo "📦 Actualizando Assessment Light..."
cd apps/assessment-light

# Limpiar cache
rm -rf node_modules package-lock.json

# Instalar con las versiones actualizadas
npm install

# Verificar vulnerabilidades
echo ""
echo "🔍 Verificando vulnerabilidades..."
npm audit

echo ""
echo "✅ Actualización completa!"
echo ""
echo "Próximos pasos:"
echo "1. Ejecuta: npm run dev"
echo "2. Verifica que todo funcione correctamente"
echo "3. Haz commit de los cambios"