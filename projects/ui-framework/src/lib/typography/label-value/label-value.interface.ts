import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { LabelValueType, TextAlign } from './label-value.enum';
import { InfoTooltip } from '../../popups/info-tooltip/info-tooltip.interface';

export interface LabelValue {
  type?: LabelValueType;
  label?: string | number;
  value?: string | number;
  textAlign?: TextAlign;
  labelMaxLines?: number;
  valueMaxLines?: number;
  tooltipType?: TruncateTooltipType;
  expectChanges?: boolean;
  swap?: boolean;
  labelDescription?: InfoTooltip;
}
