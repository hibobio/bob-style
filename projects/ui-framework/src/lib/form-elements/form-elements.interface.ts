import { InputEventType, FormEvents } from './form-elements.enum';

export interface TransmitOptions {
  eventType: InputEventType[];
  emitterName?: FormEvents;
  doPropagate?: boolean;
  addToEventObj?: { [key: string]: any };
  updateValue?: boolean;
}
