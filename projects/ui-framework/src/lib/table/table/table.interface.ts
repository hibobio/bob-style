export enum SortDirections {
  Asc = 'asc',
  Desc = 'desc'
}
export enum RowSelection {
  Multiple = 'multiple',
  Single = 'single',
}
export enum PinDirection {
  Left = 'left',
  Right = 'right',
}
export interface ColumnDef {
  headerName: string;
  field: string;
  sortable?: true;
  checkboxSelection?: boolean;
  resizable?: boolean;
  pinned?: PinDirection;
  cellRendererFramework?: any;
  sort?: SortDirections;
  width?: number;
  maxWidth?: number;
  minWidth?: number;
  comparator?: Function;
  lockPosition?: boolean;
}
