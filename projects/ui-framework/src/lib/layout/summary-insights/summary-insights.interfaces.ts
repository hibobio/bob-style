import { LabelValue, ProgressBar, ProgressDonut } from 'bob-style';
import { SummaryInsightType } from './summary-insights.enums';

export interface SummaryInsight {
  type: SummaryInsightType,
  label?: LabelValue,
  data?: (ProgressBar | ProgressDonut)
}
