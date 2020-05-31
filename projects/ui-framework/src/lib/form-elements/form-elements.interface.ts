import { InputEventType, FormEvents } from './form-elements.enum';
import { type } from 'os';

export interface TransmitOptions {
  eventType: InputEventType[];
  emitterName?: FormEvents;
  doPropagate?: boolean;
  addToEventObj?: { [key: string]: any };
  eventObjValueKey?: string;
  eventObjOmitEventType?: boolean;
  updateValue?: boolean;
}

export type ForceElementValue = any | ((v: any) => any);
