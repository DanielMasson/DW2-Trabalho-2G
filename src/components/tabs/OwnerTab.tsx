import { ObsInput, ScoreSelect } from "@/components/ui";
import { sprintCellLabel } from "@/lib/sprintLabel";
import { useSimulationStore } from "@/store/useSimulationStore";

/**
 * Aba "Owner" — avaliação de comunicação e negociação do Owner/Stakeholder,
 * independente dos pontos de corrupção (registrados na aba "Corrupção &
 * Sabotagem"). Equivalente ao renderOwner() do app.js original (Pessoa 3).
 */
export function OwnerTab() {
  const rows = useSimulationStore((s) => s.data.owner);
  const setOwnerField = useSimulationStore((s) => s.setOwnerField);

  return (
    <div className="panel">
      <h2>Stakeholder / Owner</h2>
      <div className="desc">
        Avaliação de comunicação e negociação — independente dos pontos de corrupção, registrados na aba
        "Corrupção &amp; Sabotagem".
      </div>
      <table>
        <thead>
          <tr>
            <th>Sprint</th>
            <th>Empresa</th>
            <th>
              Comunicação com
              <br />
              a equipe (1-5)
            </th>
            <th>
              Negociação com
              <br />
              compradores (1-5)
            </th>
            <th>
              Alinhamento com
              <br />
              SM/PO sobre qualidade (1-5)
            </th>
            <th>Nota Geral (1-5)</th>
            <th>Observações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="sprint-label">{sprintCellLabel(rows, i)}</td>
              <td>{r.empresa}</td>
              <td>
                <ScoreSelect value={r.comunicacao} onChange={(v) => setOwnerField(i, "comunicacao", v)} />
              </td>
              <td>
                <ScoreSelect value={r.negociacao} onChange={(v) => setOwnerField(i, "negociacao", v)} />
              </td>
              <td>
                <ScoreSelect value={r.alinhamento} onChange={(v) => setOwnerField(i, "alinhamento", v)} />
              </td>
              <td>
                <ScoreSelect value={r.notaGeral} onChange={(v) => setOwnerField(i, "notaGeral", v)} />
              </td>
              <td>
                <ObsInput value={r.obs} onChange={(v) => setOwnerField(i, "obs", v)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note note-blue">
        Esta nota avalia o desempenho no papel — não confunda com os pontos ganhos/perdidos no mecanismo de
        corrupção, calculados automaticamente na aba própria.
      </div>
    </div>
  );
}
