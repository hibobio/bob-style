import { RenderedComponent } from '../../services/component-renderer/component-renderer.interface';

type cardTableAllowedTextCssProps = 'color' | 'fontSize' | 'fontWeight';

type cardTableAllowedCellCssProps =
  | 'maxWidth'
  | 'alignItems'
  | 'color'
  | 'fontSize'
  | 'fontWeight';

export type cardTableAllowedTextStyles = {
  [key in cardTableAllowedTextCssProps]?: string
};

export type cardTableAllowedCellStyles = {
  [key in cardTableAllowedCellCssProps]?: string
};

export type CardTableCellDataType = string | string[] | RenderedComponent;

export interface CardTableCellMeta {
  id?: string | number;
  name: string;
  width?: number;
  align?: string;
  textStyle?: cardTableAllowedTextStyles;
  sortable?: boolean;
}

export interface CardTableCellData {
  data?: CardTableCellDataType;
  class?: string | string[];
}

export interface CardTableCellClickEvent {
  rowIndex: number;
  cellIndex: number;
  cell: CardTableCellData;
}
export interface CardTableRowClickEvent {
  rowIndex: number;
  row: CardTableCellData[];
}
export interface CardTableRowOrderChangeEvent {
  previousIndex: number;
  currentIndex: number;
}
