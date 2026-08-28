import { useSimulationStore } from "@/store/useSimulationStore";

const WEIGHT_LABELS = {
  sm: "Scrum Master",
  owner: "Owner",
  po: "Product Owner",
  dev: "Developers",
  buyer: "Avaliação dos Compradores",
};

const WEIGHT_KEYS = Object.keys(WEIGHT_LABELS);

export function SetupTab() {
  const meta = useSimulationStore((s) => s.data.meta);
  const teamNames = useSimulationStore((s) => s.data.teamNames);
  const weights = useSimulationStore((s) => s.data.weights);
  const setMeta = useSimulationStore((s) => s.setMeta);
  const setByPath = useSimulationStore((s) => s.setByPath);
  const setWeights = useSimulationStore((s) => s.setWeights);
  const renameEmpresa = useSimulationStore((s) => s.renameEmpresa);

  const handleWeightChange = (key) => (e) => {
    setWeights({ [key]: parseFloat(e.target.value) || 0 });
  };

  return (
    <div className="panel">
      <h2>Configuração</h2>
      <div className="desc">
        Identificação da turma e nomes das empresas/times. Alterar os nomes atualiza todas as abas
        automaticamente.
      </div>

      <div className="fields-row">
        <div className="field">
          <label>Turma</label>
          <input
            type="text"
            value={meta.turma}
            onChange={(e) => setMeta({ turma: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Data</label>
          <input type="text" value={meta.data} onChange={(e) => setMeta({ data: e.target.value })} />
        </div>
      </div>

      <div className="fields-row">
        <div className="field">
          <label>Nome — Empresa A</label>
          <input
            type="text"
            id="nomeA"
            value={meta.empresaA}
            onChange={(e) => renameEmpresa("empresaA", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Time Caça — Empresa A</label>
          <input
            type="text"
            value={teamNames[meta.empresaA]?.Caça ?? ""}
            onChange={(e) => setByPath(`teamNames.${meta.empresaA}.Caça`, e.target.value)}
          />
        </div>
        <div className="field">
          <label>Time Transporte — Empresa A</label>
          <input
            type="text"
            value={teamNames[meta.empresaA]?.Transporte ?? ""}
            onChange={(e) => setByPath(`teamNames.${meta.empresaA}.Transporte`, e.target.value)}
          />
        </div>
      </div>

      <div className="fields-row">
        <div className="field">
          <label>Nome — Empresa B</label>
          <input
            type="text"
            id="nomeB"
            value={meta.empresaB}
            onChange={(e) => renameEmpresa("empresaB", e.target.value)}
          />
        </div>
        <div className="field">
          <label>Time Caça — Empresa B</label>
          <input
            type="text"
            value={teamNames[meta.empresaB]?.Caça ?? ""}
            onChange={(e) => setByPath(`teamNames.${meta.empresaB}.Caça`, e.target.value)}
          />
        </div>
        <div className="field">
          <label>Time Transporte — Empresa B</label>
          <input
            type="text"
            value={teamNames[meta.empresaB]?.Transporte ?? ""}
            onChange={(e) => setByPath(`teamNames.${meta.empresaB}.Transporte`, e.target.value)}
          />
        </div>
      </div>

      <div className="note note-dark">
        Dica: os nomes de empresa já vêm pré-preenchidos a partir das imagens que você enviou
        (Maverick Aviation e SkyForge Ind. Aeronáutica). Pode alterar se quiser.
      </div>

      <h2 style={{ marginTop: "1.6rem" }}>Pesos da Nota Final</h2>
      <div className="desc">
        Ajuste o peso de cada papel no cálculo da nota final da empresa (aba "Resultado Final").
      </div>
      <div className="weights-panel">
        {WEIGHT_KEYS.map((k) => (
          <div className="weight-field" key={k}>
            <label>{WEIGHT_LABELS[k]}</label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={weights[k]}
              onChange={handleWeightChange(k)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
