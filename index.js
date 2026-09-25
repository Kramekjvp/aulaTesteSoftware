#!/usr/bin/env node
'use strict';

const { avaliarPedidoEmprestimo } = require('./src/emprestimo');
const { CarteiraDigital } = require('./src/carteira');
const { gerarMensagemNotificacao } = require('./src/notificador');

const USO = `Uso:
  node index.js emprestimo <idade> <rendaMensal>
  node index.js carteira <operacao> [valor]

Operações da carteira: abrir <saldoInicial> | depositar <valor> | sacar <valor>
                       | juros <taxaPercentual> | saldo | fechar
(cada chamada opera sobre uma carteira nova)`;

class ErroDeUso extends Error {}

function lerNumero(texto) {
  const numero = Number(texto);
  if (texto === undefined || texto.trim() === '' || Number.isNaN(numero)) {
    throw new ErroDeUso(`Número inválido: ${texto}`);
  }
  return numero;
}

/** Aceita valores digitados no formato brasileiro, ex.: "1.500,75". */
function lerValorMonetario(texto) {
  if (texto === undefined) {
    throw new ErroDeUso('Valor ausente');
  }
  return lerNumero(texto.replace('.', '').replace(',', '.'));
}

function formatarReais(valor) {
  return `R$ ${valor.toFixed(2)}`;
}

function comandoEmprestimo([idade, renda]) {
  const resultado = avaliarPedidoEmprestimo(lerNumero(idade), lerNumero(renda));
  return gerarMensagemNotificacao(resultado);
}

function comandoCarteira([operacao, valor]) {
  const carteira = new CarteiraDigital();

  switch (operacao) {
    case 'abrir':
      carteira.abrir(lerValorMonetario(valor));
      return `Carteira aberta. Saldo: ${formatarReais(carteira.obterSaldo())}`;
    case 'depositar':
      carteira.depositar(lerValorMonetario(valor));
      return `Depósito realizado. Saldo: ${formatarReais(carteira.obterSaldo())}`;
    case 'sacar':
      carteira.sacar(lerValorMonetario(valor));
      return `Saque realizado. Saldo: ${formatarReais(carteira.obterSaldo())}`;
    case 'juros':
      carteira.aplicarJuros(lerNumero(valor));
      return `Juros aplicados. Saldo: ${formatarReais(carteira.obterSaldo())}`;
    case 'saldo':
      return `Saldo: ${formatarReais(carteira.obterSaldo())}`;
    case 'fechar':
      return `Carteira fechada. Saldo final: ${formatarReais(carteira.fechar())}`;
    default:
      throw new ErroDeUso(`Operação de carteira desconhecida: ${operacao}`);
  }
}

const COMANDOS = {
  emprestimo: comandoEmprestimo,
  carteira: comandoCarteira,
};

/**
 * Executa a CLI (RF-09).
 * @param {string[]} args - argumentos sem "node" e sem o nome do script
 * @returns {number} código de saída
 */
function main(args) {
  const [comando, ...resto] = args;
  const executar = COMANDOS[comando];

  if (!executar) {
    console.error(USO);
    return 2;
  }

  try {
    console.log(executar(resto));
    return 0;
  } catch (erro) {
    if (erro instanceof ErroDeUso) {
      console.error(`${erro.message}\n\n${USO}`);
      return 2;
    }
    console.error(`Erro: ${erro.message}`);
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { main };
