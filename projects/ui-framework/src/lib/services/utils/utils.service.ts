import { Injectable } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { WindowRef } from './window-ref.service';

@Injectable()
export class UtilsService {
  constructor(public windowRef: WindowRef) {}

  public getResizeEvent(): Observable<any> {
    return fromEvent(this.windowRef.nativeWindow, 'resize').pipe(debounceTime(500));
  }
}
