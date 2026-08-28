import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { buildInitialData, EMPRESA_A_PADRAO, EMPRESA_B_PADRAO } from "@/data/seed";

export const FILE_NAME_PADRAO = "(nenhum arquivo carregado)";

export const useSimulationStore = create()(
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
          let obj = state.data;
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

          const rename = (v) => (v === oldVal ? novoNome : v);
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
          aluno[field] = value;
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
