
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# DATABASE_URL dummy apenas para o prisma generate
# não conecta ao banco — só satisfaz a validação do prisma.config.ts
ARG DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV DATABASE_URL=${DATABASE_URL}

RUN npm run db:generate
RUN npm run build

# ─────────────────────────────────────────────
FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
# Instala apenas dependências de produção sem rodar scripts
RUN npm ci --omit=dev --ignore-scripts

# Artefatos do builder
COPY --from=builder /app/dist ./dist
# Copia o cliente Prisma gerado
COPY --from=builder /app/src/generated ./src/generated

# Arquivos necessários para migrate deploy em runtime
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

# Arquivos de dados do projeto (tracks, etc.)
COPY config ./config

EXPOSE 3001

# Copia e configura o entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]