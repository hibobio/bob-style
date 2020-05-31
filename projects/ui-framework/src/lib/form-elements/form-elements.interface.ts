import { InputEventType, FormEvents } from './form-elements.enum';

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
