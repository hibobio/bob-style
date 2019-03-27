import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { has, get } from 'lodash';
import { ColumnDef, RowClickedEvent, RowSelection, SortChangedEvent } from './table.interface';
import { AgGridNg2 } from 'ag-grid-angular';
import { TableUtilsService } from '../table-utils-service/table-utils.service';

@Component({
  selector: 'b-table',
  templateUrl: './table.component.html',
  styleUrls: ['./styles/table.component.scss', './styles/table-checkbox.scss'],
})
export class TableComponent implements OnInit, OnChanges {

  @ViewChild('agGrid') agGrid: AgGridNg2;

  @Input() rowData: any[];
  @Input() columnDefs: ColumnDef[];
  @Input() rowSelection: RowSelection = null;
  @Input() maxHeight = 450;

  @Output() sortChanged: EventEmitter<SortChangedEvent> = new EventEmitter<SortChangedEvent>();
  @Output() rowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<RowClickedEvent>();
  @Output() selectionChanged: EventEmitter<any[]> = new EventEmitter<any[]>();

  readonly rowHeight: number = 50;

  gridReady = false;
  gridOptions: GridOptions;
  gridColumnDefs: ColumnDef[];

  constructor(
    private tableUtilsService: TableUtilsService,
    private elRef: ElementRef,
  ) {
  }

  ngOnInit() {
    this.setGridHeight(this.maxHeight);

    this.gridColumnDefs = this.tableUtilsService
      .getGridColumnDef(this.columnDefs, this.rowSelection);

    this.gridOptions = <GridOptions>{
      autoSizePadding: 30,
      suppressAutoSize: true,
      onGridSizeChanged: () => {
      },
      onGridReady: () => {
        this.gridOptions.columnApi
          .autoSizeColumns(this.tableUtilsService.getAllColFields(this.gridOptions));
        this.gridReady = true;
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'maxHeight')) {
      this.setGridHeight(changes.maxHeight.currentValue);
    }
  }

  onSortChanged($event): void {
    this.sortChanged.emit({
      colId: get($event.api.getSortModel(), '[0].colId'),
      sort: get($event.api.getSortModel(), '[0].sort')
    });
  }

  onSelectionChanged($event): void {
    this.selectionChanged.emit($event.api.getSelectedRows());
  }

  onRowClicked($event): void {
    this.rowClicked.emit({
      rowIndex: $event.rowIndex,
      data: $event.data,
    });
  }

  private setGridHeight(height: number): void {
    this.elRef.nativeElement.style.setProperty('--max-height', `${ height }px`);
  }
}
