'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { gerarMensagemNotificacao } = require('../../src/notificador');

test('RF-08: mensagem de aprovação com limite formatado', () => {
  const mensagem = gerarMensagemNotificacao({ aprovado: true, motivo: null, limiteCredito: 4000 });
  assert.equal(mensagem, 'Empréstimo aprovado! Limite de crédito: R$ 4000.00');
});

test('RF-08: mensagem de rejeição com o motivo', () => {
  const mensagem = gerarMensagemNotificacao({
    aprovado: false,
    motivo: 'Renda insuficiente',
    limiteCredito: null,
  });
  assert.equal(mensagem, 'Empréstimo não aprovado. Motivo: Renda insuficiente');
});

test('RF-08: resultado sem o campo aprovado é inválido', () => {
  assert.throws(() => gerarMensagemNotificacao({ motivo: null }), { message: 'RESULTADO_INVALIDO' });
});
