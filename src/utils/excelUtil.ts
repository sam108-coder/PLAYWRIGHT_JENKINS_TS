import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { Logger } from './logger';

export class ExcelUtil {
  /**
   * Reads an Excel sheet and returns rows as an array of typed objects.
   * @param relativeOrAbsolutePath Path to the .xlsx file
   * @param sheetName Optional sheet name (defaults to first sheet)
   */
  static readSheetData<T = Record<string, any>>(
    filePath: string,
    sheetName?: string
  ): T[] {
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(resolvedPath)) {
      const errorMsg = `Excel file not found at: ${resolvedPath}`;
      Logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const workbook = XLSX.readFile(resolvedPath);
      const targetSheetName = sheetName || workbook.SheetNames[0];

      if (!workbook.Sheets[targetSheetName]) {
        throw new Error(
          `Sheet "${targetSheetName}" not found in workbook: ${resolvedPath}. Available sheets: ${workbook.SheetNames.join(', ')}`
        );
      }

      const sheet = workbook.Sheets[targetSheetName];
      const data: T[] = XLSX.utils.sheet_to_json<T>(sheet, {
        raw: false, // Convert all values to strings/formatted values
        defval: '', // Default value for empty cells
      });

      Logger.info(`Read ${data.length} records from sheet "${targetSheetName}" in ${resolvedPath}`);
      return data;
    } catch (err: any) {
      Logger.error(`Error reading Excel file: ${err.message}`);
      throw err;
    }
  }

  /**
   * Reads a specific test case row by Test Case ID from a sheet.
   */
  static getTestCaseData<T extends Record<string, any>>(
    filePath: string,
    sheetName: string,
    testCaseId: string
  ): T {
    const allData = this.readSheetData<T>(filePath, sheetName);
    const matched = allData.find(
      (row) => row.testCaseId === testCaseId || row.TestCaseId === testCaseId
    );

    if (!matched) {
      throw new Error(
        `Test case with ID "${testCaseId}" not found in sheet "${sheetName}".`
      );
    }
    return matched;
  }

  /**
   * Helper to write JSON data into an Excel sheet (useful for test data generation / reporting)
   */
  static writeJsonToExcel(
    filePath: string,
    sheets: { [sheetName: string]: Record<string, any>[] }
  ): void {
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const workbook = XLSX.utils.book_new();

    for (const [sheetName, data] of Object.entries(sheets)) {
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }

    XLSX.writeFile(workbook, resolvedPath);
    Logger.info(`Successfully generated Excel file at: ${resolvedPath}`);
  }
}

