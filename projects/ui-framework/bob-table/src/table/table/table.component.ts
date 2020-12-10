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
  RowDragEvent,
  FirstDataRenderedEvent,
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
  BRowDragEvent,
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
  applyChanges,
  DOMhelpers,
  EmptyStateConfig,
  hasChanges,
  Icons,
  IconSize,
  isString,
  notFirstChanges,
  PagerConfig,
  PAGER_CONFIG_DEF,
  log,
  isValuevy,
} from 'bob-style';
import {
  TABLE_AUTOSIZE_PADDING,
  TABLE_MIN_HEIGHT,
  TABLE_PAGER_HEIGHT,
  TABLE_ROW_HEIGHT,
} from './table.consts';
import { TranslateService } from '@ngx-translate/core';

const CLOSE_BUTTON_DIAMETER = 20;
const CLOSE_MARGIN_OFFSET = 6;
const DEFAULT_COL_ORDER_STRATEGY = ColumnOrderStrategy.AppendNew;

const DEFAULT_PROP_VALUES = {
  type: TableType.Primary,
  maxHeight: TABLE_MIN_HEIGHT,
  suppressColumnVirtualisation: true,
  suppressDragLeaveHidesColumns: true,
  shouldAutoSizeColumns: true,
  tableGridOptions: {},
  pagerConfig: { ...PAGER_CONFIG_DEF },
  styleConfig: {},
};

@Component({
  selector: 'b-table',
  templateUrl: './table.component.html',
  styleUrls: [
    './styles/table.component.scss',
    './styles/table-checkbox.scss',
    './styles/table-dnd.scss',
    './styles/tree-table.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent extends AgGridWrapper implements OnInit, OnChanges {
  constructor(
    private tableUtilsService: TableUtilsService,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private DOM: DOMhelpers,
    private translate: TranslateService
  ) {
    super();
    this.emptyStateConfig = {
      text: this.translate.instant('bob-style.table.empty-state-default'),
      icon: Icons.table,
      iconSize: IconSize.xLarge,
    };
  }

  /**
   * @internal - use "addClass"
   */
  public _externalClasses = '';

  @ViewChild('agGrid', { static: true }) agGrid: AgGridAngular;

  @HostBinding('attr.data-type') @Input() type: TableType =
    DEFAULT_PROP_VALUES.type;

  @Input() rowData: any[];
  @Input() columnDefs: ColumnDef[];
  @Input() columnDefConfig: ColumnDefConfig;

  @Input() rowSelection: RowSelection = null;
  @Input() maxHeight: number | string = DEFAULT_PROP_VALUES.maxHeight;
  @Input() suppressColumnVirtualisation =
    DEFAULT_PROP_VALUES.suppressColumnVirtualisation;
  @Input() suppressRowVirtualisation = false;
  @Input() tableGridOptions: Partial<GridOptions> =
    DEFAULT_PROP_VALUES.tableGridOptions;
  @Input() suppressDragLeaveHidesColumns =
    DEFAULT_PROP_VALUES.suppressDragLeaveHidesColumns;
  @Input() removeColumnButtonEnabled = false;
  @Input() shouldAutoSizeColumns = DEFAULT_PROP_VALUES.shouldAutoSizeColumns;
  @Input() enableRowDrag = false;

  @Input() enablePager = false;
  @Input() pagerConfig: PagerConfig = DEFAULT_PROP_VALUES.pagerConfig;
  @Input() styleConfig: TableStyleConfig = DEFAULT_PROP_VALUES.styleConfig;

  @Input('emptyStateConfig') set setEmptyStateConfig(config: EmptyStateConfig) {
    this.emptyStateConfig = { ...this.emptyStateConfig, ...config };
  }

  public emptyStateConfig: EmptyStateConfig;

  @Output() sortChanged: EventEmitter<SortChangedEvent> = new EventEmitter<
    SortChangedEvent
  >();
  @Output() rowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<
    RowClickedEvent
  >();
  @Output() rowDragEnd: EventEmitter<BRowDragEvent> = new EventEmitter<
    BRowDragEvent
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
  public firstDataRendered = false;

  public gridOptions: GridOptions;
  public gridColumnDefs: ColumnDef[];
  public pagerState: TablePagerState;
  public rowIsDragged = false;

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
    applyChanges(this, changes, DEFAULT_PROP_VALUES);

    let previousColumnDefValue: ColumnDef[];

    if (hasChanges(changes, ['columnDefs'], true)) {
      this.columnDefConfig = {
        columnDef: this.columnDefs,
        orderStrategy: DEFAULT_COL_ORDER_STRATEGY,
      };
      previousColumnDefValue = changes.columnDefs.previousValue;
    }

    if (hasChanges(changes, ['columnDefConfig'], true)) {
      previousColumnDefValue = changes.columnDefConfig.previousValue?.columnDef;
    }

    if (
      hasChanges(
        changes,
        ['columnDefs', 'columnDefConfig', 'enableRowDrag'],
        true,
        { truthyCheck: isValuevy }
      )
    ) {
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

      if (this.enableRowDrag && columnDefs.find(colDef => colDef.sortable || colDef.sort)) {
        log.wrn(['Sorting disabled, because row drag is enabled'], 'TableComponent');
      }

      this.gridColumnDefs = this.tableUtilsService.getGridColumnDef(
        columnDefs,
        this.rowSelection,
        this.enableRowDrag
      );
    }

    if (hasChanges(changes, ['columnDefs', 'columnDefConfig', 'rowData'])) {
      this.setPreloadingClass();
    }

    if (notFirstChanges(changes, ['maxHeight'])) {
      this.setGridHeight(this.maxHeight);
    }

    if (notFirstChanges(changes) && !this.cdr['destroyed']) {
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

  onRowClicked($event: RowEvent) {
    this.rowClicked.emit({
      rowIndex: $event.rowIndex,
      data: $event.data,
      agGridId: get($event, 'node.id', null),
    });
  }

  onRowDragEnd(event: RowDragEvent) {
    const movingNode = event.node;
    const overNode = event.overNode;
    const rowNeedsToMove = movingNode.id !== overNode.id;

    if (rowNeedsToMove) {
      const gridApi = this.getGridApi();
      const movingData = movingNode.data;
      const overData = overNode.data;
      const fromIndex = this.rowData.indexOf(movingData);
      const toIndex = this.rowData.indexOf(overData);
      const newRowData = [...this.rowData];
      newRowData.splice(fromIndex, 1);
      newRowData.splice(toIndex, 0, movingData);
      this.rowData = newRowData;
      gridApi.updateRowData({
        remove: [movingData],
      });
      gridApi.updateRowData({
        add: [movingData],
        addIndex: toIndex,
      });
      gridApi.clearFocusedCell();
    }

    this.rowDragEnd.emit({
      nodeData: event.node.data,
      overNodeData: event.overNode.data,
      newRowData: [...this.rowData],
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
      suppressPropertyNamesCheck: true,

      scrollbarWidth: 7,

      pagination: this.enablePager,
      paginationPageSize: this.pagerConfig.sliceSize,
      suppressPaginationPanel: true,

      getRowClass: (params) =>
        get(params.data, 'isClickable', false) ? 'row-clickable' : '',
      onGridReady: (event: GridReadyEvent) => {
        this.gridReady = true;
        this.gridApi = event.api || this.gridApi;
        this.columnApi = event.columnApi || this.columnApi;

        this.setPreloadingClass();

        this.setOrderedColumns(
          event.columnApi.getAllGridColumns(),
          TableEventName.onGridReady
        );
        this.gridInit.emit();
      },
      onFirstDataRendered: (event: FirstDataRenderedEvent) => {
        this.firstDataRendered = true;
        if (this.shouldAutoSizeColumns !== false) {
          event.columnApi.autoSizeAllColumns();
        }
        this.cdr.detectChanges();
      },
      onGridColumnsChanged: (event: GridColumnsChangedEvent) => {
        if (this.shouldAutoSizeColumns !== false) {
          event.columnApi.autoSizeAllColumns();
        }
        this.setOrderedColumns(
          event.columnApi.getAllGridColumns(),
          TableEventName.onGridColumnsChanged
        );
        this.cdr.detectChanges();
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

  private setGridHeight(height: number | string): void {
    let heightValue: string;

    const heightMod =
      this.enablePager || this.tableGridOptions?.pagination
        ? TABLE_PAGER_HEIGHT
        : 0;

    if (isString(height) && height.startsWith('--')) {
      heightValue = heightMod
        ? `calc(var(${height}, ${
            TABLE_MIN_HEIGHT + TABLE_PAGER_HEIGHT
          }px) - ${heightMod}px)`
        : `var(${height},${TABLE_MIN_HEIGHT}px)`;
    } else {
      heightValue = `${Math.max(
        (parseInt(height as string, 10) || 0) - heightMod,
        TABLE_MIN_HEIGHT
      )}px`;
    }

    this.DOM.setCssProps(this.elRef.nativeElement, {
      '--max-height': heightValue,
    });
  }

  private setPreloadingClass(): void {
    this.DOM.bindClasses(this.elRef.nativeElement, {
      preloading: this.isPreloading(),
    });
  }

  addClass(className: string) {
    this._externalClasses += ` ${className}`;
    this.cdr.detectChanges();
  }

  isPreloading(): boolean {
    return (
      !this.gridReady ||
      !this.gridColumnDefs?.length ||
      this.rowData === undefined
    );
  }

  isEmpty(): boolean {
    return (
      (this.rowData !== undefined && !this.rowData?.length) ||
      (this.pagerState && !this.pagerState.totalItems)
    );
  }

  private getPagerState(): TablePagerState {
    return (
      (this.getGridApi() && {
        totalItems: this.getDisplayedRowCount(),
        currentPage: this.paginationGetCurrentPage(),
      }) || {
        totalItems: this.rowData?.length || 0,
        currentPage: 0,
      }
    );
  }
}
