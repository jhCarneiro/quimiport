# QuimiPort

**Sistema de Gerenciamento de Cargas Químicas em Ambiente Portuário**

Projeto desenvolvido individualmente para o **Tech Challenge — Fase 2**, da Pós-Tech em Full Stack Development da FIAP.

## 1. Sobre o projeto

O **QuimiPort** é uma API REST desenvolvida para apoiar o gerenciamento de cargas químicas em ambientes portuários.

O sistema permite cadastrar produtos químicos, registrar cargas, associar produtos às cargas, controlar documentos e inspeções e acompanhar as etapas de liberação e movimentação.

Seu objetivo é proporcionar maior organização, rastreabilidade e segurança operacional no gerenciamento dessas cargas.

## 2. Funcionalidades

- Cadastro, consulta, atualização e inativação de produtos químicos.
- Cadastro e consulta de cargas químicas.
- Associação de produtos químicos às cargas.
- Registro e consulta de itens associados às cargas.
- Registro de documentos obrigatórios.
- Registro de inspeções.
- Controle do ciclo de vida das cargas.
- Bloqueio de cargas que apresentam restrições.
- Liberação de cargas conforme as regras de negócio.
- Movimentação e finalização de cargas.
- Cancelamento de cargas em estados permitidos.
- Persistência de dados no PostgreSQL.
- Documentação interativa dos endpoints com Swagger.
- Testes automatizados unitários, HTTP e de integração.
- Execução da aplicação e do banco de dados com Docker Compose.
- Pipeline de integração contínua com GitHub Actions.

## 3. Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| TypeScript | Linguagem principal |
| Node.js 24 | Ambiente de execução |
| Fastify | Framework para construção da API REST |
| PostgreSQL 17 | Banco de dados relacional |
| Prisma ORM 7 | Modelagem e persistência de dados |
| Docker | Containerização da aplicação |
| Docker Compose | Orquestração da API e do PostgreSQL |
| Vitest | Testes automatizados |
| Swagger | Documentação interativa da API |
| GitHub Actions | Integração contínua |

## 4. Arquitetura

O projeto utiliza uma arquitetura em camadas, inspirada em conceitos de Domain-Driven Design (DDD).

As responsabilidades são divididas da seguinte forma:

- **Domain:** entidades e regras de negócio.
- **Application:** casos de uso e contratos de repositórios.
- **Infrastructure:** integração com PostgreSQL e implementação dos repositórios utilizando Prisma.
- **Interfaces:** controllers, rotas e exposição da API HTTP por meio do Fastify.

Essa separação favorece a manutenção, a organização e a testabilidade do sistema.

### Estrutura principal

```text
quimiport/
├── .github/
│   └── workflows/
│       └── ci.yml
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
├── .dockerignore
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── prisma7.config.ts
├── tsconfig.json
├── vitest.config.ts
├── vitest.integration.config.ts
└── README.md
```

## 5. Modelagem do banco de dados

O projeto utiliza PostgreSQL com Prisma ORM para persistência dos dados.

As principais estruturas são:

| Tabela | Responsabilidade |
|---|---|
| `produtos_quimicos` | Armazenar informações dos produtos químicos |
| `cargas_quimicas` | Registrar e acompanhar cargas |
| `itens_carga` | Relacionar produtos químicos às cargas |
| `documentos` | Registrar documentos associados às cargas |
| `inspecoes` | Armazenar registros de inspeção |

A tabela `itens_carga` utiliza relacionamentos com produtos e cargas, permitindo representar cargas com múltiplos itens.

As alterações no esquema do banco são controladas por migrations versionadas do Prisma.

### Decisões arquiteturais

O PostgreSQL foi escolhido pelo suporte a relacionamentos, integridade referencial e transações.

O Prisma ORM facilita a implementação dos repositórios e o versionamento do esquema.

O Fastify foi escolhido para construir a API REST, oferecendo integração com schemas, logs estruturados e documentação Swagger.

O Vitest permite validar regras de negócio e operações de persistência de maneira automatizada.

## 6. Pré-requisitos

Para executar o projeto localmente, é necessário possuir:

- Node.js 24.
- npm.
- Docker Desktop ou Docker Engine.
- Docker Compose.
- Git, para clonar o repositório.

## 7. Instalação

Clone o repositório:

```bash
git clone https://github.com/jhCarneiro/quimiport.git
```

Entre na pasta:

```bash
cd quimiport
```

Instale as dependências, caso pretenda executar a aplicação fora do Docker:

```bash
npm ci
```

## 8. Executando a aplicação com Docker

Esta é a forma recomendada para executar o projeto completo.

O Docker Compose inicia dois serviços:

- `postgres`: banco de dados PostgreSQL 17.
- `api`: aplicação Node.js com Fastify.

A API aguarda o PostgreSQL estar saudável antes de iniciar.

### 8.1. Construir e iniciar os containers

Execute:

```bash
docker compose up --build -d
```

O Docker Compose realizará a construção da imagem da API, a inicialização do PostgreSQL e a execução da aplicação.

O comando de inicialização da API aplica as migrations pendentes antes de iniciar o servidor.

### 8.2. Verificar os containers

```bash
docker compose ps
```

Os serviços `api` e `postgres` devem aparecer em execução.

### 8.3. Consultar os logs

```bash
docker compose logs --tail=40 api
```

Para acompanhar os logs continuamente:

```bash
docker compose logs -f api
```

### 8.4. Acessar a aplicação

Após a inicialização:

**API:** http://localhost:3000

**Swagger:** http://localhost:3000/docs

**Health Check:** http://localhost:3000/health

O endpoint de saúde deve retornar uma resposta equivalente a:

```json
{
  "status": "ok",
  "sistema": "QuimiPort"
}
```

### 8.5. Encerrar os containers

```bash
docker compose down
```

**Atenção:** não utilize `docker compose down -v` se desejar preservar os dados armazenados no volume do PostgreSQL.

### Observação sobre segurança

As credenciais presentes na configuração de desenvolvimento são destinadas exclusivamente ao ambiente local.

Para uma implantação real, devem ser utilizadas credenciais próprias, segredos protegidos e configurações adequadas de rede e acesso ao banco.

## 9. Executando localmente sem o container da API

Também é possível executar o QuimiPort diretamente com Node.js, utilizando apenas o PostgreSQL no Docker.

### 9.1. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo de configuração local:

```env
DATABASE_URL="postgresql://quimiport:quimiport_dev@localhost:5432/quimiport?schema=public"
```

O endereço `localhost` é utilizado porque, neste cenário, a aplicação é executada fora do Docker.

### 9.2. Iniciar o PostgreSQL

```bash
docker compose up -d postgres
```

### 9.3. Instalar as dependências

```bash
npm ci
```

### 9.4. Gerar o Prisma Client

```bash
npm run db:generate
```

### 9.5. Aplicar as migrations

```bash
npm run db:migrate
```

### 9.6. Iniciar a API

```bash
npm run dev
```

A aplicação ficará disponível em:

http://localhost:3000

A documentação Swagger estará disponível em:

http://localhost:3000/docs

**Importante:** não execute a API local e o container `api` simultaneamente na mesma porta 3000.

## 10. Principais endpoints

A documentação completa, incluindo parâmetros, schemas e respostas, pode ser consultada no Swagger.

### Produtos químicos

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/produtos-quimicos` | Cadastrar produto químico |
| GET | `/produtos-quimicos` | Listar produtos químicos |
| GET | `/produtos-quimicos/:id` | Consultar produto por ID |
| PUT | `/produtos-quimicos/:id` | Atualizar produto |
| PATCH | `/produtos-quimicos/:id/inativar` | Inativar produto |

### Cargas químicas

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/cargas-quimicas` | Registrar carga |
| GET | `/cargas-quimicas` | Listar cargas |
| GET | `/cargas-quimicas/:id` | Consultar carga por ID |
| PATCH | `/cargas-quimicas/:id/transicionar` | Alterar status conforme o fluxo oficial |
| PATCH | `/cargas-quimicas/:id/cancelar` | Cancelar carga |
| PATCH | `/cargas-quimicas/:id/finalizar` | Finalizar carga |
| PATCH | `/cargas-quimicas/:id/status` | Operações de status do fluxo legado |
| PATCH | `/cargas-quimicas/:id/liberar` | Liberar carga |
| PATCH | `/cargas-quimicas/:id/movimentar` | Movimentar carga |
| PATCH | `/cargas-quimicas/:id/bloquear` | Bloquear carga |
| PATCH | `/cargas-quimicas/:id/regularizar` | Regularizar carga bloqueada no fluxo legado |

### Itens, documentos e inspeções

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/cargas-quimicas/:id/itens` | Associar item à carga |
| GET | `/cargas-quimicas/:id/itens` | Consultar itens da carga |
| POST | `/cargas-quimicas/:id/documentos` | Registrar documento |
| POST | `/cargas-quimicas/:id/inspecoes` | Registrar inspeção |

## 11. Exemplo de requisição

### Registro de carga química

**Método:** `POST`

**Endpoint:** `/cargas-quimicas`

Exemplo de corpo da requisição:

```json
{
  "codigo": "CARGA-001",
  "produtoQuimicoID": "UUID_DE_UM_PRODUTO_ATIVO",
  "quantidade": 100,
  "unidade": "L",
  "origem": "Santos",
  "destino": "Campinas",
  "responsavelTecnico": "Eng. Silva",
  "documentacaoObrigatoria": "FISPQ"
}
```

O identificador do produto deve corresponder a um produto previamente cadastrado e ativo.

Consulte o Swagger para verificar os campos obrigatórios e o formato exato aceito pela versão em execução.

## 12. Regras de negócio

O QuimiPort implementa validações relacionadas ao cadastro de produtos, registro de cargas e controle de movimentação.

### Produtos químicos

- O cadastro exige informações válidas.
- Produtos podem ser atualizados e inativados.
- Produtos inativos não devem ser associados a novas cargas.

### Cargas químicas

- A quantidade deve ser maior que zero.
- O registro deve conter as informações obrigatórias da carga.
- O produto associado deve existir e estar ativo.
- O responsável técnico deve ser informado.
- A liberação depende do atendimento às condições de documentação e inspeção.
- Cargas bloqueadas possuem restrições de movimentação.
- Cargas canceladas ou finalizadas não devem retornar ao fluxo operacional.

### Controle de estados

O fluxo principal da Fase 2 é:

```text
REGISTRADA
    |
    v
EM_ANALISE
    |
    v
EM_INSPECAO
    |
    v
LIBERADA
    |
    v
EM_MOVIMENTACAO
    |
    v
FINALIZADA
```

Existem caminhos alternativos para bloqueio e cancelamento, respeitando as transições permitidas.

O cancelamento é previsto a partir dos seguintes estados:

- `REGISTRADA`
- `EM_ANALISE`
- `EM_INSPECAO`
- `LIBERADA`
- `BLOQUEADA`

O bloqueio é previsto a partir de `EM_INSPECAO` no fluxo oficial.

Os estados `FINALIZADA` e `CANCELADA` são terminais.

Para liberação pelo endpoint de transição oficial, é necessário existir documentação registrada e inspeção aprovada, conforme as validações implementadas.

### Compatibilidade com estados anteriores

O projeto mantém reconhecimento de estados utilizados em versões anteriores:

- `PENDENTE_DOCUMENTACAO`
- `PENDENTE_INSPECAO`
- `MOVIMENTADA`

Essa compatibilidade não significa que os registros históricos sejam convertidos automaticamente para os novos estados.

## 13. Testes automatizados

O projeto utiliza Vitest para validar o comportamento da aplicação.

### Testes unitários e HTTP

Execute:

```bash
npm test
```

Esses testes verificam regras de negócio, casos de uso e comportamento das rotas HTTP.

### Validação de tipos

```bash
npm run typecheck
```

### Testes de integração

Os testes de integração utilizam um banco PostgreSQL separado, denominado `quimiport_test`.

Crie o arquivo `.env.test` na raiz do projeto:

```env
DATABASE_URL="postgresql://quimiport:quimiport_dev@localhost:5432/quimiport_test?schema=public"
```

Esse banco precisa existir e estar com as migrations aplicadas antes da execução.

No PowerShell, é possível carregar a variável de conexão para aplicar as migrations no banco de testes:

```powershell
$env:DATABASE_URL = (Get-Content .env.test | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1) -replace '^DATABASE_URL=', '' -replace '^["'']|["'']$', ''
```

Confirme o nome do banco:

```powershell
([uri]$env:DATABASE_URL).AbsolutePath
```

O resultado deve ser:

```text
/quimiport_test
```

Somente depois dessa confirmação, execute:

```bash
npm run db:migrate
```

Para executar os testes de integração:

```bash
npm run test:integration
```

**Atenção:** os testes de integração podem criar e modificar dados. Nunca utilize o banco principal `quimiport` para executá-los.

A configuração de integração verifica se o banco informado possui o nome `quimiport_test`.

### Resultados obtidos durante a validação

| Categoria | Testes aprovados |
|---|---:|
| Unitários e HTTP | 131 |
| Integração com PostgreSQL | 5 |
| **Total** | **136** |

Esses resultados foram obtidos no ambiente local de desenvolvimento e devem ser reproduzidos pelos avaliadores conforme as instruções anteriores.

## 14. Integração contínua

O projeto possui uma pipeline de integração contínua configurada em:

```text
.github/workflows/ci.yml
```

O GitHub Actions é acionado em eventos de `push` e `pull_request`.

As etapas configuradas são:

1. Baixar o código do repositório.
2. Configurar o Node.js 24.
3. Instalar as dependências.
4. Gerar o Prisma Client.
5. Executar a validação do TypeScript.
6. Executar os testes unitários e HTTP.

Os testes de integração com PostgreSQL são executados separadamente no ambiente de desenvolvimento.

A execução efetiva da pipeline deve ser conferida na aba **Actions** do repositório após a publicação do projeto.

## 15. Logs e monitoramento básico

A aplicação utiliza os logs do Fastify para registrar informações de execução e requisições.

Os logs do container da API podem ser consultados com:

```bash
docker compose logs -f api
```

A disponibilidade básica da API pode ser verificada em:

```text
GET /health
```

O endpoint permite confirmar se o servidor HTTP está respondendo.

## 16. Demonstração do projeto

A apresentação da Fase 2 pode ser realizada em um vídeo de aproximadamente 5 a 10 minutos.

Roteiro sugerido:

1. Apresentar o problema de gerenciamento de cargas químicas no ambiente portuário.
2. Explicar o objetivo e as funcionalidades do QuimiPort.
3. Mostrar a arquitetura em camadas e a modelagem do banco.
4. Demonstrar a inicialização com Docker Compose.
5. Acessar o Swagger e apresentar os endpoints.
6. Cadastrar um produto químico e registrar uma carga.
7. Demonstrar as validações e as transições de status.
8. Mostrar o registro de documentos e inspeções.
9. Executar os testes automatizados.
10. Apresentar o repositório e a pipeline do GitHub Actions.

## 17. Desenvolvedor

**Jhonatha Gabriell Carneiro**

Projeto desenvolvido individualmente para o Tech Challenge — Fase 2 da Pós-Tech em Full Stack Development da FIAP.

**GitHub:** https://github.com/jhCarneiro

**Repositório do projeto:** https://github.com/jhCarneiro/quimiport

---

**QuimiPort — Gerenciamento de Cargas Químicas com rastreabilidade e segurança operacional.**