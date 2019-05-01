import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { get, has, once } from 'lodash';
import { ColumnDef, RowClickedEvent, RowSelection, SortChangedEvent } from './table.interface';
import { AgGridNg2 } from 'ag-grid-angular';
import { LicenseManager } from 'ag-grid-enterprise';
import { TableUtilsService } from '../table-utils-service/table-utils.service';

@Component({
  selector: 'b-table',
  templateUrl: './table.component.html',
  styleUrls: ['./styles/table.component.scss', './styles/table-checkbox.scss']
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
  readonly autoSizePadding: number = 30;

  gridReady = false;
  gridOptions: GridOptions;
  gridColumnDefs: ColumnDef[];
  readonly tableLicense = once(() =>
    LicenseManager.setLicenseKey(
      'hibob_Bob_1Devs_1Deployment_23_April_2020__MTU4NzU5NjQwMDAwMA==5b77134bf43e27e7f8ccb20bdfa3c155'
    )
  );

  constructor(
    private tableUtilsService: TableUtilsService,
    private elRef: ElementRef
  ) {
    this.tableLicense();
  }

  ngOnInit() {
    this.setGridHeight(this.maxHeight);
    this.gridOptions = <GridOptions>{
      suppressAutoSize: true,
      suppressRowClickSelection: true,
      autoSizePadding: this.autoSizePadding,
      rowHeight: this.rowHeight,
      headerHeight: this.rowHeight,
      rowSelection: this.rowSelection,
      filter: false,
      deltaRowDataMode: true,
      onGridReady: () => {
        this.gridOptions.columnApi.autoSizeAllColumns();
        this.gridReady = true;
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (has(changes, 'columnDefs')) {
      this.gridColumnDefs = this.tableUtilsService.getGridColumnDef(
        this.columnDefs,
        this.rowSelection
      );
    }
    if (has(changes, 'maxHeight')) {
      this.maxHeight = changes.maxHeight.currentValue;
      this.setGridHeight(this.maxHeight);
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
    this.elRef.nativeElement.style.setProperty('--max-height', `${height}px`);
  }
}
