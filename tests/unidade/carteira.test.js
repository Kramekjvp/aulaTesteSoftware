'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { CarteiraDigital } = require('../../src/carteira');

test('RF-02..RF-07: sequência mínima abrir → depositar → sacar → aplicarJuros → fechar', () => {
  const carteira = new CarteiraDigital();
  carteira.abrir(100);
  carteira.depositar(50);
  carteira.sacar(30);
  carteira.aplicarJuros(10);
  assert.equal(carteira.fechar(), 132);
});

test('RF-06: depósito em carteira nunca aberta é recusado', () => {
  const carteira = new CarteiraDigital();
  assert.throws(() => carteira.depositar(10), { message: 'CARTEIRA_FECHADA' });
});

test('RF-04: saque maior que o saldo é recusado', () => {
  const carteira = new CarteiraDigital();
  carteira.abrir(100);
  assert.throws(() => carteira.sacar(500), { message: 'SALDO_INSUFICIENTE' });
});