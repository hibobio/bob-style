import { InfoTooltip } from '../../popups/info-tooltip/info-tooltip.interface';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { NgClass } from '../../services/html/html-helpers.interface';
import { GenericObject } from '../../types';
import { LabelValueType, TextAlign } from './label-value.enum';

export interface LabelValue {
  type?: LabelValueType;
  label?: string | number;
  value?: string | number;
  textAlign?: TextAlign;
  labelMaxLines?: number;
  valueMaxLines?: number;

  labelDescription?: InfoTooltip;
  valueDescription?: InfoTooltip;

  labelClass?: string | string[] | NgClass;
  labelStyle?: GenericObject<string>;
  valueClass?: string | string[] | NgClass;
  valueStyle?: GenericObject<string>;

  tooltipType?: TruncateTooltipType;
  expectChanges?: boolean;
  swap?: boolean;

  valueClicked?: (e: MouseEvent | KeyboardEvent) => void;
  labelClicked?: (e: MouseEvent | KeyboardEvent) => void;
  iconClicked?: (e: MouseEvent | KeyboardEvent) => void;
}
