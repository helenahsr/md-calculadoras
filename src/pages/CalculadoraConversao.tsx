'use client';

import { useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import {
  Base,
  ResultadoConversao,
  ResultadoOperacao,
  converter,
  operar,
  validarEntrada,
} from '../utils/conversaoBases';

const BASES: { value: Base; label: string; sigla: string }[] = [
  { value: 'decimal', label: 'Decimal (base 10)', sigla: 'DEC' },
  { value: 'binario', label: 'Binário (base 2)', sigla: 'BIN' },
  { value: 'hexadecimal', label: 'Hexadecimal (base 16)', sigla: 'HEX' },
];

const OPERACOES: { value: 'soma' | 'subtracao' | 'multiplicacao'; label: string; simbolo: string }[] = [
  { value: 'soma', label: 'Soma', simbolo: '+' },
  { value: 'subtracao', label: 'Subtração', simbolo: '−' },
  { value: 'multiplicacao', label: 'Multiplicação', simbolo: '×' },
];

export default function CalculadoraConversao() {
  const [aba, setAba] = useState<'conversao' | 'operacao'>('conversao');

  const [valorConversao, setValorConversao] = useState('');
  const [baseOrigem, setBaseOrigem] = useState<Base>('decimal');
  const [baseDestino, setBaseDestino] = useState<Base>('binario');
  const [resultadoConversao, setResultadoConversao] = useState<ResultadoConversao | null>(null);
  const [erroConversao, setErroConversao] = useState('');

  const [valor1, setValor1] = useState('');
  const [valor2, setValor2] = useState('');
  const [baseOperacao, setBaseOperacao] = useState<Base>('binario');
  const [operacao, setOperacao] = useState<'soma' | 'subtracao' | 'multiplicacao'>('soma');
  const [resultadoOperacao, setResultadoOperacao] = useState<ResultadoOperacao | null>(null);
  const [erroOperacao, setErroOperacao] = useState('');

  const handleConverter = () => {
    setResultadoConversao(null);
    setErroConversao('');

    if (!valorConversao.trim()) {
      setErroConversao('Digite um valor para converter.');
      return;
    }

    if (!validarEntrada(valorConversao, baseOrigem)) {
      setErroConversao(`O valor "${valorConversao}" não é válido para a base ${BASES.find(b => b.value === baseOrigem)?.label}.`);
      return;
    }

    const resultado = converter(valorConversao, baseOrigem, baseDestino);
    setResultadoConversao(resultado);
  };

  const handleOperar = () => {
    setResultadoOperacao(null);
    setErroOperacao('');

    if (!valor1.trim() || !valor2.trim()) {
      setErroOperacao('Digite os dois valores para realizar a operação.');
      return;
    }

    if (!validarEntrada(valor1, baseOperacao)) {
      setErroOperacao(`O valor "${valor1}" não é válido para a base ${BASES.find(b => b.value === baseOperacao)?.label}.`);
      return;
    }

    if (!validarEntrada(valor2, baseOperacao)) {
      setErroOperacao(`O valor "${valor2}" não é válido para a base ${BASES.find(b => b.value === baseOperacao)?.label}.`);
      return;
    }

    const resultado = operar(valor1, valor2, baseOperacao, operacao);
    setResultadoOperacao(resultado);
  };

  const trocarBases = () => {
    const temp = baseOrigem;
    setBaseOrigem(baseDestino);
    setBaseDestino(temp);
    setResultadoConversao(null);
    setErroConversao('');
  };

  const placeholderPorBase = (base: Base): string => {
    switch (base) {
      case 'decimal': return 'Ex: 255';
      case 'binario': return 'Ex: 11001010';
      case 'hexadecimal': return 'Ex: 1A3F';
    }
  };

  return (
    <div className="calc-bases-container">
      <div className="calc-bases-header place-content-center">
        <h1 className="calc-bases-title">Calculadora de Bases</h1>
        <p className="calc-bases-subtitle">Conversão e operações entre Decimal, Binário e Hexadecimal</p>
      </div>

      <div className="calc-tabs">
        <button
          className={`calc-tab ${aba === 'conversao' ? 'calc-tab-active' : ''}`}
          onClick={() => { setAba('conversao'); setResultadoOperacao(null); setErroOperacao(''); }}
        >
          Conversão de Bases
        </button>
        <button
          className={`calc-tab ${aba === 'operacao' ? 'calc-tab-active' : ''}`}
          onClick={() => { setAba('operacao'); setResultadoConversao(null); setErroConversao(''); }}
        >
          Operações Aritméticas
        </button>
      </div>

      <div className="calc-content">
        {aba === 'conversao' && (
          <div className="calc-panel fade-in">
            <div className="calc-conversion-grid">
              <div className="calc-field-group">
                <label className="calc-label">Base de Origem</label>
                <div className="calc-base-selector">
                  {BASES.map(b => (
                    <button
                      key={b.value}
                      className={`calc-base-btn ${baseOrigem === b.value ? 'calc-base-btn-active' : ''}`}
                      onClick={() => { setBaseOrigem(b.value); setResultadoConversao(null); setErroConversao(''); }}
                    >
                      <span className="calc-base-sigla">{b.sigla}</span>
                      <span className="calc-base-nome">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="calc-field-group">
                <label className="calc-label">Valor na base de origem</label>
                <input
                  type="text"
                  className="calc-input"
                  value={valorConversao}
                  onChange={(e) => { setValorConversao(e.target.value); setErroConversao(''); }}
                  placeholder={placeholderPorBase(baseOrigem)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConverter()}
                />
              </div>

              <div className="calc-swap-container">
                <button className="calc-swap-btn" onClick={trocarBases} title="Trocar bases">
                  <ArrowDownUp />
                </button>
              </div>

              <div className="calc-field-group">
                <label className="calc-label">Base de Destino</label>
                <div className="calc-base-selector">
                  {BASES.map(b => (
                    <button
                      key={b.value}
                      className={`calc-base-btn ${baseDestino === b.value ? 'calc-base-btn-active' : ''}`}
                      onClick={() => { setBaseDestino(b.value); setResultadoConversao(null); setErroConversao(''); }}
                    >
                      <span className="calc-base-sigla">{b.sigla}</span>
                      <span className="calc-base-nome">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="calc-action-btn" onClick={handleConverter}>
              Converter
            </button>

            {erroConversao && (
              <div className="calc-erro fade-in">
                {erroConversao}
              </div>
            )}

            {resultadoConversao && (
              <div className="calc-resultado-container fade-in">
                <div className="calc-resultado-header">
                  <span className="calc-resultado-label">Resultado</span>
                  <div className="calc-resultado-valor">
                    <span className="calc-resultado-de">
                      {resultadoConversao.valorOriginal}
                      <small>({BASES.find(b => b.value === resultadoConversao.baseOrigem)?.sigla})</small>
                    </span>
                    <span className="calc-resultado-seta">→</span>
                    <span className="calc-resultado-para">
                      {resultadoConversao.resultado}
                      <small>({BASES.find(b => b.value === resultadoConversao.baseDestino)?.sigla})</small>
                    </span>
                  </div>
                </div>

                <div className="calc-passos">
                  <h3 className="calc-passos-titulo">📝 Passo a Passo</h3>
                  <div className="calc-passos-lista">
                    {resultadoConversao.passos.map((passo, index) => (
                      <div key={index} className="calc-passo">
                        <div className="calc-passo-numero">{index + 1}</div>
                        <div className="calc-passo-conteudo">
                          <p className="calc-passo-descricao">{passo.descricao}</p>
                          {passo.detalhe && (
                            <p className="calc-passo-detalhe">{passo.detalhe}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {aba === 'operacao' && (
          <div className="calc-panel fade-in">
            <div className="calc-field-group">
              <label className="calc-label">Base dos valores</label>
              <div className="calc-base-selector">
                {BASES.map(b => (
                  <button
                    key={b.value}
                    className={`calc-base-btn ${baseOperacao === b.value ? 'calc-base-btn-active' : ''}`}
                    onClick={() => { setBaseOperacao(b.value); setResultadoOperacao(null); setErroOperacao(''); }}>
                    <span className="calc-base-sigla">{b.sigla}</span>
                    <span className="calc-base-nome">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="calc-operacao-inputs">
              <div className="calc-field-group">
                <label className="calc-label">Valor 1</label>
                <input
                  type="text"
                  className="calc-input"
                  value={valor1}
                  onChange={(e) => { setValor1(e.target.value); setErroOperacao(''); }}
                  placeholder={placeholderPorBase(baseOperacao)}
                />
              </div>

              <div className="calc-operacao-selector">
                {OPERACOES.map(op => (
                  <button
                    key={op.value}
                    className={`calc-op-btn ${operacao === op.value ? 'calc-op-btn-active' : ''}`}
                    onClick={() => { setOperacao(op.value); setResultadoOperacao(null); setErroOperacao(''); }}
                    title={op.label}>
                    {op.simbolo}
                  </button>
                ))}
              </div>

              <div className="calc-field-group">
                <label className="calc-label">Valor 2</label>
                <input
                  type="text"
                  className="calc-input"
                  value={valor2}
                  onChange={(e) => { setValor2(e.target.value); setErroOperacao(''); }}
                  placeholder={placeholderPorBase(baseOperacao)}
                  onKeyDown={(e) => e.key === 'Enter' && handleOperar()}
                />
              </div>
            </div>

            <button className="calc-action-btn" onClick={handleOperar}>
              Calcular
            </button>

            {erroOperacao && (
              <div className="calc-erro fade-in">
                {erroOperacao}
              </div>
            )}

            {resultadoOperacao && (
              <div className="calc-resultado-container fade-in">
                {resultadoOperacao.erro ? (
                  <div className="calc-erro fade-in">
                    <p>{resultadoOperacao.erro}</p>
                  </div>
                ) : (
                  <div className="calc-resultado-operacao">
                    <div className="calc-op-expressao">
                      <span className="calc-op-valor">{resultadoOperacao.valor1}</span>
                      <span className="calc-op-simbolo">
                        {OPERACOES.find(o => o.value === resultadoOperacao.operacao)?.simbolo}
                      </span>
                      <span className="calc-op-valor">{resultadoOperacao.valor2}</span>
                      <span className="calc-op-igual">=</span>
                      <span className="calc-op-resultado">{resultadoOperacao.resultado}</span>
                    </div>
                    <p className="calc-op-base-info">
                      na base {BASES.find(b => b.value === resultadoOperacao.base)?.label}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
