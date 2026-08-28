import { ObsInput, ScoreSelect, SimNaoSelect } from "@/components/ui";
import { sprintCellLabel } from "@/lib/sprintLabel";
import { useSimulationStore } from "@/store/useSimulationStore";

export function ProductOwnerTab() {
  const rows = useSimulationStore((s) => s.data.po);
  const setPoField = useSimulationStore((s) => s.setPoField);

  return (
    <div className="panel">
      <h2>Product Owner</h2>
      <div className="desc">Um Product Owner por time (2 times por empresa).</div>
      <table>
        <thead>
          <tr>
            <th>Sprint</th>
            <th>Empresa</th>
            <th>Time</th>
            <th>
              Requisitos
              <br />
              claros ao time?
            </th>
            <th>
              Acompanhou os
              <br />
              testes de perto?
            </th>
            <th>
              Reunião de
              <br />
              priorização ocorreu?
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
              <td>{r.time}</td>
              <td>
                <SimNaoSelect value={r.requisitos} onChange={(v) => setPoField(i, "requisitos", v)} />
              </td>
              <td>
                <SimNaoSelect value={r.testes} onChange={(v) => setPoField(i, "testes", v)} />
              </td>
              <td>
                <SimNaoSelect value={r.reuniao} onChange={(v) => setPoField(i, "reuniao", v)} />
              </td>
              <td>
                <ScoreSelect value={r.nota} onChange={(v) => setPoField(i, "nota", v)} />
              </td>
              <td>
                <ObsInput value={r.obs} onChange={(v) => setPoField(i, "obs", v)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note note-teal">
        Critério-guia: o PO é avaliado pela clareza dos requisitos e pelo acompanhamento ativo da produção —
        não pela qualidade técnica do avião em si.
      </div>
    </div>
  );
}
