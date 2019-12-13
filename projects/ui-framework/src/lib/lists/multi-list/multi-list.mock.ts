import { SelectGroupOption } from '../list.interface';
import {
  selectSome,
  optionsMock as SingleListPptionsMock,
} from '../single-list/single-list.mock';

export const optionsMock: SelectGroupOption[] = selectSome(
  SingleListPptionsMock
);

export const optionsMockDef: SelectGroupOption[] = selectSome(
  SingleListPptionsMock
);
