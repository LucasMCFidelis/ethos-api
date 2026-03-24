# Ethos API

API REST do projeto Ethos, construída com Fastify, TypeScript, Prisma e PostgreSQL.

---

## 📑 Índice

- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Banco de Dados](#-banco-de-dados)
- [Executando o Projeto](#-executando-o-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Documentação da API](#-documentação-da-api)
- [Endpoints](#-endpoints)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pipeline CI/CD](#-pipeline-cicd)

---

## 🧰 Tecnologias

| Tecnologia | Versão | Finalidade |
|-----------|--------|------------|
| [Fastify](https://fastify.dev/) | ^5.8.2 | Framework HTTP |
| [TypeScript](https://www.typescriptlang.org/) | ^5.9.3 | Tipagem estática |
| [Prisma](https://www.prisma.io/) | ^7.5.0 | ORM e migrations |
| [PostgreSQL](https://www.postgresql.org/) | — | Banco de dados relacional |
| [Zod](https://zod.dev/) | ^4.3.6 | Validação de schemas |
| [@fastify/swagger](https://github.com/fastify/fastify-swagger) | ^9.7.0 | Documentação OpenAPI 3.0 |
| [@fastify/cors](https://github.com/fastify/fastify-cors) | ^11.2.0 | Configuração de CORS |

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- npm v9 ou superior
- Instância PostgreSQL acessível (local ou remota)

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/LucasMCFidelis/ethos-api.git
cd ethos-api

# Instale as dependências
npm ci
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base nas variáveis abaixo:

```env
# Obrigatório — string de conexão com o PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/ethos"

# Opcionais
NODE_ENV="development"
PORT=3000
HOST="localhost"
```

> O campo `DATABASE_URL` é obrigatório. A aplicação não inicializa sem ele.

---

## 🗄️ Banco de Dados

```bash
# Gerar o Prisma Client a partir do schema
npm run db:generate

# Criar e aplicar migrations em desenvolvimento
npm run db:migrate

# Aplicar migrations em produção (sem interação)
npm run db:migrate:prod

# Popular o banco com dados iniciais
npm run db:seed

# Abrir o Prisma Studio (interface visual)
npm run db:studio

# Resetar o banco (apaga tudo e reaaplica migrations)
npm run db:reset
```

---

## ▶️ Executando o Projeto

### Desenvolvimento (hot reload)

```bash
npm run dev
```

### Produção

```bash
# Compilar TypeScript
npm run build

# Iniciar o servidor compilado
npm start
```

O servidor estará disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

---

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento com hot reload via `tsx watch` |
| `npm run build` | Compila o TypeScript para `./dist` |
| `npm start` | Inicia o servidor a partir do build compilado |
| `npm run lint` | Executa o ESLint |
| `npm run lint:fix` | Executa o ESLint com correção automática |
| `npm run format` | Formata os arquivos com Prettier |
| `npm run format:check` | Verifica formatação sem alterar arquivos |
| `npm run typecheck` | Verifica tipos sem emitir arquivos |
| `npm run db:generate` | Gera o Prisma Client |
| `npm run db:migrate` | Cria e aplica migrations (dev) |
| `npm run db:migrate:prod` | Aplica migrations (produção) |
| `npm run db:seed` | Executa o seed do banco |
| `npm run db:studio` | Abre o Prisma Studio |
| `npm run db:reset` | Reseta o banco de dados |

---

## 📖 Documentação da API

A documentação interativa (Swagger UI) está disponível em:

| Ambiente | URL |
|----------|-----|
| Local | http://localhost:3000/api/v1/docs |
| Desenvolvimento | https://ethos-api-develop.onrender.com/api/v1/docs |

---

## 🔌 Endpoints

Todos os endpoints são prefixados com `/api/v1`.

### Health

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/v1/health` | Verifica o status da API e a conectividade com o banco |

**Resposta 200 — API e banco operacionais:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "services": {
    "database": "ok"
  }
}
```

**Resposta 503 — Banco inacessível:**
```json
{
  "status": "degraded",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "services": {
    "database": "unreachable"
  }
}
```

---

## 🗂️ Estrutura do Projeto

```
ethos-api/
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline CI/CD
├── prisma/
│   ├── schema.prisma            # Schema do banco de dados
│   └── seed.ts                  # Seed de dados iniciais
├── src/
│   ├── generated/
│   │   └── prisma/              # Prisma Client gerado (não editar)
│   ├── lib/
│   │   └── prisma.ts            # Instância global do PrismaClient
│   ├── plugins/
│   │   ├── config.ts            # Plugin de variáveis de ambiente (@fastify/env)
│   │   └── swagger.ts           # Plugin de documentação OpenAPI
│   ├── routes/
│   │   └── health.ts            # Rota de health check
│   └── app.ts                   # Entrypoint — configuração do servidor
├── prisma.config.ts             # Configuração do Prisma CLI
├── tsconfig.json
├── .prettierrc
└── package.json
```

---

## 🔁 Pipeline CI/CD

O arquivo `.github/workflows/ci.yml` define a pipeline de integração e deploy contínuo.

### Gatilhos

- Push nas branches `main`, `homolog` e `develop`
- Pull Requests (todas as branches)

### Etapas

1. Checkout do repositório
2. Setup do Node.js v24
3. Instalação de dependências (`npm ci`)
4. Lint (`npm run lint`)
5. Geração do Prisma Client + Build TypeScript
6. Deploy automático no Render (apenas em push) via webhook armazenado em `RENDER_DEPLOY_HOOK_URL_DEV`

### Secrets necessários

| Secret | Descrição |
|--------|-----------|
| `RENDER_DEPLOY_HOOK_URL_DEV` | URL do deploy hook do ambiente de desenvolvimento no Render |
