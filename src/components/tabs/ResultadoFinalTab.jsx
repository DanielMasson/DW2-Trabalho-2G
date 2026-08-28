import { computeEmpresaScore } from "@/lib/scoring";
import { useSimulationStore } from "@/store/useSimulationStore";

const CORES = ["linear-gradient(135deg, #455F51, #324339)", "linear-gradient(135deg, #0989B1, #065E77)"];

export function ResultadoFinalTab() {
  const data = useSimulationStore((s) => s.data);
  const empresas = [data.meta.empresaA, data.meta.empresaB];
  const scores = empresas.map((e) => ({ empresa: e, ...computeEmpresaScore(data, e) }));

  return (
    <div className="panel">
      <h2>Resultado Final</h2>
      <div className="desc">
        Cálculo automático a partir das médias lançadas em cada aba, ajustado pelos pontos de corrupção/sabotagem.
        Use como referência — a decisão final da nota é sempre sua.
      </div>
      <div className="grid2">
        {scores.map((s, i) => (
          <div className="dash-card" style={{ background: CORES[i] }} key={s.empresa}>
            <h3>{s.empresa}</h3>
            <div className="big">{s.final !== null ? s.final.toFixed(2) : "—"}</div>
            <div className="breakdown">
              {s.parts.map((p) => (
                <div key={p.key}>
                  <span>{p.key}</span>
                  <span>{p.val !== null ? p.val.toFixed(2) : "—"}</span>
                </div>
              ))}
              <div style={{ marginTop: "0.4rem", borderTop: "1px solid rgba(255,255,255,.3)", paddingTop: "0.4rem" }}>
                <span>Ajuste (corrupção/sabotagem)</span>
                <span>
                  {s.ajuste >= 0 ? "+" : ""}
                  {s.ajuste.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="note note-orange" style={{ marginTop: "1.1rem" }}>
        A nota final é uma média ponderada das notas médias por papel (pesos configuráveis em "Configuração"),
        somada aos pontos fixos de corrupção/sabotagem. Ela não substitui seu julgamento.
      </div>
    </div>
  );
}
