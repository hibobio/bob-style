import { Types } from '../../enums';
import { EELayoutConfig } from './ee-layout.interface';

export const EE_LAYOUT_CONFIG_BY_TYPE: Partial<Record<
  Types,
  EELayoutConfig
>> = {
  [Types.primary]: {
    sectionClass: ['bg-white', 'brd', 'rounded', 'pad-x-32', 'pad-y-24'],
  },
};
