import { Chip } from '../chips.interface';

export interface MlacChip extends Chip {
  group?: {
    index: number;
    key: string;
    name: string;
  };
  class?: string;
}
