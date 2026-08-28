const OPCOES = [
  { value: "", label: "—" },
  { value: "A", label: "Aceitou" },
  { value: "I", label: "Ignorou" },
  { value: "D", label: "Denunciou" },
];

export function DecisaoSelect({ value, onChange, id, disabled }) {
  return (
    <select
      id={id}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {OPCOES.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
