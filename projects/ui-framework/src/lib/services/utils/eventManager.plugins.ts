import { Injectable } from '@angular/core';
import { EventManager, EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { NativeEvents } from '../../enums';

export enum EventModifiers {
  outsideZone = 'outside-zone',
}
export enum GlobalEventModifiers {
  window = 'window',
  document = 'document',
  body = 'body',
}

const allowedNativeEvents = Object.values(NativeEvents);
const globalElems = Object.values(GlobalEventModifiers);

const splitToArray = (name: string, test = /[^\w-]+/): string[] => {
  return name.split(test).filter(Boolean);
};

const getEventsArray = (eventName: string): string[] =>
  splitToArray(eventName, /[^\w-.]+/).filter(
    (name) => !globalElems.includes(name as GlobalEventModifiers)
  );

const getNativeEventsArray = (eventName: string): string[] =>
  splitToArray(eventName).filter((name) =>
    allowedNativeEvents.includes(name as NativeEvents)
  );

const getNativeEventName = (eventName: string): string => {
  return getNativeEventsArray(eventName)[0];
};

const getDocElement = (selector: string): EventTarget => {
  switch (selector) {
    case GlobalEventModifiers.window:
      return window as Window;
    case GlobalEventModifiers.document:
      return document as Document;
    case GlobalEventModifiers.body:
      return document.body as HTMLElement;
    default:
      throw new Error(`Element selector [${selector}] not supported.`);
  }
};

@Injectable({
  providedIn: 'root',
})
export class OutsideZonePlugin {
  manager: EventManager;

  supports(eventName: string): boolean {
    const splitName = eventName.split('.');

    return (
      splitName.length === 2 &&
      splitName[1] === EventModifiers.outsideZone &&
      allowedNativeEvents.includes(
        getNativeEventName(splitName[0]) as NativeEvents
      )
    );
  }

  addEventListener(element: HTMLElement, eventName: string, handler): Function {
    const nativeEventName = getNativeEventName(eventName);
    const zone = this.manager.getZone();

    zone.runOutsideAngular(() => {
      this.manager.addEventListener(element, nativeEventName, handler);
    });

    return () => {
      element.removeEventListener(nativeEventName, handler);
    };
  }

  addGlobalEventListener(target: string, eventName: string, handler) {
    const nativeEventName = getNativeEventName(eventName);
    const targetEl = getDocElement(target);
    const zone = this.manager.getZone();

    zone.runOutsideAngular(() => {
      targetEl.addEventListener(nativeEventName, handler);
    });

    return () => {
      targetEl.removeEventListener(nativeEventName, handler);
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class MultiEventPlugin {
  manager: EventManager;

  supports(eventName: string): boolean {
    return getNativeEventsArray(eventName).length > 1;
  }

  addEventListener(element: HTMLElement, eventName: string, handler) {
    const eventsArray = getEventsArray(eventName);

    eventsArray.forEach((singleEventName: string) => {
      this.manager.addEventListener(element, singleEventName, handler);
    });

    return () => {
      eventsArray.forEach((singleEventName: string) => {
        element.removeEventListener(
          getNativeEventName(singleEventName),
          handler
        );
      });
    };
  }

  addGlobalEventListener(target: string, eventName: string, handler) {
    const eventsArray = getEventsArray(eventName);
    const targetEl = getDocElement(target);

    eventsArray.forEach((singleEventName: string) => {
      this.manager.addGlobalEventListener(target, singleEventName, handler);
    });

    return () => {
      eventsArray.forEach((singleEventName: string) => {
        targetEl.removeEventListener(
          getNativeEventName(singleEventName),
          handler
        );
      });
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class StopPropEventPlugin {
  supports(eventName: string): boolean {
    return eventName.endsWith('stop');
  }

  addEventListener(
    element: HTMLElement,
    eventName: string,
    originalHandler: Function
  ): Function {
    const [nativeEventName] = eventName.split('.');
    const enhancedHandler = (event: Event) => {
      event.stopPropagation();
      originalHandler(event);
    };

    element.addEventListener(nativeEventName, enhancedHandler);

    return () => element.removeEventListener(nativeEventName, enhancedHandler);
  }
}

export const EventManagerPlugins = [
  {
    multi: true,
    provide: EVENT_MANAGER_PLUGINS,
    useClass: OutsideZonePlugin,
  },
  {
    multi: true,
    provide: EVENT_MANAGER_PLUGINS,
    useClass: MultiEventPlugin,
  },
  {
    multi: true,
    provide: EVENT_MANAGER_PLUGINS,
    useClass: StopPropEventPlugin,
  },
];
