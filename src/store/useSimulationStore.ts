import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { buildInitialData, EMPRESA_A_PADRAO, EMPRESA_B_PADRAO } from "@/data/seed";
import type {
  Aluno,
  BuyerProductRow,
  BuyerProfRow,
  Corrupcao,
  DevRow,
  Meta,
  OwnerRow,
  PoRow,
  Sabotagem,
  SimulationState,
  SmRow,
  TabKey,
  Weights,
} from "@/types";

// =====================================================================
// STORE GLOBAL DA SIMULAÇÃO
//
// MERGE: este arquivo consolida os setters genéricos (Pessoa 1) com os
// específicos entregues por:
//   - Pessoa 2: setAlunoField / setAlunos (setup/alunos/escalação).
//   - Pessoa 3: setSmField, setOwnerField, setPoField, setDevField
//     (papéis internos — sm/owner/po/dev).
//   - Pessoa 4: setBuyerProfField, setBuyerProductField,
//     setCorrupcaoField, setSabotagemField, resetAll().
//
// `setByPath` (equivalente ao setByPath do app.js original) continua
// disponível como ponte genérica para o que ainda não tiver setter
// dedicado.
// =====================================================================

export const FILE_NAME_PADRAO = "(nenhum arquivo carregado)";

export interface SimulationStore {
  /** Todo o estado "de domínio" da simulação (o que vai para o .json salvo/carregado). */
  data: SimulationState;
  /** Aba atualmente selecionada. */
  tab: TabKey;
  /** Nome do último arquivo .json carregado (exibido na TopBar). */
  fileName: string;

  // ---- navegação -----------------------------------------------------
  setTab: (tab: TabKey) => void;

  // ---- setters genéricos (base) --------------------------------------
  /**
   * Equivalente ao setByPath(path, value) do app.js original: percorre
   * `data` por um caminho tipo "sm.3.nota" e atribui o valor. Serve como
   * ponte enquanto uma aba ainda não tem um setter dedicado e tipado.
   */
  setByPath: (path: string, value: unknown) => void;
  setMeta: (partial: Partial<Meta>) => void;
  setWeights: (partial: Partial<Weights>) => void;
  setFontScale: (value: number) => void;
  changeFontScale: (delta: number) => void;
  /** Renomeia a Empresa A/B propagando o novo nome para todas as linhas que referenciam a empresa. */
  renameEmpresa: (which: "empresaA" | "empresaB", novoNome: string) => void;
  setFileName: (name: string) => void;

  /**
   * Substitui `data` inteiro (e opcionalmente o fileName). Ponto de
   * integração para a Pessoa 2 usar ao carregar um .json (persistence.ts)
   * ou ao reimportar a lista de alunos via Excel.
   */
  replaceState: (newState: SimulationState, fileName?: string) => void;

  // ---- setters da aba Alunos (Pessoa 2) -------------------------------
  /** Atualiza um campo de um aluno específico (papel, empresa ou time). */
  setAlunoField: (index: number, field: keyof Aluno, value: Aluno[keyof Aluno]) => void;
  /** Substitui a lista inteira de alunos (usado pela importação via Excel). */
  setAlunos: (alunos: Aluno[]) => void;

  // ---- setters das abas de papéis internos (Pessoa 3) -----------------
  /** Atualiza um campo de uma linha da aba "Scrum Master". */
  setSmField: <K extends keyof SmRow>(index: number, field: K, value: SmRow[K]) => void;
  /** Atualiza um campo de uma linha da aba "Owner". */
  setOwnerField: <K extends keyof OwnerRow>(index: number, field: K, value: OwnerRow[K]) => void;
  /** Atualiza um campo de uma linha da aba "Product Owner". */
  setPoField: <K extends keyof PoRow>(index: number, field: K, value: PoRow[K]) => void;
  /** Atualiza um campo de uma linha da aba "Developers". */
  setDevField: <K extends keyof DevRow>(index: number, field: K, value: DevRow[K]) => void;

  // ---- setters da Pessoa 4 (compradores, corrupção/sabotagem) --------
  /** Atualiza um campo de uma linha da aba "Compradores (Papel)". */
  setBuyerProfField: <K extends keyof BuyerProfRow>(index: number, field: K, value: BuyerProfRow[K]) => void;
  /** Atualiza um campo de uma linha da aba "Compradores (Produto)". */
  setBuyerProductField: <K extends keyof BuyerProductRow>(
    index: number,
    field: K,
    value: BuyerProductRow[K]
  ) => void;
  /** Atualiza um campo do bloco de corrupção (aba "Corrupção & Sabotagem"). */
  setCorrupcaoField: <K extends keyof Corrupcao>(field: K, value: Corrupcao[K]) => void;
  /** Atualiza um campo do bloco de sabotagem (aba "Corrupção & Sabotagem"). */
  setSabotagemField: <K extends keyof Sabotagem>(field: K, value: Sabotagem[K]) => void;

  /**
   * Equivalente ao handleReset() do app.js original: repõe todo o
   * `data` para o estado inicial (empresas padrão) e limpa a aba/arquivo
   * atuais. A confirmação (window.confirm) fica a cargo de quem chama
   * — ver TopBar/App.tsx.
   */
  resetAll: () => void;
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    immer((set) => ({
      data: buildInitialData(EMPRESA_A_PADRAO, EMPRESA_B_PADRAO),
      tab: "setup",
      fileName: FILE_NAME_PADRAO,

      setTab: (tab) =>
        set((state) => {
          state.tab = tab;
        }),

      setByPath: (path, value) =>
        set((state) => {
          const parts = path.split(".");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let obj: any = state.data;
          for (let i = 0; i < parts.length - 1; i++) {
            obj = obj[parts[i]];
          }
          obj[parts[parts.length - 1]] = value;
        }),

      setMeta: (partial) =>
        set((state) => {
          Object.assign(state.data.meta, partial);
        }),

      setWeights: (partial) =>
        set((state) => {
          Object.assign(state.data.weights, partial);
        }),

      setFontScale: (value) =>
        set((state) => {
          state.data.meta.fontScale = value;
        }),

      changeFontScale: (delta) =>
        set((state) => {
          state.data.meta.fontScale = Math.max(12, Math.min(24, state.data.meta.fontScale + delta));
        }),

      renameEmpresa: (which, novoNome) =>
        set((state) => {
          const m = state.data.meta;
          const oldA = m.empresaA;
          const oldB = m.empresaB;
          const oldVal = which === "empresaA" ? oldA : oldB;
          if (!novoNome || novoNome === oldVal) return;

          const rename = (v: string) => (v === oldVal ? novoNome : v);
          state.data.sm.forEach((r) => (r.empresa = rename(r.empresa)));
          state.data.owner.forEach((r) => (r.empresa = rename(r.empresa)));
          state.data.po.forEach((r) => (r.empresa = rename(r.empresa)));
          state.data.dev.forEach((r) => (r.empresa = rename(r.empresa)));
          state.data.buyerProduct.forEach((r) => (r.empresa = rename(r.empresa)));
          state.data.alunos.forEach((a) => (a.empresa = rename(a.empresa)));
          state.data.corrupcao.empresaCorruptora = rename(state.data.corrupcao.empresaCorruptora);
          state.data.sabotagem.empresaSabotador = rename(state.data.sabotagem.empresaSabotador);

          if (state.data.teamNames[oldVal]) {
            state.data.teamNames[novoNome] = state.data.teamNames[oldVal];
            delete state.data.teamNames[oldVal];
          }
          if (which === "empresaA") state.data.meta.empresaA = novoNome;
          else state.data.meta.empresaB = novoNome;
        }),

      setFileName: (name) =>
        set((state) => {
          state.fileName = name;
        }),

      replaceState: (newState, fileName) =>
        set((state) => {
          state.data = newState;
          if (!state.data.meta.fontScale) state.data.meta.fontScale = 16;
          if (fileName) state.fileName = fileName;
        }),

      setAlunoField: (index, field, value) =>
        set((state) => {
          const aluno = state.data.alunos[index];
          if (!aluno) return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (aluno as any)[field] = value;
        }),

      setAlunos: (alunos) =>
        set((state) => {
          state.data.alunos = alunos;
        }),

      setSmField: (index, field, value) =>
        set((state) => {
          const row = state.data.sm[index];
          if (!row) return;
          row[field] = value;
        }),

      setOwnerField: (index, field, value) =>
        set((state) => {
          const row = state.data.owner[index];
          if (!row) return;
          row[field] = value;
        }),

      setPoField: (index, field, value) =>
        set((state) => {
          const row = state.data.po[index];
          if (!row) return;
          row[field] = value;
        }),

      setDevField: (index, field, value) =>
        set((state) => {
          const row = state.data.dev[index];
          if (!row) return;
          row[field] = value;
        }),

      setBuyerProfField: (index, field, value) =>
        set((state) => {
          state.data.buyerProf[index][field] = value;
        }),

      setBuyerProductField: (index, field, value) =>
        set((state) => {
          state.data.buyerProduct[index][field] = value;
        }),

      setCorrupcaoField: (field, value) =>
        set((state) => {
          state.data.corrupcao[field] = value;
        }),

      setSabotagemField: (field, value) =>
        set((state) => {
          state.data.sabotagem[field] = value;
        }),

      resetAll: () =>
        set((state) => {
          state.data = buildInitialData(EMPRESA_A_PADRAO, EMPRESA_B_PADRAO);
          state.tab = "setup";
          state.fileName = FILE_NAME_PADRAO;
        }),
    })),
    {
      name: "painel-scrum-storage",
      partialize: (state) => ({ data: state.data, tab: state.tab, fileName: state.fileName }),
    }
  )
);
