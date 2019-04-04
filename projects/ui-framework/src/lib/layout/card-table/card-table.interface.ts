import { RenderedComponent } from '../../services/component-renderer/component-renderer.interface';

type cardTableAllowedTextCssProps = 'color' | 'fontSize' | 'fontWeight';

type cardTableAllowedCellCssProps =
  | 'maxWidth'
  | 'alignItems'
  | 'color'
  | 'fontSize'
  | 'fontWeight';

export type cardTableAllowedTextStyles = {
  [key in cardTableAllowedCellCssProps]?: string
};

export type cardTableAllowedCellStyles = {
  [key in cardTableAllowedTextCssProps]?: string
};

export type CardTableCellDataType = string | string[] | RenderedComponent;

export interface CardTableCellMeta {
  id?: string | number;
  name: string;
  width?: number;
  align?: string;
  textStyle?: cardTableAllowedTextStyles;
  sortablle?: boolean;
}

export interface CardTableCellData {
  data: CardTableCellDataType;
}

export interface CardTableMetaData extends Array<CardTableCellMeta> {}

export interface CardTableRowData extends Array<CardTableCellData> {}

export interface CardTableData extends Array<CardTableRowData> {}
