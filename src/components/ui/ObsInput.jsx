export function ObsInput({ value, onChange, placeholder, id }) {
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
