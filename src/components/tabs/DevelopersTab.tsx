import { ObsInput, ScoreSelect, SimNaoSelect } from "@/components/ui";
import { sprintCellLabel } from "@/lib/sprintLabel";
import { useSimulationStore } from "@/store/useSimulationStore";

/**
 * Aba "Developers" — avaliação por time. Com muitos alunos em produção,
 * a qualidade do produto é o principal indicador de entendimento do
 * processo pelo grupo. Equivalente ao renderDev() do app.js original
 * (Pessoa 3).
 */
export function DevelopersTab() {
  const rows = useSimulationStore((s) => s.data.dev);
  const setDevField = useSimulationStore((s) => s.setDevField);

  return (
    <div className="panel">
      <h2>Developers</h2>
      <div className="desc">
        Avaliação por time — com muitos alunos em produção, a qualidade do produto é o principal indicador de
        entendimento do processo pelo grupo.
      </div>
      <table>
        <thead>
          <tr>
            <th>Sprint</th>
            <th>Empresa</th>
            <th>Time</th>
            <th>
              Qualidade do
              <br />
              produto (1-5)
            </th>
            <th>
              Seguiu o
              <br />
              processo?
            </th>
            <th>
              Colaboração
              <br />
              do time (1-5)
            </th>
            <th>Nota Time (1-5)</th>
            <th>Destaque individual (opcional)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="sprint-label">{sprintCellLabel(rows, i)}</td>
              <td>{r.empresa}</td>
              <td>{r.time}</td>
              <td>
                <ScoreSelect value={r.qualidade} onChange={(v) => setDevField(i, "qualidade", v)} />
              </td>
              <td>
                <SimNaoSelect value={r.processo} onChange={(v) => setDevField(i, "processo", v)} />
              </td>
              <td>
                <ScoreSelect value={r.colaboracao} onChange={(v) => setDevField(i, "colaboracao", v)} />
              </td>
              <td>
                <ScoreSelect value={r.notaTime} onChange={(v) => setDevField(i, "notaTime", v)} />
              </td>
              <td>
                <ObsInput
                  value={r.destaque}
                  onChange={(v) => setDevField(i, "destaque", v)}
                  placeholder="nome (se houver)"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note note-green">
        Reserve a coluna de destaque individual apenas para casos que realmente chamem atenção, positiva ou
        negativamente.
      </div>
    </div>
  );
}
