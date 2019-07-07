import { ChipType, ChipListAlign } from './chips.enum';
import { InputEventType } from '../form-elements/form-elements.enum';

export interface Chip {
  text: string;
  id?: string | number;
  type?: ChipType;
  avatar?: string;
  removable?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

export interface ChipListConfig {
  type?: ChipType;
  removable?: boolean;
  selectable?: boolean;
  focusable?: boolean;
  disabled?: boolean;
  align?: ChipListAlign;
}

export interface ChipKeydownEvent {
  event: KeyboardEvent;
  chip: Chip;
}

export interface ChipInputChange {
  value: string[];
  added?: string;
  removed?: string;
  event?: InputEventType;
}
