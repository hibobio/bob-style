import { Injectable } from '@angular/core';
import { ColumnDef } from '../../../../ui-framework/bob-table/src/table/table/table.interface';
import { makeArray } from 'bob-style';

@Injectable()
export class TestTableService {

  constructor() {
  }

  getColumnDef(fields: string[]): ColumnDef[] {
    return fields.map(field => {
      return {
        headerName: field,
        field: field
      };
    });
  }


  getRowData(fields: string[]): any {
    return makeArray(10)
      .map((_, index) => {
        const rowData = {};
        fields.forEach(field => {
          Object.assign(rowData, { [field]: `${field} value ${index}` });
        });
        return rowData;

      });
  }
}
