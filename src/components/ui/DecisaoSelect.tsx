import type { Decisao } from "@/types";

interface DecisaoSelectProps {
  value: Decisao;
  onChange: (value: Decisao) => void;
  id?: string;
  disabled?: boolean;
}

const OPCOES: { value: Decisao; label: string }[] = [
  { value: "", label: "—" },
  { value: "A", label: "Aceitou" },
  { value: "I", label: "Ignorou" },
  { value: "D", label: "Denunciou" },
];

/**
 * Select de decisão do comprador (equivalente ao decisaoSelectHtml do
 * app.js original). Usado na aba "Compradores (Produto)".
 */
export function DecisaoSelect({ value, onChange, id, disabled }: DecisaoSelectProps) {
  return (
    <select
      id={id}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value as Decisao)}
    >
      {OPCOES.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
