# QuimiPort

## Sobre o Projeto

O **QuimiPort** é um sistema de gerenciamento de cargas químicas em ambiente portuário, desenvolvido como parte do Tech Challenge da Pós-Tech em Full Stack Development da FIAP.

A aplicação tem como objetivo organizar o cadastro, a documentação, a inspeção, a liberação e a movimentação de cargas químicas, promovendo rastreabilidade e segurança operacional.

## Funcionalidades

- Cadastro e consulta de produtos químicos.
- Cadastro e consulta de cargas químicas.
- Associação de produtos às cargas.
- Registro de documentos.
- Registro de inspeções.
- Controle dos estados das cargas.
- Bloqueio e regularização de cargas.
- Liberação de cargas após inspeção.
- Movimentação de cargas liberadas.
- Persistência de dados no PostgreSQL.
- Documentação interativa da API com Swagger.

## Tecnologias Utilizadas

- **TypeScript** — linguagem principal.
- **Node.js** — ambiente de execução.
- **Fastify** — framework HTTP.
- **PostgreSQL** — banco de dados relacional.
- **Prisma ORM** — acesso e persistência de dados.
- **Docker Compose** — execução do banco de dados.
- **Vitest** — testes automatizados.
- **Swagger** — documentação da API.

## Arquitetura

O projeto utiliza uma arquitetura em camadas, com separação entre regras de negócio, casos de uso, infraestrutura e interface HTTP, incorporando conceitos de Domain-Driven Design (DDD).

```text
quimiport/
├── docs/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── domain/
│   │   └── entities/
│   ├── application/
│   │   ├── repositories/
│   │   └── use-cases/
│   ├── infrastructure/
│   │   ├── database/
│   │   └── repositories/
│   ├── interfaces/
│   │   └── http/
│   │       ├── controllers/
│   │       ├── routes/
│   │       └── server.ts
│   └── tests/
├── docker-compose.yml
├── prisma7.config.ts
└── README.md
```

## Pré-requisitos

Para executar o projeto localmente, é necessário ter instalado:

- Node.js compatível com o projeto.
- npm.
- Docker Desktop com Docker Compose.

## Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone URL_DO_REPOSITORIO
cd quimiport
```

Instale as dependências:

```bash
npm install
```

## Configuração do Banco de Dados

Crie um arquivo `.env` na raiz do projeto com a variável:

```env
DATABASE_URL="postgresql://quimiport:quimiport_dev@localhost:5432/quimiport?schema=public"
```

Inicie o PostgreSQL com Docker:

```bash
docker compose up -d
```

Aplique as migrations:

```bash
npx prisma migrate deploy --config prisma7.config.ts
```

Gere o Prisma Client:

```bash
npx prisma generate --config prisma7.config.ts
```

## Executando a Aplicação

Inicie a API:

```bash
npx tsx src/interfaces/http/server.ts
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

A documentação Swagger poderá ser acessada em:

```text
http://localhost:3000/docs
```

## Principais Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/produtos-quimicos` | C