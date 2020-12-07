import { Injectable } from '@angular/core';

export interface ResizeObserverEntry {
  readonly borderBoxSize: {
    blockSize: number;
    inlineSize: number;
  };
  readonly contentBoxSize: {
    blockSize: number;
    inlineSize: number;
  };
  readonly contentRect: DOMRectReadOnly;
  readonly target: Element;
}

declare class ResizeObserver {
  constructor(
    callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void
  );
  disconnect: () => void;
  observe: (
    target: Element,
    options?: {
      box?: 'content-box' | 'border-box';
    }
  ) => void;
  unobserve: (target: Element) => void;
}

export interface ResizeObserverInstance {
  disconnect: () => void;
  observe: (
    target: Element,
    options?: {
      box?: 'content-box' | 'border-box';
    }
  ) => void;
  unobserve: (target: Element) => void;
}

export interface WindowLike extends Partial<Window> {
  [key: string]: any;
  MutationObserver?: typeof MutationObserver;
  ResizeObserver?: typeof ResizeObserver;
  IntersectionObserver?: typeof IntersectionObserver;
}

function _window(): Window {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root',
})
export class WindowRef {
  get nativeWindow(): WindowLike {
    return _window();
  }
  isEmbedMode() {
    return this.nativeWindow.parent !== _window();
  }
}
