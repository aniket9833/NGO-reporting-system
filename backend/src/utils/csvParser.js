import { parse } from "csv-parse";

export const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const records = [];

    parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relaxColumnCount: true,
    })
      .on("data", (record) => records.push(record))
      .on("end", () => resolve(records))
      .on("error", (error) => reject(error));
  });
};
