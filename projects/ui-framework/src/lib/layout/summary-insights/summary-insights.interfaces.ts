import { LabelValue, ProgressBar, ProgressDonut } from 'bob-style';
import { SummaryInsightType } from './summary-insights.enums';

export interface SummaryInsight {
  type: SummaryInsightType,
  data?: (ProgressBar | ProgressDonut | LabelValue)
}
