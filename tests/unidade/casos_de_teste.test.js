'use strict';

const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { avaliarPedidoEmprestimo } = require('../src/emprestimo');
const { CarteiraDigital } = require('../src/carteira');
const { gerarMensagemNotificacao } = require('../src/notificador');
const EP = 'Particionamento de equivalência';
const BVA = 'Análise de valor-limite';
const CC = 'Teste de condição';
const OO = 'Unidade orientada a objetos';
const FD = 'Fluxo de dados';
const CI = 'Componentes / interface';
const SC = 'Sistema / cenário';

const r2 = (n) => (n === null ? null : Math.round(n * 100) / 100);
const tentar = (fn) => {
  try {
    return fn();
  } catch (e) {
    return { erro: e.message };
  }
};


const erro = (m) => ({ erro: m });

const emp = (idade, renda) => {
  const r = avaliarPedidoEmprestimo(idade, renda);
  return { aprovado: r.aprovado, motivo: r.motivo, limite: r2(r.limiteCredito) };
};

/** ok — resultado ESPERADO de um pedido aprovado: motivo null e limite informado (regra 5). */
const ok = (limite) => ({ aprovado: true, motivo: null, limite });

/** no — resultado ESPERADO de um pedido rejeitado: limite null e motivo informado (regra 5). */
const no = (motivo) => ({ aprovado: false, motivo, limite: null });

const aberta = (saldo) => {
  const c = new CarteiraDigital();
  c.abrir(saldo);
  return c;
};

const saldoApos = (saldoInicial, op) =>
  tentar(() => {
    const c = aberta(saldoInicial);
    op(c);
    return c.obterSaldo();
  });

const INDEX = path.join(__dirname, '..', 'index.js');
const cli = (...args) => {
  const r = spawnSync(process.execPath, [INDEX, ...args], {
    encoding: 'utf8',
  });
  return { status: r.status, saida: r.stdout.trim() || r.stderr.trim().split('\n')[0] };
};

const integrar = (idade, renda) => tentar(() => gerarMensagemNotificacao(avaliarPedidoEmprestimo(idade, renda)));
const caso = (rf, tecnica, entrada, esperado, executar) => ({ rf, tecnica, entrada, esperado, executar });

// emprestimo.js
const emprestimo = [
  // Particionamento de equivalência
  caso('RF-01', EP, 'avaliarPedidoEmprestimo(30, 2000)', ok(4000), () => emp(30, 2000)),
  caso('RF-01', EP + ' · idade inválida (< 18)', 'avaliarPedidoEmprestimo(10, 2000)', no('IDADE_FORA_DO_LIMITE'), () => emp(10, 2000)),
  caso('RF-01', EP + ' · idade inválida (> 70)', 'avaliarPedidoEmprestimo(80, 2000)', no('IDADE_FORA_DO_LIMITE'), () => emp(80, 2000)),
  caso('RF-01', EP + ' · renda inválida', 'avaliarPedidoEmprestimo(30, 800)', no('RENDA_INSUFICIENTE'), () => emp(30, 800)),
  caso('RF-01', EP + ' · faixa 2 (×3)', 'avaliarPedidoEmprestimo(30, 5000)', ok(15000), () => emp(30, 5000)),
  caso('RF-01', EP + ' · faixa 3 (×5)', 'avaliarPedidoEmprestimo(30, 10000)', ok(50000), () => emp(30, 10000)),
  // Valor-limite: idade
  caso('RF-01', BVA + ' · idade 17', 'avaliarPedidoEmprestimo(17, 2000)', no('IDADE_FORA_DO_LIMITE'), () => emp(17, 2000)),
  caso('RF-01', BVA + ' · idade 18', 'avaliarPedidoEmprestimo(18, 2000)', ok(4000), () => emp(18, 2000)),
  caso('RF-01', BVA + ' · idade 64', 'avaliarPedidoEmprestimo(64, 2000)', ok(4000), () => emp(64, 2000)),
  caso('RF-01', BVA + ' · idade 65 (limite pela metade)', 'avaliarPedidoEmprestimo(65, 2000)', ok(2000), () => emp(65, 2000)),
  caso('RF-01', BVA + ' · idade 70', 'avaliarPedidoEmprestimo(70, 2000)', ok(2000), () => emp(70, 2000)),
  caso('RF-01', BVA + ' · idade 71', 'avaliarPedidoEmprestimo(71, 2000)', no('IDADE_FORA_DO_LIMITE'), () => emp(71, 2000)),
  // Valor-limite: renda
  caso('RF-01', BVA + ' · renda 1199,99', 'avaliarPedidoEmprestimo(30, 1199.99)', no('RENDA_INSUFICIENTE'), () => emp(30, 1199.99)),
  caso('RF-01', BVA + ' · renda 1200', 'avaliarPedidoEmprestimo(30, 1200)', ok(2400), () => emp(30, 1200)),
  caso('RF-01', BVA + ' · renda 1200,01', 'avaliarPedidoEmprestimo(30, 1200.01)', ok(2400.02), () => emp(30, 1200.01)),
  caso('RF-01', BVA + ' · renda 2999,99', 'avaliarPedidoEmprestimo(30, 2999.99)', ok(5999.98), () => emp(30, 2999.99)),
  caso('RF-01', BVA + ' · renda 3000', 'avaliarPedidoEmprestimo(30, 3000)', ok(9000), () => emp(30, 3000)),
  caso('RF-01', BVA + ' · renda 7999,99', 'avaliarPedidoEmprestimo(30, 7999.99)', ok(23999.97), () => emp(30, 7999.99)),
  caso('RF-01', BVA + ' · renda 8000', 'avaliarPedidoEmprestimo(30, 8000)', ok(40000), () => emp(30, 8000)),
  // Teste de condição
  caso('RF-01', CC + ' · idade ≥ 65 e faixa 2', 'avaliarPedidoEmprestimo(65, 3000)', ok(4500), () => emp(65, 3000)),
  caso('RF-01', CC + ' · idade ≥ 65 e faixa 3', 'avaliarPedidoEmprestimo(65, 8000)', ok(20000), () => emp(65, 8000)),
  caso('RF-01', CC + ' · idade < 65 e faixa 3', 'avaliarPedidoEmprestimo(64, 8000)', ok(40000), () => emp(64, 8000)),
  caso('RF-01', CC + ' · idade 70 e renda no mínimo', 'avaliarPedidoEmprestimo(70, 1200)', ok(1200), () => emp(70, 1200)),
  caso('RF-01', CC + ' · idade e renda inválidas (idade tem precedência)', 'avaliarPedidoEmprestimo(17, 500)', no('IDADE_FORA_DO_LIMITE'), () => emp(17, 500)),
];

// carteira.js
const carteira = [
  // saldo inicial
  caso('RF-02', EP, 'abrir(100); obterSaldo()', 100, () => saldoApos(100, () => {})),
  caso('RF-02', EP + ' · saldo inicial negativo', 'abrir(-50)', erro('SALDO_INICIAL_INVALIDO'), () => tentar(() => new CarteiraDigital().abrir(-50))),
  caso('RF-02', BVA + ' · saldo inicial 0', 'abrir(0); obterSaldo()', 0, () => saldoApos(0, () => {})),
  caso('RF-02', BVA + ' · saldo inicial -0,01', 'abrir(-0.01)', erro('SALDO_INICIAL_INVALIDO'), () => tentar(() => new CarteiraDigital().abrir(-0.01))),
  caso('RF-02', BVA + ' · saldo inicial 0,01', 'abrir(0.01); obterSaldo()', 0.01, () => saldoApos(0.01, () => {})),
  // depósito
  caso('RF-03', EP, 'abrir(100); depositar(50)', 150, () => saldoApos(100, (c) => c.depositar(50))),
  caso('RF-03', EP + ' · valor negativo', 'abrir(100); depositar(-10)', erro('VALOR_INVALIDO'), () => saldoApos(100, (c) => c.depositar(-10))),
  caso('RF-03', BVA + ' · depósito 0', 'abrir(100); depositar(0)', erro('VALOR_INVALIDO'), () => saldoApos(100, (c) => c.depositar(0))),
  caso('RF-03', BVA + ' · depósito 0,01', 'abrir(100); depositar(0.01)', 100.01, () => saldoApos(100, (c) => c.depositar(0.01))),
  // saque
  caso('RF-04', EP, 'abrir(100); sacar(30)', 70, () => saldoApos(100, (c) => c.sacar(30))),
  caso('RF-04', EP + ' · saque acima do saldo', 'abrir(100); sacar(500)', erro('SALDO_INSUFICIENTE'), () => saldoApos(100, (c) => c.sacar(500))),
  caso('RF-04', EP + ' · valor negativo', 'abrir(100); sacar(-5)', erro('VALOR_INVALIDO'), () => saldoApos(100, (c) => c.sacar(-5))),
  caso('RF-04', BVA + ' · saque 0', 'abrir(100); sacar(0)', erro('VALOR_INVALIDO'), () => saldoApos(100, (c) => c.sacar(0))),
  caso('RF-04', BVA + ' · saque 99,99', 'abrir(100); sacar(99.99)', 0.01, () => saldoApos(100, (c) => c.sacar(99.99))),
  caso('RF-04', BVA + ' · saque = saldo', 'abrir(100); sacar(100)', 0, () => saldoApos(100, (c) => c.sacar(100))),
  caso('RF-04', BVA + ' · saque = saldo + 0,01', 'abrir(100); sacar(100.01)', erro('SALDO_INSUFICIENTE'), () => saldoApos(100, (c) => c.sacar(100.01))),
  // juros
  caso('RF-05', EP, 'abrir(100); aplicarJuros(10)', 110, () => saldoApos(100, (c) => c.aplicarJuros(10))),
  caso('RF-05', EP + ' · taxa negativa', 'abrir(100); aplicarJuros(-5)', erro('TAXA_INVALIDA'), () => saldoApos(100, (c) => c.aplicarJuros(-5))),
  caso('RF-05', EP + ' · taxa acima de 100', 'abrir(100); aplicarJuros(250)', erro('TAXA_INVALIDA'), () => saldoApos(100, (c) => c.aplicarJuros(250))),
  caso('RF-05', BVA + ' · taxa -0,01', 'abrir(100); aplicarJuros(-0.01)', erro('TAXA_INVALIDA'), () => saldoApos(100, (c) => c.aplicarJuros(-0.01))),
  caso('RF-05', BVA + ' · taxa 0', 'abrir(100); aplicarJuros(0)', 100, () => saldoApos(100, (c) => c.aplicarJuros(0))),
  caso('RF-05', BVA + ' · taxa 100', 'abrir(100); aplicarJuros(100)', 200, () => saldoApos(100, (c) => c.aplicarJuros(100))),
  caso('RF-05', BVA + ' · taxa 100,01', 'abrir(100); aplicarJuros(100.01)', erro('TAXA_INVALIDA'), () => saldoApos(100, (c) => c.aplicarJuros(100.01))),
  // sequências de estados
  caso('RF-02..RF-07', OO + ' · sequência mínima', 'abrir(100) → depositar(50) → sacar(30) → aplicarJuros(10) → fechar()', 132, () =>
    tentar(() => {
      const c = aberta(100);
      c.depositar(50);
      c.sacar(30);
      c.aplicarJuros(10);
      return c.fechar();
    })),
  caso('RF-06', OO + ' · fora de ordem (FECHADA)', 'carteira nova: depositar(10) / sacar(10) / aplicarJuros(5)', [erro('CARTEIRA_FECHADA'), erro('CARTEIRA_FECHADA'), erro('CARTEIRA_FECHADA')], () => {
    const c = new CarteiraDigital();
    return [tentar(() => c.depositar(10)), tentar(() => c.sacar(10)), tentar(() => c.aplicarJuros(5))];
  }),
  caso('RF-06', OO + ' · fechar sem abrir', 'carteira nova: fechar()', erro('CARTEIRA_JA_FECHADA'), () => tentar(() => new CarteiraDigital().fechar())),
  caso('RF-02', OO + ' · abrir duas vezes', 'abrir(100) → abrir(500)', erro('CARTEIRA_JA_ABERTA'), () => tentar(() => { const c = aberta(100); c.abrir(500); })),
  caso('RF-02', OO + ' · abrir duas vezes preserva saldo', 'abrir(100) → abrir(500) falha → obterSaldo()', 100, () => {
    const c = aberta(100);
    tentar(() => c.abrir(500));
    return c.obterSaldo();
  }),
  caso('RF-07', OO + ' · fechar duas vezes', 'abrir(100) → fechar() → fechar()', erro('CARTEIRA_JA_FECHADA'), () => tentar(() => { const c = aberta(100); c.fechar(); c.fechar(); })),
  caso('RF-06', OO + ' · operações após fechar', 'abrir(100) → fechar() → depositar / sacar / aplicarJuros', [erro('CARTEIRA_FECHADA'), erro('CARTEIRA_FECHADA'), erro('CARTEIRA_FECHADA')], () => {
    const c = aberta(100);
    c.fechar();
    return [tentar(() => c.depositar(10)), tentar(() => c.sacar(10)), tentar(() => c.aplicarJuros(5))];
  }),
  caso('RF-07', OO + ' · saldo final após fechar', 'abrir(100) → fechar() → obterSaldo()', 100, () => { const c = aberta(100); c.fechar(); return c.obterSaldo(); }),
  caso('RF-02', OO + ' · reabrir após fechar (ciclo da máquina de estados)', 'abrir(100) → fechar() → abrir(50) → obterSaldo()', 50, () =>
    tentar(() => { const c = aberta(100); c.fechar(); c.abrir(50); return c.obterSaldo(); })),
  caso('RF-04 / RNF-01', OO + ' · saque rejeitado não altera o saldo', 'abrir(100) → sacar(100.01) falha → obterSaldo()', 100, () => {
    const c = aberta(100);
    tentar(() => c.sacar(100.01));
    return c.obterSaldo();
  }),
  caso('RNF-01', OO + ' · zerar e tentar sacar de novo', 'abrir(100) → sacar(100) → sacar(0.01)', erro('SALDO_INSUFICIENTE'), () => tentar(() => { const c = aberta(100); c.sacar(100); c.sacar(0.01); })),
  caso('RNF-01', OO + ' · saldo nunca negativo após rodada de operações', 'abrir(10) → sacar(4) → sacar(4) → sacar(4) falha → obterSaldo()', 2, () => {
    const c = aberta(10);
    c.sacar(4);
    c.sacar(4);
    tentar(() => c.sacar(4));
    return c.obterSaldo();
  }),
  caso('RF-02', OO + ' · obterSaldo em carteira nova', 'carteira nova: obterSaldo()', 0, () => new CarteiraDigital().obterSaldo()),
  caso('RF-03 / RF-04', FD + ' · saldo com centavos', 'abrir(100.10) → depositar(0.20) → sacar(0.10)', 100.2, () => saldoApos(100.1, (c) => { c.depositar(0.2); c.sacar(0.1); })),
  caso('RF-05', FD + ' · juros sobre saldo com centavos', 'abrir(100.50) → aplicarJuros(10)', 110.55, () => saldoApos(100.5, (c) => c.aplicarJuros(10))),
];

const aprovadoNotif = (l) => `Empréstimo aprovado! Limite de crédito: R$ ${l}`;
const rejeitadoNotif = (m) => `Empréstimo não aprovado. Motivo: ${m}`;
const notificar = (r) => tentar(() => gerarMensagemNotificacao(r));

const notificador = [
  caso('RF-01 + RF-08', CI + ' · resultado real (aprovação)', 'gerarMensagemNotificacao(avaliarPedidoEmprestimo(45, 4500))', aprovadoNotif('13500.00'), () => integrar(45, 4500)),
  caso('RF-01 + RF-08', CI + ' · resultado real (idoso, limite pela metade)', 'gerarMensagemNotificacao(avaliarPedidoEmprestimo(65, 2000))', aprovadoNotif('2000.00'), () => integrar(65, 2000)),
  caso('RF-01 + RF-08', CI + ' · resultado real (rejeição por idade)', 'gerarMensagemNotificacao(avaliarPedidoEmprestimo(17, 2000))', rejeitadoNotif('IDADE_FORA_DO_LIMITE'), () => integrar(17, 2000)),
  caso('RF-01 + RF-08', CI + ' · resultado real (rejeição por renda)', 'gerarMensagemNotificacao(avaliarPedidoEmprestimo(30, 800))', rejeitadoNotif('RENDA_INSUFICIENTE'), () => integrar(30, 800)),
  caso('RF-08', CI + ' · motivo textual qualquer', "gerarMensagemNotificacao({aprovado:false, motivo:'Renda insuficiente', limiteCredito:null})", rejeitadoNotif('Renda insuficiente'), () => notificar({ aprovado: false, motivo: 'Renda insuficiente', limiteCredito: null })),
  caso('RF-08', CI + ' · formatação com 2 casas', 'gerarMensagemNotificacao({aprovado:true, motivo:null, limiteCredito:1234.5})', aprovadoNotif('1234.50'), () => notificar({ aprovado: true, motivo: null, limiteCredito: 1234.5 })),
  caso('RF-08', CI + ' · contrato: aprovado sem limite', 'gerarMensagemNotificacao({aprovado:true, motivo:null, limiteCredito:null})', erro('RESULTADO_INVALIDO'), () => notificar({ aprovado: true, motivo: null, limiteCredito: null })),
  caso('RF-08', CI + ' · contrato: limite com tipo incorreto', "gerarMensagemNotificacao({aprovado:true, motivo:null, limiteCredito:'4000'})", erro('RESULTADO_INVALIDO'), () => notificar({ aprovado: true, motivo: null, limiteCredito: '4000' })),
  caso('RF-08', CI + ' · contrato: rejeitado sem motivo', 'gerarMensagemNotificacao({aprovado:false, motivo:null, limiteCredito:null})', erro('RESULTADO_INVALIDO'), () => notificar({ aprovado: false, motivo: null, limiteCredito: null })),
  caso('RF-08', CI + ' · contrato: aprovado não booleano', "gerarMensagemNotificacao({aprovado:'sim'})", erro('RESULTADO_INVALIDO'), () => notificar({ aprovado: 'sim' })),
  caso('RF-08', CI + ' · contrato: campo aprovado ausente', 'gerarMensagemNotificacao({motivo:null})', erro('RESULTADO_INVALIDO'), () => notificar({ motivo: null })),
  caso('RF-08', CI + ' · contrato: null', 'gerarMensagemNotificacao(null)', erro('RESULTADO_INVALIDO'), () => notificar(null)),
];

// cenário da Maria 
const cliCasos = [
  caso('RF-09 + RF-01 + RF-08', SC + ' · Maria, passo 1', 'node index.js emprestimo 45 4500', { status: 0, saida: aprovadoNotif('13500.00') }, () => cli('emprestimo', '45', '4500')),
  caso('RF-09 + RF-02', SC + ' · Maria, passo 2 (valor copiado da mensagem)', 'node index.js carteira abrir 13500.00', { status: 0, saida: 'Carteira aberta. Saldo: R$ 13500.00' }, () => cli('carteira', 'abrir', '13500.00')),
  caso('RF-09 + RF-02', SC + ' · Maria, passo 2 (valor inteiro)', 'node index.js carteira abrir 13500', { status: 0, saida: 'Carteira aberta. Saldo: R$ 13500.00' }, () => cli('carteira', 'abrir', '13500')),
  caso('RF-02 + RF-04', SC + ' · Maria, passos 2-3 (mesma carteira, na classe)', 'abrir(13500) → sacar(500) → obterSaldo()', 13000, () => saldoApos(13500, (c) => c.sacar(500))),
  caso('RF-09', SC + ' · Maria, passo 3 pela CLI (carteira nova a cada chamada)', 'node index.js carteira sacar 500', { status: 1, saida: 'Erro: CARTEIRA_FECHADA' }, () => cli('carteira', 'sacar', '500')),
  caso('RF-09 + RF-01 + RF-08', SC + ' · empréstimo rejeitado por idade', 'node index.js emprestimo 17 5000', { status: 0, saida: rejeitadoNotif('IDADE_FORA_DO_LIMITE') }, () => cli('emprestimo', '17', '5000')),
  caso('RF-09 + RF-01 + RF-08', SC + ' · empréstimo rejeitado por renda', 'node index.js emprestimo 30 1000', { status: 0, saida: rejeitadoNotif('RENDA_INSUFICIENTE') }, () => cli('emprestimo', '30', '1000')),
  caso('RF-09', SC + ' · valor no formato brasileiro', 'node index.js carteira abrir 1.500,75', { status: 0, saida: 'Carteira aberta. Saldo: R$ 1500.75' }, () => cli('carteira', 'abrir', '1.500,75')),
  caso('RF-09', SC + ' · saldo de carteira nova', 'node index.js carteira saldo', { status: 0, saida: 'Saldo: R$ 0.00' }, () => cli('carteira', 'saldo')),
  caso('RF-09 + RF-06', SC + ' · fechar carteira nova', 'node index.js carteira fechar', { status: 1, saida: 'Erro: CARTEIRA_JA_FECHADA' }, () => cli('carteira', 'fechar')),
  caso('RF-09', SC + ' · número inválido', 'node index.js emprestimo abc 4500', { status: 2, saida: 'Número inválido: abc' }, () => cli('emprestimo', 'abc', '4500')),
  caso('RF-09', SC + ' · argumento ausente', 'node index.js emprestimo 45', { status: 2, saida: 'Número inválido: undefined' }, () => cli('emprestimo', '45')),
  caso('RF-09', SC + ' · comando desconhecido', 'node index.js foo', { status: 2, saida: 'Uso:' }, () => cli('foo')),
];

const todos = [...emprestimo, ...carteira, ...notificador, ...cliCasos];
const casos = todos.map((c, i) => ({ id: `CT-${String(i + 1).padStart(2, '0')}`, ...c }));

const { test } = require('node:test');
const assert = require('node:assert/strict');

for (const c of casos) {
  test(`${c.id} ${c.rf} [${c.tecnica}]: ${c.entrada}`, () => {
    const obtido = c.executar();
    if (c.esperado && c.esperado.saida === 'Uso:') {
      // CLI sem comando válido: confere o código de saída e o início da mensagem de uso
      assert.equal(obtido.status, c.esperado.status);
      assert.ok(obtido.saida.startsWith('Uso:'));
      return;
    }
    assert.deepStrictEqual(obtido, c.esperado);
  });
}