// =====================================================================
// TIPOS DE DOMÍNIO — Painel de Avaliação (Simulação Scrum Competitiva)
//
// Portados 1:1 do modelo de dados original (js/app.js -> buildInitialData
// e funções de scoring). Qualquer pessoa que adicionar uma aba nova deve
// declarar aqui o tipo da respectiva linha/objeto de estado.
// =====================================================================

/** Nota de 1 a 5 usada nos <select> de avaliação. "" = ainda não respondido. */
export type ScoreValue = 1 | 2 | 3 | 4 | 5;
export type Score = ScoreValue | "";

/** Resposta Sim/Não usada nos checklists. */
export type SimNao = "" | "S" | "N";

/** Decisão do comprador na ficha de avaliação do produto. */
export type Decisao = "" | "A" | "I" | "D";

export type TimeNome = "Caça" | "Transporte";

export type Buyer = "Governo" | "Militar" | "Setor Privado";

export type TipoAcaoSabotagem = "vazar" | "atrapalhar";

export type Papel =
  | ""
  | "Scrum Master"
  | "Product Owner"
  | "Owner/Stakeholder"
  | "Developer"
  | "Comprador - Governo"
  | "Comprador - Militar"
  | "Comprador - Setor Privado";

/** Chaves das abas do painel, na ordem em que aparecem na TabsBar. */
export type TabKey =
  | "setup"
  | "alunos"
  | "escalacao"
  | "sm"
  | "owner"
  | "po"
  | "dev"
  | "buyerProf"
  | "buyerProduct"
  | "corrupsab"
  | "result";

// ---------------------------------------------------------------------
// Meta / configuração geral
// ---------------------------------------------------------------------
export interface Meta {
  turma: string;
  data: string;
  empresaA: string;
  empresaB: string;
  fontScale: number;
}

export interface Weights {
  sm: number;
  owner: number;
  po: number;
  dev: number;
  buyer: number;
}

/** Nomes dos times (Caça/Transporte) por empresa. A chave é o nome da empresa. */
export type TeamNames = Record<string, { Caça: string; Transporte: string }>;

// ---------------------------------------------------------------------
// Linhas das abas de avaliação (uma linha por Sprint × Empresa [× Time]).
// Consumidas/gerenciadas pela Pessoa 3 (papéis internos) e Pessoa 4
// (compradores e mecânicas especiais).
// ---------------------------------------------------------------------
export interface SmRow {
  sprint: number;
  empresa: string;
  conduziu: SimNao;
  removeu: SimNao;
  ajudou: SimNao;
  nota: Score;
  obs: string;
}

export interface OwnerRow {
  sprint: number;
  empresa: string;
  comunicacao: Score;
  negociacao: Score;
  alinhamento: Score;
  notaGeral: Score;
  obs: string;
}

export interface PoRow {
  sprint: number;
  empresa: string;
  time: TimeNome;
  requisitos: SimNao;
  testes: SimNao;
  reuniao: SimNao;
  nota: Score;
  obs: string;
}

export interface DevRow {
  sprint: number;
  empresa: string;
  time: TimeNome;
  qualidade: Score;
  processo: SimNao;
  colaboracao: Score;
  notaTime: Score;
  destaque: string;
}

export interface BuyerProfRow {
  sprint: number;
  comprador: Buyer;
  checklist: SimNao;
  decisoes: SimNao;
  feedback: SimNao;
  nota: Score;
  obs: string;
}

export interface BuyerProductRow {
  sprint: number;
  comprador: Buyer;
  empresa: string;
  produto: TimeNome;
  pt: SimNao;
  pv: SimNao;
  prazo: SimNao;
  comOwner: Score;
  sinal: SimNao;
  decisao: Decisao;
  nota: Score;
}

// ---------------------------------------------------------------------
// Mecânicas especiais (aba Corrupção & Sabotagem) — Pessoa 4
// ---------------------------------------------------------------------
export interface Corrupcao {
  empresaCorruptora: string;
  primeiraDescoberta: boolean;
  primeiroComprador: string;
  segundaDescoberta: boolean;
  segundoComprador: string;
}

export interface Sabotagem {
  empresaSabotador: string;
  timeSabotador: TimeNome;
  tipoAcao: TipoAcaoSabotagem;
  denunciasConsecutivas: 0 | 1 | 2;
  descoberto: boolean;
  areaSoubeECalou: boolean;
}

// ---------------------------------------------------------------------
// Alunos (aba Alunos / Escalação) — Pessoa 2
// ---------------------------------------------------------------------
export interface Aluno {
  id: number;
  nome: string;
  empresa: string;
  time: TimeNome | "";
  papel: Papel;
}

// ---------------------------------------------------------------------
// Estado global da simulação — é isto que fica dentro do Zustand store
// e é o que é exportado/importado em persistence.ts (Pessoa 2).
// ---------------------------------------------------------------------
export interface SimulationState {
  meta: Meta;
  sm: SmRow[];
  owner: OwnerRow[];
  po: PoRow[];
  dev: DevRow[];
  buyerProf: BuyerProfRow[];
  buyerProduct: BuyerProductRow[];
  corrupcao: Corrupcao;
  sabotagem: Sabotagem;
  weights: Weights;
  teamNames: TeamNames;
  alunos: Aluno[];
}

// ---------------------------------------------------------------------
// Resultado do cálculo de nota final (lib/scoring.ts — Pessoa 2)
// ---------------------------------------------------------------------
export interface EmpresaScorePart {
  key: string;
  val: number | null;
  w: number;
}

export interface EmpresaScore {
  base: number | null;
  ajuste: number;
  final: number | null;
  parts: EmpresaScorePart[];
}
