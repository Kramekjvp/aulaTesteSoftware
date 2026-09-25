'use strict';

const ESTADO = Object.freeze({ FECHADA: 'FECHADA', ABERTA: 'ABERTA' });

/** Arredonda um valor monetário para centavos. */
function arredondarCentavos(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Carteira digital com máquina de estados (RF-02 a RF-07):
 *
 *   FECHADA --abrir()--> ABERTA --depositar()/sacar()/aplicarJuros()--> ABERTA --fechar()--> FECHADA
 *
 * Valores monetários são arredondados para centavos após cada operação.
 */
class CarteiraDigital {
  #estado;
  #saldo;

  /** Estado inicial: FECHADA. */
  constructor() {
    this.#estado = ESTADO.FECHADA;
    this.#saldo = 0;
  }

  /**
   * Abre a carteira. Só válido quando o estado é FECHADA.
   * @param {number} saldoInicial - deve ser >= 0
   * @throws {Error} "SALDO_INICIAL_INVALIDO" se saldoInicial < 0
   * @throws {Error} "CARTEIRA_JA_ABERTA" se já estiver aberta
   */
  abrir(saldoInicial) {
    if (this.#estado === ESTADO.ABERTA) {
      throw new Error('CARTEIRA_JA_ABERTA');
    }
    if (!Number.isFinite(saldoInicial) || saldoInicial < 0) {
      throw new Error('SALDO_INICIAL_INVALIDO');
    }
    this.#saldo = arredondarCentavos(saldoInicial);
    this.#estado = ESTADO.ABERTA;
  }

  /**
   * @param {number} valor - deve ser > 0
   * @throws {Error} "CARTEIRA_FECHADA" | "VALOR_INVALIDO"
   */
  depositar(valor) {
    this.#exigirAberta();
    if (!Number.isFinite(valor) || valor <= 0) {
      throw new Error('VALOR_INVALIDO');
    }
    this.#saldo = arredondarCentavos(this.#saldo + valor);
  }

  /**
   * @param {number} valor - deve ser > 0 e <= saldo atual
   * @throws {Error} "CARTEIRA_FECHADA" | "VALOR_INVALIDO" | "SALDO_INSUFICIENTE"
   */
  sacar(valor) {
    this.#exigirAberta();
    if (!Number.isFinite(valor) || valor <= 0) {
      throw new Error('VALOR_INVALIDO');
    }
    if (valor > this.#saldo) {
      throw new Error('SALDO_INSUFICIENTE');
    }
    this.#saldo = arredondarCentavos(this.#saldo - valor);
  }

  /**
   * @param {number} taxaPercentual - deve estar entre 0 e 100, inclusive
   * @throws {Error} "CARTEIRA_FECHADA" | "TAXA_INVALIDA"
   */
  aplicarJuros(taxaPercentual) {
    this.#exigirAberta();
    if (!Number.isFinite(taxaPercentual) || taxaPercentual < 0) {
      throw new Error('TAXA_INVALIDA');
    }
    this.#saldo = arredondarCentavos(this.#saldo * (1 + taxaPercentual / 100));
  }

  /** @returns {number} saldo atual (funciona em qualquer estado) */
  obterSaldo() {
    return this.#saldo;
  }

  /**
   * Fecha a carteira e retorna o saldo final.
   * @throws {Error} "CARTEIRA_JA_FECHADA"
   * @returns {number}
   */
  fechar() {
    if (this.#estado === ESTADO.FECHADA) {
      throw new Error('CARTEIRA_JA_FECHADA');
    }
    this.#estado = ESTADO.FECHADA;
    return this.#saldo;
  }

  #exigirAberta() {
    if (this.#estado !== ESTADO.ABERTA) {
      throw new Error('CARTEIRA_FECHADA');
    }
  }
}

module.exports = { CarteiraDigital };
