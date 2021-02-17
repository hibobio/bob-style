import {
  Directive,
  EventEmitter,
  NgModule,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Keys } from '../../enums';
import { unsubscribeArray } from './functional-utils';
import { filterKey, insideZone } from './rxjs.operators';
import { UtilsService } from './utils.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[win.keydown.enter], [win.keydown.escape]',
})
export class WindowKeydownDirective implements OnInit, OnDestroy {
  constructor(private utilsService: UtilsService, private zone: NgZone) {}

  @Output('win.keydown.enter') enterPressed = new EventEmitter<KeyboardEvent>();
  @Output('win.keydown.escape') escapePressed = new EventEmitter<
    KeyboardEvent
  >();

  private subs: Subscription[] = [];

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
