import { PinDirection } from './table.enum';

export const SELECTION_COLUMN_DEF = {
  headerName: '',
  field: 'selection',
  checkboxSelection: true,
  pinned: PinDirection.Left,
  lockPosition: true,
  width: 46,
  cellClass: 'row-select',
};

export const TABLE_PAGER_HEIGHT = 52;
export const TABLE_ROW_HEIGHT = 56;
export const TABLE_MIN_HEIGHT = TABLE_ROW_HEIGHT * 6;
export const TABLE_AUTOSIZE_PADDING = 30;
