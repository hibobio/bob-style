import { mockThings } from '../../mock.const';
import { ColorPalette } from '../../services/color-service/color-palette.enum';
import {
  makeArray,
  randomFromArray,
  randomNumber,
} from '../../services/utils/functional-utils';
import { SummaryInsightType } from './summary-insights.enums';
import { SummaryInsight } from './summary-insights.interfaces';

const colors = randomFromArray(
  Object.keys(ColorPalette)
    .filter((c) => !c.includes('light'))
    .map((c) => ColorPalette[c]),
  null
);
const things = mockThings();
const values = makeArray(20).map((i) => randomNumber(20, 80));
let idx = -1;

export const summaryInsightsDataMock: SummaryInsight[] = [
  {
    type: SummaryInsightType.labelValue,
    data: {
      value: things[++idx],
      label: values[idx] + '%',
      labelStyle: { fontWeight: '600', lineHeight: '1' },
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
        headerTextSecondary: things[idx],
        color: colors[idx],
      },
    },
  },
  {
    type: SummaryInsightType.progressBar,
    data: {
      data: {
        value: values[++idx],
        headerTextPrimary: things[idx],
        color: colors[idx],
      },
    },
  },
];
