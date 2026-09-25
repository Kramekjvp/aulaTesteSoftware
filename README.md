# Projeto de Teste — Aula B01A02

Engenharia de Software (203680) — UEPG
Aula B01A02: Planejamento de V&V e técnicas de teste de software

Este é um sistema pequeno em Node.js (avaliação de empréstimo, carteira
digital e notificação) usado na atividade de projeto de casos de teste.

- **Enunciado da atividade e formas de entrega:** [ATIVIDADE.md](ATIVIDADE.md)
- **Especificação (fonte de verdade):** [ESPECIFICACAO.md](ESPECIFICACAO.md).
  Qualquer comportamento do código que divirja dela é um defeito.
- **Modelo da tabela de casos de teste:** [CASOS-DE-TESTE.md](CASOS-DE-TESTE.md)

> A implementação **pode conter defeitos**. O objetivo é encontrá-los
> projetando casos de teste com as técnicas vistas em aula.

## Instalação das ferramentas

| Ferramenta | Para quê | Obrigatória? |
|---|---|---|
| **Node.js 22 ou superior** | executar o sistema e os testes | Sim |
| **Git** | entregar pelo GitHub | Só na entrega pelo GitHub |
| **VS Code** (ou outro editor) | editar os testes | Recomendado |

O projeto **não tem dependências externas**: não é preciso rodar
`npm install`. Os testes usam o executor nativo do Node (`node:test`).

### 1. Node.js

Instale a versão **LTS** (22 ou superior). O `npm` já vem junto.

**Windows**
- Baixe o instalador `.msi` da versão LTS em <https://nodejs.org> e
  instale com as opções padrão, **ou**, no PowerShell:
  ```powershell
  winget install OpenJS.NodeJS.LTS
  ```
- Feche e abra de novo o terminal depois de instalar.
- Sem permissão de administrador (ex.: laboratório): em
  <https://nodejs.org/en/download>, baixe o **.zip** (Standalone binary),
  extraia numa pasta sua e, no PowerShell, rode
  `$env:Path = "C:\caminho\da\pasta\node;" + $env:Path` (vale só para
  aquele terminal).

**Linux e macOS** (recomendado: `nvm`, que não precisa de `sudo`)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# feche e abra o terminal
nvm install --lts
```
- Evite `sudo apt install nodejs` no Ubuntu/Debian: a versão do
  repositório costuma ser antiga demais (< 22).
- No Fedora, `sudo dnf install nodejs` já instala uma versão recente.
- No macOS, também serve o instalador `.pkg` de <https://nodejs.org> ou
  `brew install node`.

**Confira a instalação:**
```bash
node --version   # deve mostrar v22.x ou superior
npm --version
```

### 2. Git (só para entrega pelo GitHub)

- **Windows:** <https://git-scm.com/download/win> ou
  `winget install Git.Git`
- **Ubuntu/Debian:** `sudo apt install git` · **Fedora:** `sudo dnf install git`
- **macOS:** `xcode-select --install` ou `brew install git`

Configure seu nome e e-mail (uma vez só):
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

Você também precisa de uma conta em <https://github.com>.

### 3. Editor (recomendado)

[VS Code](https://code.visualstudio.com/). Abra a pasta do projeto em
*Arquivo → Abrir Pasta* e use o terminal integrado (*Terminal → Novo
Terminal*) para rodar os comandos abaixo.

### 4. Obter o projeto e testar

Baixe a pasta do projeto pelo Classroom e extraia (ou clone o
repositório). Depois, **dentro da pasta do projeto**:
```bash
npm test                          # deve mostrar "pass 9" e "fail 0"
node index.js emprestimo 45 4500  # deve imprimir uma mensagem de aprovação
```
Se os dois comandos funcionarem, está tudo pronto.

### Sem instalar nada

Se não conseguir instalar, abra o repositório no GitHub e use
**Code → Codespaces → Create codespace**. O Codespaces abre um VS Code no
navegador, com Node.js e Git já instalados.

### Problemas comuns

| Sintoma | Solução |
|---|---|
| `node` ou `npm` "não é reconhecido como comando" | Feche e abra o terminal (ou o VS Code) depois de instalar. No Windows, se persistir, reinicie o computador. |
| PowerShell: "a execução de scripts foi desabilitada neste sistema" ao rodar `npm` | Use `npm.cmd test` no lugar de `npm test`, ou rode uma vez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |
| `npm test` diz que não encontrou testes, ou erro com `**` | Versão do Node antiga. Confira `node --version` (precisa ser 22 ou superior). |
| `Cannot find module` | Você não está dentro da pasta do projeto. Use `cd` até a pasta onde está o `package.json`. |

## Estrutura

```
index.js              CLI de integração (Módulo 4, RF-09)
src/emprestimo.js     Módulo 1 — avaliarPedidoEmprestimo (RF-01)
src/carteira.js       Módulo 2 — classe CarteiraDigital (RF-02 a RF-07, RNF-01)
src/notificador.js    Módulo 3 — gerarMensagemNotificacao (RF-08)
tests/unidade/        Testes já escritos pelo desenvolvedor
```

## Como usar

```bash
# Rodar todos os testes (qualquer arquivo tests/**/*.test.js)
npm test

# CLI
node index.js emprestimo 45 4500
node index.js carteira abrir 100
```

Cada chamada `node index.js carteira ...` opera sobre uma carteira **nova**
(estado inicial FECHADA). Sequências de operações (abrir → depositar →
sacar ...) devem ser testadas diretamente na classe `CarteiraDigital`.

## Escrevendo testes

Crie seus arquivos em `tests/` com nome terminando em `.test.js`:

```js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { avaliarPedidoEmprestimo } = require('../src/emprestimo');

test('CT-01 RF-01: idade 18 (fronteira inferior) é aceita', () => {
  const resultado = avaliarPedidoEmprestimo(18, 2000);
  assert.equal(resultado.aprovado, true);
});
```

Para testar a CLI de dentro de um teste (teste de sistema), use
`child_process.spawnSync`:

```js
const { spawnSync } = require('node:child_process');
const r = spawnSync('node', ['index.js', 'emprestimo', '45', '4500'], { encoding: 'utf8' });
// r.stdout, r.stderr, r.status
```

Observação: valores monetários da carteira são arredondados para centavos
após cada operação.
