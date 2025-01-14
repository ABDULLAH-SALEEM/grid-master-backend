import * as path from "path";
import * as csvParser from "papaparse";
import * as xlsx from "xlsx";
import firebaseService from "./firebase.service";

class FileParserService {
  async processFile(fileUrl: string, filename: string) {
    const fileStream = await firebaseService.downloadFile(fileUrl, filename);
    const fileExtension = path.extname(filename).toLowerCase();
    if (fileExtension === ".csv") {
      return this.parseCSV(fileStream);
    } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      return this.parseExcel(fileStream);
    } else {
      throw new Error(
        "Unsupported file type. Only .csv, .xlsx, and .xls are allowed."
      );
    }
  }

  async parseCSV(
    fileStream: NodeJS.ReadableStream
  ): Promise<{ columns: string[]; rows: Record<string, any>[] }> {
    const fileContent = await this.streamToString(fileStream);
    return new Promise((resolve, reject) => {
      csvParser.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            return reject(
              new Error(
                "CSV Parsing Error: " +
                  results.errors.map((e) => e.message).join(", ")
              )
            );
          }
          resolve({
            columns: results.meta.fields || [],
            rows: results.data as Record<string, any>[],
          });
        },
        error: (error: unknown) => reject(error),
      });
    });
  }

  async parseExcel(
    fileStream: NodeJS.ReadableStream
  ): Promise<{ columns: string[]; rows: Record<string, any>[] }> {
    const buffer = await this.streamToBuffer(fileStream);
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Extract columns and rows
    const [columns, ...dataRows] = rows as [string[], ...any[]];
    const rowsAsObjects = dataRows.map((row) => {
      const record: Record<string, any> = {};
      columns.forEach((col, index) => {
        record[col] = row[index];
      });
      return record;
    });

    return { columns, rows: rowsAsObjects };
  }

  async streamToString(stream: NodeJS.ReadableStream): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream
        .on("data", (chunk) => chunks.push(chunk))
        .on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")))
        .on("error", reject);
    });
  }

  async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream
        .on("data", (chunk) => chunks.push(chunk))
        .on("end", () => resolve(Buffer.concat(chunks)))
        .on("error", reject);
    });
  }
}

export default new FileParserService();
