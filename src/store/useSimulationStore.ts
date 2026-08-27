import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { buildInitialData, EMPRESA_A_PADRAO, EMPRESA_B_PADRAO } from "@/data/seed";
import type { Meta, SimulationState, TabKey, Weights } from "@/types";

// =====================================================================
// STORE GLOBAL DA SIMULAÇÃO
//
// Base + setters genéricos (Pessoa 1). Cada pessoa deve acrescentar aqui
// os setters específicos da sua aba, seguindo o mesmo padrão dos
// existentes (mutação direta do draft via immer):
//
//   - Pessoa 2: setores de setup/alunos, integração com persistence.ts
//     (usar `replaceState` para repor o STATE inteiro ao carregar um
//     .json ou ao importar alunos do Excel).
//   - Pessoa 3: setSmField, setOwnerField, setPoField, setDevField.
//   - Pessoa 4: setBuyerProfField, setBuyerProductField, setCorrupcaoField,
//     setSabotagemField, e resetAll() (+ a confirmação fica na camada de
//     UI, ex.: window.confirm antes de chamar resetAll()).
//
// Até que os setters específicos existam, `setByPath` (equivalente ao
// setByPath do app.js original) pode ser usado como ponte genérica.
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
    })),
    {
      name: "painel-scrum-storage",
      partialize: (state) => ({ data: state.data, tab: state.tab, fileName: state.fileName }),
    }
  )
);
