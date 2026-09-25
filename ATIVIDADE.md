# Atividade — Projeto de casos de teste (Aula B01A02)

Engenharia de Software (203680) — UEPG
Aula B01A02: Planejamento de V&V e técnicas de teste de software

## Objetivo

Projetar e executar casos de teste para o sistema deste repositório
(empréstimo, carteira digital e notificação), usando as técnicas vistas em
aula, e **encontrar os defeitos** da implementação. A referência é
[ESPECIFICACAO.md](ESPECIFICACAO.md): qualquer comportamento que diverja
dela é um defeito.

## Organização

- **Realização:** individual ou em **dupla**.
- **Entrega:** **individual**. Cada aluno entrega a sua cópia, mesmo que
  tenha trabalhado em dupla.
- Quem fez em dupla informa, no cabeçalho da entrega, o **nome completo do
  colega**.
- **Prazo:** conforme publicado no Classroom.

## Antes de começar

Instale as ferramentas e confira se o projeto roda, seguindo a seção
**Instalação das ferramentas** do [README.md](README.md). Faça isso
**antes da aula**, se possível.

## O que fazer

1. Leia a [ESPECIFICACAO.md](ESPECIFICACAO.md) e o [README.md](README.md).
2. Rode `npm test`: os testes que já existem passam. Isso prova que o
   sistema está correto?
3. Projete casos de teste usando, **no mínimo**, estas técnicas:

   | Técnica | Onde aplicar |
   |---|---|
   | Particionamento de equivalência | `emprestimo.js` (idade, renda); `carteira.js` (valor, taxa, saldo inicial) |
   | Análise de valor-limite | Fronteiras listadas na especificação de cada módulo |
   | Caminho básico / teste de condição | `emprestimo.js` e `carteira.js` (desenhe o grafo de fluxo e calcule a complexidade ciclomática de pelo menos uma função) |
   | Teste de unidade orientado a objetos | `CarteiraDigital`: sequências de estados, incluindo operações fora de ordem |
   | Teste de componentes / interface | `notificador.js` recebendo o resultado **real** de `emprestimo.js` |
   | Teste de sistema / cenário | CLI (`index.js`) seguindo o cenário da Maria |

4. Execute os casos e registre, para cada um, se passou ou falhou.
5. Para cada falha, descreva o defeito encontrado.

## O que cada caso de teste deve conter

Em **qualquer** forma de entrega, cada caso de teste deve vir acompanhado
destes campos:

| Campo | Exemplo |
|---|---|
| **ID** | CT-07 |
| **Requisito** | RF-01 |
| **Técnica** | Análise de valor-limite |
| **Entrada** | `avaliarPedidoEmprestimo(18, 2000)` |
| **Resultado esperado** (segundo a especificação) | aprovado, limite R$ 4000,00 |
| **Resultado obtido** | aprovado, limite R$ 4000,00 |
| **Situação** | Passou / Falhou |

Para cada caso que **falhou**, acrescente uma linha **Defeito** dizendo o
que está errado e em qual módulo (ex.: "sistema rejeita renda de
R$ 1.200,00, que a regra 2 do RF-01 aceita — `emprestimo.js`").

Há um modelo pronto em [CASOS-DE-TESTE.md](CASOS-DE-TESTE.md).

## Formas de entrega (escolha uma)

### 1. Código-fonte (.js) no Classroom
- Anexe os seus arquivos de teste (`*.test.js`).
- Documente cada caso num comentário logo acima do `test(...)`, com os
  campos acima:

  ```js
  /**
   * CT-07 | RF-01 | Análise de valor-limite
   * Entrada: avaliarPedidoEmprestimo(18, 2000)
   * Esperado: aprovado, limite 4000
   * Obtido: aprovado, limite 4000
   * Situação: Passou
   */
  test('CT-07 RF-01: idade 18 (fronteira inferior) é aceita', () => {
    const resultado = avaliarPedidoEmprestimo(18, 2000);
    assert.equal(resultado.aprovado, true);
    assert.equal(resultado.limiteCredito, 4000);
  });
  ```

- No topo do arquivo principal, coloque um comentário com o seu nome e o
  nome do colega de dupla, se houver.

### 2. Repositório no GitHub
- Faça um *fork* do repositório do projeto (ou clone e publique num
  repositório seu).
- Coloque os testes em `tests/` e preencha o
  [CASOS-DE-TESTE.md](CASOS-DE-TESTE.md) na raiz do repositório.
- `npm test` deve rodar os seus testes.
- Envie o **link do repositório** no Classroom. O repositório precisa
  estar público ou compartilhado com o professor.

### 3. Documento no Classroom
- Entregue um documento (Google Docs ou PDF) com a tabela de casos de
  teste (mesmos campos do modelo) e o código dos testes, colado ou em
  anexo.
- Se tiver desenhado o grafo de fluxo, inclua uma imagem ou foto dele.

## Dicas

- Um teste que **passa** também é resultado: mostra que aquela parte está
  de acordo com a especificação.
- Um defeito pode esconder outro. Se a CLI falhar, confirme o
  comportamento de cada módulo isoladamente também.
- O nome de cada teste deve indicar o requisito verificado
  (rastreabilidade).
