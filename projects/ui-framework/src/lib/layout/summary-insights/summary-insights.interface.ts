import {
  ProgressBar,
  ProgressDonut,
} from '../../indicators/progress/progress.interface';
import { LabelValue } from '../../typography/label-value/label-value.interface';
import { SummaryInsightType } from './summary-insights.enum';

export interface SummaryInsight {
  type: SummaryInsightType;
  data: ProgressBar | ProgressDonut | LabelValue;
}
