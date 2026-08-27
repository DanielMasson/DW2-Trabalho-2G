import * as XLSX from "xlsx";

import type { Aluno } from "@/types";

// =====================================================================
// EXCEL IMPORT — extrai nomes de alunos de uma planilha .xlsx/.xls.
//
// Portado 1:1 da heurística do attachImportHandler() no js/app.js
// original: percorre todas as células de todas as abas do arquivo e
// considera "nome" qualquer célula de texto com pelo menos duas
// palavras, mais de 5 caracteres e sem nenhum dígito. Não é 100% à
// prova de falhas, mas é a mesma regra usada na versão HTML/JS pura —
// manter aqui garante paridade de comportamento com o painel original.
// =====================================================================

/**
 * Lê o ArrayBuffer de um arquivo Excel e devolve a lista de nomes únicos
 * encontrados nele, na ordem em que aparecem.
 */
export function extractNamesFromWorkbook(buffer: ArrayBuffer): string[] {
  const wb = XLSX.read(buffer, { type: "array" });
  const names: string[] = [];

  wb.SheetNames.forEach((sheetName) => {
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 });
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
 * Lê um File (do <input type="file">) e devolve os nomes únicos nele
 * encontrados. Rejeita a Promise se o arquivo não puder ser lido como
 * planilha Excel.
 */
export function readNamesFromExcelFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const buffer = ev.target?.result as ArrayBuffer;
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
 * Monta a nova lista de `Aluno` a partir de uma lista de nomes —
 * equivalente ao `unique.map(...)` do app.js original. Substitui
 * completamente a lista atual (atribuições feitas são perdidas), então
 * quem chama deve confirmar com o usuário antes (ver AlunosTab.tsx).
 */
export function buildAlunosFromNames(names: string[]): Aluno[] {
  return names.map((nome, i) => ({ id: i + 1, nome, empresa: "", time: "", papel: "" }));
}
