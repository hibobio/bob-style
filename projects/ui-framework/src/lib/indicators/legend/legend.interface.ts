import { Types } from '../../enums';
import { Color } from '../../types';

export interface LegendData {
  text: string;
  value?: string | number;
  color?: Color;
}

export interface LegendConfig {
  type?: Types;
  columns?: number;
}
