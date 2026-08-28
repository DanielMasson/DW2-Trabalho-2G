import { useMemo, useRef, useState } from "react";

import { PAPEIS, TIMES } from "@/data/constants";
import { buildAlunosFromNames, readNamesFromExcelFile } from "@/lib/excelImport";
import { useSimulationStore } from "@/store/useSimulationStore";

function precisaEmpresa(papel) {
  return (
    papel === "Scrum Master" ||
    papel === "Owner/Stakeholder" ||
    papel === "Product Owner" ||
    papel === "Developer"
  );
}

function precisaTime(papel) {
  return papel === "Product Owner" || papel === "Developer";
}

function AlunoRow({ aluno, index, empresas }) {
  const setAlunoField = useSimulationStore((s) => s.setAlunoField);

  return (
    <tr>
      <td>{aluno.id}</td>
      <td style={{ textAlign: "left" }}>{aluno.nome}</td>
      <td>
        <select
          value={aluno.papel}
          onChange={(e) => setAlunoField(index, "papel", e.target.value)}
        >
          {PAPEIS.map((p) => (
            <option key={p} value={p}>
              {p === "" ? "— não atribuído —" : p}
            </option>
          ))}
        </select>
      </td>
      <td>
        {precisaEmpresa(aluno.papel) ? (
          <select
            value={aluno.empresa}
            onChange={(e) => setAlunoField(index, "empresa", e.target.value)}
          >
            <option value="">—</option>
            {empresas.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        ) : null}
      </td>
      <td>
        {precisaTime(aluno.papel) ? (
          <select value={aluno.time} onChange={(e) => setAlunoField(index, "time", e.target.value)}>
            <option value="">—</option>
            {TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        ) : null}
      </td>
    </tr>
  );
}

export function AlunosTab() {
  const alunos = useSimulationStore((s) => s.data.alunos);
  const meta = useSimulationStore((s) => s.data.meta);
  const teamNames = useSimulationStore((s) => s.data.teamNames);
  const setAlunos = useSimulationStore((s) => s.setAlunos);

  const [busca, setBusca] = useState("");
  const [importando, setImportando] = useState(false);
  const fileInputRef = useRef(null);

  const empresas = useMemo(() => [meta.empresaA, meta.empresaB], [meta.empresaA, meta.empresaB]);

  const alunosFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return alunos
      .map((aluno, index) => ({ aluno, index }))
      .filter(({ aluno }) => aluno.nome.toLowerCase().includes(q));
  }, [alunos, busca]);

  const naoAtribuidos = useMemo(() => alunos.filter((a) => !a.papel).length, [alunos]);

  const counts = useMemo(() => {
    const base = {};
    empresas.forEach((e) => {
      base[e] = {
        "Scrum Master": 0,
        "Owner/Stakeholder": 0,
        "Product Owner-Caça": 0,
        "Product Owner-Transporte": 0,
        "Developer-Caça": 0,
        "Developer-Transporte": 0,
      };
    });
    const buyerCounts = {
      "Comprador - Governo": 0,
      "Comprador - Militar": 0,
      "Comprador - Setor Privado": 0,
    };

    alunos.forEach((a) => {
      if (
        a.papel === "Comprador - Governo" ||
        a.papel === "Comprador - Militar" ||
        a.papel === "Comprador - Setor Privado"
      ) {
        buyerCounts[a.papel]++;
      } else if (a.papel === "Scrum Master" || a.papel === "Owner/Stakeholder") {
        if (base[a.empresa]) base[a.empresa][a.papel]++;
      } else if (a.papel === "Product Owner" || a.papel === "Developer") {
        if (base[a.empresa] && a.time) base[a.empresa][`${a.papel}-${a.time}`]++;
      }
    });

    return { porEmpresa: base, compradores: buyerCounts };
  }, [alunos, empresas]);

  async function handleImportFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImportando(true);
    try {
      const nomes = await readNamesFromExcelFile(file);
      if (nomes.length === 0) {
        alert("Não encontrei nomes reconhecíveis nesse arquivo.");
        return;
      }
      const confirmado = window.confirm(
        `Encontrei ${nomes.length} nomes. Isso substitui a lista atual de alunos (as atribuições feitas serão perdidas). Continuar?`
      );
      if (!confirmado) return;
      setAlunos(buildAlunosFromNames(nomes));
    } catch {
      alert("Não foi possível ler este arquivo Excel.");
    } finally {
      setImportando(false);
    }
  }

  return (
    <div className="panel">
      <h2>Alunos</h2>
      <div className="desc">
        Atribua cada aluno a um papel e equipe. A turma não escolhe o lado — a atribuição é feita
        aqui pelo professor.
      </div>

      <div className="roster-search">
        <input
          type="text"
          placeholder="Buscar aluno por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <table className="roster-table">
        <thead>
          <tr>
            <th style={{ width: "2.5rem" }}>#</th>
            <th style={{ width: "16rem" }}>Nome</th>
            <th>Papel</th>
            <th>Empresa</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {alunosFiltrados.map(({ aluno, index }) => (
            <AlunoRow key={aluno.id} aluno={aluno} index={index} empresas={empresas} />
          ))}
        </tbody>
      </table>

      <div className={`note ${naoAtribuidos > 0 ? "note-orange" : "note-green"}`} style={{ marginTop: "1rem" }}>
        {naoAtribuidos} de {alunos.length} alunos ainda sem papel atribuído.
      </div>

      <h2 style={{ marginTop: "1.6rem" }}>Resumo de Vagas Preenchidas</h2>
      <div className="grid2">
        {empresas.map((e) => (
          <div className="mini-card" key={e}>
            <h3>{e}</h3>
            <div className="mini-row">
              <label>Scrum Master</label>
              <span className="pts">{counts.porEmpresa[e]["Scrum Master"]} / 1</span>
            </div>
            <div className="mini-row">
              <label>Owner/Stakeholder</label>
              <span className="pts">{counts.porEmpresa[e]["Owner/Stakeholder"]} / 1</span>
            </div>
            <div className="mini-row">
              <label>PO — {teamNames[e]?.Caça}</label>
              <span className="pts">{counts.porEmpresa[e]["Product Owner-Caça"]} / 1</span>
            </div>
            <div className="mini-row">
              <label>PO — {teamNames[e]?.Transporte}</label>
              <span className="pts">{counts.porEmpresa[e]["Product Owner-Transporte"]} / 1</span>
            </div>
            <div className="mini-row">
              <label>Devs — {teamNames[e]?.Caça}</label>
              <span className="pts">{counts.porEmpresa[e]["Developer-Caça"]} / 4</span>
            </div>
            <div className="mini-row">
              <label>Devs — {teamNames[e]?.Transporte}</label>
              <span className="pts">{counts.porEmpresa[e]["Developer-Transporte"]} / 5</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mini-card" style={{ marginTop: "1rem" }}>
        <h3>Compradores</h3>
        <div className="mini-row">
          <label>Governo</label>
          <span className="pts">{counts.compradores["Comprador - Governo"]} / 1</span>
        </div>
        <div className="mini-row">
          <label>Militar</label>
          <span className="pts">{counts.compradores["Comprador - Militar"]} / 1</span>
        </div>
        <div className="mini-row">
          <label>Setor Privado</label>
          <span className="pts">{counts.compradores["Comprador - Setor Privado"]} / 1</span>
        </div>
      </div>

      <h2 style={{ marginTop: "1.6rem" }}>Importar Lista de Alunos</h2>
      <div className="desc">
        Substitui a lista atual por uma nova, a partir de um arquivo Excel (.xlsx). Use apenas se
        for reaproveitar este painel para outra turma.
      </div>
      <input
        type="file"
        accept=".xlsx,.xls"
        ref={fileInputRef}
        disabled={importando}
        onChange={handleImportFile}
      />
    </div>
  );
}
