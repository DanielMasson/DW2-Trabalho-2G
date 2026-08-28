export function ScoreSelect({ value, onChange, id, disabled }) {
  return (
    <select
      id={id}
      disabled={disabled}
      value={value}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === "" ? "" : Number(raw));
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
