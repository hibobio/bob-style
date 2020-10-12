import { ChainSelectEventEnum } from './chain-select.enum';

export interface ChainSelectEvent {
  event: ChainSelectEventEnum | any;
  index: number;
}
