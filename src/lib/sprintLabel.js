/**
 * Equivalente ao sprintCellLabel(rows, i, key) do app.js original.
 * Mostra "Sprint N" apenas na primeira linha de cada bloco de sprint,
 * evitando repetir o rótulo em toda linha da tabela.
 */
export function sprintCellLabel(rows, i) {
  if (i === 0) return `Sprint ${rows[i].sprint}`;
  return rows[i].sprint !== rows[i - 1].sprint ? `Sprint ${rows[i].sprint}` : "";
}
