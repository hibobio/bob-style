import { mockThings, mockTime } from '../../mock.const';
import { ColorPalette } from '../../services/color-service/color-palette.enum';
import {
  makeArray,
  randomFromArray,
  randomNumber,
} from '../../services/utils/functional-utils';
import { LabelValueType } from '../../typography/label-value/label-value.enum';
import { SummaryInsightType } from './summary-insights.enum';

const colors = randomFromArray(
  Object.keys(ColorPalette)
    .filter((c) => !c.includes('light'))
    .map((c) => ColorPalette[c]),
  null
);
const things = mockThings();
const values = makeArray(20).map((i) => randomNumber(20, 80));
let idx = -1;

export const summaryInsightsDataMock = [
  {
    type: SummaryInsightType.labelValue,
    data: {
      value: values[++idx] + '%',
      label: things[idx],
    },
  },
  {
    type: SummaryInsightType.progressDonut,
    data: {
      data: {
        value: values[++idx],
        headerTextPrimary: values[idx] + '%',
        headerTextSecondary: things[idx],
        color: colors[idx],
      },
    },
  },
  {
    type: SummaryInsightType.progressDonut,
    data: {
      data: {
        value: values[++idx],
        headerTextPrimary: values[idx] + '%',
        headerTextSecondary: things[idx],
        color: colors[idx],
      },
    },
  },
  // {
  //   type: SummaryInsightType.progressBar,
  //   data: {
  //     data: {
  //       value: values[++idx],
  //       headerTextPrimary: things[idx],
  //       color: colors[idx],
  //     },
  //   },
  // },
  {
    type: SummaryInsightType.custom,
    data: {
      name: 'donut-chart',
      donutSize: 'medium',
      text: '?',
      labelValue: {
        label: 'Fruit',
        value: '10',
      },
      data: [
        ['Apples', 8],
        ['Oranges', 1],
        ['Bananas', 3],
      ],
    },
  },
];

export const summaryInsightsDataMock2 = makeArray(6).map((_, i) => ({
  type: SummaryInsightType.labelValue,
  data: {
    label: mockTime(),
    value: things[++idx],
    type: LabelValueType.six,
    labelStyle: {
      fontWeight: 600,
    },
    valueDescription: i === 0 && {
      useContentTemplate: true,
      title: 'Custom info-tooltip template',
      text: `Data is the value of valueDescription property (make sure it includes useContentTemplate:true).
        To use contentTemplate directive, import ContentTemplateModule.
        See Notes tab for full example.`,
    },
    labelDescription: i === 1 && {
      useContentTemplate: true,
      title: 'Custom info-tooltip template',
      text: `Data is the value of labelDescription property (make sure it includes useContentTemplate:true).
        To use contentTemplate directive, import ContentTemplateModule.
        See Notes tab for full example.`,
    },
  },
}));
