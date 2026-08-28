import { describe, expect, it } from "vitest";

import { buildInitialData } from "@/data/seed";
import {
  avg,
  computeCorrupcaoPontos,
  computeEmpresaScore,
  computeSabotagemPontos,
} from "@/lib/scoring";

describe("avg", () => {
  it("retorna null para array vazio", () => {
    expect(avg([])).toBeNull();
  });

  it("ignora valores não numéricos (ex.: '')", () => {
    expect(avg(["", 3, "", 5])).toBe(4);
  });

  it("retorna null quando não há nenhum valor numérico", () => {
    expect(avg(["", "", ""])).toBeNull();
  });

  it("calcula a média de números simples", () => {
    expect(avg([1, 2, 3, 4, 5])).toBe(3);
  });

  it("aceita strings numéricas (como vêm dos <select>)", () => {
    expect(avg(["2", "4"])).toBe(3);
  });
});

describe("computeCorrupcaoPontos", () => {
  const base = {
    empresaCorruptora: "Empresa A",
    primeiraDescoberta: false,
    primeiroComprador: "",
    segundaDescoberta: false,
    segundoComprador: "",
  };

  it("sem nenhuma descoberta, não há pontos negativos", () => {
    expect(computeCorrupcaoPontos(base)).toEqual({ corruptor: 0, compradores: {} });
  });

  it("primeira descoberta tira 1 ponto do corruptor", () => {
    const c = { ...base, primeiraDescoberta: true };
    expect(computeCorrupcaoPontos(c).corruptor).toBe(-1);
  });

  it("primeira descoberta com comprador identificado também penaliza o comprador", () => {
    const c = { ...base, primeiraDescoberta: true, primeiroComprador: "Governo" };
    const pts = computeCorrupcaoPontos(c);
    expect(pts.corruptor).toBe(-1);
    expect(pts.compradores).toEqual({ Governo: -1 });
  });

  it("duas descobertas com o mesmo comprador acumulam -2 para ele", () => {
    const c = {
      ...base,
      primeiraDescoberta: true,
      primeiroComprador: "Governo",
      segundaDescoberta: true,
      segundoComprador: "Governo",
    };
    const pts = computeCorrupcaoPontos(c);
    expect(pts.corruptor).toBe(-2);
    expect(pts.compradores).toEqual({ Governo: -2 });
  });

  it("duas descobertas com compradores diferentes penalizam cada um", () => {
    const c = {
      ...base,
      primeiraDescoberta: true,
      primeiroComprador: "Governo",
      segundaDescoberta: true,
      segundoComprador: "Setor Privado",
    };
    const pts = computeCorrupcaoPontos(c);
    expect(pts.corruptor).toBe(-2);
    expect(pts.compradores).toEqual({ Governo: -1, "Setor Privado": -1 });
  });
});

describe("computeSabotagemPontos", () => {
  const base = {
    empresaSabotador: "Empresa A",
    timeSabotador: "Caça",
    tipoAcao: "atrapalhar",
    denunciasConsecutivas: 0,
    descoberto: false,
    areaSoubeECalou: false,
  };

  it("se não foi descoberto, ninguém perde ponto e não é demitido", () => {
    expect(computeSabotagemPontos(base)).toEqual({ sabotador: 0, area: 0, demitido: false });
  });

  it("descoberto e área não sabia: sabotador -1, área +1", () => {
    const s = { ...base, descoberto: true };
    expect(computeSabotagemPontos(s)).toEqual({ sabotador: -1, area: 1, demitido: false });
  });

  it("descoberto e área sabia e calou: sabotador -1, área -1", () => {
    const s = { ...base, descoberto: true, areaSoubeECalou: true };
    expect(computeSabotagemPontos(s)).toEqual({ sabotador: -1, area: -1, demitido: false });
  });

  it("'vazar' com 1 denúncia consecutiva já resulta em demissão", () => {
    const s = { ...base, tipoAcao: "vazar", descoberto: true, denunciasConsecutivas: 1 };
    expect(computeSabotagemPontos(s).demitido).toBe(true);
  });

  it("'atrapalhar' com 1 denúncia consecutiva NÃO demite ainda", () => {
    const s = { ...base, tipoAcao: "atrapalhar", descoberto: true, denunciasConsecutivas: 1 };
    expect(computeSabotagemPontos(s).demitido).toBe(false);
  });

  it("'atrapalhar' com 2 denúncias consecutivas resulta em demissão", () => {
    const s = { ...base, tipoAcao: "atrapalhar", descoberto: true, denunciasConsecutivas: 2 };
    expect(computeSabotagemPontos(s).demitido).toBe(true);
  });
});

describe("computeEmpresaScore", () => {
  it("com todos os dados em branco, base e final são null e ajuste é 0", () => {
    const data = buildInitialData("Empresa A", "Empresa B");
    const score = computeEmpresaScore(data, "Empresa A");
    expect(score.base).toBeNull();
    expect(score.final).toBeNull();
    expect(score.ajuste).toBe(0);
    expect(score.parts).toHaveLength(5);
  });

  it("calcula a média ponderada apenas com os papéis que têm nota lançada", () => {
    const data = buildInitialData("Empresa A", "Empresa B");
    data.sm[0].empresa = "Empresa A";
    data.sm[0].nota = 4;
    data.owner[0].empresa = "Empresa A";
    data.owner[0].notaGeral = 2;

    const score = computeEmpresaScore(data, "Empresa A");
    expect(score.base).toBe(3);
    expect(score.ajuste).toBe(0);
    expect(score.final).toBe(3);
  });

  it("soma o ajuste de corrupção quando a empresa é a corruptora", () => {
    const data = buildInitialData("Empresa A", "Empresa B");
    data.sm[0].empresa = "Empresa A";
    data.sm[0].nota = 5;
    data.corrupcao.empresaCorruptora = "Empresa A";
    data.corrupcao.primeiraDescoberta = true;

    const score = computeEmpresaScore(data, "Empresa A");
    expect(score.base).toBe(5);
    expect(score.ajuste).toBe(-1);
    expect(score.final).toBe(4);
  });

  it("soma sabotador + área quando a empresa é a sabotadora", () => {
    const data = buildInitialData("Empresa A", "Empresa B");
    data.sm[0].empresa = "Empresa A";
    data.sm[0].nota = 3;
    data.sabotagem.empresaSabotador = "Empresa A";
    data.sabotagem.descoberto = true;
    data.sabotagem.areaSoubeECalou = true;

    const score = computeEmpresaScore(data, "Empresa A");
    expect(score.base).toBe(3);
    expect(score.ajuste).toBe(-2);
    expect(score.final).toBe(1);
  });

  it("não aplica ajuste de corrupção/sabotagem a uma empresa que não é a envolvida", () => {
    const data = buildInitialData("Empresa A", "Empresa B");
    data.sm[1].empresa = "Empresa B";
    data.sm[1].nota = 4;
    data.corrupcao.empresaCorruptora = "Empresa A";
    data.corrupcao.primeiraDescoberta = true;
    data.sabotagem.empresaSabotador = "Empresa A";
    data.sabotagem.descoberto = true;

    const score = computeEmpresaScore(data, "Empresa B");
    expect(score.base).toBe(4);
    expect(score.ajuste).toBe(0);
    expect(score.final).toBe(4);
  });
});
