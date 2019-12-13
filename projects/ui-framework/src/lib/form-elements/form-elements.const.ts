import { FormEvents } from './form-elements.enum';
import { InputEventType } from './form-elements.enum';
import { TransmitOptions } from './form-elements.interface';

export const TRANSMIT_OPTIONS_DEF: Partial<TransmitOptions> = {
  eventType: [InputEventType.onChange],
  emitterName: FormEvents.changed,
  doPropagate: true,
  addToEventObj: {},
  updateValue: false,
};
export const IGNORE_EVENTS_DEF: InputEventType[] = [
  InputEventType.onWrite,
  InputEventType.onFocus,
  InputEventType.onKey,
];
