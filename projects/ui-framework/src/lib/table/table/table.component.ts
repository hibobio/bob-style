import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { get } from 'lodash';
import {
  ColumnDef, RowClickedEvent, RowSelectedEvent, RowSelection, RowSelectionEventType, SortChangedEvent,
} from './table.interface';
import { AgGridNg2 } from 'ag-grid-angular';

@Component({
  selector: 'b-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridNg2;

  @Output() sortChanged: EventEmitter<SortChangedEvent> = new EventEmitter<SortChangedEvent>();
  @Output() rowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<RowClickedEvent>();
  @Output() rowSelected: EventEmitter<RowSelectedEvent> = new EventEmitter<RowSelectedEvent>();

  @Input() public rowData: any[];
  @Input() columnDefs: ColumnDef[];
  @Input() allowMultiSelect: Boolean = true;
  @Input() rowSelection: RowSelection = RowSelection.Multiple;

  readonly rowHeight: Number = 50;

  public gridOptions: GridOptions;

  constructor() {
  }

  ngOnInit() {
    this.gridOptions = <GridOptions>{
      autoSizePadding: 30,
      suppressAutoSize: true,
      onGridSizeChanged: () => {
      },
      onGridReady: () => {
        this.gridOptions.columnApi.autoSizeColumns(['selection', 'about.avatar']);
        this.gridOptions.api.sizeColumnsToFit();
      },
    };
  }

  public getSelectedRows(): object [] {
    return this.agGrid.api.getSelectedRows();
  }

  public onSortChanged($event): void {
    this.sortChanged.emit({
      colId: get(this.agGrid.api.getSortModel(), '[0].colId'),
      sort: get(this.agGrid.api.getSortModel(), '[0].sort')
    });
  }

  public onRowSelected($event): void {
    this.rowSelected.emit({
      rowIndex: $event.rowIndex,
      type: $event.node.selected ? RowSelectionEventType.Select : RowSelectionEventType.Unselect,
      data: $event.data,
    });
  }

  public onRowClicked($event): void {
    this.rowClicked.emit({
      rowIndex: $event.rowIndex,
      data: $event.data,
    });
  }
}
