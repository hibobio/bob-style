import {
  Directive,
  OnInit,
  Input,
  NgModule,
  ElementRef,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IntersectionObservableConfig,
  IntersectionObserverableEntry,
  INTERSECTION_OBSERVABLE_CONFIG_DEF,
  MutationObservableService,
} from './mutation-observable';
import { Subscription } from 'rxjs';
import { isFunction, pass } from './functional-utils';
import { delay } from 'rxjs/operators';

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
    private mutationObservableService: MutationObservableService
  ) {}

  @Input('inView') onInView: (
    elmnt?: HTMLElement,
    entry?: IntersectionObserverableEntry
  ) => any;

  // tslint:disable-next-line: no-input-rename
  @Input('outOfView') onOutOfView: (
    elmnt?: HTMLElement,
    entry?: IntersectionObserverableEntry
  ) => any;

  // tslint:disable-next-line: no-input-rename
  @Input('inViewConfig') config: IntersectionObservableConfig;

  @Output() isInView: EventEmitter<boolean> = new EventEmitter<boolean>();

  private inViewSub: Subscription;

  ngOnInit(): void {
    this.inViewSub = this.mutationObservableService
      .getIntersectionObservable(
        this.hostRef.nativeElement,
        this.config || IN_VIEW_DIR_CONFIG_DEF
      )
      .pipe(this.config?.delayEmit > 0 ? delay(this.config.delayEmit) : pass)
      .subscribe((entry) => {
        this.isInView.emit(entry.isIntersecting);
        if (entry.isIntersecting && isFunction(this.onInView)) {
          this.onInView(this.hostRef.nativeElement, entry);
        }
        if (!entry.isIntersecting && isFunction(this.onOutOfView)) {
          this.onOutOfView(this.hostRef.nativeElement, entry);
        }
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
