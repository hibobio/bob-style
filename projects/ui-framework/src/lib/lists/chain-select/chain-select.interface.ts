import { ChainSelectEventEnum } from './chain-select.enum';

type ChainSelectEventType = ChainSelectEventEnum | Object;

export interface ChainSelectEvent {
  event: ChainSelectEventType
  index: number,
}
