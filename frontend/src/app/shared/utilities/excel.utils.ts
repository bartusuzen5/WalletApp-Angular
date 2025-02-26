import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export class ExcelUtils {
   
    static exportToExcel(items: any[]){
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(items);
      const workbook: XLSX.WorkBook = { Sheets: { 'Veriler': worksheet }, SheetNames: ['Veriler'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(data, 'TabloVerisi.xlsx');
    }
  }