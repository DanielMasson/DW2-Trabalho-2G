import type { SimNao } from "@/types";

interface SimNaoSelectProps {
  value: SimNao;
  onChange: (value: SimNao) => void;
  id?: string;
  disabled?: boolean;
}

/**
 * Select Sim/Não (equivalente ao snSelectHtml do app.js original).
 * Usado nos checklists de todas as abas de avaliação.
 */
export function SimNaoSelect({ value, onChange, id, disabled }: SimNaoSelectProps) {
  return (
    <select
      id={id}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value as SimNao)}
    >
      <option value="">—</option>
      <option value="S">Sim</option>
      <option value="N">Não</option>
    </select>
  );
}
