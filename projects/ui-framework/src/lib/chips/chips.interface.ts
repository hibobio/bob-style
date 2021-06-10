import { InputEventType } from '../form-elements/form-elements.enum';
import { Icons } from '../icons/icons.enum';
import { NgClass } from '../services/html/html-helpers.interface';
import { Color, DOMKeyboardEvent } from '../types';
import { ChipListAlign, ChipListSelectable, ChipType } from './chips.enum';

export interface Chip {
  text: string;
  textStrong?: string;
  id?: string | number;
  type?: ChipType;
  imageSource?: string;
  removable?: boolean;
  disabled?: boolean;
  selected?: boolean;
  icon?: Icons;
  class?: string | string[] | NgClass;
  color?: Color;
  [key: string]: any;
}

export interface ChipListConfig {
  type?: ChipType;
  removable?: boolean;
  selectable?: boolean | ChipListSelectable;
  focusable?: boolean;
  disabled?: boolean;
  align?: ChipListAlign;
}

export interface ChipKeydownEvent {
  event: DOMKeyboardEvent;
  chip: Chip;
}

export interface ChipInputChange {
  value: string[];
  added?: string;
  removed?: string;
  event?: InputEventType;
}
