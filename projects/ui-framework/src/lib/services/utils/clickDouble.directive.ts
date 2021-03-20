import { fromEvent, Subscription } from 'rxjs';
import { bufferCount, filter, map } from 'rxjs/operators';

import { Directive, ElementRef, EventEmitter, Input, NgModule, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

import { insideZone } from './rxjs.operators';
import { UtilsService } from './utils.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[click.double]',
})
export class DoubleClickDirective implements OnInit, OnDestroy {
  constructor(private hostElRef: ElementRef, private utilsService: UtilsService, private zone: NgZone) {}

  @Output('click.double') clicked = new EventEmitter<MouseEvent>();

  @Input() timeSpan: number;
  @Input() swallow = false;

  private sub: Subscription;

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.sub = fromEvent<MouseEvent>(this.hostElRef.nativeElement, 'click', {
        capture: true,
      })
        .pipe(
          map((event) => {
            if (this.swallow) {
              event.preventDefault();
              event.stopPropagation();
            }
            return { event, ts: new Date().getTime() };
          }),
          bufferCount(2, 1),
          filter((events) => {
            return events[0].ts > new Date().getTime() - (this.timeSpan || 500);
          }),
          map((clickArray) => {
            clickArray[1].event.preventDefault();
            clickArray[1].event.stopPropagation();
            return clickArray[1].event;
          }),
          insideZone(this.zone)
        )
        .subscribe(this.clicked);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}

@NgModule({
  declarations: [DoubleClickDirective],
  exports: [DoubleClickDirective],
})
export class DoubleClickModule {}
