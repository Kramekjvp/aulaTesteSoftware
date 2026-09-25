'use strict';

// O motivo é exibido direto ao usuário, então precisa ser uma frase legível
// (ex.: "Renda insuficiente").
const FORMATO_MOTIVO = /^[A-ZÀ-Ý][a-zà-ÿ ]*$/;

function resultadoInvalido() {
  return new Error('RESULTADO_INVALIDO');
}

/**
 * Gera uma mensagem de notificação a partir do resultado de uma avaliação
 * de empréstimo (RF-08).
 *
 * @param {{aprovado: boolean, motivo: string|null, limiteCredito: number|null}} resultado
 * @returns {string}
 * @throws {Error} "RESULTADO_INVALIDO" se `resultado` não tiver o formato esperado
 */
function gerarMensagemNotificacao(resultado) {
  if (resultado === null || typeof resultado !== 'object') {
    throw resultadoInvalido();
  }
  if (typeof resultado.aprovado !== 'boolean') {
    throw resultadoInvalido();
  }

  if (resultado.aprovado) {
    if (typeof resultado.limiteCredito !== 'number' || !Number.isFinite(resultado.limiteCredito)) {
      throw resultadoInvalido();
    }
    return `Empréstimo aprovado! Limite de crédito: R$ ${resultado.limiteCredito.toFixed(2)}`;
  }

  if (typeof resultado.motivo !== 'string' || !FORMATO_MOTIVO.test(resultado.motivo)) {
    throw resultadoInvalido();
  }
  return `Empréstimo não aprovado. Motivo: ${resultado.motivo}`;
}

module.exports = { gerarMensagemNotificacao };
