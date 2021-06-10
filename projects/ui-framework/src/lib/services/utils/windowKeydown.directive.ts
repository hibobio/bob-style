import { Subscription } from 'rxjs';

import {
  Directive,
  EventEmitter,
  NgModule,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Keys } from '../../enums';
import { DOMKeyboardEvent } from '../../types';
import { unsubscribeArray } from './functional-utils';
import { filterKey, insideZone } from './rxjs.operators';
import { UtilsService } from './utils.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[win.keydown.enter], [win.keydown.escape]',
})
export class WindowKeydownDirective implements OnInit, OnDestroy {
  constructor(private utilsService: UtilsService, private zone: NgZone) {}

  @Output('win.keydown.enter')
  enterPressed: EventEmitter<DOMKeyboardEvent> = new EventEmitter();
  @Output('win.keydown.escape')
  escapePressed: EventEmitter<DOMKeyboardEvent> = new EventEmitter();

  private readonly subs: Subscription[] = [];

  ngOnInit() {
    this.subs.push(
      this.utilsService
        .getWindowKeydownEvent(true)
        .pipe(filterKey(Keys.enter), insideZone(this.zone))
        .subscribe(this.enterPressed),

      this.utilsService
        .getWindowKeydownEvent(true)
        .pipe(filterKey(Keys.escape), insideZone(this.zone))
        .subscribe(this.escapePressed)
    );
  }

  ngOnDestroy() {
    unsubscribeArray(this.subs);
  }
}

@NgModule({
  declarations: [WindowKeydownDirective],
  exports: [WindowKeydownDirective],
})
export class WindowKeydownModule {}
