import { SEED_NAMES } from "@/data/seed";

// =====================================================================
// PERSISTENCE — salvar/carregar o STATE como arquivo .json.
// =====================================================================

/**
 * Gera o nome de arquivo sugerido para o download.
 */
export function buildSaveFileName(turma) {
  const safeTurma = (turma || "simulacao").replace(/[^a-z0-9A-Z_-]+/g, "_");
  return `scrum_simulacao_${safeTurma}.json`;
}

/**
 * Dispara o download do STATE atual como arquivo .json.
 */
export function saveStateToFile(data) {
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
 * Aplica correções de compatibilidade em um estado recém-carregado.
 */
export function normalizeLoadedState(parsed) {
  const state = { ...parsed };

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

/**
 * Lê um arquivo .json escolhido pelo usuário e devolve o SimulationState normalizado.
 */
export function loadStateFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target?.result));
        resolve({ data: normalizeLoadedState(parsed), fileName: file.name });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
