interface EmConstrucaoProps {
  titulo: string;
}

/**
 * Painel provisório mostrado para qualquer aba cujo componente real
 * ainda não foi registrado em App.tsx -> TAB_PANELS. Após o merge, ainda
 * cobre sm/owner/po/dev (Pessoa 3) — não entregues em nenhuma das cópias
 * recebidas (ver useSimulationStore.ts, comentário de topo).
 */
export function EmConstrucao({ titulo }: EmConstrucaoProps) {
  return (
    <div className="panel">
      <h2>{titulo}</h2>
      <div className="desc">Esta aba ainda não foi implementada.</div>
      <div className="note note-dark">
        Componente pendente — ver divisão de tarefas em Divisao_Plano_Migracao_React.md.
      </div>
    </div>
  );
}
