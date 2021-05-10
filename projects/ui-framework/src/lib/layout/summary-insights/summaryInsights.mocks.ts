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
  label: 27,
  textAlign: TextAlign.left,
  tooltipType: TruncateTooltipType.material,
  expectChanges: true,
  labelDescription: { text: 'labelDescription text' },
};


export const labelValueDataMock2: LabelValue = {
  type: LabelValueType.six,
  value: 'label long la ',
  tooltipType: TruncateTooltipType.material,
  expectChanges: true,
  labelDescription: { text: 'labelDescription text' },
};


export const progressBarDataMock: ProgressBar = {
  data: { value: 20 },
  config: {},
  type: ProgressType.primary,
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
    label: labelValueDataMock
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
    label: labelValueDataMock2,
  },
];
