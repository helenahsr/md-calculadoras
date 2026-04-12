export type Base = 'decimal' | 'binario' | 'hexadecimal';

export interface PassoConversao {
  descricao: string;
  detalhe?: string;
}

export interface ResultadoConversao {
  valorOriginal: string;
  baseOrigem: Base;
  baseDestino: Base;
  resultado: string;
  passos: PassoConversao[];
}

export interface ResultadoOperacao {
  valor1: string;
  valor2: string;
  base: Base;
  operacao: 'soma' | 'subtracao' | 'multiplicacao';
  resultado: string;
  erro?: string;
}

const nomeBase: Record<Base, string> = {
  decimal: 'Decimal (base 10)',
  binario: 'Binário (base 2)',
  hexadecimal: 'Hexadecimal (base 16)',
};

const valorBase: Record<Base, number> = {
  decimal: 10,
  binario: 2,
  hexadecimal: 16,
};

function hexCharToVal(c: string): number {
  const map: Record<string, number> = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
    '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15,
  };
  return map[c.toUpperCase()] ?? -1;
}

function valToHexChar(v: number): string {
  if (v < 10) return v.toString();
  return String.fromCharCode('A'.charCodeAt(0) + (v - 10));
}

export function validarEntrada(valor: string, base: Base): boolean {
  if (!valor || valor.trim() === '') return false;
  const v = valor.trim().toUpperCase();
  switch (base) {
    case 'decimal':
      return /^[0-9]+$/.test(v);
    case 'binario':
      return /^[01]+$/.test(v);
    case 'hexadecimal':
      return /^[0-9A-F]+$/.test(v);
  }
}

function converterParaDecimal(valor: string, baseOrigem: Base): { decimal: number; passos: PassoConversao[] } {
  const passos: PassoConversao[] = [];
  const v = valor.toUpperCase();
  const b = valorBase[baseOrigem];

  if (baseOrigem === 'decimal') {
    passos.push({ descricao: `O valor ${v} já está na base decimal.` });
    return { decimal: parseInt(v, 10), passos };
  }

  passos.push({
    descricao: `Converter ${v} de ${nomeBase[baseOrigem]} para Decimal`,
    detalhe: `Para converter de base ${b} para decimal, multiplicamos cada dígito pela base elevada à sua posição (da direita para a esquerda, começando em 0).`,
  });

  const digitos = v.split('');
  const termos: string[] = [];
  let soma = 0;

  digitos.forEach((digito, i) => {
    const posicao = digitos.length - 1 - i;
    const valorDigito = hexCharToVal(digito);
    const parcela = valorDigito * Math.pow(b, posicao);
    const nomeDigito = baseOrigem === 'hexadecimal' && valorDigito >= 10
      ? `${digito}(=${valorDigito})`
      : digito;
    termos.push(`${nomeDigito} × ${b}^${posicao}`);
    soma += parcela;

    passos.push({
      descricao: `Posição ${posicao}: ${nomeDigito} × ${b}^${posicao} = ${valorDigito} × ${Math.pow(b, posicao)} = ${parcela}`,
    });
  });

  passos.push({
    descricao: `Somando todas as parcelas:`,
    detalhe: `${termos.join(' + ')} = ${soma}`,
  });

  passos.push({
    descricao: `Resultado: ${v} em ${nomeBase[baseOrigem]} = ${soma} em Decimal`,
  });

  return { decimal: soma, passos };
}

function converterDeDecimal(decimal: number, baseDestino: Base): { resultado: string; passos: PassoConversao[] } {
  const passos: PassoConversao[] = [];
  const b = valorBase[baseDestino];

  if (baseDestino === 'decimal') {
    passos.push({ descricao: `O valor ${decimal} já está na base decimal.` });
    return { resultado: decimal.toString(), passos };
  }

  if (decimal === 0) {
    passos.push({ descricao: `O valor 0 em qualquer base é 0.` });
    return { resultado: '0', passos };
  }

  passos.push({
    descricao: `Converter ${decimal} de Decimal para ${nomeBase[baseDestino]}`,
    detalhe: `Para converter de decimal para base ${b}, dividimos o número sucessivamente por ${b} e anotamos os restos. O resultado é a leitura dos restos de baixo para cima.`,
  });

  const restos: string[] = [];
  let quociente = decimal;
  let iteracao = 1;

  while (quociente > 0) {
    const resto = quociente % b;
    const novoQuociente = Math.floor(quociente / b);
    const restoStr = baseDestino === 'hexadecimal' && resto >= 10
      ? `${resto}(=${valToHexChar(resto)})`
      : resto.toString();
    const restoChar = baseDestino === 'hexadecimal' ? valToHexChar(resto) : resto.toString();

    passos.push({
      descricao: `Divisão ${iteracao}: ${quociente} ÷ ${b} = ${novoQuociente}, resto = ${restoStr}`,
    });

    restos.push(restoChar);
    quociente = novoQuociente;
    iteracao++;
  }

  const resultado = restos.reverse().join('');

  passos.push({
    descricao: `Lendo os restos de baixo para cima:`,
    detalhe: `${restos.join('')}`,
  });

  passos.push({
    descricao: `Resultado: ${decimal} em Decimal = ${resultado} em ${nomeBase[baseDestino]}`,
  });

  return { resultado, passos };
}


function binarioParaHex(binario: string): { resultado: string; passos: PassoConversao[] } {
  const passos: PassoConversao[] = [];

  passos.push({
    descricao: `Converter ${binario} de Binário para Hexadecimal`,
    detalhe: `Para converter binário → hexadecimal, agrupamos os bits de 4 em 4 (da direita para a esquerda) e convertemos cada grupo para o dígito hexadecimal correspondente.`,
  });

  let bin = binario;
  while (bin.length % 4 !== 0) {
    bin = '0' + bin;
  }

  if (bin !== binario) {
    passos.push({
      descricao: `Completando com zeros à esquerda: ${bin} (para ter grupos de 4 bits)`,
    });
  }

  const grupos: string[] = [];
  const hexDigitos: string[] = [];

  for (let i = 0; i < bin.length; i += 4) {
    const grupo = bin.substring(i, i + 4);
    grupos.push(grupo);
    const valor = parseInt(grupo, 2);
    const hexChar = valToHexChar(valor);
    hexDigitos.push(hexChar);

    passos.push({
      descricao: `Grupo "${grupo}" → ${valor} em decimal → ${hexChar} em hexadecimal`,
    });
  }

  const resultado = hexDigitos.join('');

  passos.push({
    descricao: `Juntando todos os grupos:`,
    detalhe: `${resultado}`,
  });

  passos.push({
    descricao: `Resultado: ${binario} em Binário = ${resultado} em Hexadecimal`,
  });

  return { resultado, passos };
}

function hexParaBinario(hex: string): { resultado: string; passos: PassoConversao[] } {
  const passos: PassoConversao[] = [];
  const h = hex.toUpperCase();

  passos.push({
    descricao: `Converter ${h} de Hexadecimal para Binário`,
    detalhe: `Para converter hexadecimal → binário, convertemos cada dígito hexadecimal para seu equivalente de 4 bits.`,
  });

  const binGrupos: string[] = [];

  for (const digito of h) {
    const valor = hexCharToVal(digito);
    const binario4 = valor.toString(2).padStart(4, '0');
    binGrupos.push(binario4);

    const nomeDigito = valor >= 10 ? `${digito}(=${valor})` : digito;
    passos.push({
      descricao: `Dígito ${nomeDigito} → ${binario4} em binário`,
    });
  }

  let resultado = binGrupos.join('');
  resultado = resultado.replace(/^0+/, '') || '0';

  passos.push({
    descricao: `Juntando todos os grupos:`,
    detalhe: `${binGrupos.join(' ')} = ${resultado}`,
  });

  passos.push({
    descricao: `Resultado: ${h} em Hexadecimal = ${resultado} em Binário`,
  });

  return { resultado, passos };
}

export function converter(valor: string, baseOrigem: Base, baseDestino: Base): ResultadoConversao {
  const v = valor.trim().toUpperCase();
  const todosPassos: PassoConversao[] = [];

  if (baseOrigem === baseDestino) {
    return {
      valorOriginal: v,
      baseOrigem,
      baseDestino,
      resultado: v,
      passos: [{ descricao: `O valor já está na base de destino. Nenhuma conversão necessária.` }],
    };
  }

  if (baseOrigem === 'binario' && baseDestino === 'hexadecimal') {
    const { resultado, passos } = binarioParaHex(v);
    return { valorOriginal: v, baseOrigem, baseDestino, resultado, passos };
  }

  if (baseOrigem === 'hexadecimal' && baseDestino === 'binario') {
    const { resultado, passos } = hexParaBinario(v);
    return { valorOriginal: v, baseOrigem, baseDestino, resultado, passos };
  }

  let decimal: number;

  if (baseOrigem === 'decimal') {
    decimal = parseInt(v, 10);
    todosPassos.push({ descricao: `O valor ${v} já está em decimal: ${decimal}` });
  } else {
    const resultDecimal = converterParaDecimal(v, baseOrigem);
    decimal = resultDecimal.decimal;
    todosPassos.push(...resultDecimal.passos);

    if (baseDestino !== 'decimal') {
      todosPassos.push({
        descricao: '─────────────────────────────────',
        detalhe: `Agora, converter o valor decimal ${decimal} para ${nomeBase[baseDestino]}:`,
      });
    }
  }

  if (baseDestino === 'decimal') {
    return {
      valorOriginal: v,
      baseOrigem,
      baseDestino,
      resultado: decimal.toString(),
      passos: todosPassos,
    };
  }

  const resultFinal = converterDeDecimal(decimal, baseDestino);
  todosPassos.push(...resultFinal.passos);

  return {
    valorOriginal: v,
    baseOrigem,
    baseDestino,
    resultado: resultFinal.resultado,
    passos: todosPassos,
  };
}

function paraDecimal(valor: string, base: Base): number {
  const v = valor.trim().toUpperCase();
  switch (base) {
    case 'decimal': return parseInt(v, 10);
    case 'binario': return parseInt(v, 2);
    case 'hexadecimal': return parseInt(v, 16);
  }
}

function deDecimal(decimal: number, base: Base): string {
  switch (base) {
    case 'decimal': return decimal.toString();
    case 'binario': return decimal.toString(2);
    case 'hexadecimal': return decimal.toString(16).toUpperCase();
  }
}

export function operar(
  valor1: string,
  valor2: string,
  base: Base,
  operacao: 'soma' | 'subtracao' | 'multiplicacao'
): ResultadoOperacao {
  const v1 = valor1.trim().toUpperCase();
  const v2 = valor2.trim().toUpperCase();

  const dec1 = paraDecimal(v1, base);
  const dec2 = paraDecimal(v2, base);

  if (operacao === 'subtracao' && dec1 < dec2) {
    return {
      valor1: v1,
      valor2: v2,
      base,
      operacao,
      resultado: '',
      erro: 'Esse tipo de operação não é suportada. Não é possível subtrair um número maior de um menor (resultado negativo).',
    };
  }

  let resultadoDecimal: number;
  switch (operacao) {
    case 'soma':
      resultadoDecimal = dec1 + dec2;
      break;
    case 'subtracao':
      resultadoDecimal = dec1 - dec2;
      break;
    case 'multiplicacao':
      resultadoDecimal = dec1 * dec2;
      break;
  }

  return {
    valor1: v1,
    valor2: v2,
    base,
    operacao,
    resultado: deDecimal(resultadoDecimal, base),
  };
}
