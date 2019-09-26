import { PinDirection, SortDirections } from './table.enum';
import { IconColor, Icons } from 'bob-style';

export interface ColumnDef {
  headerName: string;
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
}

export interface RowClickedEvent {
  rowIndex: number;
  data: object;
  agGridId: string;
}

export interface SortChangedEvent {
  colId: string;
  sort: string;
}

export interface RowNodeDef {
  rowIndex: number;
  data: any;
}
