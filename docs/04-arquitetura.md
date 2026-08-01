# 4. Arquitetura Proposta

## 4.1 Objetivo

A arquitetura da aplicação QuimiPort foi definida com foco em separação de responsabilidades, manutenibilidade, escalabilidade e aderência aos princípios estudados durante a fase da Pós-Tech.

O projeto foi organizado considerando que a aplicação será evoluída nas próximas fases para uma solução Full Stack completa.

---

# 4.2 Arquitetura em Camadas

A solução será organizada em cinco camadas principais.

## Apresentação (Presentation)

Responsável pela interação com o usuário.

Responsabilidades:

- Receber requisições;
- Validar entradas básicas;
- Exibir informações;
- Encaminhar solicitações para a camada de aplicação.

Exemplos futuros:

- API REST
- Frontend Web

---

## Aplicação (Application)

Responsável por orquestrar os casos de uso.

Responsabilidades:

- Coordenar o fluxo da aplicação;
- Invocar regras do domínio;
- Controlar transações;
- Retornar resultados para a camada de apresentação.

Exemplos:

- RegistrarCargaUseCase
- ValidarDocumentacaoUseCase
- LiberarCargaUseCase

---

## Domínio (Domain)

Camada central da aplicação.

Responsabilidades:

- Entidades;
- Value Objects;
- Aggregate Root;
- Domain Services;
- Regras de negócio.

Nesta camada não existirão dependências de banco de dados ou frameworks.

---

## Infraestrutura (Infrastructure)

Responsável pela comunicação com recursos externos.

Responsabilidades:

- Persistência de dados;
- Repositórios;
- APIs externas;
- Serviços de autenticação;
- Logs.

---

## Testes (Tests)

Responsável pela validação da aplicação.

Serão implementados:

- Testes unitários;
- Testes de integração;
- Testes de regras de negócio.

---

# 4.3 Organização Inicial

A estrutura prevista para o projeto é:

```text
quimiport/

docs/
diagrams/

src/
 ├── application/
 ├── domain/
 ├── infrastructure/
 ├── presentation/
 └── shared/

tests/

README.md
```

---

# 4.4 Fluxo da Aplicação

O fluxo principal seguirá a sequência:

Usuário

↓

Presentation

↓

Application

↓

Domain

↓

Infrastructure

↓

Banco de Dados

A camada de domínio permanece independente das demais camadas, garantindo baixo acoplamento e alta coesão.

---

# 4.5 Benefícios da Arquitetura

A arquitetura proposta oferece os seguintes benefícios:

- Separação clara de responsabilidades;
- Facilidade de manutenção;
- Evolução gradual do sistema;
- Maior facilidade para testes;
- Baixo acoplamento entre componentes;
- Reaproveitamento das regras de negócio;
- Preparação para futuras integrações.

---

# 4.6 Evolução do Projeto

Nas próximas fases da Pós-Tech, a arquitetura permitirá:

- Implementação de uma API REST em TypeScript;
- Desenvolvimento do frontend da aplicação;
- Persistência em banco de dados relacional;
- Integração com serviços externos;
- Autenticação e autorização;
- Deploy em ambiente de nuvem.

Essa organização garante que a aplicação possa crescer sem comprometer sua estrutura arquitetural.