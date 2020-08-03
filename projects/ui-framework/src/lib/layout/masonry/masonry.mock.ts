import { makeArray, randomNumber } from '../../services/utils/functional-utils';
import { mockText } from '../../mock.const';

export const masonryCardsMock = () =>
  makeArray(33).map((_, index) => ({
    title: index + 1 + ' / ' + mockText(randomNumber(1, 3)),
    text: mockText(randomNumber(20, 100)) + '#',
  }));
