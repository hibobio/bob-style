import { SelectGroupOption } from '../list.interface';
import {
  selectSome,
  optionsMock as SingleListOptionsMock,
} from '../single-list/single-list.mock';

export const optionsMock: SelectGroupOption[] = selectSome(
  SingleListOptionsMock
);

export const optionsMockDef: SelectGroupOption[] = selectSome(
  SingleListOptionsMock
);
