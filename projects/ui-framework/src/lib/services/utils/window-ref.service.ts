import { Injectable } from '@angular/core';

export interface WindowLike extends Partial<Window> {
  [key: string]: any;
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
}
