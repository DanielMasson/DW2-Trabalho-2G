import { ObsInput, ScoreSelect, SimNaoSelect } from "@/components/ui";
import { sprintCellLabel } from "@/lib/sprintLabel";
import { useSimulationStore } from "@/store/useSimulationStore";

export function ScrumMasterTab() {
  const rows = useSimulationStore((s) => s.data.sm);
  const setSmField = useSimulationStore((s) => s.setSmField);

  return (
    <div className="panel">
      <h2>Scrum Master</h2>
      <div className="desc">Avaliação de processo — um Scrum Master por empresa, atendendo os dois times.</div>
      <table>
        <thead>
          <tr>
            <th>Sprint</th>
            <th>Empresa</th>
            <th>
              Conduziu os eventos
              <br />
              corretamente?
            </th>
            <th>
              Removeu
              <br />
              impedimentos?
            </th>
            <th>
              Ajudou o time a
              <br />
              melhorar entre Sprints?
            </th>
            <th>Nota (1-5)</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="sprint-label">{sprintCellLabel(rows, i)}</td>
              <td>{r.empresa}</td>
              <td>
                <SimNaoSelect value={r.conduziu} onChange={(v) => setSmField(i, "conduziu", v)} />
              </td>
              <td>
                <SimNaoSelect value={r.removeu} onChange={(v) => setSmField(i, "removeu", v)} />
              </td>
              <td>
                <SimNaoSelect value={r.ajudou} onChange={(v) => setSmField(i, "ajudou", v)} />
              </td>
              <td>
                <ScoreSelect value={r.nota} onChange={(v) => setSmField(i, "nota", v)} />
              </td>
              <td>
                <ObsInput value={r.obs} onChange={(v) => setSmField(i, "obs", v)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note note-dark">
        Critério-guia: o SM não é avaliado por produzir, mas por garantir que o Scrum aconteça de verdade e por
        ajudar o time a evoluir de uma Sprint para a outra.
      </div>
    </div>
  );
}
