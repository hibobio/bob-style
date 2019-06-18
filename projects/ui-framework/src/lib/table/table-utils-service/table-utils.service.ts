import { Injectable } from '@angular/core';
import { ColumnDef } from '../table/table.interface';
import { assign, compact, concat, flatMap, get, map } from 'lodash';
import { SELECTION_COLUMN_DEF } from '../table/table.consts';
import { GridOptions } from 'ag-grid-community';
import { ActionsCellComponent } from '../table-cell-components/actions-cell/actions-cell.component';
import { PinDirection, RowSelection } from '../table/table.enum';

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

  getActionsColumnDef(): ColumnDef {
    return {
      headerName: '',
      field: 'actions',
      pinned: PinDirection.Right,
      lockPosition: true,
      resizable: false,
      sortable: false,
      width: 40,
      cellRendererFramework: ActionsCellComponent,
    };
  }

  private getEnrichColumnDef(columnDefs: ColumnDef[]): ColumnDef[] {
    return map(columnDefs, colDef =>
      assign({}, colDef, {
        resizable: get(colDef, 'resizable', true),
        sortable: get(colDef, 'sortable', true),
        menuTabs: []
      }));
  }

  private getRowSelectionColumnDef(rowSelection: RowSelection): ColumnDef {
    return rowSelection
      ? assign({}, SELECTION_COLUMN_DEF, {
        headerCheckboxSelection: rowSelection === RowSelection.Multiple ? true : false,
        menuTabs: []
      })
      : null;
  }
}
