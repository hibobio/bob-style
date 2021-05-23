import {
  LabelValue,
  LabelValueType,
  ProgressBar,
  ProgressDonut,
  ProgressDonutData,
  ProgressSize,
  ProgressType,
  TextAlign,
} from 'bob-style';
import { SummaryInsightType } from './summary-insights.enums';
import { SummaryInsight } from './summary-insights.interfaces';

export const labelValueDataMock: LabelValue = {
  type: LabelValueType.six,
  value: 'label',
  label: '23%',
  textAlign: TextAlign.left,
};

export const progressBarDataMock: ProgressBar = {
  data: { value: 20, headerTextPrimary: 'headerTextPrimary' },
  config: { reverseTextLocation: true },
  type: ProgressType.secondary,
  size: ProgressSize.small,
};

export const progressDonutDataMock: ProgressDonutData = {
  value: 20,
  headerTextSecondary: 'lable ',
  color: '#926296',
};

export const progressDonutDataMock2: ProgressDonutData = {
  value: 20,
  headerTextSecondary: 'headerTextSecondary',
  color: '#926296',
};

export const progressDonutMock: ProgressDonut = {
  data: progressDonutDataMock,
  config: {
    hideValue: true,
    showValueInCenter: false,
  },
};


export const progressDonutMock2: ProgressDonut = {
  data: progressDonutDataMock2,
  config: {
    hideValue: false,
    showValueInCenter: false,
  },
};

export const summaryInsightsDataMock: SummaryInsight[] = [
  {
    type: SummaryInsightType.labelValue,
    data: labelValueDataMock,
  },
  {
    type: SummaryInsightType.progressDonut,
    data: progressDonutMock,
  },
  {
    type: SummaryInsightType.progressDonut,
    data: progressDonutMock2,
  },
  {
    type: SummaryInsightType.progressBar,
    data: progressBarDataMock,
  },
];
