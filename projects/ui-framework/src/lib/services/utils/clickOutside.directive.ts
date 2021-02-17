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
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { getEventPath } from './functional-utils';
import { insideZone } from './rxjs.operators';
import { UtilsService } from './utils.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[click.outside]',
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  constructor(
    private hostElRef: ElementRef,
    private utilsService: UtilsService,
    private zone: NgZone
  ) {}

  @Output('click.outside') clicked = new EventEmitter<MouseEvent>();

  private sub: Subscription;

  ngOnInit() {
    this.sub = this.utilsService
      .getWindowClickEvent(true)
      .pipe(
        filter((event: MouseEvent) => {
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
