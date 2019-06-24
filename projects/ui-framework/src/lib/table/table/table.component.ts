// tslint:disable-next-line:max-line-length
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GridOptions, GridReadyEvent, RowNode } from 'ag-grid-community';
import { cloneDeep, get, has, map, once, toString } from 'lodash';
import { ColumnDef, RowClickedEvent, RowNodeDef, SortChangedEvent } from './table.interface';
import { AgGridNg2 } from 'ag-grid-angular';
import { TableUtilsService } from '../table-utils-service/table-utils.service';
import { RowSelection, TableType } from './table.enum';

@Component({
  selector: 'b-table',
  templateUrl: './table.component.html',
  styleUrls: ['./styles/table.component.scss', './styles/table-checkbox.scss']
})
export class TableComponent implements OnInit, OnChanges {

  constructor(
    private tableUtilsService: TableUtilsService,
    private elRef: ElementRef
  ) {
    this.tableLicense();
  }
  static isLicenseSet = false;
  @ViewChild('agGrid', { static: true }) agGrid: AgGridNg2;

  @Input() type: TableType = TableType.Primary;
  @Input() rowData: any[];
  @Input() columnDefs: ColumnDef[];
  @Input() rowSelection: RowSelection = null;
  @Input() maxHeight = 450;

  @Output() sortChanged: EventEmitter<SortChangedEvent> = new EventEmitter<SortChangedEvent>();
  @Output() rowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<RowClickedEvent>();
  @Output() selectionChanged: EventEmitter<any[]> = new EventEmitter<any[]>();

  readonly rowHeight: number = 50;
  readonly autoSizePadding: number = 30;
  readonly tableType = TableType;

  gridReady = false;
  gridOptions: GridOptions;
  gridColumnDefs: ColumnDef[];

  readonly tableLicense = once(() =>
    // @ts-ignore
    import('ag-grid-enterprise').then((agGrig) => {
      // tslint:disable-next-line:max-line-length
      if (!TableComponent.isLicenseSet) {
        TableComponent.isLicenseSet = true;
        // tslint:disable-next-line:max-line-length
        agGrig.LicenseManager.setLicenseKey('hibob_Bob_1Devs_1Deployment_23_April_2020__MTU4NzU5NjQwMDAwMA==5b77134bf43e27e7f8ccb20bdfa3c155');
      }
    })
  );

  ngOnInit() {
    this.setGridHeight(this.maxHeight);
    this.gridOptions = <GridOptions>{
      suppressAutoSize: true,
      suppressRowClickSelection: true,
      autoSizePadding: this.autoSizePadding,
      rowHeight: this.rowHeight,
      headerHeight: this.rowHeight,
      rowSelection: this.rowSelection,
      suppressContextMenu: true,
      onGridReady: (event: GridReadyEvent) => {
        event.columnApi.autoSizeAllColumns();
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
      agGridId: get($event, 'node.id', null)
    });
  }

  private setGridHeight(height: number): void {
    this.elRef.nativeElement.style.setProperty('--max-height', `${height}px`);
  }

  public addRows(rows: any[]): void {
    this.gridOptions.api.updateRowData({ add: rows });
  }

  public removeRows(rows: any[]): void {
    this.gridOptions.api.updateRowData({ remove: rows });
  }

  public updateRows(rows: RowNodeDef[]): void {
    const rowsData: any[] = map(rows, (row: RowNodeDef) => {
      const getRow: RowNode = this.getRow(toString(row.rowIndex));
      getRow.data = cloneDeep(row.data);
      return getRow.data;
    });
    this.gridOptions.api.updateRowData({ update: rowsData });
  }

  public getRow(rowIndex: string): RowNode {
    return this.gridOptions.api.getRowNode(rowIndex);
  }

  public deselectAll(): void {
    this.gridOptions.api.deselectAll();
  }
}
