import {
  LabelValue,
  LabelValueType,
  ProgressBar,
  ProgressDonut,
  ProgressDonutData,
  ProgressSize,
  ProgressType,
  TextAlign,
  TruncateTooltipType,
} from 'bob-style';
import { SummaryInsightType } from './summary-insights.enums';
import { SummaryInsight } from './summary-insights.interfaces';

export const labelValueDataMock: LabelValue = {
  type: LabelValueType.six,
  value: 'label',
  label: '23%',
  textAlign: TextAlign.left,
};


export const labelValueDataMock2: LabelValue = {
  type: LabelValueType.six,
  textAlign: TextAlign.left,
  value: 'label too',
};


export const progressBarDataMock: ProgressBar = {
  data: { value: 20 },
  config: { reverseTextLocation: true },
  type: ProgressType.secondary,
  size: ProgressSize.small,
};

export const progressDonutDataMock: ProgressDonutData = {
  value: 20,
};


export const progressDonutMock: ProgressDonut = {
  data: progressDonutDataMock,
  config: {
    hideValue: true,
  },
};

export const summaryInsightsDataMock: SummaryInsight[] = [
  {
    type: SummaryInsightType.labelValue,
    label: labelValueDataMock,
  },
  {
    type: SummaryInsightType.progressDonutWithLabelValue,
    data: progressDonutMock,
    label: labelValueDataMock,
  },
  {
    type: SummaryInsightType.progressDonutWithLabelValue,
    data: progressDonutMock,
    label: labelValueDataMock2,
  },
  {
    type: SummaryInsightType.progressBar,
    data: progressBarDataMock,
    label: { value: 'im a string | num val' },
  },
];
