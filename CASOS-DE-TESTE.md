# Casos de teste — Projeto de Teste B01A02

**Aluno:** João Vitor Pereira Kramek

Todos os casos estão no arquivo novo `tests/casos-de-teste.test.js` e rodam com
`npm test`. O resultado esperado vem sempre da `ESPECIFICACAO.md`; o resultado
obtido foi registrado a partir da execução real. O código de `src/` e `index.js`
**não foi alterado**: as falhas abaixo são intencionais e mostram os defeitos da
implementação, então `npm test` termina com falhas.

## Casos de teste

| ID | Requisito | Técnica | Entrada | Resultado esperado | Resultado obtido | Situação |
|---|---|---|---|---|---|---|
| CT-01 | RF-01 | Particionamento de equivalência | `avaliarPedidoEmprestimo(30, 2000)` | aprovado, limite 4000 | aprovado, limite 4000 | Passou |
| CT-02 | RF-01 | Particionamento de equivalência · idade inválida (< 18) | `avaliarPedidoEmprestimo(10, 2000)` | rejeitado, IDADE_FORA_DO_LIMITE | rejeitado, IDADE_FORA_DO_LIMITE | Passou |
| CT-03 | RF-01 | Particionamento de equivalência · idade inválida (> 70) | `avaliarPedidoEmprestimo(80, 2000)` | rejeitado, IDADE_FORA_DO_LIMITE | rejeitado, IDADE_FORA_DO_LIMITE | Passou |
| CT-04 | RF-01 | Particionamento de equivalência · renda inválida | `avaliarPedidoEmprestimo(30, 800)` | rejeitado, RENDA_INSUFICIENTE | rejeitado, RENDA_INSUFICIENTE | Passou |
| CT-05 | RF-01 | Particionamento de equivalência · faixa 2 (×3) | `avaliarPedidoEmprestimo(30, 5000)` | aprovado, limite 15000 | aprovado, limite 15000 | Passou |
| CT-06 | RF-01 | Particionamento de equivalência · faixa 3 (×5) | `avaliarPedidoEmprestimo(30, 10000)` | aprovado, limite 50000 | aprovado, limite 40000 | **Falhou** |
| CT-07 | RF-01 | Análise de valor-limite · idade 17 | `avaliarPedidoEmprestimo(17, 2000)` | rejeitado, IDADE_FORA_DO_LIMITE | rejeitado, IDADE_FORA_DO_LIMITE | Passou |
| CT-08 | RF-01 | Análise de valor-limite · idade 18 | `avaliarPedidoEmprestimo(18, 2000)` | aprovado, limite 4000 | aprovado, limite 4000 | Passou |
| CT-09 | RF-01 | Análise de valor-limite · idade 64 | `avaliarPedidoEmprestimo(64, 2000)` | aprovado, limite 4000 | aprovado, limite 4000 | Passou |
| CT-10 | RF-01 | Análise de valor-limite · idade 65 (limite pela metade) | `avaliarPedidoEmprestimo(65, 2000)` | aprovado, limite 2000 | aprovado, limite 2000 | Passou |
| CT-11 | RF-01 | Análise de valor-limite · idade 70 | `avaliarPedidoEmprestimo(70, 2000)` | aprovado, limite 2000 | aprovado, limite 2000 | Passou |
| CT-12 | RF-01 | Análise de valor-limite · idade 71 | `avaliarPedidoEmprestimo(71, 2000)` | rejeitado, IDADE_FORA_DO_LIMITE | rejeitado, IDADE_FORA_DO_LIMITE | Passou |
| CT-13 | RF-01 | Análise de valor-limite · renda 1199,99 | `avaliarPedidoEmprestimo(30, 1199.99)` | rejeitado, RENDA_INSUFICIENTE | rejeitado, RENDA_INSUFICIENTE | Passou |
| CT-14 | RF-01 | Análise de valor-limite · renda 1200 | `avaliarPedidoEmprestimo(30, 1200)` | aprovado, limite 2400 | rejeitado, RENDA_INSUFICIENTE | **Falhou** |
| CT-15 | RF-01 | Análise de valor-limite · renda 1200,01 | `avaliarPedidoEmprestimo(30, 1200.01)` | aprovado, limite 2400.02 | aprovado, limite 2400.02 | Passou |
| CT-16 | RF-01 | Análise de valor-limite · renda 2999,99 | `avaliarPedidoEmprestimo(30, 2999.99)` | aprovado, limite 5999.98 | aprovado, limite 5999.98 | Passou |
| CT-17 | RF-01 | Análise de valor-limite · renda 3000 | `avaliarPedidoEmprestimo(30, 3000)` | aprovado, limite 9000 | aprovado, limite 9000 | Passou |
| CT-18 | RF-01 | Análise de valor-limite · renda 7999,99 | `avaliarPedidoEmprestimo(30, 7999.99)` | aprovado, limite 23999.97 | aprovado, limite 23999.97 | Passou |
| CT-19 | RF-01 | Análise de valor-limite · renda 8000 | `avaliarPedidoEmprestimo(30, 8000)` | aprovado, limite 40000 | aprovado, limite 32000 | **Falhou** |
| CT-20 | RF-01 | Teste de condição · idade ≥ 65 e faixa 2 | `avaliarPedidoEmprestimo(65, 3000)` | aprovado, limite 4500 | aprovado, limite 4500 | Passou |
| CT-21 | RF-01 | Teste de condição · idade ≥ 65 e faixa 3 | `avaliarPedidoEmprestimo(65, 8000)` | aprovado, limite 20000 | aprovado, limite 16000 | **Falhou** |
| CT-22 | RF-01 | Teste de condição · idade < 65 e faixa 3 | `avaliarPedidoEmprestimo(64, 8000)` | aprovado, limite 40000 | aprovado, limite 32000 | **Falhou** |
| CT-23 | RF-01 | Teste de condição · idade 70 e renda no mínimo | `avaliarPedidoEmprestimo(70, 1200)` | aprovado, limite 1200 | rejeitado, RENDA_INSUFICIENTE | **Falhou** |
| CT-24 | RF-01 | Teste de condição · idade e renda inválidas (idade tem precedência) | `avaliarPedidoEmprestimo(17, 500)` | rejeitado, IDADE_FORA_DO_LIMITE | rejeitado, IDADE_FORA_DO_LIMITE | Passou |
| CT-25 | RF-02 | Particionamento de equivalência | `abrir(100); obterSaldo()` | 100 | 100 | Passou |
| CT-26 | RF-02 | Particionamento de equivalência · saldo inicial negativo | `abrir(-50)` | lança SALDO_INICIAL_INVALIDO | lança SALDO_INICIAL_INVALIDO | Passou |
| CT-27 | RF-02 | Análise de valor-limite · saldo inicial 0 | `abrir(0); obterSaldo()` | 0 | 0 | Passou |
| CT-28 | RF-02 | Análise de valor-limite · saldo inicial -0,01 | `abrir(-0.01)` | lança SALDO_INICIAL_INVALIDO | lança SALDO_INICIAL_INVALIDO | Passou |
| CT-29 | RF-02 | Análise de valor-limite · saldo inicial 0,01 | `abrir(0.01); obterSaldo()` | 0.01 | 0.01 | Passou |
| CT-30 | RF-03 | Particionamento de equivalência | `abrir(100); depositar(50)` | 150 | 150 | Passou |
| CT-31 | RF-03 | Particionamento de equivalência · valor negativo | `abrir(100); depositar(-10)` | lança VALOR_INVALIDO | lança VALOR_INVALIDO | Passou |
| CT-32 | RF-03 | Análise de valor-limite · depósito 0 | `abrir(100); depositar(0)` | lança VALOR_INVALIDO | lança VALOR_INVALIDO | Passou |
| CT-33 | RF-03 | Análise de valor-limite · depósito 0,01 | `abrir(100); depositar(0.01)` | 100.01 | 100.01 | Passou |
| CT-34 | RF-04 | Particionamento de equivalência | `abrir(100); sacar(30)` | 70 | 70 | Passou |
| CT-35 | RF-04 | Particionamento de equivalência · saque acima do saldo | `abrir(100); sacar(500)` | lança SALDO_INSUFICIENTE | lança SALDO_INSUFICIENTE | Passou |
| CT-36 | RF-04 | Particionamento de equivalência · valor negativo | `abrir(100); sacar(-5)` | lança VALOR_INVALIDO | lança VALOR_INVALIDO | Passou |
| CT-37 | RF-04 | Análise de valor-limite · saque 0 | `abrir(100); sacar(0)` | lança VALOR_INVALIDO | lança VALOR_INVALIDO | Passou |
| CT-38 | RF-04 | Análise de valor-limite · saque 99,99 | `abrir(100); sacar(99.99)` | 0.01 | 0.01 | Passou |
| CT-39 | RF-04 | Análise de valor-limite · saque = saldo | `abrir(100); sacar(100)` | 0 | 0 | Passou |
| CT-40 | RF-04 | Análise de valor-limite · saque = saldo + 0,01 | `abrir(100); sacar(100.01)` | lança SALDO_INSUFICIENTE | lança SALDO_INSUFICIENTE | Passou |
| CT-41 | RF-05 | Particionamento de equivalência | `abrir(100); aplicarJuros(10)` | 110 | 110 | Passou |
| CT-42 | RF-05 | Particionamento de equivalência · taxa negativa | `abrir(100); aplicarJuros(-5)` | lança TAXA_INVALIDA | lança TAXA_INVALIDA | Passou |
| CT-43 | RF-05 | Particionamento de equivalência · taxa acima de 100 | `abrir(100); aplicarJuros(250)` | lança TAXA_INVALIDA | 350 | **Falhou** |
| CT-44 | RF-05 | Análise de valor-limite · taxa -0,01 | `abrir(100); aplicarJuros(-0.01)` | lança TAXA_INVALIDA | lança TAXA_INVALIDA | Passou |
| CT-45 | RF-05 | Análise de valor-limite · taxa 0 | `abrir(100); aplicarJuros(0)` | 100 | 100 | Passou |
| CT-46 | RF-05 | Análise de valor-limite · taxa 100 | `abrir(100); aplicarJuros(100)` | 200 | 200 | Passou |
| CT-47 | RF-05 | Análise de valor-limite · taxa 100,01 | `abrir(100); aplicarJuros(100.01)` | lança TAXA_INVALIDA | 200.01 | **Falhou** |
| CT-48 | RF-02..RF-07 | Unidade orientada a objetos · sequência mínima | `abrir(100) → depositar(50) → sacar(30) → aplicarJuros(10) → fechar()` | 132 | 132 | Passou |
| CT-49 | RF-06 | Unidade orientada a objetos · fora de ordem (FECHADA) | `carteira nova: depositar(10) / sacar(10) / aplicarJuros(5)` | lança CARTEIRA_FECHADA / lança CARTEIRA_FECHADA / lança CARTEIRA_FECHADA | lança CARTEIRA_FECHADA / lança CARTEIRA_FECHADA / lança CARTEIRA_FECHADA | Passou |
| CT-50 | RF-06 | Unidade orientada a objetos · fechar sem abrir | `carteira nova: fechar()` | lança CARTEIRA_JA_FECHADA | lança CARTEIRA_JA_FECHADA | Passou |
| CT-51 | RF-02 | Unidade orientada a objetos · abrir duas vezes | `abrir(100) → abrir(500)` | lança CARTEIRA_JA_ABERTA | lança CARTEIRA_JA_ABERTA | Passou |
| CT-52 | RF-02 | Unidade orientada a objetos · abrir duas vezes preserva saldo | `abrir(100) → abrir(500) falha → obterSaldo()` | 100 | 100 | Passou |
| CT-53 | RF-07 | Unidade orientada a objetos · fechar duas vezes | `abrir(100) → fechar() → fechar()` | lança CARTEIRA_JA_FECHADA | lança CARTEIRA_JA_FECHADA | Passou |
| CT-54 | RF-06 | Unidade orientada a objetos · operações após fechar | `abrir(100) → fechar() → depositar / sacar / aplicarJuros` | lança CARTEIRA_FECHADA / lança CARTEIRA_FECHADA / lança CARTEIRA_FECHADA | lança CARTEIRA_FECHADA / lança CARTEIRA_FECHADA / lança CARTEIRA_FECHADA | Passou |
| CT-55 | RF-07 | Unidade orientada a objetos · saldo final após fechar | `abrir(100) → fechar() → obterSaldo()` | 100 | 100 | Passou |
| CT-56 | RF-02 | Unidade orientada a objetos · reabrir após fechar (ciclo da máquina de estados) | `abrir(100) → fechar() → abrir(50) → obterSaldo()` | 50 | 50 | Passou |
| CT-57 | RF-04 / RNF-01 | Unidade orientada a objetos · saque rejeitado não altera o saldo | `abrir(100) → sacar(100.01) falha → obterSaldo()` | 100 | 100 | Passou |
| CT-58 | RNF-01 | Unidade orientada a objetos · zerar e tentar sacar de novo | `abrir(100) → sacar(100) → sacar(0.01)` | lança SALDO_INSUFICIENTE | lança SALDO_INSUFICIENTE | Passou |
| CT-59 | RNF-01 | Unidade orientada a objetos · saldo nunca negativo após rodada de operações | `abrir(10) → sacar(4) → sacar(4) → sacar(4) falha → obterSaldo()` | 2 | 2 | Passou |
| CT-60 | RF-02 | Unidade orientada a objetos · obterSaldo em carteira nova | `carteira nova: obterSaldo()` | 0 | 0 | Passou |
| CT-61 | RF-03 / RF-04 | Fluxo de dados · saldo com centavos | `abrir(100.10) → depositar(0.20) → sacar(0.10)` | 100.2 | 100.2 | Passou |
| CT-62 | RF-05 | Fluxo de dados · juros sobre saldo com centavos | `abrir(100.50) → aplicarJuros(10)` | 110.55 | 110.55 | Passou |
| CT-63 | RF-01 + RF-08 | Componentes / interface · resultado real (aprovação) | `gerarMensagemNotificacao(avaliarPedidoEmprestimo(45, 4500))` | Empréstimo aprovado! Limite de crédito: R$ 13500.00 | Empréstimo aprovado! Limite de crédito: R$ 13500.00 | Passou |
| CT-64 | RF-01 + RF-08 | Componentes / interface · resultado real (idoso, limite pela metade) | `gerarMensagemNotificacao(avaliarPedidoEmprestimo(65, 2000))` | Empréstimo aprovado! Limite de crédito: R$ 2000.00 | Empréstimo aprovado! Limite de crédito: R$ 2000.00 | Passou |
| CT-65 | RF-01 + RF-08 | Componentes / interface · resultado real (rejeição por idade) | `gerarMensagemNotificacao(avaliarPedidoEmprestimo(17, 2000))` | Empréstimo não aprovado. Motivo: IDADE_FORA_DO_LIMITE | lança RESULTADO_INVALIDO | **Falhou** |
| CT-66 | RF-01 + RF-08 | Componentes / interface · resultado real (rejeição por renda) | `gerarMensagemNotificacao(avaliarPedidoEmprestimo(30, 800))` | Empréstimo não aprovado. Motivo: RENDA_INSUFICIENTE | lança RESULTADO_INVALIDO | **Falhou** |
| CT-67 | RF-08 | Componentes / interface · motivo textual qualquer | `gerarMensagemNotificacao({aprovado:false, motivo:'Renda insuficiente', limiteCredito:null})` | Empréstimo não aprovado. Motivo: Renda insuficiente | Empréstimo não aprovado. Motivo: Renda insuficiente | Passou |
| CT-68 | RF-08 | Componentes / interface · formatação com 2 casas | `gerarMensagemNotificacao({aprovado:true, motivo:null, limiteCredito:1234.5})` | Empréstimo aprovado! Limite de crédito: R$ 1234.50 | Empréstimo aprovado! Limite de crédito: R$ 1234.50 | Passou |
| CT-69 | RF-08 | Componentes / interface · contrato: aprovado sem limite | `gerarMensagemNotificacao({aprovado:true, motivo:null, limiteCredito:null})` | lança RESULTADO_INVALIDO | lança RESULTADO_INVALIDO | Passou |
| CT-70 | RF-08 | Componentes / interface · contrato: limite com tipo incorreto | `gerarMensagemNotificacao({aprovado:true, motivo:null, limiteCredito:'4000'})` | lança RESULTADO_INVALIDO | lança RESULTADO_INVALIDO | Passou |
| CT-71 | RF-08 | Componentes / interface · contrato: rejeitado sem motivo | `gerarMensagemNotificacao({aprovado:false, motivo:null, limiteCredito:null})` | lança RESULTADO_INVALIDO | lança RESULTADO_INVALIDO | Passou |
| CT-72 | RF-08 | Componentes / interface · contrato: aprovado não booleano | `gerarMensagemNotificacao({aprovado:'sim'})` | lança RESULTADO_INVALIDO | lança RESULTADO_INVALIDO | Passou |
| CT-73 | RF-08 | Componentes / interface · contrato: campo aprovado ausente | `gerarMensagemNotificacao({motivo:null})` | lança RESULTADO_INVALIDO | lança RESULTADO_INVALIDO | Passou |
| CT-74 | RF-08 | Componentes / interface · contrato: null | `gerarMensagemNotificacao(null)` | lança RESULTADO_INVALIDO | lança RESULTADO_INVALIDO | Passou |
| CT-75 | RF-09 + RF-01 + RF-08 | Sistema / cenário · Maria, passo 1 | `node index.js emprestimo 45 4500` | exit 0: Empréstimo aprovado! Limite de crédito: R$ 13500.00 | exit 0: Empréstimo aprovado! Limite de crédito: R$ 13500.00 | Passou |
| CT-76 | RF-09 + RF-02 | Sistema / cenário · Maria, passo 2 (valor copiado da mensagem) | `node index.js carteira abrir 13500.00` | exit 0: Carteira aberta. Saldo: R$ 13500.00 | exit 0: Carteira aberta. Saldo: R$ 1350000.00 | **Falhou** |
| CT-77 | RF-09 + RF-02 | Sistema / cenário · Maria, passo 2 (valor inteiro) | `node index.js carteira abrir 13500` | exit 0: Carteira aberta. Saldo: R$ 13500.00 | exit 0: Carteira aberta. Saldo: R$ 13500.00 | Passou |
| CT-78 | RF-02 + RF-04 | Sistema / cenário · Maria, passos 2-3 (mesma carteira, na classe) | `abrir(13500) → sacar(500) → obterSaldo()` | 13000 | 13000 | Passou |
| CT-79 | RF-09 | Sistema / cenário · Maria, passo 3 pela CLI (carteira nova a cada chamada) | `node index.js carteira sacar 500` | exit 1: Erro: CARTEIRA_FECHADA | exit 1: Erro: CARTEIRA_FECHADA | Passou |
| CT-80 | RF-09 + RF-01 + RF-08 | Sistema / cenário · empréstimo rejeitado por idade | `node index.js emprestimo 17 5000` | exit 0: Empréstimo não aprovado. Motivo: IDADE_FORA_DO_LIMITE | exit 1: Erro: RESULTADO_INVALIDO | **Falhou** |
| CT-81 | RF-09 + RF-01 + RF-08 | Sistema / cenário · empréstimo rejeitado por renda | `node index.js emprestimo 30 1000` | exit 0: Empréstimo não aprovado. Motivo: RENDA_INSUFICIENTE | exit 1: Erro: RESULTADO_INVALIDO | **Falhou** |
| CT-82 | RF-09 | Sistema / cenário · valor no formato brasileiro | `node index.js carteira abrir 1.500,75` | exit 0: Carteira aberta. Saldo: R$ 1500.75 | exit 0: Carteira aberta. Saldo: R$ 1500.75 | Passou |
| CT-83 | RF-09 | Sistema / cenário · saldo de carteira nova | `node index.js carteira saldo` | exit 0: Saldo: R$ 0.00 | exit 0: Saldo: R$ 0.00 | Passou |
| CT-84 | RF-09 + RF-06 | Sistema / cenário · fechar carteira nova | `node index.js carteira fechar` | exit 1: Erro: CARTEIRA_JA_FECHADA | exit 1: Erro: CARTEIRA_JA_FECHADA | Passou |
| CT-85 | RF-09 | Sistema / cenário · número inválido | `node index.js emprestimo abc 4500` | exit 2: Número inválido: abc | exit 2: Número inválido: abc | Passou |
| CT-86 | RF-09 | Sistema / cenário · argumento ausente | `node index.js emprestimo 45` | exit 2: Número inválido: undefined | exit 2: Número inválido: undefined | Passou |
| CT-87 | RF-09 | Sistema / cenário · comando desconhecido | `node index.js foo` | exit 2: Uso: | exit 2: Uso: | Passou |

## Defeitos encontrados

| Caso(s) | Módulo | Requisito violado | Descrição do defeito |
|---|---|---|---|
| CT-14, CT-23 | `emprestimo.js` | RF-01, regra 2 | A comparação `rendaMensal <= RENDA_MINIMA` rejeita renda de R$ 1.200,00 (`RENDA_INSUFICIENTE`), mas a regra 2 aceita renda ≥ 1200. Deveria ser `<`. |
| CT-06, CT-19, CT-21, CT-22 | `emprestimo.js` | RF-01, regra 3 | A faixa `[8000, ∞)` usa multiplicador 4 em vez de 5 (renda 8000 → limite 32000, esperado 40000; com idade ≥ 65, 16000 em vez de 20000). |
| CT-43, CT-47 | `carteira.js` | RF-05 | `aplicarJuros` só valida `taxa < 0`; não rejeita taxa acima de 100 (aceita 100,01 e 250). Falta `taxa > 100` → `TAXA_INVALIDA`. |
| CT-65, CT-66, CT-80, CT-81 | `notificador.js` | RF-08, regras 2 e 3 | `FORMATO_MOTIVO` (`/^[A-ZÀ-Ý][a-zà-ÿ ]*$/`) só aceita frase com inicial maiúscula e resto minúsculo, sem `_`. Os motivos reais de `emprestimo.js` (`IDADE_FORA_DO_LIMITE`, `RENDA_INSUFICIENTE`) são rejeitados com `RESULTADO_INVALIDO`; toda rejeição de empréstimo quebra na CLI (exit 1). Os testes originais usavam "Renda insuficiente", o que escondia o defeito (integração). |
| CT-76 | `index.js` | RF-09 / cenário da Maria | `lerValorMonetario` trata o `.` sempre como separador de milhar (`replace('.', '')`, só a 1ª ocorrência): `13500.00` vira 1.350.000,00, `1500.75` vira 150075 e `1.000.000,00` é recusado. O limite impresso pela própria CLI (`R$ 13500.00`) não pode ser usado como entrada da carteira. |

## Como o código de testes funciona

O arquivo `tests/casos-de-teste.test.js` separa os **dados** dos casos de quem os **executa**. Em vez de 87 funções `test()` escritas à mão, há uma lista de casos e, no final, um laço que cria um `test()` do `node:test` para cada item.

Cada caso é criado por `caso(rf, tecnica, entrada, esperado, executar)`:

| Campo | Papel |
|---|---|
| `rf` | Requisito verificado (rastreabilidade) |
| `tecnica` | Técnica de teste usada |
| `entrada` | Texto descrevendo a entrada (documentação; entra no nome do teste) |
| `esperado` | Resultado segundo a `ESPECIFICACAO.md`, nunca copiado do código |
| `executar` | Função que roda o sistema e devolve o resultado **obtido** |

O laço final chama `executar()` e compara o obtido com o esperado usando `assert.deepStrictEqual`. Se forem diferentes, o teste falha e o defeito está na implementação, porque o esperado vem da especificação. Os IDs (`CT-01`, `CT-02`...) são gerados pela posição na lista.

### Como o `deepStrictEqual` compara os dados

Comportamentos verificados no Node 22:

| Situação | Resultado da comparação |
|---|---|
| Objetos | Compara propriedade por propriedade, de forma recursiva (inclui objetos dentro de objetos e de listas) |
| Ordem das chaves | Não importa: `{a:1, b:2}` é igual a `{b:2, a:1}` |
| Listas | Compara posição por posição; a ordem importa: `[1,2]` é diferente de `[2,1]` |
| Tipos | Sem conversão: `1` é diferente de `'1'`, `null` é diferente de `undefined`, `0` é diferente de `-0` |
| Chave a mais ou a menos | É diferença; `{b: undefined}` é diferente de `{}` |
| Instância de classe × objeto literal | Diferentes, mesmo com os mesmos campos |
| Exceção × dado | `new Error('A')` é diferente de `{erro: 'A'}` |

Por isso obtido e esperado precisam ter o **mesmo formato** (números, textos, objetos e listas simples). Os auxiliares abaixo fazem essa conversão.

### Por que cada auxiliar existe

| Auxiliar | Por que existe |
|---|---|
| `tentar(fn)` | Transforma exceção em dado (`{ erro: 'MENSAGEM' }`), já que o assert não compara exceção com valor esperado. Se um caso deveria lançar erro e não lança, ele falha por comparação em vez de quebrar de forma confusa |
| `erro(m)` | Monta o esperado de uma exceção no mesmo formato de `tentar()`: `erro('TAXA_INVALIDA')` |
| `emp(idade, renda)` | Chama `avaliarPedidoEmprestimo` e devolve só `{ aprovado, motivo, limite }`, com o limite arredondado por `r2` |
| `r2(n)` | Arredonda para centavos, preservando `null`. Evita falso erro por resíduo de ponto flutuante (ex.: `1200.01 × 3` dá `3600.0299999999997`). Nos casos atuais não altera nenhum resultado; é uma proteção para rendas com centavos |
| `ok(limite)` e `no(motivo)` | Montam o esperado de aprovação (motivo `null`) e de rejeição (limite `null`), conforme a regra 5 do RF-01 |
| `aberta(saldo)` | Devolve uma carteira já aberta, pré-condição de quase todos os casos da classe |
| `saldoApos(saldo, op)` | Abre a carteira, executa uma operação e devolve o saldo (ou `{ erro }`): o padrão de depósito, saque e juros. Devolver um número simples facilita a comparação |
| `cli(...args)` | Roda `node index.js ...` como processo separado (teste de sistema) e devolve `{ status, saida }`: código de saída e primeira linha impressa |
| `integrar(idade, renda)` | Passa o resultado **real** de `avaliarPedidoEmprestimo` para `gerarMensagemNotificacao` (teste de componentes/interface). Foi assim que o defeito do regex do notificador apareceu, pois com o motivo escrito à mão tudo passava |
| `notificar(obj)` | Chama o notificador com um objeto escrito à mão, para testar o contrato de entrada, convertendo exceção em `{ erro }` |
| `aprovadoNotif` e `rejeitadoNotif` | Montam as mensagens esperadas das regras 1 e 2 do RF-08, sem repetir o texto em cada caso |

### Cuidados ao alterar

- Casos novos devem entrar no **fim** da lista. Como os IDs vêm da posição, inserir no meio muda os IDs seguintes e a tabela deste arquivo deixa de bater.
- Esta tabela foi preenchida a partir de uma execução real. Se os casos mudarem, atualize as linhas correspondentes.