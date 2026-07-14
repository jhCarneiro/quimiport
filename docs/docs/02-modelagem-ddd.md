# 2. Modelagem do Domínio (DDD)

## 2.1 Objetivo

A modelagem do domínio do QuimiPort foi desenvolvida utilizando os princípios de Domain-Driven Design (DDD), com o objetivo de representar os principais conceitos do negócio de forma clara, organizada e independente da tecnologia utilizada.

O domínio foi estruturado considerando as regras de negócio relacionadas ao gerenciamento de cargas químicas em ambiente portuário, priorizando a segurança operacional, a rastreabilidade e a conformidade das operações.

---

# 2.2 Linguagem Ubíqua

A equipe definiu uma linguagem comum para garantir consistência entre a documentação, os diagramas e a implementação.

| Termo | Definição |
|--------|-----------|
| Produto Químico | Substância química cadastrada no sistema. |
| Carga Química | Unidade operacional que representa uma carga de produtos químicos. |
| Responsável Técnico | Profissional habilitado responsável pela carga. |
| Documento | Documento obrigatório para validação da carga. |
| Inspeção | Processo de verificação da conformidade da carga. |
| Conformidade | Situação em que todos os requisitos foram atendidos. |
| Não Conformidade | Pendência encontrada durante validações. |
| Status da Carga | Estado atual da carga dentro do processo. |
| Liberação | Autorização para movimentação da carga. |
| Bloqueio | Impedimento da movimentação da carga. |
| Histórico | Registro cronológico dos eventos ocorridos. |
| Área de Armazenamento | Local destinado ao armazenamento da carga. |

---

# 2.3 Aggregate Root

A entidade **Carga Química** foi definida como a Aggregate Root do domínio.

Todas as alterações relacionadas ao processo de gerenciamento da carga devem ocorrer através desta entidade, garantindo a integridade das regras de negócio.

A Carga Química é responsável por controlar:

- Produto químico associado;
- Responsável técnico;
- Documentação;
- Inspeções;
- Histórico de eventos;
- Status da carga;
- Quantidade armazenada.

---

# 2.4 Entidades

As seguintes entidades foram identificadas durante a modelagem:

| Entidade | Descrição |
|-----------|-----------|
| CargaQuimica | Representa uma carga química cadastrada no sistema. |
| ProdutoQuimico | Representa um produto químico disponível para utilização. |
| Documento | Documento obrigatório associado à carga. |
| Inspecao | Registro de inspeções realizadas na carga. |
| ResponsavelTecnico | Profissional responsável tecnicamente pela carga. |
| AreaArmazenamento | Local onde a carga permanece armazenada. |

---

# 2.5 Value Objects

Foram identificados os seguintes Value Objects:

| Value Object | Descrição |
|---------------|-----------|
| Quantidade | Valor acompanhado da unidade de medida. |
| NumeroONU | Código internacional do produto químico. |
| ClasseRisco | Classificação oficial de risco do produto. |
| StatusCarga | Estado atual da carga durante seu ciclo de vida. |
| HistoricoEvento | Registro imutável das alterações da carga. |
| EnderecoArmazenamento | Localização física dentro da área de armazenamento. |

---

# 2.6 Domain Services

Para manter a Aggregate Root focada nas regras centrais do negócio, foram definidos os seguintes serviços de domínio:

| Serviço | Responsabilidade |
|----------|------------------|
| ServicoValidacaoDocumental | Validar documentação obrigatória e sua validade. |
| ServicoInspecao | Gerenciar as inspeções da carga. |
| ServicoLiberacaoCarga | Verificar se todos os critérios para liberação foram atendidos. |

---

# 2.7 Regras do Domínio

| ID | Regra |
|----|--------|
| RN01 | Toda carga deve possuir um produto químico válido. |
| RN02 | O produto químico deve estar ativo. |
| RN03 | Toda carga deve possuir um responsável técnico. |
| RN04 | A quantidade deve ser maior que zero. |
| RN05 | Todos os documentos obrigatórios devem existir. |
| RN06 | Documentos vencidos invalidam a carga. |
| RN07 | Não pode existir documento duplicado do mesmo tipo. |
| RN08 | A inspeção somente pode ocorrer após a validação documental. |
| RN09 | Apenas inspeções aprovadas permitem a liberação da carga. |
| RN10 | Uma carga bloqueada não pode ser movimentada. |
| RN11 | Toda alteração gera um evento no histórico. |
| RN12 | A carga somente pode ser liberada quando todas as validações forem concluídas com sucesso. |
| RN13 | Após movimentada, a carga não pode retornar para estados anteriores. |
| RN14 | Qualquer alteração crítica exige nova validação da conformidade da carga. |

---

# 2.8 Máquina de Estados

O ciclo de vida da carga é composto pelos seguintes estados:

- REGISTRADA
- EM_VALIDAÇÃO
- DOCUMENTAÇÃO_APROVADA
- EM_INSPEÇÃO
- BLOQUEADA
- LIBERADA
- MOVIMENTADA

As transições de estado obedecem às regras de negócio definidas neste documento.

---

# 2.9 Considerações Finais

A modelagem foi construída utilizando os conceitos fundamentais de Domain-Driven Design.

A definição da Carga Química como Aggregate Root permite centralizar as regras de negócio, garantindo maior consistência do domínio e facilitando futuras evoluções da aplicação.

Os Domain Services concentram responsabilidades específicas, enquanto os Value Objects representam conceitos imutáveis do domínio. Essa organização torna a solução mais coesa, testável e aderente às boas práticas de arquitetura de software.