import { useEffect, useRef } from "react";

import { TopBar } from "@/components/TopBar";
import { TabsBar } from "@/components/TabsBar";
import { EmConstrucao } from "@/components/tabs/EmConstrucao";
import { AlunosTab } from "@/components/tabs/AlunosTab";
import { EscalacaoTab } from "@/components/tabs/EscalacaoTab";
import { SetupTab } from "@/components/tabs/SetupTab";
import { ScrumMasterTab } from "@/components/tabs/ScrumMasterTab";
import { OwnerTab } from "@/components/tabs/OwnerTab";
import { ProductOwnerTab } from "@/components/tabs/ProductOwnerTab";
import { DevelopersTab } from "@/components/tabs/DevelopersTab";
import { BuyerProfTab } from "@/components/tabs/BuyerProfTab";
import { BuyerProductTab } from "@/components/tabs/BuyerProductTab";
import { CorrupcaoSabotagemTab } from "@/components/tabs/CorrupcaoSabotagemTab";
import { ResultadoFinalTab } from "@/components/tabs/ResultadoFinalTab";
import { TAB_LIST } from "@/data/constants";
import { loadStateFromFile, saveStateToFile } from "@/lib/persistence";
import { useSimulationStore } from "@/store/useSimulationStore";

const TAB_PANELS = {
  setup: SetupTab,
  alunos: AlunosTab,
  escalacao: EscalacaoTab,
  sm: ScrumMasterTab,
  owner: OwnerTab,
  po: ProductOwnerTab,
  dev: DevelopersTab,
  buyerProf: BuyerProfTab,
  buyerProduct: BuyerProductTab,
  corrupsab: CorrupcaoSabotagemTab,
  result: ResultadoFinalTab,
};

function PanelWrap() {
  const tab = useSimulationStore((s) => s.tab);
  const tabDef = TAB_LIST.find((t) => t.key === tab);
  const Panel = TAB_PANELS[tab];

  return (
    <div id="panelWrap">
      {Panel ? <Panel /> : <EmConstrucao titulo={tabDef?.label ?? tab} />}
    </div>
  );
}

export default function App() {
  const fontScale = useSimulationStore((s) => s.data.meta.fontScale);
  const data = useSimulationStore((s) => s.data);
  const replaceState = useSimulationStore((s) => s.replaceState);
  const resetAll = useSimulationStore((s) => s.resetAll);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}px`;
  }, [fontScale]);

  function handleSave() {
    saveStateToFile(data);
  }

  function handleLoadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const { data: loaded, fileName } = await loadStateFromFile(file);
      replaceState(loaded, fileName);
    } catch {
      alert("Não foi possível ler este arquivo. Verifique se é um .json válido gerado por este painel.");
    }
  }

  function handleReset() {
    if (
      window.confirm(
        "Isso apaga todos os dados lançados nesta sessão (não afeta arquivos já salvos). Continuar?"
      )
    ) {
      resetAll();
    }
  }

  return (
    <>
      <TopBar onSave={handleSave} onLoad={handleLoadClick} onReset={handleReset} />
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <TabsBar />
      <div className="wrap">
        <PanelWrap />
        <div className="footer-note">
          Os dados ficam apenas nesta janela até você clicar em "Salvar dados (.json)". Salve com
          frequência, especialmente ao final de cada Sprint.
        </div>
      </div>
    </>
  );
}
