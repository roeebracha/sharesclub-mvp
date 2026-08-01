import ExcelJS from "exceljs";
import { Readable } from "node:stream";
import type { RawRow } from "./types";

// File -> raw rows (header text -> cell value as a string). Works identically from a Server
// Action (Buffer from FormData) or a browser context (ArrayBuffer from a File), which is why the
// whole parsers/ tree is written to run in either — see "Backend architecture" in DECISIONS.md.
export async function parseFile(
  buffer: Buffer,
  filename: string,
  headerRow: number,
): Promise<RawRow[]> {
  const workbook = new ExcelJS.Workbook();

  // Both read from a stream rather than xlsx.load(buffer) directly — exceljs's bundled types
  // predate @types/node's generic Buffer<TArrayBuffer>, so a raw Buffer doesn't structurally
  // match its declared parameter type. Streaming sidesteps that entirely.
  if (filename.toLowerCase().endsWith(".csv")) {
    await workbook.csv.read(Readable.from(buffer));
  } else {
    await workbook.xlsx.read(Readable.from(buffer));
  }

  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const headerRowNumber = headerRow + 1; // ExcelJS rows/columns are 1-indexed
  const headerValues = worksheet.getRow(headerRowNumber).values as unknown[];
  const headers = headerValues.map((h) => (h == null ? "" : String(h).trim()));

  const rows: RawRow[] = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowNumber) return;
    const values = row.values as unknown[];
    const rawRow: RawRow = {};
    headers.forEach((header, i) => {
      if (!header) return;
      const cell = values[i];
      rawRow[header] = cell == null ? "" : String(cell).trim();
    });
    rows.push(rawRow);
  });

  return rows;
}
