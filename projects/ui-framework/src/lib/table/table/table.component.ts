import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { get } from 'lodash';
import { ColumnDef, RowClickedEvent, RowSelectedEvent, RowSelection, RowSelectionEventType, SortChangedEvent } from './table.interface';
import { AgGridNg2 } from 'ag-grid-angular';

@Component({
  selector: 'b-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {


  @Output() sortChanged: EventEmitter<SortChangedEvent> = new EventEmitter<SortChangedEvent>();
  @Output() rowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<RowClickedEvent>();
  @Output() rowSelected: EventEmitter<RowSelectedEvent> = new EventEmitter<RowSelectedEvent>();
  @Output() rowSelectionChanged: EventEmitter<RowSelectedEvent> = new EventEmitter<RowSelectedEvent>();

  public gridOptions: GridOptions;

  @Input() public rowData: any[];
  @Input() columnDefs: ColumnDef[];
  @Input() allowMultiSelect: Boolean = true;
  @Input() sizeColumnsToFit: Boolean = true;
  @Input() rowHeight: Number = 50;
  @Input() rowSelection: RowSelection = RowSelection.Multiple;

  @ViewChild('agGrid') agGrid: AgGridNg2;



  constructor() {
    this.gridOptions = <GridOptions>{
      onGridReady: () => {
        if (this.sizeColumnsToFit) {
          this.gridOptions.api.sizeColumnsToFit();
        }
      }
    };
  }

  onSortChanged ($event) {
    this.sortChanged.emit({
      colId: get (this.agGrid.api.getSortModel(), '[0].colId'),
      sort:  get (this.agGrid.api.getSortModel(), '[0].sort')
    });
  }

  onRowSelected ($event) {
    this.rowSelected.emit({
      rowIndex: $event.rowIndex,
      type: $event.node.selected ? RowSelectionEventType.Select : RowSelectionEventType.Unselect,
      data: $event.data,
    });
  }

  onRowClicked ($event) {
    this.rowClicked.emit({
      rowIndex: $event.rowIndex,
      data: $event.data,
    });
  }

  ngOnInit() {
  }
}
