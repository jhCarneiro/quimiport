
FROM node:24-bookworm-slim

WORKDIR /app

# Instalar OpenSSL para compatibilidade com Prisma
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependências
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copiar arquivos do Prisma
COPY prisma ./prisma
COPY prisma7.config.ts ./prisma7.config.ts

# Copiar arquivos da aplicação
COPY tsconfig.json ./tsconfig.json
COPY src ./src

# Gerar Prisma Client e validar TypeScript
RUN npm run db:generate && npm run typecheck

ENV NODE_ENV=production

EXPOSE 3000

# Aplicar migrations e iniciar API
CMD ["sh", "-c", "npm run db:migrate && npm run start"]
