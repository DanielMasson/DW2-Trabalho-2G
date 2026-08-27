import { useEffect } from "react";
import type { ComponentType } from "react";

import { TopBar } from "@/components/TopBar";
import { TabsBar } from "@/components/TabsBar";
import { EmConstrucao } from "@/components/tabs/EmConstrucao";
import { TAB_LIST } from "@/data/constants";
import { useSimulationStore } from "@/store/useSimulationStore";
import type { TabKey } from "@/types";

// =====================================================================
// Registro de painéis por aba.
//
// Cada pessoa liga sua aba aqui, substituindo o placeholder pelo
// componente real assim que ele existir — não é necessário alterar mais
// nada em App.tsx. Exemplo (Pessoa 3):
//
//   import { ScrumMasterTab } from "@/components/tabs/ScrumMasterTab";
//   ...
//   sm: ScrumMasterTab,
//
// Responsáveis por aba, conforme Divisao_Plano_Migracao_React.md:
//   setup, alunos, escalacao       -> Pessoa 2
//   sm, owner, po, dev             -> Pessoa 3
//   buyerProf, buyerProduct,
//   corrupsab, result              -> Pessoa 4
// =====================================================================
const TAB_PANELS: Partial<Record<TabKey, ComponentType>> = {
  // setup: SetupTab,
  // alunos: AlunosTab,
  // escalacao: EscalacaoTab,
  // sm: ScrumMasterTab,
  // owner: OwnerTab,
  // po: ProductOwnerTab,
  // dev: DevelopersTab,
  // buyerProf: BuyerProfTab,
  // buyerProduct: BuyerProductTab,
  // corrupsab: CorrupcaoSabotagemTab,
  // result: ResultadoFinalTab,
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

  // Equivalente ao applyFontScale() do app.js original.
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}px`;
  }, [fontScale]);

  return (
    <>
      <TopBar
        // TODO(Pessoa 2): onSave={handleSave} / onLoad={handleLoadFile} vindos de lib/persistence.ts
        // TODO(Pessoa 4): onReset={() => { if (confirm("...")) resetAll(); }}
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
