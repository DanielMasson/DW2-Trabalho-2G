import { useSimulationStore } from "@/store/useSimulationStore";

export function TopBar({ onSave, onLoad, onReset }) {
  const fileName = useSimulationStore((s) => s.fileName);
  const fontScale = useSimulationStore((s) => s.data.meta.fontScale);
  const changeFontScale = useSimulationStore((s) => s.changeFontScale);
  const setFontScale = useSimulationStore((s) => s.setFontScale);

  return (
    <div className="topbar">
      <div>
        <h1>Painel de Avaliação — Simulação Scrum Competitiva</h1>
        <div className="sub" id="fileNameLbl">
          {fileName}
        </div>
      </div>
      <div className="topbar-actions">
        <div className="fontctrl">
          <span className="lbl">Fonte</span>
          <button type="button" title="Diminuir fonte" onClick={() => changeFontScale(-1)}>
            A−
          </button>
          <button type="button" title="Restaurar fonte padrão" onClick={() => setFontScale(16)}>
            A
          </button>
          <button type="button" title="Aumentar fonte" onClick={() => changeFontScale(1)}>
            A+
          </button>
          <span className="lbl">{fontScale}px</span>
        </div>
        <button className="btn btn-load" type="button" disabled={!onLoad} onClick={onLoad} title={!onLoad ? "Em construção" : undefined}>
          📂 Carregar dados (.json)
        </button>
        <button className="btn btn-save" type="button" disabled={!onSave} onClick={onSave} title={!onSave ? "Em construção" : undefined}>
          💾 Salvar dados (.json)
        </button>
        <button className="btn btn-reset" type="button" disabled={!onReset} onClick={onReset} title={!onReset ? "Em construção" : undefined}>
          Limpar tudo
        </button>
      </div>
    </div>
  );
}
