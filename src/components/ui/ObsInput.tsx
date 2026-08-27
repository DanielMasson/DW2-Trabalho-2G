interface ObsInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

/**
 * Campo de texto livre (equivalente ao obsInputHtml do app.js original).
 * Usado nas colunas de "Observações" e "Destaque individual".
 */
export function ObsInput({ value, onChange, placeholder, id }: ObsInputProps) {
  return (
    <input
      id={id}
      className="obs-input"
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
