#!/bin/sh
set -e

# Garante que DATABASE_URL está disponível (passada via env_file ou variável de ambiente)
if [ -z "$DATABASE_URL" ]; then
  echo "ERRO: DATABASE_URL não está definida. Configure a variável no .env ou env_file do docker-compose."
  exit 1
fi

echo "✔ DATABASE_URL detectada"
echo "→ Executando prisma migrate deploy..."
npx prisma migrate deploy

echo "→ Iniciando a API..."
exec node dist/app.js
