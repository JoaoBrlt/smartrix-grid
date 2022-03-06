import * as fs from 'fs';
import * as json2csv from 'json2csv';
const newLine = '\r\n';

export function addToCsvFile(fileName: string, data: any): void {
  fs.stat(fileName, function (err, stat) {
    if (err == null) {
      // file exist
      const csv = json2csv.parse(data, { header: false }) + newLine;

      fs.appendFile(fileName, csv, function (err) {
        if (err) throw err;
        // console.log('The "data to append" was appended to file!');
      });
    } else {
      // New file, just writing headers
      const csv = json2csv.parse(data, { header: true }) + newLine;

      fs.writeFile(fileName, csv, function (err) {
        if (err) throw err;
        // file saved with data
      });
    }
  });
}
