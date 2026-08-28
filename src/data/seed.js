import { BUYERS, SPRINTS, TIMES } from "@/data/constants";

// =====================================================================
// SEED — lista de alunos e fábrica do estado inicial.
// Portado 1:1 do js/app.js original (SEED_NAMES + buildInitialData).
// =====================================================================

export const SEED_NAMES = [
  "ALAN FERREIRA DE OLIVEIRA",
  "ANDRÉ LUIZ VICENZI RIGO",
  "ARTHUR HENRIQUE LORENZETT",
  "BRUNO DE DAVID REIS",
  "CARLOS EDUARDO ALMEIDA DA CONCEICAO",
  "CARLOS JHONATAS DE SOUZA AMORIM",
  "CAUAN BRUNO ALTHAUS RIFFEL",
  "FILIPE GABRIEL HOLLMANN",
  "FILIPE JOSÉ DA COSTA NUNES",
  "GABRIEL CRISTIAN VIVIAN SOMARIVA",
  "GABRIEL DE CARVALHO BARRETO",
  "GIOVANI RICARDO POTT",
  "GUSTAVO SCHWITZKI PERETTI",
  "ISAEL SOARES DOS SANTOS",
  "JADSON BUTZK",
  "JÉSSICA FERNANDA RUBAS",
  "JOÃO VITOR RAIMUNDI",
  "KAUAN LUCAS TOLDO",
  "LEONARDO SCHIMIDT LOPES",
  "LORENZO PIVA MAY",
  "MARIA EDUARDA EMELAU JOBIM",
  "MATTEO DALLA COSTA THOMÉ",
  "NATAN ELIAS PATZLAFF",
  "NICOLAS LISBOA FIGUEIREDO MULLER",
  "NICOLE BONASSI BET",
  "RAFAEL WILLIAM HAUPT FLORES",
  "SAMIRA GREGORIO VIEIRA",
  "VICENTE DAGOSTIN PILONETTO",
  "VINICIUS TEBALDI BORSATTI",
  "WILLIAM KUNZLER",
  "YASMIN MARIA ZERBIELLI",
];

/**
 * Monta o estado inicial completo da simulação a partir do nome das duas
 * empresas. Usada tanto no bootstrap do store quanto em "Limpar tudo"
 * (resetAll, ligado pela Pessoa 4 na aba Corrupção & Sabotagem / TopBar).
 */
export function buildInitialData(empresaA, empresaB) {
  const empresas = [empresaA, empresaB];

  const sm = [];
  const owner = [];
  SPRINTS.forEach((sp) =>
    empresas.forEach((emp) => {
      sm.push({ sprint: sp, empresa: emp, conduziu: "", removeu: "", ajudou: "", nota: "", obs: "" });
      owner.push({ sprint: sp, empresa: emp, comunicacao: "", negociacao: "", alinhamento: "", notaGeral: "", obs: "" });
    })
  );

  const po = [];
  const dev = [];
  SPRINTS.forEach((sp) =>
    empresas.forEach((emp) =>
      TIMES.forEach((t) => {
        po.push({ sprint: sp, empresa: emp, time: t, requisitos: "", testes: "", reuniao: "", nota: "", obs: "" });
        dev.push({ sprint: sp, empresa: emp, time: t, qualidade: "", processo: "", colaboracao: "", notaTime: "", destaque: "" });
      })
    )
  );

  const buyerProf = [];
  SPRINTS.forEach((sp) =>
    BUYERS.forEach((b) => {
      buyerProf.push({ sprint: sp, comprador: b, checklist: "", decisoes: "", feedback: "", nota: "", obs: "" });
    })
  );

  const buyerProduct = [];
  SPRINTS.forEach((sp) => {
    empresas.forEach((emp) => {
      buyerProduct.push({ sprint: sp, comprador: "Governo", empresa: emp, produto: "Caça", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
      buyerProduct.push({ sprint: sp, comprador: "Governo", empresa: emp, produto: "Transporte", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
      buyerProduct.push({ sprint: sp, comprador: "Militar", empresa: emp, produto: "Caça", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
      buyerProduct.push({ sprint: sp, comprador: "Setor Privado", empresa: emp, produto: "Transporte", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
    });
  });

  const corrupcao = {
    empresaCorruptora: empresaA,
    primeiraDescoberta: false,
    primeiroComprador: "",
    segundaDescoberta: false,
    segundoComprador: "",
  };

  const sabotagem = {
    empresaSabotador: empresaA,
    timeSabotador: "Caça",
    tipoAcao: "atrapalhar",
    denunciasConsecutivas: 0,
    descoberto: false,
    areaSoubeECalou: false,
  };

  const weights = { sm: 1, owner: 1, po: 1, dev: 2, buyer: 2 };

  const teamNames = {
    [empresaA]: { Caça: "Esquadrão Falcon", Transporte: "Falcon Carggo" },
    [empresaB]: { Caça: "SkyForge Combat", Transporte: "SkyForge Transport" },
  };

  const alunos = SEED_NAMES.map((nome, i) => ({
    id: i + 1,
    nome,
    empresa: "",
    time: "",
    papel: "",
  }));

  return {
    meta: { turma: "", data: "", empresaA, empresaB, fontScale: 16 },
    sm,
    owner,
    po,
    dev,
    buyerProf,
    buyerProduct,
    corrupcao,
    sabotagem,
    weights,
    teamNames,
    alunos,
  };
}

export const EMPRESA_A_PADRAO = "Maverick Aviation";
export const EMPRESA_B_PADRAO = "SkyForge Ind. Aeronáutica";
