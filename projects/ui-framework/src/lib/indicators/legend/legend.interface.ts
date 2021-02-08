import { Types } from '../../enums';
import { NgClass } from '../../services/html/html-helpers.interface';
import { Color, GenericObject } from '../../types';

export interface LegendData {
  text: string;
  value?: string | number;
  color?: Color;

  [key: string]: any;
}

export interface LegendConfig {
  type?: Types;
  layout?: 'flex' | 'grid';
  flow?: 'row' | 'column';
  columns?: number;
  maxHeight?: number;
  rowGap?: number;
  listClass?: string | string[] | NgClass;
  cellClass?: string | string[] | NgClass;
  listStyle?: GenericObject<string>;
  cellStyle?: GenericObject<string>;
  sortByValue?: 'asc' | 'desc' | boolean;

  valueTextColor?: Color;
  [key: string]: any;
}
