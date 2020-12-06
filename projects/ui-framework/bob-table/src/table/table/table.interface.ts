import {
  ColumnOrderStrategy, TableEventName,
  PinDirection,
  SortDirections,
} from './table.enum';
import { IconColor, Icons } from 'bob-style';

export interface ColumnDef {
  headerName: string;
  headerClass?: string;
  field: string;
  sortable?: boolean;
  resizable?: boolean;
  pinned?: PinDirection;
  cellRendererFramework?: any;
  sort?: SortDirections;
  width?: number;
  maxWidth?: number;
  minWidth?: number;
  comparator?: Function;
  lockPosition?: boolean;
  headerCheckboxSelection?: boolean | Function;
  menuTabs?: string[];
  icon?: Icons;
  iconColor?: IconColor;
  cellClass?: (Icons | string)[];
  cellStyle?: any;
  getQuickFilterText?: Function;
  flex?: number;
  colSpan?: Function;
  autoHeight?: boolean;
  [key: string]: any;
}

export interface RowClickedEvent {
  rowIndex: number;
  data: object;
  agGridId: string;
}

export interface BRowDragEvent {
  nodeData: any;
  overNodeData: any;
  newRowData: any[];
}

export interface SortChangedEvent {
  colId: string;
  sort: string;
}

export interface RowNodeDef {
  rowIndex: number;
  data: any;
}

export interface ColumnsChangedEvent {
  columns: string[];
}

export interface ColumnsOrderChangedEvent extends ColumnsChangedEvent {
  eventName?: TableEventName;
}

export interface TableStyleConfig {
  disableRowHoverBgColor?: boolean;
  showColumnBorders?: boolean;
}

export interface ColumnDefConfig {
  columnDef: ColumnDef[];
  orderStrategy: ColumnOrderStrategy;
}

export interface TablePagerState {
  totalItems: number;
  currentPage: number;
}
