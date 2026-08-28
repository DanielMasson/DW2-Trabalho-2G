import { BUYERS, TIMES } from "@/data/constants";
import { computeCorrupcaoPontos, computeSabotagemPontos } from "@/lib/scoring";
import { useSimulationStore } from "@/store/useSimulationStore";
import type { TimeNome, TipoAcaoSabotagem } from "@/types";

/**
 * Mecânicas especiais de Corrupção (Owner) e Sabotagem (Developer),
 * baseadas em regras fixas — os pontos são calculados automaticamente
 * a partir do estado. Equivalente ao renderCorrupSab() do app.js
 * original.
 */
export function CorrupcaoSabotagemTab() {
  const meta = useSimulationStore((s) => s.data.meta);
  const corrupcao = useSimulationStore((s) => s.data.corrupcao);
  const sabotagem = useSimulationStore((s) => s.data.sabotagem);
  const setCorrupcaoField = useSimulationStore((s) => s.setCorrupcaoField);
  const setSabotagemField = useSimulationStore((s) => s.setSabotagemField);

  const empresas = [meta.empresaA, meta.empresaB];
  // O Militar nunca negocia com o corruptor (só compra Caça diretamente do Governo/regras do jogo).
  const compradoresElegiveis = BUYERS.filter((b) => b !== "Militar");

  const cPts = computeCorrupcaoPontos(corrupcao);
  const sPts = computeSabotagemPontos(sabotagem);

  return (
    <div className="panel">
      <h2>Corrupção &amp; Sabotagem</h2>
      <div className="desc">
        Estes dois mecanismos são baseados em regras fixas — os pontos abaixo são calculados automaticamente.
      </div>
      <div className="grid2">
        {/* -------------------- Corrupção (Owner) -------------------- */}
        <div className="mini-card">
          <h3>🔒 Corruptor (Owner)</h3>

          <div className="mini-row">
            <label>Empresa do corruptor</label>
            <select
              value={corrupcao.empresaCorruptora}
              onChange={(e) => setCorrupcaoField("empresaCorruptora", e.target.value)}
            >
              {empresas.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className="checkbox-row" style={{ marginBottom: "0.6rem" }}>
            <input
              type="checkbox"
              id="cd1"
              checked={corrupcao.primeiraDescoberta}
              onChange={(e) => setCorrupcaoField("primeiraDescoberta", e.target.checked)}
            />
            <label htmlFor="cd1">1ª descoberta ocorreu</label>
          </div>

          {corrupcao.primeiraDescoberta && (
            <div className="mini-row">
              <label>Comprador que aceitou (1ª vez)</label>
              <select
                value={corrupcao.primeiroComprador}
                onChange={(e) => setCorrupcaoField("primeiroComprador", e.target.value)}
              >
                <option value="">—</option>
                {compradoresElegiveis.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="checkbox-row" style={{ marginBottom: "0.6rem" }}>
            <input
              type="checkbox"
              id="cd2"
              checked={corrupcao.segundaDescoberta}
              disabled={!corrupcao.primeiraDescoberta}
              onChange={(e) => setCorrupcaoField("segundaDescoberta", e.target.checked)}
            />
            <label htmlFor="cd2">2ª descoberta ocorreu (mesmo assim)</label>
          </div>

          {corrupcao.segundaDescoberta && (
            <div className="mini-row">
              <label>Comprador que aceitou (2ª vez)</label>
              <select
                value={corrupcao.segundoComprador}
                onChange={(e) => setCorrupcaoField("segundoComprador", e.target.value)}
              >
                <option value="">—</option>
                {compradoresElegiveis.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div
            className="mini-row"
            style={{ borderTop: "1px solid var(--line)", paddingTop: "0.6rem", marginTop: "0.4rem" }}
          >
            <label>
              <strong>Pontos do corruptor</strong>
            </label>
            <span className={`pts ${cPts.corruptor < 0 ? "neg" : ""}`}>{cPts.corruptor.toFixed(1)}</span>
          </div>

          {Object.keys(cPts.compradores).map((b) => (
            <div className="mini-row" key={b}>
              <label>Pontos — {b}</label>
              <span className={`pts ${cPts.compradores[b] < 0 ? "neg" : ""}`}>
                {cPts.compradores[b].toFixed(1)}
              </span>
            </div>
          ))}

          <div className="note note-red" style={{ marginTop: "0.8rem" }}>
            O corruptor nunca troca de papel e continua negociando normalmente, mesmo após ser descoberto.
          </div>
        </div>

        {/* -------------------- Sabotagem (Developer) -------------------- */}
        <div className="mini-card">
          <h3>🔒 Sabotador (Developer)</h3>

          <div className="mini-row">
            <label>Empresa do sabotador</label>
            <select
              value={sabotagem.empresaSabotador}
              onChange={(e) => setSabotagemField("empresaSabotador", e.target.value)}
            >
              {empresas.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div className="mini-row">
            <label>Time do sabotador</label>
            <select
              value={sabotagem.timeSabotador}
              onChange={(e) => setSabotagemField("timeSabotador", e.target.value as TimeNome)}
            >
              {TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="mini-row">
            <label>Tipo de ação</label>
            <select
              value={sabotagem.tipoAcao}
              onChange={(e) => setSabotagemField("tipoAcao", e.target.value as TipoAcaoSabotagem)}
            >
              <option value="vazar">Vazar informação</option>
              <option value="atrapalhar">Atrapalhar decisões/produção</option>
            </select>
          </div>

          <div className="checkbox-row" style={{ marginBottom: "0.6rem" }}>
            <input
              type="checkbox"
              id="sd1"
              checked={sabotagem.descoberto}
              onChange={(e) => setSabotagemField("descoberto", e.target.checked)}
            />
            <label htmlFor="sd1">Sabotador foi descoberto</label>
          </div>

          {sabotagem.descoberto && (
            <>
              <div className="mini-row">
                <label>Denúncias consecutivas recebidas</label>
                <select
                  value={sabotagem.denunciasConsecutivas}
                  onChange={(e) =>
                    setSabotagemField("denunciasConsecutivas", Number(e.target.value) as 0 | 1 | 2)
                  }
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </div>
              <div className="checkbox-row" style={{ marginBottom: "0.6rem" }}>
                <input
                  type="checkbox"
                  id="sd2"
                  checked={sabotagem.areaSoubeECalou}
                  onChange={(e) => setSabotagemField("areaSoubeECalou", e.target.checked)}
                />
                <label htmlFor="sd2">PO/colegas da área sabiam e ficaram calados</label>
              </div>
            </>
          )}

          <div
            className="mini-row"
            style={{ borderTop: "1px solid var(--line)", paddingTop: "0.6rem", marginTop: "0.4rem" }}
          >
            <label>
              <strong>Pontos do sabotador</strong>
            </label>
            <span className={`pts ${sPts.sabotador < 0 ? "neg" : ""}`}>{sPts.sabotador.toFixed(1)}</span>
          </div>
          <div className="mini-row">
            <label>
              <strong>Pontos da área/time</strong>
            </label>
            <span className={`pts ${sPts.area < 0 ? "neg" : sPts.area > 0 ? "pos" : ""}`}>
              {sPts.area > 0 ? "+" : ""}
              {sPts.area.toFixed(1)}
            </span>
          </div>
          <div className="mini-row">
            <label>
              <strong>Demitido?</strong>
            </label>
            <span className="pts">{sPts.demitido ? "SIM — vai para o time RIVAL" : "Não"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
