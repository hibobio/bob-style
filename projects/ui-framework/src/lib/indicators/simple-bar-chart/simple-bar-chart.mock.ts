import { SimpleBarChartItem } from './simple-bar-chart.interface';
import { randomNumber, makeArray } from '../../services/utils/functional-utils';
import { ColorService } from '../../services/color-service/color.service';
import { mockHobbies } from '../../mock.const';

export const simpleBarChartMockData: SimpleBarChartItem[] = [
  {
    value: randomNumber(10, 80),
    count: randomNumber(1, 15),
    color: ColorService.prototype.randomColor(),
    text: 'Strongly disagree'
  },
  {
    value: randomNumber(10, 80),
    count: randomNumber(1, 15),
    color: ColorService.prototype.randomColor(),
    text: 'Disagree'
  },
  {
    value: randomNumber(10, 80),
    count: randomNumber(1, 15),
    color: ColorService.prototype.randomColor(),
    text: 'Neither agree nor disagree'
  },
  {
    value: randomNumber(10, 80),
    count: randomNumber(1, 15),
    color: ColorService.prototype.randomColor(),
    text: 'Agree'
  },
  {
    value: randomNumber(10, 80),
    count: randomNumber(1, 15),
    color: ColorService.prototype.randomColor(),
    text: 'Strongly agree'
  }
];

export const simpleBarChartMockData2: SimpleBarChartItem[] = makeArray(5).map(i => ({
  value: randomNumber(15, 80),
  count: randomNumber(4, 15),
  color: ColorService.prototype.randomColor(),
  text: mockHobbies(1)
}));
