import { SEED_NAMES } from "@/data/seed";
import type { SimulationState } from "@/types";

// =====================================================================
// PERSISTENCE — salvar/carregar o STATE como arquivo .json.
//
// Portado 1:1 do handleSave/handleLoadFile do js/app.js original, só que
// aqui sem tocar em DOM: quem dispara o download/leitura de arquivo é a
// camada de UI (App.tsx), que chama estas funções e depois usa
// `replaceState`/`setFileName` do store com o resultado.
//
// O middleware `persist` do Zustand (configurado por Pessoa 1 em
// useSimulationStore.ts) já cuida do autosave no localStorage a cada
// mudança — este arquivo cuida apenas do export/import manual pedido
// pelos botões "Salvar" / "Carregar" da TopBar.
// =====================================================================

/**
 * Gera o nome de arquivo sugerido para o download, a partir do nome da
 * turma (equivalente ao `safeTurma` do app.js original).
 */
export function buildSaveFileName(turma: string): string {
  const safeTurma = (turma || "simulacao").replace(/[^a-z0-9A-Z_-]+/g, "_");
  return `scrum_simulacao_${safeTurma}.json`;
}

/**
 * Dispara o download do STATE atual como arquivo .json.
 * Equivalente ao handleSave() do app.js original.
 */
export function saveStateToFile(data: SimulationState): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = buildSaveFileName(data.meta.turma);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Aplica correções de compatibilidade em um estado recém-carregado, para
 * arquivos .json salvos por versões anteriores do painel que não tinham
 * ainda algum campo (fontScale, alunos, teamNames). Equivalente aos
 * ajustes feitos dentro do handleLoadFile() original.
 */
export function normalizeLoadedState(parsed: SimulationState): SimulationState {
  const state: SimulationState = { ...parsed };

  if (!state.meta.fontScale) {
    state.meta = { ...state.meta, fontScale: 16 };
  }
  if (!state.alunos) {
    state.alunos = SEED_NAMES.map((nome, i) => ({ id: i + 1, nome, empresa: "", time: "", papel: "" }));
  }
  if (!state.teamNames) {
    state.teamNames = {
      [state.meta.empresaA]: { Caça: "Esquadrão Falcon", Transporte: "Falcon Carggo" },
      [state.meta.empresaB]: { Caça: "SkyForge Combat", Transporte: "SkyForge Transport" },
    };
  }
  return state;
}

export interface LoadFileResult {
  data: SimulationState;
  fileName: string;
}

/**
 * Lê um arquivo .json escolhido pelo usuário (via <input type="file">) e
 * devolve o SimulationState já normalizado, pronto para ser passado a
 * `replaceState` no store. Rejeita a Promise se o arquivo não for um
 * JSON válido — quem chama decide como avisar o usuário (ex.: alert()).
 */
export function loadStateFromFile(file: File): Promise<LoadFileResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target?.result)) as SimulationState;
        resolve({ data: normalizeLoadedState(parsed), fileName: file.name });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
