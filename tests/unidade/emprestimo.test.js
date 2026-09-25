'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { avaliarPedidoEmprestimo } = require('../../src/emprestimo');

test('RF-01: solicitante de 30 anos com renda de R$ 2.000 é aprovado com limite 2x', () => {
  assert.deepEqual(avaliarPedidoEmprestimo(30, 2000), {
    aprovado: true,
    motivo: null,
    limiteCredito: 4000,
  });
});

test('RF-01: solicitante menor de idade é rejeitado', () => {
  assert.deepEqual(avaliarPedidoEmprestimo(16, 5000), {
    aprovado: false,
    motivo: 'IDADE_FORA_DO_LIMITE',
    limiteCredito: null,
  });
});

test('RF-01: renda muito baixa é rejeitada', () => {
  assert.deepEqual(avaliarPedidoEmprestimo(40, 800), {
    aprovado: false,
    motivo: 'RENDA_INSUFICIENTE',
    limiteCredito: null,
  });
});
