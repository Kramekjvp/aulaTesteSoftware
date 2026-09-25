'use strict';

const IDADE_MINIMA = 18;
const IDADE_MAXIMA = 70;
const IDADE_REDUCAO_LIMITE = 65;
const RENDA_MINIMA = 1200;

/**
 * Retorna o multiplicador da faixa de renda para o cálculo do limite.
 * @param {number} rendaMensal
 * @returns {number}
 */
function multiplicadorPorFaixa(rendaMensal) {
  if (rendaMensal < 3000) {
    return 2;
  }
  if (rendaMensal < 8000) {
    return 3;
  }
  return 4;
}

/**
 * Avalia um pedido de empréstimo (RF-01).
 *
 * @param {number} idade        - idade do solicitante, em anos completos (inteiro)
 * @param {number} rendaMensal  - renda mensal do solicitante, em reais
 * @returns {{
 *   aprovado: boolean,
 *   motivo: string | null,
 *   limiteCredito: number | null
 * }}
 */
function avaliarPedidoEmprestimo(idade, rendaMensal) {
  if (idade < IDADE_MINIMA || idade > IDADE_MAXIMA) {
    return { aprovado: false, motivo: 'IDADE_FORA_DO_LIMITE', limiteCredito: null };
  }

  if (rendaMensal <= RENDA_MINIMA) {
    return { aprovado: false, motivo: 'RENDA_INSUFICIENTE', limiteCredito: null };
  }

  let limiteCredito = rendaMensal * multiplicadorPorFaixa(rendaMensal);

  if (idade >= IDADE_REDUCAO_LIMITE) {
    limiteCredito = limiteCredito / 2;
  }

  return { aprovado: true, motivo: null, limiteCredito };
}

module.exports = { avaliarPedidoEmprestimo };
