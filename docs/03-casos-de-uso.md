# 3. Casos de Uso

## 3.1 Atores

O sistema QuimiPort possui seis atores principais:

| Ator | Descrição |
|------|-----------|
| Administrador | Gerencia usuários, permissões e configurações do sistema. |
| Operador Portuário | Registra cargas e acompanha as operações logísticas. |
| Analista Documental | Analisa e valida a documentação das cargas. |
| Inspetor de Segurança | Realiza inspeções de segurança e registra seus resultados. |
| Responsável Técnico | Acompanha as cargas sob sua responsabilidade e responde por aspectos técnicos. |
| Gestor | Consulta indicadores, relatórios e acompanha a operação do porto. |

## 3.2 Objetivo

Os atores interagem com o sistema para garantir que o processo de recebimento, validação, inspeção, liberação e movimentação das cargas químicas ocorra de forma segura, rastreável e conforme as regras de negócio definidas no domínio.

## 3.3 Casos de Uso

| Código | Caso de Uso | Ator Principal |
|---------|-------------|----------------|
| UC01 | Autenticar no Sistema | Todos os usuários |
| UC02 | Registrar Carga | Operador Portuário |
| UC03 | Anexar Documentos | Operador Portuário |
| UC04 | Validar Documentação | Analista Documental |
| UC05 | Registrar Inspeção | Inspetor de Segurança |
| UC06 | Liberar Carga | Sistema |
| UC07 | Movimentar Carga | Operador Portuário |
| UC08 | Consultar Carga | Perfis autorizados |
| UC09 | Consultar Histórico | Gestor |
| UC10 | Gerenciar Cadastros | Administrador |

# 3.4 Especificação dos Casos de Uso

---

## UC02 – Registrar Carga

**Objetivo**

Permitir que um Operador Portuário registre uma nova carga química no sistema.

**Ator Principal**

Operador Portuário.

**Pré-condições**

- Usuário autenticado;
- Produto químico previamente cadastrado;
- Responsável técnico disponível.

**Fluxo Principal**

1. O operador acessa o cadastro de cargas.
2. Informa os dados da carga.
3. Seleciona o produto químico.
4. Define o responsável técnico.
5. Informa a quantidade.
6. Confirma o cadastro.
7. O sistema registra a carga com status **Pendente de Documentação**.

**Regras de Negócio**

- Produto deve estar ativo.
- Quantidade deve ser maior que zero.
- Responsável técnico é obrigatório.

**Pós-condição**

Carga registrada com sucesso.

---

## UC03 – Anexar Documentação

**Objetivo**

Permitir anexar os documentos obrigatórios da carga.

**Ator Principal**

Operador Portuário.

**Fluxo Principal**

1. Selecionar a carga.
2. Anexar documentos.
3. Confirmar envio.

**Regras**

- Apenas documentos válidos.
- Não permitir documentos vencidos.

---

## UC04 – Validar Documentação

**Ator Principal**

Analista Documental.

**Fluxo Principal**

1. Consultar documentos.
2. Validar conformidade.
3. Aprovar ou reprovar.

**Resultado**

Carga segue para inspeção ou retorna para correção.

---

## UC05 – Registrar Inspeção

**Ator Principal**

Inspetor de Segurança.

**Fluxo Principal**

1. Selecionar carga.
2. Registrar inspeção.
3. Informar resultado.
4. Salvar inspeção.

---

## UC06 – Liberar Carga

**Objetivo**

Liberar uma carga apta para movimentação.

**Pré-condições**

- Documentação aprovada.
- Inspeção aprovada.

**Resultado**

Carga recebe status **Liberada**.

---

## UC07 – Movimentar Carga

**Objetivo**

Registrar a movimentação física da carga.

**Regra**

Não permitir movimentação de cargas bloqueadas.