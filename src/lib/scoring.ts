import type { Corrupcao, EmpresaScore, Sabotagem, SimulationState } from "@/types";

// =====================================================================
// SCORING — funções puras, portadas 1:1 do js/app.js original.
//
// Sem dependência de DOM/React: recebem dados e devolvem números, o que
// facilita testar com Vitest (ver scoring.test.ts) e reutilizar tanto na
// aba "Resultado Final" (Pessoa 4) quanto em qualquer outro lugar que
// precise do cálculo (ex.: persistence.ts, se algum dia precisar validar
// um arquivo carregado).
// =====================================================================

/**
 * Média de um array de valores possivelmente vazios ("").
 * Ignora entradas que não são número válido. Retorna null se não houver
 * nenhum valor numérico (equivalente ao avg() do app.js original).
 */
export function avg(arr: Array<number | string>): number | null {
  const nums = arr.map((v) => parseFloat(String(v))).filter((v) => !isNaN(v));
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export interface CorrupcaoPontos {
  corruptor: number;
  compradores: Record<string, number>;
}

/**
 * Pontos fixos do mecanismo de corrupção: -1 para o corruptor a cada
 * descoberta, e -1 para o comprador que aceitou (se identificado).
 */
export function computeCorrupcaoPontos(c: Corrupcao): CorrupcaoPontos {
  let corruptor = 0;
  const compradores: Record<string, number> = {};

  if (c.primeiraDescoberta) {
    corruptor -= 1;
    if (c.primeiroComprador) {
      compradores[c.primeiroComprador] = (compradores[c.primeiroComprador] || 0) - 1;
    }
  }
  if (c.segundaDescoberta) {
    corruptor -= 1;
    if (c.segundoComprador) {
      compradores[c.segundoComprador] = (compradores[c.segundoComprador] || 0) - 1;
    }
  }
  return { corruptor, compradores };
}

export interface SabotagemPontos {
  sabotador: number;
  area: number;
  demitido: boolean;
}

/**
 * Pontos fixos do mecanismo de sabotagem. Regras (idênticas ao original):
 * - Se descoberto: sabotador perde 1 ponto.
 * - A área/time ganha 1 ponto se denunciou (não sabia/calou), ou perde 1
 *   se sabia e ficou calada.
 * - "vazar" com >=1 denúncia consecutiva, ou "atrapalhar" com >=2,
 *   resulta em demissão (o aluno vai para o time rival).
 */
export function computeSabotagemPontos(s: Sabotagem): SabotagemPontos {
  let sabotador = 0;
  let area = 0;
  let demitido = false;

  if (s.descoberto) {
    sabotador -= 1;
    area += s.areaSoubeECalou ? -1 : 1;
    if (s.tipoAcao === "vazar" && s.denunciasConsecutivas >= 1) demitido = true;
    if (s.tipoAcao === "atrapalhar" && s.denunciasConsecutivas >= 2) demitido = true;
  }
  return { sabotador, area, demitido };
}

/**
 * Nota final de uma empresa: média ponderada das médias por papel
 * (pesos configuráveis em "Configuração"), somada aos pontos fixos de
 * corrupção/sabotagem quando a empresa é a corruptora/sabotadora.
 */
export function computeEmpresaScore(data: SimulationState, empresa: string): EmpresaScore {
  const w = data.weights;

  const smAvg = avg(data.sm.filter((r) => r.empresa === empresa).map((r) => r.nota));
  const ownerAvg = avg(data.owner.filter((r) => r.empresa === empresa).map((r) => r.notaGeral));
  const poAvg = avg(data.po.filter((r) => r.empresa === empresa).map((r) => r.nota));
  const devAvg = avg(data.dev.filter((r) => r.empresa === empresa).map((r) => r.notaTime));
  const buyerAvg = avg(data.buyerProduct.filter((r) => r.empresa === empresa).map((r) => r.nota));

  const parts = [
    { key: "Scrum Master", val: smAvg, w: w.sm },
    { key: "Owner", val: ownerAvg, w: w.owner },
    { key: "Product Owner", val: poAvg, w: w.po },
    { key: "Developers", val: devAvg, w: w.dev },
    { key: "Avaliação dos Compradores", val: buyerAvg, w: w.buyer },
  ];

  let sumW = 0;
  let sumV = 0;
  parts.forEach((p) => {
    if (p.val !== null) {
      sumW += p.w;
      sumV += p.val * p.w;
    }
  });
  const base = sumW > 0 ? sumV / sumW : null;

  let ajuste = 0;
  const cPts = computeCorrupcaoPontos(data.corrupcao);
  const sPts = computeSabotagemPontos(data.sabotagem);
  if (data.corrupcao.empresaCorruptora === empresa) ajuste += cPts.corruptor;
  if (data.sabotagem.empresaSabotador === empresa) ajuste += sPts.sabotador + sPts.area;

  return { base, ajuste, final: base !== null ? base + ajuste : null, parts };
}
