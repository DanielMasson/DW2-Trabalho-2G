import type { Score } from "@/types";

interface ScoreSelectProps {
  value: Score;
  onChange: (value: Score) => void;
  /** id/name do <select>, útil para <label htmlFor> nas tabelas de avaliação. */
  id?: string;
  disabled?: boolean;
}

/**
 * Select de nota 1–5 (equivalente ao scoreSelectHtml do app.js original).
 * Componente controlado e "burro": não conhece o path no estado, apenas
 * recebe o valor atual e devolve o novo valor via onChange.
 */
export function ScoreSelect({ value, onChange, id, disabled }: ScoreSelectProps) {
  return (
    <select
      id={id}
      disabled={disabled}
      value={value}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === "" ? "" : (Number(raw) as Score));
      }}
    >
      <option value="">—</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
  );
}
