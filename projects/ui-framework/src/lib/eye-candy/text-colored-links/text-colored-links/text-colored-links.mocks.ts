import {ColorTextItem} from '../text-colored-links.interface';

export const actionMock = (item) => console.log(item);

export const COLOR_TEXT_ITEMS: ColorTextItem[] = [
  { label: '45% of our people are female', action: actionMock},
  { label: '55% are male', action: actionMock},
  { label: '24% are parents', action: actionMock},
  { label: '21% are in London', action: actionMock},
  { label: '26% play football', action: actionMock},
  { label: '24% like film', action: actionMock},
  { label: '21% like cycling', action: actionMock},
  { label: '19% practice yoga', action: actionMock},
  { label: '17% like cooking', action: actionMock},
  { label: '17% like pilates', action: actionMock},
]
