import { Injectable } from '@angular/core';
import { ColumnDef } from '../table/table.interface';
import { assign, chain, compact, concat, flatMap, get, has, map } from 'lodash';
import { SELECTION_COLUMN_DEF } from '../table/table.consts';
import { GridOptions } from 'ag-grid-community';
import { ActionsCellComponent } from '../table-cell-components/actions-cell/actions-cell.component';
import { PinDirection, RowSelection } from '../table/table.enum';
import { IconSize, joinArrays } from 'bob-style';

const ICON_CELL_STYLE = { padding: '0 15px 0 43px' };

@Injectable({
  providedIn: 'root',
})
export class TableUtilsService {
  getAllColFields(gridOptions: GridOptions): string[] {
    return flatMap(gridOptions.columnApi.getAllColumns(), 'colId');
  }

  getGridColumnDef(
    columnDefs: ColumnDef[],
    rowSelection: RowSelection
  ): ColumnDef[] {
    return compact(
      concat(
        this.getRowSelectionColumnDef(rowSelection),
        this.getEnrichColumnDef(columnDefs)
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
    return map(columnDefs, (colDef) =>
      assign({}, colDef, {
        resizable: get(colDef, 'resizable', true),
        sortable: get(colDef, 'sortable', true),
        menuTabs: [],
        cellClass: this.getCellClass(colDef),
        cellStyle: this.getCellStyle(colDef),
      })
    );
  }

  private getCellClass(colDef: ColumnDef): string[] {
    const iconClass = has(colDef, 'icon') ? this.getIconClass(colDef) : [];
    return chain(get(colDef, 'cellClass')).concat(iconClass).compact().value();
  }

  private getCellStyle(colDef): { [key: string]: string } {
    return has(colDef, 'icon')
      ? assign({}, get(colDef, 'cellStyle'), ICON_CELL_STYLE)
      : get(colDef, 'cellStyle', {});
  }

  private getIconClass(colDef: ColumnDef): string[] {
    const iconColorClass = has(colDef, 'iconColor')
      ? `b-icon-${colDef.iconColor}`
      : 'b-icon-normal';
    return [colDef.icon, iconColorClass, `b-icon-${IconSize.medium}`];
  }

  private getRowSelectionColumnDef(rowSelection: RowSelection): ColumnDef {
    return rowSelection
      ? assign({}, SELECTION_COLUMN_DEF, {
          headerCheckboxSelection:
            rowSelection === RowSelection.Multiple ? true : false,
          headerCheckboxSelectionFilteredOnly: true,
          menuTabs: [],
        })
      : null;
  }

  private getColumnsField(columnDef: ColumnDef[] = []): string[] {
    return columnDef?.map((colDef) => colDef.field) || [];
  }

  getOrderedFields(
    existingColumns: ColumnDef[],
    newColumns: ColumnDef[],
    columnsOrder: string[]
  ): ColumnDef[] {
    const newColsFields = this.getColumnsField(newColumns);
    const sortedExistingCols =
      (columnsOrder
        ? existingColumns?.sort((a, b) => {
            return (
              columnsOrder.indexOf(a.field) - columnsOrder.indexOf(b.field)
            );
          })
        : existingColumns) || [];
    const existingColsFields = this.getColumnsField(sortedExistingCols);
    const fieldsToKeep =
      existingColumns?.filter((column) =>
        newColsFields.includes(column.field)
      ) || [];
    const fieldsToAdd =
      newColumns?.filter(
        (column) => !existingColsFields.includes(column.field)
      ) || [];

    return joinArrays(fieldsToKeep, fieldsToAdd);
  }
}
