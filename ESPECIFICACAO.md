# Especificação — Projeto de Teste (Aula B01A02)

**Disciplina:** Engenharia de Software (203680)
**Aula:** B01A02 — Planejamento de V&V e técnicas de teste de software

## Objetivo pedagógico

Um projeto Node.js pequeno, mas estruturado para permitir o uso da maior
parte das técnicas de teste vistas na aula B01A02:

- Particionamento de equivalência e análise de valor-limite (caixa-preta)
- Teste de caminho básico, grafo de fluxo e complexidade ciclomática
  (caixa-branca)
- Teste de condição, teste de fluxo de dados (variações de
  caixa-branca)
- Teste de unidade orientado a objetos / teste de conjunto (classe)
- Teste de componentes e teste de interface
- Teste de sistema, teste de lançamento (baseado em requisitos e em
  cenário)
- Teste-alfa, teste-beta e teste de aceitação (simulados em sala)
- Rastreabilidade dos casos de teste aos requisitos

Para manter o projeto simples, teste de ciclo e teste de
desempenho/estresse ficam de fora (não há laço relevante nem requisito de
volume).

A tabela na seção final mapeia explicitamente cada técnica a um módulo
desta especificação.

## Requisitos funcionais

| ID | Requisito |
|---|---|
| RF-01 | O sistema deve avaliar um pedido de empréstimo dados idade e renda mensal, retornando aprovação/rejeição e limite de crédito. |
| RF-02 | O sistema deve permitir abrir uma carteira digital com saldo inicial ≥ 0. |
| RF-03 | O sistema deve permitir depositar valores positivos numa carteira aberta. |
| RF-04 | O sistema deve permitir sacar valores positivos de uma carteira aberta, nunca deixando o saldo negativo. |
| RF-05 | O sistema deve permitir aplicar uma taxa de juros (0 a 100%) sobre o saldo de uma carteira aberta. |
| RF-06 | O sistema deve impedir qualquer operação (depósito, saque, juros, fechamento) numa carteira já fechada. |
| RF-07 | O sistema deve permitir fechar uma carteira aberta, retornando o saldo final. |
| RF-08 | O sistema deve gerar uma mensagem textual de notificação a partir do resultado de uma avaliação de empréstimo. |
| RF-09 | O sistema deve expor as operações acima via interface de linha de comando (CLI). |

## Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF-01 | Em nenhuma sequência de operações válidas o saldo de uma carteira pode ficar negativo. |

---

## Módulo 1 — `emprestimo.js`

```js
/**
 * Avalia um pedido de empréstimo.
 *
 * @param {number} idade        - idade do solicitante, em anos completos (inteiro)
 * @param {number} rendaMensal  - renda mensal do solicitante, em reais
 * @returns {{
 *   aprovado: boolean,
 *   motivo: string | null,        // preenchido só quando aprovado = false
 *   limiteCredito: number | null  // preenchido só quando aprovado = true
 * }}
 */
function avaliarPedidoEmprestimo(idade, rendaMensal) { /* ... */ }
```

**Regras de negócio** (RF-01):

1. Idade precisa estar entre 18 e 70 anos, **inclusive**. Fora disso →
   rejeitado, `motivo: "IDADE_FORA_DO_LIMITE"`.
2. Renda mensal precisa ser ≥ R$ 1.200,00 (verificado só se a idade já
   passou na regra 1). Abaixo disso → rejeitado,
   `motivo: "RENDA_INSUFICIENTE"`.
3. Faixas de limite de crédito (para quem passou nas regras 1 e 2):
   - Renda em `[1200, 3000)` → `limiteCredito = rendaMensal × 2`
   - Renda em `[3000, 8000)` → `limiteCredito = rendaMensal × 3`
   - Renda em `[8000, ∞)` → `limiteCredito = rendaMensal × 5`
4. Se `idade >= 65`, o limite calculado na regra 3 é **reduzido pela
   metade** (`limiteCredito = limiteCredito / 2`), independentemente da
   faixa de renda.
5. Aprovado ⇒ `motivo = null`. Rejeitado ⇒ `limiteCredito = null`.

**Fronteiras relevantes (BVA):** 17/18, 70/71, 1199,99/1200, 2999,99/3000,
7999,99/8000, 64/65.

---

## Módulo 2 — `carteira.js`

Classe com estado — **use exatamente esta máquina de estados** (é a base
do exercício de teste de unidade orientado a objetos, no mesmo espírito do
exemplo `Conta` visto na aula):

```
FECHADA --abrir()--> ABERTA --depositar()/sacar()/aplicarJuros()--> ABERTA --fechar()--> FECHADA
```

```js
class CarteiraDigital {
  /** Estado inicial: FECHADA. */
  constructor() { /* ... */ }

  /**
   * Abre a carteira. Só válido quando o estado é FECHADA.
   * @param {number} saldoInicial - deve ser >= 0
   * @throws {Error} "SALDO_INICIAL_INVALIDO" se saldoInicial < 0
   * @throws {Error} "CARTEIRA_JA_ABERTA" se já estiver aberta
   */
  abrir(saldoInicial) { /* ... */ }

  /**
   * @param {number} valor - deve ser > 0
   * @throws {Error} "CARTEIRA_FECHADA" | "VALOR_INVALIDO"
   */
  depositar(valor) { /* ... */ }

  /**
   * @param {number} valor - deve ser > 0 e <= saldo atual
   * @throws {Error} "CARTEIRA_FECHADA" | "VALOR_INVALIDO" | "SALDO_INSUFICIENTE"
   */
  sacar(valor) { /* ... */ }

  /**
   * @param {number} taxaPercentual - deve estar entre 0 e 100, inclusive
   * @throws {Error} "CARTEIRA_FECHADA" | "TAXA_INVALIDA"
   */
  aplicarJuros(taxaPercentual) { /* ... */ }

  /** @returns {number} saldo atual (funciona em qualquer estado) */
  obterSaldo() { /* ... */ }

  /**
   * Fecha a carteira e retorna o saldo final.
   * @throws {Error} "CARTEIRA_JA_FECHADA"
   * @returns {number}
   */
  fechar() { /* ... */ }
}
```

**Regras de negócio** (RF-02 a RF-07): ver contrato acima — cada exceção
listada é uma regra de validação explícita.

**Sequência mínima de teste** (equivalente à sequência
`abrir → estabelecer → depositar → retirar → fechar` do exemplo visto em
aula): `abrir(100) → depositar(50) → sacar(30) → aplicarJuros(10) →
fechar()`. Outras sequências (fora de ordem, repetidas, valores nos
limites) devem ser exercitadas à parte.

**Fronteiras relevantes (BVA):** `saldoInicial = 0`; `valor` do saque
exatamente igual ao saldo atual; `taxaPercentual = 0` e `= 100`.

---

## Módulo 3 — `notificador.js`

Este módulo **consome exatamente o formato de retorno de
`avaliarPedidoEmprestimo`** (Módulo 1) — é o ponto do projeto desenhado
para exercitar teste de componentes/interface entre dois módulos.

```js
/**
 * Gera uma mensagem de notificação a partir do resultado de uma avaliação
 * de empréstimo.
 *
 * @param {{aprovado: boolean, motivo: string|null, limiteCredito: number|null}} resultado
 * @returns {string}
 * @throws {Error} "RESULTADO_INVALIDO" se `resultado` não tiver o formato esperado
 *                 (campos ausentes ou de tipo incorreto)
 */
function gerarMensagemNotificacao(resultado) { /* ... */ }
```

**Regras de negócio** (RF-08):

1. `resultado.aprovado === true` → retornar exatamente:
   `` `Empréstimo aprovado! Limite de crédito: R$ ${limiteCredito.toFixed(2)}` ``
2. `resultado.aprovado === false` → retornar exatamente:
   `` `Empréstimo não aprovado. Motivo: ${resultado.motivo}` ``
3. Qualquer formato fora do contrato (`aprovado` ausente/não-booleano;
   `limiteCredito` ausente quando `aprovado = true`; `motivo` ausente
   quando `aprovado = false`) → lançar `"RESULTADO_INVALIDO"`.

---

## Módulo 4 — `index.js` (CLI de integração)

Ponto de entrada único, amarrando os módulos acima — é o alvo do teste de
sistema e do teste de lançamento baseado em cenário.

```
node index.js emprestimo <idade> <rendaMensal>
    → avalia o empréstimo e imprime a mensagem de notificação (Módulos 1+3)

node index.js carteira <operacao> [argumentos...]
    → executa uma única operação da carteira sobre uma carteira nova a cada chamada
      (ex.: `node index.js carteira abrir 100`, `node index.js carteira sacar 30`)
      Observação de design: cada chamada da CLI cria uma carteira nova — sequências de
      operações (abrir → depositar → sacar) precisam ser testadas via os testes de unidade
      do Módulo 2 diretamente, não via CLI.
```

### Cenário de uso (teste de cenário / aceitação)

> Maria, 45 anos, renda mensal de R$ 4.500,00, quer saber se consegue um
> empréstimo. Ela roda `node index.js emprestimo 45 4500` e recebe a
> mensagem de aprovação com o limite de crédito. Satisfeita, ela decide
> guardar parte desse valor: abre uma carteira digital com o valor do
> limite aprovado, e no dia seguinte precisa sacar R$ 500,00 para uma
> emergência.

Esse cenário exercita, em sequência, os Módulos 1, 4 e 2 — bom candidato a
teste de sistema completo e a um roteiro de teste de aceitação/teste-beta
simulado em sala (times de alunos representando "usuários" seguindo o
roteiro da Maria e relatando o que encontrarem).

---

## Mapa de técnicas de teste (aula B01A02) → onde se aplicam

| Técnica | Onde se aplica |
|---|---|
| Particionamento de equivalência | `emprestimo.js` (idade, renda); `carteira.js` (valor, taxa, saldoInicial) |
| Análise de valor-limite (BVA) | Todas as fronteiras listadas em cada módulo acima |
| Teste de caminho básico / grafo de fluxo / complexidade ciclomática | `emprestimo.js` e `carteira.js` (múltiplos `if`/`else` e validações) |
| Teste de condição | Qualquer condição composta (ex.: regra 4 de `emprestimo.js`, que combina idade com o resultado da regra 3) |
| Teste de fluxo de dados | `carteira.js` (o atributo de saldo é definido e usado repetidamente ao longo do ciclo de vida do objeto) |
| Teste de unidade orientado a objetos / teste de conjunto (classe) | `carteira.js` (sequência de estados FECHADA/ABERTA) |
| Teste de componentes / teste de interface | `notificador.js` consumindo o contrato de `emprestimo.js` |
| Teste de sistema | `index.js` (fluxo completo via CLI) |
| Teste de lançamento baseado em requisitos | Conferir cada caso de teste contra RF-01 a RF-09 |
| Teste de cenário | Cenário da Maria (seção acima) |
| Teste-alfa / teste-beta / teste de aceitação | Simulados em sala: grupos de alunos seguindo o roteiro da Maria pela CLI |
| Rastreabilidade dos casos de teste aos requisitos | Cada caso de teste deve anotar qual RF-XX/RNF-XX verifica |
