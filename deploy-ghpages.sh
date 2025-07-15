#!/bin/bash

echo "🧹 Limpiando carpetas anteriores..."
rm -rf dist/
rm -rf docs/

echo "🛠️  Generando build de producción..."
ng build --configuration production --output-path dist/miLogin/browser --base-href /FrontEndAPIS/

echo "📁 Copiando archivos estáticos a carpeta docs/"
mkdir docs
cp -r dist/miLogin/browser/* docs/

echo "✅ Listo para GitHub Pages. Subiendo cambios..."
git add docs
git commit -m "🚀 Build automático para GitHub Pages"
git push origin main

echo "🌐 Abre: https://romanreynaldo.github.io/FrontEndAPIS/"
