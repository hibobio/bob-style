import {
  ProgressBar,
  ProgressDonut,
} from '../../indicators/progress/progress.interface';
import { NgClass } from '../../services/html/html-helpers.interface';
import { GenericObject } from '../../types';
import { LabelValue } from '../../typography/label-value/label-value.interface';
import { SummaryInsightType } from './summary-insights.enum';

export interface SummaryInsight<
  T extends SummaryInsightType = SummaryInsightType,
  D = T extends SummaryInsightType.progressBar
    ? ProgressBar
    : T extends SummaryInsightType.progressDonut
    ? ProgressDonut
    : T extends SummaryInsightType.labelValue
    ? LabelValue
    : GenericObject,
  E = { tooltip?: string }
> {
  type: T;
  data: D & E;
  class?: string | string[] | NgClass;
  style?: GenericObject<string>;
}
