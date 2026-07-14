# 1. Entendimento do Domínio

## 1.1 Contexto do Problema

O Porto de Santos é um dos maiores polos logísticos da América Latina e movimenta diariamente diversos tipos de cargas, incluindo produtos químicos classificados como perigosos. Essas cargas exigem um controle rigoroso devido aos riscos ambientais, operacionais e à segurança das pessoas envolvidas na operação.

Atualmente, muitas informações relacionadas às cargas químicas são registradas de forma manual ou distribuídas entre diferentes sistemas, dificultando a rastreabilidade das operações, a validação da documentação obrigatória e o cumprimento das normas de segurança.

Nesse contexto, surge a necessidade de uma solução capaz de centralizar todas as informações referentes às cargas químicas, garantindo maior controle, confiabilidade e suporte à tomada de decisão.

---

# 1.2 Objetivo do Sistema

O QuimiPort é um sistema de gestão e controle de conformidade de cargas químicas em ambiente portuário.

Seu principal objetivo é acompanhar todo o ciclo de vida de uma carga química, desde seu registro até sua liberação para movimentação, assegurando que todas as validações técnicas, documentais e operacionais sejam realizadas antes da autorização da operação.

O sistema busca aumentar a segurança operacional, reduzir falhas humanas, garantir a rastreabilidade das informações e facilitar o gerenciamento das cargas químicas.

---

# 1.3 Escopo da Solução

Nesta primeira fase, o sistema será responsável por:

- Cadastrar produtos químicos;
- Registrar cargas químicas;
- Associar produtos às cargas;
- Controlar a documentação obrigatória;
- Registrar o responsável técnico;
- Acompanhar o status da carga;
- Registrar inspeções;
- Aplicar regras de negócio para bloqueio ou liberação das cargas;
- Manter o histórico das movimentações realizadas.

O QuimiPort será responsável exclusivamente pelo gerenciamento da conformidade das cargas químicas.

Processos relacionados à logística de transporte, roteirização, controle financeiro, faturamento, estoque geral do porto ou integração com sistemas externos não fazem parte do escopo desta solução.

Essa delimitação permite que o sistema seja especializado no controle da conformidade operacional das cargas químicas, mantendo o foco no domínio proposto pelo projeto.

---

# 1.4 Usuários Envolvidos

Os usuários do QuimiPort representam diferentes áreas da operação portuária e interagem com o sistema de acordo com suas responsabilidades dentro do processo de gestão das cargas químicas.

### Operador Portuário

Responsável pelo cadastro das cargas químicas e pelo acompanhamento de todo o seu ciclo de vida.

### Responsável Técnico

Profissional responsável por validar tecnicamente a carga e garantir que ela atenda aos requisitos necessários para movimentação.

### Analista de Documentação

Responsável pela conferência, validação e aprovação da documentação obrigatória.

### Analista de Qualidade

Executa inspeções, registra conformidades ou não conformidades e emite pareceres técnicos quando necessário.

### Gestor Operacional

Monitora todas as operações envolvendo cargas químicas, acompanha indicadores e auxilia na tomada de decisões.

### Administrador do Sistema

Gerencia usuários, permissões de acesso e configurações da plataforma.

---

# 1.5 Fluxo Operacional

O funcionamento do sistema seguirá o fluxo abaixo:

1. O produto químico é previamente cadastrado e permanece ativo para utilização.

2. O Operador Portuário registra uma nova carga química.

3. O sistema realiza uma validação inicial verificando:
   - Produto ativo;
   - Quantidade informada;
   - Classe de risco;
   - Responsável técnico.

4. A documentação obrigatória é enviada e analisada pelo Analista de Documentação.

5. Quando necessário, o Analista de Qualidade realiza uma inspeção.

6. O sistema aplica automaticamente as regras de negócio definidas para validação da carga.

7. Caso todas as validações sejam aprovadas, a carga é liberada para movimentação.

8. Caso alguma validação seja reprovada, a carga permanece bloqueada até que todas as pendências sejam resolvidas.

9. Todas as alterações realizadas permanecem registradas no histórico da carga, garantindo total rastreabilidade.

Cada etapa do fluxo depende da aprovação da etapa anterior, garantindo que nenhuma carga seja movimentada sem atender aos requisitos mínimos de segurança e conformidade.

---

# 1.6 Informações Controladas

O QuimiPort será responsável pelo gerenciamento das seguintes informações:

- Produtos químicos;
- Cargas químicas;
- Responsáveis técnicos;
- Documentação obrigatória;
- Inspeções;
- Áreas de armazenamento;
- Histórico de alterações;
- Status das cargas.

Essas informações permitirão acompanhar todo o ciclo de vida das cargas químicas, garantindo rastreabilidade, conformidade e maior segurança operacional.

---

# 1.7 Princípios do Domínio

O domínio do QuimiPort foi concebido com base nos seguintes princípios:

- Segurança operacional como prioridade em todas as etapas do processo;
- Rastreabilidade completa das cargas químicas durante todo o seu ciclo de vida;
- Validação obrigatória antes da liberação para movimentação;
- Centralização das informações em um único sistema;
- Suporte à tomada de decisão baseado na conformidade das cargas;
- Padronização dos processos para reduzir falhas operacionais;
- Garantia de conformidade com as exigências legais e operacionais relacionadas ao gerenciamento de produtos químicos.

Esses princípios nortearão tanto a modelagem do domínio quanto as futuras regras de negócio e decisões arquiteturais do projeto.

---

# 1.8 Considerações Finais

O QuimiPort não tem como objetivo controlar a logística do porto ou gerenciar operações de transporte.

Seu foco está exclusivamente na gestão do ciclo de vida das cargas químicas, assegurando que todas as exigências legais, técnicas e operacionais sejam atendidas antes da movimentação da carga.

Dessa forma, o sistema atua como uma ferramenta de apoio à decisão, contribuindo para a segurança operacional, rastreabilidade das informações e cumprimento das normas relacionadas ao armazenamento e movimentação de produtos químicos em ambiente portuário.