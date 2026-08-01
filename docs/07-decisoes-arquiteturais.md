# 7. Decisões Arquiteturais

## 7.1 Objetivo

Este documento apresenta as principais decisões arquiteturais adotadas durante a concepção da aplicação QuimiPort.

---

# 7.2 Utilização do Domain Driven Design

Foi adotado Domain Driven Design (DDD) para organizar o domínio da aplicação e concentrar as regras de negócio na camada de domínio.

Essa abordagem facilita a evolução da aplicação e reduz o acoplamento entre as camadas.

---

# 7.3 Utilização do TypeScript

O TypeScript foi escolhido por oferecer tipagem forte, melhor manutenção do código e maior segurança durante o desenvolvimento.

---

# 7.4 Arquitetura em Camadas

A arquitetura foi dividida em:

- Presentation;
- Application;
- Domain;
- Infrastructure;
- Tests.

Essa separação facilita a manutenção e a evolução da solução.

---

# 7.5 Aggregate Root

A entidade CargaQuimica foi definida como Aggregate Root do domínio.

Todas as alterações relacionadas à carga devem ocorrer por meio dessa entidade.

---

# 7.6 Domain Services

Serviços de domínio foram definidos para concentrar regras complexas que envolvem múltiplas entidades.

Exemplos:

- ServicoValidacaoDocumental;
- ServicoInspecao;
- ServicoLiberacaoCarga.

---

# 7.7 Evolução da Aplicação

A arquitetura permitirá evoluções futuras como:

- API REST;
- Frontend Web;
- Banco de dados relacional;
- Autenticação;
- Deploy em nuvem;
- Aplicação Mobile.

---

# 7.8 Baixo Acoplamento

As responsabilidades foram separadas em camadas independentes, reduzindo dependências entre os componentes da aplicação.

---

# 7.9 Escalabilidade

A arquitetura proposta foi planejada para suportar novas funcionalidades sem necessidade de grandes alterações estruturais.

---

# 7.10 Considerações Finais

As decisões arquiteturais adotadas garantem uma base sólida para as próximas fases do projeto, permitindo evolução contínua da aplicação e aderência às boas práticas de engenharia de software.