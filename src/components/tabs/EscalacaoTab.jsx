import { BUYERS, BUYER_IMAGES, ROLE_COLORS, TEAM_IMAGES, TIMES } from "@/data/constants";
import { useSimulationStore } from "@/store/useSimulationStore";

function papelBadgeColor(papel) {
  return ROLE_COLORS[papel] || "#6E6E6E";
}

function CompanyBlock({ empresa }) {
  const alunos = useSimulationStore((s) => s.data.alunos);
  const teamNames = useSimulationStore((s) => s.data.teamNames);
  const imgs = TEAM_IMAGES[empresa] ?? { logo: "", Caça: "", Transporte: "" };

  const sm = alunos.find((a) => a.papel === "Scrum Master" && a.empresa === empresa);
  const owner = alunos.find((a) => a.papel === "Owner/Stakeholder" && a.empresa === empresa);

  const teamRoster = (time) =>
    alunos
      .filter(
        (a) =>
          a.empresa === empresa &&
          a.time === time &&
          (a.papel === "Product Owner" || a.papel === "Developer")
      )
      .sort((a) => (a.papel === "Product Owner" ? -1 : 1));

  return (
    <div className="company-block">
      <div className="company-header">
        <img src={imgs.logo} alt={empresa} />
        <div>
          <h2>{empresa}</h2>
          <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            Scrum Master:{" "}
            {sm ? sm.nome : <span className="tag-unassigned">não atribuído</span>} · Owner:{" "}
            {owner ? owner.nome : <span className="tag-unassigned">não atribuído</span>}
          </div>
        </div>
      </div>
      <div className="teams-grid">
        {TIMES.map((t) => {
          const roster = teamRoster(t);
          return (
            <div className="team-card" key={t}>
              <img className="team-img" src={imgs[t]} alt={teamNames[empresa]?.[t] ?? t} />
              <div className="team-body">
                <h3>{teamNames[empresa]?.[t]}</h3>
                <ul className="role-list">
                  {roster.length === 0 ? (
                    <li>
                      <span className="tag-unassigned">ninguém atribuído ainda</span>
                    </li>
                  ) : (
                    roster.map((a) => (
                      <li key={a.id}>
                        <span>{a.nome}</span>
                        <span
                          className="role-badge"
                          style={{ background: papelBadgeColor(a.papel) }}
                        >
                          {a.papel === "Product Owner" ? "PO" : "Dev"}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EscalacaoTab() {
  const meta = useSimulationStore((s) => s.data.meta);
  const alunos = useSimulationStore((s) => s.data.alunos);
  const empresas = [meta.empresaA, meta.empresaB];

  return (
    <div className="panel">
      <h2>Escalação</h2>
      <div className="desc">
        Visão de equipe, com a identidade visual de cada empresa — útil para projetar em sala.
      </div>

      {empresas.map((e) => (
        <CompanyBlock empresa={e} key={e} />
      ))}

      <h2 style={{ marginTop: "0.4rem" }}>Compradores</h2>
      <div className="buyers-strip">
        {BUYERS.map((b) => {
          const aluno = alunos.find((a) => a.papel === `Comprador - ${b}`);
          return (
            <div className="buyer-card" key={b}>
              <img src={BUYER_IMAGES[b]} alt={b} />
              <div className="buyer-body">
                <h3>{b}</h3>
                <div>
                  {aluno ? aluno.nome : <span className="tag-unassigned">não atribuído</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
