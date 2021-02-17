import {
  Directive,
  OnInit,
  Input,
  NgModule,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IntersectionObservableConfig,
  INTERSECTION_OBSERVABLE_CONFIG_DEF,
  MutationObservableService,
} from './mutation-observable';
import { Subscription } from 'rxjs';
import { pass } from './functional-utils';
import { delay, map } from 'rxjs/operators';
import { insideZone } from './rxjs.operators';

export const IN_VIEW_DIR_CONFIG_DEF: IntersectionObservableConfig = {
  ...INTERSECTION_OBSERVABLE_CONFIG_DEF,
  threshold: 0.25,
};

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[inView]',
})
export class InViewDirective implements OnInit, OnDestroy {
  constructor(
    private hostRef: ElementRef,
    private mutationObservableService: MutationObservableService,
    private zone: NgZone
  ) {}

  // tslint:disable-next-line: no-input-rename
  @Input('inViewConfig') config: IntersectionObservableConfig;

  @Output('inView') isInView: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  private inViewSub: Subscription;

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.inViewSub = this.mutationObservableService
        .getIntersectionObservable(
          this.hostRef.nativeElement,
          this.config || IN_VIEW_DIR_CONFIG_DEF
        )
        .pipe(
          this.config?.delayEmit > 0 ? delay(this.config.delayEmit) : pass,
          map((entry) => entry.isIntersecting),
          insideZone(this.zone)
        )
        .subscribe(this.isInView);
    });
  }

  ngOnDestroy(): void {
    this.inViewSub?.unsubscribe();
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [InViewDirective],
  exports: [InViewDirective],
  providers: [],
})
export class InViewModule {}
