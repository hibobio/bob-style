import { IconColor, IconSize } from '../../icons/icons.enum';
import { LinkColor } from '../../indicators/link/link.enum';
import { mockHobbies, mockText, mockThings, mockTime } from '../../mock.const';
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

export const summaryInsightsDataMock2 = makeArray(6).map((_, i) => ({
  type: SummaryInsightType.labelValue,
  data: {
    label: mockTime(),
    value: things[++idx],
    type: LabelValueType.six,
    labelStyle: {
      fontWeight: 600,
    },
    valueDescription: i < 2 && {
      title: mockHobbies(1),
      text: mockText(10),
      iconSize: IconSize.small,
      iconColor: IconColor.normal,
      link: { text: mockThings(1), color: LinkColor.primary },
    },
  },
}));
