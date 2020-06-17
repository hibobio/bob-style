import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  CellClickedEvent,
  Column,
  DragStoppedEvent,
  GridColumnsChangedEvent,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { cloneDeep, get, has, map } from 'lodash';
import { TableUtilsService } from '../table-utils-service/table-utils.service';
import { AgGridWrapper } from './ag-grid-wrapper';
import { ColumnOrderStrategy, RowSelection, TableType } from './table.enum';
import {
  ColumnDef,
  ColumnDefConfig,
  ColumnsOrderChangedEvent,
  RowClickedEvent,
  SortChangedEvent,
  TableStyleConfig,
} from './table.interface';

const CLOSE_BUTTON_DIAMETER = 20;
const CLOSE_MARGIN_OFFSET = 6;
const DEFAULT_COL_ORDER_STRATEGY = ColumnOrderStrategy.AppendNew;

@Component({
  selector: 'b-table',
  templateUrl: './table.component.html',
  styleUrls: [
    './styles/table.component.scss',
    './styles/table-checkbox.scss',
    './styles/tree-table.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent extends AgGridWrapper implements OnInit, OnChanges {
  /**
   * @internal - use "addClass"
   */
  public _externalClasses = '';

  constructor(
    private tableUtilsService: TableUtilsService,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  @ViewChild('agGrid', { static: true }) agGrid: AgGridAngular;

  @Input() type: TableType = TableType.Primary;

  @Input() rowData: any[] = [];
  @Input() columnDefs: ColumnDef[] = [];
  @Input() columnDefConfig: ColumnDefConfig;
  @Input() rowSelection: RowSelection = null;
  @Input() maxHeight = 450;
  @Input() suppressColumnVirtualisation = true;
  @Input() suppressRowVirtualisation = false;
  @Input() tableGridOptions: Partial<GridOptions> = {};
  @Input() suppressDragLeaveHidesColumns = true;
  @Input() removeColumnButtonEnabled = false;
  @Input() shouldAutoSizeColumns = true;

  @Input() styleConfig: TableStyleConfig = {};

  @Output() sortChanged: EventEmitter<SortChangedEvent> = new EventEmitter<
    SortChangedEvent
  >();
  @Output() rowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<
    RowClickedEvent
  >();
  @Output() selectionChanged: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() gridInit: EventEmitter<void> = new EventEmitter<void>();
  @Output() columnsChanged: EventEmitter<void> = new EventEmitter<void>();
  @Output() columnsOrderChanged: EventEmitter<
    ColumnsOrderChangedEvent
  > = new EventEmitter<ColumnsOrderChangedEvent>();
  @Output() cellClicked: EventEmitter<CellClickedEvent> = new EventEmitter<
    CellClickedEvent
  >();
  @Output() columnRemoved: EventEmitter<string> = new EventEmitter<string>();

  readonly rowHeight: number = 56;
  readonly autoSizePadding: number = 30;
  readonly tableType = TableType;
  gridReady = false;
  gridOptions: GridOptions;
  gridColumnDefs: ColumnDef[];

  private columns: string[];

  @HostListener('click', ['$event'])
  onHostClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (
      this.removeColumnButtonEnabled &&
      this.columnRemoved.observers &&
      target.matches('.ag-header-viewport .ag-header-cell[col-id]')
    ) {
      const outerWidth = target.offsetWidth;
      const outerHeight = target.offsetHeight;
      const paddingRight = parseFloat(getComputedStyle(target).paddingRight);
      if (
        event.offsetX <= outerWidth - paddingRight + CLOSE_MARGIN_OFFSET &&
        event.offsetX >=
          outerWidth -
            paddingRight +
            CLOSE_MARGIN_OFFSET -
            CLOSE_BUTTON_DIAMETER &&
        event.offsetY >= (outerHeight - CLOSE_BUTTON_DIAMETER) / 2 &&
        event.offsetY <= (outerHeight + CLOSE_BUTTON_DIAMETER) / 2
      ) {
        event.stopPropagation();
        this.columnRemoved.emit(target.getAttribute('col-id'));
      }
    }
  }

  ngOnInit() {
    this.setGridHeight(this.maxHeight);
    this.setGridOptions({
      ...this.initGridOptions(),
      ...this.tableGridOptions,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    let updateColumns = false;
    let previousColumnDefValue: ColumnDef[];
    if (has(changes, 'columnDefs')) {
      updateColumns = true;
      this.columnDefConfig = {
        columnDef: changes.columnDefs.currentValue,
        orderStrategy: DEFAULT_COL_ORDER_STRATEGY,
      };
      previousColumnDefValue = changes.columnDefs.previousValue;
    }
    if (has(changes, 'columnDefConfig')) {
      updateColumns = true;
      this.columnDefConfig = changes.columnDefConfig.currentValue;
      previousColumnDefValue = changes.columnDefConfig.previousValue?.columnDef;
    }

    if (updateColumns) {
      const existingColumns = previousColumnDefValue ? previousColumnDefValue : this.columnDefs;
      const columnDefs = this.columnDefConfig.orderStrategy === ColumnOrderStrategy.AppendNew
        ? this.tableUtilsService.getOrderedFields(
          existingColumns,
          this.columnDefConfig.columnDef,
          this.columns)
        : this.columnDefConfig.columnDef;
      this.gridColumnDefs = this.tableUtilsService.getGridColumnDef(
        columnDefs,
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
      sort: get($event.api.getSortModel(), '[0].sort'),
    });
  }

  onSelectionChanged($event): void {
    this.selectionChanged.emit($event.api.getSelectedRows());
  }

  onRowClicked($event): void {
    this.rowClicked.emit({
      rowIndex: $event.rowIndex,
      data: $event.data,
      agGridId: get($event, 'node.id', null),
    });
  }

  private setOrderedColumns(columns: Column[]): void {
    this.columns = map(columns, (col) => col.colDef.field);
    this.columnsOrderChanged.emit({ columns: cloneDeep(this.columns) });
  }

  private setGridHeight(height: number): void {
    this.elRef.nativeElement.style.setProperty('--max-height', `${height}px`);
  }

  public getOrderedColumnFields(): string[] {
    return this.columns;
  }

  private initGridOptions(): GridOptions {
    const that = this;
    return {
      suppressAutoSize: true,
      suppressRowClickSelection: true,
      suppressDragLeaveHidesColumns: this.suppressDragLeaveHidesColumns,
      autoSizePadding: this.autoSizePadding,
      suppressColumnVirtualisation: this.suppressColumnVirtualisation,
      rowHeight: this.rowHeight,
      headerHeight: this.rowHeight,
      rowSelection: this.rowSelection,
      suppressContextMenu: true,
      rowBuffer: this.suppressRowVirtualisation ? 99999 : 20,
      getRowClass: (params) =>
        get(params.data, 'isClickable', false) ? 'row-clickable' : '',
      onGridReady: (event: GridReadyEvent) => {
        this.gridReady = true;
        if (this.shouldAutoSizeColumns) {
          event.columnApi.autoSizeAllColumns();
        }
        this.setOrderedColumns(event.columnApi.getAllGridColumns());
        this.cdr.markForCheck();
        this.gridInit.emit();
      },
      onGridColumnsChanged: (event: GridColumnsChangedEvent) => {
        if (this.shouldAutoSizeColumns) {
          event.columnApi.autoSizeAllColumns();
        }
        this.setOrderedColumns(event.columnApi.getAllGridColumns());
        this.cdr.markForCheck();
        this.columnsChanged.emit();
      },
      onDragStopped(event: DragStoppedEvent): void {
        that.setOrderedColumns(event.columnApi.getAllGridColumns());
      },
      onCellClicked(event: CellClickedEvent): void {
        that.cellClicked.emit(event);
      },
      accentedSort: true,
    };
  }

  addClass(className: string) {
    this._externalClasses += ` ${className}`;
    this.cdr.detectChanges();
  }
}
