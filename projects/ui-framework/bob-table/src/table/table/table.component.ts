import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
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
  AgGridEvent,
  RowEvent,
} from 'ag-grid-community';
import { get, map } from 'lodash';
import { TableUtilsService } from '../table-utils-service/table-utils.service';
import { AgGridWrapper } from './ag-grid-wrapper';
import {
  ColumnOrderStrategy,
  TableEventName,
  RowSelection,
  TableType,
} from './table.enum';
import {
  ColumnDef,
  ColumnDefConfig,
  ColumnsChangedEvent,
  ColumnsOrderChangedEvent,
  RowClickedEvent,
  SortChangedEvent,
  TablePagerState,
  TableStyleConfig,
} from './table.interface';
import {
  DOMhelpers,
  EmptyStateConfig,
  hasChanges,
  notFirstChanges,
  PagerConfig,
  PAGER_CONFIG_DEF,
} from 'bob-style';
import {
  TABLE_AUTOSIZE_PADDING,
  TABLE_MIN_HEIGHT,
  TABLE_PAGER_HEIGHT,
  TABLE_ROW_HEIGHT,
} from './table.consts';

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
    private cdr: ChangeDetectorRef,
    private DOM: DOMhelpers
  ) {
    super();
  }

  @ViewChild('agGrid', { static: true }) agGrid: AgGridAngular;

  @HostBinding('attr.data-type') @Input() type: TableType = TableType.Primary;

  @Input() rowData: any[] = [];
  @Input() columnDefs: ColumnDef[] = [];
  @Input() columnDefConfig: ColumnDefConfig;
  @Input() rowSelection: RowSelection = null;
  @Input() maxHeight = TABLE_MIN_HEIGHT;
  @Input() suppressColumnVirtualisation = true;
  @Input() suppressRowVirtualisation = false;
  @Input() tableGridOptions: Partial<GridOptions> = {};
  @Input() suppressDragLeaveHidesColumns = true;
  @Input() removeColumnButtonEnabled = false;
  @Input() shouldAutoSizeColumns = true;

  @Input() enablePager = false;
  @Input() pagerConfig: PagerConfig = { ...PAGER_CONFIG_DEF };
  @Input() styleConfig: TableStyleConfig = {};
  @Input() emptyStateConfig: EmptyStateConfig;

  @Output() sortChanged: EventEmitter<SortChangedEvent> = new EventEmitter<
    SortChangedEvent
  >();
  @Output() rowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<
    RowClickedEvent
  >();
  @Output() selectionChanged: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() gridInit: EventEmitter<void> = new EventEmitter<void>();
  @Output() columnsChanged: EventEmitter<
    ColumnsChangedEvent
  > = new EventEmitter<ColumnsChangedEvent>();
  @Output() columnsOrderChanged: EventEmitter<
    ColumnsOrderChangedEvent
  > = new EventEmitter<ColumnsOrderChangedEvent>();
  @Output() cellClicked: EventEmitter<CellClickedEvent> = new EventEmitter<
    CellClickedEvent
  >();
  @Output() columnRemoved: EventEmitter<string> = new EventEmitter<string>();
  @Output() pagerPageSizeChange: EventEmitter<number> = new EventEmitter<
    number
  >();

  readonly tableType = TableType;

  public gridReady = false;
  public gridOptions: GridOptions;
  public gridColumnDefs: ColumnDef[];
  public pagerState: TablePagerState;

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

  ngOnInit(): void {
    this.setGridHeight(this.maxHeight);
    this.setGridOptions({
      ...this.initGridOptions(),
      ...this.tableGridOptions,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    let updateColumns = false;
    let previousColumnDefValue: ColumnDef[];

    if (hasChanges(changes, ['columnDefs'])) {
      updateColumns = true;
      this.columnDefConfig = {
        columnDef: changes.columnDefs.currentValue,
        orderStrategy: DEFAULT_COL_ORDER_STRATEGY,
      };
      previousColumnDefValue = changes.columnDefs.previousValue;
    }

    if (hasChanges(changes, ['columnDefConfig'])) {
      updateColumns = true;
      this.columnDefConfig = changes.columnDefConfig.currentValue;
      previousColumnDefValue = changes.columnDefConfig.previousValue?.columnDef;
    }

    if (updateColumns) {
      const existingColumns = previousColumnDefValue
        ? previousColumnDefValue
        : this.columnDefs;
      const columnDefs =
        this.columnDefConfig.orderStrategy === ColumnOrderStrategy.AppendNew
          ? this.tableUtilsService.getOrderedFields(
              existingColumns,
              this.columnDefConfig.columnDef,
              this.columns
            )
          : this.columnDefConfig.columnDef;
      this.gridColumnDefs = this.tableUtilsService.getGridColumnDef(
        columnDefs,
        this.rowSelection
      );
    }

    if (hasChanges(changes, ['maxHeight'])) {
      this.maxHeight = changes.maxHeight.currentValue;
      this.setGridHeight(this.maxHeight);
    }

    if (notFirstChanges(changes)) {
      this.cdr.detectChanges();
    }
  }

  onSortChanged($event: AgGridEvent): void {
    this.sortChanged.emit({
      colId: get($event.api.getSortModel(), '[0].colId'),
      sort: get($event.api.getSortModel(), '[0].sort'),
    });
  }

  onSelectionChanged($event: AgGridEvent): void {
    this.selectionChanged.emit($event.api.getSelectedRows());
  }

  onRowClicked($event: RowEvent): void {
    this.rowClicked.emit({
      rowIndex: $event.rowIndex,
      data: $event.data,
      agGridId: get($event, 'node.id', null),
    });
  }

  private setOrderedColumns(
    columns: Column[],
    eventName: TableEventName
  ): void {
    this.columns = map(columns, (col) => col.colDef.field);
    this.columnsOrderChanged.emit({ columns: this.columns.slice(), eventName });
  }

  private emitColumnsChangedEvent(columns: Column[]): void {
    this.columns = map(columns, (col) => col.colDef.field);
    this.columnsChanged.emit({ columns: this.columns.slice() });
  }

  private setGridHeight(height: number): void {
    this.DOM.setCssProps(this.elRef.nativeElement, {
      '--max-height': `${Math.max(
        height -
          (this.enablePager || this.tableGridOptions?.pagination
            ? TABLE_PAGER_HEIGHT
            : 0),
        TABLE_MIN_HEIGHT
      )}px`,
    });
  }

  public getOrderedColumnFields(): string[] {
    return this.columns;
  }

  public paginationPageSizeChange(pageSize: number) {
    this.pagerPageSizeChange.emit(pageSize);
    this.paginationSetPageSize(pageSize);
  }

  private initGridOptions(): GridOptions {
    return {
      suppressAutoSize: true,
      suppressRowClickSelection: true,
      suppressDragLeaveHidesColumns: this.suppressDragLeaveHidesColumns,
      autoSizePadding: TABLE_AUTOSIZE_PADDING,
      suppressColumnVirtualisation: this.suppressColumnVirtualisation,
      rowHeight: TABLE_ROW_HEIGHT,
      headerHeight: TABLE_ROW_HEIGHT,
      rowSelection: this.rowSelection,
      suppressContextMenu: true,
      rowBuffer: this.suppressRowVirtualisation
        ? 99999
        : this.enablePager
        ? 10
        : 20,
      animateRows: false,

      pagination: this.enablePager,
      paginationPageSize: this.pagerConfig.sliceSize,
      suppressPaginationPanel: true,

      getRowClass: (params) =>
        get(params.data, 'isClickable', false) ? 'row-clickable' : '',
      onGridReady: (event: GridReadyEvent) => {
        this.gridReady = true;
        this.gridApi = event.api || this.gridApi;
        if (this.shouldAutoSizeColumns) {
          event.columnApi.autoSizeAllColumns();
        }
        this.setOrderedColumns(
          event.columnApi.getAllGridColumns(),
          TableEventName.onGridReady
        );
        this.cdr.markForCheck();
        this.gridInit.emit();
      },
      onGridColumnsChanged: (event: GridColumnsChangedEvent) => {
        if (this.shouldAutoSizeColumns) {
          event.columnApi.autoSizeAllColumns();
        }
        this.setOrderedColumns(
          event.columnApi.getAllGridColumns(),
          TableEventName.onGridColumnsChanged
        );
        this.cdr.markForCheck();
        this.emitColumnsChangedEvent(event.columnApi.getAllGridColumns());
      },
      onDragStopped: (event: DragStoppedEvent): void => {
        this.setOrderedColumns(
          event.columnApi.getAllGridColumns(),
          TableEventName.onDragStopped
        );
      },
      onCellClicked: (event: CellClickedEvent) => {
        this.cellClicked.emit(event);
      },
      onModelUpdated: () => {
        const newPagerState = this.getPagerState();

        if (
          newPagerState.totalItems !== this.pagerState?.totalItems ||
          newPagerState.currentPage !== this.pagerState?.currentPage
        ) {
          this.pagerState = newPagerState;
          this.cdr.detectChanges();
        }
      },
      accentedSort: true,
    };
  }

  addClass(className: string) {
    this._externalClasses += ` ${className}`;
    this.cdr.detectChanges();
  }

  private getPagerState(): TablePagerState {
    return (
      (this.getApi() && {
        totalItems: this.getDisplayedRowCount(),
        currentPage: this.paginationGetCurrentPage(),
      }) || {
        totalItems: this.rowData?.length || 0,
        currentPage: 0,
      }
    );
  }
}
