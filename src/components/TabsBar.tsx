import { TAB_LIST } from "@/data/constants";
import { useSimulationStore } from "@/store/useSimulationStore";

export function TabsBar() {
  const tab = useSimulationStore((s) => s.tab);
  const setTab = useSimulationStore((s) => s.setTab);

  return (
    <div className="tabs" id="tabsBar">
      {TAB_LIST.map((t) => (
        <div
          key={t.key}
          className={`tab ${tab === t.key ? "active" : ""}`}
          data-tab={t.key}
          onClick={() => setTab(t.key)}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}
