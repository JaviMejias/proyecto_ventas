#!/usr/bin/env bash
set -o errexit

echo "🔧 Instalando dependencias"
bundle install --jobs 4 --retry 3

echo "🖌️  Compilando assets"
bin/rails assets:precompile
bin/rails assets:clean

echo "📦 Migrando base de datos"
bin/rails db:migrate

echo "✅ Build completado"
