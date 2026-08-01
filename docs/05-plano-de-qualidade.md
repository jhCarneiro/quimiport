# 5. Plano de Qualidade de Software

## 5.1 Objetivo

O Plano de Qualidade tem como objetivo garantir que a aplicação QuimiPort seja desenvolvida de forma confiável, segura e aderente às regras de negócio definidas para o gerenciamento de cargas químicas em ambiente portuário.

A estratégia de qualidade será aplicada de forma incremental nas próximas fases do projeto.

---

# 5.2 Regras de Negócio Críticas

As seguintes regras de negócio deverão possuir testes obrigatórios:

| Código | Regra |
|--------|-------|
| RN01 | Não permitir registrar carga sem produto químico. |
| RN02 | Não permitir utilizar produto químico inativo. |
| RN03 | Não permitir registrar carga sem responsável técnico. |
| RN04 | Quantidade deve ser maior que zero. |
| RN05 | Toda carga deve possuir documentação obrigatória. |
| RN06 | Documentos vencidos invalidam a carga. |
| RN07 | Carga bloqueada não pode ser movimentada. |
| RN08 | Apenas cargas aprovadas podem ser liberadas. |
| RN09 | Toda alteração relevante gera um evento no histórico. |
| RN10 | Alterações críticas exigem nova validação da carga. |

---

# 5.3 Casos de Uso Críticos

Os seguintes casos de uso foram identificados como essenciais para o funcionamento do sistema:

- Registrar Carga;
- Anexar Documentação;
- Validar Documentação;
- Registrar Inspeção;
- Liberar Carga;
- Movimentar Carga;
- Consultar Histórico.

Esses casos de uso receberão maior atenção durante a implementação dos testes.

---

# 5.4 Estratégia de Testes

A aplicação utilizará diferentes níveis de testes para garantir sua qualidade.

## Testes Unitários

Objetivo:

Validar individualmente as regras de negócio presentes no domínio.

Exemplos:

- Validar quantidade maior que zero;
- Validar produto ativo;
- Validar documentação obrigatória;
- Validar transição de status.

---

## Testes de Integração

Objetivo:

Validar a comunicação entre as camadas da aplicação.

Serão testadas integrações entre:

- Casos de uso e repositórios;
- Persistência de dados;
- Serviços de domínio;
- APIs futuras.

---

## Testes Funcionais

Objetivo:

Validar os principais fluxos do sistema do ponto de vista do usuário.

Exemplos:

- Cadastro completo de uma carga;
- Processo de validação documental;
- Processo de inspeção;
- Liberação da carga;
- Movimentação da carga.

---

# 5.5 Dados Simulados (Mocks)

Durante os testes serão utilizados dados simulados para evitar dependência de banco de dados ou serviços externos.

Serão criados mocks para:

- Produtos químicos;
- Cargas químicas;
- Documentos;
- Responsáveis técnicos;
- Inspeções;
- Áreas de armazenamento.

---

# 5.6 Critérios de Qualidade

O projeto deverá atender aos seguintes critérios:

- Regras de negócio testadas;
- Código organizado por responsabilidades;
- Baixo acoplamento entre camadas;
- Alta coesão das classes;
- Cobertura dos principais fluxos de negócio;
- Facilidade para manutenção e evolução.

---

# 5.7 Ferramentas Previstas

Nas próximas fases serão utilizadas ferramentas voltadas para testes automatizados.

Entre elas:

- Jest;
- Mock Functions;
- Test Doubles;
- Testes de Integração;
- Coverage Reports.

---

# 5.8 Considerações Finais

A estratégia de qualidade definida para o QuimiPort busca garantir que a aplicação evolua de forma segura e sustentável, priorizando a validação das regras de negócio mais importantes e dos fluxos críticos do domínio.