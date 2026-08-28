import * as XLSX from "xlsx";

// =====================================================================
// EXCEL IMPORT — extrai nomes de alunos de uma planilha .xlsx/.xls.
// =====================================================================

/**
 * Lê o ArrayBuffer de um arquivo Excel e devolve a lista de nomes únicos
 * encontrados nele, na ordem em que aparecem.
 */
export function extractNamesFromWorkbook(buffer) {
  const wb = XLSX.read(buffer, { type: "array" });
  const names = [];

  wb.SheetNames.forEach((sheetName) => {
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    rows.forEach((row) => {
      row.forEach((cell) => {
        if (
          typeof cell === "string" &&
          cell.trim().split(" ").length >= 2 &&
          cell.trim().length > 5 &&
          !/\d/.test(cell)
        ) {
          names.push(cell.trim());
        }
      });
    });
  });

  return Array.from(new Set(names));
}

/**
 * Lê um File (do <input type="file">) e devolve os nomes únicos nele encontrados.
 */
export function readNamesFromExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const buffer = ev.target?.result;
        resolve(extractNamesFromWorkbook(buffer));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Monta a nova lista de Aluno a partir de uma lista de nomes.
 */
export function buildAlunosFromNames(names) {
  return names.map((nome, i) => ({ id: i + 1, nome, empresa: "", time: "", papel: "" }));
}
