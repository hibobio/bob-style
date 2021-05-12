import { GridOptions } from 'ag-grid-community';
import { flatMap, has } from 'lodash';

import { Injectable } from '@angular/core';

import {
  compact,
  concat,
  get,
  IconSize,
  isFunction,
  joinArrays,
  normalizeString,
} from 'bob-style';

import { ActionsCellComponent } from '../table-cell-components/actions-cell/actions-cell.component';
import { SELECTION_COLUMN_DEF } from '../table/table.consts';
import { PinDirection, RowSelection } from '../table/table.enum';
import { ColumnDef } from '../table/table.interface';

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
    rowSelection: RowSelection,
    enableRowDrag: boolean
  ): ColumnDef[] {
    return compact(
      concat(
        this.getRowSelectionColumnDef(rowSelection),
        this.getEnrichColumnDef(columnDefs, enableRowDrag)
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

  private getEnrichColumnDef(
    columnDefs: ColumnDef[],
    enableRowDrag: boolean
  ): ColumnDef[] {
    return columnDefs.map((colDef, i) => ({
      ...colDef,
      resizable: get(colDef, 'resizable', true),
      sortable: !enableRowDrag && get(colDef, 'sortable', true),
      ...(colDef.sort && { sort: enableRowDrag ? null : colDef.sort }),
      menuTabs: [],
      cellClass: this.getCellClass(colDef),
      cellStyle: this.getCellStyle(colDef),
      rowDrag: enableRowDrag && i === 0,

      filterParams: {
        textFormatter: normalizeString,
      },
      getQuickFilterText: function (params) {
        return normalizeString(
          isFunction(colDef.getQuickFilterText)
            ? colDef.getQuickFilterText(params)
            : params.value
        );
      },
    }));
  }

  private getCellClass(colDef: ColumnDef): string[] {
    const iconClass = has(colDef, 'icon') ? this.getIconClass(colDef) : [];
    return compact(concat(get(colDef, 'cellClass'), iconClass));
  }

  private getCellStyle(colDef): { [key: string]: string } {
    return has(colDef, 'icon')
      ? Object.assign({}, get(colDef, 'cellStyle'), ICON_CELL_STYLE)
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
      ? Object.assign({}, SELECTION_COLUMN_DEF, {
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
