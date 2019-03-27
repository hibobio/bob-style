import { Injectable } from '@angular/core';
import { ColumnDef, RowSelection } from '../table/table.interface';
import { assign, chain, compact, concat, flatMap, get, map } from 'lodash';
import { SELECTION_COLUMN_DEF } from '../table/table.consts';
import { GridOptions } from 'ag-grid-community';

@Injectable()
export class TableUtilsService {

  getAllColFields(gridOptions: GridOptions): string[] {
    return flatMap(gridOptions.columnApi.getAllColumns(), 'colId');
  }

  getGridColumnDef(columnDefs: ColumnDef[], rowSelection: RowSelection): ColumnDef[] {
    return compact(
      concat(
        this.getRowSelectionColumnDef(rowSelection),
        this.getEnrichColumnDef(columnDefs),
      )
    );
  }

  private getEnrichColumnDef(columnDefs: ColumnDef[]): ColumnDef[] {
    return map(columnDefs, colDef =>
      assign({}, colDef, {
        resizable: get(colDef, 'resizable', true),
        sortable: get(colDef, 'sortable', true),
      }));
  }

  private getRowSelectionColumnDef(rowSelection: RowSelection): ColumnDef {
    return rowSelection
      ? assign({}, SELECTION_COLUMN_DEF, {
        headerCheckboxSelection: rowSelection === RowSelection.Multiple ? true : false,
      })
      : null;
  }
}
