import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import {
  Directive,
  ElementRef,
  EventEmitter,
  NgModule,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { DOMMouseEvent } from '../../types';
import { getEventPath } from './functional-utils';
import { insideZone } from './rxjs.operators';
import { UtilsService } from './utils.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[click.outside]',
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  constructor(
    private hostElRef: ElementRef<HTMLElement>,
    private utilsService: UtilsService,
    private zone: NgZone
  ) {}

  @Output('click.outside')
  clicked: EventEmitter<DOMMouseEvent> = new EventEmitter();

  private sub: Subscription;

  ngOnInit() {
    this.sub = this.utilsService
      .getWindowClickEvent(true)
      .pipe(
        filter((event: DOMMouseEvent) => {
          return !getEventPath(event).includes(this.hostElRef.nativeElement);
        }),
        insideZone(this.zone)
      )
      .subscribe(this.clicked);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}

@NgModule({
  declarations: [ClickOutsideDirective],
  exports: [ClickOutsideDirective],
})
export class ClickOutsideModule {}
