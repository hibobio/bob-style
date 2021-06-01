import { Types } from '../../enums';
import { EELayoutConfig } from './ee-layout.interface';

export const EE_LAYOUT_CONFIG_BY_TYPE: Partial<
  Record<Types, EELayoutConfig>
> = {
  [Types.primary]: {
    contentClass: ['bg-white', 'brd', 'rounded', 'pad-x-32', 'pad-y-24'],
    contentHeaderClass: ['bg-white', 'brd', 'rounded', 'pad-x-32', 'pad-y-4'],
    contentHeaderStyle: {
      'min-height': '70px',
    },
    contentFooterClass: ['bg-white', 'brd', 'rounded', 'pad-x-32', 'pad-y-4'],
    contentFooterStyle: {
      'min-height': '70px',
    },
    wideSidebar: false,
  },
};
