import { Chip } from '../../chips/chips.interface';

export interface MlacChip extends Chip {
  group?: {
    index: number;
    key: string;
    name: string;
  };
  class?: string;
}
