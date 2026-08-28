import { ObsInput, ScoreSelect, SimNaoSelect } from "@/components/ui";
import { sprintCellLabel } from "@/lib/sprintLabel";
import { useSimulationStore } from "@/store/useSimulationStore";

/**
 * Avaliação do professor sobre como cada comprador (Governo, Militar,
 * Setor Privado) exerceu seu papel a cada Sprint. Equivalente ao
 * renderBuyerProf() do app.js original.
 */
export function BuyerProfTab() {
  const rows = useSimulationStore((s) => s.data.buyerProf);
  const setBuyerProfField = useSimulationStore((s) => s.setBuyerProfField);

  return (
    <div className="panel">
      <h2>Compradores — Desempenho no Papel</h2>
      <div className="desc">Avaliação do professor sobre como cada comprador exerceu seu papel.</div>
      <table>
        <thead>
          <tr>
            <th>Sprint</th>
            <th>Comprador</th>
            <th>
              Aplicou o checklist
              <br />
              de verificação?
            </th>
            <th>
              Decisões coerentes
              <br />
              com o papel?
            </th>
            <th>
              Feedback construtivo
              <br />
              nas Reviews?
            </th>
            <th>Nota (1-5)</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="sprint-label">{sprintCellLabel(rows, i)}</td>
              <td>{r.comprador}</td>
              <td>
                <SimNaoSelect value={r.checklist} onChange={(v) => setBuyerProfField(i, "checklist", v)} />
              </td>
              <td>
                <SimNaoSelect value={r.decisoes} onChange={(v) => setBuyerProfField(i, "decisoes", v)} />
              </td>
              <td>
                <SimNaoSelect value={r.feedback} onChange={(v) => setBuyerProfField(i, "feedback", v)} />
              </td>
              <td>
                <ScoreSelect value={r.nota} onChange={(v) => setBuyerProfField(i, "nota", v)} />
              </td>
              <td>
                <ObsInput value={r.obs} onChange={(v) => setBuyerProfField(i, "obs", v)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note note-orange">
        Critério-guia: avalie se o comprador aplicou o checklist a cada Sprint, se as decisões foram coerentes
        com o papel, e se o feedback nas Reviews foi útil.
      </div>
    </div>
  );
}
