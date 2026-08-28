import { DecisaoSelect, ScoreSelect, SimNaoSelect } from "@/components/ui";
import { sprintCellLabel } from "@/lib/sprintLabel";
import { useSimulationStore } from "@/store/useSimulationStore";

export function BuyerProductTab() {
  const rows = useSimulationStore((s) => s.data.buyerProduct);
  const setBuyerProductField = useSimulationStore((s) => s.setBuyerProductField);

  return (
    <div className="panel">
      <h2>Ficha do Comprador — Avaliação do Produto</h2>
      <div className="desc">
        Transcreva aqui os dados que cada comprador preencheu na ficha em papel, ao final de cada Sprint.
      </div>
      <table>
        <thead>
          <tr>
            <th>Sprint</th>
            <th>Comprador</th>
            <th>Empresa</th>
            <th>Produto</th>
            <th>
              Padrão
              <br />
              Técnico
            </th>
            <th>
              Padrão
              <br />
              Visual
            </th>
            <th>Prazo</th>
            <th>
              Com.
              <br />
              Owner (1-5)
            </th>
            <th>Sinal</th>
            <th>Decisão</th>
            <th>Nota (1-5)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="sprint-label">{sprintCellLabel(rows, i)}</td>
              <td>{r.comprador}</td>
              <td>{r.empresa}</td>
              <td>{r.produto}</td>
              <td>
                <SimNaoSelect value={r.pt} onChange={(v) => setBuyerProductField(i, "pt", v)} />
              </td>
              <td>
                <SimNaoSelect value={r.pv} onChange={(v) => setBuyerProductField(i, "pv", v)} />
              </td>
              <td>
                <SimNaoSelect value={r.prazo} onChange={(v) => setBuyerProductField(i, "prazo", v)} />
              </td>
              <td>
                <ScoreSelect value={r.comOwner} onChange={(v) => setBuyerProductField(i, "comOwner", v)} />
              </td>
              <td>
                <SimNaoSelect value={r.sinal} onChange={(v) => setBuyerProductField(i, "sinal", v)} />
              </td>
              <td>
                <DecisaoSelect value={r.decisao} onChange={(v) => setBuyerProductField(i, "decisao", v)} />
              </td>
              <td>
                <ScoreSelect value={r.nota} onChange={(v) => setBuyerProductField(i, "nota", v)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note note-orange">
        Militar só avalia Caça; Setor Privado só avalia Transporte; Governo avalia os dois. Linhas fora do papel
        do comprador podem ficar em branco.
      </div>
    </div>
  );
}
