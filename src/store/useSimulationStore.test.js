import { describe, expect, it, beforeEach } from "vitest";

import { useSimulationStore, FILE_NAME_PADRAO } from "@/store/useSimulationStore";
import { buildInitialData, EMPRESA_A_PADRAO, EMPRESA_B_PADRAO } from "@/data/seed";

beforeEach(() => {
  useSimulationStore.setState({
    data: buildInitialData(EMPRESA_A_PADRAO, EMPRESA_B_PADRAO),
    tab: "setup",
    fileName: FILE_NAME_PADRAO,
  });
});

describe("setSmField", () => {
  it("atualiza um campo de uma linha específica sem afetar as demais", () => {
    useSimulationStore.getState().setSmField(0, "nota", 4);
    const { sm } = useSimulationStore.getState().data;
    expect(sm[0].nota).toBe(4);
    expect(sm[1].nota).toBe("");
  });

  it("atualiza campos Sim/Não e observação", () => {
    const { setSmField } = useSimulationStore.getState();
    setSmField(1, "conduziu", "S");
    setSmField(1, "obs", "Bom facilitador");
    const row = useSimulationStore.getState().data.sm[1];
    expect(row.conduziu).toBe("S");
    expect(row.obs).toBe("Bom facilitador");
  });
});

describe("setOwnerField", () => {
  it("atualiza um campo de uma linha específica", () => {
    useSimulationStore.getState().setOwnerField(2, "notaGeral", 5);
    const { owner } = useSimulationStore.getState().data;
    expect(owner[2].notaGeral).toBe(5);
  });
});

describe("setPoField", () => {
  it("atualiza um campo de uma linha específica", () => {
    useSimulationStore.getState().setPoField(0, "requisitos", "N");
    const { po } = useSimulationStore.getState().data;
    expect(po[0].requisitos).toBe("N");
  });
});

describe("setDevField", () => {
  it("atualiza a coluna de destaque individual (texto livre)", () => {
    useSimulationStore.getState().setDevField(3, "destaque", "Fulano se destacou");
    const { dev } = useSimulationStore.getState().data;
    expect(dev[3].destaque).toBe("Fulano se destacou");
  });

  it("não afeta outras linhas do mesmo array", () => {
    const before = useSimulationStore.getState().data.dev.map((r) => ({ ...r }));
    useSimulationStore.getState().setDevField(0, "qualidade", 3);
    const after = useSimulationStore.getState().data.dev;
    for (let i = 1; i < after.length; i++) {
      expect(after[i]).toEqual(before[i]);
    }
  });
});
