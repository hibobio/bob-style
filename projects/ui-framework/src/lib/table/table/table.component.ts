// tslint:disable-next-line:max-line-length
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
// tslint:disable-next-line:max-line-length
import { Column, DragStoppedEvent, GridColumnsChangedEvent, GridOptions, GridReadyEvent, RowNode } from 'ag-grid-community';
import { get, has, map, once } from 'lodash';
import { ColumnDef, RowClickedEvent, SortChangedEvent } from './table.interface';
import { AgGridNg2 } from 'ag-grid-angular';
import { TableUtilsService } from '../table-utils-service/table-utils.service';
import { RowSelection, TableType } from './table.enum';

const LICENSE_KEY = 'hibob_Bob_1Devs_1Deployment_23_April_2020__MTU4NzU5NjQwMDAwMA==5b77134bf43e27e7f8ccb20bdfa3c155';

@Component({
  selector: 'b-table',
  templateUrl: './table.component.html',
  styleUrls: ['./styles/table.component.scss', './styles/table-checkbox.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, OnChanges {

  constructor(
    private tableUtilsService: TableUtilsService,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef,
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
  @Input() suppressColumnVirtualisation = true;
  @Input() tableGridOptions: Partial<GridOptions> = {};
  @Input() suppressDragLeaveHidesColumns = false;

  @Output() sortChanged: EventEmitter<SortChangedEvent> = new EventEmitter<SortChangedEvent>();
  @Output() rowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<RowClickedEvent>();
  @Output() selectionChanged: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() gridInit: EventEmitter<null> = new EventEmitter<null>();

  readonly rowHeight: number = 56;
  readonly autoSizePadding: number = 30;
  readonly tableType = TableType;

  gridReady = false;
  gridOptions: GridOptions;
  gridColumnDefs: ColumnDef[];

  private columns: string[];

  readonly tableLicense = once(() =>
    // @ts-ignore
    import('ag-grid-enterprise')
      .then((agGrig) => {
        if (!TableComponent.isLicenseSet) {
          TableComponent.isLicenseSet = true;
          agGrig.LicenseManager.setLicenseKey(LICENSE_KEY);
        }
      })
  );

  ngOnInit() {
    this.setGridHeight(this.maxHeight);
    const that = this;
    const gridOptions = <GridOptions>{
      suppressAutoSize: true,
      suppressRowClickSelection: true,
      suppressDragLeaveHidesColumns: this.suppressDragLeaveHidesColumns,
      autoSizePadding: this.autoSizePadding,
      suppressColumnVirtualisation: this.suppressColumnVirtualisation,
      rowHeight: this.rowHeight,
      headerHeight: this.rowHeight,
      rowSelection: this.rowSelection,
      suppressContextMenu: true,
      getRowClass: (params) => get(params.data, 'isClickable', false) ? 'row-clickable' : '',
      onGridReady: (event: GridReadyEvent) => {
        this.gridReady = true;
        event.columnApi.autoSizeAllColumns();
        this.setOrderedColumns(event.columnApi.getAllGridColumns());
        this.cdr.markForCheck();
        this.gridInit.emit();
      },
      onGridColumnsChanged: (event: GridColumnsChangedEvent) => {
        event.columnApi.autoSizeAllColumns();
        this.setOrderedColumns(event.columnApi.getAllGridColumns());
        this.cdr.markForCheck();
      },

      onDragStopped(event: DragStoppedEvent): void {
        that.setOrderedColumns(event.columnApi.getAllGridColumns());
      },
    };

    this.gridOptions = {
      ...gridOptions,
      ...this.tableGridOptions,
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

  private setOrderedColumns(columns: Column[]): void {
    this.columns = map(columns, col => col.colDef.field);
  }

  private setGridHeight(height: number): void {
    this.elRef.nativeElement.style.setProperty('--max-height', `${ height }px`);
  }

  public getDisplayedRowCount(): number {
    return this.gridOptions.api.getDisplayedRowCount();
  }

  public addRows(rows: any[]): void {
    this.gridOptions.api.updateRowData({ add: rows });
  }

  public filterRows(filterQuery: string): void {
    this.gridOptions.api.setQuickFilter(filterQuery);
  }

  public resetFilter(): void {
    this.gridOptions.api.resetQuickFilter();
  }

  public removeRows(rows: any[]): void {
    this.gridOptions.api.updateRowData({ remove: rows });
  }

  public updateRows(rowsData: any[]): void {
    this.gridOptions.api.updateRowData({ update: rowsData });
  }

  public getRow(rowIndex: string): RowNode {
    return this.gridOptions.api.getRowNode(rowIndex);
  }

  public deselectAll(): void {
    this.gridOptions.api.deselectAll();
  }

  public getOrderedColumnFields(): string[] {
    return this.columns;
  }
}
